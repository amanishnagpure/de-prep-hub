/** Shared SQL multi-fixture judge core — used by regression tests (mirrors TS engine) */

const DEFAULT_COMPARISON = {
  schema: true,
  columnOrder: false,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const DEFAULT_LIMITS = {
  timeLimitMs: 15000,
  maxInputRows: 5000,
  maxOutputRows: 10000,
  maxFixtureCount: 8,
};

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function schemaForTable(tableName, schemas) {
  const match = schemas.find((t) => t.label.toLowerCase() === tableName.toLowerCase());
  if (match?.columns?.length) {
    return match.columns.map((c) => ({ name: c.name, type: c.type }));
  }
  return [];
}

function inferColumnsFromRows(rows) {
  if (rows.length === 0) return [];
  return Object.keys(rows[0]).map((name) => {
    const val = rows[0][name];
    let type = "TEXT";
    if (typeof val === "number" && Number.isFinite(val)) type = Number.isInteger(val) ? "INT" : "REAL";
    return { name, type };
  });
}

export function fixtureToInitSql(fixture, tableSchemas) {
  if (fixture.initSql?.trim()) return fixture.initSql.trim();

  const statements = [];
  for (const [tableName, rows] of Object.entries(fixture.tables)) {
    const schemaCols = schemaForTable(tableName, tableSchemas);
    const columns = schemaCols.length > 0 ? schemaCols : inferColumnsFromRows(rows);
    const colDefs = columns.length
      ? columns.map((c) => `${c.name} ${c.type}`).join(", ")
      : "placeholder TEXT";
    statements.push(`CREATE TABLE ${tableName} (${colDefs});`);
    if (rows.length > 0) {
      const colNames = columns.map((c) => c.name);
      const values = rows
        .map((row) => `(${colNames.map((col) => sqlLiteral(row[col])).join(", ")})`)
        .join(", ");
      statements.push(`INSERT INTO ${tableName} (${colNames.join(", ")}) VALUES ${values};`);
    }
  }
  return statements.join("\n");
}

function normalizeCell(value) {
  if (value === null || value === undefined) return "NULL";
  return String(value);
}

function rowKey(columns, row) {
  return columns.map((col, i) => `${col}:${normalizeCell(row[i])}`).join("|");
}

function sortRows(columns, rows) {
  return [...rows].sort((a, b) => rowKey(columns, a).localeCompare(rowKey(columns, b)));
}

function reorderColumns(sourceCols, rows, targetCols, ignoreCase) {
  const indexMap = targetCols.map((target) =>
    sourceCols.findIndex((c) => (ignoreCase ? c.toLowerCase() === target.toLowerCase() : c === target))
  );
  if (indexMap.some((i) => i < 0)) return rows;
  return rows.map((row) => indexMap.map((i) => row[i]));
}

export function compareSqlResults(expected, actual, comparison = {}) {
  const cfg = { ...DEFAULT_COMPARISON, ...comparison };
  const ignoreCase = cfg.ignoreColumnCase ?? true;
  let expCols = [...expected.columns];
  let actCols = [...actual.columns];
  let expRows = expected.rows.map((r) => [...r]);
  let actRows = actual.rows.map((r) => [...r]);
  const expNorm = ignoreCase ? expCols.map((c) => c.toLowerCase()) : expCols;
  const actNorm = ignoreCase ? actCols.map((c) => c.toLowerCase()) : actCols;

  if (cfg.columnOrder) {
    if (expNorm.join(",") !== actNorm.join(",")) {
      return { pass: false, feedback: `Column mismatch — expected (${expCols.join(", ")}), got (${actCols.join(", ")}).` };
    }
  } else {
    if ([...expNorm].sort().join(",") !== [...actNorm].sort().join(",")) {
      return { pass: false, feedback: `Column mismatch — expected (${expCols.join(", ")}), got (${actCols.join(", ")}).` };
    }
    actRows = reorderColumns(actCols, actRows, expCols, ignoreCase);
    actCols = [...expCols];
  }

  const expCompare = cfg.rowOrder ? expRows : sortRows(expCols, expRows);
  const actCompare = cfg.rowOrder ? actRows : sortRows(actCols, actRows);

  if (expCompare.length !== actCompare.length) {
    return { pass: false, feedback: `Row count mismatch — expected ${expCompare.length}, got ${actCompare.length}.` };
  }

  for (let i = 0; i < expCompare.length; i += 1) {
    if (rowKey(expCols, expCompare[i]) !== rowKey(actCols, actCompare[i])) {
      return { pass: false, feedback: `Row ${i + 1} differs from the reference result.` };
    }
  }

  return { pass: true, feedback: "Correct result." };
}

function toRunResult(results, maxRows = 200) {
  if (results.length === 0) return { columns: [], rows: [], rowCount: 0 };
  const first = results[0];
  return {
    columns: first.columns,
    rows: first.values.slice(0, maxRows),
    rowCount: first.values.length,
  };
}

function fixtureCaseFields(fixture) {
  return {
    testCaseId: fixture.id,
    input: fixture.label || fixture.id,
    ...(fixture.purpose ? { purpose: fixture.purpose } : {}),
    ...(fixture.tests?.length ? { tests: fixture.tests } : {}),
  };
}

export async function runSqlJudgeCore(SQL, payload) {
  const limits = { ...DEFAULT_LIMITS, ...payload.limits };
  const comparison = { ...DEFAULT_COMPARISON, ...payload.comparison };
  const fixtures =
    payload.mode === "run"
      ? [payload.fixtures.find((f) => !f.isHidden) ?? payload.fixtures[0]].filter(Boolean)
      : payload.fixtures.slice(0, limits.maxFixtureCount);

  const started = Date.now();
  let passed = 0;
  const cases = [];

  for (const fixture of fixtures) {
    if (Date.now() - started > limits.timeLimitMs) {
      cases.push({ ...fixtureCaseFields(fixture), pass: false, error: "Time limit exceeded" });
      continue;
    }

    const initSql = fixtureToInitSql(fixture, payload.tableSchemas);
    const db = new SQL.Database();
    try {
      db.run(initSql);
    } catch (err) {
      cases.push({ ...fixtureCaseFields(fixture), pass: false, error: err.message });
      db.close();
      continue;
    }

    if (payload.mode === "run") {
      try {
        const userRun = toRunResult(db.exec(payload.userQuery.trim()));
        passed += 1;
        cases.push({ ...fixtureCaseFields(fixture), pass: true });
      } catch (err) {
        cases.push({ ...fixtureCaseFields(fixture), pass: false, error: err.message });
      }
      db.close();
      continue;
    }

    let referenceRun;
    let userRun;
    try {
      referenceRun = toRunResult(db.exec(payload.referenceQuery.trim()));
      userRun = toRunResult(db.exec(payload.userQuery.trim()));
    } catch (err) {
      cases.push({ ...fixtureCaseFields(fixture), pass: false, error: err.message });
      db.close();
      continue;
    }
    db.close();

    const compare = compareSqlResults(referenceRun, userRun, comparison);
    if (compare.pass) passed += 1;
    cases.push({
      ...fixtureCaseFields(fixture),
      pass: compare.pass,
      error: compare.pass ? undefined : compare.feedback,
    });
  }

  const total = cases.length;
  const isComparisonFeedback = (error) =>
    typeof error === "string" &&
    (error.startsWith("Column mismatch") ||
      error.startsWith("Row count mismatch") ||
      /^Row \d+ differs/.test(error));
  const hasExecutionError = cases.some((c) => c.error && !isComparisonFeedback(c.error));

  let status = "wrong_answer";
  if (passed === total && total > 0) status = "accepted";
  else if (cases.some((c) => c.error?.includes("Time"))) status = "time_limit_exceeded";
  else if (passed === 0 && hasExecutionError) status = "runtime_error";

  return { status, passed, total, cases };
}

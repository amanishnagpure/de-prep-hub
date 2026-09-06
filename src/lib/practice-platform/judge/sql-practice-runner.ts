import type { Database, SqlValue } from "sql.js";
import type { SqlRunError, SqlRunResult } from "@/lib/sql-runner";
import { getDeCodeSqlSeed } from "@/data/de-code/sql-seeds";
import { getSqlPracticeSeed } from "@/data/sql-practice-problem-seeds";
import { validateSqlQuery } from "@/lib/practice-platform/judge/sql-query-guard";

function resolveSeed(slug: string) {
  return getDeCodeSqlSeed(slug) ?? getSqlPracticeSeed(slug);
}

const MAX_ROWS = 200;

let sqlModulePromise: ReturnType<typeof import("sql.js")["default"]> | null = null;

async function getSqlModule() {
  if (!sqlModulePromise) {
    const initSqlJs = (await import("sql.js")).default;
    sqlModulePromise = initSqlJs({
      locateFile: (file) => {
        if (typeof window !== "undefined") return `/wasm/${file}`;
        return `${process.cwd()}/node_modules/sql.js/dist/${file}`;
      },
    });
  }
  return sqlModulePromise;
}

function toRunResult(results: { columns: string[]; values: SqlValue[][] }[]): SqlRunResult {
  if (results.length === 0) {
    return { columns: [], rows: [], rowCount: 0, truncated: false };
  }
  const first = results[0];
  const rows = first.values.slice(0, MAX_ROWS);
  return {
    columns: first.columns,
    rows,
    rowCount: first.values.length,
    truncated: first.values.length > MAX_ROWS,
  };
}

function createDatabase(initSql: string): Promise<Database> {
  return getSqlModule().then((SQL) => {
    const db = new SQL.Database();
    db.run(initSql);
    return db;
  });
}

function validateQuery(query: string, allowMutations: boolean): string | null {
  return validateSqlQuery(query, allowMutations);
}

export async function runPracticeQuery(
  slug: string,
  query: string
): Promise<SqlRunResult | SqlRunError> {
  const seed = resolveSeed(slug);
  if (!seed) {
    return {
      error: "No database seed for this problem yet — submit compares query structure only.",
    };
  }

  const validationError = validateQuery(query, Boolean(seed.allowMutations));
  if (validationError) return { error: validationError };

  try {
    const db = await createDatabase(seed.init);
    const results = db.exec(query.trim());
    db.close();
    return toRunResult(results);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Query failed.",
    };
  }
}

export async function runPracticeReference(slug: string): Promise<SqlRunResult | SqlRunError> {
  const seed = resolveSeed(slug);
  if (!seed) return { error: "Missing reference seed." };

  try {
    const db = await createDatabase(seed.init);
    const results = db.exec(seed.referenceQuery.trim());
    db.close();
    return toRunResult(results);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Reference query failed.",
    };
  }
}

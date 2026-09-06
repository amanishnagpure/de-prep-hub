import type { SqlValue } from "sql.js";
import type { SqlRunError, SqlRunResult } from "@/lib/sql-runner";
import {
  DEFAULT_COMPARISON,
  DEFAULT_LIMITS,
  type JudgeResult,
  type JudgeTestCaseResult,
} from "@/lib/judge/types";
import type { SqlJudgePayload, SqlFixture } from "@/lib/de-code/sql-seed-types";
import { sanitizeCaseForClient } from "@/lib/judge/sanitize-verdict";
import {
  countFixtureInputRows,
  fixtureToInitSql,
} from "@/lib/practice-platform/judge/sql-fixture-ddl";
import {
  compareSqlResults,
  previewResult,
} from "@/lib/practice-platform/judge/sql-result-compare";
import { validateSqlQuery } from "@/lib/practice-platform/judge/sql-query-guard";

const MAX_ROWS = 200;

function fixtureEvalMeta(
  fixture: SqlFixture
): Pick<JudgeTestCaseResult, "purpose" | "tests" | "isHidden"> {
  const meta: Pick<JudgeTestCaseResult, "purpose" | "tests" | "isHidden"> = {
    isHidden: fixture.isHidden,
  };
  if (fixture.purpose) meta.purpose = fixture.purpose;
  if (fixture.tests?.length) meta.tests = fixture.tests;
  return meta;
}

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

function validateQuery(query: string, allowMutations: boolean): string | null {
  return validateSqlQuery(query, allowMutations, "judge");
}

async function execOnInit(initSql: string, query: string): Promise<SqlRunResult | SqlRunError> {
  try {
    const SQL = await getSqlModule();
    const db = new SQL.Database();
    db.run(initSql);
    const results = db.exec(query.trim());
    db.close();
    return toRunResult(results);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Query failed.",
    };
  }
}

function selectFixtures(payload: SqlJudgePayload) {
  const limits = { ...DEFAULT_LIMITS, ...payload.limits };
  const maxCount = limits.maxFixtureCount ?? DEFAULT_LIMITS.maxFixtureCount;

  if (payload.mode === "run") {
    const publicFixture =
      payload.fixtures.find((f) => !f.isHidden) ?? payload.fixtures[0];
    return publicFixture ? [publicFixture] : [];
  }

  return payload.fixtures.slice(0, maxCount);
}

function mapStatus(
  passed: number,
  total: number,
  timedOut: boolean,
  runtimeError: boolean
): JudgeResult["status"] {
  if (timedOut) return "time_limit_exceeded";
  if (runtimeError && passed === 0) return "runtime_error";
  if (passed === total && total > 0) return "accepted";
  return "wrong_answer";
}

export async function runSqlMultiFixtureJudge(payload: SqlJudgePayload): Promise<JudgeResult> {
  const trimmed = payload.userQuery.trim();
  const validationError = validateQuery(trimmed, Boolean(payload.allowMutations));
  if (validationError) {
    return {
      status: "compilation_error",
      passed: 0,
      total: 0,
      cases: [],
      message: validationError,
    };
  }

  const comparison = { ...DEFAULT_COMPARISON, ...payload.comparison };
  const limits = { ...DEFAULT_LIMITS, ...payload.limits };
  const fixtures = selectFixtures(payload);

  if (fixtures.length === 0) {
    return {
      status: "runtime_error",
      passed: 0,
      total: 0,
      cases: [],
      message: "No fixtures configured for this problem.",
    };
  }

  const started = Date.now();
  const cases: JudgeTestCaseResult[] = [];
  let passed = 0;
  let runtimeError = false;
  let timedOut = false;

  for (const fixture of fixtures) {
    if (Date.now() - started > (limits.timeLimitMs ?? DEFAULT_LIMITS.timeLimitMs)) {
      timedOut = true;
      cases.push({
        testCaseId: fixture.id,
        pass: false,
        input: fixture.label ?? fixture.id,
        expectedOutput: "Within time limit",
        error: "Time limit exceeded",
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const inputRows = countFixtureInputRows(fixture);
    if (inputRows > (limits.maxInputRows ?? DEFAULT_LIMITS.maxInputRows)) {
      cases.push({
        testCaseId: fixture.id,
        pass: false,
        input: fixture.label ?? fixture.id,
        expectedOutput: "Within input row limit",
        error: `Fixture exceeds maxInputRows (${inputRows}).`,
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const initSql = fixtureToInitSql(fixture, payload.tableSchemas);
    const fixtureStart = Date.now();

    if (payload.mode === "run") {
      const userRun = await execOnInit(initSql, trimmed);
      if ("error" in userRun) {
        runtimeError = true;
        cases.push({
          testCaseId: fixture.id,
          pass: false,
          input: fixture.label ?? fixture.id,
          expectedOutput: "Valid query on public dataset",
          error: userRun.error,
          runtimeMs: Date.now() - fixtureStart,
          metrics: { inputRows, outputRows: 0 },
          ...fixtureEvalMeta(fixture),
        });
        continue;
      }

      passed += 1;
      cases.push({
        testCaseId: fixture.id,
        pass: true,
        input: fixture.label ?? fixture.id,
        expectedOutput: "Sample execution",
        actualOutput: previewResult(userRun),
        runtimeMs: Date.now() - fixtureStart,
        metrics: { inputRows, outputRows: userRun.rowCount },
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const referenceRun = await execOnInit(initSql, payload.referenceQuery);
    if ("error" in referenceRun) {
      runtimeError = true;
      cases.push({
        testCaseId: fixture.id,
        pass: false,
        input: fixture.label ?? fixture.id,
        expectedOutput: "Reference query runs",
        error: referenceRun.error,
        runtimeMs: Date.now() - fixtureStart,
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const userRun = await execOnInit(initSql, trimmed);
    if ("error" in userRun) {
      runtimeError = true;
      cases.push({
        testCaseId: fixture.id,
        pass: false,
        input: fixture.label ?? fixture.id,
        expectedOutput: previewResult(referenceRun),
        error: userRun.error,
        runtimeMs: Date.now() - fixtureStart,
        metrics: { inputRows, expectedOutputRows: referenceRun.rowCount },
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const maxOut = limits.maxOutputRows ?? DEFAULT_LIMITS.maxOutputRows;
    if (referenceRun.rowCount > maxOut || userRun.rowCount > maxOut) {
      cases.push({
        testCaseId: fixture.id,
        pass: false,
        input: fixture.label ?? fixture.id,
        expectedOutput: previewResult(referenceRun),
        actualOutput: previewResult(userRun),
        error: `Output exceeds maxOutputRows (${maxOut}).`,
        runtimeMs: Date.now() - fixtureStart,
        ...fixtureEvalMeta(fixture),
      });
      continue;
    }

    const compare = compareSqlResults(referenceRun, userRun, comparison);
    if (compare.pass) passed += 1;

    cases.push({
      testCaseId: fixture.id,
      pass: compare.pass,
      input: fixture.label ?? fixture.id,
      expectedOutput: compare.expectedPreview ?? previewResult(referenceRun),
      actualOutput: compare.actualPreview ?? previewResult(userRun),
      error: compare.pass ? undefined : compare.feedback,
      runtimeMs: Date.now() - fixtureStart,
      metrics: {
        inputRows,
        outputRows: userRun.rowCount,
        expectedOutputRows: referenceRun.rowCount,
      },
      ...fixtureEvalMeta(fixture),
    });
  }

  const total = cases.length;
  const status = mapStatus(passed, total, timedOut, runtimeError);
  const runtimeMs = Date.now() - started;

  let message: string | undefined;
  if (payload.mode === "run") {
    message =
      status === "accepted"
        ? `Query OK on public dataset. Submit to run ${payload.fixtures.filter((f) => f.isHidden).length} hidden test(s).`
        : cases.find((c) => c.error)?.error;
  } else if (status === "accepted") {
    message = `All ${passed} fixture(s) passed.`;
  } else {
    message = cases.find((c) => !c.pass)?.error ?? cases.find((c) => c.error)?.error;
  }

  return {
    status,
    passed,
    total,
    cases: cases.map((c) => sanitizeCaseForClient(c) as JudgeTestCaseResult),
    message,
    metrics: { runtimeMs },
  };
}

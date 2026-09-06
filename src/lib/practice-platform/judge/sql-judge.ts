import { compareSql } from "@/lib/sql-compare";
import { hasSqlMultiFixtureSeed, getSqlMultiFixtureSeed } from "@/data/de-code/sql-multi-fixtures";
import { hasSqlPracticeSeed, getSqlPracticeSeed } from "@/data/sql-practice-problem-seeds";
import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { runSqlMultiFixtureJudge } from "@/lib/practice-platform/judge/sql-multi-fixture-judge";

export async function runSqlJudge(
  problem: PlatformProblem,
  code: string,
  mode: "run" | "submit"
): Promise<JudgeVerdict> {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      status: "compilation_error",
      passed: 0,
      total: 0,
      cases: [],
      message: "Write a SQL query first.",
    };
  }

  if (hasSqlMultiFixtureSeed(problem.slug)) {
    const seed = getSqlMultiFixtureSeed(problem.slug)!;
    const result = await runSqlMultiFixtureJudge({
      userQuery: trimmed,
      referenceQuery: seed.referenceQuery,
      fixtures: seed.fixtures,
      mode,
      tableSchemas: seed.tables,
      allowMutations: seed.allowMutations,
      comparison: seed.comparison,
      limits: seed.limits,
    });
    return result as JudgeVerdict;
  }

  if (hasSqlPracticeSeed(problem.slug)) {
    const seed = getSqlPracticeSeed(problem.slug)!;
    const result = await runSqlMultiFixtureJudge({
      userQuery: trimmed,
      referenceQuery: seed.referenceQuery,
      fixtures: [
        { id: "public", label: "Public dataset", isHidden: false, initSql: seed.init },
      ],
      mode,
      tableSchemas: seed.tables,
      allowMutations: seed.allowMutations,
    });
    return result as JudgeVerdict;
  }

  return runFallbackJudge(trimmed, problem, mode);
}

async function runFallbackJudge(
  code: string,
  problem: PlatformProblem,
  mode: "run" | "submit"
): Promise<JudgeVerdict> {
  if (mode === "run") {
    return {
      status: "accepted",
      passed: 1,
      total: 1,
      cases: [
        {
          testCaseId: "run",
          pass: true,
          input: code.slice(0, 120),
          expectedOutput: "No seed DB — syntax check only",
          actualOutput: "Query saved",
        },
      ],
      message: "No problem database yet — submit compares query structure.",
    };
  }

  const compare = compareSql(code, problem.solution, "mysql");
  const pass = compare.match || compare.similarity >= 85;

  return {
    status: pass ? "accepted" : "wrong_answer",
    passed: pass ? 1 : 0,
    total: 1,
    cases: [
      {
        testCaseId: "submit",
        pass,
        input: "Your query",
        expectedOutput: "Reference solution",
        actualOutput: `${compare.similarity}% match — ${compare.feedback}`,
      },
    ],
    message: compare.feedback,
  };
}

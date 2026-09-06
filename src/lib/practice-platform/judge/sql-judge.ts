import { compareSql } from "@/lib/sql-compare";
import { hasDeCodeSqlSeed } from "@/data/de-code/sql-seeds";
import { hasSqlPracticeSeed } from "@/data/sql-practice-problem-seeds";
import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { runPracticeQuery, runPracticeReference } from "@/lib/practice-platform/judge/sql-practice-runner";
import { compareSqlResults, previewResult } from "@/lib/practice-platform/judge/sql-result-compare";

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
      total: 1,
      cases: [],
      message: "Write a SQL query first.",
    };
  }

  if (hasDeCodeSqlSeed(problem.slug) || hasSqlPracticeSeed(problem.slug)) {
    return runSeededJudge(problem, trimmed, mode);
  }

  return runFallbackJudge(trimmed, problem, mode);
}

async function runSeededJudge(
  problem: PlatformProblem,
  code: string,
  mode: "run" | "submit"
): Promise<JudgeVerdict> {
  const userRun = await runPracticeQuery(problem.slug, code);
  if ("error" in userRun) {
    return {
      status: "runtime_error",
      passed: 0,
      total: 1,
      cases: [
        {
          testCaseId: mode,
          pass: false,
          input: code.slice(0, 120),
          expectedOutput: "Valid query",
          error: userRun.error,
        },
      ],
      message: userRun.error,
    };
  }

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
          expectedOutput: "Sample execution",
          actualOutput: previewResult(userRun),
        },
      ],
      message: `Query OK — ${userRun.rowCount} row(s). Submit to compare with reference result.`,
    };
  }

  const referenceRun = await runPracticeReference(problem.slug);
  if ("error" in referenceRun) {
    return {
      status: "runtime_error",
      passed: 0,
      total: 1,
      cases: [],
      message: referenceRun.error,
    };
  }

  const compare = compareSqlResults(referenceRun, userRun);

  return {
    status: compare.pass ? "accepted" : "wrong_answer",
    passed: compare.pass ? 1 : 0,
    total: 1,
    cases: [
      {
        testCaseId: "submit",
        pass: compare.pass,
        input: "Your query result",
        expectedOutput: compare.expectedPreview ?? previewResult(referenceRun),
        actualOutput: compare.actualPreview ?? previewResult(userRun),
        error: compare.pass ? undefined : compare.feedback,
      },
    ],
    message: compare.feedback,
  };
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

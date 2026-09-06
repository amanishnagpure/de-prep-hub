import { getDeChallengeSeed } from "@/data/de-code/challenge-seeds";
import type {
  ChallengeExecutionLanguage,
  DEChallengeProblem,
} from "@/lib/de-code/challenge-types";
import type { JudgeVerdict } from "@/lib/de-code/types";
import { runPySparkSandbox } from "@/lib/practice-platform/judge/pyspark-runner";
import { runSqlMultiFixtureJudge } from "@/lib/practice-platform/judge/sql-multi-fixture-judge";

function mapPySparkStatus(status: string): JudgeVerdict["status"] {
  switch (status) {
    case "accepted":
      return "accepted";
    case "wrong_answer":
      return "wrong_answer";
    case "time_limit_exceeded":
      return "time_limit_exceeded";
    case "memory_limit_exceeded":
      return "memory_limit_exceeded";
    case "compilation_error":
      return "compilation_error";
    default:
      return "runtime_error";
  }
}

export async function runDeChallengeJudge(
  challenge: DEChallengeProblem,
  code: string,
  mode: "run" | "submit",
  language: ChallengeExecutionLanguage
): Promise<JudgeVerdict> {
  const seed = getDeChallengeSeed(challenge.seedSlug);
  if (!seed) {
    return {
      status: "runtime_error",
      passed: 0,
      total: 0,
      cases: [],
      message: "Challenge seed data not configured.",
    };
  }

  if (language === "sql") {
    const sqlSeed = seed.sql;
    const result = await runSqlMultiFixtureJudge({
      userQuery: code,
      referenceQuery: sqlSeed.referenceQuery,
      fixtures: sqlSeed.fixtures,
      mode,
      tableSchemas: sqlSeed.tables,
      comparison: sqlSeed.comparison,
      limits: sqlSeed.limits,
    });
    return result as JudgeVerdict;
  }

  if (language === "pyspark") {
    const pySeed = seed.pyspark;
    const response = await runPySparkSandbox({
      userCode: code,
      referenceCode: pySeed.referenceCode,
      resultVar: seed.resultVar,
      fixtures: pySeed.fixtures,
      comparison: pySeed.comparison,
      limits: {
        ...pySeed.limits,
        timeLimitMs: pySeed.limits.timeLimitMs ?? challenge.timeLimitMs,
      },
      mode,
      timeLimitMs: pySeed.limits.timeLimitMs ?? challenge.timeLimitMs,
    });

    if (response.pysparkAvailable === false) {
      return {
        status: "runtime_error",
        passed: 0,
        total: 0,
        cases: [],
        message:
          response.message ??
          "PySpark sandbox unavailable. Install: pip install -r requirements-judge.txt",
      };
    }

    return {
      status: mapPySparkStatus(response.status),
      passed: response.passed,
      total: response.total,
    cases: response.cases.map((c) => ({
      testCaseId: c.testCaseId,
      pass: c.pass,
      input: c.input,
      expectedOutput: c.expectedOutput,
      actualOutput: c.actualOutput,
      error: c.error,
      purpose: c.purpose,
      tests: c.tests,
      isHidden: c.isHidden,
      runtimeMs: c.runtimeMs,
      metrics: c.metrics,
    })),
      message: response.message,
      runtimeMs: response.runtimeMs,
      metrics: response.metrics,
    };
  }

  return {
    status: "compilation_error",
    passed: 0,
    total: 0,
    cases: [],
    message: `${language} execution is not supported for this challenge yet.`,
  };
}

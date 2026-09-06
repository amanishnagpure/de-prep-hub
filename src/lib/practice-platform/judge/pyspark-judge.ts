import { getPySparkSeed, hasPySparkSeed } from "@/data/de-code/pyspark-seeds";
import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { runCompareJudge } from "@/lib/practice-platform/judge/compare-judge";
import { isPySparkJudgeEnabled, runPySparkSandbox } from "@/lib/practice-platform/judge/pyspark-runner";

function mapStatus(status: string): JudgeVerdict["status"] {
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

export async function runPySparkJudge(
  problem: PlatformProblem,
  code: string,
  mode: "run" | "submit"
): Promise<JudgeVerdict> {
  if (!isPySparkJudgeEnabled() || !hasPySparkSeed(problem.slug)) {
    return runCompareJudge(problem, code);
  }

  const seed = getPySparkSeed(problem.slug)!;
  const response = await runPySparkSandbox({
    userCode: code,
    referenceCode: seed.referenceCode,
    resultVar: seed.resultVar,
    fixtures: seed.fixtures,
    comparison: seed.comparison,
    limits: {
      ...seed.limits,
      timeLimitMs: seed.limits?.timeLimitMs ?? problem.timeLimitMs ?? 15000,
    },
    mode,
    timeLimitMs: seed.limits?.timeLimitMs ?? problem.timeLimitMs ?? 15000,
  });

  if (response.pysparkAvailable === false) {
    return {
      ...((await runCompareJudge(problem, code)) as JudgeVerdict),
      message:
        response.message ??
        "PySpark sandbox unavailable — using pattern compare. Install: pip install -r requirements-judge.txt",
    };
  }

  return {
    status: mapStatus(response.status),
    passed: response.passed,
    total: response.total,
    cases: response.cases.map((c) => ({
      testCaseId: c.testCaseId,
      pass: c.pass,
      input: c.input,
      expectedOutput: c.expectedOutput,
      actualOutput: c.actualOutput,
      error: c.error,
      purpose: (c as { purpose?: string }).purpose,
      tests: (c as { tests?: string[] }).tests,
      runtimeMs: c.runtimeMs,
    })),
    message: response.message,
    runtimeMs: response.runtimeMs,
    metrics: response.metrics,
  };
}

export { hasPySparkSeed };

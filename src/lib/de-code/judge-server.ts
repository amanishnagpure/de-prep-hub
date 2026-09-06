import type { CodeProblem, JudgeVerdict } from "@/lib/de-code/types";
import type {
  ChallengeExecutionLanguage,
  DEChallengeProblem,
} from "@/lib/de-code/challenge-types";
import { toJudgeProblem, type JudgeMode } from "@/lib/de-code/judge";
import { runDeChallengeJudge } from "@/lib/practice-platform/judge/de-challenge-judge";
import { sanitizeVerdictForClient } from "@/lib/judge/sanitize-verdict";
import { runCompareJudge } from "@/lib/practice-platform/judge/compare-judge";
import { submitViaDmoj } from "@/lib/practice-platform/judge/dmoj-client";
import { runPyodideJudge } from "@/lib/practice-platform/judge/pyodide-judge";
import { runPySparkJudge } from "@/lib/practice-platform/judge/pyspark-judge";
import { runSqlJudge } from "@/lib/practice-platform/judge/sql-judge";

/** Server-only judge — uses PySpark sandbox, SQL seeds, DE challenges, etc. */
export async function judgeCodeSubmissionServer(
  problem: CodeProblem,
  code: string,
  mode: JudgeMode
): Promise<JudgeVerdict> {
  const adapted = toJudgeProblem(problem);
  const remote = await submitViaDmoj(adapted, code, mode);
  if (remote) return remote;

  switch (problem.judge) {
    case "pyodide":
      return runPyodideJudge(adapted, code, mode);
    case "sql":
      return runSqlJudge(adapted, code, mode);
    case "pyspark":
      return runPySparkJudge(adapted, code, mode);
    case "compare":
      return runCompareJudge(adapted, code);
    default:
      return runPyodideJudge(adapted, code, mode);
  }
}

export async function judgeChallengeSubmissionServer(
  challenge: DEChallengeProblem,
  code: string,
  mode: JudgeMode,
  language: ChallengeExecutionLanguage
): Promise<JudgeVerdict> {
  const verdict = await runDeChallengeJudge(challenge, code, mode, language);
  return sanitizeVerdictForClient(verdict);
}

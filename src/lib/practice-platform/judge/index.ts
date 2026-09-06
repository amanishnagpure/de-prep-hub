import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { runCompareJudge } from "@/lib/practice-platform/judge/compare-judge";
import { submitViaDmoj } from "@/lib/practice-platform/judge/dmoj-client";
import { runPyodideJudge } from "@/lib/practice-platform/judge/pyodide-judge";
import { runSqlJudge } from "@/lib/practice-platform/judge/sql-judge";

export type JudgeMode = "run" | "submit";

/**
 * Judge layer — swap backends without changing the UI.
 *
 * Today: client-side Pyodide (Python/DSA), sql.js (SQL), PySpark sandbox (Spark), token compare (fallback).
 * Production: set DMOJ_JUDGE_URL to forward submissions to DMOJ judge-server.
 */
export async function judgeSubmission(
  problem: PlatformProblem,
  code: string,
  mode: JudgeMode
): Promise<JudgeVerdict> {
  const remote = await submitViaDmoj(problem, code, mode);
  if (remote) return remote;

  switch (problem.judge) {
    case "pyodide":
      return runPyodideJudge(problem, code, mode);
    case "sql":
      return runSqlJudge(problem, code, mode);
    case "pyspark":
    case "compare":
      return runCompareJudge(problem, code);
    default:
      return runPyodideJudge(problem, code, mode);
  }
}

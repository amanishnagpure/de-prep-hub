import type { CodeProblem, JudgeVerdict } from "@/lib/de-code/types";
import { runCompareJudge } from "@/lib/practice-platform/judge/compare-judge";
import { submitViaDmoj } from "@/lib/practice-platform/judge/dmoj-client";
import { runPyodideJudge } from "@/lib/practice-platform/judge/pyodide-judge";
import { runSqlJudge } from "@/lib/practice-platform/judge/sql-judge";
import type { PlatformProblem } from "@/lib/practice-platform/types";

export type JudgeMode = "run" | "submit";

/** Adapt CodeProblem → judge-compatible shape (execution layer unchanged). */
export function toJudgeProblem(problem: CodeProblem): PlatformProblem {
  return {
    id: problem.id,
    slug: problem.slug,
    track: problem.track === "pyspark" ? "spark" : problem.track,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty === "expert" ? "hard" : problem.difficulty,
    topics: problem.concepts,
    constraints: problem.constraints,
    examples: problem.examples,
    starterCode: problem.starterCode,
    solution: problem.solution,
    editorial: problem.explanation,
    hints: problem.hints,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: problem.memoryLimitMb,
    judge: problem.judge,
    functionName: problem.functionName,
    testCases: problem.testCases,
    tables: problem.tables,
  };
}

export async function judgeCodeSubmission(
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
    case "compare":
      return runCompareJudge(adapted, code);
    default:
      return runPyodideJudge(adapted, code, mode);
  }
}

export async function judgeFromApi(
  problem: CodeProblem,
  code: string,
  mode: JudgeMode
): Promise<JudgeVerdict> {
  if (problem.judge === "pyodide") {
    return judgeCodeSubmission(problem, code, mode);
  }

  try {
    const res = await fetch("/api/code/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: problem.id, code, mode }),
    });
    if (res.ok) {
      const data = (await res.json()) as JudgeVerdict | { fallback: true };
      if (!("fallback" in data)) return data;
    }
  } catch {
    // local fallback
  }

  return judgeCodeSubmission(problem, code, mode);
}

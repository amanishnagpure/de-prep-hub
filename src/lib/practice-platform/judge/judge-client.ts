import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { judgeSubmission, type JudgeMode } from "@/lib/practice-platform/judge";

type ApiJudgeResponse = JudgeVerdict | { fallback: true; reason?: string };

export async function judgeFromClient(
  problem: PlatformProblem,
  code: string,
  mode: JudgeMode
): Promise<JudgeVerdict> {
  if (problem.judge === "pyodide") {
    return judgeSubmission(problem, code, mode);
  }

  try {
    const res = await fetch("/api/judge/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId: problem.id, code, mode }),
    });

    if (res.ok) {
      const data = (await res.json()) as ApiJudgeResponse;
      if ("fallback" in data) {
        return judgeSubmission(problem, code, mode);
      }
      return data;
    }
  } catch {
    // fall through to local judge
  }

  return judgeSubmission(problem, code, mode);
}

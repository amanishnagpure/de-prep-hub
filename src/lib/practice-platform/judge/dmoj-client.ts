import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";

/**
 * Optional remote judge (DMOJ judge-server or custom worker).
 * Set DMOJ_JUDGE_URL in the environment to enable server-side judging.
 *
 * Expected POST body: { problemId, code, language, mode }
 * Expected response: JudgeVerdict JSON
 */
export async function submitViaDmoj(
  problem: PlatformProblem,
  code: string,
  mode: "run" | "submit"
): Promise<JudgeVerdict | null> {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.DMOJ_JUDGE_URL ?? process.env.NEXT_PUBLIC_DMOJ_JUDGE_URL
      : process.env.NEXT_PUBLIC_DMOJ_JUDGE_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId: problem.id,
        code,
        language: problem.track === "sql" ? "SQL" : "PYPY3",
        mode,
      }),
    });

    if (!res.ok) return null;
    return (await res.json()) as JudgeVerdict;
  } catch {
    return null;
  }
}

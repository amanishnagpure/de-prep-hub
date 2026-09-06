import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";

function normalize(code: string): string {
  return code
    .toLowerCase()
    .replace(/#[^\n]*/g, "")
    .replace(/--[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function runCompareJudge(
  problem: PlatformProblem,
  code: string
): Promise<JudgeVerdict> {
  const user = normalize(code);
  const ref = normalize(problem.solution);

  if (!user) {
    return {
      status: "compilation_error",
      passed: 0,
      total: 1,
      cases: [],
      message: "Write code before submitting.",
    };
  }

  if (user === ref) {
    return {
      status: "accepted",
      passed: 1,
      total: 1,
      cases: [
        {
          testCaseId: "compare",
          pass: true,
          input: "Your code",
          expectedOutput: "Reference",
          actualOutput: "Exact match",
        },
      ],
    };
  }

  const userTokens = user.split(" ");
  const refSet = new Set(ref.split(" "));
  const overlap = userTokens.filter((t) => refSet.has(t)).length;
  const similarity = Math.round((overlap / Math.max(userTokens.length, 1)) * 100);
  const pass = similarity >= 72;

  return {
    status: pass ? "accepted" : "wrong_answer",
    passed: pass ? 1 : 0,
    total: 1,
    cases: [
      {
        testCaseId: "compare",
        pass,
        input: "Your code",
        expectedOutput: "Reference pattern",
        actualOutput: `${similarity}% structural overlap`,
      },
    ],
    message: pass ? "Accepted (reference pattern matched)." : "Wrong Answer — compare with editorial.",
  };
}

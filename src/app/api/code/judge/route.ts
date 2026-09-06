import { NextResponse } from "next/server";
import { getCodeProblemById } from "@/lib/de-code/problem-bank";
import { judgeCodeSubmission, toJudgeProblem } from "@/lib/de-code/judge";
import { submitViaDmoj } from "@/lib/practice-platform/judge/dmoj-client";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    problemId?: string;
    code?: string;
    mode?: "run" | "submit";
  };

  if (!body.problemId || typeof body.code !== "string") {
    return NextResponse.json({ error: "problemId and code required" }, { status: 400 });
  }

  const problem = getCodeProblemById(body.problemId);
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem" }, { status: 404 });
  }

  const mode = body.mode ?? "submit";
  const remote = await submitViaDmoj(toJudgeProblem(problem), body.code, mode);
  if (remote) return NextResponse.json(remote);

  if (problem.judge === "pyodide") {
    return NextResponse.json({ fallback: true, reason: "pyodide" });
  }

  const verdict = await judgeCodeSubmission(problem, body.code, mode);
  return NextResponse.json(verdict);
}

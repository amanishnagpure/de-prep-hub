import { NextResponse } from "next/server";
import { getPlatformProblemById } from "@/lib/practice-platform/problem-bank";
import { judgeSubmission } from "@/lib/practice-platform/judge";
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

  const problem = getPlatformProblemById(body.problemId);
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem" }, { status: 404 });
  }

  const mode = body.mode ?? "submit";

  const remote = await submitViaDmoj(problem, body.code, mode);
  if (remote) return NextResponse.json(remote);

  if (problem.judge === "pyodide") {
    return NextResponse.json({ fallback: true, reason: "pyodide" });
  }

  const verdict = await judgeSubmission(problem, body.code, mode);
  return NextResponse.json(verdict);
}

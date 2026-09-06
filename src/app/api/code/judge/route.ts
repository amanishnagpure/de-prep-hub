import { NextResponse } from "next/server";
import { getChallengeById } from "@/lib/de-code/challenge-bank";
import type { ChallengeExecutionLanguage } from "@/lib/de-code/challenge-types";
import { judgeChallengeSubmissionServer, judgeCodeSubmissionServer } from "@/lib/de-code/judge-server";
import { getCodeProblemById } from "@/lib/de-code/problem-bank";
import {
  JUDGE_REQUEST_LIMITS,
  validateJudgeRequestBody,
} from "@/lib/judge/sanitize-verdict";
import { checkJudgeRateLimit, judgeClientKey } from "@/lib/judge/rate-limit";
import { submitViaDmoj } from "@/lib/practice-platform/judge/dmoj-client";
import { toJudgeProblem } from "@/lib/de-code/judge";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (
    contentLength > 0 &&
    contentLength > JUDGE_REQUEST_LIMITS.maxBodyBytes &&
    process.env.SECURITY_HARDENED === "1"
  ) {
    return NextResponse.json(
      {
        error: `Request body exceeds maximum size (${JUDGE_REQUEST_LIMITS.maxBodyBytes} bytes).`,
      },
      { status: 413 }
    );
  }

  if (process.env.SECURITY_HARDENED === "1") {
    const rate = checkJudgeRateLimit(judgeClientKey(request));
    if (!rate.ok) {
      return NextResponse.json(
        { error: rate.message },
        {
          status: rate.status,
          headers: { "Retry-After": String(rate.retryAfterSec) },
        }
      );
    }
  }

  const body = (await request.json()) as {
    problemId?: string;
    code?: string;
    mode?: "run" | "submit";
    executionLanguage?: ChallengeExecutionLanguage;
  };

  const validation = validateJudgeRequestBody(body);
  if (!validation.ok && process.env.SECURITY_HARDENED === "1") {
    return NextResponse.json({ error: validation.message }, { status: validation.status });
  }

  if (!body.problemId || typeof body.code !== "string") {
    return NextResponse.json({ error: "problemId and code required" }, { status: 400 });
  }

  const mode = body.mode ?? "submit";

  const challenge = getChallengeById(body.problemId);
  if (challenge) {
    const language =
      body.executionLanguage &&
      challenge.executionLanguages.includes(body.executionLanguage)
        ? body.executionLanguage
        : challenge.defaultLanguage;
    const verdict = await judgeChallengeSubmissionServer(
      challenge,
      body.code,
      mode,
      language
    );
    return NextResponse.json(verdict);
  }

  const problem = getCodeProblemById(body.problemId);
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem" }, { status: 404 });
  }

  const remote = await submitViaDmoj(toJudgeProblem(problem), body.code, mode);
  if (remote) return NextResponse.json(remote);

  if (problem.judge === "pyodide") {
    return NextResponse.json({ fallback: true, reason: "pyodide" });
  }

  const verdict = await judgeCodeSubmissionServer(problem, body.code, mode);
  return NextResponse.json(verdict);
}

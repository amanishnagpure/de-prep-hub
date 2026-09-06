/** Strip hidden fixture data from judge responses before they reach the client. */
import type { JudgeCaseResult, JudgeVerdict } from "@/lib/de-code/types";

function looksLikeRowPayload(value?: string): boolean {
  if (!value?.trim()) return false;
  const v = value.trim();
  if (v.startsWith("[") || v.startsWith("{")) return true;
  if (v.includes("row(s):") && v.includes("(")) return true;
  if (v.includes(" — ") && v.includes("row")) return true;
  return false;
}

function isHiddenCase(c: JudgeCaseResult): boolean {
  if (c.isHidden === true) return true;
  return c.testCaseId !== "public" && c.testCaseId !== "run";
}

export function sanitizeCaseForClient(c: JudgeCaseResult): JudgeCaseResult {
  if (!isHiddenCase(c)) return c;

  const sanitized: JudgeCaseResult = { ...c };
  sanitized.expectedOutput = "";
  sanitized.actualOutput = undefined;

  if (sanitized.error && looksLikeRowPayload(sanitized.error)) {
    sanitized.error = "Result differs from reference on this hidden scenario.";
  }

  return sanitized;
}

export function sanitizeVerdictForClient(verdict: JudgeVerdict): JudgeVerdict {
  return {
    ...verdict,
    cases: verdict.cases.map(sanitizeCaseForClient),
  };
}

/** Proposed limits — enforced after P1.15 hardening (PoCs document gaps first). */
export const JUDGE_REQUEST_LIMITS = {
  maxCodeChars: 50_000,
  maxBodyBytes: 512_000,
  maxRequestsPerWindow: 30,
  rateWindowMs: 60_000,
} as const;

export type JudgeRequestValidation =
  | { ok: true }
  | { ok: false; status: 413 | 429; message: string };

export function validateJudgeRequestBody(body: {
  code?: string;
  problemId?: string;
}): JudgeRequestValidation {
  if (!body.problemId || typeof body.code !== "string") {
    return { ok: false, status: 413, message: "problemId and code required" };
  }

  if (body.code.length > JUDGE_REQUEST_LIMITS.maxCodeChars) {
    return {
      ok: false,
      status: 413,
      message: `Code exceeds maximum length (${JUDGE_REQUEST_LIMITS.maxCodeChars} characters).`,
    };
  }

  return { ok: true };
}

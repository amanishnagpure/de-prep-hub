import { JUDGE_REQUEST_LIMITS } from "@/lib/judge/sanitize-verdict";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; status: 429; message: string; retryAfterSec: number };

export function checkJudgeRateLimit(clientKey: string): RateLimitResult {
  const now = Date.now();
  const windowMs = JUDGE_REQUEST_LIMITS.rateWindowMs;
  const max = JUDGE_REQUEST_LIMITS.maxRequestsPerWindow;

  const bucket = buckets.get(clientKey);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(clientKey, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return {
      ok: false,
      status: 429,
      message: `Rate limit exceeded. Try again in ${retryAfterSec}s.`,
      retryAfterSec,
    };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Resolve a stable client key from request headers (best-effort). */
export function judgeClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "local";
}

/** Test helper — reset in-memory buckets between tests. */
export function resetJudgeRateLimitsForTests(): void {
  buckets.clear();
}

"use client";

import * as React from "react";
import type { JudgeVerdict } from "@/lib/de-code/types";
import { buildVerdictSummary } from "@/lib/de-code/verdict-display";
import { cn } from "cn";

function friendlyHeadline(accepted: boolean, status: string): string {
  if (accepted) return "Accepted";
  if (status === "wrong_answer") return "Not quite";
  if (status === "time_limit_exceeded") return "Time limit exceeded";
  if (status === "runtime_error") return "Runtime error";
  if (status === "compilation_error") return "Compilation error";
  return "Needs work";
}

export function ChallengeVerdictPanel({
  verdict,
  className,
}: {
  verdict: JudgeVerdict;
  className?: string;
}) {
  const summary = buildVerdictSummary(verdict);
  const failedCases = summary.caseDetails.filter((c) => !c.pass);
  const passedCases = summary.caseDetails.filter((c) => c.pass);
  const headline = friendlyHeadline(summary.accepted, verdict.status);
  const hasCaseDetails = summary.caseDetails.length > 0;
  const [showDetails, setShowDetails] = React.useState(!summary.accepted);

  React.useEffect(() => {
    setShowDetails(!summary.accepted);
  }, [verdict.status, verdict.passed, verdict.total, verdict.message, summary.accepted]);

  return (
    <div
      className={cn(
        "platform-verdict animate-in fade-in duration-200",
        summary.accepted ? "platform-verdict-success" : "platform-verdict-error",
        showDetails ? "p-4" : "p-3",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium",
            summary.accepted
              ? "bg-[color-mix(in_oklch,var(--platform-success)_15%,transparent)] text-[var(--platform-success)]"
              : "bg-[color-mix(in_oklch,var(--platform-error)_12%,transparent)] text-[var(--platform-error)]"
          )}
          aria-hidden
        >
          {summary.accepted ? "✓" : "✕"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="type-section text-foreground">{headline}</p>
            {hasCaseDetails && (
              <button
                type="button"
                onClick={() => setShowDetails((open) => !open)}
                className="type-meta shrink-0 text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {showDetails ? "Hide checks" : `Show ${summary.caseDetails.length} checks`}
              </button>
            )}
          </div>
          {summary.total > 0 && (
            <p className="type-meta mt-1 text-muted-foreground">
              {summary.passed} / {summary.total} checks passed
              {summary.runtime ? ` · ${summary.runtime}` : ""}
            </p>
          )}
          {summary.message && summary.total === 0 && (
            <p className="type-meta mt-1 text-[var(--platform-error)]">{summary.message}</p>
          )}
          {summary.accepted && summary.message && !showDetails && (
            <p className="type-meta mt-1 line-clamp-2 text-muted-foreground">{summary.message}</p>
          )}
        </div>
      </div>

      {showDetails && !summary.accepted && summary.failedConcepts.length > 0 && (
        <div className="mt-4">
          <p className="type-meta font-medium text-foreground">Failed concepts</p>
          <ul className="mt-2 space-y-1">
            {summary.failedConcepts.map((concept) => (
              <li key={concept} className="type-meta flex items-center gap-2 text-muted-foreground">
                <span className="text-[var(--platform-error)]">•</span>
                {concept}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDetails && hasCaseDetails && (
        <div className="platform-divider mt-4 pt-4">
          <ul className="space-y-3">
            {passedCases.length > 0 && failedCases.length > 0 && (
              <li className="type-meta text-[var(--platform-success)]">
                ✓ {passedCases.length} check{passedCases.length === 1 ? "" : "s"} passed
              </li>
            )}
            {(failedCases.length > 0 ? failedCases : passedCases).map((c) => (
              <li key={c.label} className="space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p
                    className={cn(
                      "type-meta font-medium",
                      c.pass ? "text-[var(--platform-success)]" : "text-foreground"
                    )}
                  >
                    {c.label}
                  </p>
                  <span
                    className={cn(
                      "type-meta shrink-0",
                      c.pass ? "text-[var(--platform-success)]" : "text-[var(--platform-error)]"
                    )}
                  >
                    {c.pass ? "Passed" : "Failed"}
                  </span>
                </div>
                {c.category && (
                  <p className="type-meta text-muted-foreground">{c.category}</p>
                )}
                {c.summary && (
                  <p className="type-meta text-muted-foreground">{c.summary}</p>
                )}
                {c.detail && !c.pass && (
                  <p className="type-meta text-muted-foreground">{c.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDetails && summary.accepted && summary.message && (
        <p className="type-meta mt-4 text-muted-foreground">{summary.message}</p>
      )}
    </div>
  );
}

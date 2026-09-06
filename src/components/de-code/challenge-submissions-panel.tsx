"use client";

import * as React from "react";
import type { CodeSubmission } from "@/lib/de-code/types";
import { formatRuntime } from "@/lib/de-code/verdict-display";
import { statusLabel } from "@/lib/de-code/progress";
import { cn } from "cn";

export function ChallengeSubmissionsPanel({
  submissions,
}: {
  submissions: CodeSubmission[];
}) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    submissions[0]?.id ?? null
  );

  React.useEffect(() => {
    if (submissions.length && !submissions.some((s) => s.id === expandedId)) {
      setExpandedId(submissions[0]?.id ?? null);
    }
  }, [submissions, expandedId]);

  if (submissions.length === 0) {
    return <p className="text-sm text-muted-foreground">No submissions yet.</p>;
  }

  const attemptNumber = submissions.length;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {submissions.length} attempt{submissions.length === 1 ? "" : "s"} · newest first
      </p>
      <ul className="space-y-2">
        {submissions.map((s, index) => {
          const attempt = attemptNumber - index;
          const expanded = expandedId === s.id;
          const runtime = formatRuntime(s.runtimeMs);

          return (
            <li key={s.id} className="rounded-md border border-border">
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : s.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs",
                  s.status === "accepted"
                    ? "bg-lc-easy/5 hover:bg-lc-easy/10"
                    : "hover:bg-muted/40"
                )}
              >
                <span className="font-medium">
                  Attempt {attempt}{" "}
                  <span className={s.status === "accepted" ? "text-lc-easy" : "text-lc-hard"}>
                    {s.status === "accepted" ? "✓" : "✗"}
                  </span>{" "}
                  {s.passed}/{s.total}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {s.language}
                  {runtime ? ` · ${runtime}` : ""}
                </span>
              </button>
              {expanded && (
                <div className="space-y-2 border-t border-border px-3 py-2 text-xs">
                  <p className="text-muted-foreground">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className={cn(
                        "font-medium",
                        s.status === "accepted" ? "text-lc-easy" : "text-lc-hard"
                      )}
                    >
                      {statusLabel(s.status)}
                    </span>
                  </p>
                  <p>
                    Tests: {s.passed}/{s.total}
                    {runtime ? ` · Runtime: ${runtime}` : ""}
                  </p>
                  {s.failedConcepts && s.failedConcepts.length > 0 && (
                    <div>
                      <p className="font-medium text-foreground">Concepts failed</p>
                      <ul className="mt-1 space-y-0.5 text-muted-foreground">
                        {s.failedConcepts.map((concept) => (
                          <li key={concept}>• {concept}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {s.verdictMessage && (
                    <p className="text-muted-foreground">{s.verdictMessage}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

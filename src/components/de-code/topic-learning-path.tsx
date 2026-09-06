"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { getCodeProblems } from "@/lib/de-code/problem-bank";
import { isProblemSolved } from "@/lib/de-code/progress";
import type { CodeTrackId } from "@/lib/de-code/types";
import { cn } from "cn";
import * as React from "react";

const DIFF: Record<string, string> = {
  easy: "lc-badge lc-badge-easy",
  medium: "lc-badge lc-badge-medium",
  hard: "lc-badge lc-badge-hard",
  expert: "lc-badge lc-badge-hard",
};

export function TopicLearningPath({
  track,
  topicId,
}: {
  track: CodeTrackId;
  topicId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("slug");
  const problems = React.useMemo(() => getCodeProblems(track, topicId), [track, topicId]);
  const [mounted, setMounted] = React.useState(false);
  const [progressVersion, setProgressVersion] = React.useState(0);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const bump = () => setProgressVersion((v) => v + 1);
    window.addEventListener("de-code-updated", bump);
    return () => window.removeEventListener("de-code-updated", bump);
  }, []);

  const openProblem = (problemSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("slug", problemSlug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.requestAnimationFrame(() => {
      document.getElementById("code-problem-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (problems.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Learning path</h3>
        <p className="text-xs text-muted-foreground">Ordered by recommended progression</p>
      </div>
      <ol key={progressVersion} className="mt-3 space-y-1">
        {problems.map((p, i) => {
          const active = activeSlug === p.slug;
          const solved = mounted && isProblemSolved(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => openProblem(p.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left text-sm transition-colors hover:bg-muted/50",
                  active
                    ? "border-primary/30 bg-primary/10 ring-1 ring-primary/20"
                    : "border-transparent"
                )}
              >
                <span className="w-6 shrink-0 text-center text-xs text-muted-foreground">{i + 1}</span>
                {solved ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                )}
                <span className="min-w-0 flex-1 truncate font-medium">{p.title}</span>
                <span className={cn("shrink-0 text-[10px] uppercase", DIFF[p.difficulty] ?? "")}>
                  {p.difficulty}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {solved ? "Done" : "Todo"}
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("slug");
  const problems = React.useMemo(() => getCodeProblems(track, topicId), [track, topicId]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (problems.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Learning path</h3>
        <p className="text-xs text-muted-foreground">Ordered by recommended progression</p>
      </div>
      <ol className="mt-3 space-y-1">
        {problems.map((p, i) => {
          const href = `${pathname}?slug=${encodeURIComponent(p.slug)}`;
          const active = activeSlug === p.slug;
          const solved = mounted && isProblemSolved(p.id);
          return (
            <li key={p.id}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted/50",
                  active && "bg-primary/10 ring-1 ring-primary/20"
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
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

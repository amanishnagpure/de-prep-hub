"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { SQL_ROUTES } from "@/lib/sql";
import { getReviewQueue, getWeakAreas, type WeakArea } from "@/lib/sql-weak-areas";
import { cn } from "cn";

export function SqlWeakAreas() {
  const [weakAreas, setWeakAreas] = React.useState<WeakArea[]>([]);
  const [review, setReview] = React.useState({ leetcode: 0, interview: 0 });

  const refresh = React.useCallback(() => {
    setWeakAreas(getWeakAreas(5));
    setReview(getReviewQueue());
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    return () => window.removeEventListener("sql-progress-updated", refresh);
  }, [refresh]);

  if (weakAreas.length === 0 && review.leetcode === 0 && review.interview === 0) {
    return null;
  }

  return (
    <section className="panel p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold">Weak areas</h2>
        <div className="flex flex-wrap gap-2">
          {review.leetcode > 0 && (
            <Link
              href={`${SQL_ROUTES.leetcode}?review=1`}
              className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 ring-1 ring-orange-500/20"
            >
              <RotateCcw className="size-3" />
              LC ({review.leetcode})
            </Link>
          )}
          {review.interview > 0 && (
            <Link
              href={SQL_ROUTES.interview}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400 ring-1 ring-violet-500/20"
            >
              <RotateCcw className="size-3" />
              Q&A ({review.interview})
            </Link>
          )}
        </div>
      </div>

      {weakAreas.length > 0 && (
        <div className="space-y-2">
          {weakAreas.map((area) => (
            <Link
              key={area.id}
              href={area.href}
              className="group flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <AlertCircle className="size-4 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{area.label}</p>
                <p className="text-xs text-muted-foreground">
                  {area.solved}/{area.total} · {area.percent}%
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

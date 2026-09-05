"use client";

import * as React from "react";
import { parseInterviewGuideTiles } from "@/lib/parse-interview-guide-notes";
import { cn } from "cn";
import type { ComponentType } from "react";
import type { LabNotesAccent } from "@/components/notes/lab-notes-chapter-panel";

interface InterviewGuideQuestionTilesProps {
  content: string;
  accent?: LabNotesAccent;
  Markdown: ComponentType<{ content: string }>;
}

const accentStyles = {
  orange: {
    badge: "bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-orange-500/25",
    border: "border-orange-500/20 hover:bg-muted/40",
    glow: "shadow-orange-500/5",
  },
  rose: {
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/25",
    border: "border-rose-500/20 hover:bg-muted/40",
    glow: "shadow-rose-500/5",
  },
  amber: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/25",
    border: "border-amber-500/20 hover:bg-muted/40",
    glow: "shadow-amber-500/5",
  },
  cyan: {
    badge: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 ring-cyan-500/25",
    border: "border-cyan-500/20 hover:bg-muted/40",
    glow: "shadow-cyan-500/5",
  },
  violet: {
    badge: "bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-violet-500/25",
    border: "border-violet-500/20 hover:bg-muted/40",
    glow: "shadow-violet-500/5",
  },
  emerald: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/25",
    border: "border-emerald-500/20 hover:bg-muted/40",
    glow: "shadow-emerald-500/5",
  },
  fuchsia: {
    badge: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 ring-fuchsia-500/25",
    border: "border-fuchsia-500/20 hover:bg-muted/40",
    glow: "shadow-fuchsia-500/5",
  },
};

export function InterviewGuideQuestionTiles({
  content,
  accent = "orange",
  Markdown,
}: InterviewGuideQuestionTilesProps) {
  const { intro, tiles } = React.useMemo(() => parseInterviewGuideTiles(content), [content]);
  const style = accentStyles[accent];

  return (
    <div className="space-y-6">
      {intro ? (
        <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
          <Markdown content={intro} />
        </div>
      ) : null}

      {tiles.length > 1 ? (
        <nav
          aria-label="Jump to question"
          className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/30 p-3"
        >
          {tiles.map((tile) => (
            <a
              key={tile.number}
              href={`#q-${tile.number}`}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-lg text-xs font-bold ring-1 transition-colors hover:opacity-90",
                style.badge
              )}
            >
              {tile.number}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="grid gap-5 sm:gap-6">
        {tiles.map((tile) => (
          <article
            key={tile.number}
            id={`q-${tile.number}`}
            className={cn(
              "relative scroll-mt-24 rounded-2xl border bg-card/80 p-5 shadow-sm transition-shadow sm:p-6",
              style.border,
              style.glow,
              "hover:shadow-md"
            )}
          >
            <div className="mb-4 flex items-start gap-3 border-b border-border/60 pb-4">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ring-1",
                  style.badge
                )}
              >
                Q{tile.number}
              </span>
              <h3 className="min-w-0 flex-1 pt-1.5 text-base font-semibold leading-snug tracking-tight sm:text-lg">
                {tile.title}
              </h3>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert [&_pre]:my-3 [&_table]:text-sm">
              <Markdown content={tile.body} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

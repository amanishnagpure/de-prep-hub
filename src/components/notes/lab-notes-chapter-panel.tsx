"use client";

import { CheckCircle2 } from "lucide-react";
import { InterviewGuideQuestionTiles } from "@/components/notes/interview-guide-question-tiles";
import { isQuestionTileChapter } from "@/lib/parse-interview-guide-notes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type { ComponentType } from "react";

export type LabNotesAccent = "cyan" | "amber" | "orange" | "rose" | "emerald" | "violet" | "fuchsia";

interface LabNotesChapterPanelProps {
  title: string;
  content: string;
  accent: LabNotesAccent;
  Markdown: ComponentType<{ content: string }>;
  ScrollToc: ComponentType<{ headings: { id: string; text: string; level: number }[] }>;
  headings: { id: string; text: string; level: number }[];
  onMarkRead: () => void;
}

export function LabNotesChapterPanel({
  title,
  content,
  accent,
  Markdown,
  ScrollToc,
  headings,
  onMarkRead,
}: LabNotesChapterPanelProps) {
  const isInterviewGuide = isQuestionTileChapter(title);

  return (
    <div className={cn("grid gap-8", !isInterviewGuide && "xl:grid-cols-[minmax(0,1fr)_260px]")}>
      <div
        className={cn(
          !isInterviewGuide && "rounded-2xl border border-border/70 bg-card/50 p-6 shadow-sm sm:p-8"
        )}
      >
        <div
          className={cn(
            "mb-6 flex items-center justify-between gap-3",
            !isInterviewGuide && "border-b border-border/60 pb-4"
          )}
        >
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onMarkRead}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-2")}
          >
            <CheckCircle2 className="size-4" />
            Done
          </button>
        </div>

        {isInterviewGuide ? (
          <InterviewGuideQuestionTiles content={content} accent={accent} Markdown={Markdown} />
        ) : (
          <Markdown content={content} />
        )}
      </div>

      {!isInterviewGuide ? <ScrollToc headings={headings} /> : null}
    </div>
  );
}

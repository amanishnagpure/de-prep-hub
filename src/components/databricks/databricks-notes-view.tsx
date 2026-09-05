"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { DatabricksNotesChapter } from "@/lib/databricks-notes";
import { DATABRICKS_NOTES_SECTIONS } from "@/lib/databricks";
import { extractHeadings } from "@/lib/markdown-utils";
import { markNotesChapterRead, getDatabricksProgress } from "@/lib/databricks-progress";
import { DatabricksMarkdownRenderer } from "@/components/databricks/databricks-markdown-renderer";
import { DatabricksScrollToc } from "@/components/databricks/databricks-scroll-toc";
import { LabNotesChapterPanel } from "@/components/notes/lab-notes-chapter-panel";
import { cn } from "cn";

interface DatabricksNotesViewProps {
  chapters: DatabricksNotesChapter[];
}

const PRIMARY_CHAPTER_IDS = new Set<string>(DATABRICKS_NOTES_SECTIONS.map((section) => section.id));

export function DatabricksNotesView({ chapters }: DatabricksNotesViewProps) {
  const searchParams = useSearchParams();
  const chapterParam = searchParams.get("chapter");
  const defaultChapter =
    chapters.find((chapter) => chapter.id === chapterParam)?.id ??
    chapters.find((chapter) => PRIMARY_CHAPTER_IDS.has(chapter.id))?.id ??
    chapters[0]?.id ??
    "";

  const [activeChapterId, setActiveChapterId] = React.useState(defaultChapter);
  const [readChapters, setReadChapters] = React.useState<string[]>([]);

  const activeChapter = chapters.find((chapter) => chapter.id === activeChapterId) ?? chapters[0];
  const headings = React.useMemo(
    () => (activeChapter ? extractHeadings(activeChapter.content) : []),
    [activeChapter]
  );

  const extraChapters = chapters.filter((chapter) => !PRIMARY_CHAPTER_IDS.has(chapter.id));

  React.useEffect(() => {
    if (chapterParam && chapters.some((chapter) => chapter.id === chapterParam)) {
      setActiveChapterId(chapterParam);
    }
  }, [chapterParam, chapters]);

  React.useEffect(() => {
    const refresh = () => setReadChapters(getDatabricksProgress().notesChaptersRead);
    refresh();
    window.addEventListener("databricks-progress-updated", refresh);
    return () => window.removeEventListener("databricks-progress-updated", refresh);
  }, []);

  const markRead = () => {
    if (!activeChapter) return;
    markNotesChapterRead(activeChapter.id);
  };

  if (!activeChapter) return null;

  return (
    <div className="space-y-6">
      {extraChapters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {extraChapters.map((chapter) => {
            const isActive = chapter.id === activeChapter.id;
            const isRead = readChapters.includes(chapter.id);

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => setActiveChapterId(chapter.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground ring-1 ring-rose-500/25"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {isRead ? <CheckCircle2 className="size-3 text-primary" /> : null}
                {chapter.title}
              </button>
            );
          })}
        </div>
      )}

      <LabNotesChapterPanel
        title={activeChapter.title}
        content={activeChapter.content}
        accent="rose"
        Markdown={DatabricksMarkdownRenderer}
        ScrollToc={DatabricksScrollToc}
        headings={headings}
        onMarkRead={markRead}
      />
    </div>
  );
}

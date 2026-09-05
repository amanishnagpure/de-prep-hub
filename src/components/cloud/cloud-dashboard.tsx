"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Cloud, Flame, PlayCircle, Terminal } from "lucide-react";
import { CLOUD_CHAPTER_META, CLOUD_ROUTES, CLOUD_STATS } from "@/lib/cloud";
import {
  exportCloudProgress,
  getCloudProgress,
  getCloudStreak,
  getInterviewStats,
  getNotesStats,
  getPracticeStats,
  importCloudProgress,
} from "@/lib/cloud-progress";
import { CloudProgressRing } from "@/components/cloud/cloud-progress-ring";
import { buttonVariants } from "@/components/ui/button";
import { LabChapterLink, LabModuleLink } from "@/components/lab/nav";
import { cn } from "cn";

const MODULES = [
  { href: CLOUD_ROUTES.notes, title: "Notes", icon: BookOpen },
  { href: CLOUD_ROUTES.practice, title: "Practice", icon: Terminal },
  { href: CLOUD_ROUTES.interview, title: "Interview", icon: Brain },
];

export function CloudDashboard() {
  const [streak, setStreak] = React.useState(0);
  const [notes, setNotes] = React.useState({ read: 0, total: 0, percent: 0 });
  const [practice, setPractice] = React.useState({ solved: 0, total: 0, percent: 0 });
  const [interview, setInterview] = React.useState({ know: 0, total: 0, percent: 0 });
  const [readChapters, setReadChapters] = React.useState<string[]>([]);
  const [lastVisited, setLastVisited] = React.useState<{ path: string; label: string } | null>(null);
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const refresh = React.useCallback(() => {
    setStreak(getCloudStreak());
    setNotes(getNotesStats(CLOUD_STATS.noteChapters));
    setPractice(getPracticeStats(CLOUD_STATS.practiceTotal));
    const interviewStats = getInterviewStats(CLOUD_STATS.interviewTotal);
    setInterview({
      know: interviewStats.know,
      total: interviewStats.total,
      percent: interviewStats.percent,
    });
    setReadChapters(getCloudProgress().notesChaptersRead);
    setLastVisited(getCloudProgress().lastVisited ?? null);
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("cloud-progress-updated", refresh);
    return () => window.removeEventListener("cloud-progress-updated", refresh);
  }, [refresh]);

  const handleExport = () => {
    const blob = new Blob([exportCloudProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloud-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importCloudProgress(text);
    setImportMessage(result.message);
    window.setTimeout(() => setImportMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cloud Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ADF → ADLS Gen2 → Synapse — linked services, pipelines, medallion on Azure.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {lastVisited ? (
            <Link
              href={lastVisited.path}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <PlayCircle className="size-4" />
              {lastVisited.label}
            </Link>
          ) : (
            <Link
              href={CLOUD_ROUTES.notes}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <PlayCircle className="size-4" />
              Start Notes
            </Link>
          )}
          {streak > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 text-sm text-muted-foreground">
              <Flame className="size-4 text-amber-600 dark:text-amber-500" />
              {streak} day streak
            </span>
          )}
          <button
            type="button"
            onClick={handleExport}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = "";
            }}
          />
        </div>
        {importMessage && <p className="mt-2 text-sm text-muted-foreground">{importMessage}</p>}
      </section>

      <section className="grid gap-4 panel p-6 sm:grid-cols-3">
        <CloudProgressRing percent={notes.percent} label="Notes" sublabel={`${notes.read}/${notes.total} chapters`} />
        <CloudProgressRing percent={practice.percent} label="Practice" sublabel={`${practice.solved}/${practice.total}`} />
        <CloudProgressRing percent={interview.percent} label="Interview" sublabel={`${interview.know}/${interview.total}`} />
      </section>

      <section className="panel p-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          Notes progress
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLOUD_CHAPTER_META.map((chapter) => (
            <LabChapterLink
              key={chapter.id}
              href={chapter.href}
              title={chapter.title}
              estimate={chapter.estimate}
              isRead={readChapters.includes(chapter.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        {MODULES.map((module) => (
          <LabModuleLink
            key={module.href}
            href={module.href}
            title={module.title}
            icon={module.icon}
          />
        ))}
      </section>

      <section className="panel p-6">
        <h2 className="text-sm font-medium">Suggested order</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ADF → ADLS Gen2 → Synapse → practice → flashcards
        </p>
      </section>
    </div>
  );
}

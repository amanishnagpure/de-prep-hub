"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Flame, PlayCircle, Terminal, Workflow } from "lucide-react";
import { AIRFLOW_CHAPTER_META, AIRFLOW_ROUTES, AIRFLOW_STATS } from "@/lib/airflow";
import {
  getInterviewStats,
  getNotesStats,
  getPracticeStats,
  getAirflowProgress,
  getAirflowStreak,
  exportAirflowProgress,
  importAirflowProgress,
} from "@/lib/airflow-progress";
import { AirflowProgressRing } from "@/components/airflow/airflow-progress-ring";
import { buttonVariants } from "@/components/ui/button";
import { LabChapterLink, LabModuleLink } from "@/components/lab/nav";
import { cn } from "cn";

const MODULES = [
  { href: AIRFLOW_ROUTES.notes, title: "Notes", icon: BookOpen },
  { href: AIRFLOW_ROUTES.practice, title: "Practice", icon: Terminal },
  { href: AIRFLOW_ROUTES.interview, title: "Interview", icon: Brain },
];

export function AirflowDashboard() {
  const [streak, setStreak] = React.useState(0);
  const [notes, setNotes] = React.useState({ read: 0, total: 0, percent: 0 });
  const [practice, setPractice] = React.useState({ solved: 0, total: 0, percent: 0 });
  const [interview, setInterview] = React.useState({ know: 0, total: 0, percent: 0 });
  const [readChapters, setReadChapters] = React.useState<string[]>([]);
  const [lastVisited, setLastVisited] = React.useState<{ path: string; label: string } | null>(null);
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const refresh = React.useCallback(() => {
    setStreak(getAirflowStreak());
    setNotes(getNotesStats(AIRFLOW_STATS.noteChapters));
    setPractice(getPracticeStats(AIRFLOW_STATS.practiceTotal));
    const interviewStats = getInterviewStats(AIRFLOW_STATS.interviewTotal);
    setInterview({
      know: interviewStats.know,
      total: interviewStats.total,
      percent: interviewStats.percent,
    });
    setReadChapters(getAirflowProgress().notesChaptersRead);
    setLastVisited(getAirflowProgress().lastVisited ?? null);
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("airflow-progress-updated", refresh);
    return () => window.removeEventListener("airflow-progress-updated", refresh);
  }, [refresh]);

  const handleExport = () => {
    const blob = new Blob([exportAirflowProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `airflow-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importAirflowProgress(text);
    setImportMessage(result.message);
    window.setTimeout(() => setImportMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Airflow Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          DAGs → operators → scheduling → production — Airflow 2.x for DE interviews.
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
              href={AIRFLOW_ROUTES.notes}
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
        <AirflowProgressRing percent={notes.percent} label="Notes" sublabel={`${notes.read}/${notes.total} chapters`} />
        <AirflowProgressRing percent={practice.percent} label="Practice" sublabel={`${practice.solved}/${practice.total}`} />
        <AirflowProgressRing percent={interview.percent} label="Interview" sublabel={`${interview.know}/${interview.total}`} />
      </section>

      <section className="panel p-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          Notes progress
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AIRFLOW_CHAPTER_META.map((chapter) => (
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
          DAGs → operators → scheduling → production → practice → flashcards
        </p>
      </section>
    </div>
  );
}

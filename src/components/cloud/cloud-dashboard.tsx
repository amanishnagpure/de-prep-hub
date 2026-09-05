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
import { cn } from "cn";

const MODULES = [
  {
    href: CLOUD_ROUTES.notes,
    title: "Notes",
    icon: BookOpen,
    accent: "from-emerald-500/20 to-green-500/5 text-emerald-400 ring-emerald-500/20",
  },
  {
    href: CLOUD_ROUTES.practice,
    title: "Practice",
    icon: Terminal,
    accent: "from-cyan-500/20 to-sky-500/5 text-cyan-400 ring-cyan-500/20",
  },
  {
    href: CLOUD_ROUTES.interview,
    title: "Interview",
    icon: Brain,
    accent: "from-violet-500/20 to-purple-500/5 text-violet-400 ring-violet-500/20",
  },
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
      <section className="rounded-2xl border border-cyan-500/20 bg-card/60 p-6">
        <h1 className="text-2xl font-bold tracking-tight">Cloud Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ADF → ADLS Gen2 → Synapse — linked services, pipelines, medallion on Azure.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {lastVisited ? (
            <Link
              href={lastVisited.path}
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-cyan-600 hover:bg-cyan-600/90")}
            >
              <PlayCircle className="size-4" />
              {lastVisited.label}
            </Link>
          ) : (
            <Link
              href={CLOUD_ROUTES.notes}
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-cyan-600 hover:bg-cyan-600/90")}
            >
              <PlayCircle className="size-4" />
              Start Notes
            </Link>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-sm">
            <Flame className="size-4 text-cyan-500" />
            {streak}d
          </span>
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

      <section className="grid gap-4 rounded-2xl border border-border/70 bg-card/50 p-6 sm:grid-cols-3">
        <CloudProgressRing percent={notes.percent} label="Notes" sublabel={`${notes.read}/${notes.total} chapters`} />
        <CloudProgressRing percent={practice.percent} label="Practice" sublabel={`${practice.solved}/${practice.total}`} />
        <CloudProgressRing percent={interview.percent} label="Interview" sublabel={`${interview.know}/${interview.total}`} />
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Notes progress
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CLOUD_CHAPTER_META.map((chapter) => {
            const isRead = readChapters.includes(chapter.id);
            return (
              <Link
                key={chapter.id}
                href={chapter.href}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-border/70 bg-card/60 px-4 py-3 transition-colors hover:border-cyan-500/30",
                  isRead && "border-emerald-500/25 bg-emerald-500/5"
                )}
              >
                <div>
                  <p className="font-medium">{chapter.title}</p>
                  <p className="text-xs text-muted-foreground">{chapter.estimate}</p>
                </div>
                {isRead ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : (
                  <BookOpen className="size-4 text-muted-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-cyan-500/25"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1",
                  module.accent
                )}
              >
                <Icon className="size-4" />
              </div>
              <span className="font-semibold">{module.title}</span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
            <Cloud className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Study path</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ADF → ADLS Gen2 → Synapse → Azure DE Patterns → Traps → 25 scenarios → 50 flashcards
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

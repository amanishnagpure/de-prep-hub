"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Network, PenLine, PlayCircle, Flame } from "lucide-react";
import {
  SYSTEM_DESIGN_CHAPTER_META,
  SYSTEM_DESIGN_ROUTES,
  SYSTEM_DESIGN_STATS,
} from "@/lib/system-design";
import {
  exportSystemDesignProgress,
  getInterviewStats,
  getNotesStats,
  getPracticeStats,
  getSystemDesignProgress,
  getSystemDesignStreak,
  importSystemDesignProgress,
} from "@/lib/system-design-progress";
import { SystemDesignProgressRing } from "@/components/system-design/system-design-progress-ring";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const MODULES = [
  {
    href: SYSTEM_DESIGN_ROUTES.notes,
    title: "Notes",
    icon: BookOpen,
    accent: "from-emerald-500/20 to-green-500/5 text-emerald-400 ring-emerald-500/20",
  },
  {
    href: SYSTEM_DESIGN_ROUTES.practice,
    title: "Practice",
    icon: PenLine,
    accent: "from-violet-500/20 to-purple-500/5 text-violet-400 ring-violet-500/20",
  },
  {
    href: SYSTEM_DESIGN_ROUTES.interview,
    title: "Interview",
    icon: Brain,
    accent: "from-purple-500/20 to-fuchsia-500/5 text-purple-400 ring-purple-500/20",
  },
];

export function SystemDesignDashboard() {
  const [streak, setStreak] = React.useState(0);
  const [notes, setNotes] = React.useState({ read: 0, total: 0, percent: 0 });
  const [practice, setPractice] = React.useState({ solved: 0, total: 0, percent: 0 });
  const [interview, setInterview] = React.useState({ know: 0, total: 0, percent: 0 });
  const [readChapters, setReadChapters] = React.useState<string[]>([]);
  const [lastVisited, setLastVisited] = React.useState<{ path: string; label: string } | null>(null);
  const [importMessage, setImportMessage] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const refresh = React.useCallback(() => {
    setStreak(getSystemDesignStreak());
    setNotes(getNotesStats(SYSTEM_DESIGN_STATS.noteChapters));
    setPractice(getPracticeStats(SYSTEM_DESIGN_STATS.practiceTotal));
    const interviewStats = getInterviewStats(SYSTEM_DESIGN_STATS.interviewTotal);
    setInterview({
      know: interviewStats.know,
      total: interviewStats.total,
      percent: interviewStats.percent,
    });
    setReadChapters(getSystemDesignProgress().notesChaptersRead);
    setLastVisited(getSystemDesignProgress().lastVisited ?? null);
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("system-design-progress-updated", refresh);
    return () => window.removeEventListener("system-design-progress-updated", refresh);
  }, [refresh]);

  const handleExport = () => {
    const blob = new Blob([exportSystemDesignProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-design-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importSystemDesignProgress(text);
    setImportMessage(result.message);
    window.setTimeout(() => setImportMessage(null), 3000);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-violet-500/20 bg-card/60 p-6">
        <h1 className="text-2xl font-bold tracking-tight">System Design Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Batch vs streaming, Kafka, CDC, lakehouse, medallion — built for DE architecture interviews.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {lastVisited ? (
            <Link
              href={lastVisited.path}
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-violet-600 hover:bg-violet-600/90")}
            >
              <PlayCircle className="size-4" />
              {lastVisited.label}
            </Link>
          ) : (
            <Link
              href={SYSTEM_DESIGN_ROUTES.notes}
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-violet-600 hover:bg-violet-600/90")}
            >
              <PlayCircle className="size-4" />
              Start Notes
            </Link>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-sm">
            <Flame className="size-4 text-violet-500" />
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
        <SystemDesignProgressRing
          percent={notes.percent}
          label="Notes"
          sublabel={`${notes.read}/${notes.total} chapters`}
        />
        <SystemDesignProgressRing
          percent={practice.percent}
          label="Practice"
          sublabel={`${practice.solved}/${practice.total}`}
        />
        <SystemDesignProgressRing
          percent={interview.percent}
          label="Interview"
          sublabel={`${interview.know}/${interview.total}`}
        />
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Notes progress
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEM_DESIGN_CHAPTER_META.map((chapter) => {
            const isRead = readChapters.includes(chapter.id);
            return (
              <Link
                key={chapter.id}
                href={chapter.href}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-border/70 bg-card/60 px-4 py-3 transition-colors hover:border-violet-500/30",
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
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-violet-500/25"
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
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
            <Network className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Study path</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Batch/Streaming → CDC & Lakehouse → Medallion → Scalability → Case Studies → 20 design
              scenarios → 40 interview cases
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

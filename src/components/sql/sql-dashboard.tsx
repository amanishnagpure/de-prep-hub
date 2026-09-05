"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Brain, CheckCircle2, Database, Flame, PlayCircle, Timer } from "lucide-react";
import { SQL_CHAPTER_META, SQL_ROUTES, SQL_STATS } from "@/lib/sql";
import {
  getInterviewStats,
  getLeetCodeStats,
  getNotesStats,
  getPracticeStats,
  getSqlProgress,
  getSqlStreak,
} from "@/lib/sql-progress";
import { SqlProgressRing } from "@/components/sql/sql-progress-ring";
import { SqlWeakAreas } from "@/components/sql/sql-weak-areas";
import {
  SqlProgressExport,
  SqlStudyChecklist,
  SqlTodaysPlan,
} from "@/components/sql/sql-study-widgets";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const MODULES = [
  { href: SQL_ROUTES.notes, title: "Notes", icon: BookOpen, accent: "from-emerald-500/20 to-green-500/5 text-emerald-400 ring-emerald-500/20" },
  { href: SQL_ROUTES.practice, title: "Practice", icon: Database, accent: "from-cyan-500/20 to-blue-500/5 text-cyan-400 ring-cyan-500/20" },
  { href: SQL_ROUTES.interview, title: "Interview", icon: Brain, accent: "from-violet-500/20 to-purple-500/5 text-violet-400 ring-violet-500/20" },
];

export function SqlDashboard() {
  const [streak, setStreak] = React.useState(0);
  const [notes, setNotes] = React.useState({ read: 0, total: 0, percent: 0 });
  const [practice, setPractice] = React.useState({ solved: 0, total: 0, percent: 0 });
  const [interview, setInterview] = React.useState({ know: 0, reviewed: 0, total: 0, percent: 0 });
  const [leetcode, setLeetcode] = React.useState({ solved: 0, total: 0, percent: 0 });
  const [readChapters, setReadChapters] = React.useState<string[]>([]);
  const [lastVisited, setLastVisited] = React.useState<{ path: string; label: string } | null>(null);

  const refresh = React.useCallback(() => {
    setStreak(getSqlStreak());
    setNotes(getNotesStats(SQL_STATS.noteChapters));
    setPractice(getPracticeStats(SQL_STATS.practiceTotal));
    setLeetcode(getLeetCodeStats(SQL_STATS.leetcodeTotal));
    const interviewStats = getInterviewStats(SQL_STATS.interviewTotal);
    setInterview({
      know: interviewStats.know,
      reviewed: interviewStats.reviewed,
      total: interviewStats.total,
      percent: interviewStats.percent,
    });
    setLastVisited(getSqlProgress().lastVisited ?? null);
    setReadChapters(getSqlProgress().notesChaptersRead);
  }, []);

  React.useEffect(() => {
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    return () => window.removeEventListener("sql-progress-updated", refresh);
  }, [refresh]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-cyan-500/20 bg-card/60 p-6">
        <h1 className="text-2xl font-bold tracking-tight">SQL Lab</h1>
        <p className="mt-1 text-sm text-muted-foreground">Muscle memory for JOINs.</p>

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
              href={SQL_ROUTES.notes}
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-cyan-600 hover:bg-cyan-600/90")}
            >
              <PlayCircle className="size-4" />
              Notes
            </Link>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-sm">
            <Flame className="size-4 text-amber-500" />
            {streak}d
          </span>
          <Link
            href={SQL_ROUTES.mock}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
          >
            <Timer className="size-4" />
            Mock
          </Link>
          <SqlProgressExport />
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border/70 bg-card/50 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <SqlProgressRing percent={notes.percent} label="Notes" sublabel={`${notes.read}/${notes.total}`} />
        <SqlProgressRing percent={practice.percent} label="Practice" sublabel={`${practice.solved}/${practice.total}`} />
        <SqlProgressRing percent={leetcode.percent} label="LeetCode" sublabel={`${leetcode.solved}/${leetcode.total}`} />
        <SqlProgressRing percent={interview.percent} label="Interview" sublabel={`${interview.know}/${interview.total}`} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <SqlStudyChecklist />
        <SqlTodaysPlan />
      </div>

      <SqlWeakAreas />

      <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Notes progress
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SQL_CHAPTER_META.map((chapter) => {
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
              <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1", module.accent)}>
                <Icon className="size-4" />
              </div>
              <span className="font-semibold">{module.title}</span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

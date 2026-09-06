"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  CODE_SECTION,
  CODE_TRACKS,
  codeTrackPath,
} from "@/lib/de-code/constants";
import {
  getActiveTopics,
  getCodeProblems,
  getTopicLabel,
  getTopicProblemCount,
} from "@/lib/de-code/problem-bank";
import { getTopicStats } from "@/lib/de-code/progress";
import type { CodeTrackId } from "@/lib/de-code/types";
import { codeTopicPath } from "@/lib/de-code/taxonomy";
import { cn } from "cn";
import * as React from "react";

export function CodeTrackHub({ track }: { track: CodeTrackId }) {
  const meta = CODE_TRACKS.find((t) => t.id === track)!;
  const topics = getActiveTopics(track);
  const allProblems = getCodeProblems(track);
  const trackStats = getTopicStats(
    track,
    allProblems.map((p) => p.id)
  );

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const topicStats = React.useMemo(() => {
    if (!mounted) return {};
    return Object.fromEntries(
      topics.map((t) => {
        const problems = getCodeProblems(track, t.id);
        return [t.id, getTopicStats(track, problems.map((p) => p.id))];
      })
    );
  }, [mounted, topics, track]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link
        href={CODE_SECTION.home}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Code
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Practice</p>
          <h1 className="mt-1 text-3xl font-semibold">{meta.label}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-sm">
          <p className="font-medium">{allProblems.length} problems</p>
          <p className="text-muted-foreground">{topics.length} topics</p>
          {mounted && (
            <p className="mt-1 text-primary">
              {trackStats.solved}/{trackStats.total} completed
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => {
          const count = getTopicProblemCount(track, topic.id);
          const stats = topicStats[topic.id];
          const pct = stats?.percent ?? 0;
          return (
            <Link
              key={topic.id}
              href={codeTopicPath(track, topic.id)}
              className="panel group flex flex-col p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold group-hover:text-primary">{topic.label}</h2>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {count} problem{count === 1 ? "" : "s"}
              </p>
              {mounted && stats && stats.total > 0 && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span>
                      {stats.solved}/{stats.total}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full bg-primary transition-all")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {mounted && topics.length > 1 && (
        <WeakAreasPanel track={track} topics={topics} topicStats={topicStats} />
      )}

      <div className="mt-8">
        <Link
          href={`${codeTrackPath(track)}/all`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Browse all {meta.label} problems →
        </Link>
      </div>
    </div>
  );
}

function WeakAreasPanel({
  track,
  topics,
  topicStats,
}: {
  track: CodeTrackId;
  topics: ReturnType<typeof getActiveTopics>;
  topicStats: Record<string, ReturnType<typeof getTopicStats>>;
}) {
  const weak = topics
    .map((t) => ({ topic: t, stats: topicStats[t.id] }))
    .filter((x) => x.stats && x.stats.total > 0 && x.stats.percent < 100)
    .sort((a, b) => (a.stats?.percent ?? 0) - (b.stats?.percent ?? 0))
    .slice(0, 3);

  if (weak.length === 0) return null;

  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/10 p-4">
      <p className="text-sm font-semibold">Suggested focus areas</p>
      <p className="mt-1 text-xs text-muted-foreground">Topics with the most room to grow</p>
      <ul className="mt-3 space-y-2">
        {weak.map(({ topic, stats }) => (
          <li key={topic.id}>
            <Link
              href={codeTopicPath(track, topic.id)}
              className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
            >
              <span>{topic.label}</span>
              <span className="text-xs text-muted-foreground">
                {stats!.solved}/{stats!.total} · {stats!.percent}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicProgressBar({
  solved,
  total,
  className,
}: {
  solved: number;
  total: number;
  className?: string;
}) {
  const pct = total ? Math.round((solved / total) * 100) : 0;
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progress</span>
        <span>
          {solved}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function TopicOverviewHeader({
  track,
  topicId,
}: {
  track: CodeTrackId;
  topicId: string;
}) {
  const problems = getCodeProblems(track, topicId);
  const topicMeta = getActiveTopics(track).find((t) => t.id === topicId);
  const breakdown = {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
    expert: problems.filter((p) => p.difficulty === "expert").length,
  };
  const concepts = [...new Set(problems.flatMap((p) => p.concepts))].slice(0, 8);
  const [stats, setStats] = React.useState({ solved: 0, total: problems.length, percent: 0 });

  React.useEffect(() => {
    const refresh = () =>
      setStats(getTopicStats(track, problems.map((p) => p.id)));
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, [problems, track]);

  if (!topicMeta) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-muted/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">
            {CODE_TRACKS.find((t) => t.id === track)?.label} · {getTopicLabel(track, topicId)}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{topicMeta.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{topicMeta.description}</p>
        </div>
        <div className="min-w-[140px] text-sm">
          <p className="font-medium">{problems.length} problems</p>
          <TopicProgressBar solved={stats.solved} total={stats.total} className="mt-2" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {breakdown.easy > 0 && <span>Easy {breakdown.easy}</span>}
        {breakdown.medium > 0 && <span>Medium {breakdown.medium}</span>}
        {breakdown.hard > 0 && <span>Hard {breakdown.hard}</span>}
        {breakdown.expert > 0 && <span>Expert {breakdown.expert}</span>}
      </div>
      {concepts.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-foreground">Concepts in this topic</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {concepts.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs">
                <CheckCircle2 className="size-3 text-primary/70" />
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

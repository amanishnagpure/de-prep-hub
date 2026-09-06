"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Database, Terminal, Zap } from "lucide-react";
import { categoryCardTints, type CategoryColorKey } from "@/design/colors";
import { CODE_TRACKS, codeTrackPath } from "@/lib/de-code/constants";
import {
  getActiveTopics,
  getCodeCatalogStats,
  getCodeProblems,
} from "@/lib/de-code/problem-bank";
import { getContinuePracticeActivity } from "@/lib/de-code/activity";
import { getTopicStats } from "@/lib/de-code/progress";
import type { CodeTrackId } from "@/lib/de-code/types";
import { PlatformProgress } from "@/components/ui/platform-progress";
import { SiteContainer } from "@/components/site-container";
import { cn } from "cn";
import * as React from "react";

const ICONS = {
  database: Database,
  code: Code2,
  zap: Zap,
  terminal: Terminal,
} as const;

const TRACK_TINT: Record<CodeTrackId, CategoryColorKey> = {
  sql: "sql",
  python: "python",
  pyspark: "pyspark",
  dsa: "dsa",
};

function TrackCard({ trackId }: { trackId: CodeTrackId }) {
  const track = CODE_TRACKS.find((t) => t.id === trackId)!;
  const tint = categoryCardTints[TRACK_TINT[trackId]];
  const Icon = ICONS[track.icon];
  const problems = getCodeProblems(trackId);
  const topics = getActiveTopics(trackId);
  const [percent, setPercent] = React.useState(0);
  const [solved, setSolved] = React.useState(0);

  React.useEffect(() => {
    const refresh = () => {
      const ids = getCodeProblems(trackId).map((p) => p.id);
      const stats = getTopicStats(trackId, ids);
      setPercent(stats.percent);
      setSolved(stats.solved);
    };
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, [trackId]);

  return (
    <Link
      href={codeTrackPath(trackId)}
      className="hub-card panel-interactive group flex h-full flex-col overflow-hidden p-0"
      style={{ ["--hub-bar" as string]: tint.bar, ["--card-accent" as string]: tint.accent }}
    >
      <span className="hub-card-accent-bar" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: tint.soft, color: tint.accent }}
          >
            <Icon className="size-5 opacity-75" />
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground/70 transition-opacity group-hover:opacity-100" />
        </div>

        <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {track.label}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{track.description}</p>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-border/80 bg-muted/20 px-2 py-2">
            <dt className="text-muted-foreground">Problems</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{problems.length}</dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/20 px-2 py-2">
            <dt className="text-muted-foreground">Topics</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{topics.length}</dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-muted/20 px-2 py-2">
            <dt className="text-muted-foreground">Done</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{solved}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <PlatformProgress value={percent} accent={tint.progress} subtle />
        </div>

        <span className="mt-4 text-sm text-muted-foreground">
          Practice {track.label} →
        </span>
      </div>
    </Link>
  );
}

export function CodeHub() {
  const stats = getCodeCatalogStats();
  const [mounted, setMounted] = React.useState(false);
  const [continueItem, setContinueItem] = React.useState<ReturnType<typeof getContinuePracticeActivity>>(null);

  React.useEffect(() => {
    setMounted(true);
    const refresh = () => setContinueItem(getContinuePracticeActivity());
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, []);

  return (
    <SiteContainer className="hub-page py-16 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="type-page-title text-foreground">Practice</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {stats.total} focused exercises across SQL, Python, PySpark, and DSA — pick a track and
          dive in.
        </p>
      </header>

      {mounted && continueItem && (
        <Link
          href={continueItem.href}
          className="hub-continue-card platform-continue-card group mt-12 block max-w-xl"
        >
          <p className="text-sm text-muted-foreground">{continueItem.subtitle}</p>
          <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
            {continueItem.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{continueItem.detail}</p>
        </Link>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {CODE_TRACKS.map((track) => (
          <TrackCard key={track.id} trackId={track.id} />
        ))}
      </div>
    </SiteContainer>
  );
}

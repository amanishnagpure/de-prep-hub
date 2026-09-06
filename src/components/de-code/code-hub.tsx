"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Database, Terminal, Zap } from "lucide-react";
import {
  CODE_SECTION,
  CODE_TRACKS,
  EXPERIENCE_LEVELS,
  codeTrackPath,
} from "@/lib/de-code/constants";
import {
  getActiveTopics,
  getCodeCatalogStats,
  getCodeProblems,
} from "@/lib/de-code/problem-bank";
import { getTopicStats } from "@/lib/de-code/progress";
import type { CodeTrackId } from "@/lib/de-code/types";
import { SiteContainer } from "@/components/site-container";
import { cn } from "cn";
import * as React from "react";

const ICONS = {
  database: Database,
  code: Code2,
  zap: Zap,
  terminal: Terminal,
} as const;

function TrackCard({ trackId }: { trackId: CodeTrackId }) {
  const track = CODE_TRACKS.find((t) => t.id === trackId)!;
  const Icon = ICONS[track.icon];
  const problems = getCodeProblems(trackId);
  const topics = getActiveTopics(trackId);
  const [completed, setCompleted] = React.useState(0);

  React.useEffect(() => {
    const refresh = () =>
      setCompleted(getTopicStats(trackId, problems.map((p) => p.id)).solved);
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, [problems, trackId]);

  return (
    <Link
      href={codeTrackPath(trackId)}
      className="panel group flex flex-col p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between">
        <div className="icon-tile size-11">
          <Icon className="size-5" />
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
      </div>
      <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">{track.label}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md bg-muted/30 px-2 py-2">
          <dt className="text-muted-foreground">Problems</dt>
          <dd className="mt-0.5 font-semibold">{problems.length}</dd>
        </div>
        <div className="rounded-md bg-muted/30 px-2 py-2">
          <dt className="text-muted-foreground">Topics</dt>
          <dd className="mt-0.5 font-semibold">{topics.length}</dd>
        </div>
        <div className="rounded-md bg-muted/30 px-2 py-2">
          <dt className="text-muted-foreground">Done</dt>
          <dd className="mt-0.5 font-semibold text-primary">{completed}</dd>
        </div>
      </dl>
      <span className={cn("mt-4 inline-flex text-sm font-medium text-primary")}>Practice {track.label} →</span>
    </Link>
  );
}

export function CodeHub() {
  const stats = getCodeCatalogStats();

  return (
    <SiteContainer className="py-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Section 3 · {CODE_SECTION.tagline}
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Code</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Structured Data Engineering practice: choose a track, pick a topic, then solve problems
          by difficulty and experience level. {stats.total} problems across {CODE_TRACKS.length} tracks.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Practice</span>
        <span>→</span>
        <span>Track</span>
        <span>→</span>
        <span>Topic</span>
        <span>→</span>
        <span>Solve</span>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXPERIENCE_LEVELS.map((level) => (
          <div key={level.id} className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
            <span className="font-medium">{level.label}</span>
            <span className="ml-2 text-muted-foreground">{level.years}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CODE_TRACKS.map((track) => (
          <TrackCard key={track.id} trackId={track.id} />
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Phase 2 foundation:</strong> topic taxonomy, tagged problems,
        topic pages, and progress by topic. Coming next: DE Challenge type, expanded bank (180), real
        PySpark execution, weak-area recommendations.
      </div>
    </SiteContainer>
  );
}

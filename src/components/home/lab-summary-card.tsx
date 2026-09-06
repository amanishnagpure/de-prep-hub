"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";

type TrackStat = { current: number; total: number; percent: number };

interface LabSummaryCardProps {
  title: string;
  description: string;
  href: string;
  tracks: readonly { key: string; label: string }[];
  stats: Record<string, TrackStat>;
}

export function LabSummaryCard({
  title,
  description,
  href,
  tracks,
  stats,
}: LabSummaryCardProps) {
  const overall =
    tracks.length > 0
      ? Math.round(
          tracks.reduce((sum, track) => sum + (stats[track.key]?.percent ?? 0), 0) /
            tracks.length
        )
      : 0;

  return (
    <Link href={href} className="panel group block overflow-hidden transition-colors hover:bg-muted/30">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="font-semibold transition-colors group-hover:text-primary">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-primary">
            {overall}%
          </span>
          <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </div>

      <div className="space-y-3 px-4 py-3">
        {tracks.map((track) => {
          const stat = stats[track.key];
          return (
            <div key={track.key}>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{track.label}</span>
                <span className="font-mono tabular-nums">
                  {stat.current}/{stat.total}
                </span>
              </div>
              <div className="progress-bar mt-1">
                <div className="progress-bar-fill" style={{ width: `${stat.percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}

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
  accentHover: string;
  barColor: string;
  tracks: readonly { key: string; label: string }[];
  stats: Record<string, TrackStat>;
}

export function LabSummaryCard({
  title,
  description,
  href,
  accentHover,
  barColor,
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
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        accentHover
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
            {title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{overall}%</span>
          <div className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {tracks.map((track) => {
          const stat = stats[track.key];
          return (
            <div key={track.key}>
              <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span>{track.label}</span>
                <span className="font-mono tabular-nums">
                  {stat.current}/{stat.total}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted/80">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", barColor)}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Link>
  );
}

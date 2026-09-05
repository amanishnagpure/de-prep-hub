"use client";

import Link from "next/link";
import { ArrowUpRight, Target } from "lucide-react";
import { cn } from "cn";

export type LabProgressEntry = {
  key: string;
  title: string;
  href: string;
  barColor: string;
  percent: number;
  detail: string;
};

interface HomeProgressPanelProps {
  labs: LabProgressEntry[];
}

export function HomeProgressPanel({ labs }: HomeProgressPanelProps) {
  const overall =
    labs.length > 0
      ? Math.round(labs.reduce((sum, lab) => sum + lab.percent, 0) / labs.length)
      : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm shadow-black/5 backdrop-blur-sm dark:shadow-black/20">
      <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Target className="size-3.5 text-primary" />
              Your progress
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">{overall}%</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Across all labs</p>
          </div>

          <div className="relative flex size-16 shrink-0 items-center justify-center">
            <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-muted/80"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - overall / 100)}`}
                className="text-primary transition-all duration-700"
              />
            </svg>
          </div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-chart-2 to-chart-4 transition-all duration-700"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-border/50">
        {labs.map((lab) => (
          <li key={lab.key}>
            <Link
              href={lab.href}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                    {lab.title}
                  </p>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {lab.percent}%
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{lab.detail}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted/80">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", lab.barColor)}
                    style={{ width: `${lab.percent}%` }}
                  />
                </div>
              </div>
              <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Target } from "lucide-react";

export type LabProgressEntry = {
  key: string;
  title: string;
  href: string;
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

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (overall / 100) * circumference;

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-border/60 bg-gradient-to-br from-primary/[0.06] to-transparent px-5 py-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Target className="size-4 text-primary" />
          Overall progress
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{overall}%</p>
          <svg className="size-20 -rotate-90" viewBox="0 0 80 80" aria-hidden>
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-primary transition-all duration-700"
            />
          </svg>
        </div>
        <div className="progress-bar mt-2">
          <div className="progress-bar-fill" style={{ width: `${overall}%` }} />
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {labs.map((lab) => (
          <li key={lab.key}>
            <Link
              href={lab.href}
              className="group block px-5 py-3.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                  {lab.title}
                </p>
                <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                  {lab.percent}%
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{lab.detail}</p>
              <div className="progress-bar mt-2">
                <div className="progress-bar-fill" style={{ width: `${lab.percent}%` }} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

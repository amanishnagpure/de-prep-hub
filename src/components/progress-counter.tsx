"use client";

import * as React from "react";
import { Target } from "lucide-react";
import { getCompletedCount } from "@/lib/progress";
import { cn } from "cn";

interface ProgressCounterProps {
  totalTopics: number;
}

export function ProgressCounter({ totalTopics }: ProgressCounterProps) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const update = () => setCount(getCompletedCount(totalTopics));
    update();
    window.addEventListener("progress-updated", update);
    return () => window.removeEventListener("progress-updated", update);
  }, [totalTopics]);

  const percentage = totalTopics > 0 ? Math.round((count / totalTopics) * 100) : 0;
  const hint =
    count === 0 ? "Start." : count === totalTopics ? "Shipped." : percentage >= 50 ? "Momentum." : "Building.";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 ">
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Target className="size-3.5 text-primary" />
            Progress
          </div>
          <p className="mt-3 text-4xl font-bold tracking-tight">
            {count}
            <span className="text-xl font-medium text-muted-foreground"> / {totalTopics}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </div>

        <div className="relative flex size-20 items-center justify-center">
          <svg className="size-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/80"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
              className="text-primary transition-all duration-700"
            />
          </svg>
          <span className="absolute text-sm font-bold">{percentage}%</span>
        </div>
      </div>

      <div className="relative mt-5 space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-muted/80">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-primary via-chart-2 to-chart-4 transition-all duration-700"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SqlPracticeWorkspace } from "@/components/sql/sql-practice-workspace";
import { SqlPlaygroundPanel } from "@/components/sql/sql-query-runner";
import type { SqlPracticeQuestion } from "@/lib/sql-practice";
import { cn } from "cn";

type PracticeTab = "problems" | "playground";

interface SqlPracticeTabsProps {
  questions: SqlPracticeQuestion[];
}

export function SqlPracticeTabs({ questions }: SqlPracticeTabsProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "playground" ? "playground" : "problems";
  const [tab, setTab] = React.useState<PracticeTab>(initialTab);

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-xl border border-border bg-muted/30 p-1">
        {(
          [
            ["problems", "Problems"],
            ["playground", "Playground"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              tab === key
                ? "bg-cyan-500/15 text-cyan-500 ring-1 ring-cyan-500/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "problems" ? (
        <SqlPracticeWorkspace questions={questions} />
      ) : (
        <SqlPlaygroundPanel />
      )}
    </div>
  );
}

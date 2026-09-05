"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { SqlInterviewQuestion } from "@/lib/sql-interview";
import type { LeetCodeSqlProblem } from "@/lib/leetcode-sql";
import { SqlInterviewFlashcards } from "@/components/sql/sql-interview-flashcards";
import { SqlLeetCodeTrack } from "@/components/sql/sql-leetcode-track";
import { SQL_ROUTES } from "@/lib/sql";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type InterviewTab = "leetcode" | "flashcards";

interface SqlInterviewHubProps {
  interviewQuestions: SqlInterviewQuestion[];
  leetcodeProblems: LeetCodeSqlProblem[];
}

export function SqlInterviewHub({
  interviewQuestions,
  leetcodeProblems,
}: SqlInterviewHubProps) {
  const searchParams = useSearchParams();
  const initialTab: InterviewTab =
    searchParams.get("tab") === "flashcards" ? "flashcards" : "leetcode";
  const [tab, setTab] = React.useState<InterviewTab>(initialTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-border/70 bg-muted/30 p-1">
          {(
            [
              ["leetcode", "LeetCode 50"],
              ["flashcards", "Flashcards Q&A"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                tab === key
                  ? tab === "leetcode"
                    ? "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20"
                    : "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <Link href={SQL_ROUTES.mock} className={buttonVariants({ size: "sm", variant: "outline" })}>
          Mock →
        </Link>
      </div>

      {tab === "leetcode" ? (
        <SqlLeetCodeTrack problems={leetcodeProblems} />
      ) : (
        <SqlInterviewFlashcards questions={interviewQuestions} />
      )}
    </div>
  );
}

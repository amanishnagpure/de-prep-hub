"use client";

import * as React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dices,
  RotateCcw,
  Search,
} from "lucide-react";
import type { SqlPracticeQuestion } from "@/lib/sql-practice";
import {
  pickRandomQuestions,
  QUIZ_SIZE,
} from "@/lib/sql-practice";
import { compareSql } from "@/lib/sql-compare";
import { formatSqlForDialect } from "@/lib/sql-dialect";
import { useSqlDialect } from "@/components/sql/sql-dialect-bar";
import { inferTablesFromQuestion } from "@/lib/sql-schemas";
import {
  getPracticeStats,
  isPracticeSolved,
  setPracticeSolved,
} from "@/lib/sql-progress";
import { SqlEditor } from "@/components/sql/sql-editor";
import { SqlSchemaPanel } from "@/components/sql/sql-schema-panel";
import { usePracticeQuestionId } from "@/hooks/use-practice-question-id";
import { SqlCodeBlock } from "@/components/sql/sql-code-block";
import { SqlQueryRunner } from "@/components/sql/sql-query-runner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type TierFilter = "all" | SqlPracticeQuestion["tier"];
type ViewMode = "browse" | "quiz";

const tierLabels: Record<TierFilter, string> = {
  all: "All",
  basic: "Basic",
  medium: "Medium",
  hard: "Hard",
};

const tierBadge: Record<SqlPracticeQuestion["tier"], string> = {
  basic: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  medium: "bg-muted font-medium text-foreground ring-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface SqlPracticeWorkspaceProps {
  questions: SqlPracticeQuestion[];
}

export function SqlPracticeWorkspace({ questions }: SqlPracticeWorkspaceProps) {
  const { dialect } = useSqlDialect();
  const [viewMode, setViewMode] = React.useState<ViewMode>("browse");
  const [tier, setTier] = React.useState<TierFilter>("all");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = usePracticeQuestionId(questions);
  const [quizQuestions, setQuizQuestions] = React.useState<SqlPracticeQuestion[]>([]);
  const [quizIndex, setQuizIndex] = React.useState(0);
  const [userSql, setUserSql] = React.useState("");
  const [showSolution, setShowSolution] = React.useState(false);
  const [compareResult, setCompareResult] = React.useState<ReturnType<typeof compareSql> | null>(
    null
  );
  const [solvedIds, setSolvedIds] = React.useState<number[]>([]);
  const [stats, setStats] = React.useState({ solved: 0, total: questions.length, percent: 0 });

  const filtered = React.useMemo(() => {
    return questions.filter((question) => {
      const tierMatch = tier === "all" || question.tier === tier;
      const searchMatch =
        !search ||
        question.title.toLowerCase().includes(search.toLowerCase()) ||
        question.body.toLowerCase().includes(search.toLowerCase());
      return tierMatch && searchMatch;
    });
  }, [questions, tier, search]);

  const activeQuestion =
    viewMode === "quiz"
      ? quizQuestions[quizIndex]
      : questions.find((question) => question.id === selectedId) ?? questions[0];

  const schemas = activeQuestion ? inferTablesFromQuestion(activeQuestion) : [];

  const refreshSolved = React.useCallback(() => {
    setSolvedIds(questions.filter((q) => isPracticeSolved(q.id)).map((q) => q.id));
    setStats(getPracticeStats(questions.length));
  }, [questions]);

  React.useEffect(() => {
    refreshSolved();
    window.addEventListener("sql-progress-updated", refreshSolved);
    return () => window.removeEventListener("sql-progress-updated", refreshSolved);
  }, [refreshSolved]);

  React.useEffect(() => {
    setUserSql("");
    setShowSolution(false);
    setCompareResult(null);
  }, [activeQuestion?.id, dialect]);

  const referenceSolution = activeQuestion
    ? formatSqlForDialect(activeQuestion.solution, dialect)
    : "";

  const startQuiz = () => {
    const picked = pickRandomQuestions(QUIZ_SIZE, tier);
    setQuizQuestions(picked);
    setQuizIndex(0);
    setViewMode("quiz");
  };

  const exitQuiz = () => {
    setViewMode("browse");
    setQuizQuestions([]);
  };

  const handleCompare = () => {
    if (!activeQuestion) return;
    const result = compareSql(userSql, activeQuestion.solution, dialect);
    setCompareResult(result);
    if (result.match || result.similarity >= 85) {
      setPracticeSolved(activeQuestion.id, true);
    }
  };

  const markSolved = () => {
    if (!activeQuestion) return;
    setPracticeSolved(activeQuestion.id, true);
    setShowSolution(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {stats.solved}/{stats.total}
          {viewMode === "quiz" && ` · Q${quizIndex + 1}/${quizQuestions.length}`}
        </span>
        {viewMode === "quiz" ? (
          <button type="button" onClick={exitQuiz} className={buttonVariants({ size: "sm", variant: "outline" })}>
            Exit
          </button>
        ) : (
          <button type="button" onClick={startQuiz} className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
            <Dices className="size-3.5" />
            Random 10
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        {viewMode === "browse" && (
          <aside className="space-y-3 xl:max-h-[75vh] xl:overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search problems..."
                className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none ring-cyan-500/30 focus:ring-2"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(tierLabels) as TierFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTier(key)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    tier === key
                      ? "bg-muted font-medium text-foreground ring-1 ring-cyan-500/20"
                      : "bg-muted/70 text-muted-foreground"
                  )}
                >
                  {tierLabels[key]}
                </button>
              ))}
            </div>
            <div className="space-y-1">
              {filtered.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setSelectedId(question.id)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    selectedId === question.id
                      ? "bg-muted font-medium text-foreground"
                      : "hover:bg-muted/60"
                  )}
                >
                  {solvedIds.includes(question.id) ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : (
                    <span className="mt-0.5 w-4 shrink-0 font-mono text-xs text-muted-foreground">
                      {question.id}
                    </span>
                  )}
                  <span className="line-clamp-2">{question.title}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {activeQuestion && (
          <section className="panel p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">#{activeQuestion.id}</span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1",
                  tierBadge[activeQuestion.tier]
                )}
              >
                {activeQuestion.tier}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight">{activeQuestion.title}</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {activeQuestion.body}
            </p>

            <div className="mt-5">
              <SqlEditor value={userSql} onChange={setUserSql} height={200} />
              <SqlQueryRunner query={userSql} className="mt-3" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={handleCompare} className={buttonVariants({ size: "sm" })}>
                Compare
              </button>
              <button
                type="button"
                onClick={() => setShowSolution(true)}
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                Solution
              </button>
              <button
                type="button"
                onClick={markSolved}
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                Mark solved
              </button>
            </div>

            {compareResult && (
              <div
                className={cn(
                  "mt-4 rounded-xl border px-4 py-3 text-sm",
                  compareResult.match
                    ? "border-emerald-500/30 bg-emerald-500/10 text-primary"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}
              >
                <p className="font-semibold">
                  {compareResult.similarity}% similarity — {compareResult.feedback}
                </p>
              </div>
            )}

            {showSolution && (
              <div className="mt-4">
                <SqlCodeBlock
                  code={referenceSolution}
                  language={dialect === "mysql" ? "mysql" : "sql"}
                />
              </div>
            )}

            {viewMode === "quiz" && (
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={quizIndex === 0}
                  onClick={() => setQuizIndex((value) => value - 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </button>
                {quizIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setQuizIndex((value) => value + 1)}
                    className={cn(buttonVariants({ size: "sm" }), "gap-1")}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={exitQuiz}
                    className={cn(buttonVariants({ size: "sm" }), "gap-1")}
                  >
                    <RotateCcw className="size-4" />
                    Finish
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {activeQuestion && <SqlSchemaPanel tables={schemas} />}
      </div>
    </div>
  );
}

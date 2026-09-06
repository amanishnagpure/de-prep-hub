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
import type { CloudPracticeQuestion } from "@/lib/cloud-practice";
import { LC_TIER_BADGE } from "@/lib/lc-styles";
import { pickRandomQuestions, QUIZ_SIZE } from "@/lib/cloud-practice";
import { CLOUD_PRACTICE_CATEGORIES } from "@/lib/cloud";
import {
  getPracticeStats,
  isPracticeSolved,
  setPracticeSolved,
} from "@/lib/cloud-progress";
import { usePracticeQuestionId } from "@/hooks/use-practice-question-id";
import { SqlCodeBlock } from "@/components/sql/sql-code-block";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { usePracticeScrollToEditor } from "@/hooks/use-practice-scroll";

type TierFilter = "all" | CloudPracticeQuestion["tier"];
type CategoryFilter = "all" | CloudPracticeQuestion["category"];
type ViewMode = "browse" | "quiz";

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All",
  ...CLOUD_PRACTICE_CATEGORIES,
};

const tierLabels: Record<TierFilter, string> = {
  all: "All",
  basic: "Basic",
  medium: "Medium",
  hard: "Hard",
};

const tierBadge = LC_TIER_BADGE;

interface CloudPracticeWorkspaceProps {
  questions: CloudPracticeQuestion[];
}

export function CloudPracticeWorkspace({ questions }: CloudPracticeWorkspaceProps) {
  usePracticeScrollToEditor();
  const [viewMode, setViewMode] = React.useState<ViewMode>("browse");
  const [tier, setTier] = React.useState<TierFilter>("all");
  const [category, setCategory] = React.useState<CategoryFilter>("all");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = usePracticeQuestionId(questions);
  const [quizQuestions, setQuizQuestions] = React.useState<CloudPracticeQuestion[]>([]);
  const [quizIndex, setQuizIndex] = React.useState(0);
  const [userNotes, setUserNotes] = React.useState("");
  const [showSolution, setShowSolution] = React.useState(false);
  const [solvedIds, setSolvedIds] = React.useState<number[]>([]);
  const [stats, setStats] = React.useState({ solved: 0, total: questions.length, percent: 0 });

  const filtered = React.useMemo(() => {
    return questions.filter((question) => {
      const tierMatch = tier === "all" || question.tier === tier;
      const categoryMatch = category === "all" || question.category === category;
      const searchMatch =
        !search ||
        question.title.toLowerCase().includes(search.toLowerCase()) ||
        question.body.toLowerCase().includes(search.toLowerCase());
      return tierMatch && categoryMatch && searchMatch;
    });
  }, [questions, tier, category, search]);

  const activeQuestion =
    viewMode === "quiz"
      ? quizQuestions[quizIndex]
      : questions.find((question) => question.id === selectedId) ?? questions[0];

  const refreshSolved = React.useCallback(() => {
    setSolvedIds(questions.filter((q) => isPracticeSolved(q.id)).map((q) => q.id));
    setStats(getPracticeStats(questions.length));
  }, [questions]);

  React.useEffect(() => {
    refreshSolved();
    window.addEventListener("cloud-progress-updated", refreshSolved);
    return () => window.removeEventListener("cloud-progress-updated", refreshSolved);
  }, [refreshSolved]);

  React.useEffect(() => {
    setUserNotes("");
    setShowSolution(false);
  }, [activeQuestion?.id]);

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

  const markSolved = () => {
    if (!activeQuestion) return;
    setPracticeSolved(activeQuestion.id, true);
    setShowSolution(true);
  };

  return (
    <div className="space-y-4">
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

      <div className="grid gap-4 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:items-start">
        {viewMode === "browse" && (
          <aside className="order-2 space-y-3 lg:order-1 lg:sticky lg:top-12 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search scenarios..."
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
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(categoryLabels) as CategoryFilter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    category === key
                      ? "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20"
                      : "bg-muted/70 text-muted-foreground"
                  )}
                >
                  {categoryLabels[key]}
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
          <section id="practice-editor" className="panel order-1 p-5 sm:p-6 lg:order-2 lg:sticky lg:top-12 lg:self-start lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">#{activeQuestion.id}</span>
              <span
                className={cn(
                  "lc-badge",
                  tierBadge[activeQuestion.tier]
                )}
              >
                {activeQuestion.tier}
              </span>
              <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {CLOUD_PRACTICE_CATEGORIES[activeQuestion.category]}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight">{activeQuestion.title}</h3>
            <p className="mt-3 max-h-32 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:max-h-40">
              {activeQuestion.body}
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Your approach
              </label>
              <textarea
                value={userNotes}
                onChange={(event) => setUserNotes(event.target.value)}
                placeholder="Sketch pipeline steps, linked services, triggers, folder paths..."
                rows={6}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none ring-cyan-500/30 focus:ring-2"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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
                className={cn(buttonVariants({ size: "sm" }), "bg-cyan-600 hover:bg-cyan-600/90")}
              >
                Mark solved
              </button>
            </div>

            {showSolution && (
              <div className="mt-4">
                <SqlCodeBlock code={activeQuestion.solution} language="text" showLineNumbers={false} />
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
      </div>
    </div>
  );
}

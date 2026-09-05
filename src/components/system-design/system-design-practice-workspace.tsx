"use client";

import * as React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Dices,
  Eye,
  EyeOff,
  RotateCcw,
  Search,
} from "lucide-react";
import type { SystemDesignPracticeQuestion } from "@/lib/system-design-practice";
import { pickRandomQuestions, QUIZ_SIZE } from "@/lib/system-design-practice";
import { SYSTEM_DESIGN_PRACTICE_CATEGORIES } from "@/lib/system-design";
import {
  getPracticeStats,
  isPracticeSolved,
  setPracticeSolved,
} from "@/lib/system-design-progress";
import { usePracticeQuestionId } from "@/hooks/use-practice-question-id";
import { SystemDesignMarkdownRenderer } from "@/components/system-design/system-design-markdown-renderer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type TierFilter = "all" | SystemDesignPracticeQuestion["tier"];
type CategoryFilter = "all" | SystemDesignPracticeQuestion["category"];
type ViewMode = "browse" | "quiz";

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All",
  ...SYSTEM_DESIGN_PRACTICE_CATEGORIES,
};

const tierLabels: Record<TierFilter, string> = {
  all: "All",
  basic: "Basic",
  medium: "Medium",
  hard: "Hard",
};

const tierBadge: Record<SystemDesignPracticeQuestion["tier"], string> = {
  basic: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  medium: "bg-muted font-medium text-foreground ring-violet-500/20",
  hard: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface SystemDesignPracticeWorkspaceProps {
  questions: SystemDesignPracticeQuestion[];
}

export function SystemDesignPracticeWorkspace({ questions }: SystemDesignPracticeWorkspaceProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("browse");
  const [tier, setTier] = React.useState<TierFilter>("all");
  const [category, setCategory] = React.useState<CategoryFilter>("all");
  const [search, setSearch] = React.useState("");
  const [selectedId, setSelectedId] = usePracticeQuestionId(questions);
  const [quizQuestions, setQuizQuestions] = React.useState<SystemDesignPracticeQuestion[]>([]);
  const [quizIndex, setQuizIndex] = React.useState(0);
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
    window.addEventListener("system-design-progress-updated", refreshSolved);
    return () => window.removeEventListener("system-design-progress-updated", refreshSolved);
  }, [refreshSolved]);

  React.useEffect(() => {
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
            Random 5
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {viewMode === "browse" && (
          <aside className="space-y-3 xl:max-h-[75vh] xl:overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search scenarios..."
                className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none ring-violet-500/30 focus:ring-2"
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
                      ? "bg-muted font-medium text-foreground ring-1 ring-violet-500/20"
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
                      ? "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20"
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
              <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {SYSTEM_DESIGN_PRACTICE_CATEGORIES[activeQuestion.category]}
              </span>
            </div>

            <h3 className="mt-3 text-xl font-semibold tracking-tight">{activeQuestion.title}</h3>

            <div className="mt-4 rounded-xl border border-violet-500/20 bg-gradient-to-br from-card via-card/90 to-violet-500/5 p-5">
              <p className="text-xs font-medium text-violet-400">Scenario</p>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <SystemDesignMarkdownRenderer content={activeQuestion.body} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowSolution((value) => !value)}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
              >
                {showSolution ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                {showSolution ? "Hide solution" : "Reveal solution"}
              </button>
              <button
                type="button"
                onClick={markSolved}
                className={cn(buttonVariants({ size: "sm" }), "bg-violet-600 hover:bg-violet-600/90")}
              >
                Mark solved
              </button>
            </div>

            {showSolution && (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-xs font-medium text-primary">
                  Sample design
                </p>
                <div className="mt-3 text-sm leading-relaxed">
                  <SystemDesignMarkdownRenderer content={activeQuestion.solution} />
                </div>
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

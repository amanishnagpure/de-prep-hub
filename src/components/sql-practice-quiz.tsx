"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Dices,
  ExternalLink,
  Play,
  RotateCcw,
  Timer,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  getSqlPracticeQuestions,
  pickRandomQuestions,
  QUIZ_SIZE,
  TIMED_SESSION_SECONDS,
  QUESTION_TIMER_SECONDS,
  type SqlPracticeQuestion,
} from "@/lib/sql-practice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type QuizMode = "random" | "timed" | null;
type TierFilter = "all" | SqlPracticeQuestion["tier"];

const tierLabels: Record<TierFilter, string> = {
  all: "All levels",
  basic: "Basic only",
  medium: "Medium only",
  hard: "Hard only",
};

const tierBadge: Record<SqlPracticeQuestion["tier"], string> = {
  basic: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  medium: "bg-muted font-medium text-foreground ring-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SqlPracticeQuiz() {
  const [mode, setMode] = React.useState<QuizMode>(null);
  const [tier, setTier] = React.useState<TierFilter>("all");
  const [questions, setQuestions] = React.useState<SqlPracticeQuestion[]>([]);
  const [index, setIndex] = React.useState(0);
  const [showSolution, setShowSolution] = React.useState(false);
  const [sessionSeconds, setSessionSeconds] = React.useState(TIMED_SESSION_SECONDS);
  const [questionSeconds, setQuestionSeconds] = React.useState(QUESTION_TIMER_SECONDS);
  const [sessionExpired, setSessionExpired] = React.useState(false);

  const current = questions[index];
  const total = getSqlPracticeQuestions().length;

  const startQuiz = (quizMode: QuizMode) => {
    const picked = pickRandomQuestions(QUIZ_SIZE, tier);
    setQuestions(picked);
    setIndex(0);
    setShowSolution(false);
    setMode(quizMode);
    setSessionSeconds(TIMED_SESSION_SECONDS);
    setQuestionSeconds(QUESTION_TIMER_SECONDS);
    setSessionExpired(false);
  };

  const exitQuiz = () => {
    setMode(null);
    setQuestions([]);
    setShowSolution(false);
    setSessionExpired(false);
  };

  React.useEffect(() => {
    if (!mode || !current) return;

    const interval = window.setInterval(() => {
      if (mode === "timed") {
        setSessionSeconds((s) => {
          if (s <= 1) {
            setSessionExpired(true);
            return 0;
          }
          return s - 1;
        });
      }

      setQuestionSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode, current]);

  React.useEffect(() => {
    setShowSolution(false);
    setQuestionSeconds(QUESTION_TIMER_SECONDS);
  }, [index]);

  const goNext = () => {
    if (index < questions.length - 1) setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  if (mode && current) {
    const sessionLow = mode === "timed" && sessionSeconds <= 120;
    const questionLow = questionSeconds <= 30;

    return (
      <section className="mt-8 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card/80 to-card/60 p-6 shadow-lg shadow-primary/5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-primary">
              {mode === "timed" ? "20-min timed session" : "Random 10 quiz"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Question {index + 1} of {questions.length}
            </h2>
          </div>
          <button
            type="button"
            onClick={exitQuiz}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            aria-label="Exit quiz"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {mode === "timed" && (
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium",
                sessionLow
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-background/50"
              )}
            >
              <Timer className="size-4" />
              Session: {formatTime(sessionSeconds)}
            </div>
          )}
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium",
              questionLow
                ? "border-amber-500/40 bg-muted font-medium text-foreground"
                : "border-border bg-background/50"
            )}
          >
            <Clock className="size-4" />
            This question: {formatTime(questionSeconds)}
          </div>
        </div>

        {sessionExpired && (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Time&apos;s up! Review solutions and finish remaining questions at your own pace.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "size-8 rounded-lg text-xs font-semibold transition-colors",
                i === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/80 text-muted-foreground hover:bg-muted"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <article className="mt-6 rounded-2xl border border-border bg-background/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">#{current.id}</span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1",
                tierBadge[current.tier]
              )}
            >
              {current.tier}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold tracking-tight">{current.title}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {current.body}
          </p>

          <label className="mt-5 block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your query (scratchpad)
            </span>
            <textarea
              className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-border bg-muted/30 p-3 font-mono text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="Write your SQL here before revealing the solution..."
              spellCheck={false}
            />
          </label>

          {!showSolution ? (
            <button
              type="button"
              onClick={() => setShowSolution(true)}
              className={cn(buttonVariants(), "mt-4")}
            >
              Reveal solution
            </button>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border/80 bg-[oklch(0.12_0.02_250)] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Solution
              </p>
              <pre className="font-mono text-sm text-foreground">
                <code>{current.solution}</code>
              </pre>
            </div>
          )}

          <Link
            href={`#${current.anchor}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            View in full list
            <ExternalLink className="size-3.5" />
          </Link>
        </article>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className={cn(buttonVariants({ variant: "outline" }), "gap-1")}
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>

          {index < questions.length - 1 ? (
            <button type="button" onClick={goNext} className={cn(buttonVariants(), "gap-1")}>
              Next
              <ChevronRight className="size-4" />
            </button>
          ) : (
            <button type="button" onClick={exitQuiz} className={cn(buttonVariants(), "gap-1")}>
              <RotateCcw className="size-4" />
              Finish quiz
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 panel p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-primary">
            Interactive practice
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight">Quiz & timer modes</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Pick 10 random problems from {total} total. Timed mode gives you 20 minutes for the
            full set (~2 min per question).
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(tierLabels) as TierFilter[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTier(key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              tier === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted/80 text-muted-foreground hover:bg-muted"
            )}
          >
            {tierLabels[key]}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => startQuiz("random")}
          className="group flex flex-col items-start rounded-2xl border border-border bg-background/50 p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Dices className="size-5" />
          </div>
          <h3 className="mt-4 font-semibold group-hover:text-primary">Random 10 quiz</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            10 random questions, 2-min soft timer per question, no session limit.
          </p>
          <span className={cn(buttonVariants({ size: "sm" }), "mt-4 gap-1")}>
            <Play className="size-3.5" />
            Start quiz
          </span>
        </button>

        <button
          type="button"
          onClick={() => startQuiz("timed")}
          className="group flex flex-col items-start rounded-2xl border border-border bg-background/50 p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex size-11 items-center justify-center rounded-xl bg-muted font-medium text-foreground">
            <Timer className="size-5" />
          </div>
          <h3 className="mt-4 font-semibold group-hover:text-primary">20-minute timed session</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Interview simulation — 10 questions, 20-minute countdown, ~2 min each.
          </p>
          <span className={cn(buttonVariants({ size: "sm" }), "mt-4 gap-1")}>
            <Play className="size-3.5" />
            Start timed session
          </span>
        </button>
      </div>
    </section>
  );
}

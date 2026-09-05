"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Shuffle,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react";
import type { SqlInterviewQuestion } from "@/lib/sql-interview";
import {
  getInterviewConfidence,
  getInterviewStats,
  setInterviewConfidence,
  type InterviewConfidence,
} from "@/lib/sql-progress";
import { SqlMarkdownRenderer } from "@/components/sql/sql-markdown-renderer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type FilterMode = "all" | "needs-review" | "know" | "unsure" | "dont";
type StudyMode = "flashcard" | "mock";

const CONFIDENCE_STYLES: Record<InterviewConfidence, string> = {
  know: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  unsure: "bg-muted font-medium text-foreground ring-amber-500/20",
  dont: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface SqlInterviewFlashcardsProps {
  questions: SqlInterviewQuestion[];
}

export function SqlInterviewFlashcards({ questions }: SqlInterviewFlashcardsProps) {
  const [mode, setMode] = React.useState<StudyMode>("flashcard");
  const [filter, setFilter] = React.useState<FilterMode>("all");
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [deck, setDeck] = React.useState(questions);
  const [mockSeconds, setMockSeconds] = React.useState(15 * 60);
  const [confidenceMap, setConfidenceMap] = React.useState<Record<number, InterviewConfidence>>({});
  const [stats, setStats] = React.useState({
    know: 0,
    reviewed: 0,
    total: questions.length,
    percent: 0,
  });

  const refreshConfidence = React.useCallback(() => {
    const map: Record<number, InterviewConfidence> = {};
    questions.forEach((question) => {
      const value = getInterviewConfidence(question.id);
      if (value) map[question.id] = value;
    });
    setConfidenceMap(map);
    const interviewStats = getInterviewStats(questions.length);
    setStats({
      know: interviewStats.know,
      reviewed: interviewStats.reviewed,
      total: interviewStats.total,
      percent: interviewStats.percent,
    });
  }, [questions]);

  React.useEffect(() => {
    refreshConfidence();
    window.addEventListener("sql-progress-updated", refreshConfidence);
    return () => window.removeEventListener("sql-progress-updated", refreshConfidence);
  }, [refreshConfidence]);

  React.useEffect(() => {
    let filtered = [...questions];

    if (filter === "needs-review") {
      filtered = questions.filter((question) => {
        const value = confidenceMap[question.id];
        return !value || value === "unsure" || value === "dont";
      });
    } else if (filter !== "all") {
      filtered = questions.filter((question) => confidenceMap[question.id] === filter);
    }

    setDeck(filtered.length > 0 ? filtered : questions);
    setIndex(0);
    setFlipped(false);
  }, [filter, questions, confidenceMap]);

  React.useEffect(() => {
    if (mode !== "mock") return;

    const interval = window.setInterval(() => {
      setMockSeconds((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode]);

  const current = deck[index];

  const startMock = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    setDeck(shuffled);
    setIndex(0);
    setFlipped(false);
    setMode("mock");
    setMockSeconds(15 * 60);
  };

  const shuffleDeck = () => {
    setDeck((items) => [...items].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  const setConfidence = (value: InterviewConfidence) => {
    if (!current) return;
    setInterviewConfidence(current.id, value);
    setFlipped(true);
    window.setTimeout(() => {
      if (index < deck.length - 1) {
        setIndex((value) => value + 1);
        setFlipped(false);
      }
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {stats.know}/{stats.total} know
          {mode === "mock" && ` · ${formatTime(mockSeconds)}`}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={shuffleDeck}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
          >
            <Shuffle className="size-3.5" />
            Shuffle
          </button>
          <button
            type="button"
            onClick={startMock}
            className={cn(buttonVariants({ size: "sm" }), "gap-1")}
          >
            <Timer className="size-3.5" />
            Mock 10
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["needs-review", "Needs review"],
              ["know", "Know"],
              ["unsure", "Unsure"],
              ["dont", "Don't know"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                filter === key
                  ? "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20"
                  : "bg-muted/70 text-muted-foreground"
              )}
            >
              {label}
            </button>
          ))}
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="min-h-[320px] rounded-3xl border border-border bg-gradient-to-br from-card via-card/90 to-violet-500/5 p-8 shadow-xl">
          {!flipped ? (
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Question {index + 1} of {deck.length}
              </p>
              {confidenceMap[current.id] && (
                <span
                  className={cn(
                    "mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1",
                    CONFIDENCE_STYLES[confidenceMap[current.id]]
                  )}
                >
                  {confidenceMap[current.id]}
                </span>
              )}
              <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-tight">
                {current.question}
              </h3>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium text-violet-400">
                Answer
              </p>
              <div className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <SqlMarkdownRenderer content={current.answer} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => {
            setIndex((value) => value - 1);
            setFlipped(false);
          }}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConfidence("dont")}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
          >
            <ThumbsDown className="size-3.5" />
            Don&apos;t know
          </button>
          <button
            type="button"
            onClick={() => setConfidence("unsure")}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
          >
            <RotateCcw className="size-3.5" />
            Unsure
          </button>
          <button
            type="button"
            onClick={() => setConfidence("know")}
            className={cn(buttonVariants({ size: "sm" }), "gap-1")}
          >
            <ThumbsUp className="size-3.5" />
            Know it
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFlipped((value) => !value)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
        >
          {flipped ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          {flipped ? "Hide" : "Reveal"}
        </button>

        <button
          type="button"
          disabled={index >= deck.length - 1}
          onClick={() => {
            setIndex((value) => value + 1);
            setFlipped(false);
          }}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

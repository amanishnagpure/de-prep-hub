"use client";

import * as React from "react";
import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import {
  buildMockSession,
  MOCK_SESSION_SECONDS,
  MOCK_TYPE_LABELS,
  type MockSessionItem,
  type MockSessionPools,
} from "@/lib/spark-mock-session";
import { SparkCodeBlock } from "@/components/spark/spark-code-block";
import { SparkMarkdownRenderer } from "@/components/spark/spark-markdown-renderer";
import { buttonVariants } from "@/components/ui/button";
import { SPARK_ROUTES } from "@/lib/spark";
import { recordMockSessionComplete } from "@/lib/spark-progress";
import { cn } from "cn";

type SessionPhase = "intro" | "active" | "done";
type ItemStatus = "pending" | "done" | "skip";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const typeIcon = {
  conceptual: Brain,
  practice: Code2,
};

export function SparkMockInterview({ pools }: { pools: MockSessionPools }) {
  const [phase, setPhase] = React.useState<SessionPhase>("intro");
  const [items, setItems] = React.useState<MockSessionItem[]>([]);
  const [index, setIndex] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(MOCK_SESSION_SECONDS);
  const [statuses, setStatuses] = React.useState<Record<string, ItemStatus>>({});
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [userCode, setUserCode] = React.useState("");
  const recordedComplete = React.useRef(false);

  const current = items[index];
  const doneCount = Object.values(statuses).filter((s) => s === "done").length;

  const start = () => {
    const session = buildMockSession(pools);
    setItems(session);
    setIndex(0);
    setSecondsLeft(MOCK_SESSION_SECONDS);
    setStatuses({});
    setShowAnswer(false);
    setUserCode("");
    recordedComplete.current = false;
    setPhase("active");
  };

  React.useEffect(() => {
    if (phase !== "active") return;

    const interval = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setPhase("done");
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  React.useEffect(() => {
    if (phase === "done" && !recordedComplete.current) {
      recordedComplete.current = true;
      recordMockSessionComplete();
    }
  }, [phase]);

  React.useEffect(() => {
    setShowAnswer(false);
    setUserCode("");
  }, [index]);

  const setStatus = (status: ItemStatus) => {
    if (!current) return;
    setStatuses((prev) => ({ ...prev, [current.id]: status }));
    if (index < items.length - 1) {
      setIndex((value) => value + 1);
    } else {
      setPhase("done");
    }
  };

  if (phase === "intro") {
    return (
      <section className="panel p-6">
        <p className="text-muted-foreground">45 min · 5 conceptual · 3 PySpark coding</p>
        <button type="button" onClick={start} className={cn(buttonVariants(), "mt-4 gap-2")}>
          <Play className="size-4" />
          Start mock interview
        </button>
      </section>
    );
  }

  if (phase === "done" || !current) {
    return (
      <section className="rounded-3xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h2 className="mt-4 text-2xl font-bold">Session complete</h2>
        <p className="mt-2 text-muted-foreground">
          {doneCount}/{items.length} · {formatTime(MOCK_SESSION_SECONDS - secondsLeft)}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={start} className={cn(buttonVariants(), "gap-2")}>
            <RotateCcw className="size-4" />
            New session
          </button>
          <Link href={SPARK_ROUTES.home} className={buttonVariants({ variant: "outline" })}>
            Dashboard
          </Link>
        </div>

        <div className="mt-8 text-left">
          <h3 className="mb-3 font-semibold">Skipped / review later</h3>
          <div className="space-y-2">
            {items
              .filter((item) => statuses[item.id] !== "done")
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="ml-2 text-muted-foreground">({MOCK_TYPE_LABELS[item.type]})</span>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  const Icon = typeIcon[current.type];
  const lowTime = secondsLeft <= 300;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 panel p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              lowTime ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-400"
            )}
          >
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Time remaining
            </p>
            <p className={cn("text-xl font-bold tabular-nums", lowTime && "text-destructive")}>
              {formatTime(secondsLeft)}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Question {index + 1} / {items.length} · {doneCount} done
        </div>
        <button
          type="button"
          onClick={() => setPhase("done")}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
        >
          <X className="size-3.5" />
          End early
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "size-8 rounded-lg text-xs font-semibold",
              i === index
                ? "bg-orange-500 text-white"
                : statuses[item.id] === "done"
                  ? "bg-emerald-500/20 text-primary"
                  : statuses[item.id] === "skip"
                    ? "bg-muted text-muted-foreground"
                    : "bg-muted/80 text-muted-foreground"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <article className="panel p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Icon className="size-4 text-orange-400" />
          <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-orange-400 ring-1 ring-orange-500/20">
            {MOCK_TYPE_LABELS[current.type]}
          </span>
          <span className="text-xs text-muted-foreground">~{current.suggestedMinutes} min</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight">{current.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.body}</p>

        {current.type === "practice" && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your PySpark code
            </p>
            <textarea
              value={userCode}
              onChange={(event) => setUserCode(event.target.value)}
              spellCheck={false}
              className="min-h-[160px] w-full resize-y rounded-xl border border-border bg-[oklch(0.12_0.02_250)] p-3 font-mono text-sm outline-none ring-orange-500/30 focus:ring-2"
              placeholder="from pyspark.sql import functions as F\n\ndef solve(df):\n    ..."
            />
          </div>
        )}

        {!showAnswer ? (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
          >
            Reveal reference answer
          </button>
        ) : current.answer ? (
          <div className="mt-6">
            {current.type === "conceptual" ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
                <SparkMarkdownRenderer content={current.answer} />
              </div>
            ) : (
              <SparkCodeBlock code={current.answer} />
            )}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((value) => value - 1)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
          >
            <ChevronLeft className="size-4" />
            Back
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStatus("skip")}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => setStatus("done")}
              className={cn(buttonVariants({ size: "sm" }), "gap-1")}
            >
              <CheckCircle2 className="size-3.5" />
              Done — next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

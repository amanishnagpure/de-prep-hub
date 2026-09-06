"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { PythonCodingDifficulty, PythonCodingPattern } from "@/lib/python-coding";
import {
  getPythonCodingProblems,
  PYTHON_CODING_MUST_DO,
  PYTHON_CODING_PATTERNS,
} from "@/lib/python-coding";
import {
  getCodingConfidence,
  getCodingStats,
  isCodingSolved,
  setCodingConfidence,
  setCodingSolved,
  type InterviewConfidence,
} from "@/lib/python-progress";
import { PythonEditor } from "@/components/python/python-editor";
import { PythonCodeBlock } from "@/components/python/python-code-block";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { usePracticeScrollToEditor } from "@/hooks/use-practice-scroll";

type DifficultyFilter = "all" | PythonCodingDifficulty;
type PatternFilter = "all" | PythonCodingPattern;
type MustDoFilter = "all" | "must-do" | "stretch" | "needs-review";

const difficultyBadge: Record<PythonCodingDifficulty, string> = {
  easy: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  medium: "bg-muted font-medium text-foreground ring-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

const CONFIDENCE_STYLES: Record<InterviewConfidence, string> = {
  know: "bg-emerald-500/10 text-primary ring-emerald-500/20",
  unsure: "bg-muted font-medium text-foreground ring-amber-500/20",
  dont: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface PythonCodingTrackProps {
  problems: ReturnType<typeof getPythonCodingProblems>;
  initialPattern?: string;
  initialReview?: boolean;
  selectedSlug?: string;
  onSelectSlug?: (slug: string) => void;
}

export function PythonCodingTrack({
  problems,
  initialPattern,
  initialReview = false,
  selectedSlug: selectedSlugProp,
  onSelectSlug,
}: PythonCodingTrackProps) {
  usePracticeScrollToEditor();
  const [search, setSearch] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<DifficultyFilter>("all");
  const [pattern, setPattern] = React.useState<PatternFilter>(
    initialPattern && initialPattern in PYTHON_CODING_PATTERNS
      ? (initialPattern as PythonCodingPattern)
      : "all"
  );
  const [mustDoFilter, setMustDoFilter] = React.useState<MustDoFilter>(
    initialReview ? "needs-review" : "all"
  );
  const [internalSlug, setInternalSlug] = React.useState(problems[0]?.slug ?? "");
  const selectedSlug = selectedSlugProp ?? internalSlug;

  const selectSlug = React.useCallback(
    (slug: string) => {
      onSelectSlug?.(slug);
      if (selectedSlugProp === undefined) {
        setInternalSlug(slug);
      }
    },
    [onSelectSlug, selectedSlugProp]
  );

  React.useEffect(() => {
    if (selectedSlugProp && problems.some((problem) => problem.slug === selectedSlugProp)) {
      return;
    }
    if (selectedSlugProp === undefined && problems[0]?.slug) {
      setInternalSlug(problems[0].slug);
    }
  }, [problems, selectedSlugProp]);
  const [userCode, setUserCode] = React.useState("");
  const [showSolution, setShowSolution] = React.useState(false);
  const [solvedSlugs, setSolvedSlugs] = React.useState<string[]>([]);
  const [confidenceMap, setConfidenceMap] = React.useState<Record<string, InterviewConfidence>>({});
  const [stats, setStats] = React.useState({ solved: 0, total: problems.length, percent: 0 });

  const filtered = React.useMemo(() => {
    return problems.filter((problem) => {
      const matchSearch =
        !search ||
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.summary.toLowerCase().includes(search.toLowerCase()) ||
        String(problem.id).includes(search);
      const matchDifficulty = difficulty === "all" || problem.difficulty === difficulty;
      const matchPattern = pattern === "all" || problem.pattern === pattern;
      const matchMustDo =
        mustDoFilter === "all" ||
        (mustDoFilter === "must-do" && problem.mustDo) ||
        (mustDoFilter === "stretch" && !problem.mustDo) ||
        (mustDoFilter === "needs-review" &&
          (confidenceMap[problem.slug] === "unsure" || confidenceMap[problem.slug] === "dont"));

      return matchSearch && matchDifficulty && matchPattern && matchMustDo;
    });
  }, [problems, search, difficulty, pattern, mustDoFilter, confidenceMap]);

  const active = problems.find((problem) => problem.slug === selectedSlug) ?? filtered[0];

  const refresh = React.useCallback(() => {
    setSolvedSlugs(problems.filter((p) => isCodingSolved(p.slug)).map((p) => p.slug));
    const map: Record<string, InterviewConfidence> = {};
    problems.forEach((p) => {
      const c = getCodingConfidence(p.slug);
      if (c) map[p.slug] = c;
    });
    setConfidenceMap(map);
    setStats(getCodingStats(problems.length));
  }, [problems]);

  React.useEffect(() => {
    refresh();
    window.addEventListener("python-progress-updated", refresh);
    return () => window.removeEventListener("python-progress-updated", refresh);
  }, [refresh]);

  React.useEffect(() => {
    setUserCode("");
    setShowSolution(false);
  }, [active?.slug]);

  const toggleSolved = () => {
    if (!active) return;
    setCodingSolved(active.slug, !isCodingSolved(active.slug));
  };

  const setConfidence = (value: InterviewConfidence) => {
    if (!active) return;
    setCodingConfidence(active.slug, value);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:items-start">
        <aside className="order-2 space-y-4 lg:order-1 lg:sticky lg:top-12 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
          <p className="text-sm text-muted-foreground">
            {stats.solved}/{stats.total} · {PYTHON_CODING_MUST_DO} must-do
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or #id..."
              className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none ring-orange-500/30 focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["all", "easy", "medium", "hard"] as DifficultyFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setDifficulty(key)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  difficulty === key
                    ? "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20"
                    : "bg-muted/70 text-muted-foreground"
                )}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["all", "All"],
                ["must-do", "Must-do"],
                ["needs-review", "Review"],
                ["stretch", "Stretch"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMustDoFilter(key)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  mustDoFilter === key
                    ? "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20"
                    : "bg-muted/70 text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={pattern}
            onChange={(event) => setPattern(event.target.value as PatternFilter)}
            className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none"
          >
            <option value="all">All patterns</option>
            {Object.entries(PYTHON_CODING_PATTERNS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <div className="space-y-1">
            {filtered.map((problem) => (
              <button
                key={problem.slug}
                type="button"
                onClick={() => selectSlug(problem.slug)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  selectedSlug === problem.slug
                    ? "bg-orange-500/10 text-orange-400"
                    : "hover:bg-muted/60"
                )}
              >
                {solvedSlugs.includes(problem.slug) ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                ) : problem.mustDo ? (
                  <Star className="mt-0.5 size-4 shrink-0 text-amber-500" />
                ) : (
                  <span className="mt-0.5 w-4 shrink-0 font-mono text-[10px] text-muted-foreground">
                    {problem.order}
                  </span>
                )}
                <span className="line-clamp-2">
                  <span className="font-mono text-[10px] text-muted-foreground">#{problem.id} </span>
                  {problem.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {active && (
          <section id="practice-editor" className="panel order-1 p-5 sm:p-6 lg:order-2 lg:sticky lg:top-12 lg:self-start lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">LC #{active.id}</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1",
                      difficultyBadge[active.difficulty]
                    )}
                  >
                    {active.difficulty}
                  </span>
                  <span className="rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {PYTHON_CODING_PATTERNS[active.pattern]}
                  </span>
                  {active.mustDo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500 ring-1 ring-amber-500/20">
                      <Star className="size-3" />
                      Must-do
                    </span>
                  )}
                  {confidenceMap[active.slug] && (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ring-1",
                        CONFIDENCE_STYLES[confidenceMap[active.slug]]
                      )}
                    >
                      {confidenceMap[active.slug]}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{active.title}</h3>
              </div>
              <Link
                href={active.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
              >
                LeetCode
                <ExternalLink className="size-3.5" />
              </Link>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.summary}</p>
            <p className="mt-3 text-sm">
              <span className="font-semibold text-foreground">Approach: </span>
              {active.approach}
            </p>

            <div className="mt-5">
              <PythonEditor value={userCode} onChange={setUserCode} height={200} />
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
                onClick={toggleSolved}
                className={cn(buttonVariants({ size: "sm" }), "bg-amber-600 hover:bg-amber-600/90")}
              >
                {isCodingSolved(active.slug) ? "Unmark solved" : "Mark solved"}
              </button>
              <button
                type="button"
                onClick={() => setConfidence("know")}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
              >
                <ThumbsUp className="size-3.5" />
                Know
              </button>
              <button
                type="button"
                onClick={() => setConfidence("unsure")}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
              >
                Unsure
              </button>
              <button
                type="button"
                onClick={() => setConfidence("dont")}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
              >
                <ThumbsDown className="size-3.5" />
                Don&apos;t know
              </button>
            </div>

            {showSolution && (
              <div className="mt-4">
                <PythonCodeBlock code={active.solution} />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

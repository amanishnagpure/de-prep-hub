"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCcw,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { LeetCodeSqlDifficulty, LeetCodeSqlPattern } from "@/lib/leetcode-sql";
import {
  getLeetCodeSqlProblems,
  LEETCODE_SQL_MUST_DO,
  LEETCODE_SQL_PATTERNS,
} from "@/lib/leetcode-sql";
import {
  getLeetCodeConfidence,
  getLeetCodeStats,
  isLeetCodeSolved,
  setLeetCodeConfidence,
  setLeetCodeSolved,
  type InterviewConfidence,
} from "@/lib/sql-progress";
import { compareSql } from "@/lib/sql-compare";
import { formatSqlForDialect } from "@/lib/sql-dialect";
import { useSqlDialect } from "@/components/sql/sql-dialect-bar";
import { SqlEditor } from "@/components/sql/sql-editor";
import { SqlCodeBlock } from "@/components/sql/sql-code-block";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

type DifficultyFilter = "all" | LeetCodeSqlDifficulty;
type PatternFilter = "all" | LeetCodeSqlPattern;
type MustDoFilter = "all" | "must-do" | "stretch" | "needs-review";

const difficultyBadge: Record<LeetCodeSqlDifficulty, string> = {
  easy: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface SqlLeetCodeTrackProps {
  problems: ReturnType<typeof getLeetCodeSqlProblems>;
  initialPattern?: string;
  initialReview?: boolean;
}

const CONFIDENCE_STYLES: Record<InterviewConfidence, string> = {
  know: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  unsure: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  dont: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

export function SqlLeetCodeTrack({
  problems,
  initialPattern,
  initialReview = false,
}: SqlLeetCodeTrackProps) {
  const { dialect } = useSqlDialect();
  const [search, setSearch] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<DifficultyFilter>("all");
  const [pattern, setPattern] = React.useState<PatternFilter>(
    initialPattern && initialPattern in LEETCODE_SQL_PATTERNS
      ? (initialPattern as LeetCodeSqlPattern)
      : "all"
  );
  const [mustDoFilter, setMustDoFilter] = React.useState<MustDoFilter>(
    initialReview ? "needs-review" : "all"
  );
  const [selectedSlug, setSelectedSlug] = React.useState(problems[0]?.slug ?? "");
  const [userSql, setUserSql] = React.useState("");
  const [showSolution, setShowSolution] = React.useState(false);
  const [compareResult, setCompareResult] = React.useState<ReturnType<typeof compareSql> | null>(
    null
  );
  const [solvedSlugs, setSolvedSlugs] = React.useState<string[]>([]);
  const [confidenceMap, setConfidenceMap] = React.useState<Record<string, InterviewConfidence>>({});
  const [stats, setStats] = React.useState({ solved: 0, total: problems.length, percent: 0 });
  const [copyMessage, setCopyMessage] = React.useState<string | null>(null);

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
          (confidenceMap[problem.slug] === "unsure" ||
            confidenceMap[problem.slug] === "dont"));

      return matchSearch && matchDifficulty && matchPattern && matchMustDo;
    });
  }, [problems, search, difficulty, pattern, mustDoFilter, confidenceMap, solvedSlugs]);

  const active = problems.find((problem) => problem.slug === selectedSlug) ?? filtered[0];

  const refresh = React.useCallback(() => {
    setSolvedSlugs(problems.filter((p) => isLeetCodeSolved(p.slug)).map((p) => p.slug));
    const map: Record<string, InterviewConfidence> = {};
    problems.forEach((p) => {
      const c = getLeetCodeConfidence(p.slug);
      if (c) map[p.slug] = c;
    });
    setConfidenceMap(map);
    setStats(getLeetCodeStats(problems.length));
  }, [problems]);

  React.useEffect(() => {
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    return () => window.removeEventListener("sql-progress-updated", refresh);
  }, [refresh]);

  React.useEffect(() => {
    setUserSql("");
    setShowSolution(false);
    setCompareResult(null);
  }, [active?.slug, dialect]);

  const referenceSolution = active
    ? formatSqlForDialect(active.solution, dialect)
    : "";

  const toggleSolved = () => {
    if (!active) return;
    const next = !isLeetCodeSolved(active.slug);
    setLeetCodeSolved(active.slug, next);
  };

  const setConfidence = (value: InterviewConfidence) => {
    if (!active) return;
    setLeetCodeConfidence(active.slug, value);
  };

  const handleCompare = () => {
    if (!active) return;
    const result = compareSql(userSql, active.solution, dialect);
    setCompareResult(result);
    if (result.match || result.similarity >= 80) {
      setLeetCodeSolved(active.slug, true);
    }
  };

  const copyMysqlSolution = async () => {
    if (!active) return;
    const mysqlSql = formatSqlForDialect(active.solution, "mysql");
    try {
      await navigator.clipboard.writeText(mysqlSql);
      setCopyMessage("Copied");
      window.setTimeout(() => setCopyMessage(null), 2000);
    } catch {
      setCopyMessage("Copy failed — check browser permissions.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:max-h-[80vh] xl:overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            {stats.solved}/{stats.total} · {LEETCODE_SQL_MUST_DO} must-do
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or #id..."
              className="w-full rounded-xl border border-border/70 bg-background/60 py-2.5 pl-10 pr-3 text-sm outline-none ring-orange-500/30 focus:ring-2"
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
            className="w-full rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none"
          >
            <option value="all">All patterns</option>
            {Object.entries(LEETCODE_SQL_PATTERNS).map(([key, label]) => (
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
                onClick={() => setSelectedSlug(problem.slug)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  selectedSlug === problem.slug
                    ? "bg-orange-500/10 text-orange-400"
                    : "hover:bg-muted/60"
                )}
              >
                {solvedSlugs.includes(problem.slug) ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
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
          <section className="rounded-2xl border border-border/70 bg-card/50 p-5 sm:p-6">
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
                    {LEETCODE_SQL_PATTERNS[active.pattern]}
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

            <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
              {active.approach}
            </div>

            {active.dialectNote && (
              <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">{active.dialectNote}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {active.tables.map((table) => (
                <span
                  key={table}
                  className="rounded-md bg-cyan-500/10 px-2 py-1 font-mono text-xs text-cyan-500 ring-1 ring-cyan-500/20"
                >
                  {table}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <SqlEditor value={userSql} onChange={setUserSql} height={180} />
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
                onClick={copyMysqlSolution}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
              >
                <Copy className="size-3.5" />
                Copy MySQL
              </button>
              <button
                type="button"
                onClick={toggleSolved}
                className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
              >
                <CheckCircle2 className="size-3.5" />
                {isLeetCodeSolved(active.slug) ? "Mark unsolved" : "Mark solved"}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-4">
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

            {copyMessage && (
              <p className="mt-2 text-xs text-muted-foreground">{copyMessage}</p>
            )}

            {compareResult && (
              <div
                className={cn(
                  "mt-4 rounded-xl border px-4 py-3 text-sm",
                  compareResult.match
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}
              >
                {compareResult.similarity}% — {compareResult.feedback}
              </div>
            )}

            {showSolution && (
              <SqlCodeBlock
                code={referenceSolution}
                language={dialect === "mysql" ? "mysql" : "sql"}
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

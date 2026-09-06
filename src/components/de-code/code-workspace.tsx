"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
import { getDeCodeSqlSchemas } from "@/data/de-code/sql-seeds";
import {
  CODE_SECTION,
  CODE_TRACKS,
  EXPERIENCE_LEVELS,
} from "@/lib/de-code/constants";
import { judgeFromApi } from "@/lib/de-code/judge";
import {
  getActiveTopics,
  getAllSubtopics,
  getCodeProblem,
  getCodeProblems,
  getSubtopicLabel,
  getTopicLabel,
} from "@/lib/de-code/problem-bank";
import {
  getSavedCode,
  getSubmissions,
  getTopicStats,
  getTrackStats,
  isProblemSolved,
  recordSubmission,
  saveCode,
  statusLabel,
} from "@/lib/de-code/progress";
import type { CodeProblem, CodeTrackId, ExperienceLevel, JudgeVerdict } from "@/lib/de-code/types";
import { buildPythonStarter } from "@/lib/practice-platform/judge/pyodide-runtime";
import { CodeProblemDescription, DeCodeRichText } from "@/components/de-code/code-problem-description";
import { ResizableSplit } from "@/components/practice-platform/resizable-split";
import { PythonEditor } from "@/components/python/python-editor";
import { SparkEditor } from "@/components/spark/spark-editor";
import { SqlEditor } from "@/components/sql/sql-editor";
import { SqlSchemaPanel } from "@/components/sql/sql-schema-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const DIFF: Record<string, string> = {
  easy: "lc-badge lc-badge-easy",
  medium: "lc-badge lc-badge-medium",
  hard: "lc-badge lc-badge-hard",
  expert: "lc-badge lc-badge-hard",
};

type Tab = "description" | "hints" | "solution" | "submissions";
type MobilePanel = "list" | "problem" | "code";
type StatusFilter = "all" | "todo" | "solved";

function starterFor(problem: CodeProblem): string {
  if (problem.starterCode.trim()) return problem.starterCode;
  if (problem.functionName) return buildPythonStarter(problem.solution, problem.functionName);
  if (problem.track === "sql") return "-- Write your SQL query\nSELECT ";
  if (problem.track === "pyspark") return "# PySpark\n";
  return "# Write your solution\n";
}

export function CodeWorkspace({ track, topicId }: { track: CodeTrackId; topicId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const meta = CODE_TRACKS.find((t) => t.id === track);
  const topics = React.useMemo(() => getActiveTopics(track), [track]  );

  const [topicFilter, setTopicFilter] = React.useState(topicId ?? "all");
  const [search, setSearch] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"all" | CodeProblem["difficulty"]>("all");
  const [experience, setExperience] = React.useState<"all" | ExperienceLevel>("all");
  const [subtopic, setSubtopic] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  React.useEffect(() => {
    setTopicFilter(topicId ?? "all");
    setSubtopic("all");
  }, [topicId, track]);

  const effectiveTopic = topicId ?? (topicFilter === "all" ? undefined : topicFilter);
  const problems = React.useMemo(
    () => getCodeProblems(track, effectiveTopic),
    [track, effectiveTopic]
  );
  const subtopics = React.useMemo(
    () => getAllSubtopics(track, effectiveTopic),
    [track, effectiveTopic]
  );

  const [mobilePanel, setMobilePanel] = React.useState<MobilePanel>("problem");
  const [tab, setTab] = React.useState<Tab>("description");
  const [visibleHints, setVisibleHints] = React.useState(1);
  const [code, setCode] = React.useState("");
  const [verdict, setVerdict] = React.useState<JudgeVerdict | null>(null);
  const [running, setRunning] = React.useState(false);
  const [stats, setStats] = React.useState({ solved: 0, total: 0, percent: 0 });

  const slug =
    searchParams.get("slug") && getCodeProblem(track, searchParams.get("slug")!)
      ? searchParams.get("slug")!
      : (problems[0]?.slug ?? "");

  const problem = getCodeProblem(track, slug) ?? problems[0];

  const filtered = problems.filter((p) => {
    const okDiff = difficulty === "all" || p.difficulty === difficulty;
    const okExp = experience === "all" || p.experienceLevel === experience;
    const okSub = subtopic === "all" || p.subtopic === subtopic;
    const okSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.concepts.some((c) => c.includes(search.toLowerCase()));
    const solved = isProblemSolved(p.id);
    const okStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && solved) ||
      (statusFilter === "todo" && !solved);
    return okDiff && okExp && okSub && okSearch && okStatus;
  });

  const selectSlug = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("slug", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMobilePanel("problem");
  };

  const refresh = React.useCallback(() => {
    setStats(
      topicId
        ? getTopicStats(
            track,
            getCodeProblems(track, topicId).map((p) => p.id)
          )
        : getTrackStats(track, getCodeProblems(track).length)
    );
  }, [track, topicId]);

  React.useEffect(() => {
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, [refresh]);

  React.useEffect(() => {
    if (!problem) return;
    setCode(getSavedCode(track, problem.slug) ?? starterFor(problem));
    setVerdict(null);
    setTab("description");
    setVisibleHints(1);
  }, [problem?.id, track]);

  React.useEffect(() => {
    if (!problem) return;
    const t = window.setTimeout(() => saveCode(track, problem.slug, code), 400);
    return () => window.clearTimeout(t);
  }, [code, problem?.slug, track]);

  const runJudge = React.useCallback(
    async (mode: "run" | "submit") => {
      if (!problem) return;
      setRunning(true);
      try {
        const result = await judgeFromApi(problem, code, mode);
        setVerdict(result);
        if (mode === "submit") {
          recordSubmission({
            problemId: problem.id,
            track,
            slug: problem.slug,
            language: track === "sql" ? "sql" : track === "pyspark" ? "pyspark" : "python",
            code,
            status: result.status,
            passed: result.passed,
            total: result.total,
            runtimeMs: result.runtimeMs,
          });
          refresh();
        }
      } finally {
        setRunning(false);
      }
    },
    [code, problem, refresh, track]
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        if (!running) void runJudge("submit");
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (!running) void runJudge("run");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runJudge, running]);

  if (!problem || !meta) return null;

  const problemIndex = problems.findIndex((p) => p.slug === problem.slug);
  const prevProblem = problemIndex > 0 ? problems[problemIndex - 1] : null;
  const nextProblem = problemIndex < problems.length - 1 ? problems[problemIndex + 1] : null;
  const submissions = getSubmissions(problem.id);
  const schemas = track === "sql" ? getDeCodeSqlSchemas(problem.slug) : [];
  const expLabel = EXPERIENCE_LEVELS.find((e) => e.id === problem.experienceLevel);

  const panelTabs: Tab[] =
    problem.hints.length > 0
      ? ["description", "hints", "solution", "submissions"]
      : ["description", "solution", "submissions"];

  const descriptionPanel = (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap border-b border-border text-sm">
        {panelTabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)} className={cn("px-4 py-2 capitalize", tab === key ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground")}>
            {key}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm">
        {tab === "description" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={cn("lc-badge", DIFF[problem.difficulty])}>{problem.difficulty}</span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">{expLabel?.label}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs">{getTopicLabel(track, problem.topic)}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-xs">{getSubtopicLabel(track, problem.topic, problem.subtopic)}</span>
              {problem.concepts.map((c) => (
                <span key={c} className="rounded bg-muted px-2 py-0.5 text-xs">{c}</span>
              ))}
            </div>
            <h2 className="text-xl font-semibold">{problem.title}</h2>
                  <CodeProblemDescription problem={problem} />
          </div>
        )}
        {tab === "hints" && (
          <div className="space-y-4">
            <ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground">
              {problem.hints.slice(0, visibleHints).map((hint, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="mr-1 font-medium text-foreground">Hint {i + 1}:</span>
                  <DeCodeRichText text={hint} />
                </li>
              ))}
            </ul>
            {visibleHints < problem.hints.length && (
              <button
                type="button"
                onClick={() => setVisibleHints((n) => n + 1)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
              >
                Show hint {visibleHints + 1} of {problem.hints.length}
              </button>
            )}
          </div>
        )}
        {tab === "solution" && (
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 text-xs"><code>{problem.explanation}</code></pre>
        )}
        {tab === "submissions" && (
          <ul className="space-y-2">
            {submissions.length === 0 && <li className="text-muted-foreground">No submissions yet.</li>}
            {submissions.map((s) => (
              <li key={s.id} className={cn("flex justify-between rounded-md border px-3 py-2 text-xs", s.status === "accepted" ? "border-lc-easy/40 bg-lc-easy/10" : "border-lc-hard/30")}>
                <span>{statusLabel(s.status)} · {s.passed}/{s.total}</span>
                <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );

  const editorPanel = (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Code</span>
          <button type="button" onClick={() => { setCode(starterFor(problem)); setVerdict(null); }} className={cn(buttonVariants({ size: "xs", variant: "ghost" }), "gap-1")}>
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {prevProblem && (
            <button type="button" onClick={() => selectSlug(prevProblem.slug)} className={cn(buttonVariants({ size: "xs", variant: "outline" }), "gap-1")}>
              <ChevronLeft className="size-3" /> Prev
            </button>
          )}
          {nextProblem && (
            <button type="button" onClick={() => selectSlug(nextProblem.slug)} className={cn(buttonVariants({ size: "xs", variant: "outline" }), "gap-1")}>
              Next <ChevronRight className="size-3" />
            </button>
          )}
          <button type="button" disabled={running} onClick={() => runJudge("run")} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}>
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />} Run
          </button>
          <button type="button" disabled={running} onClick={() => runJudge("submit")} className={cn(buttonVariants({ size: "sm" }), "gap-1")}>
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Submit
          </button>
        </div>
      </div>
      <div className="min-h-[220px] flex-1">
        {track === "sql" ? (
          <SqlEditor value={code} onChange={setCode} height={320} />
        ) : track === "pyspark" ? (
          <SparkEditor value={code} onChange={setCode} height={320} />
        ) : (
          <PythonEditor value={code} onChange={setCode} height={320} />
        )}
      </div>
      <div className="max-h-40 overflow-y-auto border-t border-border p-3 text-xs">
        {!verdict && <p className="text-muted-foreground">Run on sample DB · Submit compares result · ⌘/Ctrl+Enter · ⇧+Enter submit</p>}
        {verdict && (
          <div className="space-y-2">
            <p className={cn("font-semibold", verdict.status === "accepted" ? "text-lc-easy" : "text-lc-hard")}>
              {statusLabel(verdict.status)}{verdict.message ? ` — ${verdict.message}` : ""}
            </p>
            {verdict.cases.map((c) => (
              <div key={c.testCaseId} className="rounded-md border border-border bg-muted/20 p-2">
                <p>{c.pass ? "✓" : "✗"} Case {c.testCaseId}</p>
                {c.error && <p className="text-lc-hard">{c.error}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-4 py-4">
      <header className="mb-3 flex flex-wrap items-center gap-3 border-b border-border pb-3">
        <Link href={CODE_SECTION.home} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Code
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/code/${track}`} className="text-sm text-muted-foreground hover:text-primary">
          {meta.label}
        </Link>
        {topicId && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">{getTopicLabel(track, topicId)}</span>
          </>
        )}
        {!topicId && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">All problems</span>
          </>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{stats.solved}/{stats.total} accepted</span>
      </header>

      <div className="mb-2 flex gap-1 lg:hidden">
        {(["list", "problem", "code"] as const).map((panel) => (
          <button key={panel} type="button" onClick={() => setMobilePanel(panel)} className={cn("flex-1 rounded-md px-2 py-1.5 text-xs capitalize", mobilePanel === panel ? "bg-primary/15 text-primary" : "text-muted-foreground")}>
            {panel}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border lg:flex-row">
        <aside className={cn("flex w-full flex-col border-b border-border lg:w-[280px] lg:shrink-0 lg:border-b-0 lg:border-r", mobilePanel !== "list" && "hidden lg:flex")}>
          <div className="space-y-2 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full rounded-md border border-border py-2 pl-9 pr-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "todo", "solved"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)} className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", statusFilter === s ? "bg-muted text-foreground" : "text-muted-foreground")}>{s}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "easy", "medium", "hard", "expert"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDifficulty(d)} className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", difficulty === d ? "bg-primary/15 text-primary" : "text-muted-foreground")}>{d}</button>
              ))}
            </div>
            <select value={experience} onChange={(e) => setExperience(e.target.value as typeof experience)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs">
              <option value="all">All experience</option>
              {EXPERIENCE_LEVELS.map((e) => (
                <option key={e.id} value={e.id}>{e.label} ({e.years})</option>
              ))}
            </select>
            {!topicId && (
              <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs">
                <option value="all">All topics</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            )}
            <select value={subtopic} onChange={(e) => setSubtopic(e.target.value)} className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs">
              <option value="all">All subtopics</option>
              {subtopics.map((s) => (
                <option key={s} value={s}>
                  {effectiveTopic ? getSubtopicLabel(track, effectiveTopic, s) : s}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDifficulty("all");
                  setExperience("all");
                  setSubtopic("all");
                  if (!topicId) setTopicFilter("all");
                  setStatusFilter("all");
                }}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 text-xs")}
              >
                Reset filters
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto lg:max-h-[calc(100dvh-24rem)]">
            {filtered.map((p, idx) => {
              const exp = EXPERIENCE_LEVELS.find((e) => e.id === p.experienceLevel);
              return (
              <button key={p.id} type="button" onClick={() => selectSlug(p.slug)} className={cn("lc-table-row w-full flex-col items-start gap-1 border-b border-border/40 px-3 py-2.5 text-left", p.slug === problem.slug && "bg-muted/60")}>
                <div className="flex w-full items-start gap-2">
                  {isProblemSolved(p.id) ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  ) : (
                    <span className={cn("lc-badge shrink-0 text-[10px]", DIFF[p.difficulty])}>{p.difficulty[0].toUpperCase()}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-muted-foreground">#{idx + 1}</p>
                    <p className="text-sm font-medium leading-snug">{p.title}</p>
                  </div>
                </div>
                <div className="ml-6 flex flex-wrap gap-1 text-[10px] text-muted-foreground">
                  <span>{exp?.years ?? p.experienceLevel}</span>
                  <span>·</span>
                  <span>{getTopicLabel(track, p.topic)}</span>
                  {!topicId && (
                    <>
                      <span>·</span>
                      <span>{getSubtopicLabel(track, p.topic, p.subtopic)}</span>
                    </>
                  )}
                </div>
              </button>
            );})}
          </div>
        </aside>

        <div className={cn("hidden min-h-0 min-w-0 flex-1 lg:flex", mobilePanel !== "list" && "flex")}>
          <ResizableSplit className="min-h-[500px] flex-1 lg:min-h-0" defaultSize={50} first={descriptionPanel} second={editorPanel} />
        </div>
      </div>

      {schemas.length > 0 && (
        <div className="mt-3 rounded-lg border border-border p-3">
          <SqlSchemaPanel tables={schemas} />
        </div>
      )}
    </div>
  );
}

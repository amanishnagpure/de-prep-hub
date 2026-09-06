"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
import { getPlatformProblem, getPlatformProblems } from "@/lib/practice-platform/problem-bank";
import { judgeFromClient } from "@/lib/practice-platform/judge/judge-client";
import { buildPythonStarter } from "@/lib/practice-platform/judge/pyodide-runtime";
import {
  getSavedCode,
  getSubmissions,
  getTrackStats,
  isProblemSolved,
  recordSubmission,
  saveCode,
  statusLabel,
} from "@/lib/practice-platform/submissions";
import type { JudgeVerdict, PlatformProblem, PracticeTrackId } from "@/lib/practice-platform/types";
import { PRACTICE_SECTION } from "@/lib/practice-section";
import { getPracticeTrack } from "@/lib/practice-tracks";
import { getSchemaForTable } from "@/lib/sql-schemas";
import { getSqlPracticeSchemas } from "@/data/sql-practice-problem-seeds";
import { SqlEditor } from "@/components/sql/sql-editor";
import { PythonEditor } from "@/components/python/python-editor";
import { SparkEditor } from "@/components/spark/spark-editor";
import { SqlSchemaPanel } from "@/components/sql/sql-schema-panel";
import { PracticeSqlDialectBar } from "@/components/practice/practice-sql-dialect-bar";
import { ResizableSplit } from "@/components/practice-platform/resizable-split";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const DIFF: Record<string, string> = {
  easy: "lc-badge lc-badge-easy",
  medium: "lc-badge lc-badge-medium",
  hard: "lc-badge lc-badge-hard",
};

type Tab = "description" | "hints" | "editorial" | "submissions";
type MobilePanel = "list" | "problem" | "code";
type StatusFilter = "all" | "todo" | "solved";

function starterFor(problem: PlatformProblem): string {
  if (problem.starterCode.trim()) return problem.starterCode;
  if (problem.functionName) return buildPythonStarter(problem.solution, problem.functionName);
  if (problem.track === "sql") return "-- Write your SQL query\nSELECT ";
  return "# Write your solution\n";
}

export function PlatformWorkspace({ track }: { track: PracticeTrackId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const problems = React.useMemo(() => getPlatformProblems(track), [track]);
  const meta = getPracticeTrack(track);

  const slug =
    searchParams.get("slug") && getPlatformProblem(track, searchParams.get("slug")!)
      ? searchParams.get("slug")!
      : (problems[0]?.slug ?? "");

  const problem = getPlatformProblem(track, slug) ?? problems[0];

  const [search, setSearch] = React.useState("");
  const [difficulty, setDifficulty] = React.useState<"all" | PlatformProblem["difficulty"]>("all");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [mobilePanel, setMobilePanel] = React.useState<MobilePanel>("problem");
  const [tab, setTab] = React.useState<Tab>("description");
  const [code, setCode] = React.useState("");
  const [verdict, setVerdict] = React.useState<JudgeVerdict | null>(null);
  const [running, setRunning] = React.useState(false);
  const [stats, setStats] = React.useState({ solved: 0, total: 0, percent: 0 });

  const filtered = problems.filter((p) => {
    const okDiff = difficulty === "all" || p.difficulty === difficulty;
    const okSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase());
    const solved = isProblemSolved(p.id);
    const okStatus =
      statusFilter === "all" ||
      (statusFilter === "solved" && solved) ||
      (statusFilter === "todo" && !solved);
    return okDiff && okSearch && okStatus;
  });

  const selectSlug = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("slug", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMobilePanel("problem");
  };

  const refresh = React.useCallback(() => {
    setStats(getTrackStats(track, problems.length));
  }, [problems, track]);

  React.useEffect(() => {
    refresh();
    window.addEventListener("practice-platform-updated", refresh);
    return () => window.removeEventListener("practice-platform-updated", refresh);
  }, [refresh]);

  React.useEffect(() => {
    if (!problem) return;
    setCode(getSavedCode(track, problem.slug) ?? starterFor(problem));
    setVerdict(null);
    setTab("description");
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
        const result = await judgeFromClient(problem, code, mode);
        setVerdict(result);
        if (mode === "submit") {
          recordSubmission({
            problemId: problem.id,
            track,
            slug: problem.slug,
            language: problem.track === "sql" ? "sql" : "python",
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

  const resetCode = () => {
    setCode(starterFor(problem));
    setVerdict(null);
  };

  const panelTabs: Tab[] =
    problem.hints && problem.hints.length > 0
      ? ["description", "hints", "editorial", "submissions"]
      : ["description", "editorial", "submissions"];

  const submissions = getSubmissions(problem.id);
  const practiceSchemas = track === "sql" ? getSqlPracticeSchemas(problem.slug) : [];
  const legacySchemas = (problem.tables ?? [])
    .map((t) => getSchemaForTable(t))
    .filter(Boolean) as NonNullable<ReturnType<typeof getSchemaForTable>>[];
  const schemas = practiceSchemas.length > 0 ? practiceSchemas : legacySchemas;

  return (
    <div className="flex min-h-[calc(100dvh-3rem)] flex-col">
      <header className="mb-3 flex flex-wrap items-center gap-3 border-b border-border pb-3">
        <Link href={PRACTICE_SECTION.home} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Practice
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-lg font-semibold">{meta.label}</h1>
        <span className="text-xs text-muted-foreground">{stats.solved}/{stats.total} accepted</span>
      </header>

      {track === "sql" && <PracticeSqlDialectBar />}

      <div className="mb-2 flex gap-1 lg:hidden">
        {(["list", "problem", "code"] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            onClick={() => setMobilePanel(panel)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs capitalize",
              mobilePanel === panel ? "bg-primary/15 text-primary" : "text-muted-foreground"
            )}
          >
            {panel}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border lg:flex-row">
        <aside
          className={cn(
            "flex w-full flex-col border-b border-border lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r",
            mobilePanel !== "list" && "hidden lg:flex"
          )}
        >
          <div className="space-y-2 border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems" className="w-full rounded-md border border-border py-2 pl-9 pr-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "easy", "medium", "hard"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDifficulty(d)} className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", difficulty === d ? "bg-primary/15 text-primary" : "text-muted-foreground")}>{d}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {(["all", "todo", "solved"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)} className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", statusFilter === s ? "bg-muted text-foreground" : "text-muted-foreground")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto lg:max-h-[calc(100dvh-16rem)]">
            {filtered.map((p) => (
              <button key={p.id} type="button" onClick={() => selectSlug(p.slug)} className={cn("lc-table-row w-full text-left", p.slug === problem.slug && "bg-muted/60")}>
                {isProblemSolved(p.id) ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                ) : (
                  <span className={cn("lc-badge shrink-0 text-[10px]", DIFF[p.difficulty])}>{p.difficulty[0].toUpperCase()}</span>
                )}
                <span className="line-clamp-2 text-sm font-medium">{p.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className={cn("hidden min-h-0 min-w-0 flex-1 lg:flex", mobilePanel !== "list" && "flex lg:flex")}>
          <ResizableSplit
            className="min-h-[480px] flex-1 lg:min-h-0"
            defaultSize={48}
            minSize={28}
            maxSize={72}
            first={
              <section className={cn("flex h-full min-h-0 flex-col", mobilePanel !== "problem" && "hidden lg:flex")}>
                <div className="flex border-b border-border text-sm">
                  {panelTabs.map((key) => (
                    <button key={key} type="button" onClick={() => setTab(key)} className={cn("px-4 py-2 capitalize", tab === key ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground")}>{key}</button>
                  ))}
                  {problem.externalUrl && (
                    <a href={problem.externalUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground hover:text-primary">Ref <ExternalLink className="size-3" /></a>
                  )}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4 text-sm">
                  {tab === "description" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={cn("lc-badge", DIFF[problem.difficulty])}>{problem.difficulty}</span>
                        {problem.topics.map((t) => <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">{t}</span>)}
                      </div>
                      <h2 className="text-xl font-semibold">{problem.title}</h2>
                      <p className="whitespace-pre-line text-muted-foreground">{problem.description}</p>
                      {problem.examples.map((ex, i) => (
                        <div key={i} className="rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs">
                          <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                          <div className="mt-1"><span className="text-muted-foreground">Output:</span> {ex.output}</div>
                        </div>
                      ))}
                      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                        {problem.constraints.map((c) => <li key={c}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {tab === "hints" && (
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {problem.hints?.map((hint) => (
                        <li key={hint}>{hint}</li>
                      ))}
                    </ul>
                  )}
                  {tab === "editorial" && (
                    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 text-xs"><code>{problem.editorial ?? problem.solution}</code></pre>
                  )}
                  {tab === "submissions" && (
                    <ul className="space-y-2">
                      {submissions.length === 0 && <li className="text-muted-foreground">No submissions yet.</li>}
                      {submissions.map((s) => (
                        <li key={s.id} className={cn("flex justify-between rounded-md border px-3 py-2 text-xs", s.status === "accepted" ? "border-lc-easy/40 bg-lc-easy/10" : "border-lc-hard/30")}>
                          <span>{statusLabel(s.status)} · {s.passed}/{s.total}{s.runtimeMs ? ` · ${s.runtimeMs}ms` : ""}</span>
                          <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            }
            second={
              <section className={cn("flex h-full min-h-0 flex-col", mobilePanel !== "code" && "hidden lg:flex")}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Code</span>
                    <button type="button" onClick={resetCode} className={cn(buttonVariants({ size: "xs", variant: "ghost" }), "gap-1")}>
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
                  ) : track === "spark" ? (
                    <SparkEditor value={code} onChange={setCode} height={320} />
                  ) : (
                    <PythonEditor value={code} onChange={setCode} height={320} />
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto border-t border-border p-3 text-xs">
                  <p className="mb-2 font-semibold uppercase tracking-wide text-muted-foreground">Test cases & result</p>
                  {!verdict && (
                    <p className="text-muted-foreground">
                      Run = execute on problem database. Submit = compare your result to reference.
                      {track === "dsa" || track === "python" ? " Pyodide loads on first run (~5s)." : ""}
                      {" "}⌘/Ctrl+Enter to run, ⇧+Enter to submit.
                    </p>
                  )}
                  {verdict && (
                    <div className="space-y-2">
                      <p className={cn("font-semibold", verdict.status === "accepted" ? "text-lc-easy" : "text-lc-hard")}>
                        {statusLabel(verdict.status)}
                        {verdict.runtimeMs != null ? ` · ${verdict.runtimeMs}ms` : ""}
                        {verdict.message ? ` — ${verdict.message}` : ""}
                      </p>
                      {verdict.cases.map((c) => (
                        <div key={c.testCaseId} className="rounded-md border border-border bg-muted/20 p-2">
                          <p className="font-medium">{c.pass ? "✓" : "✗"} Case {c.testCaseId}</p>
                          {c.error && <p className="mt-1 text-lc-hard">{c.error}</p>}
                          {!c.pass && c.expectedOutput && (
                            <p className="mt-1 text-muted-foreground">Expected: {c.expectedOutput}</p>
                          )}
                          {c.actualOutput && <p className="mt-1">Got: {c.actualOutput}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            }
          />
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

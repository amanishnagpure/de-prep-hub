"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Play, RotateCcw, Send } from "lucide-react";
import { getDeChallengeSeed } from "@/data/de-code/challenge-seeds";
import {
  CHALLENGE_SECTION,
  EXPERIENCE_LEVELS,
} from "@/lib/de-code/constants";
import {
  getChallengeGroupLabel,
  getChallengeTopicLabel,
} from "@/lib/de-code/challenge-taxonomy";
import { judgeChallengeFromApi } from "@/lib/de-code/judge";
import type {
  ChallengeExecutionLanguage,
  DEChallengeProblem,
} from "@/lib/de-code/challenge-types";
import type { CodeTrackId, JudgeVerdict } from "@/lib/de-code/types";
import {
  getSavedChallengeCode,
  getSubmissions,
  isProblemSolved,
  recordSubmission,
  saveChallengeCode,
} from "@/lib/de-code/progress";
import { ChallengeVerdictPanel } from "@/components/de-code/challenge-verdict-panel";
import { DeCodeRichText } from "@/components/de-code/code-problem-description";
import { ChallengeSubmissionsPanel } from "@/components/de-code/challenge-submissions-panel";
import { PlatformTabs } from "@/components/ui/platform-tabs";
import { collectFailedConcepts } from "@/lib/de-code/verdict-display";
import { ResizableSplit } from "@/components/practice-platform/resizable-split";
import { SparkEditor } from "@/components/spark/spark-editor";
import { SqlEditor } from "@/components/sql/sql-editor";
import { SqlSchemaPanel } from "@/components/sql/sql-schema-panel";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const SCENARIO_TABS = [
  { id: "scenario", label: "Mission" },
  { id: "requirements", label: "Requirements" },
  { id: "schema", label: "Schema" },
  { id: "hints", label: "Hints" },
  { id: "submissions", label: "Submissions" },
] as const;

function trackForLanguage(lang: ChallengeExecutionLanguage): CodeTrackId {
  if (lang === "sql") return "sql";
  if (lang === "pyspark") return "pyspark";
  return "python";
}

export function ChallengeWorkspace({ challenge }: { challenge: DEChallengeProblem }) {
  const seed = getDeChallengeSeed(challenge.seedSlug);
  const [language, setLanguage] = React.useState<ChallengeExecutionLanguage>(
    challenge.defaultLanguage
  );
  const [tab, setTab] = React.useState<(typeof SCENARIO_TABS)[number]["id"]>("scenario");
  const [visibleHints, setVisibleHints] = React.useState(1);
  const [code, setCode] = React.useState("");
  const [verdict, setVerdict] = React.useState<JudgeVerdict | null>(null);
  const [running, setRunning] = React.useState(false);
  const [progressVersion, setProgressVersion] = React.useState(0);
  const [mobilePanel, setMobilePanel] = React.useState<"problem" | "code">("problem");

  const expLabel = EXPERIENCE_LEVELS.find((e) => e.id === challenge.experienceLevel);
  const groupLabel = getChallengeGroupLabel(challenge.taxonomyGroup);
  const topicLabel = getChallengeTopicLabel(challenge.taxonomyTopic);

  React.useEffect(() => {
    setCode(
      getSavedChallengeCode(challenge.slug, language) ??
        challenge.starterCode[language] ??
        ""
    );
    setVerdict(null);
  }, [challenge.slug, language, challenge.starterCode]);

  React.useEffect(() => {
    const t = window.setTimeout(() => saveChallengeCode(challenge.slug, language, code), 400);
    return () => window.clearTimeout(t);
  }, [code, challenge.slug, language]);

  const runJudge = React.useCallback(
    async (mode: "run" | "submit") => {
      setRunning(true);
      try {
        const result = await judgeChallengeFromApi(challenge, code, mode, language);
        setVerdict(result);
        if (mode === "submit") {
          recordSubmission({
            problemId: challenge.id,
            problemKind: "de_challenge",
            track: trackForLanguage(language),
            slug: challenge.slug,
            language,
            code,
            status: result.status,
            passed: result.passed,
            total: result.total,
            runtimeMs: result.runtimeMs ?? result.metrics?.runtimeMs,
            failedConcepts:
              result.status === "accepted" ? undefined : collectFailedConcepts(result.cases),
            verdictMessage: result.message,
          });
          setProgressVersion((v) => v + 1);
        }
      } finally {
        setRunning(false);
      }
    },
    [challenge, code, language]
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

  const submissions = React.useMemo(
    () => getSubmissions(challenge.id),
    [challenge.id, progressVersion]
  );

  const sqlSchemas = language === "sql" && seed ? seed.sql.tables : [];

  const scenarioPanel = (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <PlatformTabs
        tabs={[...SCENARIO_TABS]}
        active={tab}
        onChange={(id) => setTab(id as (typeof SCENARIO_TABS)[number]["id"])}
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {tab === "scenario" && (
          <div className="space-y-6">
            <div>
              <p className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                {groupLabel}
              </p>
              <h2 className="type-section mt-2 text-foreground">{challenge.title}</h2>
              <p className="type-meta mt-2 text-muted-foreground">
                {topicLabel} · {challenge.executionLanguages.join(" · ")}
                {isProblemSolved(challenge.id) ? " · Completed" : ""}
              </p>
            </div>

            <div className="platform-divider" />

            <div>
              <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                Mission
              </h3>
              <p className="type-body mt-3 text-foreground">{challenge.objective}</p>
            </div>

            <div>
              <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                Context
              </h3>
              <p className="type-body mt-3 leading-relaxed text-muted-foreground">
                {challenge.scenario}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                  Inputs
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {challenge.inputTables.map((table) => (
                    <li key={table.label} className="type-code text-foreground">
                      {table.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                  Output
                </h3>
                <p className="type-code mt-3 text-foreground">{challenge.outputTable}</p>
              </div>
            </div>
          </div>
        )}
        {tab === "requirements" && (
          <ol className="space-y-4">
            {challenge.requirements.map((req, i) => (
              <li key={req} className="flex gap-3 type-body text-muted-foreground">
                <span className="type-meta shrink-0 tabular-nums text-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{req}</span>
              </li>
            ))}
          </ol>
        )}
        {tab === "schema" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium">Input tables</h3>
              <div className="mt-3 space-y-4">
                {challenge.inputTables.map((table) => (
                  <div key={table.label} className="rounded-lg border border-border p-3">
                    <p className="font-mono text-sm font-medium">{table.label}</p>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
                    <ul className="mt-2 space-y-1 font-mono text-xs">
                      {table.columns.map((col) => (
                        <li key={col.name}>
                          {col.name} <span className="text-muted-foreground">{col.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium">Expected output: {challenge.outputTable}</h3>
              <ul className="mt-2 space-y-1 font-mono text-xs">
                {challenge.outputSchema.map((col) => (
                  <li key={col.name}>
                    {col.name} <span className="text-muted-foreground">{col.type}</span>
                  </li>
                ))}
              </ul>
              {language === "pyspark" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Assign your result DataFrame to{" "}
                  <code className="rounded bg-muted px-1">{challenge.outputTable}</code>.
                </p>
              )}
            </div>
          </div>
        )}
        {tab === "hints" && (
          <div className="space-y-4">
            <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
              {challenge.hints.slice(0, visibleHints).map((hint, i) => (
                <li key={i} className="leading-relaxed">
                  <span className="mr-1 font-medium text-foreground">Hint {i + 1}:</span>
                  <DeCodeRichText text={hint} />
                </li>
              ))}
            </ul>
            {visibleHints < challenge.hints.length && (
              <button
                type="button"
                onClick={() => setVisibleHints((n) => n + 1)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs")}
              >
                Show hint {visibleHints + 1} of {challenge.hints.length}
              </button>
            )}
          </div>
        )}
        {tab === "submissions" && (
          <ChallengeSubmissionsPanel submissions={submissions} />
        )}
      </div>
    </section>
  );

  const editorPanel = (
    <section className="grid h-full min-h-0 grid-rows-[auto_minmax(240px,1fr)_auto] overflow-hidden">
      <div className="flex shrink-0 items-center border-b border-border px-4 py-2.5">
        <span className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
          Workspace
        </span>
      </div>
      <div className="min-h-0 overflow-hidden p-3">
        {language === "sql" ? (
          <SqlEditor value={code} onChange={setCode} height="100%" />
        ) : (
          <SparkEditor value={code} onChange={setCode} height="100%" />
        )}
      </div>
      <div className="flex min-h-0 max-h-[min(17rem,40vh)] flex-col overflow-hidden border-t border-border bg-background">
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
          <button
            type="button"
            disabled={running}
            onClick={() => runJudge("run")}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />} Run
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => runJudge("submit")}
            className={cn(buttonVariants({ size: "sm" }), "gap-1")}
          >
            {running ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setCode(challenge.starterCode[language] ?? "");
              setVerdict(null);
            }}
            className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "ml-auto gap-1")}
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-border px-3 py-2">
          {!verdict && (
            <p className="text-xs text-muted-foreground">
              Run on public fixture · Submit runs hidden tests · ⌘/Ctrl+Enter · ⇧+Enter submit
            </p>
          )}
          {verdict && <ChallengeVerdictPanel verdict={verdict} />}
        </div>
      </div>
    </section>
  );

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col px-4 py-4">
      <header className="mb-4 shrink-0 border-b border-border pb-4">
        <Link
          href={CHALLENGE_SECTION.home}
          className="type-meta inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Challenges
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="type-meta text-muted-foreground">{groupLabel}</p>
            <h1 className="type-section text-foreground">{challenge.title}</h1>
            <p className="type-meta mt-1 text-muted-foreground">
              {topicLabel} · {expLabel?.years ?? challenge.experienceLevel}
            </p>
          </div>
          <div className="flex gap-1">
            {challenge.executionLanguages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "platform-filter-pill capitalize",
                  language === lang && "platform-filter-pill-active"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mb-2 flex shrink-0 gap-1 lg:hidden">
        {(["problem", "code"] as const).map((panel) => (
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

      <div className="flex min-h-[320px] min-h-0 flex-col overflow-hidden rounded-lg border border-border lg:min-h-[min(520px,calc(100dvh-12rem))]">
        <div className="hidden min-h-0 min-w-0 flex-1 lg:flex">
          <ResizableSplit
            className="h-full min-h-0 flex-1"
            defaultSize={48}
            minSize={30}
            maxSize={65}
            first={scenarioPanel}
            second={editorPanel}
          />
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden",
            mobilePanel === "code" ? "flex" : "hidden"
          )}
        >
          {editorPanel}
        </div>
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden lg:hidden",
            mobilePanel === "problem" ? "flex" : "hidden"
          )}
        >
          {scenarioPanel}
        </div>
      </div>

      {sqlSchemas.length > 0 && (
        <div className="mt-3 rounded-lg border border-border p-3">
          <SqlSchemaPanel tables={sqlSchemas} />
        </div>
      )}
    </div>
  );
}

import type { JudgeCaseResult, JudgeVerdict, SubmissionStatus } from "@/lib/de-code/types";
import { statusLabel } from "@/lib/de-code/progress";

export function isHiddenFixtureCase(testCaseId: string): boolean {
  return testCaseId !== "public" && testCaseId !== "run";
}

export function formatSlugLabel(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatRuntime(ms?: number): string | null {
  if (ms == null || ms < 0) return null;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function verdictHeadline(status: SubmissionStatus): string {
  if (status === "accepted") return "Accepted";
  return statusLabel(status).toUpperCase();
}

export function collectFailedConcepts(cases: JudgeCaseResult[]): string[] {
  const concepts = new Set<string>();
  for (const c of cases) {
    if (c.pass) continue;
    for (const test of c.tests ?? []) {
      concepts.add(formatSlugLabel(test));
    }
  }
  return [...concepts].sort();
}

function looksLikeRowPreview(value?: string): boolean {
  if (!value?.trim()) return false;
  const v = value.trim();
  if (v.includes("row(s):") || v.includes("matching row")) return true;
  if (v.startsWith("[") || v.startsWith("{")) return true;
  if (v.includes(" — ") && v.includes("(")) return true;
  return false;
}

export type CaseDisplayDetail = {
  label: string;
  hidden: boolean;
  pass: boolean;
  category: string | null;
  concepts: string[];
  summary: string | null;
  detail: string | null;
  runtime: string | null;
};

export function buildCaseDisplayDetail(c: JudgeCaseResult): CaseDisplayDetail {
  const hidden = c.isHidden ?? isHiddenFixtureCase(c.testCaseId);
  const label =
    c.testCaseId === "public"
      ? "Public"
      : c.testCaseId === "run"
        ? "Public (run)"
        : formatSlugLabel(c.testCaseId.replace(/^hidden-/, ""));

  let summary: string | null = null;
  let detail: string | null = null;

  if (c.error) {
    detail = c.error;
  }

  const expectedRows = c.metrics?.expectedOutputRows;
  const outputRows = c.metrics?.outputRows;
  if (expectedRows != null || outputRows != null) {
    summary = `Rows — expected ${expectedRows ?? "?"}, got ${outputRows ?? "?"}`;
  } else if (!hidden && c.expectedOutput && c.actualOutput && !c.pass) {
    if (!looksLikeRowPreview(c.expectedOutput)) {
      summary = `Expected: ${c.expectedOutput}`;
    }
    if (!looksLikeRowPreview(c.actualOutput)) {
      detail = detail ?? `Actual: ${c.actualOutput}`;
    }
  } else if (!hidden && !c.pass && c.expectedOutput && !looksLikeRowPreview(c.expectedOutput)) {
    summary = `Expected: ${c.expectedOutput}`;
  }

  if (hidden && c.pass) {
    detail = null;
    summary = null;
  }

  if (hidden && !c.pass && looksLikeRowPreview(c.expectedOutput ?? c.actualOutput)) {
    if (!summary && !detail) {
      detail = "Result differs from reference on this hidden scenario.";
    }
  }

  return {
    label,
    hidden,
    pass: c.pass,
    category: c.purpose ? formatSlugLabel(c.purpose) : null,
    concepts: (c.tests ?? []).map(formatSlugLabel),
    summary,
    detail,
    runtime: formatRuntime(c.runtimeMs),
  };
}

export function buildVerdictSummary(verdict: JudgeVerdict) {
  const failedConcepts = collectFailedConcepts(verdict.cases);
  const caseDetails = verdict.cases.map(buildCaseDisplayDetail);
  const runtime = formatRuntime(verdict.runtimeMs ?? verdict.metrics?.runtimeMs);

  return {
    headline: verdictHeadline(verdict.status),
    passed: verdict.passed,
    total: verdict.total,
    message: verdict.message,
    runtime,
    failedConcepts,
    caseDetails,
    accepted: verdict.status === "accepted",
  };
}

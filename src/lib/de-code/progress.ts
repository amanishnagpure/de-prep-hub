import type { CodeSubmission, CodeTrackId, SubmissionStatus } from "@/lib/de-code/types";

const STORAGE_KEY = "de-prep-hub-de-code";
const CODE_KEY = "de-prep-hub-de-code-solutions";

export { STORAGE_KEY as DE_CODE_STORAGE_KEY, CODE_KEY as DE_CODE_SOLUTIONS_KEY };

type Store = {
  submissions: CodeSubmission[];
  solved: string[];
};

function normalizeStore(raw: unknown): Store {
  if (!raw || typeof raw !== "object") return { submissions: [], solved: [] };
  const data = raw as Partial<Store>;
  return {
    submissions: Array.isArray(data.submissions) ? data.submissions : [],
    solved: Array.isArray(data.solved) ? data.solved : [],
  };
}

function readStore(): Store {
  if (typeof window === "undefined") return { submissions: [], solved: [] };
  try {
    return normalizeStore(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"));
  } catch {
    return { submissions: [], solved: [] };
  }
}

function writeStore(store: Store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("de-code-updated"));
}

export function getSavedCode(track: CodeTrackId, slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
    return map[`${track}:${slug}`] ?? null;
  } catch {
    return null;
  }
}

export function saveCode(track: CodeTrackId, slug: string, code: string) {
  if (typeof window === "undefined") return;
  const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
  map[`${track}:${slug}`] = code;
  localStorage.setItem(CODE_KEY, JSON.stringify(map));
}

export function getSavedChallengeCode(
  slug: string,
  language: string
): string | null {
  if (typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
    return map[`challenge:${slug}:${language}`] ?? null;
  } catch {
    return null;
  }
}

export function saveChallengeCode(slug: string, language: string, code: string) {
  if (typeof window === "undefined") return;
  const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
  map[`challenge:${slug}:${language}`] = code;
  localStorage.setItem(CODE_KEY, JSON.stringify(map));
}

export function isProblemSolved(problemId: string): boolean {
  return readStore().solved.includes(problemId);
}

export function recordSubmission(submission: Omit<CodeSubmission, "id" | "createdAt">) {
  const store = readStore();
  const row: CodeSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.submissions.unshift(row);
  store.submissions = store.submissions.slice(0, 500);
  if (submission.status === "accepted") {
    store.solved = [...new Set([...store.solved, submission.problemId])];
  }
  writeStore(store);
  return row;
}

export function getSubmissions(problemId: string): CodeSubmission[] {
  return readStore().submissions.filter((s) => s.problemId === problemId);
}

export function getMostRecentSubmission(): CodeSubmission | undefined {
  return readStore().submissions[0];
}

export function getAllSubmissions(): CodeSubmission[] {
  return readStore().submissions;
}

export function getSolvedProblemIds(): string[] {
  return readStore().solved;
}

export function getTrackStats(track: CodeTrackId, total: number) {
  const prefix = `${track}/`;
  const solved = readStore().solved.filter((id) => id.startsWith(prefix)).length;
  return {
    solved,
    total,
    percent: total ? Math.round((solved / total) * 100) : 0,
  };
}

export function getTopicStats(track: CodeTrackId, problemIds: string[]) {
  const solvedSet = new Set(readStore().solved);
  const solved = problemIds.filter((id) => solvedSet.has(id)).length;
  const total = problemIds.length;
  return {
    solved,
    total,
    percent: total ? Math.round((solved / total) * 100) : 0,
  };
}

export function statusLabel(status: SubmissionStatus): string {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "wrong_answer":
      return "Wrong Answer";
    case "runtime_error":
      return "Runtime Error";
    case "compilation_error":
      return "Compilation Error";
    case "time_limit_exceeded":
      return "Time Limit Exceeded";
    default:
      return "Pending";
  }
}

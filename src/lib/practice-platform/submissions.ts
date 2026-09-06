import type {
  PlatformSubmission,
  PracticeTrackId,
  SubmissionStatus,
} from "@/lib/practice-platform/types";

const STORAGE_KEY = "de-prep-hub-practice-platform";
const CODE_KEY = "de-prep-hub-practice-platform-code";

export { STORAGE_KEY as PRACTICE_PLATFORM_STORAGE_KEY, CODE_KEY as PRACTICE_PLATFORM_CODE_KEY };

type Store = {
  submissions: PlatformSubmission[];
  solved: string[];
};

function normalizeStore(raw: unknown): Store {
  if (!raw || typeof raw !== "object") {
    return { submissions: [], solved: [] };
  }
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
  window.dispatchEvent(new CustomEvent("practice-platform-updated"));
}

export function getSavedCode(track: PracticeTrackId, slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
    return map[`${track}:${slug}`] ?? null;
  } catch {
    return null;
  }
}

export function saveCode(track: PracticeTrackId, slug: string, code: string) {
  if (typeof window === "undefined") return;
  const map = JSON.parse(localStorage.getItem(CODE_KEY) ?? "{}") as Record<string, string>;
  map[`${track}:${slug}`] = code;
  localStorage.setItem(CODE_KEY, JSON.stringify(map));
}

export function isProblemSolved(problemId: string): boolean {
  return readStore().solved.includes(problemId);
}

export function recordSubmission(submission: Omit<PlatformSubmission, "id" | "createdAt">) {
  const store = readStore();
  const row: PlatformSubmission = {
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

export function getSubmissions(problemId: string): PlatformSubmission[] {
  return readStore().submissions.filter((s) => s.problemId === problemId);
}

export function getTrackStats(track: PracticeTrackId, total: number) {
  const store = readStore();
  const prefix = `${track}/`;
  const solved = store.solved.filter((id) => id.startsWith(prefix)).length;
  return {
    solved,
    total,
    percent: total ? Math.round((solved / total) * 100) : 0,
  };
}

export function problemStorageId(track: PracticeTrackId, slug: string): string {
  return `${track}:${slug}`;
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

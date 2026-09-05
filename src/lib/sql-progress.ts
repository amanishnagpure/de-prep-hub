export const SQL_PROGRESS_KEY = "de-prep-hub-sql-progress";

export type InterviewConfidence = "know" | "unsure" | "dont";

export interface SqlProgress {
  lastVisited?: { path: string; label: string; at: string };
  practiceSolved: number[];
  interviewConfidence: Record<string, InterviewConfidence>;
  notesChaptersRead: string[];
  leetcodeSolved: string[];
  leetcodeConfidence: Record<string, InterviewConfidence>;
  mockSessionsCompleted?: number;
  visitDates: string[];
}

const DEFAULT_PROGRESS: SqlProgress = {
  practiceSolved: [],
  interviewConfidence: {},
  notesChaptersRead: [],
  leetcodeSolved: [],
  leetcodeConfidence: {},
  mockSessionsCompleted: 0,
  visitDates: [],
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getSqlProgress(): SqlProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const stored = localStorage.getItem(SQL_PROGRESS_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: SqlProgress): void {
  localStorage.setItem(SQL_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("sql-progress-updated"));
}

export function recordSqlVisit(path: string, label: string): void {
  const progress = getSqlProgress();
  const today = todayKey();
  const visitDates = progress.visitDates.includes(today)
    ? progress.visitDates
    : [...progress.visitDates, today].slice(-60);

  saveProgress({
    ...progress,
    lastVisited: { path, label, at: new Date().toISOString() },
    visitDates,
  });
}

export function setPracticeSolved(id: number, solved: boolean): void {
  const progress = getSqlProgress();
  const practiceSolved = solved
    ? Array.from(new Set([...progress.practiceSolved, id]))
    : progress.practiceSolved.filter((item) => item !== id);

  saveProgress({ ...progress, practiceSolved });
}

export function isPracticeSolved(id: number): boolean {
  return getSqlProgress().practiceSolved.includes(id);
}

export function setInterviewConfidence(id: number, confidence: InterviewConfidence): void {
  const progress = getSqlProgress();
  saveProgress({
    ...progress,
    interviewConfidence: { ...progress.interviewConfidence, [String(id)]: confidence },
  });
}

export function getInterviewConfidence(id: number): InterviewConfidence | null {
  return getSqlProgress().interviewConfidence[String(id)] ?? null;
}

export function markNotesChapterRead(chapterId: string): void {
  const progress = getSqlProgress();
  if (progress.notesChaptersRead.includes(chapterId)) return;

  saveProgress({
    ...progress,
    notesChaptersRead: [...progress.notesChaptersRead, chapterId],
  });
}

export function getSqlStreak(): number {
  const dates = [...getSqlProgress().visitDates].sort().reverse();
  if (dates.length === 0) return 0;

  let streak = 0;
  const cursor = new Date();

  for (let i = 0; i < dates.length; i++) {
    const expected = cursor.toISOString().slice(0, 10);
    if (dates[i] === expected) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0 && dates[0] !== expected) {
      const yesterday = new Date(cursor);
      yesterday.setDate(yesterday.getDate() - 1);
      if (dates[0] === yesterday.toISOString().slice(0, 10)) {
        streak++;
        cursor.setDate(cursor.getDate() - 2);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

export function getPracticeStats(total: number) {
  const solved = getSqlProgress().practiceSolved.length;
  return {
    solved,
    total,
    percent: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
}

export function getInterviewStats(total: number) {
  const entries = Object.values(getSqlProgress().interviewConfidence);
  const know = entries.filter((c) => c === "know").length;
  const unsure = entries.filter((c) => c === "unsure").length;
  const dont = entries.filter((c) => c === "dont").length;
  const reviewed = entries.length;

  return { know, unsure, dont, reviewed, total, percent: total > 0 ? Math.round((know / total) * 100) : 0 };
}

export function getNotesStats(totalChapters: number) {
  const read = getSqlProgress().notesChaptersRead.length;
  return { read, total: totalChapters, percent: totalChapters > 0 ? Math.round((read / totalChapters) * 100) : 0 };
}

export function setLeetCodeSolved(slug: string, solved: boolean): void {
  const progress = getSqlProgress();
  const leetcodeSolved = solved
    ? Array.from(new Set([...progress.leetcodeSolved, slug]))
    : progress.leetcodeSolved.filter((item) => item !== slug);

  saveProgress({ ...progress, leetcodeSolved });
}

export function isLeetCodeSolved(slug: string): boolean {
  return getSqlProgress().leetcodeSolved.includes(slug);
}

export function getLeetCodeStats(total: number) {
  const progress = getSqlProgress();
  const confident = Object.values(progress.leetcodeConfidence).filter((c) => c === "know").length;
  const solved = new Set([
    ...progress.leetcodeSolved,
    ...Object.entries(progress.leetcodeConfidence)
      .filter(([, c]) => c === "know")
      .map(([slug]) => slug),
  ]).size;

  return {
    solved,
    confident,
    total,
    percent: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
}

export function setLeetCodeConfidence(slug: string, confidence: InterviewConfidence): void {
  const progress = getSqlProgress();
  const leetcodeSolved =
    confidence === "know"
      ? Array.from(new Set([...progress.leetcodeSolved, slug]))
      : progress.leetcodeSolved;

  saveProgress({
    ...progress,
    leetcodeConfidence: { ...progress.leetcodeConfidence, [slug]: confidence },
    leetcodeSolved,
  });
}

export function getLeetCodeConfidence(slug: string): InterviewConfidence | null {
  return getSqlProgress().leetcodeConfidence[slug] ?? null;
}

export function getLeetCodeReviewCount(): number {
  const progress = getSqlProgress();
  return Object.values(progress.leetcodeConfidence).filter(
    (c) => c === "unsure" || c === "dont"
  ).length;
}

export function recordMockSessionComplete(): void {
  const progress = getSqlProgress();
  saveProgress({
    ...progress,
    mockSessionsCompleted: (progress.mockSessionsCompleted ?? 0) + 1,
  });
}

export function exportSqlProgress(): string {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: getSqlProgress(),
    topicProgress: localStorage.getItem("de-prep-hub-progress"),
    dialect: localStorage.getItem("de-prep-hub-sql-dialect"),
  };
  return JSON.stringify(payload, null, 2);
}

export function importSqlProgress(raw: string): { ok: boolean; message: string } {
  try {
    const payload = JSON.parse(raw);
    if (!payload.progress) {
      return { ok: false, message: "Invalid backup file — missing progress data." };
    }
    localStorage.setItem(SQL_PROGRESS_KEY, JSON.stringify(payload.progress));
    if (payload.topicProgress) {
      localStorage.setItem("de-prep-hub-progress", payload.topicProgress);
    }
    if (payload.dialect) {
      localStorage.setItem("de-prep-hub-sql-dialect", payload.dialect);
    }
    window.dispatchEvent(new CustomEvent("sql-progress-updated"));
    window.dispatchEvent(new CustomEvent("progress-updated"));
    return { ok: true, message: "Progress restored successfully." };
  } catch {
    return { ok: false, message: "Could not parse backup file." };
  }
}

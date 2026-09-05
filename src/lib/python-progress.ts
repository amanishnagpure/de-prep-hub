export const PYTHON_PROGRESS_KEY = "de-prep-hub-python-progress";

export type InterviewConfidence = "know" | "unsure" | "dont";

export interface PythonProgress {
  lastVisited?: { path: string; label: string; at: string };
  practiceSolved: number[];
  interviewConfidence: Record<string, InterviewConfidence>;
  notesChaptersRead: string[];
  codingSolved: string[];
  codingConfidence: Record<string, InterviewConfidence>;
  visitDates: string[];
}

const DEFAULT_PROGRESS: PythonProgress = {
  practiceSolved: [],
  interviewConfidence: {},
  notesChaptersRead: [],
  codingSolved: [],
  codingConfidence: {},
  visitDates: [],
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getPythonProgress(): PythonProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const stored = localStorage.getItem(PYTHON_PROGRESS_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: PythonProgress): void {
  localStorage.setItem(PYTHON_PROGRESS_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent("python-progress-updated"));
}

export function recordPythonVisit(path: string, label: string): void {
  const progress = getPythonProgress();
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
  const progress = getPythonProgress();
  const practiceSolved = solved
    ? Array.from(new Set([...progress.practiceSolved, id]))
    : progress.practiceSolved.filter((item) => item !== id);

  saveProgress({ ...progress, practiceSolved });
}

export function isPracticeSolved(id: number): boolean {
  return getPythonProgress().practiceSolved.includes(id);
}

export function setInterviewConfidence(id: number, confidence: InterviewConfidence): void {
  const progress = getPythonProgress();
  saveProgress({
    ...progress,
    interviewConfidence: { ...progress.interviewConfidence, [String(id)]: confidence },
  });
}

export function getInterviewConfidence(id: number): InterviewConfidence | null {
  return getPythonProgress().interviewConfidence[String(id)] ?? null;
}

export function markNotesChapterRead(chapterId: string): void {
  const progress = getPythonProgress();
  if (progress.notesChaptersRead.includes(chapterId)) return;

  saveProgress({
    ...progress,
    notesChaptersRead: [...progress.notesChaptersRead, chapterId],
  });
}

export function getPythonStreak(): number {
  const dates = [...getPythonProgress().visitDates].sort().reverse();
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
  const solved = getPythonProgress().practiceSolved.length;
  return {
    solved,
    total,
    percent: total > 0 ? Math.round((solved / total) * 100) : 0,
  };
}

export function getInterviewStats(total: number) {
  const entries = Object.values(getPythonProgress().interviewConfidence);
  const know = entries.filter((c) => c === "know").length;
  const unsure = entries.filter((c) => c === "unsure").length;
  const dont = entries.filter((c) => c === "dont").length;
  const reviewed = entries.length;

  return { know, unsure, dont, reviewed, total, percent: total > 0 ? Math.round((know / total) * 100) : 0 };
}

export function getNotesStats(totalChapters: number) {
  const read = getPythonProgress().notesChaptersRead.length;
  return { read, total: totalChapters, percent: totalChapters > 0 ? Math.round((read / totalChapters) * 100) : 0 };
}

export function setCodingSolved(slug: string, solved: boolean): void {
  const progress = getPythonProgress();
  const codingSolved = solved
    ? Array.from(new Set([...progress.codingSolved, slug]))
    : progress.codingSolved.filter((item) => item !== slug);

  saveProgress({ ...progress, codingSolved });
}

export function isCodingSolved(slug: string): boolean {
  return getPythonProgress().codingSolved.includes(slug);
}

export function getCodingStats(total: number) {
  const progress = getPythonProgress();
  const confident = Object.values(progress.codingConfidence).filter((c) => c === "know").length;
  const solved = new Set([
    ...progress.codingSolved,
    ...Object.entries(progress.codingConfidence)
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

export function setCodingConfidence(slug: string, confidence: InterviewConfidence): void {
  const progress = getPythonProgress();
  const codingSolved =
    confidence === "know"
      ? Array.from(new Set([...progress.codingSolved, slug]))
      : progress.codingSolved;

  saveProgress({
    ...progress,
    codingConfidence: { ...progress.codingConfidence, [slug]: confidence },
    codingSolved,
  });
}

export function getCodingConfidence(slug: string): InterviewConfidence | null {
  return getPythonProgress().codingConfidence[slug] ?? null;
}

export function exportPythonProgress(): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: getPythonProgress(),
    },
    null,
    2
  );
}

export function importPythonProgress(raw: string): { ok: boolean; message: string } {
  try {
    const payload = JSON.parse(raw);
    if (!payload.progress) {
      return { ok: false, message: "Invalid backup file — missing progress data." };
    }
    localStorage.setItem(PYTHON_PROGRESS_KEY, JSON.stringify(payload.progress));
    window.dispatchEvent(new CustomEvent("python-progress-updated"));
    return { ok: true, message: "Progress restored successfully." };
  } catch {
    return { ok: false, message: "Could not parse backup file." };
  }
}

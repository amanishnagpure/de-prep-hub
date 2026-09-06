import problems from "@/data/practice-platform/problems.json";
import type { PlatformProblem, PracticeTrackId } from "@/lib/practice-platform/types";

const ALL = problems as PlatformProblem[];

const DIFF_ORDER = { easy: 0, medium: 1, hard: 2 } as const;

export function getPlatformProblems(track: PracticeTrackId): PlatformProblem[] {
  return ALL.filter((p) => p.track === track).sort((a, b) => {
    const diff = DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });
}

export function getPlatformProblem(
  track: PracticeTrackId,
  slug: string
): PlatformProblem | undefined {
  return ALL.find((p) => p.track === track && p.slug === slug);
}

export function getPlatformTrackCount(track: PracticeTrackId): number {
  return getPlatformProblems(track).length;
}

export function getPlatformProblemById(id: string): PlatformProblem | undefined {
  return ALL.find((p) => p.id === id);
}

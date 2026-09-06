import { getPlatformTrackCount } from "@/lib/practice-platform/problem-bank";
import { PRACTICE_SECTION } from "@/lib/practice-section";

export const PRACTICE_TRACKS = [
  {
    id: "sql",
    label: "SQL",
    href: `${PRACTICE_SECTION.home}/sql`,
    description: "Query problems — run in sql.js, submit against reference",
    problemCount: getPlatformTrackCount("sql"),
  },
  {
    id: "spark",
    label: "Spark",
    href: `${PRACTICE_SECTION.home}/spark`,
    description: "PySpark API drills with reference validation",
    problemCount: getPlatformTrackCount("spark"),
  },
  {
    id: "python",
    label: "Python",
    href: `${PRACTICE_SECTION.home}/python`,
    description: "Data engineering Python with hidden test cases",
    problemCount: getPlatformTrackCount("python"),
  },
  {
    id: "dsa",
    label: "DSA",
    href: `${PRACTICE_SECTION.home}/dsa`,
    description: "Algorithm problems judged in-browser (Pyodide)",
    problemCount: getPlatformTrackCount("dsa"),
  },
] as const;

export type PracticeTrackId = (typeof PRACTICE_TRACKS)[number]["id"];

export function isPracticeTrackId(value: string | null | undefined): value is PracticeTrackId {
  return PRACTICE_TRACKS.some((track) => track.id === value);
}

export function getPracticeTrack(id: string) {
  return PRACTICE_TRACKS.find((track) => track.id === id);
}

export function practiceTrackPath(track: PracticeTrackId): string {
  return `${PRACTICE_SECTION.home}/${track}`;
}

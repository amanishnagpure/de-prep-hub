import type { CodeTrackId, ExperienceLevel } from "@/lib/de-code/types";

export const CODE_SECTION = {
  home: "/code",
  label: "Practice",
  tagline: "Focused exercises for Data Engineers",
} as const;

export const CODE_TRACKS = [
  {
    id: "sql" as const,
    label: "SQL",
    description: "Fundamentals → analytical SQL → DE patterns (SCD, CDC, dedupe)",
    icon: "database" as const,
    targetCount: 500,
  },
  {
    id: "python" as const,
    label: "Python",
    description: "Core Python, ETL, pandas-style data manipulation",
    icon: "code" as const,
    targetCount: 300,
  },
  {
    id: "pyspark" as const,
    label: "PySpark",
    description: "DataFrames, optimization, real pipeline scenarios",
    icon: "zap" as const,
    targetCount: 500,
  },
  {
    id: "dsa" as const,
    label: "DSA",
    description: "Algorithms weighted for data engineering interviews",
    icon: "terminal" as const,
    targetCount: 250,
  },
] satisfies ReadonlyArray<{
  id: CodeTrackId;
  label: string;
  description: string;
  icon: "database" | "code" | "zap" | "terminal";
  targetCount: number;
}>;

export const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; years: string }[] = [
  { id: "beginner", label: "Beginner", years: "0–1 yr" },
  { id: "intermediate", label: "Intermediate", years: "1–3 yr" },
  { id: "advanced", label: "Advanced", years: "3–5 yr" },
  { id: "expert", label: "Expert", years: "5+ yr" },
];

export const SQL_SUBTOPICS = [
  "fundamentals",
  "intermediate",
  "advanced",
  "de-sql",
] as const;

export function isCodeTrackId(value: string | null | undefined): value is CodeTrackId {
  return CODE_TRACKS.some((t) => t.id === value);
}

export function codeTrackPath(track: CodeTrackId): string {
  return `${CODE_SECTION.home}/${track}`;
}

export function isCodeSectionRoute(pathname: string): boolean {
  return pathname === CODE_SECTION.home || pathname.startsWith(`${CODE_SECTION.home}/`);
}

export const CHALLENGE_SECTION = {
  home: "/code/challenges",
  label: "DE Challenges",
} as const;

export function challengePath(slug: string): string {
  return `${CHALLENGE_SECTION.home}/${slug}`;
}

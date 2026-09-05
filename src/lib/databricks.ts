export const DATABRICKS_ROUTES = {
  home: "/databricks",
  notes: "/databricks/notes",
  practice: "/databricks/practice",
  interview: "/databricks/interview",
} as const;

export const DATABRICKS_NOTES_SECTIONS = [
  { id: "delta-lake", label: "Delta Lake" },
  { id: "unity-catalog", label: "Unity Catalog" },
  { id: "workflows", label: "Workflows" },
  { id: "de-patterns", label: "DE Patterns" },
  { id: "traps", label: "Traps" },
] as const;

export const DATABRICKS_STATS = {
  practiceTotal: 25,
  interviewTotal: 45,
  noteChapters: 8,
} as const;

export const DATABRICKS_CHAPTER_META = [
  { id: "delta-lake", title: "Delta Lake", estimate: "~2.5h", href: "/databricks/notes?chapter=delta-lake" },
  { id: "unity-catalog", title: "Unity Catalog", estimate: "~1.5h", href: "/databricks/notes?chapter=unity-catalog" },
  { id: "workflows", title: "Workflows", estimate: "~1.5h", href: "/databricks/notes?chapter=workflows" },
  { id: "de-patterns", title: "DE Patterns", estimate: "~2h", href: "/databricks/notes?chapter=de-patterns" },
  { id: "traps", title: "Traps & Pitfalls", estimate: "~1h", href: "/databricks/notes?chapter=traps" },
  {
    id: "de2-interview-databricks-fundamentals",
    title: "DE2 — Fundamentals",
    estimate: "~40m",
    href: "/databricks/notes?chapter=de2-interview-databricks-fundamentals",
  },
  {
    id: "de2-interview-photon-delta-lake",
    title: "DE2 — Photon & Delta",
    estimate: "~1h",
    href: "/databricks/notes?chapter=de2-interview-photon-delta-lake",
  },
  {
    id: "de2-interview-delta-management",
    title: "DE2 — Delta Ops",
    estimate: "~45m",
    href: "/databricks/notes?chapter=de2-interview-delta-management",
  },
] as const;

export const DATABRICKS_PRACTICE_CATEGORIES = {
  "delta-lake": "Delta Lake",
  merge: "MERGE / UPSERT",
  "optimize-vacuum": "OPTIMIZE / VACUUM",
  "unity-catalog": "Unity Catalog",
  workflows: "Workflows",
  medallion: "Medallion",
} as const;

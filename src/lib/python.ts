export const PYTHON_ROUTES = {
  home: "/python",
  notes: "/python/notes",
  practice: "/python/practice",
  coding: "/python/coding",
  interview: "/python/interview",
} as const;

export const PYTHON_NOTES_SECTIONS = [
  { id: "basic", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "advanced", label: "Advance" },
] as const;

export const PYTHON_STATS = {
  practiceTotal: 40,
  interviewTotal: 60,
  codingTotal: 15,
  noteChapters: 5,
} as const;

export const PYTHON_CHAPTER_META = [
  { id: "basic", title: "Easy", estimate: "~2h", href: "/python/notes?chapter=basic" },
  { id: "medium", title: "Medium", estimate: "~3h", href: "/python/notes?chapter=medium" },
  { id: "advanced", title: "Advanced", estimate: "~2h", href: "/python/notes?chapter=advanced" },
  { id: "data-engineering", title: "Data Engineering", estimate: "~1.5h", href: "/python/notes?chapter=data-engineering" },
  { id: "patterns-traps", title: "Patterns & Traps", estimate: "~1h", href: "/python/notes?chapter=patterns-traps" },
] as const;

export const PYTHON_PRACTICE_CATEGORIES = {
  "pure-python": "Pure Python",
  pandas: "Pandas",
  "json-csv": "JSON / CSV",
  "data-cleaning": "Data cleaning",
  etl: "ETL",
} as const;

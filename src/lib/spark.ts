export const SPARK_ROUTES = {
  home: "/spark",
  notes: "/spark/notes",
  practice: "/spark/practice",
  interview: "/spark/interview",
  mock: "/spark/mock",
} as const;

export const SPARK_NOTES_SECTIONS = [
  { id: "basic", label: "Basic" },
  { id: "medium", label: "Medium" },
  { id: "advance", label: "Advance" },
] as const;

export const SPARK_STATS = {
  practiceTotal: 150,
  interviewTotal: 100,
  noteChapters: 3,
} as const;

export const SPARK_CHAPTER_META = [
  { id: "basic", title: "Basic", estimate: "~8h", href: "/spark/notes?chapter=basic" },
  { id: "medium", title: "Medium", estimate: "~10h", href: "/spark/notes?chapter=medium" },
  { id: "advance", title: "Advance", estimate: "~8h", href: "/spark/notes?chapter=advance" },
] as const;

export const SPARK_PRACTICE_CATEGORIES = {
  transformations: "Transformations",
  joins: "Joins",
  window: "Window",
  optimization: "Optimization",
  io: "Read/Write",
  nested: "Nested JSON",
} as const;

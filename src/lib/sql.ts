export const SQL_ROUTES = {
  home: "/sql",
  notes: "/sql/notes",
  practice: "/sql/practice",
  leetcode: "/sql/leetcode",
  interview: "/sql/interview",
  mock: "/sql/mock",
  playground: "/sql/playground",
} as const;

export const SQL_NOTES_SECTIONS = [
  { id: "basic", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "advanced", label: "Advance" },
] as const;

export const SQL_STATS = {
  practiceTotal: 150,
  interviewTotal: 69,
  leetcodeTotal: 50,
  noteChapters: 10,
} as const;

export const SQL_MODULE_ESTIMATES = {
  notes: "~4.5h read",
  practice: "~8h drill",
  interview: "~8h track",
} as const;

export const SQL_CHAPTER_META = [
  { id: "basic", title: "Basic", estimate: "~45 min", href: "/sql/notes?chapter=basic" },
  { id: "medium", title: "Medium", estimate: "~1h", href: "/sql/notes?chapter=medium" },
  { id: "advanced", title: "Advanced", estimate: "~1.5h", href: "/sql/notes?chapter=advanced" },
  {
    id: "data-engineering",
    title: "Data Engineering",
    estimate: "~30 min",
    href: "/sql/notes?chapter=data-engineering",
  },
  {
    id: "patterns-traps",
    title: "Patterns & Traps",
    estimate: "~30 min",
    href: "/sql/notes?chapter=patterns-traps",
  },
  {
    id: "azure-databricks-sql",
    title: "Azure & Databricks SQL",
    estimate: "~30 min",
    href: "/sql/notes?chapter=azure-databricks-sql",
  },
  {
    id: "interview-guide-sql-plate-1",
    title: "IG — SQL Plate 1",
    estimate: "~30m",
    href: "/sql/notes?chapter=interview-guide-sql-plate-1",
  },
  {
    id: "interview-guide-sql-plate-2",
    title: "IG — SQL Plate 2",
    estimate: "~30m",
    href: "/sql/notes?chapter=interview-guide-sql-plate-2",
  },
  {
    id: "interview-guide-sql-plate-3",
    title: "IG — SQL Plate 3",
    estimate: "~30m",
    href: "/sql/notes?chapter=interview-guide-sql-plate-3",
  },
  {
    id: "interview-guide-sql-plate-4",
    title: "IG — SQL Plate 4",
    estimate: "~25m",
    href: "/sql/notes?chapter=interview-guide-sql-plate-4",
  },
] as const;

export const AIRFLOW_ROUTES = {
  home: "/airflow",
  notes: "/airflow/notes",
  practice: "/airflow/practice",
  interview: "/airflow/interview",
} as const;

export const AIRFLOW_NOTES_SECTIONS = [
  { id: "dags", label: "DAGs" },
  { id: "operators", label: "Operators" },
  { id: "scheduling", label: "Scheduling" },
] as const;

export const AIRFLOW_STATS = {
  practiceTotal: 25,
  interviewTotal: 40,
  noteChapters: 5,
} as const;

export const AIRFLOW_CHAPTER_META = [
  { id: "dags", title: "DAGs", estimate: "~2h", href: "/airflow/notes?chapter=dags" },
  { id: "operators", title: "Operators", estimate: "~2.5h", href: "/airflow/notes?chapter=operators" },
  { id: "scheduling", title: "Scheduling", estimate: "~2h", href: "/airflow/notes?chapter=scheduling" },
  { id: "production", title: "Production", estimate: "~2h", href: "/airflow/notes?chapter=production" },
  { id: "traps", title: "Traps & Pitfalls", estimate: "~1.5h", href: "/airflow/notes?chapter=traps" },
] as const;

export const AIRFLOW_PRACTICE_CATEGORIES = {
  "dag-design": "DAG design",
  operators: "Operators",
  sensors: "Sensors",
  xcoms: "XComs",
  scheduling: "Scheduling",
  production: "Production",
} as const;

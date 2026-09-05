export const SYSTEM_DESIGN_ROUTES = {
  home: "/system-design",
  notes: "/system-design/notes",
  practice: "/system-design/practice",
  interview: "/system-design/interview",
} as const;

export const SYSTEM_DESIGN_NOTES_SECTIONS = [
  { id: "batch-vs-streaming", label: "Batch vs Streaming" },
  { id: "cdc-lakehouse", label: "CDC & Lakehouse" },
  { id: "medallion-architecture", label: "Medallion" },
  { id: "scalability-reliability", label: "Scalability" },
  { id: "case-studies", label: "Case Studies" },
] as const;

export const SYSTEM_DESIGN_STATS = {
  practiceTotal: 20,
  interviewTotal: 40,
  noteChapters: 5,
} as const;

export const SYSTEM_DESIGN_CHAPTER_META = [
  {
    id: "batch-vs-streaming",
    title: "Batch vs Streaming",
    estimate: "~2h",
    href: "/system-design/notes?chapter=batch-vs-streaming",
  },
  {
    id: "cdc-lakehouse",
    title: "CDC & Lakehouse",
    estimate: "~2h",
    href: "/system-design/notes?chapter=cdc-lakehouse",
  },
  {
    id: "medallion-architecture",
    title: "Medallion",
    estimate: "~1.5h",
    href: "/system-design/notes?chapter=medallion-architecture",
  },
  {
    id: "scalability-reliability",
    title: "Scalability",
    estimate: "~1.5h",
    href: "/system-design/notes?chapter=scalability-reliability",
  },
  {
    id: "case-studies",
    title: "Case Studies",
    estimate: "~2h",
    href: "/system-design/notes?chapter=case-studies",
  },
] as const;

export const SYSTEM_DESIGN_PRACTICE_CATEGORIES = {
  "batch-streaming": "Batch vs Streaming",
  kafka: "Kafka & Messaging",
  cdc: "CDC",
  lakehouse: "Lakehouse",
  medallion: "Medallion",
  sla: "SLA & Reliability",
  "data-quality": "Data Quality",
} as const;

export const INTERVIEW_PREP_ROUTES = {
  home: "/interview-prep",
  notes: "/interview-prep/notes",
  practice: "/interview-prep/practice",
  interview: "/interview-prep/interview",
} as const;

export const INTERVIEW_PREP_NOTES_SECTIONS = [
  { id: "behavioral", label: "Behavioral" },
  { id: "technical-roundup", label: "Technical" },
  { id: "resume", label: "Resume" },
] as const;

export const INTERVIEW_PREP_STATS = {
  practiceTotal: 20,
  interviewTotal: 60,
  noteChapters: 5,
} as const;

export const INTERVIEW_PREP_CHAPTER_META = [
  {
    id: "behavioral",
    title: "Behavioral & STAR",
    estimate: "~1.5h",
    href: "/interview-prep/notes?chapter=behavioral",
  },
  {
    id: "technical-roundup",
    title: "Technical Roundup",
    estimate: "~2h",
    href: "/interview-prep/notes?chapter=technical-roundup",
  },
  {
    id: "resume",
    title: "Resume & Portfolio",
    estimate: "~1h",
    href: "/interview-prep/notes?chapter=resume",
  },
  {
    id: "negotiation",
    title: "Salary & Negotiation",
    estimate: "~45m",
    href: "/interview-prep/notes?chapter=negotiation",
  },
  {
    id: "traps",
    title: "Traps & Red Flags",
    estimate: "~45m",
    href: "/interview-prep/notes?chapter=traps",
  },
] as const;

export const INTERVIEW_PREP_PRACTICE_CATEGORIES = {
  leadership: "Leadership",
  teamwork: "Teamwork",
  conflict: "Conflict",
  failure: "Failure & Learning",
  "project-delivery": "Project Delivery",
  "data-specific": "Data Engineering",
  communication: "Communication",
  initiative: "Initiative",
} as const;

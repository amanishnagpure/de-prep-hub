export const CLOUD_ROUTES = {
  home: "/cloud",
  notes: "/cloud/notes",
  practice: "/cloud/practice",
  interview: "/cloud/interview",
} as const;

export const CLOUD_NOTES_SECTIONS = [
  { id: "azure-data-factory", label: "ADF" },
  { id: "adls-gen2", label: "ADLS" },
  { id: "synapse", label: "Synapse" },
  { id: "azure-de-patterns", label: "Patterns" },
  { id: "traps", label: "Traps" },
] as const;

export const CLOUD_STATS = {
  practiceTotal: 25,
  interviewTotal: 50,
  noteChapters: 10,
} as const;

export const CLOUD_CHAPTER_META = [
  {
    id: "azure-data-factory",
    title: "Azure Data Factory",
    estimate: "~2h",
    href: "/cloud/notes?chapter=azure-data-factory",
  },
  {
    id: "adls-gen2",
    title: "ADLS Gen2",
    estimate: "~1.5h",
    href: "/cloud/notes?chapter=adls-gen2",
  },
  {
    id: "synapse",
    title: "Synapse Analytics",
    estimate: "~2h",
    href: "/cloud/notes?chapter=synapse",
  },
  {
    id: "azure-de-patterns",
    title: "Azure DE Patterns",
    estimate: "~1.5h",
    href: "/cloud/notes?chapter=azure-de-patterns",
  },
  {
    id: "traps",
    title: "Traps & Pitfalls",
    estimate: "~1h",
    href: "/cloud/notes?chapter=traps",
  },
  {
    id: "interview-guide-azure-adf-plate-1",
    title: "IG — ADF Plate 1",
    estimate: "~30m",
    href: "/cloud/notes?chapter=interview-guide-azure-adf-plate-1",
  },
  {
    id: "interview-guide-azure-adf-plate-2",
    title: "IG — ADF Plate 2",
    estimate: "~30m",
    href: "/cloud/notes?chapter=interview-guide-azure-adf-plate-2",
  },
  {
    id: "interview-guide-azure-adf-plate-3",
    title: "IG — ADF Plate 3",
    estimate: "~30m",
    href: "/cloud/notes?chapter=interview-guide-azure-adf-plate-3",
  },
  {
    id: "interview-guide-azure-adf-plate-4",
    title: "IG — ADF Plate 4",
    estimate: "~30m",
    href: "/cloud/notes?chapter=interview-guide-azure-adf-plate-4",
  },
  {
    id: "interview-guide-azure-adf-plate-5",
    title: "IG — ADF Plate 5",
    estimate: "~25m",
    href: "/cloud/notes?chapter=interview-guide-azure-adf-plate-5",
  },
] as const;

export const CLOUD_PRACTICE_CATEGORIES = {
  adf: "ADF",
  adls: "ADLS Gen2",
  synapse: "Synapse",
  security: "Security & Key Vault",
  patterns: "Patterns & Medallion",
} as const;

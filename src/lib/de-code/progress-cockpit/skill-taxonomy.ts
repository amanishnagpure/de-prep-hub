import type { ChallengeTaxonomyGroup } from "@/lib/de-code/challenge-taxonomy";
import type { CodeTrackId } from "@/lib/de-code/types";

export type SkillMapNodeId =
  | "sql"
  | "analytics"
  | "joins"
  | "etl"
  | "pyspark"
  | "cdc"
  | "warehousing"
  | "data-quality";

export type SkillMapNode = {
  id: SkillMapNodeId;
  label: string;
  x: number;
  y: number;
  practiceTopics?: { track: CodeTrackId; topicId: string }[];
  challengeGroups?: ChallengeTaxonomyGroup[];
  detailTopics?: { track: CodeTrackId; topicId: string; label: string }[];
};

/** Radial skill map — major DE families (viewBox 0 0 420 360) */
export const SKILL_MAP_NODES: SkillMapNode[] = [
  {
    id: "sql",
    label: "SQL",
    x: 210,
    y: 44,
    practiceTopics: [{ track: "sql", topicId: "fundamentals" }],
    detailTopics: [
      { track: "sql", topicId: "fundamentals", label: "Fundamentals" },
      { track: "sql", topicId: "joins", label: "Joins" },
      { track: "sql", topicId: "aggregations", label: "Aggregation" },
      { track: "sql", topicId: "window-functions", label: "Window Functions" },
      { track: "sql", topicId: "advanced-analytics", label: "Advanced Analytics" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    x: 92,
    y: 108,
    practiceTopics: [
      { track: "sql", topicId: "window-functions" },
      { track: "sql", topicId: "advanced-analytics" },
    ],
  },
  {
    id: "joins",
    label: "Joins",
    x: 328,
    y: 108,
    practiceTopics: [{ track: "sql", topicId: "joins" }],
  },
  {
    id: "etl",
    label: "ETL",
    x: 64,
    y: 196,
    practiceTopics: [
      { track: "python", topicId: "etl" },
      { track: "python", topicId: "data-processing" },
    ],
    challengeGroups: ["etl"],
  },
  {
    id: "pyspark",
    label: "PySpark",
    x: 356,
    y: 196,
    practiceTopics: [{ track: "pyspark", topicId: "dataframe-fundamentals" }],
    detailTopics: [
      { track: "pyspark", topicId: "dataframe-fundamentals", label: "DataFrames" },
      { track: "pyspark", topicId: "joins", label: "Joins" },
      { track: "pyspark", topicId: "window-functions", label: "Window Functions" },
      { track: "pyspark", topicId: "repartition-coalesce", label: "Optimization" },
      { track: "pyspark", topicId: "aggregations", label: "Spark SQL" },
    ],
  },
  {
    id: "cdc",
    label: "CDC",
    x: 108,
    y: 292,
    challengeGroups: ["cdc"],
  },
  {
    id: "warehousing",
    label: "Warehousing",
    x: 210,
    y: 318,
    practiceTopics: [
      { track: "sql", topicId: "scd" },
      { track: "sql", topicId: "incremental-loading" },
    ],
    challengeGroups: ["data-warehousing"],
  },
  {
    id: "data-quality",
    label: "Data Quality",
    x: 312,
    y: 292,
    practiceTopics: [
      { track: "sql", topicId: "data-quality" },
      { track: "sql", topicId: "deduplication" },
    ],
    challengeGroups: ["data-quality"],
  },
];

export const SKILL_MAP_EDGES: [SkillMapNodeId, SkillMapNodeId][] = [
  ["sql", "analytics"],
  ["sql", "joins"],
  ["analytics", "etl"],
  ["joins", "pyspark"],
  ["etl", "cdc"],
  ["etl", "warehousing"],
  ["pyspark", "data-quality"],
  ["warehousing", "data-quality"],
  ["cdc", "warehousing"],
];

/** Category grading key per skill-map node */
export const SKILL_NODE_CATEGORY: Record<
  SkillMapNodeId,
  "sql" | "python" | "pyspark" | "dsa" | "challenges" | "learn"
> = {
  sql: "sql",
  analytics: "sql",
  joins: "sql",
  etl: "python",
  pyspark: "pyspark",
  cdc: "learn",
  warehousing: "dsa",
  "data-quality": "challenges",
};

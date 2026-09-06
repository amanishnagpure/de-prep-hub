/** DE Challenge taxonomy — mirrors Phase 2 topic architecture for pipeline scenarios */

export type ChallengeTaxonomyGroup =
  | "etl"
  | "data-warehousing"
  | "cdc"
  | "data-quality"
  | "reliability"
  | "performance";

export type ChallengeTaxonomyTopic = {
  id: string;
  label: string;
  group: ChallengeTaxonomyGroup;
};

export const CHALLENGE_TAXONOMY_GROUPS: {
  id: ChallengeTaxonomyGroup;
  label: string;
  description: string;
}[] = [
  { id: "etl", label: "ETL", description: "Batch and incremental extraction, transform, load" },
  {
    id: "data-warehousing",
    label: "Data Warehousing",
    description: "SCD, facts, dimensions, incremental loads",
  },
  { id: "cdc", label: "CDC", description: "Change data capture and merge pipelines" },
  {
    id: "data-quality",
    label: "Data Quality",
    description: "Deduplication, validation, reconciliation",
  },
  {
    id: "reliability",
    label: "Reliability",
    description: "Late data, schema evolution, pipeline resilience",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Partitioning, shuffle, optimization",
  },
];

export const CHALLENGE_TAXONOMY_TOPICS: ChallengeTaxonomyTopic[] = [
  { id: "batch", label: "Batch", group: "etl" },
  { id: "incremental", label: "Incremental", group: "etl" },
  { id: "scd", label: "SCD", group: "data-warehousing" },
  { id: "facts", label: "Facts", group: "data-warehousing" },
  { id: "dimensions", label: "Dimensions", group: "data-warehousing" },
  { id: "cdc-merge", label: "CDC Merge", group: "cdc" },
  { id: "deduplication", label: "Deduplication", group: "data-quality" },
  { id: "validation", label: "Validation", group: "data-quality" },
  { id: "reconciliation", label: "Reconciliation", group: "data-quality" },
  { id: "late-data", label: "Late Data", group: "reliability" },
  { id: "schema-evolution", label: "Schema Evolution", group: "reliability" },
  { id: "partitioning", label: "Partitioning", group: "performance" },
  { id: "shuffle", label: "Shuffle", group: "performance" },
  { id: "optimization", label: "Optimization", group: "performance" },
];

export function getChallengeGroupLabel(groupId: ChallengeTaxonomyGroup): string {
  return CHALLENGE_TAXONOMY_GROUPS.find((g) => g.id === groupId)?.label ?? groupId;
}

export function getChallengeTopicLabel(topicId: string): string {
  return CHALLENGE_TAXONOMY_TOPICS.find((t) => t.id === topicId)?.label ?? topicId;
}

export function getTopicsForGroup(groupId: ChallengeTaxonomyGroup): ChallengeTaxonomyTopic[] {
  return CHALLENGE_TAXONOMY_TOPICS.filter((t) => t.group === groupId);
}

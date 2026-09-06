/** DE Challenge problem model — orchestration layer over generic judge fixtures */

import type {
  JudgeComparisonConfig,
  JudgeResourceLimits,
} from "@/lib/judge/types";
import type { CodeDifficulty, ExperienceLevel } from "@/lib/de-code/types";
import type { ChallengeTaxonomyGroup } from "@/lib/de-code/challenge-taxonomy";

export type ProblemKind = "coding" | "de_challenge";

export type ChallengeExecutionLanguage = "sql" | "pyspark" | "python";

/** @deprecated Use taxonomyGroup + taxonomyTopic */
export type ChallengeCategory =
  | "ETL"
  | "Incremental Processing"
  | "CDC"
  | "SCD"
  | "Data Quality"
  | "Data Modeling"
  | "Late Arriving Data"
  | "Schema Evolution"
  | "Performance"
  | "Batch Processing"
  | "Streaming";

export type ChallengeOutputColumn = {
  name: string;
  type: string;
};

export type ChallengeTableSchema = {
  label: string;
  description: string;
  columns: ChallengeOutputColumn[];
};

export type DEChallengeProblem = {
  problemKind: "de_challenge";
  /** Display order in challenge roadmap */
  challengeNumber: number;
  id: string;
  slug: string;
  title: string;
  scenario: string;
  objective: string;
  requirements: string[];
  /** Skills tested — shown in UI */
  skills: string[];
  difficulty: CodeDifficulty;
  experienceLevel: ExperienceLevel;
  /** Taxonomy group (e.g. data-warehousing) */
  taxonomyGroup: ChallengeTaxonomyGroup;
  /** Taxonomy topic slug (e.g. scd) */
  taxonomyTopic: string;
  /** Legacy display label — derived from taxonomy when absent */
  challengeCategory?: ChallengeCategory;
  executionLanguages: ChallengeExecutionLanguage[];
  defaultLanguage: ChallengeExecutionLanguage;
  inputTables: ChallengeTableSchema[];
  outputTable: string;
  outputSchema: ChallengeOutputColumn[];
  starterCode: Record<ChallengeExecutionLanguage, string>;
  hints: string[];
  timeLimitMs: number;
  memoryLimitMb: number;
  /** Key in challenge-seeds.json — must match catalog seedSlug */
  seedSlug: string;
  evaluation: {
    outputTables: string[];
    comparison: JudgeComparisonConfig;
    limits?: JudgeResourceLimits;
  };
};

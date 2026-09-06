import type { PySparkFixture } from "@/lib/de-code/pyspark-seed-types";
import type { SqlFixture } from "@/lib/de-code/sql-seed-types";
import type { JudgeComparisonConfig, JudgeResourceLimits } from "@/lib/judge/types";
import seeds from "./challenge-seeds.json";

export type DeChallengeSeed = {
  outputTable: string;
  resultVar: string;
  pyspark: {
    referenceCode: string;
    fixtures: PySparkFixture[];
    comparison: JudgeComparisonConfig;
    limits: JudgeResourceLimits;
  };
  sql: {
    referenceQuery: string;
    fixtures: SqlFixture[];
    tables: {
      label: string;
      description: string;
      columns: { name: string; type: string; key?: string }[];
    }[];
    comparison: JudgeComparisonConfig;
    limits: JudgeResourceLimits;
  };
  adversarial?: {
    pyspark: string;
    sql: string;
  };
};

export const DE_CHALLENGE_SEEDS = seeds as Record<string, DeChallengeSeed>;

export function hasDeChallengeSeed(slug: string): boolean {
  return slug in DE_CHALLENGE_SEEDS;
}

export function getDeChallengeSeed(slug: string): DeChallengeSeed | undefined {
  return DE_CHALLENGE_SEEDS[slug];
}

export function getChallengeFixtureCounts(seedSlug: string): {
  public: number;
  hidden: number;
  total: number;
} | null {
  const seed = getDeChallengeSeed(seedSlug);
  if (!seed) return null;
  const fixtures = seed.pyspark.fixtures;
  const hidden = fixtures.filter((f) => f.isHidden).length;
  return { public: fixtures.length - hidden, hidden, total: fixtures.length };
}

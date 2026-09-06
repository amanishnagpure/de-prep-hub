#!/usr/bin/env node
/** Aggregates challenge seed modules → challenge-seeds.json (data-driven, no per-challenge judge code) */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { fixtureToInitSql, runSqlJudgeCore } from "./judge/sql/judge_core.mjs";
import incrementalCustomerPipeline from "./challenge-seeds/incremental-customer-pipeline.mjs";
import scd2CustomerDimension from "./challenge-seeds/scd2-customer-dimension.mjs";
import cdcOrderPipeline from "./challenge-seeds/cdc-order-pipeline.mjs";
import dataQualityPipeline from "./challenge-seeds/data-quality-pipeline.mjs";
import lateArrivingEvents from "./challenge-seeds/late-arriving-events.mjs";
import schemaEvolution from "./challenge-seeds/schema-evolution.mjs";
import pipelineReconciliation from "./challenge-seeds/pipeline-reconciliation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outJson = path.join(root, "src/data/de-code/challenge-seeds.json");
const outTs = path.join(root, "src/data/de-code/challenge-seeds.ts");
const catalogPath = path.join(root, "src/data/de-code/challenges/catalog.json");

/** Register new challenges here — catalog seedSlug must match key */
const SEED_MODULES = {
  "incremental-customer-pipeline": incrementalCustomerPipeline,
  "scd2-customer-dimension": scd2CustomerDimension,
  "cdc-order-pipeline": cdcOrderPipeline,
  "data-quality-pipeline": dataQualityPipeline,
  "late-arriving-events": lateArrivingEvents,
  "schema-evolution": schemaEvolution,
  "pipeline-reconciliation": pipelineReconciliation,
};

async function validateSeed(slug, seed, SQL) {
  const errors = [];
  for (const fixture of seed.sql.fixtures) {
    const initSql = fixtureToInitSql(fixture, seed.sql.tables);
    const db = new SQL.Database();
    try {
      db.run(initSql);
      db.exec(seed.sql.referenceQuery.trim());
    } catch (err) {
      errors.push(`${fixture.id}: ${err.message}`);
    } finally {
      db.close();
    }
  }

  if (errors.length) {
    throw new Error(`Seed "${slug}" validation failed:\n  ${errors.join("\n  ")}`);
  }

  const result = await runSqlJudgeCore(SQL, {
    userQuery: seed.sql.referenceQuery,
    referenceQuery: seed.sql.referenceQuery,
    fixtures: seed.sql.fixtures,
    mode: "submit",
    tableSchemas: seed.sql.tables,
    comparison: seed.sql.comparison,
    limits: seed.sql.limits,
  });

  if (result.status !== "accepted") {
    throw new Error(`Seed "${slug}" reference SQL failed submit: ${result.status}`);
  }
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const seeds = {};

  for (const challenge of catalog) {
    const seed = SEED_MODULES[challenge.seedSlug];
    if (!seed) {
      throw new Error(
        `Missing seed module for "${challenge.seedSlug}" — add to scripts/challenge-seeds/ and SEED_MODULES`
      );
    }
    seeds[challenge.seedSlug] = seed;
  }

  for (const key of Object.keys(SEED_MODULES)) {
    if (!seeds[key]) {
      console.warn(`Warning: seed module "${key}" has no catalog entry`);
    }
  }

  const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });

  for (const [slug, seed] of Object.entries(seeds)) {
    await validateSeed(slug, seed, SQL);
  }

  fs.writeFileSync(outJson, JSON.stringify(seeds, null, 2) + "\n");

  const ts = `import type { PySparkFixture } from "@/lib/de-code/pyspark-seed-types";
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
`;

  fs.writeFileSync(outTs, ts);
  console.log(
    `Wrote ${outJson} with ${Object.keys(seeds).length} challenge seed(s) (${catalog.length} catalog entries validated)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

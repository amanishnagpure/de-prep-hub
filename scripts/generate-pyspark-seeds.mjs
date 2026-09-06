#!/usr/bin/env node
/** Generates src/data/de-code/pyspark-seeds.ts from catalog + curated fixture templates */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildFixtures, defaultComparison } from "./pyspark-fixture-templates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, "../src/data/de-code/catalog.json");
const outPath = path.join(__dirname, "../src/data/de-code/pyspark-seeds.ts");

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const problems = catalog.filter((p) => p.track === "pyspark");

function inferResultVar(problem) {
  for (const c of problem.constraints ?? []) {
    const named = c.match(/named `?(\w+)`?/i);
    if (named) return named[1];
    const varName = c.match(/Variable name:\s*(\w+)/i);
    if (varName) return varName[1];
  }
  const fromSolution = problem.solution.match(/^(\w+)\s*=/m);
  return fromSolution?.[1] ?? "result";
}

function inferCategory(problem) {
  const slug = problem.slug;
  const topic = problem.topic ?? "";
  const text = `${slug} ${topic} ${problem.solution}`;
  if (/dedupe|duplicate|drop-duplicates|spark-drill-1[234]/.test(text)) return "dedupe";
  if (/join|left-join/.test(slug) || topic === "joins") return "join";
  if (/groupby|group-by|sum-amount|daily-event|count-by|spark-drill-1[015]/.test(text)) return "agg";
  if (/sort-events|orderBy.*desc/.test(text)) return "sort";
  if (/window|rank-events/.test(text)) return "window";
  if (/filter|select-filter|threshold/.test(text)) return "filter";
  return "default";
}

const seeds = Object.fromEntries(
  problems.map((p) => {
    const category = inferCategory(p);
    return [
      p.slug,
      {
        resultVar: inferResultVar(p),
        referenceCode: p.solution,
        comparison: defaultComparison(category),
        limits: {
          timeLimitMs: p.timeLimitMs ?? 15000,
          maxInputRows: 5000,
          maxOutputRows: 10000,
        },
        fixtures: buildFixtures(p),
      },
    ];
  })
);

const body = `import type { PySparkProblemSeed } from "@/lib/de-code/pyspark-seed-types";

/** Auto-generated PySpark judge fixtures — regenerate with: npm run generate:pyspark-seeds */
export const PYSPARK_SEEDS: Record<string, PySparkProblemSeed> = ${JSON.stringify(seeds, null, 2)};

export function getPySparkSeed(slug: string): PySparkProblemSeed | null {
  return PYSPARK_SEEDS[slug] ?? null;
}

export function hasPySparkSeed(slug: string): boolean {
  return slug in PYSPARK_SEEDS;
}
`;

fs.writeFileSync(outPath, body);
fs.writeFileSync(path.join(__dirname, "../src/data/de-code/pyspark-seeds.json"), JSON.stringify(seeds, null, 2));
console.log("Wrote", outPath, "with", problems.length, "PySpark seeds");

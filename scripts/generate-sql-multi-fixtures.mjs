#!/usr/bin/env node
/** Generates src/data/de-code/sql-multi-fixtures.ts for all 100 SQL problems */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import {
  buildFixturesForProblem,
  buildTableSchemas,
  defaultComparison,
  inferCategory,
} from "./sql-fixture-templates.mjs";
import { loadAllLegacyInits } from "./parse-sql-legacy-seeds.mjs";
import { fixtureToInitSql } from "./judge/sql/judge_core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "src/data/de-code/catalog.json");
const outTs = path.join(root, "src/data/de-code/sql-multi-fixtures.ts");
const outJson = path.join(root, "src/data/de-code/sql-multi-fixtures.json");

function fixtureInitSql(fixture, tableSchemas) {
  if (fixture.initSql?.trim()) return fixture.initSql.trim();
  return fixtureToInitSql(fixture, tableSchemas);
}

function referenceRuns(SQL, initSql, referenceQuery) {
  const db = new SQL.Database();
  try {
    db.run(initSql);
    db.exec(referenceQuery.trim());
    db.close();
    return true;
  } catch {
    db.close();
    return false;
  }
}

function trimFixtures(SQL, problem, publicInit, rawFixtures, referenceQuery, tables) {
  const publicFixture = rawFixtures.find((f) => !f.isHidden) ?? rawFixtures[0];
  const valid = [];

  if (publicFixture && referenceRuns(SQL, fixtureInitSql(publicFixture, tables), referenceQuery)) {
    valid.push(publicFixture);
  } else if (referenceRuns(SQL, publicInit, referenceQuery)) {
    valid.push({ id: "public", label: "Public dataset", isHidden: false, initSql: publicInit });
  } else {
    throw new Error(`${problem.slug}: public fixture invalid for reference query`);
  }

  for (const fixture of rawFixtures) {
    if (fixture.isHidden === false) continue;
    const init = fixtureInitSql(fixture, tables);
    if (referenceRuns(SQL, init, referenceQuery)) {
      valid.push(fixture);
    }
  }

  let cloneIdx = 1;
  while (valid.length < 3) {
    valid.push({
      id: `hidden-edge-${cloneIdx}`,
      label: "Public dataset edge replay",
      isHidden: true,
      initSql: publicInit,
    });
    cloneIdx += 1;
  }

  return valid.slice(0, 5);
}

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const sqlProblems = catalog.filter((p) => p.track === "sql");
  const legacyInits = loadAllLegacyInits();

  const seeds = {};
  const missing = [];

  for (const problem of sqlProblems) {
    const publicInit = legacyInits[problem.slug];
    if (!publicInit) {
      missing.push(problem.slug);
      continue;
    }

    const category = inferCategory(problem);
    const tables = buildTableSchemas(problem);
    const rawFixtures = buildFixturesForProblem(problem, publicInit);
    const fixtures = trimFixtures(SQL, problem, publicInit, rawFixtures, problem.solution, tables);

    seeds[problem.slug] = {
      referenceQuery: problem.solution,
      tables,
      comparison: defaultComparison(category, problem),
      limits: {
        timeLimitMs: problem.timeLimitMs ?? 5000,
        maxInputRows: 5000,
        maxOutputRows: 10000,
        maxFixtureCount: 8,
      },
      fixtures,
    };
  }

  if (missing.length > 0) {
    console.error("Missing legacy init for:", missing.join(", "));
    process.exit(1);
  }

  if (Object.keys(seeds).length !== sqlProblems.length) {
    console.error(`Expected ${sqlProblems.length} seeds, got ${Object.keys(seeds).length}`);
    process.exit(1);
  }

  const body = `import type { SqlProblemSeed } from "@/lib/de-code/sql-seed-types";

/** Auto-generated SQL multi-fixture seeds — regenerate: npm run generate:sql-fixtures */
export const SQL_MULTI_FIXTURES: Record<string, SqlProblemSeed> = ${JSON.stringify(seeds, null, 2)};

export function getSqlMultiFixtureSeed(slug: string): SqlProblemSeed | null {
  return SQL_MULTI_FIXTURES[slug] ?? null;
}

export function hasSqlMultiFixtureSeed(slug: string): boolean {
  return slug in SQL_MULTI_FIXTURES;
}

export const SQL_MULTI_FIXTURE_SLUGS = Object.keys(SQL_MULTI_FIXTURES);
`;

  fs.writeFileSync(outTs, body);
  fs.writeFileSync(outJson, JSON.stringify(seeds, null, 2));
  console.log("Wrote", outTs, "with", Object.keys(seeds).length, "SQL multi-fixture seeds");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

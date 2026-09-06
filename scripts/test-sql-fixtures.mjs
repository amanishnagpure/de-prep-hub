#!/usr/bin/env node
/** Validate all SQL multi-fixture seeds — run: npm run test:sql-fixtures */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { fixtureToInitSql, runSqlJudgeCore } from "./judge/sql/judge_core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedsPath = path.join(root, "src/data/de-code/sql-multi-fixtures.json");
const catalogPath = path.join(root, "src/data/de-code/catalog.json");

async function loadSql() {
  return initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });
}

function validateFixtureInit(SQL, initSql) {
  const db = new SQL.Database();
  try {
    db.run(initSql);
    db.close();
    return null;
  } catch (err) {
    db.close();
    return err.message;
  }
}

function validateReference(SQL, initSql, referenceQuery) {
  const db = new SQL.Database();
  try {
    db.run(initSql);
    db.exec(referenceQuery.trim());
    db.close();
    return null;
  } catch (err) {
    db.close();
    return err.message;
  }
}

async function main() {
  if (!existsSync(seedsPath)) {
    console.error("Missing sql-multi-fixtures.json — run npm run generate:sql-fixtures");
    process.exit(1);
  }

  const SQL_MULTI = JSON.parse(await readFile(seedsPath, "utf8"));
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const sqlSlugs = catalog.filter((p) => p.track === "sql").map((p) => p.slug);
  const SQL = await loadSql();

  let errors = 0;

  if (Object.keys(SQL_MULTI).length !== 100) {
    console.error(`✗ Expected 100 seeds, found ${Object.keys(SQL_MULTI).length}`);
    errors += 1;
  }

  for (const slug of sqlSlugs) {
    const seed = SQL_MULTI[slug];
    if (!seed) {
      console.error(`✗ Missing seed: ${slug}`);
      errors += 1;
      continue;
    }

    if (!seed.referenceQuery?.trim()) {
      console.error(`✗ ${slug}: missing referenceQuery`);
      errors += 1;
    }

    if (!Array.isArray(seed.fixtures) || seed.fixtures.length < 2) {
      console.error(`✗ ${slug}: need public + hidden fixtures (got ${seed.fixtures?.length ?? 0})`);
      errors += 1;
      continue;
    }

    const pub = seed.fixtures.find((f) => !f.isHidden);
    if (!pub) {
      console.error(`✗ ${slug}: no public fixture`);
      errors += 1;
    }

    for (const fixture of seed.fixtures) {
      const initSql = fixture.initSql ?? fixtureToInitSql(fixture, seed.tables);
      const initErr = validateFixtureInit(SQL, initSql);
      if (initErr) {
        console.error(`✗ ${slug}/${fixture.id}: init failed — ${initErr}`);
        errors += 1;
        continue;
      }

      const refErr = validateReference(SQL, initSql, seed.referenceQuery);
      if (refErr) {
        console.error(`✗ ${slug}/${fixture.id}: reference query failed — ${refErr}`);
        errors += 1;
      }
    }

    const submit = await runSqlJudgeCore(SQL, {
      userQuery: seed.referenceQuery,
      referenceQuery: seed.referenceQuery,
      fixtures: seed.fixtures,
      mode: "submit",
      tableSchemas: seed.tables,
      comparison: seed.comparison,
      limits: { ...seed.limits, timeLimitMs: 30000 },
    });

    if (submit.status !== "accepted") {
      console.error(`✗ ${slug}: reference solution failed submit (${submit.passed}/${submit.total})`);
      for (const c of submit.cases.filter((x) => !x.pass)) {
        console.error(`   ${c.testCaseId}: ${c.error ?? "failed"}`);
      }
      errors += 1;
    }
  }

  if (errors === 0) {
    console.log(`✓ All ${sqlSlugs.length} SQL problems validated (${sqlSlugs.length} seeds × fixtures)`);
  } else {
    console.error(`\n${errors} validation error(s)`);
  }

  process.exit(errors === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

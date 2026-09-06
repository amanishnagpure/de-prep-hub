#!/usr/bin/env node
/** Regression tests for SQL multi-fixture judge — run: npm run test:sql-judge */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { runSqlJudgeCore } from "./judge/sql/judge_core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedsPath = path.join(root, "src/data/de-code/sql-multi-fixtures.json");

async function loadSql() {
  return initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });
}

async function judge(SQL, seed, userQuery, mode = "submit") {
  return runSqlJudgeCore(SQL, {
    userQuery,
    referenceQuery: seed.referenceQuery,
    fixtures: seed.fixtures,
    mode,
    tableSchemas: seed.tables,
    comparison: seed.comparison,
    limits: { ...seed.limits, timeLimitMs: 30000 },
  });
}

async function main() {
  if (!existsSync(seedsPath)) {
    console.error("Missing sql-multi-fixtures.json — run npm run generate:sql-fixtures");
    process.exit(1);
  }

  const SQL_MULTI = JSON.parse(await readFile(seedsPath, "utf8"));
  const SQL = await loadSql();

  const tests = [
    {
      name: "filter-active-employees reference passes all fixtures",
      slug: "filter-active-employees",
      query: SQL_MULTI["filter-active-employees"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "filter-active-employees wrong department fails hidden",
      slug: "filter-active-employees",
      query: `SELECT employee_id, full_name FROM employees WHERE department = 'Sales' AND status = 'active';`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "unmatched-orders reference passes (LEFT JOIN anti-pattern test)",
      slug: "unmatched-orders",
      query: SQL_MULTI["unmatched-orders"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "unmatched-orders INNER JOIN fails hidden orphan case",
      slug: "unmatched-orders",
      query: `SELECT o.order_id, o.customer_id FROM orders o INNER JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL;`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "top-salary-per-department reference handles ties",
      slug: "top-salary-per-department",
      query: SQL_MULTI["top-salary-per-department"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "top-salary-per-department ROW_NUMBER fails tie hidden fixture",
      slug: "top-salary-per-department",
      query: `SELECT department, full_name, salary FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees WHERE status = 'active'
) x WHERE rn = 1;`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "null-safe-product-name COALESCE reference passes",
      slug: "null-safe-product-name",
      query: SQL_MULTI["null-safe-product-name"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "null-safe-product-name = NULL fails hidden fixture",
      slug: "null-safe-product-name",
      query: `SELECT product_id, product_name AS display_name FROM products WHERE product_name = NULL;`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "department-headcount reference passes empty hidden fixture",
      slug: "department-headcount",
      query: SQL_MULTI["department-headcount"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "department-headcount missing GROUP BY fails",
      slug: "department-headcount",
      query: `SELECT department, COUNT(*) AS headcount FROM employees WHERE status = 'active';`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "monthly-revenue-trend reference passes date boundaries",
      slug: "monthly-revenue-trend",
      query: SQL_MULTI["monthly-revenue-trend"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "dedupe-click-events DISTINCT fails hidden duplicate timestamp",
      slug: "dedupe-click-events",
      query: `SELECT DISTINCT user_id, event_type, session_id, event_time FROM click_events;`,
      mode: "submit",
      expect: "wrong_answer",
    },
    {
      name: "top-3-revenue-days ordered LIMIT reference passes",
      slug: "top-3-revenue-days",
      query: SQL_MULTI["top-3-revenue-days"].referenceQuery,
      mode: "submit",
      expect: "accepted",
    },
    {
      name: "run mode uses public fixture only",
      slug: "dedupe-click-events",
      query: SQL_MULTI["dedupe-click-events"].referenceQuery,
      mode: "run",
      expect: "accepted",
      assertTotal: 1,
    },
    {
      name: "submit mode runs all fixtures for dedupe",
      slug: "dedupe-click-events",
      query: SQL_MULTI["dedupe-click-events"].referenceQuery,
      mode: "submit",
      expect: "accepted",
      assertMinTotal: 3,
    },
  ];

  let passed = 0;
  for (const test of tests) {
    const seed = SQL_MULTI[test.slug];
    if (!seed) {
      console.error("✗", test.name, "— missing seed");
      continue;
    }
    const result = await judge(SQL, seed, test.query, test.mode);
    const okStatus = result.status === test.expect;
    const okTotal =
      (test.assertTotal ? result.total === test.assertTotal : true) &&
      (test.assertMinTotal ? result.total >= test.assertMinTotal : true);
    if (okStatus && okTotal) {
      passed += 1;
      console.log(`✓ ${test.name} (${result.passed}/${result.total})`);
    } else {
      console.error(`✗ ${test.name} — expected ${test.expect}, got ${result.status} (${result.passed}/${result.total})`);
      for (const c of result.cases.filter((x) => !x.pass)) {
        console.error("   ", c.testCaseId, c.error ?? "failed");
      }
    }
  }

  console.log(`\n${passed}/${tests.length} SQL judge tests passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

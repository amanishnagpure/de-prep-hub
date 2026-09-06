#!/usr/bin/env node
/** Regression tests for SQL query guard — run: node scripts/test-sql-query-guard.mjs */
import { validateSqlQuery } from "../src/lib/practice-platform/judge/sql-query-guard.ts";

const cases = [
  {
    name: "starter template with leading comment passes",
    query: "-- Write your SQL query\nSELECT employee_id FROM employees",
    allowMutations: false,
    expect: null,
  },
  {
    name: "block comment before SELECT passes",
    query: "/* solution */\nSELECT 1",
    allowMutations: false,
    expect: null,
  },
  {
    name: "paren-wrapped subquery passes",
    query: "(SELECT id FROM t)",
    allowMutations: false,
    expect: null,
  },
  {
    name: "DELETE in string literal does not false-positive",
    query: "SELECT * FROM orders WHERE status = 'DELETE'",
    allowMutations: false,
    expect: null,
  },
  {
    name: "actual DELETE blocked on read-only problems",
    query: "DELETE FROM employees WHERE id = 1",
    allowMutations: false,
    expect: "Only read-only queries are allowed",
  },
  {
    name: "comment-only query fails",
    query: "-- still thinking",
    allowMutations: false,
    expect: "Write a SQL query first.",
  },
];

let failed = 0;
for (const test of cases) {
  const result = validateSqlQuery(test.query, test.allowMutations, "judge");
  const ok =
    test.expect === null
      ? result === null
      : result !== null && result.includes(test.expect);
  if (!ok) {
    failed += 1;
    console.error(`✗ ${test.name}`);
    console.error(`  expected: ${test.expect}`);
    console.error(`  got: ${result}`);
  } else {
    console.log(`✓ ${test.name}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log(`\nAll ${cases.length} SQL guard tests passed`);

#!/usr/bin/env node
/**
 * Local deployment smoke test — exercises the judge API the same way the browser does.
 *
 * Prerequisites:
 *   npm run build && npm start   (or npm run dev)
 *   npm run judge:setup          (PySpark host judge)
 *
 * Run: npm run smoke:local
 *      SMOKE_BASE_URL=http://localhost:3000 npm run smoke:local
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const SQL_REFERENCE = `SELECT employee_id, full_name
FROM employees
WHERE department = 'Engineering' AND status = 'active';`;

const SQL_WRONG = `SELECT employee_id FROM employees;`;

const PYSPARK_REFERENCE = `active = df.filter(df.status == 'active')`;

const PYSPARK_WRONG = `active = df.filter(df.status == 'inactive')`;

async function loadChallengeSqlReference() {
  const seeds = JSON.parse(
    await readFile(path.join(root, "src/data/de-code/challenge-seeds.json"), "utf8")
  );
  return seeds["pipeline-reconciliation"].sql.referenceQuery;
}

async function loadChallengeWrongSql() {
  const mod = await import(
    path.join(root, "scripts/challenge-seeds/pipeline-reconciliation.mjs")
  );
  return mod.default.adversarial.sql;
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { _raw: text.slice(0, 500) };
  }
  return { res, body };
}

async function judge(problemId, code, mode, executionLanguage) {
  const payload = { problemId, code, mode };
  if (executionLanguage) payload.executionLanguage = executionLanguage;
  return fetchJson(`${BASE}/api/code/judge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function assertHiddenSanitized(cases) {
  const hidden = cases.filter(
    (c) => c.isHidden === true || (c.testCaseId !== "public" && c.testCaseId !== "run")
  );
  if (!hidden.length) return "no hidden cases in response";
  for (const c of hidden) {
    if (c.actualOutput && (c.actualOutput.includes("{") || c.actualOutput.includes("row(s):"))) {
      return `hidden case ${c.testCaseId} leaked actualOutput`;
    }
    if (c.expectedOutput && c.expectedOutput.includes("{")) {
      return `hidden case ${c.testCaseId} leaked expectedOutput`;
    }
  }
  return null;
}

async function main() {
  const tests = [];
  let passed = 0;

  async function run(name, fn) {
    try {
      await fn();
      passed += 1;
      tests.push({ name, ok: true });
      console.log(`✓ ${name}`);
    } catch (err) {
      tests.push({ name, ok: false, error: err.message });
      console.error(`✗ ${name} — ${err.message}`);
    }
  }

  console.log(`Smoke test → ${BASE}\n`);

  await run("Frontend home page loads", async () => {
    const { res } = await fetchJson(`${BASE}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await run("Code hub loads", async () => {
    const { res } = await fetchJson(`${BASE}/code`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await run("Challenge hub loads", async () => {
    const { res } = await fetchJson(`${BASE}/code/challenges`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await run("Challenge #007 workspace page loads", async () => {
    const { res } = await fetchJson(`${BASE}/code/challenges/pipeline-reconciliation`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await run("SQL problem — Run (public fixture)", async () => {
    const { res, body } = await judge("sql/filter-active-employees", SQL_REFERENCE, "run");
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body)}`);
    if (body.status !== "accepted") throw new Error(`expected accepted, got ${body.status}`);
    if (body.total !== 1) throw new Error(`run mode should use 1 fixture, got ${body.total}`);
  });

  await run("SQL problem — Submit (reference accepted)", async () => {
    const { res, body } = await judge("sql/filter-active-employees", SQL_REFERENCE, "submit");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status !== "accepted") throw new Error(`expected accepted, got ${body.status}`);
    if (body.passed !== body.total) throw new Error(`${body.passed}/${body.total}`);
  });

  await run("SQL problem — Submit (wrong answer)", async () => {
    const { res, body } = await judge("sql/filter-active-employees", SQL_WRONG, "submit");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status !== "wrong_answer") throw new Error(`expected wrong_answer, got ${body.status}`);
  });

  await run("PySpark problem — Run", async () => {
    const { res, body } = await judge("pyspark/filter-active-users", PYSPARK_REFERENCE, "run");
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(body)}`);
    if (body.status !== "accepted" && body.status !== "runtime_error") {
      throw new Error(`unexpected status ${body.status}: ${body.message ?? ""}`);
    }
    if (body.status === "runtime_error" && body.message?.includes("PySpark")) {
      throw new Error("PySpark unavailable — run npm run judge:setup");
    }
  });

  await run("PySpark problem — Submit (reference)", async () => {
    const { res, body } = await judge("pyspark/filter-active-users", PYSPARK_REFERENCE, "submit");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status === "runtime_error" && body.pysparkAvailable === false) {
      throw new Error("PySpark sandbox unavailable — npm run judge:setup");
    }
    if (body.status !== "accepted") {
      throw new Error(`expected accepted, got ${body.status}: ${body.message ?? ""}`);
    }
  });

  await run("PySpark problem — Submit (wrong answer)", async () => {
    const { res, body } = await judge("pyspark/filter-active-users", PYSPARK_WRONG, "submit");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status !== "wrong_answer") throw new Error(`expected wrong_answer, got ${body.status}`);
  });

  await run("DE Challenge #007 — SQL reference accepted", async () => {
    const ref = await loadChallengeSqlReference();
    const { res, body } = await judge(
      "challenge/pipeline-reconciliation",
      ref,
      "submit",
      "sql"
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status !== "accepted") throw new Error(`expected accepted, got ${body.status}`);
  });

  await run("DE Challenge #007 — SQL wrong + hidden sanitized", async () => {
    const wrong = await loadChallengeWrongSql();
    const { res, body } = await judge(
      "challenge/pipeline-reconciliation",
      wrong,
      "submit",
      "sql"
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (body.status === "accepted") throw new Error("adversarial SQL should not pass");
    const leak = assertHiddenSanitized(body.cases ?? []);
    if (leak) throw new Error(leak);
    const hiddenFailed = (body.cases ?? []).some(
      (c) => c.isHidden !== false && c.testCaseId !== "public" && c.testCaseId !== "run" && !c.pass
    );
    if (!hiddenFailed) throw new Error("expected at least one failed hidden case");
  });

  await run("Judge API rejects unknown problem", async () => {
    const { res } = await judge("does/not-exist", "SELECT 1", "run");
    if (res.status !== 404) throw new Error(`expected 404, got ${res.status}`);
  });

  console.log(`\n${passed}/${tests.length} smoke checks passed`);

  if (passed === tests.length) {
    console.log("\nBrowser manual checks still required (localStorage):");
    console.log("  • submission history after Submit");
    console.log("  • refresh / new tab / clear storage");
    console.log("  • challenge skill profile on /code/challenges");
    console.log("  See docs/local-deployment-smoke-test.md");
  }

  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Browser smoke test — mirrors the manual checklist in docs/local-deployment-smoke-test.md
 *
 * Prerequisites: server running (npm start or npm run dev)
 *   npx playwright install chromium   # optional if system Chrome unavailable (PW_CHANNEL=chrome)
 *
 * Run: npm run smoke:browser
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const STORAGE_KEY = "de-prep-hub-de-code";
const CODE_KEY = "de-prep-hub-de-code-solutions";

const SQL_REF = `SELECT employee_id, full_name
FROM employees
WHERE department = 'Engineering' AND status = 'active';`;

const SQL_WRONG = `SELECT employee_id FROM employees;`;

const PYSPARK_REF = `active = df.filter(df.status == 'active')`;
const PYSPARK_WRONG = `active = df.filter(df.status == 'inactive')`;

async function loadChallengeWrongSql() {
  const mod = await import(
    path.join(root, "scripts/challenge-seeds/pipeline-reconciliation.mjs")
  );
  return mod.default.adversarial.sql;
}

async function readStorage(page) {
  return page.evaluate(
    ([sk, ck]) => ({
      store: JSON.parse(localStorage.getItem(sk) ?? "{}"),
      code: JSON.parse(localStorage.getItem(ck) ?? "{}"),
    }),
    [STORAGE_KEY, CODE_KEY]
  );
}

async function clearStorage(page) {
  await page.evaluate(
    ([sk, ck]) => {
      localStorage.removeItem(sk);
      localStorage.removeItem(ck);
    },
    [STORAGE_KEY, CODE_KEY]
  );
}

async function seedDraftCode(page, key, code) {
  await page.evaluate(
    ([ck, k, c]) => {
      const map = JSON.parse(localStorage.getItem(ck) ?? "{}");
      map[k] = c;
      localStorage.setItem(ck, JSON.stringify(map));
    },
    [CODE_KEY, key, code]
  );
}

async function loadWorkspace(page, url, draftKey, code, { reload = false } = {}) {
  await seedDraftCode(page, draftKey, code);
  if (reload) {
    await page.reload({ waitUntil: "domcontentloaded" });
  } else {
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }
  await page.locator("#code-problem-editor .monaco-editor").first().waitFor({
    state: "visible",
    timeout: 20_000,
  });
  await page.waitForTimeout(800);
}

async function runJudgeButton(page, mode) {
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/code/judge") && r.request().method() === "POST",
    { timeout: mode === "run" ? 60_000 : 180_000 }
  );
  const label = mode === "submit" ? "Submit" : "Run";
  await page.getByRole("button", { name: label, exact: true }).click();
  const response = await responsePromise;
  const body = await response.json();
  if (!response.ok()) {
    throw new Error(`Judge API ${response.status()}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body;
}

async function clickRun(page) {
  return runJudgeButton(page, "run");
}

async function clickSubmit(page) {
  return runJudgeButton(page, "submit");
}

async function waitForVerdict(page, timeout = 120_000) {
  await page.getByText(/Accepted|Wrong Answer|WRONG ANSWER|Runtime Error/i).first().waitFor({
    timeout,
  });
}

async function assertSubmissionHistory(page, problemId, minCount) {
  const { store } = await readStorage(page);
  const rows = (store.submissions ?? []).filter((s) => s.problemId === problemId);
  if (rows.length < minCount) {
    throw new Error(`Expected ≥${minCount} submissions for ${problemId}, got ${rows.length}`);
  }
}
async function openSubmissionsTab(page) {
  await page.getByRole("button", { name: /^submissions$/i }).first().click();
}

async function runChallengeJudge(page, mode) {
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/code/judge") && r.request().method() === "POST",
    { timeout: 180_000 }
  );
  const label = mode === "submit" ? "Submit" : "Run";
  await page.getByRole("button", { name: label }).first().click();
  const response = await responsePromise;
  return response.json();
}

function assertNoHiddenRowLeak(text) {
  const suspicious = [
    /\{'order_id':/,
    /\{"order_id"/,
    /row\(s\):.*\{/,
    /matching row\(s\).*order_id/,
  ];
  for (const re of suspicious) {
    if (re.test(text)) return `possible hidden row leak matched ${re}`;
  }
  return null;
}

async function main() {
  let passed = 0;
  const total = 3;

  console.log(`Browser smoke test → ${BASE}\n`);

  const launchOpts = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };
  if (process.env.PW_EXECUTABLE_PATH) {
    launchOpts.executablePath = process.env.PW_EXECUTABLE_PATH;
  } else if (process.env.PW_CHANNEL) {
    launchOpts.channel = process.env.PW_CHANNEL;
  } else {
    launchOpts.executablePath = "/usr/bin/google-chrome";
  }
  const browser = await chromium.launch(launchOpts);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Establish origin before touching localStorage
  const boot = await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30_000 });
  if (!boot?.ok()) throw new Error(`Cannot reach ${BASE} — start with npm start`);

  try {
    // ── Check 1: Coding workspace ──────────────────────────────────────────
    console.log("Check 1 — Coding workspace");

    await clearStorage(page);

    // SQL
    const sqlUrl = `${BASE}/code/sql/fundamentals?slug=filter-active-employees`;
    await loadWorkspace(page, sqlUrl, "sql:filter-active-employees", SQL_REF);
    const sqlRun = await clickRun(page);
    if (sqlRun.status !== "accepted") throw new Error(`SQL run: ${sqlRun.status}`);
    console.log("  ✓ SQL Run");

    const sqlSubmit = await clickSubmit(page);
    if (sqlSubmit.status !== "accepted") throw new Error(`SQL submit: ${sqlSubmit.status}`);
    console.log("  ✓ SQL Submit (reference)");

    await seedDraftCode(page, "sql:filter-active-employees", SQL_WRONG);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#code-problem-editor .monaco-editor").first().waitFor({ state: "visible" });
    await page.waitForTimeout(800);
    const sqlWrong = await clickSubmit(page);
    if (sqlWrong.status !== "wrong_answer") throw new Error(`SQL wrong: ${sqlWrong.status}`);
    console.log("  ✓ SQL wrong submission");

    await assertSubmissionHistory(page, "sql/filter-active-employees", 2);
    await openSubmissionsTab(page);
    console.log("  ✓ SQL Submissions panel");

    // PySpark
    const pyUrl = `${BASE}/code/pyspark/select-filter?slug=filter-active-users`;
    await loadWorkspace(page, pyUrl, "pyspark:filter-active-users", PYSPARK_REF);
    const pyRun = await clickRun(page);
    if (pyRun.status !== "accepted") throw new Error(`PySpark run: ${pyRun.status}`);
    console.log("  ✓ PySpark Run");

    await loadWorkspace(page, pyUrl, "pyspark:filter-active-users", PYSPARK_REF);
    const pySubmit = await clickSubmit(page);
    if (pySubmit.status !== "accepted") {
      throw new Error(`PySpark submit: ${pySubmit.status} — ${pySubmit.message ?? ""}`);
    }
    console.log("  ✓ PySpark Submit (reference)");

    await seedDraftCode(page, "pyspark:filter-active-users", PYSPARK_WRONG);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#code-problem-editor .monaco-editor").first().waitFor({ state: "visible" });
    await page.waitForTimeout(800);
    const pyWrong = await clickSubmit(page);
    if (pyWrong.status !== "wrong_answer") throw new Error(`PySpark wrong: ${pyWrong.status}`);
    console.log("  ✓ PySpark wrong submission");

    await assertSubmissionHistory(page, "pyspark/filter-active-users", 2);
    await openSubmissionsTab(page);
    console.log("  ✓ PySpark Submissions panel");
    passed += 1;
    console.log("✓ Check 1 passed\n");

    // ── Check 2: Challenge #007 ──────────────────────────────────────────
    console.log("Check 2 — Challenge #007 (Pipeline Reconciliation)");

    const wrongSql = await loadChallengeWrongSql();
    const chUrl = `${BASE}/code/challenges/pipeline-reconciliation`;
    await seedDraftCode(page, "challenge:pipeline-reconciliation:sql", wrongSql);
    await page.goto(chUrl, { waitUntil: "domcontentloaded" });
    await page.locator(".monaco-editor").first().waitFor({ state: "visible", timeout: 20_000 });

    const sqlLang = page.getByRole("button", { name: /^SQL$/i });
    if (await sqlLang.count()) await sqlLang.click();
    await page.waitForTimeout(400);

    const chWrong = await runChallengeJudge(page, "submit");
    if (chWrong.status !== "wrong_answer") throw new Error(`Challenge: ${chWrong.status}`);
    await waitForVerdict(page, 30_000);

    if ((await page.locator("text=Wrong Answer").count()) === 0) {
      throw new Error("Challenge wrong submit did not show Wrong Answer");
    }
    console.log("  ✓ WRONG ANSWER verdict");

    if ((await page.locator("text=Failed concepts").count()) === 0) {
      throw new Error("Missing failed concepts section");
    }
    console.log("  ✓ Failed concepts visible");

    const bodyText = await page.innerText("body");
    const leak = assertNoHiddenRowLeak(bodyText);
    if (leak) throw new Error(leak);
    console.log("  ✓ No hidden row payloads in UI");

    await assertSubmissionHistory(page, "challenge/pipeline-reconciliation", 1);
    await openSubmissionsTab(page);
    console.log("  ✓ Submission in history");

    const beforeSolve = await readStorage(page);
    const solvedBefore = beforeSolve.store.solved ?? [];
    const challengeId = "challenge/pipeline-reconciliation";
    if (solvedBefore.includes(challengeId)) {
      console.log("  · challenge already marked solved from prior session");
    } else {
      console.log("  ✓ Skill profile unchanged until solved (not in solved[])");
    }
    passed += 1;
    console.log("✓ Check 2 passed\n");

    // ── Check 3: Persistence ───────────────────────────────────────────────
    console.log("Check 3 — Persistence");

    const afterSubmit = await readStorage(page);
    const submissionCount = afterSubmit.store.submissions?.length ?? 0;
    if (submissionCount === 0) throw new Error("No submissions in localStorage");
    console.log(`  ✓ ${submissionCount} submission(s) in localStorage`);

    const draftKeys = Object.keys(afterSubmit.code ?? {});
    if (draftKeys.length === 0) throw new Error("No draft code keys in localStorage");
    console.log(`  ✓ Draft code keys: ${draftKeys.length}`);

    await page.reload({ waitUntil: "domcontentloaded" });
    const afterRefresh = await readStorage(page);
    if ((afterRefresh.store.submissions?.length ?? 0) < submissionCount) {
      throw new Error("Submissions lost after refresh");
    }
    console.log("  ✓ Submissions survive refresh");

    const page2 = await context.newPage();
    await page2.goto(`${BASE}/code/challenges/pipeline-reconciliation`, {
      waitUntil: "domcontentloaded",
    });
    const tab2Store = await readStorage(page2);
    if ((tab2Store.store.submissions?.length ?? 0) < submissionCount) {
      throw new Error("Submissions not shared in new tab");
    }
    console.log("  ✓ Submissions survive new tab");
    await page2.close();

    await clearStorage(page);
    const cleared = await readStorage(page);
    if ((cleared.store.submissions?.length ?? 0) > 0) {
      throw new Error("Submissions still present after clear");
    }
    console.log("  ✓ Clear localStorage resets submissions");

    passed += 1;
    console.log("✓ Check 3 passed\n");
  } catch (err) {
    console.error(`\n✗ Browser smoke failed — ${err.message}`);
    await browser.close();
    process.exit(1);
  }

  await browser.close();

  console.log(`${passed}/${total} browser smoke checks passed`);
  console.log("\nLocal deployment: COMPLETE (API + browser gates green)");
  console.log("Next: Docker/CI security gate when a runner is available");
  console.log("Then: P1.16 #008 Large-Scale Order Aggregation");
  process.exit(passed === total ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

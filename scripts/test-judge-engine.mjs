#!/usr/bin/env node
/** Generic judge infrastructure tests — run: npm run test:judge-engine */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { runSqlJudgeCore } from "./judge/sql/judge_core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const judgeDir = path.join(root, "scripts/judge/pyspark");

const TABLE_SCHEMAS = [
  {
    label: "items",
    description: "Test items",
    columns: [
      { name: "id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "amount", type: "DOUBLE" },
    ],
  },
];

const COMPARISON = {
  schema: true,
  columnOrder: false,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const LIMITS = {
  timeLimitMs: 30000,
  maxInputRows: 100,
  maxOutputRows: 100,
  maxFixtureCount: 4,
};

const REFERENCE = `SELECT id, name, amount FROM items ORDER BY id`;

function fx(id, label, isHidden, rows, meta = {}) {
  return {
    id,
    label,
    isHidden,
    tables: { items: rows },
    ...meta,
  };
}

const FIXTURES = [
  fx("public", "Baseline", false, [
    { id: 1, name: "A", amount: 10 },
    { id: 2, name: "B", amount: null },
  ]),
  fx(
    "hidden-null",
    "NULL cell handling",
    true,
    [
      { id: 1, name: "A", amount: 10 },
      { id: 2, name: "B", amount: null },
    ],
    { purpose: "null-handling", tests: ["null-comparison"] }
  ),
  fx(
    "hidden-dup-rows",
    "Duplicate rows order-insensitive",
    true,
    [
      { id: 1, name: "A", amount: 10 },
      { id: 1, name: "A", amount: 10 },
    ],
    { purpose: "duplicate-rows", tests: ["row-order"] }
  ),
  fx(
    "hidden-empty",
    "Empty result",
    true,
    [],
    { purpose: "empty-result", tests: ["empty"] }
  ),
];

function resolveJavaHome() {
  if (process.env.JAVA_HOME && existsSync(path.join(process.env.JAVA_HOME, "bin", "java"))) {
    return process.env.JAVA_HOME;
  }
  for (const candidate of ["/usr/lib/jvm/java-21-openjdk-amd64", "/usr/lib/jvm/default-java"]) {
    if (existsSync(path.join(candidate, "bin", "java"))) return candidate;
  }
  return "";
}

function resolvePython() {
  if (process.env.PYSPARK_JUDGE_PYTHON) return process.env.PYSPARK_JUDGE_PYTHON;
  const conda = path.join(os.homedir(), "miniconda3", "bin", "python");
  if (existsSync(conda)) return conda;
  return "python3";
}

function runPySparkJudge(payload) {
  const python = resolvePython();
  const javaHome = resolveJavaHome();
  return new Promise((resolve, reject) => {
    const child = spawn(python, ["run_judge.py"], {
      cwd: judgeDir,
      env: {
        ...process.env,
        PYSPARK_PYTHON: python,
        ...(javaHome ? { JAVA_HOME: javaHome } : {}),
      },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("error", reject);
    child.on("close", () => {
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        reject(new Error(stderr || stdout || "Invalid PySpark judge output"));
      }
    });
    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function judgeSql(SQL, userQuery, fixtures = FIXTURES, mode = "submit") {
  return runSqlJudgeCore(SQL, {
    userQuery,
    referenceQuery: REFERENCE,
    fixtures,
    mode,
    tableSchemas: TABLE_SCHEMAS,
    comparison: COMPARISON,
    limits: LIMITS,
  });
}

async function main() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });

  const pysparkFixtures = FIXTURES.map((f) => ({
    id: f.id,
    label: f.label,
    isHidden: f.isHidden,
    tables: f.tables,
    ...(f.purpose ? { purpose: f.purpose, tests: f.tests } : {}),
  }));

  const pysparkPayload = {
    userCode: `result = items.select("id", "name", "amount").orderBy("id")`,
    referenceCode: `result = items.select("id", "name", "amount").orderBy("id")`,
    resultVar: "result",
    fixtures: pysparkFixtures,
    comparison: COMPARISON,
    limits: LIMITS,
    mode: "submit",
    timeLimitMs: LIMITS.timeLimitMs,
  };

  const tests = [
    {
      name: "SQL reference passes all fixtures",
      run: () => judgeSql(SQL, REFERENCE),
      expect: "accepted",
    },
    {
      name: "SQL NULL handling hidden fixture",
      run: () => judgeSql(SQL, REFERENCE),
      expect: "accepted",
    },
    {
      name: "SQL duplicate rows hidden fixture (order insensitive)",
      run: () => judgeSql(SQL, REFERENCE),
      expect: "accepted",
    },
    {
      name: "SQL empty result hidden fixture",
      run: () => judgeSql(SQL, REFERENCE),
      expect: "accepted",
    },
    {
      name: "SQL schema mismatch fails hidden",
      run: () => judgeSql(SQL, `SELECT id, name FROM items ORDER BY id`),
      expect: "wrong_answer",
    },
    {
      name: "SQL column order enforced when configured",
      run: () =>
        runSqlJudgeCore(SQL, {
          userQuery: `SELECT name, id, amount FROM items ORDER BY id`,
          referenceQuery: REFERENCE,
          fixtures: [FIXTURES[0]],
          mode: "submit",
          tableSchemas: TABLE_SCHEMAS,
          comparison: { ...COMPARISON, columnOrder: true },
          limits: LIMITS,
        }),
      expect: "wrong_answer",
    },
    {
      name: "SQL adversarial fails hidden (metadata propagation)",
      run: () =>
        judgeSql(
          SQL,
          `SELECT id, name, COALESCE(amount, 0) AS amount FROM items ORDER BY id`
        ),
      expect: "wrong_answer",
    },
    {
      name: "SQL fixture metadata on failed hidden case",
      run: async () => {
        const r = await judgeSql(SQL, `SELECT id, name FROM items ORDER BY id`);
        const hidden = r.cases.find((c) => c.testCaseId === "hidden-null");
        if (!hidden || hidden.pass) throw new Error("expected hidden-null failure");
        if (!hidden.purpose || !hidden.tests?.length) {
          throw new Error("missing fixture metadata on failed case");
        }
        return { status: "accepted", passed: 1, total: 1, cases: r.cases };
      },
      expect: "accepted",
    },
    {
      name: "PySpark reference passes fixtures",
      run: () => runPySparkJudge(pysparkPayload),
      expect: "accepted",
    },
    {
      name: "PySpark NULL hidden fixture",
      run: () => runPySparkJudge(pysparkPayload),
      expect: "accepted",
    },
    {
      name: "PySpark schema mismatch fails hidden",
      run: () =>
        runPySparkJudge({
          ...pysparkPayload,
          userCode: `result = items.select("id", "name")`,
        }),
      expect: "wrong_answer",
    },
    {
      name: "PySpark adversarial wrong answer fails hidden",
      run: () =>
        runPySparkJudge({
          ...pysparkPayload,
          userCode: `result = items.select("id", "name", F.lit(0).alias("amount")).orderBy("id")`,
        }),
      expect: "wrong_answer",
    },
    {
      name: "PySpark metadata on failed hidden case",
      run: async () => {
        const r = await runPySparkJudge({
          ...pysparkPayload,
          userCode: `result = items.select("id", "name")`,
        });
        const hidden = r.cases.find((c) => c.testCaseId === "hidden-null");
        if (!hidden || hidden.pass) throw new Error("expected hidden-null failure");
        if (!hidden.purpose || !hidden.tests?.length) {
          throw new Error("missing fixture metadata");
        }
        return { status: "accepted", passed: 1, total: 1, cases: r.cases };
      },
      expect: "accepted",
    },
    {
      name: "SQL run mode public only",
      run: () => judgeSql(SQL, REFERENCE, FIXTURES, "run"),
      expect: "accepted",
      assertTotal: 1,
    },
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      const result = await test.run();
      const okStatus = result.status === test.expect;
      const okTotal = test.assertTotal ? result.total === test.assertTotal : true;
      if (okStatus && okTotal) {
        passed += 1;
        console.log(`✓ ${test.name} (${result.passed}/${result.total})`);
      } else {
        console.error(
          `✗ ${test.name} — expected ${test.expect}, got ${result.status} (${result.passed}/${result.total})`
        );
      }
    } catch (err) {
      console.error(`✗ ${test.name} — ${err.message}`);
    }
  }

  console.log(`\n${passed}/${tests.length} judge engine tests passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

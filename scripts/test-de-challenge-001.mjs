#!/usr/bin/env node
/** Regression tests for DE Challenge #001 — run: npm run test:de-challenge-001 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import { runSqlJudgeCore } from "./judge/sql/judge_core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedsPath = path.join(root, "src/data/de-code/challenge-seeds.json");
const judgeDir = path.join(root, "scripts/judge/pyspark");

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

async function judgeSql(SQL, seed, userQuery, mode = "submit") {
  return runSqlJudgeCore(SQL, {
    userQuery,
    referenceQuery: seed.sql.referenceQuery,
    fixtures: seed.sql.fixtures,
    mode,
    tableSchemas: seed.sql.tables,
    comparison: seed.sql.comparison,
    limits: seed.sql.limits,
  });
}

async function main() {
  if (!existsSync(seedsPath)) {
    console.error("Missing challenge-seeds.json");
    process.exit(1);
  }

  const seed = JSON.parse(await readFile(seedsPath, "utf8"))["incremental-customer-pipeline"];
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });

  const badPysparkNoDedupe = `customer_daily_summary = customers_today.join(orders, "customer_id").groupBy("customer_id", "name", "city").agg(
    F.count("order_id").alias("order_count"),
    F.sum("amount").alias("total_revenue")
)`;

  const badSqlInnerJoin = seed.sql.referenceQuery.replace("LEFT JOIN", "INNER JOIN");

  const tests = [
    {
      name: "PySpark reference passes all fixtures",
      run: () =>
        runPySparkJudge({
          userCode: seed.pyspark.referenceCode,
          referenceCode: seed.pyspark.referenceCode,
          resultVar: seed.resultVar,
          fixtures: seed.pyspark.fixtures,
          comparison: seed.pyspark.comparison,
          limits: seed.pyspark.limits,
          mode: "submit",
          timeLimitMs: seed.pyspark.limits.timeLimitMs,
        }),
      expect: "accepted",
    },
    {
      name: "PySpark no customer dedupe fails hidden fixture",
      run: () =>
        runPySparkJudge({
          userCode: badPysparkNoDedupe,
          referenceCode: seed.pyspark.referenceCode,
          resultVar: seed.resultVar,
          fixtures: seed.pyspark.fixtures,
          comparison: seed.pyspark.comparison,
          limits: seed.pyspark.limits,
          mode: "submit",
          timeLimitMs: seed.pyspark.limits.timeLimitMs,
        }),
      expect: "wrong_answer",
    },
    {
      name: "PySpark run mode uses public fixture only",
      run: () =>
        runPySparkJudge({
          userCode: seed.pyspark.referenceCode,
          referenceCode: seed.pyspark.referenceCode,
          resultVar: seed.resultVar,
          fixtures: seed.pyspark.fixtures,
          comparison: seed.pyspark.comparison,
          limits: seed.pyspark.limits,
          mode: "run",
          timeLimitMs: seed.pyspark.limits.timeLimitMs,
        }),
      expect: "accepted",
      assertTotal: 1,
    },
    {
      name: "SQL reference passes all fixtures",
      run: () => judgeSql(SQL, seed, seed.sql.referenceQuery, "submit"),
      expect: "accepted",
    },
    {
      name: "SQL INNER JOIN fails customer without orders",
      run: () => judgeSql(SQL, seed, badSqlInnerJoin, "submit"),
      expect: "wrong_answer",
    },
    {
      name: "SQL run mode uses public fixture only",
      run: () => judgeSql(SQL, seed, seed.sql.referenceQuery, "run"),
      expect: "accepted",
      assertTotal: 1,
    },
  ];

  let passed = 0;
  for (const test of tests) {
    try {
      const result = await test.run();
      const okStatus = result.status === test.expect;
      const okTotal =
        (test.assertTotal ? result.total === test.assertTotal : true) &&
        (test.assertMinTotal ? result.total >= test.assertMinTotal : true);
      if (okStatus && okTotal) {
        passed += 1;
        console.log(`✓ ${test.name} (${result.passed}/${result.total})`);
      } else {
        console.error(
          `✗ ${test.name} — expected ${test.expect}, got ${result.status} (${result.passed}/${result.total})`
        );
        for (const c of (result.cases || []).filter((x) => !x.pass)) {
          console.error("   ", c.testCaseId, c.error ?? "failed");
        }
      }
    } catch (err) {
      console.error(`✗ ${test.name} — ${err.message}`);
    }
  }

  console.log(`\n${passed}/${tests.length} DE Challenge #001 tests passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

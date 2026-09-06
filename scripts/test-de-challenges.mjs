#!/usr/bin/env node
/** Regression tests for all DE Challenges — run: npm run test:de-challenges */
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
const catalogPath = path.join(root, "src/data/de-code/challenges/catalog.json");
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

/** Adversarial bad solutions live in seed modules (seed.adversarial) — generic test harness only */

async function main() {
  if (!existsSync(seedsPath)) {
    console.error("Missing challenge-seeds.json — run npm run generate:challenge-seeds");
    process.exit(1);
  }

  const SEEDS = JSON.parse(await readFile(seedsPath, "utf8"));
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(root, "node_modules/sql.js/dist", file),
  });

  const tests = [];

  for (const challenge of catalog) {
    const seed = SEEDS[challenge.seedSlug];
    if (!seed) {
      tests.push({
        name: `${challenge.slug} — seed exists`,
        run: async () => ({ status: "runtime_error", passed: 0, total: 0 }),
        expect: "accepted",
      });
      continue;
    }

    tests.push(
      {
        name: `${challenge.slug} PySpark reference`,
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
        name: `${challenge.slug} SQL reference`,
        run: () => judgeSql(SQL, seed, seed.sql.referenceQuery, "submit"),
        expect: "accepted",
      },
      {
        name: `${challenge.slug} PySpark run mode (public only)`,
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
      }
    );

    if (seed.adversarial) {
      tests.push(
        {
          name: `${challenge.slug} PySpark adversarial fails hidden`,
          run: () =>
            runPySparkJudge({
              userCode: seed.adversarial.pyspark,
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
          name: `${challenge.slug} SQL adversarial fails hidden`,
          run: () => judgeSql(SQL, seed, seed.adversarial.sql, "submit"),
          expect: "wrong_answer",
        }
      );
    }
  }

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
        for (const c of (result.cases || []).filter((x) => !x.pass)) {
          console.error("   ", c.testCaseId, c.error ?? "failed");
        }
      }
    } catch (err) {
      console.error(`✗ ${test.name} — ${err.message}`);
    }
  }

  console.log(`\n${passed}/${tests.length} DE Challenge tests passed (${catalog.length} challenges)`);
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

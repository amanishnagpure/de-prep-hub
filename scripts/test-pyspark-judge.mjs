#!/usr/bin/env node
/** Regression tests for PySpark judge — run: npm run test:pyspark-judge */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const seedsPath = path.join(root, "src/data/de-code/pyspark-seeds.json");
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

function runJudge(payload) {
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
        reject(new Error(stderr || stdout || "Invalid judge output"));
      }
    });
    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

async function main() {
  if (!existsSync(seedsPath)) {
    console.error("Missing pyspark-seeds.json — run npm run generate:pyspark-seeds");
    process.exit(1);
  }

  const PYSPARK_SEEDS = JSON.parse(await readFile(seedsPath, "utf8"));

  const cases = [
    {
      name: "filter-active-users accepts reference solution",
      slug: "filter-active-users",
      code: PYSPARK_SEEDS["filter-active-users"].referenceCode,
      expectStatus: "accepted",
    },
    {
      name: "filter-active-users rejects wrong filter",
      slug: "filter-active-users",
      code: "active = df.filter(df.status == 'inactive')",
      expectStatus: "wrong_answer",
    },
    {
      name: "dedupe-with-window accepts reference solution",
      slug: "dedupe-with-window",
      code: PYSPARK_SEEDS["dedupe-with-window"].referenceCode,
      expectStatus: "accepted",
    },
  ];

  let passed = 0;
  let firstMs = null;
  let secondMs = null;

  for (const test of cases) {
    const seed = PYSPARK_SEEDS[test.slug];
    const payload = {
      userCode: test.code,
      referenceCode: seed.referenceCode,
      resultVar: seed.resultVar,
      fixtures: seed.fixtures,
      comparison: seed.comparison,
      limits: { ...seed.limits, timeLimitMs: 60000 },
      mode: "submit",
      timeLimitMs: 60000,
    };

    const result = await runJudge(payload);
    if (firstMs === null) firstMs = result.runtimeMs;
    else if (secondMs === null) secondMs = result.runtimeMs;

    const ok = result.status === test.expectStatus;
    console.log(`${ok ? "✓" : "✗"} ${test.name} → ${result.status} (${result.passed}/${result.total})`);
    if (!ok) console.log("  message:", result.message);
    if (ok) passed += 1;
  }

  console.log(`\n${passed}/${cases.length} regression checks passed`);
  if (firstMs != null) console.log(`First job ~${firstMs}ms`);
  if (secondMs != null) console.log(`Second job ~${secondMs}ms`);

  process.exit(passed === cases.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

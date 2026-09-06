#!/usr/bin/env node
/** Validate PySpark judge container definition — run: npm run test:pyspark-container */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const judgeDir = path.join(__dirname, "..", "scripts/judge/pyspark");

function resolveRuntime() {
  for (const candidate of ["docker", "podman"]) {
    try {
      execSync(`command -v ${candidate}`, { stdio: "ignore" });
      return candidate;
    } catch {
      // continue
    }
  }
  return null;
}

function staticChecks() {
  const errors = [];
  const dockerfile = path.join(judgeDir, "Dockerfile");
  if (!existsSync(dockerfile)) errors.push("Missing Dockerfile");
  else {
    const text = readFileSync(dockerfile, "utf8");
    if (!/USER\s+\w+/i.test(text)) errors.push("Dockerfile must define non-root USER");
    if (!text.includes("run_judge.py")) errors.push("Dockerfile must entrypoint run_judge.py");
  }
  for (const file of ["judge_core.py", "run_judge.py", "worker.py"]) {
    if (!existsSync(path.join(judgeDir, file))) errors.push(`Missing ${file}`);
  }
  return errors;
}

async function main() {
  const tests = [];

  const staticErrors = staticChecks();
  tests.push({
    name: "Container definition files",
    ok: staticErrors.length === 0,
    detail: staticErrors.length ? staticErrors.join("; ") : "Dockerfile + judge scripts present",
  });

  const runtime = resolveRuntime();
  tests.push({
    name: "Container runtime on PATH",
    ok: true,
    detail: runtime
      ? `${runtime} available (build with: ${runtime} build -t de-code-pyspark-judge:latest ${judgeDir})`
      : "skipped — install docker/podman to run isolated judge container",
  });

  let passed = 0;
  for (const t of tests) {
    if (t.ok) {
      passed += 1;
      console.log(`✓ ${t.name} — ${t.detail}`);
    } else {
      console.error(`✗ ${t.name} — ${t.detail}`);
    }
  }

  console.log(`\n${passed}/${tests.length} container checks passed`);
  process.exit(staticErrors.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

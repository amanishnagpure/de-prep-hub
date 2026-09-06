#!/usr/bin/env node
/**
 * P1.15 security PoCs — run: npm run test:security-pocs
 *
 * Default (pre-hardening): documents reproducible vulnerabilities — tests EXPECT escapes/bypasses.
 * After hardening: SECURITY_HARDENED=1 — same tests EXPECT safe failure (blocked/sanitized/limited).
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const judgeDir = path.join(root, "scripts/judge/pyspark");
const HARDENED = process.env.SECURITY_HARDENED === "1";

const MAX_CODE_CHARS = 50_000;

function validateJudgeRequestBody(body) {
  if (!body.problemId || typeof body.code !== "string") {
    return { ok: false, status: 413, message: "problemId and code required" };
  }
  if (body.code.length > MAX_CODE_CHARS) {
    return {
      ok: false,
      status: 413,
      message: `Code exceeds maximum length (${MAX_CODE_CHARS} characters).`,
    };
  }
  return { ok: true };
}

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
        ...(HARDENED ? { SECURITY_HARDENED: "1" } : {}),
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

function runPythonValidate(code) {
  const python = resolvePython();
  return new Promise((resolve, reject) => {
    const script = `
import sys
sys.path.insert(0, ${JSON.stringify(judgeDir)})
from judge_core import validate_code
try:
    validate_code(${JSON.stringify(code)})
    print("ALLOWED")
except Exception as e:
    print("BLOCKED:" + str(e))
`;
    const child = spawn(python, ["-c", script], { cwd: judgeDir });
    let stdout = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.on("error", reject);
    child.on("close", () => resolve(stdout.trim()));
  });
}

const MINIMAL_PAYLOAD = {
  userCode: "",
  referenceCode: `result = items.select("id", "name", "amount")`,
  resultVar: "result",
  fixtures: [
    {
      id: "public",
      label: "Public",
      isHidden: false,
      tables: { items: [{ id: 1, name: "A", amount: 1 }] },
    },
    {
      id: "hidden-probe",
      label: "Hidden probe",
      isHidden: true,
      tables: { items: [{ id: 1, name: "A", amount: 1 }] },
      purpose: "security-probe",
      tests: ["sandbox"],
    },
  ],
  comparison: {
    schema: true,
    columnOrder: false,
    rowOrder: false,
    allowExtraColumns: false,
    ignoreColumnCase: true,
  },
  limits: { timeLimitMs: 60000, maxInputRows: 100, maxOutputRows: 100, maxFixtureCount: 4 },
  mode: "submit",
  timeLimitMs: 60000,
};

async function pocSandboxEscape() {
  // exec()-trimmed builtins block __import__; spark._jvm is the real bypass today.
  // Use run mode — preview_df surfaces the leaked host path in actualOutput.
  const escapeCode = `probe = spark._jvm.java.lang.System.getProperty("user.dir")
result = spark.createDataFrame([(str(probe),)], "probe STRING")`;

  const result = await runPySparkJudge({
    ...MINIMAL_PAYLOAD,
    userCode: escapeCode,
    mode: "run",
    fixtures: [MINIMAL_PAYLOAD.fixtures[0]],
  });
  const runCase = result.cases?.find((c) => c.testCaseId === "run") ?? result.cases?.[0];
  const leaked =
    (runCase?.actualOutput || "").includes("/") ||
    (runCase?.error || "").includes("/") ||
    (result.message || "").includes("/");

  if (HARDENED) {
    if (leaked) throw new Error("Sandbox escape still possible after hardening");
    return "blocked (hardened)";
  }
  if (!leaked) throw new Error("PoC failed: expected sandbox escape via spark._jvm");
  return "escape reproduced (spark._jvm → host path leak)";
}

async function pocTokenFilterBypass() {
  const blocked = await runPythonValidate("import os\nresult = items");
  const bypass = await runPythonValidate("probe = __import__('os').getcwd()\nresult = items");

  const blockedOk = blocked.startsWith("BLOCKED");
  const bypassOk = bypass.startsWith("ALLOWED");

  if (HARDENED) {
    if (bypassOk) throw new Error("Token filter bypass still allowed after hardening");
    return "bypass blocked (hardened)";
  }
  if (!blockedOk) throw new Error('Expected "import os" to be blocked');
  if (!bypassOk) throw new Error('Expected __import__ bypass — PoC could not reproduce');
  return "substring filter bypassed via __import__";
}

async function pocApiAbuse() {
  const padding = "x".repeat(MAX_CODE_CHARS + 5_000);
  const hugeCode = `# payload padding\n${padding}\nresult = items.select("id", "name", "amount")`;

  const result = await runPySparkJudge({ ...MINIMAL_PAYLOAD, userCode: hugeCode });
  const workerAccepted = result.pysparkAvailable !== false && result.status !== undefined;

  if (HARDENED) {
    if (result.status !== "compilation_error") {
      throw new Error(
        `Oversized payload still accepted by judge worker after hardening (status=${result.status})`
      );
    }
    return "oversized payload rejected (hardened)";
  }

  if (!workerAccepted) {
    throw new Error("PoC failed: expected judge worker to accept oversized payload pre-hardening");
  }
  return `judge worker accepts ~${hugeCode.length} char payload (no size limit)`;
}

async function pocHiddenOutputSanitized() {
  const wrongCode = `result = items.select("id")`;
  const result = await runPySparkJudge({ ...MINIMAL_PAYLOAD, userCode: wrongCode });
  const hiddenCase = result.cases?.find((c) => c.testCaseId === "hidden-probe");
  if (!hiddenCase || hiddenCase.pass) {
    throw new Error("Expected hidden-probe failure for sanitization check");
  }

  const hasRowLeak =
    (hiddenCase.actualOutput && hiddenCase.actualOutput.includes("{")) ||
    (hiddenCase.expectedOutput && hiddenCase.expectedOutput.includes("{")) ||
    (hiddenCase.actualOutput && hiddenCase.actualOutput.includes("row(s):"));

  if (HARDENED || process.env.JUDGE_SANITIZE_HIDDEN === "1") {
    if (hasRowLeak) throw new Error("Hidden fixture row data leaked in judge response");
    return "hidden output sanitized";
  }
  if (!hasRowLeak) {
    return "hidden output already sanitized (early defense-in-depth)";
  }
  return "hidden row data exposed in API response (document gap)";
}

async function main() {
  const tests = [
    { name: "PoC 1 — PySpark sandbox escape", run: pocSandboxEscape },
    { name: "PoC 2 — BLOCKED_TOKENS substring bypass", run: pocTokenFilterBypass },
    { name: "PoC 3 — Judge worker payload abuse (no size limit)", run: pocApiAbuse },
    { name: "Defense — hidden fixture output sanitization", run: pocHiddenOutputSanitized },
  ];

  console.log(
    HARDENED
      ? "SECURITY_HARDENED=1 — expecting PoCs to be blocked\n"
      : "Pre-hardening mode — documenting reproducible vulnerabilities\n"
  );

  let passed = 0;
  for (const test of tests) {
    try {
      const outcome = await test.run();
      passed += 1;
      console.log(`✓ ${test.name} — ${outcome}`);
    } catch (err) {
      console.error(`✗ ${test.name} — ${err.message}`);
    }
  }

  console.log(`\n${passed}/${tests.length} security PoC checks passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

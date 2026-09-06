import { execSync, spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { PySparkJudgePayload, PySparkJudgeResponse } from "@/lib/de-code/pyspark-seed-types";

const DEFAULT_IMAGE = "de-code-pyspark-judge:latest";
const JUDGE_DIR = path.join(process.cwd(), "scripts/judge/pyspark");

function resolveDockerBinary(): string | null {
  for (const candidate of ["docker", "podman"]) {
    try {
      execSync(`command -v ${candidate}`, { stdio: "ignore" });
      return candidate;
    } catch {
      // try next
    }
  }
  return null;
}

export function isPySparkContainerMode(): boolean {
  return process.env.PYSPARK_JUDGE_CONTAINER === "1";
}

export function isContainerRuntimeAvailable(): boolean {
  return resolveDockerBinary() !== null;
}

function parseJudgeResponse(stdout: string, stderr: string): PySparkJudgeResponse {
  try {
    const parsed = JSON.parse(stdout.trim() || "{}") as PySparkJudgeResponse;
    if (!parsed.status && stderr) {
      return {
        status: "runtime_error",
        passed: 0,
        total: 0,
        cases: [],
        message: stderr.slice(0, 500),
        pysparkAvailable: false,
      };
    }
    return parsed;
  } catch {
    return {
      status: "runtime_error",
      passed: 0,
      total: 0,
      cases: [],
      message: stderr || stdout || "PySpark container judge returned invalid JSON",
      pysparkAvailable: false,
    };
  }
}

/** Run one-shot judge inside an isolated container (network off, non-root, read-only root). */
export async function runPySparkInContainer(
  payload: PySparkJudgePayload
): Promise<PySparkJudgeResponse> {
  const docker = resolveDockerBinary();
  if (!docker) {
    return {
      status: "runtime_error",
      passed: 0,
      total: 0,
      cases: [],
      message:
        "PYSPARK_JUDGE_CONTAINER=1 but no container runtime (docker/podman) found on PATH.",
      pysparkAvailable: false,
    };
  }

  const image = process.env.PYSPARK_JUDGE_IMAGE ?? DEFAULT_IMAGE;
  const timeoutMs = payload.timeLimitMs + 15_000;
  const hardened = process.env.SECURITY_HARDENED === "1" ? "1" : "0";

  const args = [
    "run",
    "--rm",
    "-i",
    "--network",
    "none",
    "--read-only",
    "--tmpfs",
    "/tmp:rw,noexec,nosuid,size=256m",
    "--user",
    "1001:1001",
    "--cpus",
    process.env.PYSPARK_JUDGE_CPUS ?? "1",
    "--memory",
    process.env.PYSPARK_JUDGE_MEMORY ?? "768m",
    "--pids-limit",
    process.env.PYSPARK_JUDGE_PIDS_LIMIT ?? "64",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "-e",
    `SECURITY_HARDENED=${hardened}`,
    image,
  ];

  return new Promise((resolve) => {
    const child: ChildProcessWithoutNullStreams = spawn(docker, args, {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        status: "runtime_error",
        passed: 0,
        total: 0,
        cases: [],
        message: err.message,
        pysparkAvailable: false,
      });
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(parseJudgeResponse(stdout, stderr));
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

/** Static checks for container definition (no runtime required). */
export function validateContainerDefinition(): string[] {
  const errors: string[] = [];
  const dockerfile = path.join(JUDGE_DIR, "Dockerfile");
  if (!existsSync(dockerfile)) errors.push("Missing scripts/judge/pyspark/Dockerfile");
  if (existsSync(dockerfile)) {
    const dockerfileText = readFileSync(dockerfile, "utf8");
    if (!dockerfileText.includes("USER")) {
      errors.push("Dockerfile must run as non-root (USER directive)");
    }
  }
  return errors;
}

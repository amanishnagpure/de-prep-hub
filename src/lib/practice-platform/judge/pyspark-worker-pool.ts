import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import type { PySparkJudgePayload, PySparkJudgeResponse } from "@/lib/de-code/pyspark-seed-types";
import {
  isPySparkContainerMode,
  runPySparkInContainer,
} from "@/lib/practice-platform/judge/pyspark-container";

const WORKER_SCRIPT = path.join(process.cwd(), "scripts/judge/pyspark/worker.py");
const ONESHOT_SCRIPT = path.join(process.cwd(), "scripts/judge/pyspark/run_judge.py");
const WORKER_CWD = path.join(process.cwd(), "scripts/judge/pyspark");

const POOL_KEY = Symbol.for("de-code-pyspark-worker-pool");

function resolvePython(): string {
  if (process.env.PYSPARK_JUDGE_PYTHON) return process.env.PYSPARK_JUDGE_PYTHON;
  const condaPython = path.join(os.homedir(), "miniconda3", "bin", "python");
  if (existsSync(condaPython)) return condaPython;
  return "python3";
}

function resolveJavaHome(): string {
  if (process.env.JAVA_HOME && existsSync(path.join(process.env.JAVA_HOME, "bin", "java"))) {
    return process.env.JAVA_HOME;
  }
  for (const candidate of ["/usr/lib/jvm/java-21-openjdk-amd64", "/usr/lib/jvm/default-java"]) {
    if (existsSync(path.join(candidate, "bin", "java"))) return candidate;
  }
  return "";
}

function judgeEnv() {
  const python = resolvePython();
  const javaHome = resolveJavaHome();
  return {
    ...process.env,
    PYSPARK_PYTHON: python,
    ...(javaHome ? { JAVA_HOME: javaHome } : {}),
    ...(process.env.SECURITY_HARDENED === "1" ? { SECURITY_HARDENED: "1" } : {}),
  };
}

async function runOneShot(payload: PySparkJudgePayload): Promise<PySparkJudgeResponse> {
  const python = resolvePython();
  return new Promise((resolve, reject) => {
    const child = spawn(python, [ONESHOT_SCRIPT], {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: WORKER_CWD,
      env: judgeEnv(),
    });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGKILL"), payload.timeLimitMs + 10000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(parseJudgeResponse(stdout, stderr));
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
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
      message: stderr || stdout || "PySpark judge returned invalid JSON",
      pysparkAvailable: false,
    };
  }
}

type Pending = {
  resolve: (value: PySparkJudgeResponse) => void;
  reject: (reason?: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
};

class PySparkWorkerPool {
  private child: ChildProcessWithoutNullStreams | null = null;
  private ready = false;
  private coldStartMs = 0;
  private buffer = "";
  private pending = new Map<string, Pending>();
  private starting: Promise<void> | null = null;
  private bootResolve: (() => void) | null = null;
  private bootReject: ((err: Error) => void) | null = null;

  private spawnWorker(): Promise<void> {
    if (this.starting) return this.starting;

    this.starting = new Promise<void>((resolve, reject) => {
      this.bootResolve = resolve;
      this.bootReject = reject;

      const python = resolvePython();
      const child = spawn(python, [WORKER_SCRIPT], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: WORKER_CWD,
        env: judgeEnv(),
      });
      this.child = child;
      this.ready = false;

      const bootTimer = setTimeout(() => {
        this.bootReject?.(new Error("PySpark worker boot timeout"));
        this.bootResolve = null;
        this.bootReject = null;
        this.resetWorker();
      }, 120_000);

      child.stdout.on("data", (chunk) => {
        this.buffer += chunk.toString();
        this.flushLines();
      });

      child.on("error", (err) => {
        clearTimeout(bootTimer);
        this.bootReject?.(err);
        this.bootResolve = null;
        this.bootReject = null;
        this.rejectAll(err);
      });

      child.on("close", () => {
        clearTimeout(bootTimer);
        this.resetWorker();
      });

      const finishBoot = () => {
        clearTimeout(bootTimer);
        this.bootResolve?.();
        this.bootResolve = null;
        this.bootReject = null;
      };

      this.onReady = finishBoot;
    }).finally(() => {
      this.starting = null;
    });

    return this.starting;
  }

  private onReady: (() => void) | null = null;

  private resetWorker() {
    this.child = null;
    this.ready = false;
    this.buffer = "";
  }

  private rejectAll(err: unknown) {
    for (const [, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(err);
    }
    this.pending.clear();
    this.resetWorker();
  }

  private flushLines() {
    while (true) {
      const idx = this.buffer.indexOf("\n");
      if (idx === -1) break;
      const line = this.buffer.slice(0, idx).trim();
      this.buffer = this.buffer.slice(idx + 1);
      if (!line) continue;
      this.handleLine(line);
    }
  }

  private handleLine(line: string) {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(line) as Record<string, unknown>;
    } catch {
      return;
    }

    if (msg.type === "ready") {
      this.ready = true;
      this.coldStartMs = Number(msg.coldStartMs ?? 0);
      this.onReady?.();
      return;
    }

    if (msg.type === "response") {
      const id = String(msg.id ?? "");
      const pending = this.pending.get(id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(id);

      if (msg.ok) {
        const result = msg.result as PySparkJudgeResponse;
        pending.resolve({
          ...result,
          metrics: {
            ...(result.metrics ?? {}),
            coldStartMs: this.coldStartMs,
            workerReused: true,
          },
        });
      } else {
        pending.reject(new Error(String(msg.error ?? "Worker judge failed")));
      }
    }
  }

  private async ensureReady() {
    if (this.ready && this.child) return;
    await this.spawnWorker();
    if (!this.ready) throw new Error("PySpark worker failed to become ready");
  }

  async judge(payload: PySparkJudgePayload): Promise<PySparkJudgeResponse> {
    if (process.env.PYSPARK_WORKER_DISABLED === "1") {
      return runOneShot(payload);
    }

    try {
      await this.ensureReady();
    } catch {
      return runOneShot(payload);
    }

    if (!this.child?.stdin) {
      return runOneShot(payload);
    }

    const id = randomUUID();
    try {
      return await new Promise<PySparkJudgeResponse>((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          this.resetWorker();
          reject(new Error("PySpark worker request timeout"));
        }, payload.timeLimitMs + 10000);

        this.pending.set(id, { resolve, reject, timer });
        this.child!.stdin.write(`${JSON.stringify({ id, type: "judge", payload })}\n`);
      });
    } catch {
      return runOneShot(payload);
    }
  }
}

function getPool(): PySparkWorkerPool {
  const g = globalThis as typeof globalThis & { [key: symbol]: PySparkWorkerPool | undefined };
  if (!g[POOL_KEY]) g[POOL_KEY] = new PySparkWorkerPool();
  return g[POOL_KEY]!;
}

export async function runPySparkSandbox(payload: PySparkJudgePayload): Promise<PySparkJudgeResponse> {
  if (isPySparkContainerMode()) {
    return runPySparkInContainer(payload);
  }
  return getPool().judge(payload);
}

export function isPySparkJudgeEnabled(): boolean {
  return process.env.PYSPARK_JUDGE_DISABLED !== "1";
}

export async function shutdownPySparkWorker(): Promise<void> {
  const pool = getPool();
  if (!pool["child"]?.stdin) return;
  const id = randomUUID();
  pool["child"].stdin.write(`${JSON.stringify({ id, type: "shutdown" })}\n`);
}

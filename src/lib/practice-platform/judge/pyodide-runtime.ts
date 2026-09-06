type RuntimeTestCase = {
  id: string;
  label: string;
  args?: unknown[];
  expected?: unknown;
  compare?: "exact" | "sorted" | "set";
  input?: string;
  expectedOutput?: string;
};

export type RuntimeCaseResult = {
  label: string;
  pass: boolean;
  expected?: string;
  actual?: string;
  error?: string;
  input?: string;
};

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideRuntime>;
  }
}

type PyodideRuntime = {
  runPythonAsync: (code: string) => Promise<unknown>;
};

let pyodidePromise: Promise<PyodideRuntime> | null = null;

async function getPyodide(): Promise<PyodideRuntime> {
  if (typeof window === "undefined") {
    throw new Error("Python judge is browser-only.");
  }

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide."));
          document.head.appendChild(script);
        });
      }

      if (!window.loadPyodide) {
        throw new Error("Pyodide loader missing.");
      }

      return window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
    })();
  }

  return pyodidePromise;
}

function normalizeValue(value: unknown, mode: RuntimeTestCase["compare"] = "exact"): unknown {
  if (mode === "sorted" && Array.isArray(value)) {
    return [...value]
      .map((item) =>
        Array.isArray(item)
          ? [...item].sort()
          : typeof item === "string"
            ? [...item].sort()
            : item
      )
      .sort();
  }
  if (mode === "set" && Array.isArray(value)) {
    return [...new Set(value)].sort();
  }
  return value;
}

function stableStringify(value: unknown, mode: RuntimeTestCase["compare"] = "exact"): string {
  return JSON.stringify(normalizeValue(value, mode));
}

export async function runPythonTestCases(
  userCode: string,
  functionName: string,
  testCases: RuntimeTestCase[]
): Promise<{ results: RuntimeCaseResult[]; allPass: boolean; loadError?: string }> {
  try {
    const pyodide = await getPyodide();
    await pyodide.runPythonAsync(userCode);

    const results: RuntimeCaseResult[] = [];

    for (const test of testCases) {
      if (!test.args) {
        results.push({
          label: test.label,
          pass: false,
          error: "Missing test args.",
          input: test.input,
        });
        continue;
      }

      const argsJson = JSON.stringify(test.args);
      const runner = `
import json
_args = json.loads(${JSON.stringify(argsJson)})
_result = ${functionName}(*_args)
json.dumps(_result, sort_keys=True)
`;

      try {
        const raw = await pyodide.runPythonAsync(runner);
        const actual = JSON.parse(String(raw));
        const pass =
          stableStringify(actual, test.compare) === stableStringify(test.expected, test.compare);

        results.push({
          label: test.label,
          pass,
          input: test.input ?? JSON.stringify(test.args),
          expected: test.expectedOutput ?? JSON.stringify(test.expected),
          actual: JSON.stringify(actual),
        });
      } catch (err) {
        results.push({
          label: test.label,
          pass: false,
          input: test.input ?? JSON.stringify(test.args),
          error: err instanceof Error ? err.message : "Runtime error",
        });
      }
    }

    return { results, allPass: results.every((r) => r.pass) };
  } catch (err) {
    return {
      results: [],
      allPass: false,
      loadError: err instanceof Error ? err.message : "Failed to load Python runtime.",
    };
  }
}

export function buildPythonStarter(solution: string, functionName: string): string {
  const imports = solution
    .split("\n")
    .filter((line) => line.startsWith("from ") || line.startsWith("import "))
    .join("\n");

  const signature = solution
    .split("\n")
    .find((line) => line.trim().startsWith(`def ${functionName}`));

  const stub = signature
    ? signature.replace(/:\s*$/, ":\n    pass")
    : `def ${functionName}():\n    pass`;

  return imports ? `${imports}\n\n${stub}` : stub;
}

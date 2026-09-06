import type { JudgeVerdict, PlatformProblem } from "@/lib/practice-platform/types";
import { runPythonTestCases } from "@/lib/practice-platform/judge/pyodide-runtime";

export async function runPyodideJudge(
  problem: PlatformProblem,
  code: string,
  mode: "run" | "submit"
): Promise<JudgeVerdict> {
  if (!problem.functionName) {
    return {
      status: "compilation_error",
      passed: 0,
      total: 0,
      cases: [],
      message: "Problem missing functionName.",
    };
  }

  const visible = problem.testCases.filter((tc) => !tc.isHidden || mode === "submit");
  const toRun = mode === "run" ? visible.slice(0, 1) : visible;

  if (!toRun.length) {
    return {
      status: "wrong_answer",
      passed: 0,
      total: 0,
      cases: [],
      message: "No test cases configured.",
    };
  }

  const started = performance.now();
  const { results, allPass, loadError } = await runPythonTestCases(
    code,
    problem.functionName,
    toRun.map((tc) => ({
      id: tc.id,
      label: tc.id,
      args: tc.args,
      expected: tc.expected,
      compare: tc.compare,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    }))
  );

  if (loadError) {
    return {
      status: "runtime_error",
      passed: 0,
      total: toRun.length,
      cases: [],
      message: loadError,
    };
  }

  const passed = results.filter((r) => r.pass).length;
  const runtimeMs = Math.round(performance.now() - started);

  return {
    status: allPass ? "accepted" : passed > 0 ? "wrong_answer" : "wrong_answer",
    passed,
    total: toRun.length,
    runtimeMs,
    cases: results.map((r) => ({
      testCaseId: r.label,
      pass: r.pass,
      input: r.input ?? "",
      expectedOutput: r.expected ?? "",
      actualOutput: r.actual,
      error: r.error,
    })),
    message: allPass ? "All test cases passed." : `${passed}/${toRun.length} passed.`,
  };
}

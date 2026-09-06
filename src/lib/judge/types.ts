/** Generic judge execution contract — shared across SQL, PySpark, Python, DE Challenges */

export type JudgeMode = "run" | "submit";

export type JudgeEngineId = "sqlite" | "pyodide" | "pyspark" | "compare" | "de_challenge";

export type JudgeVerdictStatus =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "compilation_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded";

export type JudgeComparisonConfig = {
  schema?: boolean;
  columnOrder?: boolean;
  rowOrder?: boolean;
  allowExtraColumns?: boolean;
  ignoreColumnCase?: boolean;
};

export type JudgeResourceLimits = {
  timeLimitMs?: number;
  maxInputRows?: number;
  maxOutputRows?: number;
  maxFixtureCount?: number;
};

export type JudgeFixture = {
  id: string;
  label?: string;
  isHidden: boolean;
  tables: Record<string, Record<string, unknown>[]>;
  /** Human-readable scenario tag for failed hidden tests (no data exposed) */
  purpose?: string;
  /** Skill/concept tags evaluated by this fixture */
  tests?: string[];
};

export type JudgeTestCaseResult = {
  testCaseId: string;
  pass: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  purpose?: string;
  tests?: string[];
  isHidden?: boolean;
  runtimeMs?: number;
  metrics?: JudgeCaseMetrics;
};

export type JudgeCaseMetrics = {
  inputRows?: number;
  outputRows?: number;
  expectedOutputRows?: number;
};

export type JudgeExecutionMetrics = {
  runtimeMs?: number;
  coldStartMs?: number;
  workerReused?: boolean;
  inputRows?: number;
  outputRows?: number;
};

export type JudgeResult = {
  status: JudgeVerdictStatus;
  passed: number;
  total: number;
  cases: JudgeTestCaseResult[];
  message?: string;
  metrics?: JudgeExecutionMetrics;
};

export type JudgeRequest = {
  problemId: string;
  slug: string;
  engine: JudgeEngineId;
  sourceCode: string;
  referenceCode?: string;
  resultVar?: string;
  mode: JudgeMode;
  fixtures?: JudgeFixture[];
  comparison?: JudgeComparisonConfig;
  limits?: JudgeResourceLimits;
};

export const DEFAULT_COMPARISON: Required<JudgeComparisonConfig> = {
  schema: true,
  columnOrder: false,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

export const DEFAULT_LIMITS: Required<JudgeResourceLimits> = {
  timeLimitMs: 15000,
  maxInputRows: 5000,
  maxOutputRows: 10000,
  maxFixtureCount: 8,
};

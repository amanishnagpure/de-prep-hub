import type {
  JudgeComparisonConfig,
  JudgeExecutionMetrics,
  JudgeResourceLimits,
} from "@/lib/judge/types";

/** PySpark judge seed — input fixtures + reference execution metadata */

export type PySparkFixture = {
  id: string;
  label?: string;
  isHidden: boolean;
  /** table name → row objects loaded into Spark before user code runs */
  tables: Record<string, Record<string, unknown>[]>;
};

export type PySparkProblemSeed = {
  /** DataFrame variable the user must assign (e.g. active, daily) */
  resultVar: string;
  /** Reference solution executed on each fixture to derive expected output */
  referenceCode: string;
  fixtures: PySparkFixture[];
  comparison?: JudgeComparisonConfig;
  limits?: JudgeResourceLimits;
};

export type PySparkJudgePayload = {
  userCode: string;
  referenceCode: string;
  resultVar: string;
  fixtures: PySparkFixture[];
  mode: "run" | "submit";
  timeLimitMs: number;
  comparison?: JudgeComparisonConfig;
  limits?: JudgeResourceLimits;
};

export type PySparkJudgeCaseResult = {
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
  metrics?: {
    inputRows?: number;
    outputRows?: number;
    expectedOutputRows?: number;
  };
};

export type PySparkJudgeResponse = {
  status: string;
  passed: number;
  total: number;
  cases: PySparkJudgeCaseResult[];
  message?: string;
  runtimeMs?: number;
  metrics?: JudgeExecutionMetrics;
  pysparkAvailable?: boolean;
};

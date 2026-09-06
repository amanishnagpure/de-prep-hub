export type PracticeTrackId = "sql" | "spark" | "python" | "dsa";

export type ProblemDifficulty = "easy" | "medium" | "hard";

export type JudgeBackend = "pyodide" | "sql" | "compare" | "pyspark" | "dmoj";

export type SubmissionStatus =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "compilation_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded"
  | "pending";

export type PlatformTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  args?: unknown[];
  expected?: unknown;
  isHidden: boolean;
  compare?: "exact" | "sorted" | "set";
};

export type PlatformProblem = {
  id: string;
  slug: string;
  track: PracticeTrackId;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  topics: string[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  solution: string;
  hints?: string[];
  editorial?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  judge: JudgeBackend;
  functionName?: string;
  testCases: PlatformTestCase[];
  tables?: string[];
  externalUrl?: string;
};

export type JudgeCaseResult = {
  testCaseId: string;
  pass: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  error?: string;
  runtimeMs?: number;
};

export type JudgeVerdict = {
  status: SubmissionStatus;
  passed: number;
  total: number;
  cases: JudgeCaseResult[];
  message?: string;
  runtimeMs?: number;
  metrics?: {
    runtimeMs?: number;
    coldStartMs?: number;
    workerReused?: boolean;
    inputRows?: number;
    outputRows?: number;
  };
};

export type PlatformSubmission = {
  id: string;
  problemId: string;
  track: PracticeTrackId;
  slug: string;
  language: string;
  code: string;
  status: SubmissionStatus;
  passed: number;
  total: number;
  runtimeMs?: number;
  createdAt: string;
};

export const PRACTICE_TRACK_META = [
  {
    id: "sql" as const,
    label: "SQL",
    description: "Query problems with schema, run, and submit",
  },
  {
    id: "spark" as const,
    label: "Spark",
    description: "PySpark patterns validated against reference solutions",
  },
  {
    id: "python" as const,
    label: "Python",
    description: "Data engineering Python with hidden test cases",
  },
  {
    id: "dsa" as const,
    label: "DSA",
    description: "Algorithms executed in-browser (Pyodide judge)",
  },
];

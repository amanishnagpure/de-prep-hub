/** Data Engineering Code Platform — problem & submission types */

import type { DeRelevance } from "@/lib/de-code/taxonomy";

export type CodeTrackId = "sql" | "python" | "pyspark" | "dsa";

export type CodeDifficulty = "easy" | "medium" | "hard" | "expert";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type JudgeBackend = "pyodide" | "sql" | "compare" | "dmoj";

export type SubmissionStatus =
  | "accepted"
  | "wrong_answer"
  | "runtime_error"
  | "compilation_error"
  | "time_limit_exceeded"
  | "pending";

export type CodeTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  args?: unknown[];
  expected?: unknown;
  isHidden: boolean;
  compare?: "exact" | "sorted" | "set";
};

export type CodeProblem = {
  id: string;
  slug: string;
  track: CodeTrackId;
  title: string;
  description: string;
  difficulty: CodeDifficulty;
  experienceLevel: ExperienceLevel;
  /** Topic slug from taxonomy (e.g. window-functions) */
  topic: string;
  /** Granular subtopic slug (e.g. lag-lead) */
  subtopic: string;
  concepts: string[];
  deRelevance: DeRelevance;
  learningOrder: number;
  prerequisites: string[];
  companyTags: string[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  functionSignature?: string;
  followUp?: string;
  starterCode: string;
  solution: string;
  explanation: string;
  hints: string[];
  timeLimitMs: number;
  memoryLimitMb: number;
  judge: JudgeBackend;
  functionName?: string;
  testCases: CodeTestCase[];
  tables?: string[];
  /** Spark / DE scenario metadata */
  inputSchema?: string;
  outputSchema?: string;
  performanceRequirements?: string[];
  datasetSize?: string;
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
};

export type CodeSubmission = {
  id: string;
  problemId: string;
  track: CodeTrackId;
  slug: string;
  language: string;
  code: string;
  status: SubmissionStatus;
  passed: number;
  total: number;
  runtimeMs?: number;
  createdAt: string;
};

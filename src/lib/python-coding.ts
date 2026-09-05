import problems from "@/data/python-coding-track.json";

export type PythonCodingDifficulty = "easy" | "medium" | "hard";

export type PythonCodingPattern =
  | "array"
  | "hashmap"
  | "string"
  | "two-pointer"
  | "sliding-window"
  | "stack"
  | "heap"
  | "tree"
  | "dp";

export interface PythonCodingProblem {
  id: number;
  slug: string;
  title: string;
  difficulty: PythonCodingDifficulty;
  pattern: PythonCodingPattern;
  mustDo: boolean;
  leetcodeUrl: string;
  summary: string;
  approach: string;
  solution: string;
  order: number;
}

export const PYTHON_CODING_PATTERNS: Record<PythonCodingPattern, string> = {
  array: "Array",
  hashmap: "Hash map",
  string: "String",
  "two-pointer": "Two pointer",
  "sliding-window": "Sliding window",
  stack: "Stack",
  heap: "Heap",
  tree: "Tree",
  dp: "Dynamic programming",
};

export function getPythonCodingProblems(): PythonCodingProblem[] {
  return problems as PythonCodingProblem[];
}

export const PYTHON_CODING_TOTAL = getPythonCodingProblems().length;

export const PYTHON_CODING_MUST_DO = getPythonCodingProblems().filter((p) => p.mustDo).length;

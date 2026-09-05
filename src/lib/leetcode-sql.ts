import problems from "@/data/leetcode-sql-top50.json";

export type LeetCodeSqlDifficulty = "easy" | "medium" | "hard";

export type LeetCodeSqlPattern =
  | "filtering"
  | "join"
  | "aggregation"
  | "subquery"
  | "window"
  | "self-join"
  | "anti-join"
  | "duplicate"
  | "consecutive"
  | "ranking"
  | "date"
  | "reporting";

export interface LeetCodeSqlProblem {
  id: number;
  slug: string;
  title: string;
  difficulty: LeetCodeSqlDifficulty;
  pattern: LeetCodeSqlPattern;
  mustDo: boolean;
  leetcodeUrl: string;
  summary: string;
  approach: string;
  dialectNote?: string;
  tables: string[];
  solution: string;
  order: number;
}

export const LEETCODE_SQL_PATTERNS: Record<LeetCodeSqlPattern, string> = {
  filtering: "Filtering",
  join: "Join",
  aggregation: "Aggregation",
  subquery: "Subquery",
  window: "Window function",
  "self-join": "Self-join",
  "anti-join": "Anti-join",
  duplicate: "Duplicates",
  consecutive: "Consecutive rows",
  ranking: "Ranking / Top-N",
  date: "Date logic",
  reporting: "Reporting",
};

export function getLeetCodeSqlProblems(): LeetCodeSqlProblem[] {
  return problems as LeetCodeSqlProblem[];
}

export function getLeetCodeSqlProblem(slug: string): LeetCodeSqlProblem | undefined {
  return getLeetCodeSqlProblems().find((problem) => problem.slug === slug);
}

export const LEETCODE_SQL_TOTAL = getLeetCodeSqlProblems().length;

export const LEETCODE_SQL_MUST_DO = getLeetCodeSqlProblems().filter((p) => p.mustDo).length;

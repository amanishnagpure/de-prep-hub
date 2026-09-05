import type { LeetCodeSqlProblem } from "@/lib/leetcode-sql";
import type { SqlInterviewQuestion } from "@/lib/sql-interview";
import type { SqlPracticeQuestion } from "@/lib/sql-practice";

export const MOCK_SESSION_SECONDS = 45 * 60;

export type MockItemType = "conceptual" | "leetcode" | "practice";

export interface MockSessionItem {
  id: string;
  type: MockItemType;
  title: string;
  body: string;
  answer?: string;
  leetcodeUrl?: string;
  suggestedMinutes: number;
}

export interface MockSessionPools {
  interview: SqlInterviewQuestion[];
  leetcode: LeetCodeSqlProblem[];
  practice: SqlPracticeQuestion[];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function pick<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

export function buildMockSession(pools: MockSessionPools): MockSessionItem[] {
  const mustDoLc = pools.leetcode.filter((p) => p.mustDo);
  const lcPool = mustDoLc.length > 0 ? mustDoLc : pools.leetcode;
  const practicePool = pools.practice.filter((p) => p.tier !== "basic");

  const conceptual = pick(pools.interview, 3).map((q) => ({
    id: `conceptual-${q.id}`,
    type: "conceptual" as const,
    title: q.question,
    body: "Answer out loud as in a real interview. Cover definition, example, and when you'd use it.",
    answer: q.answer,
    suggestedMinutes: 4,
  }));

  const lc = pick(lcPool, 3).map((p) => ({
    id: `lc-${p.slug}`,
    type: "leetcode" as const,
    title: p.title,
    body: p.summary,
    answer: p.solution,
    leetcodeUrl: p.leetcodeUrl,
    suggestedMinutes: 8,
  }));

  const coding = pick(practicePool, 2).map((p) => ({
    id: `practice-${p.id}`,
    type: "practice" as const,
    title: p.title,
    body: p.body,
    answer: p.solution,
    suggestedMinutes: 7,
  }));

  return [...conceptual, ...lc, ...coding];
}

export const MOCK_TYPE_LABELS: Record<MockItemType, string> = {
  conceptual: "Conceptual Q&A",
  leetcode: "LeetCode SQL",
  practice: "Coding problem",
};

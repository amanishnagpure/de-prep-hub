import type { SparkInterviewQuestion } from "@/lib/spark-interview";
import type { SparkPracticeQuestion } from "@/lib/spark-practice";

export const MOCK_SESSION_SECONDS = 45 * 60;

export type MockItemType = "conceptual" | "practice";

export interface MockSessionItem {
  id: string;
  type: MockItemType;
  title: string;
  body: string;
  answer?: string;
  suggestedMinutes: number;
}

export interface MockSessionPools {
  interview: SparkInterviewQuestion[];
  practice: SparkPracticeQuestion[];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function pick<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, Math.min(count, items.length));
}

export function buildMockSession(pools: MockSessionPools): MockSessionItem[] {
  const practicePool = pools.practice.filter((p) => p.tier !== "basic");

  const conceptual = pick(pools.interview, 5).map((q) => ({
    id: `conceptual-${q.id}`,
    type: "conceptual" as const,
    title: q.question,
    body: "Answer out loud as in a real DE2 interview. Cover definition, example, and production use case.",
    answer: q.answer,
    suggestedMinutes: 4,
  }));

  const coding = pick(practicePool, 3).map((p) => ({
    id: `practice-${p.id}`,
    type: "practice" as const,
    title: p.title,
    body: p.body,
    answer: p.solution,
    suggestedMinutes: 8,
  }));

  return [...conceptual, ...coding];
}

export const MOCK_TYPE_LABELS: Record<MockItemType, string> = {
  conceptual: "Conceptual Q&A",
  practice: "PySpark coding",
};

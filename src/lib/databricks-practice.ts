import questions from "@/data/databricks-practice-questions.json";
import { DATABRICKS_PRACTICE_CATEGORIES } from "@/lib/databricks";

export type DatabricksPracticeCategory = keyof typeof DATABRICKS_PRACTICE_CATEGORIES;

export interface DatabricksPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: DatabricksPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getDatabricksPracticeQuestions(): DatabricksPracticeQuestion[] {
  return questions as DatabricksPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | DatabricksPracticeQuestion["tier"] = "all"
): DatabricksPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getDatabricksPracticeQuestions()
      : getDatabricksPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;

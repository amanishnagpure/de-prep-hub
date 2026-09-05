import questions from "@/data/spark-practice-questions.json";
import { SPARK_PRACTICE_CATEGORIES } from "@/lib/spark";

export type SparkPracticeCategory = keyof typeof SPARK_PRACTICE_CATEGORIES;

export interface SparkPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: SparkPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getSparkPracticeQuestions(): SparkPracticeQuestion[] {
  return questions as SparkPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | SparkPracticeQuestion["tier"] = "all"
): SparkPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getSparkPracticeQuestions()
      : getSparkPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;

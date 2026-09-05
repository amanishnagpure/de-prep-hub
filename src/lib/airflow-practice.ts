import questions from "@/data/airflow-practice-questions.json";
import { AIRFLOW_PRACTICE_CATEGORIES } from "@/lib/airflow";

export type AirflowPracticeCategory = keyof typeof AIRFLOW_PRACTICE_CATEGORIES;

export interface AirflowPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: AirflowPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getAirflowPracticeQuestions(): AirflowPracticeQuestion[] {
  return questions as AirflowPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | AirflowPracticeQuestion["tier"] = "all"
): AirflowPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getAirflowPracticeQuestions()
      : getAirflowPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;

import questions from "@/data/python-practice-questions.json";
import { PYTHON_PRACTICE_CATEGORIES } from "@/lib/python";

export type PythonPracticeCategory = keyof typeof PYTHON_PRACTICE_CATEGORIES;

export interface PythonPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: PythonPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getPythonPracticeQuestions(): PythonPracticeQuestion[] {
  return questions as PythonPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | PythonPracticeQuestion["tier"] = "all"
): PythonPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getPythonPracticeQuestions()
      : getPythonPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;

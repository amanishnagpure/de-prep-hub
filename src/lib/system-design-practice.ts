import questions from "@/data/system-design-practice-questions.json";
import { SYSTEM_DESIGN_PRACTICE_CATEGORIES } from "@/lib/system-design";

export type SystemDesignPracticeCategory = keyof typeof SYSTEM_DESIGN_PRACTICE_CATEGORIES;

export interface SystemDesignPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: SystemDesignPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getSystemDesignPracticeQuestions(): SystemDesignPracticeQuestion[] {
  return questions as SystemDesignPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | SystemDesignPracticeQuestion["tier"] = "all"
): SystemDesignPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getSystemDesignPracticeQuestions()
      : getSystemDesignPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 5;

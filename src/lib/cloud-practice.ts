import questions from "@/data/cloud-practice-questions.json";
import { CLOUD_PRACTICE_CATEGORIES } from "@/lib/cloud";

export type CloudPracticeCategory = keyof typeof CLOUD_PRACTICE_CATEGORIES;

export interface CloudPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: CloudPracticeCategory;
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getCloudPracticeQuestions(): CloudPracticeQuestion[] {
  return questions as CloudPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | CloudPracticeQuestion["tier"] = "all"
): CloudPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getCloudPracticeQuestions()
      : getCloudPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;

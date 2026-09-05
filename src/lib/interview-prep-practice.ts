import questions from "@/data/interview-prep-practice-questions.json";
import { INTERVIEW_PREP_PRACTICE_CATEGORIES } from "@/lib/interview-prep";

export type InterviewPrepPracticeCategory = keyof typeof INTERVIEW_PREP_PRACTICE_CATEGORIES;

export interface InterviewPrepPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  category: InterviewPrepPracticeCategory;
  title: string;
  body: string;
  framework: string;
  anchor: string;
}

export function getInterviewPrepPracticeQuestions(): InterviewPrepPracticeQuestion[] {
  return questions as InterviewPrepPracticeQuestion[];
}

export function pickRandomPracticeQuestions(
  count: number,
  tier: "all" | InterviewPrepPracticeQuestion["tier"] = "all"
): InterviewPrepPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getInterviewPrepPracticeQuestions()
      : getInterviewPrepPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const PRACTICE_DRILL_SIZE = 5;

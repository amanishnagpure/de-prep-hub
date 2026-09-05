import questions from "@/data/sql-practice-questions.json";

export interface SqlPracticeQuestion {
  id: number;
  tier: "basic" | "medium" | "hard";
  title: string;
  body: string;
  solution: string;
  anchor: string;
}

export function getSqlPracticeQuestions(): SqlPracticeQuestion[] {
  return questions as SqlPracticeQuestion[];
}

export function pickRandomQuestions(
  count: number,
  tier: "all" | SqlPracticeQuestion["tier"] = "all"
): SqlPracticeQuestion[] {
  const pool =
    tier === "all"
      ? getSqlPracticeQuestions()
      : getSqlPracticeQuestions().filter((q) => q.tier === tier);

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const QUIZ_SIZE = 10;
export const TIMED_SESSION_SECONDS = 20 * 60;
export const QUESTION_TIMER_SECONDS = 2 * 60;

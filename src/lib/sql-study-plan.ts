import { SQL_ROUTES, SQL_STATS } from "@/lib/sql";
import { LEETCODE_SQL_MUST_DO, getLeetCodeSqlProblems } from "@/lib/leetcode-sql";
import {
  getInterviewStats,
  getLeetCodeStats,
  getNotesStats,
  getPracticeStats,
  getSqlProgress,
  isLeetCodeSolved,
  getLeetCodeConfidence,
} from "@/lib/sql-progress";
import { getWeakAreas } from "@/lib/sql-weak-areas";

export interface StudyChecklistItem {
  id: string;
  label: string;
  href: string;
  done: boolean;
  progress: string;
}

export interface TodayPlanItem {
  title: string;
  href: string;
}

export function getStudyChecklist(): StudyChecklistItem[] {
  const progress = getSqlProgress();
  const notes = getNotesStats(SQL_STATS.noteChapters);
  const practice = getPracticeStats(SQL_STATS.practiceTotal);
  const interview = getInterviewStats(SQL_STATS.interviewTotal);

  const mustDoDone = getLeetCodeSqlProblems().filter(
    (p) => p.mustDo && (isLeetCodeSolved(p.slug) || getLeetCodeConfidence(p.slug) === "know")
  ).length;

  const mockDone = (progress.mockSessionsCompleted ?? 0) > 0;

  return [
    {
      id: "notes",
      label: "Notes (3+ chapters)",
      href: SQL_ROUTES.notes,
      done: notes.read >= 3,
      progress: `${notes.read}/${notes.total}`,
    },
    {
      id: "practice",
      label: "Practice (25+)",
      href: SQL_ROUTES.practice,
      done: practice.solved >= 25,
      progress: `${practice.solved}/${practice.total}`,
    },
    {
      id: "leetcode",
      label: "LeetCode must-do",
      href: SQL_ROUTES.leetcode,
      done: mustDoDone >= 15,
      progress: `${mustDoDone}/${LEETCODE_SQL_MUST_DO}`,
    },
    {
      id: "mock",
      label: "Mock session",
      href: SQL_ROUTES.mock,
      done: mockDone,
      progress: mockDone ? "✓" : "—",
    },
    {
      id: "interview",
      label: "Flashcards (25+)",
      href: `${SQL_ROUTES.interview}`,
      done: interview.know >= 25,
      progress: `${interview.know}/${interview.total}`,
    },
  ];
}

export function getTodaysPlan(): TodayPlanItem[] {
  const plan: TodayPlanItem[] = [];
  const checklist = getStudyChecklist();
  const weak = getWeakAreas(2);

  const nextChecklist = checklist.find((item) => !item.done);
  if (nextChecklist) {
    plan.push({ title: nextChecklist.label, href: nextChecklist.href });
  }

  for (const area of weak) {
    plan.push({ title: area.label, href: area.href });
  }

  if ((getSqlProgress().mockSessionsCompleted ?? 0) === 0) {
    plan.push({ title: "Mock session", href: SQL_ROUTES.mock });
  }

  return plan.slice(0, 3);
}

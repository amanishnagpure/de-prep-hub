import { SQL_ROUTES } from "@/lib/sql";
import { getSqlPracticeQuestions } from "@/lib/sql-practice";
import { getSqlProgress, isPracticeSolved } from "@/lib/sql-progress";

export interface WeakArea {
  id: string;
  label: string;
  source: "practice";
  solved: number;
  total: number;
  percent: number;
  href: string;
}

function inferPracticeCategory(title: string, solution: string): string {
  const text = `${title} ${solution}`.toUpperCase();
  if (/\bOVER\s*\(|\bROW_NUMBER|\bRANK\s*\(|\bLAG\s*\(|\bLEAD\s*\(/.test(text)) return "Window functions";
  if (/\bRECURSIVE\b|\bCTE\b|\bWITH\s+\w+/.test(text)) return "CTEs";
  if (/\bJOIN\b/.test(text)) return "Joins";
  if (/\bGROUP BY\b|\bHAVING\b/.test(text)) return "Aggregation";
  if (/\bEXISTS\b|\bNOT EXISTS\b|\bEXCEPT\b|\bINTERSECT\b/.test(text)) return "Subqueries";
  if (/\bSELF\b|manager_id|LAG|LEAD/.test(text)) return "Self-join / sequences";
  return "Filtering & basics";
}

export function getWeakAreas(limit = 5): WeakArea[] {
  const areas: WeakArea[] = [];

  const practiceByCat = new Map<string, { solved: number; total: number }>();
  for (const problem of getSqlPracticeQuestions()) {
    const cat = inferPracticeCategory(problem.title, problem.solution);
    const entry = practiceByCat.get(cat) ?? { solved: 0, total: 0 };
    entry.total += 1;
    if (isPracticeSolved(problem.id)) entry.solved += 1;
    practiceByCat.set(cat, entry);
  }

  for (const [cat, stats] of practiceByCat) {
    areas.push({
      id: `practice-${cat}`,
      label: cat,
      source: "practice",
      solved: stats.solved,
      total: stats.total,
      percent: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
      href: SQL_ROUTES.practice,
    });
  }

  return areas
    .filter((area) => area.total > 0 && area.percent < 100)
    .sort((a, b) => a.percent - b.percent || a.total - b.total)
    .slice(0, limit);
}

export function getReviewQueue(): { interview: number } {
  const progress = getSqlProgress();

  const interviewReview = Object.values(progress.interviewConfidence).filter(
    (c) => c === "unsure" || c === "dont"
  ).length;

  return {
    interview: interviewReview,
  };
}

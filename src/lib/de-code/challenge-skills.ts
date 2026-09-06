import { getAllChallenges } from "@/lib/de-code/challenge-bank";
import {
  CHALLENGE_TAXONOMY_GROUPS,
  type ChallengeTaxonomyGroup,
  getChallengeGroupLabel,
} from "@/lib/de-code/challenge-taxonomy";
import { isProblemSolved } from "@/lib/de-code/progress";

export type ChallengeSkillStat = {
  group: ChallengeTaxonomyGroup;
  label: string;
  solved: number;
  total: number;
  percent: number;
};

function readSolvedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = JSON.parse(localStorage.getItem("de-prep-hub-de-code") ?? "{}") as {
      solved?: string[];
    };
    return new Set(Array.isArray(raw.solved) ? raw.solved : []);
  } catch {
    return new Set();
  }
}

export function getChallengeSkillProfile(): ChallengeSkillStat[] {
  const challenges = getAllChallenges();
  const solved = readSolvedIds();

  return CHALLENGE_TAXONOMY_GROUPS.map((group) => {
    const inGroup = challenges.filter((c) => c.taxonomyGroup === group.id);
    const solvedCount = inGroup.filter((c) => solved.has(c.id)).length;
    const total = inGroup.length;
    return {
      group: group.id,
      label: getChallengeGroupLabel(group.id),
      solved: solvedCount,
      total,
      percent: total ? Math.round((solvedCount / total) * 100) : 0,
    };
  }).filter((s) => s.total > 0);
}

export function getWeakestSkills(limit = 3): ChallengeSkillStat[] {
  return [...getChallengeSkillProfile()]
    .filter((s) => s.total > 0 && s.percent < 100)
    .sort((a, b) => a.percent - b.percent || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function getChallengeCompletionSummary() {
  const challenges = getAllChallenges();
  const solved = challenges.filter((c) => isProblemSolved(c.id)).length;
  return { solved, total: challenges.length };
}

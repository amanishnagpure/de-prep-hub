import catalog from "@/data/de-code/challenges/catalog.json";
import { getChallengeFixtureCounts } from "@/data/de-code/challenge-seeds";
import type { DEChallengeProblem } from "@/lib/de-code/challenge-types";
import type { ChallengeTaxonomyGroup } from "@/lib/de-code/challenge-taxonomy";

const CHALLENGES = (catalog as DEChallengeProblem[]).sort(
  (a, b) => a.challengeNumber - b.challengeNumber
);

export function getAllChallenges(): DEChallengeProblem[] {
  return CHALLENGES;
}

export function getChallengeBySlug(slug: string): DEChallengeProblem | undefined {
  return CHALLENGES.find((c) => c.slug === slug);
}

export function getChallengeById(id: string): DEChallengeProblem | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export function isChallengeId(id: string): boolean {
  return id.startsWith("challenge/");
}

export function getChallengesByTaxonomy(
  group: ChallengeTaxonomyGroup,
  topic?: string
): DEChallengeProblem[] {
  return CHALLENGES.filter(
    (c) => c.taxonomyGroup === group && (topic ? c.taxonomyTopic === topic : true)
  );
}

export { getChallengeFixtureCounts };

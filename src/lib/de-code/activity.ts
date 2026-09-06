import { getAllChallenges, getChallengeBySlug } from "@/lib/de-code/challenge-bank";
import { challengePath, codeTrackPath } from "@/lib/de-code/constants";
import {
  getActiveTopics,
  getCodeProblemById,
  getCodeProblems,
  getTopicLabel,
} from "@/lib/de-code/problem-bank";
import { getMostRecentSubmission, getTopicStats, isProblemSolved } from "@/lib/de-code/progress";
import type { CodeTrackId } from "@/lib/de-code/types";
import { CODE_TRACKS } from "@/lib/de-code/constants";
import type { DEChallengeProblem } from "@/lib/de-code/challenge-types";
import {
  getChallengeGroupLabel,
  getChallengeTopicLabel,
} from "@/lib/de-code/challenge-taxonomy";

export type ContinueActivity = {
  title: string;
  subtitle: string;
  detail: string;
  href: string;
};

const TRACK_LABEL: Record<CodeTrackId, string> = {
  sql: "SQL",
  python: "Python",
  pyspark: "PySpark",
  dsa: "DSA",
};

function problemHref(track: CodeTrackId, slug: string, topic?: string): string {
  const base = topic ? `${codeTrackPath(track)}/${topic}` : codeTrackPath(track);
  return `${base}?slug=${encodeURIComponent(slug)}`;
}

function continueFromPracticeSubmission(): ContinueActivity | null {
  const recent = getMostRecentSubmission();
  if (!recent || recent.problemKind === "de_challenge") return null;

  const problem = getCodeProblemById(recent.problemId);
  if (!problem) return null;

  const topicStats = getTopicStats(
    problem.track,
    getCodeProblems(problem.track, problem.topic).map((p) => p.id)
  );

  return {
    title: problem.title,
    subtitle: `${TRACK_LABEL[problem.track]} · ${getTopicLabel(problem.track, problem.topic)}`,
    detail: `${topicStats.solved} of ${topicStats.total} in this topic completed`,
    href: problemHref(problem.track, problem.slug, problem.topic),
  };
}

function continueFromSubmission(): ContinueActivity | null {
  const recent = getMostRecentSubmission();
  if (!recent) return null;

  if (recent.problemKind === "de_challenge") {
    const challenge = getChallengeBySlug(recent.slug);
    if (!challenge) return null;
    return {
      title: challenge.title,
      subtitle: "Challenge",
      detail: `${getChallengeGroupLabel(challenge.taxonomyGroup)} · ${getChallengeTopicLabel(challenge.taxonomyTopic)}`,
      href: challengePath(challenge.slug),
    };
  }

  const problem = getCodeProblemById(recent.problemId);
  if (!problem) return null;

  const topicStats = getTopicStats(
    problem.track,
    getCodeProblems(problem.track, problem.topic).map((p) => p.id)
  );

  return {
    title: problem.title,
    subtitle: `${TRACK_LABEL[problem.track]} · ${getTopicLabel(problem.track, problem.topic)}`,
    detail: `${topicStats.solved} of ${topicStats.total} in this topic completed`,
    href: problemHref(problem.track, problem.slug, problem.topic),
  };
}

function continueFromPartialTopic(): ContinueActivity | null {
  for (const track of CODE_TRACKS) {
    for (const topic of getActiveTopics(track.id)) {
      const problems = getCodeProblems(track.id, topic.id);
      const stats = getTopicStats(
        track.id,
        problems.map((p) => p.id)
      );
      if (stats.solved === 0 || stats.solved >= stats.total) continue;

      const next = problems.find((p) => !isProblemSolved(p.id));
      if (!next) continue;

      return {
        title: next.title,
        subtitle: `${TRACK_LABEL[track.id]} · ${topic.label}`,
        detail: `${stats.solved} of ${stats.total} in this topic completed`,
        href: problemHref(track.id, next.slug, topic.id),
      };
    }
  }
  return null;
}

function continueFromFirstProblem(): ContinueActivity | null {
  for (const track of CODE_TRACKS) {
    const problems = getCodeProblems(track.id);
    const next = problems.find((p) => !isProblemSolved(p.id));
    if (!next) continue;

    const topicStats = getTopicStats(
      track.id,
      getCodeProblems(track.id, next.topic).map((p) => p.id)
    );

    return {
      title: next.title,
      subtitle: `${TRACK_LABEL[track.id]} · ${getTopicLabel(track.id, next.topic)}`,
      detail: `${topicStats.solved} of ${topicStats.total} in this topic completed`,
      href: problemHref(track.id, next.slug, next.topic),
    };
  }
  return null;
}

export function getContinueActivity(): ContinueActivity | null {
  if (typeof window === "undefined") return null;
  return continueFromSubmission() ?? continueFromPartialTopic() ?? continueFromFirstProblem();
}

/** Practice-only continue — skips DE challenges (they live under /code/challenges). */
export function getContinuePracticeActivity(): ContinueActivity | null {
  if (typeof window === "undefined") return null;
  return (
    continueFromPracticeSubmission() ?? continueFromPartialTopic() ?? continueFromFirstProblem()
  );
}

const FEATURED_CHALLENGE_SLUG = "pipeline-reconciliation";

export function getFeaturedChallenge(): DEChallengeProblem {
  const challenges = getAllChallenges();
  const featured = getChallengeBySlug(FEATURED_CHALLENGE_SLUG);
  if (featured && !isProblemSolved(featured.id)) return featured;

  const unsolved = challenges.find((c) => !isProblemSolved(c.id));
  return unsolved ?? challenges[0];
}

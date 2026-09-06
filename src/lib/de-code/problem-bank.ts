import catalog from "@/data/de-code/catalog.json";
import type { CodeProblem, CodeTrackId } from "@/lib/de-code/types";
import {
  getSubtopicsForTopic,
  getTopicMeta,
  getTopicsForTrack,
  type TopicMeta,
} from "@/lib/de-code/taxonomy";

const ALL = catalog as CodeProblem[];

const DIFF_ORDER = { easy: 0, medium: 1, hard: 2, expert: 3 } as const;
const EXP_ORDER = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 } as const;

function sortProblems(list: CodeProblem[]) {
  return [...list].sort((a, b) => {
    const topicOrder =
      getTopicsForTrack(a.track).findIndex((t) => t.id === a.topic) -
      getTopicsForTrack(b.track).findIndex((t) => t.id === b.topic);
    if (topicOrder !== 0) return topicOrder;
    const learn = (a.learningOrder ?? 99) - (b.learningOrder ?? 99);
    if (learn !== 0) return learn;
    const diff = DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  });
}

export function getCodeProblems(track: CodeTrackId, topicId?: string): CodeProblem[] {
  let list = ALL.filter((p) => p.track === track);
  if (topicId) list = list.filter((p) => p.topic === topicId);
  return sortProblems(list);
}

export function getCodeProblem(track: CodeTrackId, slug: string): CodeProblem | undefined {
  return ALL.find((p) => p.track === track && p.slug === slug);
}

export function getCodeProblemById(id: string): CodeProblem | undefined {
  return ALL.find((p) => p.id === id);
}

export function getCodeTrackCount(track: CodeTrackId): number {
  return getCodeProblems(track).length;
}

export function getCodeCatalogStats() {
  const byTrack = Object.fromEntries(
    (["sql", "python", "pyspark", "dsa"] as CodeTrackId[]).map((t) => [t, getCodeTrackCount(t)])
  ) as Record<CodeTrackId, number>;
  return { total: ALL.length, byTrack };
}

/** Topics that have at least one problem in the catalog */
export function getActiveTopics(track: CodeTrackId): TopicMeta[] {
  const used = new Set(getCodeProblems(track).map((p) => p.topic));
  return getTopicsForTrack(track).filter((t) => used.has(t.id));
}

export function getTopicProblemCount(track: CodeTrackId, topicId: string): number {
  return getCodeProblems(track, topicId).length;
}

export function getSubtopicsInTopic(track: CodeTrackId, topicId: string): string[] {
  return [...new Set(getCodeProblems(track, topicId).map((p) => p.subtopic))].sort();
}

export function getTopicDifficultyBreakdown(track: CodeTrackId, topicId: string) {
  const problems = getCodeProblems(track, topicId);
  return {
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
    expert: problems.filter((p) => p.difficulty === "expert").length,
  };
}

export function getTopicConceptsCovered(track: CodeTrackId, topicId: string): string[] {
  const meta = getTopicMeta(track, topicId);
  const fromProblems = getCodeProblems(track, topicId).flatMap((p) => p.concepts);
  const combined = [...new Set([...(meta?.concepts ?? []), ...fromProblems])];
  return combined.slice(0, 12);
}

export function getFirstProblemInTopic(track: CodeTrackId, topicId: string): CodeProblem | undefined {
  return getCodeProblems(track, topicId)[0];
}

export function getAllSubtopics(track: CodeTrackId, topicId?: string): string[] {
  const problems = topicId ? getCodeProblems(track, topicId) : getCodeProblems(track);
  return [...new Set(problems.map((p) => p.subtopic))].sort();
}

export function getSubtopicLabel(track: CodeTrackId, topicId: string, subtopicId: string): string {
  return (
    getSubtopicsForTopic(track, topicId).find((s) => s.id === subtopicId)?.label ?? subtopicId
  );
}

export function getTopicLabel(track: CodeTrackId, topicId: string): string {
  return getTopicMeta(track, topicId)?.label ?? topicId;
}

/** @deprecated use getAllSubtopics(track, topicId) */
export function getAllSubtopicsLegacy(track: CodeTrackId): string[] {
  return getAllSubtopics(track);
}

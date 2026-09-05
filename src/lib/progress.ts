export const PROGRESS_STORAGE_KEY = "de-prep-hub-progress";

export function getCompletedSlugs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isTopicCompleted(slug: string): boolean {
  return getCompletedSlugs().includes(slug);
}

export function setTopicCompleted(slug: string, completed: boolean): void {
  const current = getCompletedSlugs();
  const updated = completed
    ? Array.from(new Set([...current, slug]))
    : current.filter((item) => item !== slug);

  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("progress-updated"));
}

export function getCompletedCount(totalTopics: number): number {
  const completed = getCompletedSlugs();
  return completed.filter((slug) => slug !== "roadmap").length;
}

/** Standalone practice product — separate from per-lab `/sql/practice` etc. */
export const PRACTICE_SECTION = {
  home: "/practice",
} as const;

export function isPracticeSectionRoute(pathname: string): boolean {
  return pathname === PRACTICE_SECTION.home || pathname.startsWith(`${PRACTICE_SECTION.home}/`);
}

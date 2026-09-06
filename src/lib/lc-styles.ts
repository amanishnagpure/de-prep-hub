/** LeetCode-style difficulty pill classes (Basic/Easy, Medium, Hard). */
export const LC_TIER_BADGE = {
  basic: "lc-badge lc-badge-easy",
  easy: "lc-badge lc-badge-easy",
  medium: "lc-badge lc-badge-medium",
  hard: "lc-badge lc-badge-hard",
} as const;

export type LcTierKey = keyof typeof LC_TIER_BADGE;

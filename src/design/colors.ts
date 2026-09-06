/**
 * District-by-Zomato inspired palette — dark canvas, vibrant category grading, glass surfaces.
 */

export const palette = {
  canvas: "#0A0812",
  canvasElevated: "#12101C",
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceElevated: "rgba(255, 255, 255, 0.10)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.72)",
  textMuted: "rgba(255, 255, 255, 0.48)",
  border: "rgba(255, 255, 255, 0.10)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  brand: "#A855F7",
  brandBlue: "#3B82F6",
  brandPink: "#EC4899",
  brandViolet: "#8B5CF6",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
} as const;

/** Category grading — District-style unique tint per vertical */
export const categoryColors = {
  sql: { hue: "#3B82F6", glow: "rgba(59, 130, 246, 0.35)", soft: "rgba(59, 130, 246, 0.12)" },
  python: { hue: "#F59E0B", glow: "rgba(245, 158, 11, 0.35)", soft: "rgba(245, 158, 11, 0.12)" },
  pyspark: { hue: "#F97316", glow: "rgba(249, 115, 22, 0.35)", soft: "rgba(249, 115, 22, 0.12)" },
  dsa: { hue: "#A855F7", glow: "rgba(168, 85, 247, 0.35)", soft: "rgba(168, 85, 247, 0.12)" },
  challenges: { hue: "#EC4899", glow: "rgba(236, 72, 153, 0.35)", soft: "rgba(236, 72, 153, 0.12)" },
  learn: { hue: "#6366F1", glow: "rgba(99, 102, 241, 0.35)", soft: "rgba(99, 102, 241, 0.12)" },
} as const;

/** Softer card tints for Practice / Challenges hubs — same families, lower contrast */
export const categoryCardTints = {
  sql: {
    accent: "#7A9DB8",
    soft: "rgba(122, 157, 184, 0.08)",
    bar: "rgba(122, 157, 184, 0.2)",
    progress: "#8AA8C0",
  },
  python: {
    accent: "#B8A070",
    soft: "rgba(184, 160, 112, 0.08)",
    bar: "rgba(184, 160, 112, 0.2)",
    progress: "#C4AE80",
  },
  pyspark: {
    accent: "#B89078",
    soft: "rgba(184, 144, 120, 0.08)",
    bar: "rgba(184, 144, 120, 0.2)",
    progress: "#C49E86",
  },
  dsa: {
    accent: "#9E92B8",
    soft: "rgba(158, 146, 184, 0.08)",
    bar: "rgba(158, 146, 184, 0.2)",
    progress: "#ACA2C4",
  },
  challenges: {
    accent: "#A88EA4",
    soft: "rgba(168, 142, 164, 0.08)",
    bar: "rgba(168, 142, 164, 0.2)",
    progress: "#B49AAA",
  },
  learn: {
    accent: "#888EB8",
    soft: "rgba(136, 142, 184, 0.08)",
    bar: "rgba(136, 142, 184, 0.2)",
    progress: "#989EC4",
  },
} as const;

export type CategoryColorKey = keyof typeof categoryColors;

export type CardTint = {
  accent: string;
  soft: string;
  bar: string;
  progress: string;
};

/** Smooth challenge-only palette — cool slate / sage / mauve family, separate from Practice */
export const challengeCardTints: Record<
  "etl" | "data-warehousing" | "cdc" | "data-quality" | "reliability" | "performance",
  CardTint
> = {
  etl: {
    accent: "#8EAEA2",
    soft: "rgba(142, 174, 162, 0.08)",
    bar: "rgba(142, 174, 162, 0.2)",
    progress: "#9EB8AE",
  },
  "data-warehousing": {
    accent: "#8499AD",
    soft: "rgba(132, 153, 173, 0.08)",
    bar: "rgba(132, 153, 173, 0.2)",
    progress: "#94A8BA",
  },
  cdc: {
    accent: "#9095B8",
    soft: "rgba(144, 149, 184, 0.08)",
    bar: "rgba(144, 149, 184, 0.2)",
    progress: "#9EA3C2",
  },
  "data-quality": {
    accent: "#A894AA",
    soft: "rgba(168, 148, 170, 0.08)",
    bar: "rgba(168, 148, 170, 0.2)",
    progress: "#B4A2B6",
  },
  reliability: {
    accent: "#949BA8",
    soft: "rgba(148, 155, 168, 0.08)",
    bar: "rgba(148, 155, 168, 0.2)",
    progress: "#A4ABB6",
  },
  performance: {
    accent: "#AD9988",
    soft: "rgba(173, 153, 136, 0.08)",
    bar: "rgba(173, 153, 136, 0.2)",
    progress: "#B8A696",
  },
};

export type ChallengeCardTintKey = keyof typeof challengeCardTints;

export const colorVars = {
  canvas: "var(--background)",
  brand: "var(--platform-brand)",
  brandBlue: "var(--platform-brand-blue)",
  foreground: "var(--foreground)",
  mutedForeground: "var(--muted-foreground)",
  border: "var(--border)",
} as const;

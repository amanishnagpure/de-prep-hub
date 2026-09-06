/** Design tokens — single source of truth for the premium platform UI (UI.1). */

export const platformIdentity = {
  name: "DE Workspace",
  tagline: "Practice like you work.",
  description: "Professional training and assessment for Data Engineers.",
} as const;

export const typography = {
  display: "var(--type-display)",
  pageTitle: "var(--type-page-title)",
  section: "var(--type-section)",
  body: "var(--type-body)",
  meta: "var(--type-meta)",
  code: "var(--type-code)",
} as const;

export const motion = {
  fast: "var(--motion-fast)",
  normal: "var(--motion-normal)",
  slow: "var(--motion-slow)",
  ease: "var(--motion-ease)",
} as const;

export const spacing = {
  page: "var(--space-page)",
  section: "var(--space-section)",
  stack: "var(--space-stack)",
} as const;

export const elevation = {
  none: "var(--elevation-none)",
  sm: "var(--elevation-sm)",
} as const;

/** Semantic verdict colors — map to CSS variables in globals.css */
export const semantic = {
  success: "var(--platform-success)",
  warning: "var(--platform-warning)",
  error: "var(--platform-error)",
  accent: "var(--platform-accent)",
} as const;

/** Central registry for topic labs (full app sections under /{slug}). */

export const TOPIC_LAB_SLUGS = [
  "sql",
  "python",
  "spark",
  "databricks",
  "airflow",
  "cloud",
  "system-design",
  "interview",
] as const;

export type TopicLabSlug = (typeof TOPIC_LAB_SLUGS)[number];

export const TOPIC_LAB_HREFS: Record<TopicLabSlug, string> = {
  sql: "/sql",
  python: "/python",
  spark: "/spark",
  databricks: "/databricks",
  airflow: "/airflow",
  cloud: "/cloud",
  "system-design": "/system-design",
  interview: "/interview-prep",
};

export function getTopicLabHref(slug: string): string | null {
  if (slug in TOPIC_LAB_HREFS) {
    return TOPIC_LAB_HREFS[slug as TopicLabSlug];
  }
  return null;
}

export function isTopicLabPath(pathname: string): boolean {
  return Object.values(TOPIC_LAB_HREFS).some(
    (href) => pathname === href || pathname.startsWith(`${href}/`)
  );
}

export function isTopicLabActive(slug: string, pathname: string): boolean {
  const href = getTopicLabHref(slug);
  if (!href) return pathname === `/topics/${slug}`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isTopicLabSlug(slug: string): slug is TopicLabSlug {
  return slug in TOPIC_LAB_HREFS;
}

/** Resolve module card hrefs (e.g. spark-notes → /spark/notes). */
export function getTopicModuleHref(moduleSlug: string, parentSlug?: string): string {
  if (!parentSlug) return `/topics/${moduleSlug}`;

  const labHref = getTopicLabHref(parentSlug);
  if (!labHref) return `/topics/${moduleSlug}`;

  if (parentSlug === "sql") {
    if (moduleSlug === "sql-leetcode") return "/sql/leetcode";
    if (moduleSlug === "sql-mock") return "/sql/mock";
  }
  if (parentSlug === "python" && moduleSlug === "python-coding") {
    return "/python/coding";
  }
  if (moduleSlug.endsWith("-notes")) return `${labHref}/notes`;
  if (moduleSlug.endsWith("-practice")) return `${labHref}/practice`;
  if (moduleSlug.endsWith("-mock")) return `${labHref}/mock`;
  if (moduleSlug.endsWith("-interview") || moduleSlug.endsWith("-flashcards")) {
    return `${labHref}/interview`;
  }

  return labHref;
}

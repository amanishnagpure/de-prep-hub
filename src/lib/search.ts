import Fuse from "fuse.js";
import type { SearchItem } from "@/lib/content";
import { TOPIC_LAB_HREFS } from "@/lib/topic-labs";

export function createSearchIndex(items: SearchItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "description", weight: 0.3 },
      { name: "content", weight: 0.3 },
    ],
    threshold: 0.4,
    includeScore: true,
  });
}

const SEARCH_HREFS: Record<string, string> = {
  sql: "/sql",
  "sql-notes": "/sql/notes",
  "sql-practice": "/sql/practice",
  "sql-interview": "/sql/interview",
  "sql-leetcode": "/sql/leetcode",
  "sql-mock": "/sql/mock",
  python: "/python",
  "python-notes": "/python/notes",
  "python-practice": "/python/practice",
  "python-interview": "/python/interview",
  "python-coding": "/python/coding",
  spark: "/spark",
  "spark-notes": "/spark/notes",
  "spark-practice": "/spark/practice",
  "spark-interview": "/spark/interview",
  "spark-mock": "/spark/mock",
  databricks: "/databricks",
  "databricks-notes": "/databricks/notes",
  "databricks-practice": "/databricks/practice",
  "databricks-interview": "/databricks/interview",
  airflow: "/airflow",
  "airflow-notes": "/airflow/notes",
  "airflow-practice": "/airflow/practice",
  "airflow-interview": "/airflow/interview",
  cloud: "/cloud",
  "cloud-notes": "/cloud/notes",
  "cloud-practice": "/cloud/practice",
  "cloud-interview": "/cloud/interview",
  "system-design": "/system-design",
  "system-design-notes": "/system-design/notes",
  "system-design-practice": "/system-design/practice",
  "system-design-interview": "/system-design/interview",
  interview: "/interview-prep",
  "interview-notes": "/interview-prep/notes",
  "interview-practice": "/interview-prep/practice",
  "interview-flashcards": "/interview-prep/interview",
};

export function getSearchHref(item: SearchItem): string {
  if (item.type === "roadmap") return "/roadmap";
  if (SEARCH_HREFS[item.slug]) return SEARCH_HREFS[item.slug];
  const labHref = TOPIC_LAB_HREFS[item.slug as keyof typeof TOPIC_LAB_HREFS];
  if (labHref) return labHref;
  return `/topics/${item.slug}`;
}

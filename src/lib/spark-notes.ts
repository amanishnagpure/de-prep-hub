import { slugifyHeading } from "@/lib/markdown-utils";
import type { SqlNotesChapter } from "@/lib/sql-notes";

const SPARK_CHAPTER_TITLES = new Set(["Basic", "Medium", "Advance"]);

/** Split only on top-level Basic / Medium / Advance — not inner ## headings inside topics. */
export function splitSparkNotesChapters(content: string): SqlNotesChapter[] {
  const introEnd = content.search(/^## /m);
  const body = introEnd >= 0 ? content.slice(introEnd) : content;
  const chapterRegex = /^## (.+)$/gm;
  const matches: { title: string; index: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = chapterRegex.exec(body)) !== null) {
    const title = match[1].trim();
    if (SPARK_CHAPTER_TITLES.has(title)) {
      matches.push({ title, index: match.index });
    }
  }

  return matches.map((item, index) => {
    const start = item.index;
    const end = matches[index + 1]?.index ?? body.length;
    const slice = body.slice(start, end).trim();
    const words = slice.split(/\s+/).length;

    return {
      id: slugifyHeading(item.title),
      title: item.title,
      content: slice,
      readMinutes: Math.max(1, Math.ceil(words / 200)),
    };
  });
}

export type { SqlNotesChapter as SparkNotesChapter };

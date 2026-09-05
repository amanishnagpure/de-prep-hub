import { slugifyHeading } from "@/lib/markdown-utils";

export interface SqlNotesChapter {
  id: string;
  title: string;
  content: string;
  readMinutes: number;
}

export function splitNotesChapters(content: string): SqlNotesChapter[] {
  const introEnd = content.search(/^## /m);
  const body = introEnd >= 0 ? content.slice(introEnd) : content;
  const chapterRegex = /^## (.+)$/gm;
  const matches: { title: string; index: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = chapterRegex.exec(body)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index });
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

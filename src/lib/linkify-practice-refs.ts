export interface PracticeLinkTarget {
  practicePath: string;
  practiceTitles: Record<number, string>;
  interviewPath?: string;
  interviewTitles?: Record<number, string>;
}

export interface PracticeLinkConfig extends PracticeLinkTarget {
  labs?: Record<string, PracticeLinkTarget>;
  starDrillPath?: string;
  starDrillTitles?: Record<number, string>;
}

const CROSS_LAB_ALIASES: Record<string, string> = {
  sql: "sql",
  python: "python",
  spark: "spark",
  databricks: "databricks",
  cloud: "cloud",
  airflow: "airflow",
  "system design": "system-design",
};

function escapeMd(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function mdLink(text: string, href: string): string {
  return `[${escapeMd(text)}](${href})`;
}

function practiceLink(target: PracticeLinkTarget, id: number): string {
  const title = target.practiceTitles[id];
  return mdLink(title ?? `Practice #${id}`, `${target.practicePath}?id=${id}`);
}

function interviewLink(target: PracticeLinkTarget, id: number): string {
  const title = target.interviewTitles?.[id];
  const path = target.interviewPath ?? target.practicePath;
  return mdLink(title ?? `Interview #${id}`, `${path}?id=${id}`);
}

function linkCrossLabSegment(segment: string, config: PracticeLinkConfig): string | null {
  const match = segment.match(/^(\w+(?:\s+\w+)?)\s+Practice\s+#(\d+)(?:[–-]#?(\d+))?$/i);
  if (!match) return null;

  const labKey = CROSS_LAB_ALIASES[match[1].toLowerCase()];
  const labTarget = labKey ? config.labs?.[labKey] : undefined;
  if (!labTarget) return null;

  const start = Number(match[2]);
  const end = match[3] ? Number(match[3]) : start;
  const links: string[] = [];

  for (let id = start; id <= end; id++) {
    links.push(practiceLink(labTarget, id));
  }

  return links.join(", ");
}

function linkSegment(segment: string, config: PracticeLinkConfig, refType: "practice" | "interview"): {
  linked: string;
  refType: "practice" | "interview";
} {
  const trimmed = segment.trim();
  if (!trimmed) return { linked: trimmed, refType };

  if (trimmed.toLowerCase() === "case study prep") {
    return { linked: trimmed, refType };
  }

  const starMatch = trimmed.match(/^STAR Drill #(\d+)$/i);
  if (starMatch && config.starDrillPath) {
    const id = Number(starMatch[1]);
    const title = config.starDrillTitles?.[id] ?? `STAR Drill #${id}`;
    return {
      linked: mdLink(title, `${config.starDrillPath}?id=${id}`),
      refType,
    };
  }

  const crossLab = linkCrossLabSegment(trimmed, config);
  if (crossLab) {
    return { linked: crossLab, refType: "practice" };
  }

  const interviewMatch = trimmed.match(/^Interview\s+#(\d+)$/i);
  if (interviewMatch) {
    return {
      linked: interviewLink(config, Number(interviewMatch[1])),
      refType: "interview",
    };
  }

  const practiceMatch = trimmed.match(/^Practice\s+#(\d+)$/i);
  if (practiceMatch) {
    return {
      linked: practiceLink(config, Number(practiceMatch[1])),
      refType: "practice",
    };
  }

  const shorthandMatch = trimmed.match(/^#(\d+)$/);
  if (shorthandMatch) {
    const id = Number(shorthandMatch[1]);
    if (refType === "interview") {
      return { linked: interviewLink(config, id), refType };
    }
    return { linked: practiceLink(config, id), refType: "practice" };
  }

  return { linked: trimmed, refType };
}

export function linkifyPracticeRefs(content: string, config: PracticeLinkConfig): string {
  return content.replace(/^\*\*Practice:\*\* (.+)$/gm, (_, refsLine: string) => {
    const parts = refsLine.split(/\s*,\s*/);
    let refType: "practice" | "interview" = "practice";
    const linked = parts.map((part) => {
      const result = linkSegment(part, config, refType);
      refType = result.refType;
      return result.linked;
    });

    return `**Practice:** ${linked.join(", ")}`;
  });
}

export function withPracticeLinks<T extends { content: string }>(
  chapters: T[],
  config: PracticeLinkConfig
): T[] {
  return chapters.map((chapter) => ({
    ...chapter,
    content: linkifyPracticeRefs(chapter.content, config),
  }));
}

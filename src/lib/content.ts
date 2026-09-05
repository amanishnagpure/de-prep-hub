import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");
const topicsDirectory = path.join(contentDirectory, "topics");

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  parent?: string;
  hidden?: boolean;
  difficulty?: "basic" | "medium" | "advance" | "interview" | "patterns" | "engineering" | "traps" | "practice";
}

export interface Topic extends TopicMeta {
  content: string;
}

export interface Roadmap {
  title: string;
  description: string;
  content: string;
}

export interface SearchItem extends TopicMeta {
  content: string;
  type: "topic" | "roadmap";
}

function getTopicSlugs(): string[] {
  return fs
    .readdirSync(topicsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function parseTopicMeta(slug: string, data: Record<string, unknown>): TopicMeta {
  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    order: data.order as number,
    parent: data.parent as string | undefined,
    hidden: Boolean(data.hidden),
    difficulty: data.difficulty as TopicMeta["difficulty"] | undefined,
  };
}

function readTopicFile(slug: string): Topic | null {
  try {
    const filePath = path.join(topicsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      ...parseTopicMeta(slug, data),
      content,
    };
  } catch {
    return null;
  }
}

export function getAllTopics(options?: { includeHidden?: boolean }): TopicMeta[] {
  const includeHidden = options?.includeHidden ?? false;

  const topics = getTopicSlugs()
    .map((slug) => {
      const filePath = path.join(topicsDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);
      return parseTopicMeta(slug, data);
    })
    .filter((topic) => includeHidden || !topic.hidden);

  return topics.sort((a, b) => a.order - b.order);
}

export function getSubtopics(parentSlug: string): TopicMeta[] {
  return getAllTopics({ includeHidden: true })
    .filter((topic) => topic.parent === parentSlug)
    .sort((a, b) => a.order - b.order);
}

export function getTopicBySlug(slug: string): Topic | null {
  return readTopicFile(slug);
}

export function getRoadmap(): Roadmap {
  const filePath = path.join(contentDirectory, "roadmap.md");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: data.title as string,
    description: data.description as string,
    content,
  };
}

export function getTopicNavigation(slug: string): {
  prev: TopicMeta | null;
  next: TopicMeta | null;
} {
  const topic = readTopicFile(slug);
  if (!topic) return { prev: null, next: null };

  const mainTopics = getAllTopics();
  const allTopics = getAllTopics({ includeHidden: true });

  if (topic.parent) {
    const siblings = getSubtopics(topic.parent);
    const index = siblings.findIndex((item) => item.slug === slug);
    const parent = allTopics.find((item) => item.slug === topic.parent) ?? null;
    const nextMainTopic = () => {
      const parentIndex = mainTopics.findIndex((item) => item.slug === topic.parent);
      return parentIndex >= 0 ? mainTopics[parentIndex + 1] ?? null : null;
    };

    if (index === 0) {
      return {
        prev: parent,
        next: siblings[1] ?? nextMainTopic(),
      };
    }

    if (index === siblings.length - 1) {
      return {
        prev: siblings[index - 1],
        next: nextMainTopic(),
      };
    }

    return {
      prev: siblings[index - 1],
      next: siblings[index + 1],
    };
  }

  const subtopics = getSubtopics(slug);
  if (subtopics.length > 0) {
    const mainIndex = mainTopics.findIndex((item) => item.slug === slug);

    return {
      prev: mainIndex > 0 ? mainTopics[mainIndex - 1] : null,
      next: subtopics[0],
    };
  }

  return getAdjacentTopics(slug);
}

export function getAdjacentTopics(slug: string): {
  prev: TopicMeta | null;
  next: TopicMeta | null;
} {
  const topics = getAllTopics();
  const index = topics.findIndex((topic) => topic.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? topics[index - 1] : null,
    next: index < topics.length - 1 ? topics[index + 1] : null,
  };
}

export function getAllTopicSlugs(): string[] {
  return getTopicSlugs();
}

import { TOPIC_LAB_SLUGS } from "@/lib/topic-labs";

const LAB_PARENTS = new Set<string>(TOPIC_LAB_SLUGS);

export function getSearchIndex(): SearchItem[] {
  const topics = getAllTopics({ includeHidden: true })
    .filter((topic) => !topic.hidden || (topic.parent && LAB_PARENTS.has(topic.parent)))
    .map((topic) => {
      const full = getTopicBySlug(topic.slug)!;
      return {
        ...topic,
        content: full.content,
        type: "topic" as const,
      };
    });

  const roadmap = getRoadmap();

  const sqlLabExtras: SearchItem[] = [
    {
      slug: "sql-leetcode",
      title: "LeetCode SQL Top 50",
      description: "Curated LC problems",
      order: 1.2,
      content: "leetcode sql top 50 window functions join rank dense_rank",
      type: "topic",
    },
    {
      slug: "sql-mock",
      title: "SQL Mock Interview",
      description: "45-minute session",
      order: 1.3,
      content: "mock interview timed conceptual coding leetcode practice",
      type: "topic",
    },
  ];

  const pythonLabExtras: SearchItem[] = [
    {
      slug: "python-coding",
      title: "Python Coding Track",
      description: "15 curated LC-style problems",
      order: 2.2,
      content: "leetcode python array hashmap sliding window two pointer",
      type: "topic",
    },
  ];

  return [
    {
      slug: "roadmap",
      title: roadmap.title,
      description: roadmap.description,
      order: 0,
      content: roadmap.content,
      type: "roadmap",
    },
    ...topics,
    ...sqlLabExtras,
    ...pythonLabExtras,
  ];
}

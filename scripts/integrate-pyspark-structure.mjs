#!/usr/bin/env node
/**
 * Builds spark-notes.md (Basic/Medium/Advance) and spark-interview.md (100 Q)
 * from content/sources/pyspark-notes-100.md and pyspark-interview-100.md
 *
 * Run:
 *   node scripts/extract-pyspark-from-transcript.mjs  # if sources missing
 *   node scripts/integrate-pyspark-structure.mjs
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const notesSource = path.join(root, "content/sources/pyspark-notes-100.md");
const interviewSource = path.join(root, "content/sources/pyspark-interview-100.md");
const notesOut = path.join(root, "content/topics/spark-notes.md");
const interviewOut = path.join(root, "content/topics/spark-interview.md");

const NOTE_CHAPTERS = [
  { id: "basic", title: "Basic", range: [1, 35], emoji: "🟢", part: "PART 1 — PySpark BASIC" },
  { id: "medium", title: "Medium", range: [36, 70], emoji: "🟡", part: "PART 2 — PySpark MEDIUM" },
  { id: "advance", title: "Advance", range: [71, 100], emoji: "🔴", part: "PART 3 — PySpark ADVANCED" },
];

function parseNumberedTopics(markdown) {
  const parts = markdown.split(/^#{1,2} (\d+)\.\s+/m);
  const topics = new Map();

  for (let i = 1; i < parts.length; i += 2) {
    const id = Number(parts[i]);
    const rest = parts[i + 1] ?? "";
    const newline = rest.indexOf("\n");
    const title = (newline >= 0 ? rest.slice(0, newline) : rest).trim();
    const body = (newline >= 0 ? rest.slice(newline + 1) : "").trim();
    if (id && title) topics.set(id, { id, title, body });
  }

  return topics;
}

function formatTopicBody(body) {
  let formatted = body;

  // Strip part summaries / checkpoint / "next part" blocks appended after last topic in a part
  formatted = formatted.replace(/\n#\s*🧠[\s\S]*$/m, "");
  formatted = formatted.replace(/\n#\s*🎯[\s\S]*$/m, "");
  formatted = formatted.replace(/\n##\s*Next:[\s\S]*$/m, "");
  formatted = formatted.replace(/\n#\s*🟡\s*PART[\s\S]*$/m, "");
  formatted = formatted.replace(/\n#\s*🔴\s*PART[\s\S]*$/m, "");
  formatted = formatted.replace(/\n##\s*Topics\s+\d+[\s\S]*$/m, "");
  formatted = formatted.replace(/\n#\s*🔥[\s\S]*$/m, "");

  // Inner ## headings must not become chapter boundaries — demote to h3
  formatted = formatted.replace(/^## /gm, "### ");

  // Numbered ### inside a topic body are sub-sections, not topic tiles
  formatted = formatted.replace(/^### (\d+)\.\s+(.+)$/gm, (_, n, title) => `\n**${n}. ${title}:**\n`);

  // Normalize remaining ### section headings
  formatted = formatted.replace(/^###\s+(.+)$/gm, (_, heading) => {
    const clean = heading.replace(/^🎯\s*/, "").trim();
    if (/^interview[- ]?ready answer$/i.test(clean) || /^interview answer$/i.test(clean)) {
      return "\n**Interview-ready answer:**\n";
    }
    return `\n**${clean}:**\n`;
  });

  // Blockquote interview answers → bold
  formatted = formatted.replace(/^>\s?\*\*(.+?)\*\*\s*$/gm, "**$1**");
  formatted = formatted.replace(/^>\s?(.+)$/gm, "> $1");

  // Remove part/section dividers and checkpoint blocks at end of chapters
  formatted = formatted.replace(/^---\s*$/gm, "");
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
  return formatted;
}

function buildTopicTile(topic) {
  const body = formatTopicBody(topic.body);
  return [`### ${topic.id}. ${topic.title}`, "", body, ""].join("\n");
}

function buildNotesMarkdown(topics) {
  const frontmatter = `---
title: PySpark Notes
description: 100 in-depth PySpark topics — Basic, Medium, and Advance
parent: spark
hidden: true
order: 1
difficulty: basic
---

`;

  const chapters = NOTE_CHAPTERS.map((chapter) => {
    const [start, end] = chapter.range;
    const items = [];
    for (let id = start; id <= end; id++) {
      const topic = topics.get(id);
      if (topic) items.push(topic);
    }

    const lines = [
      `## ${chapter.title}`,
      "",
      `> **${chapter.emoji} ${chapter.part}** — Topics ${start}–${end} (${items.length} topics). Each topic covers what it is, why it's used, examples, production perspective, and an interview-ready answer.`,
      "",
      ...items.map((item) => buildTopicTile(item)),
    ];

    return lines.join("\n");
  });

  return frontmatter + chapters.join("\n");
}

function extractInterviewAnswer(body) {
  const patterns = [
    /###\s*🎯\s*Interview(?:-ready)?\s+[Aa]nswer\s*\n+([\s\S]*?)(?=\n###\s|\n##\s|\n#\s\d+\.|$)/i,
    /###\s*🎯\s*Interview-ready answer\s*\n+([\s\S]*?)(?=\n###\s|\n##\s|\n#\s\d+\.|$)/i,
    /\*\*Interview-ready answer:\*\*\s*\n+([\s\S]*?)(?=\n###\s|\n##\s|\n#\s\d+\.|$)/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      let answer = match[1].trim();
      answer = answer.replace(/^>\s?/gm, "").trim();
      answer = answer.replace(/\*\*/g, "");
      if (answer) return answer;
    }
  }

  return null;
}

function formatInterviewDetails(body) {
  let formatted = body;

  // Remove primary interview answer block (shown on flip)
  formatted = formatted.replace(
    /###\s*🎯\s*Interview(?:-ready)?\s+[Aa]nswer[\s\S]*?(?=\n###\s|\n##\s|\n#\s\d+\.|$)/i,
    ""
  );

  formatted = formatted.replace(/^###\s+(.+)$/gm, (_, heading) => {
    const clean = heading.replace(/^🎯\s*|^💡\s*|^🔧\s*|^⚠️\s*/u, "").trim();
    return `\n**${clean}:**\n`;
  });

  formatted = formatted.replace(/^---\s*$/gm, "");
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
  return formatted;
}

function parseInterviewTopics(markdown) {
  const parts = markdown.split(/^#{1,2} (\d+)\.\s+/m);
  const byId = new Map();

  for (let i = 1; i < parts.length; i += 2) {
    const id = Number(parts[i]);
    const rest = parts[i + 1] ?? "";
    const newline = rest.indexOf("\n");
    const title = (newline >= 0 ? rest.slice(0, newline) : rest).trim();
    const body = (newline >= 0 ? rest.slice(newline + 1) : "").trim();
    if (id && title) byId.set(id, { id, title, body });
  }

  return [...byId.values()].sort((a, b) => a.id - b.id);
}

function buildInterviewMarkdown(topics) {
  const frontmatter = `---
title: PySpark Interview Questions
description: 100 interview-ready PySpark answers for Data Engineering interviews
parent: spark
hidden: true
order: 3
difficulty: interview
---

# PySpark Interview Questions

> **100 questions** — speak-ready answers with explanations, code, and common traps.

`;

  const tiles = topics.map((topic) => {
    const shortAnswer = extractInterviewAnswer(topic.body);
    const details = formatInterviewDetails(topic.body);

    const lines = [`### ${topic.id}. ${topic.title}`, ""];

    if (shortAnswer) {
      lines.push(`**🎯 Interview answer:** ${shortAnswer}`, "");
    }

    if (details) {
      lines.push(details, "");
    }

    return lines.join("\n");
  });

  return frontmatter + tiles.join("\n");
}

function main() {
  if (!fs.existsSync(notesSource) || !fs.existsSync(interviewSource)) {
    console.error("Source files missing. Run: node scripts/extract-pyspark-from-transcript.mjs");
    process.exit(1);
  }

  const notesMarkdown = fs.readFileSync(notesSource, "utf8");
  const interviewMarkdown = fs.readFileSync(interviewSource, "utf8");

  const noteTopics = parseNumberedTopics(notesMarkdown);
  const interviewTopics = parseInterviewTopics(interviewMarkdown);

  const notes = buildNotesMarkdown(noteTopics);
  const interview = buildInterviewMarkdown(interviewTopics);

  fs.writeFileSync(notesOut, notes);
  fs.writeFileSync(interviewOut, interview);

  console.log("Integrated PySpark structure:");
  console.log("  note topics parsed:", noteTopics.size);
  console.log("  interview questions:", interviewTopics.length);
  console.log("  →", notesOut);
  console.log("  →", interviewOut);
}

main();

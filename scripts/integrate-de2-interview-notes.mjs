#!/usr/bin/env node
/**
 * Integrates DE2 100-question PySpark + Databricks interview sheet into notes.
 * Source: content/sources/de2-pyspark-databricks-100.md
 * Run: node scripts/integrate-de2-interview-notes.mjs
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const sourcePath = path.join(root, "content/sources/de2-pyspark-databricks-100.md");

const SPARK_RANGES = [
  { title: "DE2 Interview — Spark Architecture", ids: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] },
  { title: "DE2 Interview — Transformations & Execution", ids: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33] },
  { title: "DE2 Interview — Partitioning & Shuffle", ids: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46] },
  { title: "DE2 Interview — Joins & Data Skew", ids: [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65] },
  { title: "DE2 Interview — Spark Optimization", ids: [66, 67, 68, 69, 70, 71, 72, 73, 74, 75] },
];

const DATABRICKS_RANGES = [
  { title: "DE2 Interview — Databricks Fundamentals", ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { title: "DE2 Interview — Photon & Delta Lake", ids: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90] },
  { title: "DE2 Interview — Delta Management", ids: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100] },
];

function parseQuestions(markdown) {
  const parts = markdown.split(/^## (\d+)\.\s+/m);
  const questions = new Map();

  for (let i = 1; i < parts.length; i += 2) {
    const id = Number(parts[i]);
    const rest = parts[i + 1] ?? "";
    const newline = rest.indexOf("\n");
    const title = (newline >= 0 ? rest.slice(0, newline) : rest).trim();
    const body = (newline >= 0 ? rest.slice(newline + 1) : "").trim();
    if (id && title) {
      questions.set(id, { id, title, body });
    }
  }

  return questions;
}

function extractInterviewAnswer(body) {
  const match = body.match(
    /###\s*🎯\s*Interview-ready answer\s*\n+([\s\S]*?)(?=\n###\s|\n---\s*$|$)/i
  );
  if (!match) return null;

  let answer = match[1].trim();
  answer = answer.replace(/^>\s?/gm, "").trim();
  answer = answer.replace(/\n{3,}/g, "\n\n");
  return answer;
}

function formatBody(body) {
  let formatted = body;

  // Remove interview-ready block (already in **Answer:**)
  formatted = formatted.replace(
    /###\s*🎯\s*Interview-ready answer[\s\S]*?(?=\n###\s|\n---\s*$|$)/gi,
    ""
  );
  formatted = formatted.replace(
    /\*\*Interview-ready answer:\*\*[\s\S]*?(?=\n\*\*[^*]|\n---\s*$|$)/gi,
    ""
  );

  formatted = formatted.replace(/^###\s+(.+)$/gm, (_, heading) => {
    const clean = heading.replace(/^🎯\s*/, "").trim();
    if (/^interview-ready answer$/i.test(clean)) return "";
    return `\n**${clean}:**\n`;
  });

  formatted = formatted.replace(/^---\s*$/gm, "");
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
  return formatted;
}

function buildQuestionTile(item, localNum) {
  const answer = extractInterviewAnswer(item.body) ?? "See detailed sections below.";
  const details = formatBody(item.body);

  const lines = [
    `### ${localNum}. ${item.title}`,
    "",
    `**Interview question:** ${item.title}`,
    "",
    `**Answer:**`,
    "",
    answer,
    "",
  ];

  if (details) {
    lines.push(details, "");
  }

  lines.push(`**Source:** DE2 Interview Sheet — Q${item.id}`, "");

  return lines.join("\n");
}

function buildChapter(chapterDef, questions) {
  const items = chapterDef.ids.map((id) => questions.get(id)).filter(Boolean);
  return [
    `## ${chapterDef.title}`,
    "",
    `> **${items.length} questions** — numbered 1–${items.length} in this chapter. DE2 PySpark + Databricks theory.`,
    "",
    ...items.map((item, i) => buildQuestionTile(item, i + 1)),
  ].join("\n");
}

function stripInterviewSections(content) {
  content = content.replace(/,### /g, "\n### ");
  content = content.replace(/(\n---\s*){2,}/g, "\n---\n");
  for (const marker of ["\n## Interview Guide", "\n## DE2 Interview"]) {
    const start = content.indexOf(marker);
    if (start >= 0) return content.slice(0, start).trimEnd();
  }
  return content.trimEnd();
}

function applyDe2Chapters(filePath, chapterDefs, questions) {
  const base = stripInterviewSections(fs.readFileSync(filePath, "utf8"));
  const body = chapterDefs.map((def) => buildChapter(def, questions)).join("\n\n---\n\n");
  fs.writeFileSync(filePath, `${base}\n\n---\n\n${body}\n`);
}

if (!fs.existsSync(sourcePath)) {
  console.error(`Missing source: ${sourcePath}`);
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, "utf8");
const questions = parseQuestions(source);

if (questions.size < 100) {
  console.warn(`Warning: parsed ${questions.size} questions (expected 100)`);
}

applyDe2Chapters(path.join(root, "content/topics/spark-notes.md"), SPARK_RANGES, questions);
applyDe2Chapters(path.join(root, "content/topics/databricks-notes.md"), DATABRICKS_RANGES, questions);

const sparkTotal = SPARK_RANGES.reduce((n, c) => n + c.ids.length, 0);
const dbxTotal = DATABRICKS_RANGES.reduce((n, c) => n + c.ids.length, 0);

console.log("Integrated DE2 interview notes:");
console.log(`  spark: ${SPARK_RANGES.length} chapters, ${sparkTotal} questions`);
SPARK_RANGES.forEach((c) => console.log(`    - ${c.title} (${c.ids.length})`));
console.log(`  databricks: ${DATABRICKS_RANGES.length} chapters, ${dbxTotal} questions`);
DATABRICKS_RANGES.forEach((c) => console.log(`    - ${c.title} (${c.ids.length})`));

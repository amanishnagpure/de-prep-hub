#!/usr/bin/env node
/**
 * Integrates interview guide Q&A from Data_Engineering_Interview_Guide.html
 * into spark, databricks, sql, and cloud notes — detailed answers per tile.
 * Run: node scripts/integrate-interview-guide-notes.mjs
 */
import fs from "fs";
import path from "path";
import {
  buildRichBlock,
  enrichmentKey,
} from "./lib/interview-guide-format.mjs";

const root = path.join(import.meta.dirname, "..");
const htmlPath = path.join(root, "Data_Engineering_Interview_Guide.html");

/** @type {Record<string, object>} */
let manualEnrichments = {};
const enrichPath = path.join(import.meta.dirname, "data/interview-guide-enrichments.mjs");
if (fs.existsSync(enrichPath)) {
  manualEnrichments = (await import(enrichPath)).default ?? {};
}

function loadGuideData() {
  const html = fs.readFileSync(htmlPath, "utf8");
  const m = html.match(/const DATA = (\[[\s\S]*?\]);/);
  if (!m) throw new Error("DATA not found in HTML guide");
  return eval(m[1]);
}

function loadSectionItems(sectionName, sectionKey) {
  const section = loadGuideData().find((s) => s.name === sectionName);
  if (!section) throw new Error(`Section not found: ${sectionName}`);
  return section.items.map((item, i) => ({
    id: i + 1,
    source: sectionName,
    section: sectionKey,
    q: item.q.trim(),
    a_html: item.a_html,
  }));
}

function loadSparkDatabricksItems() {
  const section = loadGuideData().find((s) => /spark|databricks/i.test(s.name));
  return section.items.map((item, i) => ({
    id: i + 1,
    source: "Databricks / Spark",
    section: SPARK_IDS.has(i + 1) ? "spark" : "dbx",
    q: item.q.trim(),
    a_html: item.a_html,
  }));
}

const SPARK_IDS = new Set([
  15, 16, 17, 18, 21, 22, 25, 26, 27, 28, 29, 30, 31, 32, 45, 47, 53, 54, 63, 67, 80, 83, 84,
  85, 86, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 122,
]);

const SPARK_CHAPTERS = [
  { title: "Interview Guide — PySpark Basics", ids: [15, 16, 31, 32, 45, 63, 84, 85, 104, 105, 106, 122] },
  { title: "Interview Guide — Spark Core & Performance", ids: [18, 21, 22, 25, 26, 27, 28, 29, 30, 47, 53, 54, 67, 80, 83] },
  { title: "Interview Guide — PySpark Scenarios", ids: [17, 86, 97, 98, 99, 100, 101, 102, 103] },
];

const DATABRICKS_CHAPTERS = [
  { title: "Interview Guide — Connectivity & ADF", ids: [1, 2, 3, 33, 82, 91, 92, 93, 94, 95, 96, 117] },
  {
    title: "Interview Guide — Delta Lake Q&A",
    ids: [4, 5, 6, 9, 10, 11, 12, 13, 14, 19, 20, 34, 35, 36, 37, 43, 44, 46, 51, 55, 56, 64, 65, 66, 74, 75, 76, 113, 114, 115, 116, 119, 120, 121],
  },
  { title: "Interview Guide — Clusters & Compute", ids: [7, 8, 23, 24, 38, 39, 40, 41, 42, 48, 49, 50, 52, 57, 58, 59, 87, 88, 89, 90, 118] },
  { title: "Interview Guide — Lakehouse & Governance", ids: [60, 61, 62, 68, 69, 70, 71, 72, 73, 77, 78, 79, 81] },
  { title: "Interview Guide — Data Modeling Q&A", ids: [107, 108, 109, 110, 111, 112] },
];

function getEnrichment(item) {
  return manualEnrichments[enrichmentKey(item.section, item.id)] ?? {};
}

function block(item, localNum) {
  return buildRichBlock({
    item,
    localNum,
    section: item.section,
    enrichment: getEnrichment(item),
  });
}

function buildChapterFromItems(chapterDef) {
  const items = chapterDef.items ?? [];
  return [
    `## ${chapterDef.title}`,
    "",
    `> **${items.length} questions** — numbered 1–${items.length} in this plate. From *DE Interview Guide*.`,
    "",
    ...items.map((item, i) => block(item, i + 1)),
  ].join("\n");
}

function buildChapter(chapterDef, itemMap) {
  const items = chapterDef.ids.map((id) => itemMap.get(id)).filter(Boolean);
  return buildChapterFromItems({ title: chapterDef.title, items });
}

function chunkIntoPlates(items, plateSize, titleBase) {
  if (items.length <= plateSize) return [{ title: titleBase, items }];
  const plates = [];
  for (let i = 0; i < items.length; i += plateSize) {
    const chunk = items.slice(i, i + plateSize);
    plates.push({ title: `${titleBase} — Plate ${Math.floor(i / plateSize) + 1}`, items: chunk });
  }
  return plates;
}

function buildAllChapters(chapterDefs, itemMap) {
  return chapterDefs.map((def) => buildChapter(def, itemMap)).join("\n\n---\n\n");
}

function stripInterviewGuideSections(content) {
  content = content.replace(/,### /g, "\n### ");
  const marker = "\n## Interview Guide";
  const start = content.indexOf(marker);
  return start >= 0 ? content.slice(0, start).trimEnd() : content.trimEnd();
}

function applyChapters(filePath, chapterDefs, itemMap) {
  const base = stripInterviewGuideSections(fs.readFileSync(filePath, "utf8"));
  fs.writeFileSync(filePath, `${base}\n\n---\n\n${buildAllChapters(chapterDefs, itemMap)}\n`);
}

function applyItemChapters(filePath, chapterDefs) {
  const base = stripInterviewGuideSections(fs.readFileSync(filePath, "utf8"));
  const body = chapterDefs.map((def) => buildChapterFromItems(def)).join("\n\n---\n\n");
  fs.writeFileSync(filePath, `${base}\n\n---\n\n${body}\n`);
}

const sparkDbxItems = loadSparkDatabricksItems();
const itemMap = new Map(sparkDbxItems.map((i) => [i.id, i]));

// Spark/Databricks: use integrate-de2-interview-notes.mjs instead
// applyChapters(path.join(root, "content/topics/spark-notes.md"), SPARK_CHAPTERS, itemMap);
// applyChapters(path.join(root, "content/topics/databricks-notes.md"), DATABRICKS_CHAPTERS, itemMap);

const sqlItems = loadSectionItems("SQL", "sql");
const sqlPlates = chunkIntoPlates(sqlItems, 18, "Interview Guide — SQL");
applyItemChapters(path.join(root, "content/topics/sql-notes.md"), sqlPlates);

const adfItems = loadSectionItems("Azure Data Factory (ADF)", "adf");
const adfPlates = chunkIntoPlates(adfItems, 18, "Interview Guide — Azure ADF");
applyItemChapters(path.join(root, "content/topics/cloud-notes.md"), adfPlates);

console.log("Integrated interview guide (detailed Q&A):");
console.log(`  spark: skipped (DE2 sheet via integrate-de2-interview-notes.mjs)`);
console.log(`  databricks: skipped (DE2 sheet via integrate-de2-interview-notes.mjs)`);
console.log(`  sql: ${sqlPlates.length} plates, ${sqlItems.length} questions`);
console.log(`  cloud (ADF): ${adfPlates.length} plates, ${adfItems.length} questions`);
console.log(`  manual enrichments loaded: ${Object.keys(manualEnrichments).length}`);

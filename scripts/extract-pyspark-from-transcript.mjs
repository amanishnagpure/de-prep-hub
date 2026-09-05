#!/usr/bin/env node
/**
 * Extracts PySpark notes + interview content from agent transcript user message.
 * Run: node scripts/extract-pyspark-from-transcript.mjs
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const transcriptPath = path.join(
  process.env.HOME ?? "",
  ".cursor/projects/home-manish-Desktop-2026-Resume-1-DataEngineering-2-DE-Website/agent-transcripts/beda440e-2818-4d91-b836-ad761a00dc3d/beda440e-2818-4d91-b836-ad761a00dc3d.jsonl"
);

const notesOut = path.join(root, "content/sources/pyspark-notes-100.md");
const interviewOut = path.join(root, "content/sources/pyspark-interview-100.md");

function extractUserContent() {
  if (!fs.existsSync(transcriptPath)) {
    throw new Error(`Transcript not found: ${transcriptPath}`);
  }

  const lines = fs.readFileSync(transcriptPath, "utf8").split("\n");
  let best = "";

  for (const line of lines) {
    if (!line.includes("PART 1 — PySpark BASIC") || !line.includes("What is PySpark")) continue;
    try {
      const row = JSON.parse(line);
      const text = row.message?.content?.find((c) => c.type === "text")?.text ?? "";
      if (text.length > best.length) best = text;
    } catch {
      /* skip */
    }
  }

  if (!best) {
    throw new Error("Could not find PySpark content in transcript");
  }

  // Strip XML wrapper from user query if present
  const queryStart = best.indexOf("We are creatting wole new pyspark");
  const body = queryStart >= 0 ? best.slice(queryStart) : best;

  const interviewMarkers = [
    "\nPyspark Wuestion",
    "\n# 🟢 PART 1 — PySpark Fundamentals & DataFrames",
    "\n# PySpark Interview Questions — 41 to 60",
  ];

  let splitAt = -1;
  for (const marker of interviewMarkers) {
    const idx = body.indexOf(marker);
    if (idx >= 0 && (splitAt < 0 || idx < splitAt)) splitAt = idx;
  }

  if (splitAt < 0) {
    throw new Error("Could not find interview section marker in user content");
  }

  const notes = body.slice(0, splitAt).trim();
  let interview = body.slice(splitAt).trim();

  // Normalize interview header — find first Fundamentals part
  const fundIdx = interview.indexOf("# 🟢 PART 1 — PySpark Fundamentals");
  if (fundIdx >= 0) {
    interview = interview.slice(fundIdx);
  }

  return { notes, interview };
}

const { notes, interview } = extractUserContent();
fs.mkdirSync(path.dirname(notesOut), { recursive: true });
fs.writeFileSync(notesOut, notes);
fs.writeFileSync(interviewOut, interview);

console.log("Extracted:");
console.log("  notes:", notes.split("\n").length, "lines →", notesOut);
console.log("  interview:", interview.split("\n").length, "lines →", interviewOut);

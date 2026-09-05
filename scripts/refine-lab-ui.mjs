#!/usr/bin/env node
/**
 * Applies neutral lab UI patterns across dashboards and sidebars.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.name.endsWith(".tsx")) acc.push(full);
  }
  return acc;
}

const files = walk(path.join(root, "src/components"));

const replacements = [
  [/rounded-2xl border border-border\/70 bg-card\/60/g, "panel"],
  [/rounded-xl border border-border\/70 bg-card\/60/g, "rounded-md border border-border bg-card"],
  [/border-border\/70/g, "border-border"],
  [/bg-card\/30/g, "bg-card"],
  [/bg-card\/50/g, "bg-card"],
  [/bg-card\/60/g, "bg-card"],
  [/bg-card\/70/g, "bg-card"],
  [/hover:border-[a-z]+-500\/[0-9]+/g, "hover:bg-muted/40"],
  [/border-emerald-500\/25 bg-emerald-500\/5/g, "border-primary/30 bg-muted/30"],
  [/text-emerald-500/g, "text-primary"],
  [/sticky top-24/g, "sticky top-20"],
  [/rounded-full px-3 py-2 text-sm font-medium/g, "rounded-md px-3 py-2 text-sm transition-colors"],
  [/bg-[a-z]+-500\/10 text-[a-z]+-500/g, "bg-muted font-medium text-foreground"],
  [/text-2xl font-bold tracking-tight/g, "text-2xl font-semibold tracking-tight"],
  [/font-semibold uppercase tracking-\[0\.[0-9]+em\]/g, "font-medium"],
  [/shadow-sm shadow-black\/5[^"']*/g, ""],
  [/dark:shadow-black\/[0-9]+/g, ""],
  [/backdrop-blur-[a-z]+/g, ""],
  [/hover:-translate-y-0\.5[^"']*/g, ""],
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("updated:", path.relative(root, file));
  }
}

console.log("done");

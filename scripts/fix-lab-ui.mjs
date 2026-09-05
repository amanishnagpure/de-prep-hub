#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith("-sidebar.tsx")) acc.push(p);
  }
  return acc;
}

for (const file of walk(path.join(root, "src/components"))) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  content = content.replace(
    /<LabMobileTab href=\{([^}]+)\} active=\{([^?]+)\?\s*"[^"]*"\s*:\s*"[^"]*"\s*\}>/g,
    "<LabMobileTab href={$1} active={$2}>"
  );

  content = content.replace(
    /<LabMobileTab href=\{([^}]+)\} active=\{([^}]+)\s*\?\s*"[^"]*"\s*:\s*"[^"]*"\s*\}>/gs,
    (match, href, cond) => `<LabMobileTab href={${href.trim()}} active={${cond.trim()}}>`
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("fixed mobile:", path.relative(root, file));
  }
}

for (const file of walk(path.join(root, "src/components")).concat(
  ...["dashboard"].map(() => {
    const acc = [];
    function w(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) w(p);
        else if (e.name.endsWith("-dashboard.tsx")) acc.push(p);
      }
    }
    w(path.join(root, "src/components"));
    return acc;
  })()
)) {
  if (!file.endsWith("-dashboard.tsx") && !file.includes("dashboard")) continue;
}

const dashFiles = [];
function walkDash(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkDash(p);
    else if (e.name.endsWith("-dashboard.tsx")) dashFiles.push(p);
  }
}
walkDash(path.join(root, "src/components"));

for (const file of dashFiles) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;
  content = content.replace(/\{\(([A-Z_]+CHAPTER_META\.map)/g, "{$1");
  content = content.replace(
    /rounded-xl bg-[a-z]+-500\/10 text-[a-z]+-[0-9]+ ring-1 ring-[a-z]+-500\/20/g,
    "hidden"
  );
  content = content.replace(
    /<section className="panel p-6">\s*<div className="flex items-start gap-3">\s*<div className="flex size-10[\s\S]*?<\/div>\s*<div>\s*<h2 className="font-semibold">Study path<\/h2>/g,
    '<section className="panel p-6">\n        <h2 className="text-sm font-medium">Suggested order</h2>'
  );
  content = content.replace(
    /<h2 className="font-semibold">Study path<\/h2>/g,
    '<h2 className="text-sm font-medium">Suggested order</h2>'
  );
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("fixed dash:", path.relative(root, file));
  }
}

console.log("fixes done");

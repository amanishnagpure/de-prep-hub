#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith("-dashboard.tsx")) acc.push(p);
  }
  return acc;
}

for (const file of walk(path.join(root, "src/components"))) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  if (!content.includes("LabModuleLink") && content.includes("const MODULES")) {
    content = content.replace(
      /import { cn } from "cn";/,
      'import { LabChapterLink, LabModuleLink } from "@/components/lab/nav";\nimport { cn } from "cn";'
    );

    content = content.replace(
      /const MODULES = \[[\s\S]*?\];\n\n/,
      ""
    );

    content = content.replace(
      /<section className="grid gap-3[^"]*">\s*\{MODULES\.map\(\(module\) => \{[\s\S]*?\}\)\}\s*<\/section>/,
      ""
    );

    content = content.replace(
      /\{([A-Z_]+)_CHAPTER_META\.map\(\(chapter\) => \{[\s\S]*?return \(\s*<Link[\s\S]*?<\/Link>\s*\);\s*\}\)\}/g,
      `{($1_CHAPTER_META.map((chapter) => (
            <LabChapterLink
              key={chapter.id}
              href={chapter.href}
              title={chapter.title}
              estimate={chapter.estimate}
              isRead={readChapters.includes(chapter.id)}
            />
          ))}`
    );
  }

  content = content.replace(
    /<span className="inline-flex items-center gap-1\.5 rounded-full border border-border[^"]*">\s*<Flame[^/]*\/>\s*\{streak\}d\s*<\/span>/g,
    `{streak > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 text-sm text-muted-foreground">
              <Flame className="size-4 text-amber-600 dark:text-amber-500" />
              {streak} day streak
            </span>
          )}`
  );

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("dashboard:", path.relative(root, file));
  }
}

console.log("dashboards done");

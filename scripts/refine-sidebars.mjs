#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sidebarDir = path.join(root, "src/components");

const titles = {
  "sql-sidebar.tsx": "SQL",
  "python-sidebar.tsx": "Python",
  "spark-sidebar.tsx": "Spark",
  "databricks-sidebar.tsx": "Databricks",
  "airflow-sidebar.tsx": "Airflow",
  "cloud-sidebar.tsx": "Cloud",
  "system-design-sidebar.tsx": "System design",
  "interview-prep-sidebar.tsx": "Interview",
};

for (const [fileName, title] of Object.entries(titles)) {
  const matches = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === fileName) matches.push(p);
    }
  }
  walk(sidebarDir);
  if (!matches.length) continue;
  const file = matches[0];
  let content = fs.readFileSync(file, "utf8");

  if (!content.includes("LabSidebarLink")) {
    content = content.replace(
      /import { cn } from "cn";/,
      'import { LabSidebarLink, LabMobileTab } from "@/components/lab/nav";\nimport { cn } from "cn";'
    );
  }

  content = content.replace(
    /function NavLink\([\s\S]*?\n\}\n\nexport function/,
    "export function"
  );

  content = content.replace(/\bNavLink\b/g, "LabSidebarLink");

  content = content.replace(
    /<div className=\{cn\("mb-6 flex items-center gap-3"[\s\S]*?<\/div>\n\n          <nav/,
    `{!collapsed && (\n            <p className="mb-6 text-xs font-medium text-muted-foreground">${title}</p>\n          )}\n\n          <nav`
  );

  content = content.replace(
    /<Link\n          href=\{([^}]+)\}\n          className=\{cn\(\n            "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",\n            ([\s\S]*?)\)\}\n        >\n          ([\s\S]*?)\n        <\/Link>/g,
    "<LabMobileTab href={$1} active={$2}>\n          $3\n        </LabMobileTab>"
  );

  content = content.replace(/group-hover:translate-[a-z0-9.-]+/g, "");
  content = content.replace(/group-\s*"/g, '"');

  fs.writeFileSync(file, content);
  console.log("sidebar:", path.relative(root, file));
}

console.log("sidebars done");

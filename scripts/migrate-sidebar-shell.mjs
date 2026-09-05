import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const COMPONENTS = path.join(ROOT, "src/components");

const files = fs
  .readdirSync(COMPONENTS, { recursive: true })
  .filter((f) => typeof f === "string" && f.endsWith("-sidebar.tsx"))
  .map((f) => path.join(COMPONENTS, f));

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("LabSidebarShell")) {
    console.log("skip (already migrated):", path.relative(ROOT, file));
    continue;
  }

  src = src.replace(
    /  PanelLeftClose,\n  PanelLeftOpen,\n/g,
    ""
  );
  src = src.replace(
    /import { LabSidebarLink, LabMobileTab } from "@\/components\/lab\/nav";/,
    `import { LabSidebarLink, LabMobileTab } from "@/components/lab/nav";\nimport { LabSidebarShell, useLabSidebarCollapse } from "@/components/lab/sidebar-shell";`
  );
  src = src.replace(
    /const \[collapsed, setCollapsed\] = React\.useState\(false\);/,
    "const { collapsed, toggle } = useLabSidebarCollapse();"
  );

  const mobileMatch = src.match(
    /<nav className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3 lg:hidden">([\s\S]*?)<\/nav>/
  );
  if (!mobileMatch) {
    console.error("no mobile nav in", path.relative(ROOT, file));
    continue;
  }
  const mobileInner = mobileMatch[1].trim();

  const headerMatch = src.match(
    /\{!collapsed && \(\s*<p className="mb-6 text-xs font-medium text-muted-foreground">([^<]+)<\/p>\s*\)\}/
  );
  const headerLabel = headerMatch?.[1] ?? null;

  const navMapMatch = src.match(
    /\{NAV\.map\(\(group\) => \{[\s\S]*?\}\)\}\s*<\/nav>/
  );
  if (!navMapMatch) {
    console.error("no NAV map in", path.relative(ROOT, file));
    continue;
  }
  const navMapBlock = navMapMatch[0].replace(/\s*<\/nav>\s*$/, "");

  const replacement = `const mobileNav = (
    <>
${mobileInner
  .split("\n")
  .map((line) => (line ? `      ${line}` : line))
  .join("\n")}
    </>
  );

  return (
    <LabSidebarShell
      collapsed={collapsed}
      onToggleCollapse={toggle}
      mobileNav={mobileNav}${
        headerLabel
          ? `\n      header={<p className="text-xs font-medium text-muted-foreground">${headerLabel}</p>}`
          : ""
      }
    >
      ${navMapBlock}
    </LabSidebarShell>
  );`;

  src = src.replace(
    /return \(\s*<>[\s\S]*?<\/>\s*\);/,
    replacement
  );

  fs.writeFileSync(file, src);
  console.log("migrated:", path.relative(ROOT, file));
}

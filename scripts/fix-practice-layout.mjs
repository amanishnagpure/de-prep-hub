#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const COMPONENTS = path.join(ROOT, "src/components");

const files = fs
  .readdirSync(COMPONENTS, { recursive: true })
  .filter((f) => typeof f === "string" && f.endsWith("-practice-workspace.tsx"))
  .map((f) => path.join(COMPONENTS, f));

const HOOK_IMPORT = `import { usePracticeScrollToEditor } from "@/hooks/use-practice-scroll";`;

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("usePracticeScrollToEditor")) {
    console.log("skip:", path.relative(ROOT, file));
    continue;
  }

  if (!src.includes(HOOK_IMPORT)) {
    src = src.replace(/import { cn } from "cn";/, `import { cn } from "cn";\n${HOOK_IMPORT}`);
  }

  src = src.replace(
    /(export function \w+PracticeWorkspace\(\{ questions \}: \w+Props\) \{\n)/,
    "$1  usePracticeScrollToEditor();\n"
  );

  src = src.replace(/<div className="space-y-6">/g, '<div className="space-y-4">');
  src = src.replace(
    /<div className="grid gap-6 xl:grid-cols-\[280px_minmax\(0,1fr\)\]">/g,
    '<div className="grid gap-4 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:items-start">'
  );
  src = src.replace(
    /<div className="grid gap-6 xl:grid-cols-\[280px_minmax\(0,1fr\)_280px\]">/g,
    '<div className="grid gap-4 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(200px,240px)] lg:items-start">'
  );
  src = src.replace(
    /<aside className="space-y-3 xl:max-h-\[75vh\] xl:overflow-y-auto">/g,
    '<aside className="order-2 space-y-3 lg:order-1 lg:sticky lg:top-14 lg:max-h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:overscroll-contain">'
  );
  src = src.replace(
    /<section className="panel p-5 sm:p-6">/g,
    '<section id="practice-editor" className="panel order-1 p-5 sm:p-6 lg:order-2 lg:sticky lg:top-14 lg:self-start lg:max-h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:overscroll-contain">'
  );
  src = src.replace(
    /<p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">/g,
    '<p className="mt-3 max-h-32 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:max-h-40">'
  );
  src = src.replace(
    /\{activeQuestion && <SqlSchemaPanel tables=\{schemas\} \/>}/g,
    `{activeQuestion && (
          <aside className="order-3 hidden min-w-0 lg:sticky lg:top-14 lg:block lg:max-h-[calc(100dvh-3.5rem)] lg:overflow-y-auto lg:overscroll-contain lg:self-start">
            <SqlSchemaPanel tables={schemas} />
          </aside>
        )}`
  );

  fs.writeFileSync(file, src);
  console.log("updated:", path.relative(ROOT, file));
}

const practicePages = fs
  .readdirSync(path.join(ROOT, "src/app"), { recursive: true })
  .filter((f) => typeof f === "string" && f.endsWith("practice/page.tsx"))
  .map((f) => path.join(ROOT, "src/app", f));

for (const file of practicePages) {
  let src = fs.readFileSync(file, "utf8");
  src = src.replace(
    /<h1 className="mb-6 text-2xl font-bold tracking-tight">([^<]+)<\/h1>/g,
    '<h1 className="sr-only">$1</h1>'
  );
  fs.writeFileSync(file, src);
  console.log("page:", path.relative(ROOT, file));
}

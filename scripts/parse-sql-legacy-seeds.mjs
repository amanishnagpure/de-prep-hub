/** Parse legacy SqlPracticeSeed init blocks from generated TS seed files */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SEED_FILES = [
  path.join(root, "src/data/de-code/sql-seeds-batch3.ts"),
  path.join(root, "src/data/de-code/sql-seeds-batch4.ts"),
];

const INLINE_JSON = path.join(__dirname, "sql-inits-inline.json");

export function parseLegacyInitsFromFile(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const inits = {};
  const re = /"([a-z0-9-]+)":\s*\{\s*init:\s*`([\s\S]*?)`\s*,/g;
  for (const match of src.matchAll(re)) {
    inits[match[1]] = match[2].trim();
  }
  return inits;
}

export function loadAllLegacyInits() {
  const merged = {};
  if (fs.existsSync(INLINE_JSON)) {
    Object.assign(merged, JSON.parse(fs.readFileSync(INLINE_JSON, "utf8")));
  }
  for (const file of SEED_FILES) {
    if (!fs.existsSync(file)) continue;
    Object.assign(merged, parseLegacyInitsFromFile(file));
  }
  return merged;
}

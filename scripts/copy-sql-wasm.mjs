import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "node_modules/sql.js/dist");
const targetDir = path.join(root, "public/wasm");

const wasmFiles = ["sql-wasm-browser.wasm", "sql-wasm.wasm"];

if (!fs.existsSync(dist)) {
  console.warn("copy-sql-wasm: sql.js not installed — run npm install first");
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of wasmFiles) {
  const source = path.join(dist, file);
  if (!fs.existsSync(source)) {
    console.warn(`copy-sql-wasm: missing ${file}`);
    continue;
  }
  fs.copyFileSync(source, path.join(targetDir, file));
  console.log(`copy-sql-wasm: copied ${file}`);
}

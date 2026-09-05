/**
 * Merges per-section enrichment JSON into scoped keys for integrate script.
 * Keys: sql:1, adf:1, spark:15, dbx:1
 */
import fs from "fs";
import path from "path";
import { enrichmentKey } from "../lib/interview-guide-format.mjs";

const dataDir = path.join(import.meta.dirname);

function loadJson(name) {
  const filePath = path.join(dataDir, name);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function prefixEntries(section, raw) {
  const out = {};
  for (const [id, value] of Object.entries(raw)) {
    out[enrichmentKey(section, Number(id))] = value;
  }
  return out;
}

const merged = {
  ...prefixEntries("sql", loadJson("enrichments-sql.json")),
  ...prefixEntries("adf", loadJson("enrichments-adf.json")),
  ...prefixEntries("spark", loadJson("enrichments-spark.json")),
  ...prefixEntries("dbx", loadJson("enrichments-dbx.json")),
};

export default merged;

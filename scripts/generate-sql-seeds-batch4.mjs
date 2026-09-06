#!/usr/bin/env node
/** Generates src/data/de-code/sql-seeds-batch4.ts */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SQL_BATCH4, SQL_INITS } from "./de-code-batch4-generated.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/data/de-code/sql-seeds-batch4.ts");

const TABLE_META = {
  orders: { label: "orders", description: "Order facts", columns: [{ name: "order_id", type: "INT", key: "PK" }, { name: "customer_id", type: "INT" }, { name: "amount", type: "INT" }, { name: "order_date", type: "TEXT" }, { name: "status", type: "TEXT" }] },
  customers: { label: "customers", description: "Customers", columns: [{ name: "customer_id", type: "INT", key: "PK" }, { name: "name", type: "TEXT" }, { name: "region", type: "TEXT" }] },
  employees: { label: "employees", description: "Employees", columns: [{ name: "employee_id", type: "INT", key: "PK" }, { name: "full_name", type: "TEXT" }, { name: "department", type: "TEXT" }, { name: "status", type: "TEXT" }, { name: "salary", type: "INT" }] },
  daily_revenue: { label: "daily_revenue", description: "Daily revenue", columns: [{ name: "order_date", type: "TEXT" }, { name: "amount", type: "INT" }] },
  customers_ext: { label: "customers_ext", description: "Customers extended", columns: [{ name: "customer_id", type: "INT", key: "PK" }, { name: "city", type: "TEXT" }] },
  customers_a: { label: "customers_a", description: "Customers set A", columns: [{ name: "customer_id", type: "INT" }, { name: "region", type: "TEXT" }] },
  customers_b: { label: "customers_b", description: "Customers set B", columns: [{ name: "customer_id", type: "INT" }, { name: "region", type: "TEXT" }] },
  staging: { label: "staging", description: "Staging", columns: [{ name: "id", type: "INT" }, { name: "value", type: "TEXT" }] },
  orders_dup: { label: "orders_dup", description: "Orders with duplicates", columns: [{ name: "order_id", type: "INT" }, { name: "amount", type: "INT" }] },
  customer_scd2_pt: { label: "customer_scd2_pt", description: "SCD2 customer history", columns: [{ name: "customer_id", type: "INT" }, { name: "city", type: "TEXT" }, { name: "effective_from", type: "TEXT" }, { name: "effective_to", type: "TEXT" }] },
  fact_events: { label: "fact_events", description: "Fact events", columns: [{ name: "event_id", type: "INT" }, { name: "event_date", type: "TEXT" }, { name: "metric", type: "INT" }] },
};

const entries = SQL_BATCH4.map((p) => {
  const init = SQL_INITS[p.slug];
  if (!init) throw new Error(`Missing init for ${p.slug}`);
  const tables = p.tables.map((t) => TABLE_META[t] ?? { label: t, description: t, columns: [] });
  return `  "${p.slug}": {
    init: \`
${init}
\`,
    referenceQuery: \`${p.solution.replace(/`/g, "\\`")}\`,
    tables: ${JSON.stringify(tables, null, 6).replace(/"([^"]+)":/g, "$1:")},
  }`;
});

const body = `import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";

export const SEEDS_BATCH4: Record<string, SqlPracticeSeed> = {
${entries.join(",\n\n")},
};
`;

fs.writeFileSync(out, body);
console.log("Wrote", out, "with", SQL_BATCH4.length, "seeds");

#!/usr/bin/env node
/** Generates src/data/de-code/sql-seeds-batch3.ts */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SQL_BATCH3 } from "./de-code-sql-batch3.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/data/de-code/sql-seeds-batch3.ts");

const INITS = {
  "average-order-value": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,200,'2024-01-02','shipped'),(3,20,50,'2024-01-01','shipped');`,
  "first-order-per-customer": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-05','shipped'),(2,10,50,'2024-02-01','shipped'),(3,20,75,'2024-01-10','shipped');`,
  "duplicate-email-addresses": `CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);
INSERT INTO customers VALUES (1,'a@x.com','A'),(2,'a@x.com','B'),(3,'b@y.com','C');`,
  "revenue-by-region": `CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');
INSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);`,
  "products-never-ordered": `CREATE TABLE products (product_id TEXT, product_name TEXT);
CREATE TABLE order_lines (product_id TEXT, amount INT);
INSERT INTO products VALUES ('A','Widget'),('B','Gadget');
INSERT INTO order_lines VALUES ('A',100);`,
  "recent-active-users": `CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);
INSERT INTO events VALUES (1,'2024-01-08','click'),(2,'2024-01-01','view'),(3,'2024-01-09','click');`,
  "order-count-by-status": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-01','pending'),(3,2,30,'2024-01-02','shipped');`,
  "salary-band-count": `CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',60000),(2,'B','E','active',80000),(3,'C','E','active',100000);`,
  "email-domain-extract": `CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);
INSERT INTO customers VALUES (1,'a@company.com','A'),(2,NULL,'B');`,
  "rolling-3-day-average": `CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30);`,
  "dedupe-staging-rows": `CREATE TABLE staging (id INT, value TEXT);
INSERT INTO staging VALUES (1,'A'),(2,'A'),(3,'B');`,
  "customers-missing-email": `CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1,'Ada','a@x.com'),(2,'Bob',NULL);`,
  "total-revenue": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');`,
  "rank-orders-per-customer": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,50,'2024-01-01','shipped'),(2,10,100,'2024-01-02','shipped');`,
  "union-daily-snapshots": `CREATE TABLE snapshot_a (metric_date TEXT, value INT);
CREATE TABLE snapshot_b (metric_date TEXT, value INT);
INSERT INTO snapshot_a VALUES ('2024-01-01',10);
INSERT INTO snapshot_b VALUES ('2024-01-02',5);`,
  "orders-above-average": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');`,
  "warehouse-low-stock": `CREATE TABLE products (product_id INT, product_name TEXT, stock_qty INT, reorder_level INT);
INSERT INTO products VALUES (1,'Widget',5,10),(2,'Gadget',20,10);`,
  "funnel-step-counts": `CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);
INSERT INTO events VALUES (1,'2024-01-01','click'),(2,'2024-01-01','click'),(3,'2024-01-01','view');`,
  "data-freshness-timestamp": `CREATE TABLE ingestion_log (table_name TEXT, updated_at TEXT);
INSERT INTO ingestion_log VALUES ('orders','2024-01-01'),('customers','2024-01-03');`,
  "active-pct-headcount": `CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',1),(3,'C','E','active',1),(4,'D','E','inactive',1);`,
  "running-order-count": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-01','shipped'),(3,2,30,'2024-01-02','shipped');`,
  "exclude-cancelled-orders": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');`,
  "extract-order-year": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,100,'2023-06-01','shipped'),(2,1,200,'2024-01-01','shipped');`,
  "count-null-emails": `CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1,'A','a@x.com'),(2,'B',NULL),(3,'C',NULL);`,
  "january-revenue": `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,100,'2024-01-15','shipped'),(2,1,50,'2024-01-20','shipped'),(3,2,200,'2024-02-01','shipped');`,
  "employees-without-manager": `CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1);`,
};

const TABLE_META = {
  orders: { label: "orders", description: "Order facts", columns: [{ name: "order_id", type: "INT", key: "PK" }, { name: "customer_id", type: "INT" }, { name: "amount", type: "INT" }] },
  customers: { label: "customers", description: "Customers", columns: [{ name: "customer_id", type: "INT", key: "PK" }, { name: "name", type: "TEXT" }] },
  products: { label: "products", description: "Products", columns: [{ name: "product_id", type: "TEXT" }, { name: "product_name", type: "TEXT" }] },
  order_lines: { label: "order_lines", description: "Order lines", columns: [{ name: "product_id", type: "TEXT" }, { name: "amount", type: "INT" }] },
  events: { label: "events", description: "Events", columns: [{ name: "user_id", type: "INT" }, { name: "event_type", type: "TEXT" }] },
  employees: { label: "employees", description: "Employees", columns: [{ name: "employee_id", type: "INT", key: "PK" }, { name: "status", type: "TEXT" }] },
  daily_revenue: { label: "daily_revenue", description: "Daily revenue", columns: [{ name: "order_date", type: "TEXT" }, { name: "amount", type: "INT" }] },
  staging: { label: "staging", description: "Staging", columns: [{ name: "id", type: "INT" }, { name: "value", type: "TEXT" }] },
  snapshot_a: { label: "snapshot_a", description: "Snapshot A", columns: [{ name: "metric_date", type: "TEXT" }, { name: "value", type: "INT" }] },
  snapshot_b: { label: "snapshot_b", description: "Snapshot B", columns: [{ name: "metric_date", type: "TEXT" }, { name: "value", type: "INT" }] },
  ingestion_log: { label: "ingestion_log", description: "Ingestion log", columns: [{ name: "table_name", type: "TEXT" }, { name: "updated_at", type: "TEXT" }] },
};

const entries = SQL_BATCH3.map((p) => {
  const init = INITS[p.slug];
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

export const SEEDS_BATCH3: Record<string, SqlPracticeSeed> = {
${entries.join(",\n\n")},
};
`;

fs.writeFileSync(out, body);
console.log("Wrote", out, "with", SQL_BATCH3.length, "seeds");

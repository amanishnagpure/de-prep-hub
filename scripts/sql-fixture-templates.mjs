/** Generic + curated SQL fixture templates for multi-fixture judge */

function hasAll(tables, names) {
  return names.every((n) => tables.includes(n));
}

function pickPrimary(tables) {
  return tables[0] ?? "data";
}

export function inferCategory(problem) {
  const slug = problem.slug ?? "";
  const topic = problem.topic ?? "";
  const text = `${slug} ${topic} ${problem.solution ?? ""}`;

  if (topic === "joins" || /unmatched|never.?ordered|without|missing|orphan/i.test(slug)) return "join";
  if (topic === "window-functions" || /window|rank|lag|lead|running/i.test(text)) return "window";
  if (topic === "deduplication" || /dedupe|duplicate/i.test(slug)) return "dedupe";
  if (topic === "aggregations" || /count|sum|avg|group|headcount|total|revenue|percent|distinct/i.test(slug)) return "agg";
  if (topic === "date-time") return "date";
  if (topic === "null-handling" || /null|coalesce/i.test(slug)) return "null";
  if (topic === "scd") return "scd";
  if (topic === "incremental-loading" || /incremental|latest/i.test(slug)) return "incremental";
  if (/order by|limit|top-/i.test(problem.solution ?? "")) return "sort";
  if (topic === "set-operations" || /union|intersect|except/i.test(slug)) return "setops";
  return "default";
}

export function defaultComparison(category, problem) {
  if (category === "sort" || /ORDER BY/i.test(problem.solution ?? "")) {
    return { schema: true, columnOrder: true, rowOrder: true, allowExtraColumns: false, ignoreColumnCase: true };
  }
  return { schema: true, columnOrder: false, rowOrder: false, allowExtraColumns: false, ignoreColumnCase: true };
}

export function buildHiddenFixtures(problem) {
  const category = inferCategory(problem);
  const tables = problem.tables ?? [];
  const builders = HIDDEN_BY_CATEGORY[category] ?? HIDDEN_BY_CATEGORY.default;
  return builders.map((fn) => fn(problem, tables)).filter(Boolean).slice(0, 4);
}

const HIDDEN_BY_CATEGORY = {
  join: [
    (_p, tables) =>
      hasAll(tables, ["orders", "customers"])
        ? {
            id: "hidden-empty-customers",
            label: "Empty customers table",
            initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1,10,100),(2,99,50);
CREATE TABLE customers (customer_id INT, name TEXT);`,
          }
        : null,
    (_p, tables) =>
      hasAll(tables, ["orders", "customers"])
        ? {
            id: "hidden-null-join-key",
            label: "NULL customer_id on order",
            initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1,10,100),(2,NULL,50);
CREATE TABLE customers (customer_id INT, name TEXT);
INSERT INTO customers VALUES (10,'Ada');`,
          }
        : null,
    (_p, tables) =>
      hasAll(tables, ["products", "order_lines"])
        ? {
            id: "hidden-unordered-product",
            label: "Product never ordered",
            initSql: `CREATE TABLE products (product_id TEXT, product_name TEXT);
INSERT INTO products VALUES ('A','Widget'),('B','Gadget');
CREATE TABLE order_lines (product_id TEXT, amount INT);
INSERT INTO order_lines VALUES ('A',100);`,
          }
        : null,
  ],
  window: [
    (_p, tables) =>
      tables.includes("employees")
        ? {
            id: "hidden-salary-ties",
            label: "Tied ranking values",
            initSql: `CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);`,
          }
        : null,
    (_p, tables) =>
      tables.includes("click_events")
        ? {
            id: "hidden-duplicate-session-events",
            label: "Multiple events same session",
            initSql: `CREATE TABLE click_events (session_id TEXT, user_id INT, event_time TEXT);
INSERT INTO click_events VALUES ('s1',1,'2024-01-01 10:00'),('s1',1,'2024-01-01 10:05'),('s2',2,'2024-01-01 11:00');`,
          }
        : tables.includes("daily_revenue")
          ? {
              id: "hidden-single-revenue-row",
              label: "Single revenue row",
              initSql: `CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100);`,
            }
          : tables.includes("orders")
            ? {
                id: "hidden-single-order",
                label: "Single order row",
                initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');`,
              }
            : null,
  ],
  dedupe: [
    (_p, tables) =>
      tables.includes("click_events")
        ? {
            id: "hidden-identical-timestamp",
            label: "Duplicate rows same timestamp",
            initSql: `CREATE TABLE click_events (user_id INT, event_type TEXT, session_id TEXT, event_time TEXT);
INSERT INTO click_events VALUES (1,'click','s1','2024-01-01 10:00'),(1,'click','s1','2024-01-01 10:00');`,
          }
        : tables.includes("staging")
          ? {
              id: "hidden-staging-dupes",
              label: "All staging rows duplicated",
              initSql: `CREATE TABLE staging (id INT, value TEXT);
INSERT INTO staging VALUES (1,'A'),(1,'A'),(2,'B');`,
            }
          : {
              id: "hidden-generic-dupes",
              label: "Repeated rows",
              initSql: `CREATE TABLE ${pickPrimary(tables)} (id INT, value TEXT);
INSERT INTO ${pickPrimary(tables)} VALUES (1,'x'),(1,'x'),(2,'y');`,
            },
  ],
  agg: [
    (_p, tables) =>
      tables.includes("employees")
        ? {
            id: "hidden-empty-employees",
            label: "Empty employee table",
            initSql: `CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);`,
          }
        : tables.includes("orders")
          ? {
              id: "hidden-null-amounts",
              label: "NULL measure values",
              initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');`,
            }
          : {
              id: "hidden-empty-fact",
              label: "Empty fact table",
              initSql: `CREATE TABLE ${pickPrimary(tables)} (id INT, value INT);`,
            },
    (_p, tables) =>
      tables.includes("orders")
        ? {
            id: "hidden-duplicate-facts",
            label: "Duplicate fact rows",
            initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');`,
          }
        : null,
  ],
  date: [
    (_p, tables) => {
      if (tables.includes("orders")) {
        return {
          id: "hidden-month-boundary",
          label: "Month boundary dates",
          initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-31','shipped'),(2,1,20,'2024-02-01','shipped'),(3,2,30,'2024-02-29','shipped');`,
        };
      }
      return {
        id: "hidden-month-boundary",
        label: "Month boundary dates",
        initSql: `CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-31',10),('2024-02-01',20);`,
      };
    },
    (_p, tables) =>
      tables.includes("orders")
        ? {
            id: "hidden-null-dates",
            label: "NULL order dates",
            initSql: `CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,NULL,'shipped'),(2,1,20,'2024-01-01','shipped');`,
          }
        : null,
  ],
  null: [
    () => ({
      id: "hidden-all-null-text",
      label: "All text values NULL",
      initSql: `CREATE TABLE products (product_id INT, product_name TEXT);
INSERT INTO products VALUES (1,NULL),(2,NULL);`,
    }),
    () => ({
      id: "hidden-empty-string",
      label: "Empty string vs NULL",
      initSql: `CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);
INSERT INTO customers VALUES (1,'','A'),(2,NULL,'B');`,
    }),
  ],
  scd: [
    () => ({
      id: "hidden-no-current-row",
      label: "No current version flag",
      initSql: `CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);
INSERT INTO customer_scd2 VALUES (1,'a@x.com','NYC','2024-01-01',0);`,
    }),
    () => ({
      id: "hidden-two-current",
      label: "Multiple current rows",
      initSql: `CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);
INSERT INTO customer_scd2 VALUES (1,'a@x.com','NYC','2024-01-01',1),(1,'a@x.com','Boston','2024-06-01',1);`,
    }),
  ],
  incremental: [
    () => ({
      id: "hidden-single-date",
      label: "Single load date",
      initSql: `CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);
INSERT INTO fact_events VALUES (1,'2024-03-01',7);`,
    }),
    () => ({
      id: "hidden-tied-max-date",
      label: "Multiple rows on max date",
      initSql: `CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);
INSERT INTO fact_events VALUES (1,'2024-01-02',1),(2,'2024-01-02',2);`,
    }),
  ],
  sort: [
    () => ({
      id: "hidden-tied-sort-keys",
      label: "Tied sort key values",
      initSql: `CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',100),('2024-01-03',50);`,
    }),
    () => ({
      id: "hidden-fewer-than-limit",
      label: "Fewer rows than LIMIT",
      initSql: `CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20);`,
    }),
  ],
  setops: [
    (_p, tables) =>
      hasAll(tables, ["snapshot_a", "snapshot_b"])
        ? {
            id: "hidden-empty-snapshot",
            label: "One empty snapshot",
            initSql: `CREATE TABLE snapshot_a (metric_date TEXT, value INT);
INSERT INTO snapshot_a VALUES ('2024-01-01',10);
CREATE TABLE snapshot_b (metric_date TEXT, value INT);`,
          }
        : null,
  ],
  default: [
    (problem, tables) => ({
      id: "hidden-minimal-rows",
      label: "Minimal dataset",
      initSql: `CREATE TABLE ${pickPrimary(tables)} (id INT, value TEXT);
INSERT INTO ${pickPrimary(tables)} VALUES (1,'only');`,
    }),
    (problem, tables) => ({
      id: "hidden-empty-table",
      label: "Empty primary table",
      initSql: `CREATE TABLE ${pickPrimary(tables)} (id INT, value TEXT);`,
    }),
  ],
};

export const CURATED_FIXTURES = {
  "filter-active-employees": () => [
    {
      id: "public",
      label: "Mixed departments and statuses",
      isHidden: false,
      tables: {
        employees: [
          { employee_id: 1, full_name: "Alice", department: "Engineering", status: "active", salary: 90000 },
          { employee_id: 2, full_name: "Bob", department: "Engineering", status: "active", salary: 85000 },
          { employee_id: 3, full_name: "Carol", department: "Sales", status: "active", salary: 70000 },
          { employee_id: 4, full_name: "Dan", department: "Engineering", status: "inactive", salary: 80000 },
        ],
      },
    },
    {
      id: "hidden-all-inactive-eng",
      label: "All Engineering inactive",
      isHidden: true,
      tables: {
        employees: [
          { employee_id: 1, full_name: "Alice", department: "Engineering", status: "inactive", salary: 90000 },
          { employee_id: 2, full_name: "Bob", department: "Engineering", status: "inactive", salary: 85000 },
        ],
      },
    },
    {
      id: "hidden-empty-result",
      label: "No active Engineering rows",
      isHidden: true,
      tables: {
        employees: [{ employee_id: 1, full_name: "Carol", department: "Sales", status: "active", salary: 70000 }],
      },
    },
  ],
  "unmatched-orders": () => [
    {
      id: "public",
      label: "Matched and orphan orders",
      isHidden: false,
      tables: {
        orders: [
          { order_id: 1, customer_id: 10, amount: 100 },
          { order_id: 2, customer_id: 99, amount: 50 },
        ],
        customers: [{ customer_id: 10, name: "Ada" }],
      },
    },
    {
      id: "hidden-null-join-key",
      label: "NULL customer_id on order",
      isHidden: true,
      tables: {
        orders: [
          { order_id: 1, customer_id: 10, amount: 10 },
          { order_id: 2, customer_id: null, amount: 20 },
        ],
        customers: [{ customer_id: 10, name: "Ada" }],
      },
    },
    {
      id: "hidden-all-matched",
      label: "No orphan orders",
      isHidden: true,
      tables: {
        orders: [{ order_id: 1, customer_id: 10, amount: 10 }],
        customers: [{ customer_id: 10, name: "Ada" }],
      },
    },
    {
      id: "hidden-empty-customers",
      label: "Empty customers table",
      isHidden: true,
      tables: {
        orders: [{ order_id: 1, customer_id: 10, amount: 10 }],
        customers: [],
      },
    },
  ],
  "top-salary-per-department": () => [
    {
      id: "public",
      label: "Clear top salary per dept",
      isHidden: false,
      tables: {
        employees: [
          { employee_id: 1, full_name: "Alice", department: "Eng", status: "active", salary: 100 },
          { employee_id: 2, full_name: "Bob", department: "Eng", status: "active", salary: 100 },
          { employee_id: 3, full_name: "Carol", department: "Sales", status: "active", salary: 80 },
        ],
      },
    },
    {
      id: "hidden-salary-ties",
      label: "Tied top salaries in department",
      isHidden: true,
      tables: {
        employees: [
          { employee_id: 1, full_name: "A", department: "Eng", status: "active", salary: 100 },
          { employee_id: 2, full_name: "B", department: "Eng", status: "active", salary: 100 },
          { employee_id: 3, full_name: "C", department: "Eng", status: "active", salary: 90 },
        ],
      },
    },
    {
      id: "hidden-single-row-dept",
      label: "Single employee per department",
      isHidden: true,
      tables: {
        employees: [{ employee_id: 1, full_name: "Solo", department: "Eng", status: "active", salary: 50 }],
      },
    },
  ],
};

export function buildFixturesForProblem(problem, publicInitSql) {
  if (CURATED_FIXTURES[problem.slug]) return CURATED_FIXTURES[problem.slug]();

  let hidden = buildHiddenFixtures(problem);
  if (hidden.length < 2) {
    const fallback = HIDDEN_BY_CATEGORY.default
      .map((fn) => fn(problem, problem.tables ?? []))
      .filter(Boolean);
    hidden = [...hidden, ...fallback].slice(0, 4);
  }

  return [
    { id: "public", label: "Public dataset", isHidden: false, initSql: publicInitSql },
    ...hidden.slice(0, 4).map((h) => ({ ...h, isHidden: true })),
  ];
}

export const TABLE_META = {
  orders: { label: "orders", description: "Order facts", columns: [{ name: "order_id", type: "INT", key: "PK" }, { name: "customer_id", type: "INT" }, { name: "amount", type: "INT" }, { name: "order_date", type: "TEXT" }, { name: "status", type: "TEXT" }] },
  customers: { label: "customers", description: "Customers", columns: [{ name: "customer_id", type: "INT", key: "PK" }, { name: "name", type: "TEXT" }, { name: "email", type: "TEXT" }, { name: "region", type: "TEXT" }] },
  employees: { label: "employees", description: "Employees", columns: [{ name: "employee_id", type: "INT", key: "PK" }, { name: "full_name", type: "TEXT" }, { name: "department", type: "TEXT" }, { name: "status", type: "TEXT" }, { name: "salary", type: "INT" }, { name: "manager_id", type: "INT" }, { name: "hire_date", type: "TEXT" }] },
  products: { label: "products", description: "Products", columns: [{ name: "product_id", type: "INT", key: "PK" }, { name: "product_name", type: "TEXT" }, { name: "stock_qty", type: "INT" }, { name: "reorder_level", type: "INT" }] },
  order_lines: { label: "order_lines", description: "Order lines", columns: [{ name: "product_id", type: "TEXT" }, { name: "amount", type: "INT" }] },
  click_events: { label: "click_events", description: "Click events", columns: [{ name: "user_id", type: "INT" }, { name: "event_type", type: "TEXT" }, { name: "session_id", type: "TEXT" }, { name: "event_time", type: "TEXT" }] },
  daily_revenue: { label: "daily_revenue", description: "Daily revenue", columns: [{ name: "order_date", type: "TEXT" }, { name: "amount", type: "INT" }] },
  events: { label: "events", description: "Events", columns: [{ name: "user_id", type: "INT" }, { name: "event_date", type: "TEXT" }, { name: "event_type", type: "TEXT" }] },
  staging: { label: "staging", description: "Staging rows", columns: [{ name: "id", type: "INT" }, { name: "value", type: "TEXT" }] },
  customer_scd2: { label: "customer_scd2", description: "SCD2 customers", columns: [{ name: "customer_id", type: "INT" }, { name: "email", type: "TEXT" }, { name: "city", type: "TEXT" }, { name: "effective_from", type: "TEXT" }, { name: "is_current", type: "INT" }] },
  fact_events: { label: "fact_events", description: "Fact events", columns: [{ name: "event_id", type: "INT", key: "PK" }, { name: "event_date", type: "TEXT" }, { name: "metric", type: "INT" }] },
  snapshot_a: { label: "snapshot_a", description: "Snapshot A", columns: [{ name: "metric_date", type: "TEXT" }, { name: "value", type: "INT" }] },
  snapshot_b: { label: "snapshot_b", description: "Snapshot B", columns: [{ name: "metric_date", type: "TEXT" }, { name: "value", type: "INT" }] },
  ingestion_log: { label: "ingestion_log", description: "Ingestion log", columns: [{ name: "table_name", type: "TEXT" }, { name: "updated_at", type: "TEXT" }] },
  customer_scd2_pt: { label: "customer_scd2_pt", description: "SCD2 partition", columns: [{ name: "customer_id", type: "INT" }, { name: "city", type: "TEXT" }, { name: "effective_from", type: "TEXT" }, { name: "effective_to", type: "TEXT" }] },
  customers_ext: { label: "customers_ext", description: "Customers extended", columns: [{ name: "customer_id", type: "INT", key: "PK" }, { name: "city", type: "TEXT" }] },
  customers_a: { label: "customers_a", description: "Customers set A", columns: [{ name: "customer_id", type: "INT" }, { name: "region", type: "TEXT" }] },
  customers_b: { label: "customers_b", description: "Customers set B", columns: [{ name: "customer_id", type: "INT" }, { name: "region", type: "TEXT" }] },
  orders_dup: { label: "orders_dup", description: "Orders with duplicates", columns: [{ name: "order_id", type: "INT" }, { name: "amount", type: "INT" }] },
};

export function buildTableSchemas(problem) {
  return (problem.tables ?? []).map(
    (t) => TABLE_META[t] ?? { label: t, description: t, columns: [{ name: "id", type: "INT" }] }
  );
}

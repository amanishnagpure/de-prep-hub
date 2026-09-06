#!/usr/bin/env node
/**
 * Builds src/data/de-code/catalog.json — original DE-focused problems only.
 * Run: npm run seed:code
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PROBLEM_CONTENT } from "./de-code-problem-content.mjs";
import { BATCH2_CONTENT, BATCH2_HINTS } from "./de-code-batch2.mjs";
import { BATCH3_CONTENT, BATCH3_HINTS } from "./de-code-batch3.mjs";
import {
  BATCH4_CONTENT,
  DSA_BATCH4,
  PYSPARK_BATCH4,
  PYTHON_BATCH4,
  SQL_BATCH4,
} from "./de-code-batch4-generated.mjs";
import { applyTaxonomy } from "./de-code-problem-taxonomy.mjs";
import { SQL_BATCH3 } from "./de-code-sql-batch3.mjs";

const ALL_CONTENT = { ...PROBLEM_CONTENT, ...BATCH2_CONTENT, ...BATCH3_CONTENT, ...BATCH4_CONTENT };
const ALL_HINTS = { ...BATCH2_HINTS, ...BATCH3_HINTS };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "src/data/de-code/catalog.json");

function mergeContent(slug, body) {
  const rich = ALL_CONTENT[slug];
  const hints = ALL_HINTS[slug] ?? body.hints;
  if (!rich && hints === body.hints) return body;
  return {
    ...body,
    ...(rich && {
      description: rich.description,
      examples: rich.examples,
      constraints: rich.constraints ?? body.constraints,
      followUp: rich.followUp,
      functionSignature: rich.functionSignature,
    }),
    ...(hints && { hints }),
  };
}

function base(p) {
  return {
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    hints: p.hints ?? [],
    explanation: p.explanation ?? p.solution,
    starterCode: p.starterCode ?? "",
    concepts: p.concepts ?? [],
    prerequisites: p.prerequisites ?? [],
    companyTags: p.companyTags ?? [],
    performanceRequirements: p.performanceRequirements ?? [],
    ...p,
  };
}

const SQL = [
  {
    slug: "filter-active-employees",
    title: "Active Employees in Engineering",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["filtering", "WHERE"],
    description: "Return `employee_id` and `full_name` for employees in the **Engineering** department with status **active**.",
    solution: "SELECT employee_id, full_name\nFROM employees\nWHERE department = 'Engineering' AND status = 'active';",
    tables: ["employees"],
  },
  {
    slug: "department-headcount",
    title: "Headcount by Department",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["aggregation", "GROUP BY"],
    description: "Count active employees per department. Return `department` and `headcount`.",
    solution: "SELECT department, COUNT(*) AS headcount\nFROM employees\nWHERE status = 'active'\nGROUP BY department;",
    tables: ["employees"],
  },
  {
    slug: "top-salary-per-department",
    title: "Highest Paid per Department",
    subtopic: "intermediate",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["window functions", "RANK"],
    description: "For each department, return employees tied for the highest salary.",
    solution: `SELECT department, full_name, salary
FROM (
  SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk
  FROM employees WHERE status = 'active'
) x WHERE rk = 1;`,
    tables: ["employees"],
  },
  {
    slug: "monthly-revenue-trend",
    title: "Monthly Revenue Rollup",
    subtopic: "intermediate",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["dates", "aggregation"],
    description: "Sum `amount` by calendar month from `orders.order_date`. Return `month` and `total_revenue`.",
    solution: `SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS total_revenue
FROM orders GROUP BY 1 ORDER BY 1;`,
    tables: ["orders"],
  },
  {
    slug: "dedupe-click-events",
    title: "Deduplicate Clickstream Events",
    subtopic: "de-sql",
    experienceLevel: "advanced",
    difficulty: "hard",
    concepts: ["deduplication", "ROW_NUMBER"],
    description: "Keep the earliest event per (`user_id`, `event_type`, `session_id`). Return deduped rows.",
    solution: `SELECT user_id, event_type, session_id, event_time
FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY user_id, event_type, session_id ORDER BY event_time
  ) AS rn FROM click_events
) x WHERE rn = 1;`,
    tables: ["click_events"],
  },
  {
    slug: "running-revenue-total",
    title: "Running Revenue by Day",
    subtopic: "advanced",
    experienceLevel: "advanced",
    difficulty: "hard",
    concepts: ["window functions", "running total"],
    description: "Return each order date with cumulative revenue ordered by date.",
    solution: `SELECT order_date,
  SUM(amount) OVER (ORDER BY order_date) AS running_revenue
FROM daily_revenue ORDER BY order_date;`,
    tables: ["daily_revenue"],
  },
  {
    slug: "scd2-current-version",
    title: "SCD2 Current Customer Version",
    subtopic: "de-sql",
    experienceLevel: "expert",
    difficulty: "expert",
    concepts: ["SCD2", "slowly changing dimensions"],
    description: "From `customer_scd2`, return current version rows where `is_current = 1`.",
    solution: "SELECT customer_id, email, city, effective_from\nFROM customer_scd2\nWHERE is_current = 1;",
    tables: ["customer_scd2"],
  },
  {
    slug: "incremental-daily-load",
    title: "Incremental Daily Extract",
    subtopic: "de-sql",
    experienceLevel: "advanced",
    difficulty: "medium",
    concepts: ["incremental load", "filtering"],
    description: "Return all rows from `fact_events` where `event_date` equals the max date in the table.",
    solution: `SELECT * FROM fact_events
WHERE event_date = (SELECT MAX(event_date) FROM fact_events);`,
    tables: ["fact_events"],
  },
  {
    slug: "unmatched-orders",
    title: "Orders Without Customers",
    subtopic: "de-sql",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["LEFT JOIN", "referential integrity"],
    description: "Find orders whose customer_id has no match in customers.",
    solution: `SELECT o.order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;`,
    tables: ["orders", "customers"],
  },
  {
    slug: "second-highest-salary",
    title: "Second Highest Salary",
    subtopic: "intermediate",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["subquery", "DISTINCT"],
    description: "Return employees with the second highest distinct active salary.",
    solution: `SELECT full_name, salary
FROM employees
WHERE status = 'active'
  AND salary = (
    SELECT MAX(salary) FROM (
      SELECT DISTINCT salary FROM employees WHERE status = 'active'
    ) s WHERE salary < (SELECT MAX(salary) FROM employees WHERE status = 'active')
  );`,
    tables: ["employees"],
  },
  {
    slug: "customer-order-total",
    title: "Customer Lifetime Order Value",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["GROUP BY", "SUM"],
    description: "Sum order amounts per customer_id.",
    solution: `SELECT customer_id, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY customer_id;`,
    tables: ["orders"],
  },
  {
    slug: "null-safe-product-name",
    title: "Null-Safe Product Display Name",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["COALESCE", "NULL handling"],
    description: "Return product_id and display_name with COALESCE for missing names.",
    solution: `SELECT product_id, COALESCE(product_name, 'Unknown') AS display_name
FROM products;`,
    tables: ["products"],
  },
  {
    slug: "day-over-day-revenue",
    title: "Day-over-Day Revenue Change",
    subtopic: "advanced",
    experienceLevel: "advanced",
    difficulty: "hard",
    concepts: ["LAG", "window functions"],
    description: "Compute previous day amount and delta from daily_revenue.",
    solution: `SELECT order_date, amount,
  LAG(amount) OVER (ORDER BY order_date) AS prev_amount,
  amount - LAG(amount) OVER (ORDER BY order_date) AS delta
FROM daily_revenue
ORDER BY order_date;`,
    tables: ["daily_revenue"],
  },
  {
    slug: "session-first-event",
    title: "First Event per Session",
    subtopic: "de-sql",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["window functions", "ROW_NUMBER"],
    description: "Earliest click event per session_id.",
    solution: `SELECT session_id, user_id, event_time
FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY event_time) AS rn
  FROM click_events
) x WHERE rn = 1;`,
    tables: ["click_events"],
  },
  {
    slug: "distinct-active-users",
    title: "Distinct Active Users",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["COUNT DISTINCT", "aggregation"],
    description: "Count distinct user_id from events.",
    solution: `SELECT COUNT(DISTINCT user_id) AS unique_users FROM events;`,
    tables: ["events"],
  },
  {
    slug: "order-tier-label",
    title: "Order Spend Tier",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["CASE WHEN", "classification"],
    description: "Label orders high/low by amount threshold.",
    solution: `SELECT order_id,
  CASE WHEN amount >= 100 THEN 'high' ELSE 'low' END AS tier
FROM orders;`,
    tables: ["orders"],
  },
  {
    slug: "manager-direct-reports",
    title: "Employee and Manager Names",
    subtopic: "intermediate",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["self join", "JOIN"],
    description: "Self-join employees to list direct reports with manager names.",
    solution: `SELECT e.full_name AS employee, m.full_name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.employee_id;`,
    tables: ["employees"],
  },
  {
    slug: "top-3-revenue-days",
    title: "Top 3 Revenue Days",
    subtopic: "intermediate",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["ORDER BY", "LIMIT"],
    description: "Top 3 days by revenue from daily_revenue.",
    solution: `SELECT order_date, amount FROM daily_revenue
ORDER BY amount DESC, order_date ASC LIMIT 3;`,
    tables: ["daily_revenue"],
  },
  {
    slug: "percent-of-total-revenue",
    title: "Percent of Total Revenue",
    subtopic: "advanced",
    experienceLevel: "advanced",
    difficulty: "hard",
    concepts: ["window functions", "analytics"],
    description: "Each day's share of total revenue using window sum.",
    solution: `SELECT order_date, amount,
  CAST(amount AS REAL) / SUM(amount) OVER () AS pct_of_total
FROM daily_revenue ORDER BY order_date;`,
    tables: ["daily_revenue"],
  },
  {
    slug: "union-event-sources",
    title: "Union Web and Mobile Events",
    subtopic: "de-sql",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["UNION ALL", "ETL"],
    description: "Combine web_events and mobile_events with source label.",
    solution: `SELECT user_id, event_type, 'web' AS source FROM web_events
UNION ALL
SELECT user_id, event_type, 'mobile' AS source FROM mobile_events;`,
    tables: ["web_events", "mobile_events"],
  },
  {
    slug: "customers-with-orders",
    title: "Customers Who Ordered",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["INNER JOIN", "EXISTS"],
    description: "Distinct customers with at least one order.",
    solution: `SELECT DISTINCT c.customer_id, c.name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;`,
    tables: ["customers", "orders"],
  },
  {
    slug: "hire-date-filter",
    title: "Recent Active Hires",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["filtering", "dates"],
    description: "Active employees hired on or after 2024-01-01.",
    solution: `SELECT employee_id, full_name FROM employees
WHERE status = 'active' AND hire_date >= '2024-01-01';`,
    tables: ["employees"],
  },
  {
    slug: "product-revenue-rank",
    title: "Product Revenue Rank",
    subtopic: "advanced",
    experienceLevel: "advanced",
    difficulty: "hard",
    concepts: ["RANK", "GROUP BY"],
    description: "Rank products by total line revenue.",
    solution: `SELECT product_id, revenue,
  RANK() OVER (ORDER BY revenue DESC) AS rank
FROM (
  SELECT product_id, SUM(amount) AS revenue FROM order_lines GROUP BY product_id
);`,
    tables: ["order_lines"],
  },
  {
    slug: "null-email-default",
    title: "Default Missing Customer Email",
    subtopic: "fundamentals",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["COALESCE", "NULL handling"],
    description: "COALESCE customer email to default address.",
    solution: `SELECT customer_id,
  COALESCE(email, 'no-email@unknown.com') AS contact_email
FROM customers;`,
    tables: ["customers"],
  },
  ...SQL_BATCH3,
  ...SQL_BATCH4,
];

const PYTHON = [
  {
    slug: "sum-csv-amount-column",
    title: "Sum CSV Amount Column",
    fn: "sum_amount_column",
    subtopic: "etl",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["csv", "parsing"],
    description: "Given CSV text with header `id,amount`, return the sum of `amount` values.",
    solution: `def sum_amount_column(text):\n    lines = text.strip().splitlines()\n    idx = lines[0].split(',').index('amount')\n    return sum(int(r.split(',')[idx]) for r in lines[1:])`,
    cases: [
      { id: "1", input: "id,amount\\n1,10\\n2,5", args: ["id,amount\n1,10\n2,5"], expected: 15, expectedOutput: "15", isHidden: false },
      { id: "2", input: "three rows", args: ["id,amount\n1,4\n2,6\n3,0"], expected: 10, expectedOutput: "10", isHidden: true },
    ],
  },
  {
    slug: "dedupe-records-by-id",
    title: "Deduplicate Records by ID",
    fn: "dedupe_by_id",
    subtopic: "etl",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["deduplication", "dict"],
    description: "Given a list of dicts with `id`, keep the **last** occurrence of each id.",
    solution: `def dedupe_by_id(rows):\n    seen = {}\n    for row in rows:\n        seen[row['id']] = row\n    return list(seen.values())`,
    cases: [
      { id: "1", input: "duplicate ids", args: [[{ id: 1, v: "a" }, { id: 2, v: "b" }, { id: 1, v: "c" }]], expected: [{ id: 1, v: "c" }, { id: 2, v: "b" }], expectedOutput: "last wins", isHidden: false },
      { id: "2", input: "single id duplicate", args: [[{ id: 5, x: 1 }, { id: 5, x: 2 }]], expected: [{ id: 5, x: 2 }], expectedOutput: "last wins", isHidden: true },
    ],
  },
  {
    slug: "parse-event-json",
    title: "Parse Event JSON Field",
    fn: "extract_user_id",
    subtopic: "json",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["json", "parsing"],
    description: "Parse JSON string and return integer `user_id`.",
    solution: `import json\n\ndef extract_user_id(payload):\n    return int(json.loads(payload)['user_id'])`,
    cases: [
      { id: "1", input: '{"user_id":42}', args: ['{"user_id":42}'], expected: 42, expectedOutput: "42", isHidden: false },
      { id: "2", input: '{"user_id":0}', args: ['{"user_id":0}'], expected: 0, expectedOutput: "0", isHidden: true },
    ],
  },
  {
    slug: "moving-average-window",
    title: "Moving Average Window",
    fn: "moving_average",
    subtopic: "pandas-style",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["window", "lists"],
    description: "Return moving averages of window size `k` for numeric list.",
    solution: `def moving_average(nums, k):\n    out, window = [], 0\n    for i, n in enumerate(nums):\n        window += n\n        if i >= k:\n            window -= nums[i-k]\n        if i >= k-1:\n            out.append(window/k)\n    return out`,
    cases: [
      { id: "1", input: "[1,2,3,4], k=2", args: [[1, 2, 3, 4], 2], expected: [1.5, 2.5, 3.5], expectedOutput: "[1.5,2.5,3.5]", isHidden: false },
      { id: "2", input: "[10,20,30], k=3", args: [[10, 20, 30], 3], expected: [20.0], expectedOutput: "[20.0]", isHidden: true },
    ],
  },
  {
    slug: "partition-files-by-date",
    title: "Partition Paths by Date",
    fn: "partition_path",
    subtopic: "etl",
    experienceLevel: "advanced",
    difficulty: "medium",
    concepts: ["file paths", "partitioning"],
    description: "Given `date_str` (YYYY-MM-DD), return hive-style path `year=YYYY/month=MM/day=DD`.",
    solution: `def partition_path(date_str):\n    y, m, d = date_str.split('-')\n    return f"year={y}/month={m}/day={d}"`,
    cases: [
      { id: "1", input: "2024-03-05", args: ["2024-03-05"], expected: "year=2024/month=03/day=05", expectedOutput: "year=2024/month=03/day=05", isHidden: false },
    ],
  },
  {
    slug: "chunk-list",
    title: "Chunk List for Batching",
    fn: "chunk_list",
    subtopic: "etl",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["lists", "batching"],
    description: "Split list into fixed-size chunks.",
    solution: `def chunk_list(items, size):\n    return [items[i:i + size] for i in range(0, len(items), size)]`,
    cases: [
      { id: "1", input: "[1,2,3,4,5], size=2", args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]], expectedOutput: "[[1,2],[3,4],[5]]", isHidden: false },
      { id: "2", input: "empty", args: [[], 3], expected: [], expectedOutput: "[]", isHidden: true },
    ],
  },
  {
    slug: "flatten-one-level",
    title: "Flatten Nested List",
    fn: "flatten_one_level",
    subtopic: "etl",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["lists", "flatten"],
    description: "Flatten one level of list nesting.",
    solution: `def flatten_one_level(nested):\n    out = []\n    for inner in nested:\n        out.extend(inner)\n    return out`,
    cases: [
      { id: "1", input: "[[1,2],[3]]", args: [[[1, 2], [3]]], expected: [1, 2, 3], expectedOutput: "[1,2,3]", isHidden: false },
    ],
  },
  {
    slug: "parse-log-level",
    title: "Parse Log Level",
    fn: "parse_log_level",
    subtopic: "etl",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["strings", "parsing"],
    description: "Extract log level before colon.",
    solution: `def parse_log_level(line):\n    return line.split(':', 1)[0]`,
    cases: [
      { id: "1", input: "INFO: start", args: ["INFO: start"], expected: "INFO", expectedOutput: "INFO", isHidden: false },
      { id: "2", input: "ERROR: fail", args: ["ERROR: fail"], expected: "ERROR", expectedOutput: "ERROR", isHidden: true },
    ],
  },
  {
    slug: "rows-above-threshold",
    title: "Rows Above Threshold",
    fn: "rows_above_threshold",
    subtopic: "etl",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["filtering", "dict"],
    description: "Filter dict rows where value exceeds threshold.",
    solution: `def rows_above_threshold(rows, threshold):\n    return [r for r in rows if r['value'] > threshold]`,
    cases: [
      { id: "1", input: "threshold 5", args: [[{ id: 1, value: 10 }, { id: 2, value: 3 }], 5], expected: [{ id: 1, value: 10 }], expectedOutput: "one row", isHidden: false },
      { id: "2", input: "empty", args: [[], 10], expected: [], expectedOutput: "[]", isHidden: true },
    ],
  },
  {
    slug: "parse-json-array-length",
    title: "JSON Array Length",
    fn: "json_array_length",
    subtopic: "json",
    experienceLevel: "beginner",
    difficulty: "easy",
    concepts: ["json", "parsing"],
    description: "Return length of JSON array string.",
    solution: `import json\n\ndef json_array_length(payload):\n    return len(json.loads(payload))`,
    cases: [
      { id: "1", input: "[1,2,3]", args: ["[1,2,3]"], expected: 3, expectedOutput: "3", isHidden: false },
      { id: "2", input: "[]", args: ["[]"], expected: 0, expectedOutput: "0", isHidden: true },
    ],
  },
  {
    slug: "slugify-column-name",
    title: "Slugify Column Name",
    fn: "slugify_column",
    subtopic: "etl",
    experienceLevel: "intermediate",
    difficulty: "medium",
    concepts: ["strings", "normalization"],
    description: "Normalize column header to snake_case slug.",
    solution: `import re\n\ndef slugify_column(name):\n    s = re.sub(r'[^a-z0-9]+', '_', name.lower().strip())\n    return s.strip('_')`,
    cases: [
      { id: "1", input: "Order Date", args: ["Order Date"], expected: "order_date", expectedOutput: "order_date", isHidden: false },
      { id: "2", input: "Revenue ($)", args: ["Revenue ($)"], expected: "revenue", expectedOutput: "revenue", isHidden: true },
    ],
  },
  ...PYTHON_BATCH4.map((p) => ({
    slug: p.slug,
    title: p.title,
    fn: p.fn,
    subtopic: p.subtopic,
    experienceLevel: p.experienceLevel,
    difficulty: p.difficulty,
    concepts: p.concepts ?? [p.fn],
    description: p.task,
    solution: p.solution,
    cases: p.cases,
  })),
];

const PYSPARK = [
  { slug: "filter-active-users", title: "Filter Active Users", subtopic: "fundamentals", experienceLevel: "beginner", difficulty: "easy", concepts: ["filter"], description: "Filter dataframe to rows where status equals active.", solution: "active = df.filter(df.status == 'active')" },
  { slug: "daily-event-count", title: "Daily Event Count", subtopic: "fundamentals", experienceLevel: "intermediate", difficulty: "medium", concepts: ["aggregation"], description: "Group events by event_date and count rows.", solution: "daily = df.groupBy('event_date').count()" },
  { slug: "join-orders-customers", title: "Join Orders to Customers", subtopic: "intermediate", experienceLevel: "intermediate", difficulty: "medium", concepts: ["joins"], description: "Inner join orders and customers on customer_id.", solution: "joined = orders.join(customers, on='customer_id', how='inner')" },
  { slug: "dedupe-with-window", title: "Dedupe with Window", subtopic: "advanced", experienceLevel: "advanced", difficulty: "hard", concepts: ["window", "deduplication"], description: "Drop duplicates using window row_number partitioned by user_id, event_time.", solution: "from pyspark.sql.window import Window\nfrom pyspark.sql.functions import row_number\nw = Window.partitionBy('user_id').orderBy('event_time')\ndeduped = df.withColumn('rn', row_number().over(w)).filter('rn = 1')" },
  { slug: "repartition-before-write", title: "Repartition Before Write", subtopic: "optimization", experienceLevel: "advanced", difficulty: "medium", concepts: ["repartition", "write"], description: "Repartition df to 8 partitions before writing.", solution: "out = df.repartition(8)" },
  { slug: "cache-reused-df", title: "Cache Reused DataFrame", subtopic: "optimization", experienceLevel: "expert", difficulty: "medium", concepts: ["cache", "performance"], description: "Cache df for reuse in multiple downstream transforms.", solution: "cached = df.cache()" },
  { slug: "select-column-projection", title: "Select Column Projection", subtopic: "fundamentals", experienceLevel: "beginner", difficulty: "easy", concepts: ["select", "projection"], description: "Select user_id and event_type columns.", solution: "projected = df.select('user_id', 'event_type')" },
  { slug: "drop-duplicates-by-key", title: "Drop Duplicates by Key", subtopic: "fundamentals", experienceLevel: "beginner", difficulty: "easy", concepts: ["deduplication"], description: "dropDuplicates on user_id.", solution: "unique_users = df.dropDuplicates(['user_id'])" },
  { slug: "sum-amount-by-region", title: "Sum Amount by Region", subtopic: "intermediate", experienceLevel: "intermediate", difficulty: "medium", concepts: ["aggregation"], description: "Group sales by region and sum amount.", solution: "by_region = sales.groupBy('region').sum('amount')" },
  { slug: "sort-events-desc", title: "Sort Events Descending", subtopic: "fundamentals", experienceLevel: "beginner", difficulty: "easy", concepts: ["sort"], description: "Order by event_time descending.", solution: "sorted_df = df.orderBy(df.event_time.desc())" },
  { slug: "groupby-multiple-keys", title: "Group By Multiple Keys", subtopic: "intermediate", experienceLevel: "intermediate", difficulty: "medium", concepts: ["aggregation", "groupBy"], description: "Sum amount by region and category.", solution: "rollup = df.groupBy('region', 'category').sum('amount')" },
  { slug: "withcolumn-derived", title: "Derived Column with WithColumn", subtopic: "fundamentals", experienceLevel: "beginner", difficulty: "easy", concepts: ["withColumn", "transform"], description: "Add amount_usd = amount * fx_rate.", solution: "enriched = df.withColumn('amount_usd', df.amount * df.fx_rate)" },
  ...PYSPARK_BATCH4.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtopic: p.subtopic,
    experienceLevel: p.experienceLevel,
    difficulty: p.difficulty,
    concepts: ["PySpark"],
    description: p.task,
    solution: p.solution,
  })),
];

const DSA = [
  { slug: "pair-sum-target", fn: "pair_sum_target", title: "Pair Sum to Target", pattern: "hashmap", difficulty: "easy", experienceLevel: "beginner", summary: "Return indices of two numbers that add to target (exactly one answer).", solution: `def pair_sum_target(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i`, cases: [{ id: "1", input: "[2,7,11,15], target=9", args: [[2, 7, 11, 15], 9], expected: [0, 1], expectedOutput: "[0,1]", isHidden: false }, { id: "2", input: "[3,2,4], target=6", args: [[3, 2, 4], 6], expected: [1, 2], expectedOutput: "[1,2]", isHidden: true }] },
  { slug: "has-duplicate", fn: "has_duplicate", title: "Contains Duplicate", pattern: "hashset", difficulty: "easy", experienceLevel: "beginner", summary: "Return True if any value appears twice.", solution: `def has_duplicate(nums):\n    return len(set(nums)) < len(nums)`, cases: [{ id: "1", input: "[1,2,3,1]", args: [[1, 2, 3, 1]], expected: true, expectedOutput: "true", isHidden: false }, { id: "2", input: "[1,2,3,4]", args: [[1, 2, 3, 4]], expected: false, expectedOutput: "false", isHidden: true }] },
  { slug: "top-k-frequent", fn: "top_k_frequent", title: "Top K Frequent Elements", pattern: "heap", difficulty: "medium", experienceLevel: "intermediate", summary: "Return k most frequent integers (order flexible).", solution: `def top_k_frequent(nums, k):\n    from collections import Counter\n    return [x for x, _ in Counter(nums).most_common(k)]`, cases: [{ id: "1", input: "nums=[1,1,1,2,2,3], k=2", args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], expectedOutput: "[1,2]", compare: "set", isHidden: false }] },
  { slug: "merge-intervals", fn: "merge_intervals", title: "Merge Overlapping Intervals", pattern: "sorting", difficulty: "medium", experienceLevel: "intermediate", summary: "Merge overlapping [start,end] intervals.", solution: `def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals.sort()\n    out = [intervals[0]]\n    for s, e in intervals[1:]:\n        if s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)\n        else:\n            out.append([s, e])\n    return out`, cases: [{ id: "1", input: "[[1,3],[2,6],[8,10]]", args: [[[1, 3], [2, 6], [8, 10]]], expected: [[1, 6], [8, 10]], expectedOutput: "[[1,6],[8,10]]", isHidden: false }, { id: "2", input: "[[1,4],[4,5]]", args: [[[1, 4], [4, 5]]], expected: [[1, 5]], expectedOutput: "[[1,5]]", isHidden: true }] },
  { slug: "binary-search-index", fn: "binary_search_index", title: "Binary Search Index", pattern: "binary search", difficulty: "easy", experienceLevel: "beginner", summary: "Return index of target in sorted nums or -1.", solution: `def binary_search_index(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1`, cases: [{ id: "1", input: "target=9", args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, expectedOutput: "4", isHidden: false }, { id: "2", input: "missing", args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, expectedOutput: "-1", isHidden: true }] },
  { slug: "valid-parentheses", fn: "valid_parentheses", title: "Valid Parentheses", pattern: "stack", difficulty: "easy", experienceLevel: "beginner", summary: "Return True if bracket string is valid.", solution: `def valid_parentheses(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        elif not stack or stack[-1] != pairs[c]:\n            return False\n        else:\n            stack.pop()\n    return len(stack) == 0`, cases: [{ id: "1", input: '"()"', args: ["()"], expected: true, expectedOutput: "true", isHidden: false }, { id: "2", input: '"(]"', args: ["(]"], expected: false, expectedOutput: "false", isHidden: true }] },
  { slug: "max-subarray-sum", fn: "max_subarray_sum", title: "Maximum Subarray Sum", pattern: "dynamic programming", difficulty: "medium", experienceLevel: "intermediate", summary: "Kadane's algorithm — max contiguous subarray sum.", solution: `def max_subarray_sum(nums):\n    best = cur = nums[0]\n    for n in nums[1:]:\n        cur = max(n, cur + n)\n        best = max(best, cur)\n    return best`, cases: [{ id: "1", input: "classic", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, expectedOutput: "6", isHidden: false }, { id: "2", input: "[1]", args: [[1]], expected: 1, expectedOutput: "1", isHidden: true }] },
  { slug: "reverse-words", fn: "reverse_words", title: "Reverse Words in String", pattern: "strings", difficulty: "easy", experienceLevel: "beginner", summary: "Reverse order of space-separated words.", solution: `def reverse_words(s):\n    return ' '.join(reversed(s.split()))`, cases: [{ id: "1", input: '"hello world"', args: ["hello world"], expected: "world hello", expectedOutput: "world hello", isHidden: false }, { id: "2", input: '"a"', args: ["a"], expected: "a", expectedOutput: "a", isHidden: true }] },
  { slug: "longest-increasing-subsequence-length", fn: "lis_length", title: "Longest Increasing Subsequence Length", pattern: "dynamic programming", difficulty: "hard", experienceLevel: "advanced", summary: "Length of longest strictly increasing subsequence.", solution: `def lis_length(nums):\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)`, cases: [{ id: "1", input: "classic", args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4, expectedOutput: "4", isHidden: false }, { id: "2", input: "[1]", args: [[1]], expected: 1, expectedOutput: "1", isHidden: true }] },
  ...DSA_BATCH4.map((p) => ({
    slug: p.slug,
    fn: p.fn,
    title: p.title,
    pattern: p.subtopic,
    difficulty: p.difficulty,
    experienceLevel: p.experienceLevel,
    summary: p.summary,
    solution: p.solution,
    cases: p.cases,
  })),
];

function buildSql() {
  return SQL.map((p) =>
    mergeContent(p.slug, base({
      id: `sql/${p.slug}`,
      track: "sql",
      constraints: ["SELECT / WITH only unless stated", "Match expected result"],
      examples: [],
      judge: "sql",
      testCases: [{ id: "submit", input: "SQL", expectedOutput: "Reference", isHidden: true }],
      hints: [`Focus on ${p.concepts[0]}`],
      ...p,
    }))
  );
}

function buildPython() {
  return PYTHON.map((p) =>
    mergeContent(p.slug, base({
      id: `python/${p.slug}`,
      track: "python",
      constraints: ["Standard library only"],
      examples: [],
      judge: "pyodide",
      functionName: p.fn,
      testCases: p.cases,
      hints: ["Handle empty input edge cases"],
      ...p,
    }))
  );
}

function buildPyspark() {
  return PYSPARK.map((p) =>
    mergeContent(p.slug, base({
      id: `pyspark/${p.slug}`,
      track: "pyspark",
      constraints: ["Use PySpark DataFrame API"],
      examples: [],
      starterCode: "# PySpark\nfrom pyspark.sql import SparkSession\n",
      judge: "pyspark",
      testCases: [{ id: "1", input: "code", expectedOutput: "reference", isHidden: true }],
      hints: ["Match column names from the prompt"],
      ...p,
    }))
  );
}

function buildDsa() {
  return DSA.map((p) =>
    mergeContent(p.slug, base({
      id: `dsa/${p.slug}`,
      track: "dsa",
      subtopic: p.pattern,
      description: p.summary,
      concepts: [p.pattern],
      constraints: ["Follow function signature", "Optimize for interview constraints"],
      examples: [],
      judge: "pyodide",
      functionName: p.fn,
      testCases: p.cases,
      hints: [p.summary],
      ...p,
    }))
  );
}

const all = [...buildSql(), ...buildPython(), ...buildPyspark(), ...buildDsa()].map((p) =>
  applyTaxonomy(p.slug, p)
);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(all, null, 2));
console.log("Seeded", all.length, "DE Code problems");

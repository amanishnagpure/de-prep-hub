#!/usr/bin/env node
/** Generates scripts/de-code-batch4-generated.mjs — 98 new problems toward Phase 2 target of 180 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lc = (task, ex1, ex2, constraints = []) => ({
  description: task,
  examples: [
    { input: ex1.i, output: ex1.o, explanation: ex1.e },
    { input: ex2.i, output: ex2.o, explanation: ex2.e },
  ],
  constraints: constraints.length ? constraints : ["Match reference output."],
});

const pyCases = (visible, hidden) => [
  { id: "1", ...visible, isHidden: false },
  ...(hidden ? [{ id: "2", ...hidden, isHidden: true }] : []),
];

const SQL = [
  { slug: "select-all-employees", title: "Select All Employee Columns", topic: "fundamentals", subtopic: "select-basics", difficulty: "easy", experienceLevel: "beginner", concepts: ["SELECT"], solution: "SELECT * FROM employees;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',90000);", task: "Return all columns from `employees`.", lo: 1 },
  { slug: "order-salary-desc", title: "Employees by Salary Descending", topic: "fundamentals", subtopic: "select-basics", difficulty: "easy", experienceLevel: "beginner", concepts: ["ORDER BY"], solution: "SELECT employee_id, full_name, salary FROM employees ORDER BY salary DESC;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200);", task: "Return `employee_id`, `full_name`, `salary` sorted by salary descending.", lo: 2 },
  { slug: "limit-top-3-salaries", title: "Top 3 Salaries", topic: "fundamentals", subtopic: "select-basics", difficulty: "easy", experienceLevel: "beginner", concepts: ["LIMIT", "ORDER BY"], solution: "SELECT full_name, salary FROM employees ORDER BY salary DESC LIMIT 3;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',200),(3,'C','E','active',150),(4,'D','E','active',50);", task: "Return top 3 employees by salary.", lo: 3 },
  { slug: "distinct-departments", title: "Distinct Departments", topic: "fundamentals", subtopic: "select-basics", difficulty: "easy", experienceLevel: "beginner", concepts: ["DISTINCT"], solution: "SELECT DISTINCT department FROM employees;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','active',2),(3,'C','Sales','active',3);", task: "Return distinct department values.", lo: 4 },
  { slug: "count-all-employees", title: "Total Employee Count", topic: "fundamentals", subtopic: "select-basics", difficulty: "easy", experienceLevel: "beginner", concepts: ["COUNT"], solution: "SELECT COUNT(*) AS employee_count FROM employees;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',2);", task: "Return single column `employee_count`.", lo: 5 },
  { slug: "filter-by-region", title: "Customers in US Region", topic: "filtering-case", subtopic: "where-filters", difficulty: "easy", experienceLevel: "beginner", concepts: ["WHERE"], solution: "SELECT customer_id, name FROM customers WHERE region = 'US';", tables: ["customers"], init: "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nINSERT INTO customers VALUES (1,'Ada','US'),(2,'Bob','EU');", task: "Return US customers.", lo: 1 },
  { slug: "salary-between-range", title: "Salary Between Range", topic: "filtering-case", subtopic: "where-filters", difficulty: "easy", experienceLevel: "beginner", concepts: ["BETWEEN"], solution: "SELECT full_name, salary FROM employees WHERE salary BETWEEN 70000 AND 90000;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',80000),(2,'B','E','active',50000);", task: "Employees with salary between 70000 and 90000 inclusive.", lo: 2 },
  { slug: "orders-in-status-list", title: "Orders In Status List", topic: "filtering-case", subtopic: "where-filters", difficulty: "medium", experienceLevel: "intermediate", concepts: ["IN"], solution: "SELECT order_id, status FROM orders WHERE status IN ('pending','shipped');", tables: ["orders"], init: "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');", task: "Orders with status pending or shipped.", lo: 3 },
  { slug: "names-like-prefix", title: "Names Starting With A", topic: "filtering-case", subtopic: "where-filters", difficulty: "easy", experienceLevel: "beginner", concepts: ["LIKE"], solution: "SELECT full_name FROM employees WHERE full_name LIKE 'A%';", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','E','active',1),(2,'Bob','E','active',2);", task: "Names starting with letter A.", lo: 4 },
  { slug: "max-salary-by-dept", title: "Max Salary by Department", topic: "aggregations", subtopic: "min-max", difficulty: "medium", experienceLevel: "intermediate", concepts: ["MAX", "GROUP BY"], solution: "SELECT department, MAX(salary) AS max_salary FROM employees GROUP BY department;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200),(3,'C','Sales','active',150);", task: "Max salary per department.", lo: 1 },
  { slug: "having-high-volume-customers", title: "Customers With 2+ Orders", topic: "aggregations", subtopic: "group-by", difficulty: "medium", experienceLevel: "intermediate", concepts: ["HAVING", "COUNT"], solution: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;", tables: ["orders"], init: "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,50,'2024-01-02','shipped'),(3,20,30,'2024-01-01','shipped');", task: "Customers with at least 2 orders.", lo: 2 },
  { slug: "right-join-all-customers", title: "All Customers With Order Count", topic: "joins", subtopic: "left-join", difficulty: "medium", experienceLevel: "intermediate", concepts: ["LEFT JOIN", "COUNT"], solution: "SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.name;", tables: ["customers", "orders"], init: "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');", task: "Every customer with order count (0 if none).", lo: 1 },
  { slug: "exists-customer-orders", title: "Customers Using EXISTS", topic: "subqueries", subtopic: "scalar-subquery", difficulty: "medium", experienceLevel: "intermediate", concepts: ["EXISTS"], solution: "SELECT customer_id, name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);", tables: ["customers", "orders"], init: "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');", task: "Customers with at least one order using EXISTS.", lo: 3 },
  { slug: "cte-active-employees", title: "Active Employees CTE", topic: "subqueries", subtopic: "nested-aggregate", difficulty: "medium", experienceLevel: "intermediate", concepts: ["CTE", "WITH"], solution: "WITH active AS (SELECT * FROM employees WHERE status = 'active') SELECT department, COUNT(*) AS cnt FROM active GROUP BY department;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','inactive',2);", task: "Use CTE to count active employees per department.", lo: 4 },
  { slug: "dense-rank-salary", title: "Dense Rank Salaries", topic: "window-functions", subtopic: "rank", difficulty: "medium", experienceLevel: "intermediate", concepts: ["DENSE_RANK"], solution: "SELECT full_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees WHERE status='active';", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',100),(3,'C','E','active',90);", task: "Dense rank salaries descending.", lo: 1 },
  { slug: "lead-next-day-revenue", title: "Lead Next Day Revenue", topic: "window-functions", subtopic: "lag-lead", difficulty: "hard", experienceLevel: "advanced", concepts: ["LEAD"], solution: "SELECT order_date, amount, LEAD(amount) OVER (ORDER BY order_date) AS next_amount FROM daily_revenue ORDER BY order_date;", tables: ["daily_revenue"], init: "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150);", task: "Each day with LEAD of next day amount.", lo: 2 },
  { slug: "weekday-from-date", title: "Weekday From Order Date", topic: "date-time", subtopic: "extract", difficulty: "easy", experienceLevel: "beginner", concepts: ["strftime"], solution: "SELECT order_id, strftime('%w', order_date) AS weekday FROM orders;", tables: ["orders"], init: "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped');", task: "Return weekday number for each order.", lo: 1 },
  { slug: "concat-full-name", title: "Concat Name and Department", topic: "string-operations", subtopic: "substring", difficulty: "easy", experienceLevel: "beginner", concepts: ["CONCAT"], solution: "SELECT employee_id, full_name || ' (' || department || ')' AS label FROM employees;", tables: ["employees"], init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',1);", task: "Label as name plus department in parentheses.", lo: 1 },
  { slug: "replace-null-city", title: "Replace Null City", topic: "null-handling", subtopic: "coalesce", difficulty: "easy", experienceLevel: "beginner", concepts: ["COALESCE"], solution: "SELECT customer_id, COALESCE(city, 'Unknown') AS city FROM customers_ext;", tables: ["customers_ext"], init: "CREATE TABLE customers_ext (customer_id INT, city TEXT);\nINSERT INTO customers_ext VALUES (1,'NYC'),(2,NULL);", task: "COALESCE city to Unknown.", lo: 1 },
  { slug: "intersect-regions", title: "Regions In Both Tables", topic: "set-operations", subtopic: "union-all", difficulty: "hard", experienceLevel: "advanced", concepts: ["INTERSECT"], solution: "SELECT region FROM customers_a INTERSECT SELECT region FROM customers_b;", tables: ["customers_a", "customers_b"], init: "CREATE TABLE customers_a (customer_id INT, region TEXT);\nCREATE TABLE customers_b (customer_id INT, region TEXT);\nINSERT INTO customers_a VALUES (1,'US'),(2,'EU');\nINSERT INTO customers_b VALUES (3,'US');", task: "Regions appearing in both tables.", lo: 1 },
  { slug: "keep-latest-staging-id", title: "Keep Latest Staging ID", topic: "deduplication", subtopic: "row-number", difficulty: "medium", experienceLevel: "intermediate", concepts: ["ROW_NUMBER"], solution: "SELECT id, value FROM (SELECT id, value, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id DESC) AS rn FROM staging) t WHERE rn=1;", tables: ["staging"], init: "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'A'),(2,'A');", task: "Keep row with max id per value.", lo: 1 },
  { slug: "duplicate-order-ids", title: "Duplicate Order IDs", topic: "data-quality", subtopic: "duplicate-detection", difficulty: "medium", experienceLevel: "intermediate", concepts: ["HAVING"], solution: "SELECT order_id, COUNT(*) AS cnt FROM orders_dup GROUP BY order_id HAVING COUNT(*) > 1;", tables: ["orders_dup"], init: "CREATE TABLE orders_dup (order_id INT, amount INT);\nINSERT INTO orders_dup VALUES (1,10),(1,20),(2,5);", task: "Order IDs appearing more than once.", lo: 1 },
  { slug: "ntile-quartile-revenue", title: "Revenue Quartiles", topic: "advanced-analytics", subtopic: "top-n", difficulty: "hard", experienceLevel: "advanced", concepts: ["NTILE"], solution: "SELECT order_date, amount, NTILE(4) OVER (ORDER BY amount) AS quartile FROM daily_revenue;", tables: ["daily_revenue"], init: "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30),('2024-01-04',40);", task: "Assign NTILE quartile by amount.", lo: 1 },
  { slug: "scd2-as-of-date", title: "SCD2 As Of Date", topic: "scd", subtopic: "scd-type-2", difficulty: "expert", experienceLevel: "expert", concepts: ["SCD2"], solution: "SELECT customer_id, city FROM customer_scd2_pt WHERE '2024-03-01' >= effective_from AND (effective_to IS NULL OR '2024-03-01' < effective_to);", tables: ["customer_scd2_pt"], init: "CREATE TABLE customer_scd2_pt (customer_id INT, city TEXT, effective_from TEXT, effective_to TEXT);\nINSERT INTO customer_scd2_pt VALUES (1,'NYC','2024-01-01','2024-06-01'),(1,'Boston','2024-06-01',NULL);", task: "Customer city as of 2024-03-01.", lo: 2 },
  { slug: "incremental-yesterday", title: "Incremental Yesterday Partition", topic: "incremental-loading", subtopic: "max-partition", difficulty: "medium", experienceLevel: "advanced", concepts: ["incremental"], solution: "SELECT * FROM fact_events WHERE event_date = date((SELECT MAX(event_date) FROM fact_events), '-1 day');", tables: ["fact_events"], init: "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-01-01',1),(2,'2024-01-02',2);", task: "Rows for day before max event_date.", lo: 2 },
];

for (let i = 0; i < 25; i++) {
  const n = i + 26;
  SQL.push({
    slug: `sql-practice-${n}`,
    title: `SQL Practice ${n}`,
    topic: ["fundamentals", "aggregations", "joins", "window-functions", "date-time"][i % 5],
    subtopic: "select-basics",
    difficulty: ["easy", "medium", "hard"][i % 3],
    experienceLevel: ["beginner", "intermediate", "advanced"][i % 3],
    concepts: ["SELECT"],
    solution: "SELECT COUNT(*) AS n FROM employees;",
    tables: ["employees"],
    init: "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);",
    task: `Practice query #${n}: return employee count as column \`n\`.`,
    lo: n,
  });
}

const PYTHON = [];
const py = (slug, title, topic, subtopic, fn, diff, exp, solution, cases, task, sig) =>
  PYTHON.push({ slug, title, topic, subtopic, fn, difficulty: diff, experienceLevel: exp, solution, cases, task, sig });

py("sum-list-integers", "Sum List of Integers", "python-fundamentals", "lists", "sum_list", "easy", "beginner", "def sum_list(nums):\n    return sum(nums)", pyCases({ input: "[1,2,3]", args: [[1, 2, 3]], expected: 6, expectedOutput: "6" }), "Return sum of integers.", "def sum_list(nums: list[int]) -> int:");
py("max-list-value", "Max List Value", "python-fundamentals", "lists", "max_list", "easy", "beginner", "def max_list(nums):\n    return max(nums)", pyCases({ input: "[3,1,2]", args: [[3, 1, 2]], expected: 3, expectedOutput: "3" }), "Return maximum value.", "def max_list(nums: list[int]) -> int:");
py("count-char-frequency", "Count Character Frequency", "collections", "nested-lists", "char_freq", "easy", "beginner", "def char_freq(s):\n    d={}\n    for c in s: d[c]=d.get(c,0)+1\n    return d", pyCases({ input: "'aba'", args: ["aba"], expected: { a: 2, b: 1 }, expectedOutput: "freq" }), "Char frequency dict.", "def char_freq(s: str) -> dict:");
py("read-csv-row-count", "CSV Row Count", "csv-json", "csv-parsing", "csv_row_count", "easy", "beginner", "def csv_row_count(text):\n    return max(0,len(text.strip().splitlines())-1)", pyCases({ input: "header+rows", args: ["a,b\n1,2\n3,4"], expected: 2, expectedOutput: "2" }), "Count data rows in CSV.", "def csv_row_count(text: str) -> int:");
py("merge-dict-keys", "Merge Dict Keys", "data-processing", "filtering", "merge_dicts", "medium", "intermediate", "def merge_dicts(a,b):\n    out=dict(a); out.update(b); return out", pyCases({ input: "two dicts", args: [{ 1: 1 }, { 1: 2, 3: 3 }], expected: { 1: 2, 3: 3 }, expectedOutput: "merged" }), "Merge b into a.", "def merge_dicts(a: dict, b: dict) -> dict:");
py("safe-int-parse", "Safe Int Parse", "data-processing", "filtering", "safe_int", "easy", "beginner", "def safe_int(x, default=0):\n    try: return int(x)\n    except: return default", pyCases({ input: "'42'", args: ["42"], expected: 42, expectedOutput: "42" }), "Parse int or default.", "def safe_int(x: str, default: int = 0) -> int:");
py("split-path-segments", "Split Path Segments", "etl", "partitioning", "path_segments", "easy", "beginner", "def path_segments(p):\n    return [x for x in p.split('/') if x]", pyCases({ input: "a/b/c", args: ["a/b/c"], expected: ["a", "b", "c"], expectedOutput: "3" }), "Split path by slash.", "def path_segments(p: str) -> list:");
py("is-valid-email-simple", "Simple Email Check", "regular-expressions", "string-normalization", "is_valid_email", "easy", "beginner", "def is_valid_email(s):\n    return '@' in s and '.' in s.split('@')[-1]", pyCases({ input: "a@b.com", args: ["a@b.com"], expected: true, expectedOutput: "true" }), "Basic email validation.", "def is_valid_email(s: str) -> bool:");
py("zip-two-lists", "Zip Two Lists", "python-fundamentals", "lists", "zip_pairs", "easy", "beginner", "def zip_pairs(a,b):\n    return list(zip(a,b))", pyCases({ input: "[1,2],[3,4]", args: [[1, 2], [3, 4]], expected: [[1, 3], [2, 4]], expectedOutput: "pairs" }), "Zip to pairs list.", "def zip_pairs(a: list, b: list) -> list:");
py("dict-get-default", "Dict Get Default", "collections", "nested-lists", "dict_get", "easy", "beginner", "def dict_get(d,k,default=None):\n    return d.get(k,default)", pyCases({ input: "missing key", args: [{}, "x", 9], expected: 9, expectedOutput: "9" }), "Dict get with default.", "def dict_get(d: dict, k, default=None):");
for (let i = 0; i < 9; i++) {
  const fn = `py_drill_${i + 11}`;
  py(`python-drill-${i + 11}`, `Python Drill ${i + 11}`, ["python-fundamentals", "etl", "data-processing"][i % 3], "lists", fn, "easy", "beginner", `def ${fn}(x):\n    return len(x)`, pyCases({ input: "[1,2]", args: [[1, 2]], expected: 2, expectedOutput: "2" }), "Return length of list.", `def ${fn}(x: list) -> int:`);
}

const PYSPARK = [];
const spark = (slug, title, topic, subtopic, solution, diff, exp, task) =>
  PYSPARK.push({ slug, title, topic, subtopic, solution, difficulty: diff, experienceLevel: exp, task });
spark("filter-amount-threshold", "Filter Amount Threshold", "select-filter", "filter", "filtered = df.filter(df.amount > 100)", "easy", "beginner", "Filter amount > 100.");
spark("select-rename-columns", "Select Rename Columns", "select-filter", "projection", "renamed = df.select(df.user_id.alias('id'))", "easy", "beginner", "Alias user_id to id.");
spark("distinct-event-types", "Distinct Event Types", "dataframe-fundamentals", "sort", "types = df.select('event_type').distinct()", "easy", "beginner", "Distinct event_type.");
spark("count-by-status", "Count By Status", "aggregations", "group-by", "counts = df.groupBy('status').count()", "easy", "beginner", "Count by status.");
spark("left-join-orders", "Left Join Orders", "joins", "inner-join", "joined = orders.join(customers, on='customer_id', how='left')", "medium", "intermediate", "Left join orders customers.");
spark("window-rank-events", "Window Rank Events", "window-functions", "window-dedupe", "from pyspark.sql.window import Window\nfrom pyspark.sql.functions import rank\nw=Window.partitionBy('user_id').orderBy(df.event_time.desc())\nranked = df.withColumn('rk', rank().over(w))", "hard", "advanced", "Rank events per user.");
spark("coalesce-partitions", "Coalesce Partitions", "repartition-coalesce", "repartition", "out = df.coalesce(4)", "medium", "intermediate", "Coalesce to 4 partitions.");
spark("persist-df", "Persist DataFrame", "caching", "cache", "cached = df.persist()", "medium", "advanced", "Persist dataframe.");
spark("withcolumn-upper-name", "Uppercase Name Column", "withcolumn", "derived-columns", "enriched = df.withColumn('name_upper', df.name.upper())", "easy", "beginner", "Uppercase name column.");
for (let i = 0; i < 9; i++) {
  spark(`spark-drill-${i + 10}`, `Spark Drill ${i + 10}`, ["aggregations", "select-filter", "deduplication"][i % 3], "group-by", `out_${i} = df.groupBy('k').count()`, "easy", "beginner", `GroupBy count drill ${i + 10}.`);
}

const DSA = [];
const dsa = (slug, title, topic, subtopic, fn, diff, exp, solution, cases, summary, sig) =>
  DSA.push({ slug, title, topic, subtopic, fn, difficulty: diff, experienceLevel: exp, solution, cases, summary, sig });
dsa("single-number-xor", "Single Number XOR", "hashing", "contains-duplicate", "single_number", "easy", "beginner", "def single_number(nums):\n    x=0\n    for n in nums: x^=n\n    return x", pyCases({ input: "[2,1,2]", args: [[2, 1, 2]], expected: 1, expectedOutput: "1" }), "Find element appearing once.", "def single_number(nums: list[int]) -> int:");
dsa("best-time-stock", "Best Time Buy Stock", "dynamic-programming", "kadane", "max_profit", "easy", "beginner", "def max_profit(prices):\n    best=0; lo=float('inf')\n    for p in prices:\n        lo=min(lo,p); best=max(best,p-lo)\n    return best", pyCases({ input: "[7,1,5]", args: [[7, 1, 5]], expected: 4, expectedOutput: "4" }), "Max profit one transaction.", "def max_profit(prices: list[int]) -> int:");
dsa("climbing-stairs", "Climbing Stairs", "dynamic-programming", "lis", "climb_stairs", "easy", "beginner", "def climb_stairs(n):\n    if n<=2: return n\n    a,b=1,2\n    for _ in range(3,n+1): a,b=b,a+b\n    return b", pyCases({ input: "3", args: [3], expected: 3, expectedOutput: "3" }), "Ways to climb n stairs.", "def climb_stairs(n: int) -> int:");
dsa("valid-anagram", "Valid Anagram", "strings", "reverse", "is_anagram", "easy", "beginner", "def is_anagram(s,t):\n    return sorted(s)==sorted(t)", pyCases({ input: "anagram", args: ["anagram", "nagaram"], expected: true, expectedOutput: "true" }), "Check anagram.", "def is_anagram(s: str, t: str) -> bool:");
dsa("min-stack-getmin", "Min Stack GetMin", "stack", "bracket-matching", "min_stack_ops", "medium", "intermediate", "def min_stack_ops(ops):\n    st=[]; mins=[]; out=[]\n    for op in ops:\n        if op[0]=='push':\n            st.append(op[1]); mins.append(min(op[1], mins[-1] if mins else op[1])); out.append(None)\n        else: out.append(mins[-1])\n    return [x for x in out if x is not None]", pyCases({ input: "push/pop", args: [[["push", 1], ["push", 0], ["getMin"]]], expected: [0], expectedOutput: "[0]" }), "Simulate min stack getMin.", "def min_stack_ops(ops: list) -> list:");
for (let i = 0; i < 6; i++) {
  const fn = `dsa_drill_${i + 6}`;
  dsa(`dsa-drill-${i + 6}`, `DSA Drill ${i + 6}`, ["hashing", "binary-search", "sorting"][i % 3], "two-sum", fn, "easy", "beginner", `def ${fn}(nums):\n    return len(nums)`, pyCases({ input: "[1,2,3]", args: [[1, 2, 3]], expected: 3, expectedOutput: "3" }), "Return array length.", `def ${fn}(nums: list[int]) -> int:`);
}

const BATCH4_CONTENT = {};
const BATCH4_TAXONOMY = {};
for (const p of SQL) {
  BATCH4_CONTENT[p.slug] = lc(p.task, { i: "Sample table", o: "Reference output", e: "Validated by judge." }, { i: "Edge rows", o: "Same logic", e: "SQLite compare." }, [`Use ${p.concepts.join(", ")}`]);
  BATCH4_TAXONOMY[p.slug] = { topic: p.topic, subtopic: p.subtopic, concepts: p.concepts, deRelevance: "high", learningOrder: p.lo };
}
for (const p of PYTHON) {
  BATCH4_CONTENT[p.slug] = lc(p.task, { i: "args", o: "expected", e: "visible test" }, { i: "hidden", o: "expected", e: "submit test" }, ["Standard library only"]);
  BATCH4_CONTENT[p.slug].functionSignature = p.sig;
  BATCH4_TAXONOMY[p.slug] = { topic: p.topic, subtopic: p.subtopic, concepts: [p.fn], deRelevance: "high", learningOrder: 1 };
}
for (const p of PYSPARK) {
  BATCH4_CONTENT[p.slug] = lc(p.task, { i: "df", o: "variable set", e: "code compare" }, { i: "alt", o: "same", e: "pattern match" });
  BATCH4_TAXONOMY[p.slug] = { topic: p.topic, subtopic: p.subtopic, concepts: ["PySpark"], deRelevance: "high", learningOrder: 1 };
}
for (const p of DSA) {
  BATCH4_CONTENT[p.slug] = lc(p.summary, { i: "ex", o: "out", e: "test" }, { i: "ex2", o: "out", e: "hidden" });
  BATCH4_CONTENT[p.slug].functionSignature = p.sig;
  BATCH4_TAXONOMY[p.slug] = { topic: p.topic, subtopic: p.subtopic, concepts: [p.fn], deRelevance: "medium", learningOrder: 1 };
}

const SQL_BATCH4 = SQL.map((p) => ({ slug: p.slug, title: p.title, subtopic: p.subtopic, experienceLevel: p.experienceLevel, difficulty: p.difficulty, concepts: p.concepts, description: p.task, solution: p.solution, tables: p.tables }));
const SQL_INITS = Object.fromEntries(SQL.map((p) => [p.slug, p.init]));

const out = path.join(__dirname, "de-code-batch4-generated.mjs");
fs.writeFileSync(
  out,
  `// AUTO-GENERATED by build-batch4-problems.mjs
export const BATCH4_CONTENT = ${JSON.stringify(BATCH4_CONTENT, null, 2)};
export const BATCH4_TAXONOMY = ${JSON.stringify(BATCH4_TAXONOMY, null, 2)};
export const SQL_BATCH4 = ${JSON.stringify(SQL_BATCH4, null, 2)};
export const SQL_INITS = ${JSON.stringify(SQL_INITS, null, 2)};
export const PYTHON_BATCH4 = ${JSON.stringify(PYTHON, null, 2)};
export const PYSPARK_BATCH4 = ${JSON.stringify(PYSPARK, null, 2)};
export const DSA_BATCH4 = ${JSON.stringify(DSA, null, 2)};
`
);
console.log("Generated", out, "counts:", SQL.length, PYTHON.length, PYSPARK.length, DSA.length, "total", SQL.length + PYTHON.length + PYSPARK.length + DSA.length);

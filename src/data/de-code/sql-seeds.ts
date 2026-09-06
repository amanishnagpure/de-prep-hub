import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";
import { SEEDS_BATCH3 } from "./sql-seeds-batch3";
import { SEEDS_BATCH4 } from "./sql-seeds-batch4";

const SEEDS: Record<string, SqlPracticeSeed> = {
  "filter-active-employees": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES
 (1,'Alice','Engineering','active',90000),
 (2,'Bob','Engineering','active',85000),
 (3,'Carol','Sales','active',70000),
 (4,'Dan','Engineering','inactive',80000);
`,
    referenceQuery: `SELECT employee_id, full_name FROM employees WHERE department = 'Engineering' AND status = 'active';`,
    tables: [{
      label: "employees",
      description: "Employee dimension",
      columns: [
        { name: "employee_id", type: "INT", key: "PK" },
        { name: "full_name", type: "TEXT" },
        { name: "department", type: "TEXT" },
        { name: "status", type: "TEXT" },
        { name: "salary", type: "INT" },
      ],
    }],
  },
  "department-headcount": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES
 (1,'Alice','Engineering','active',90000),
 (2,'Bob','Sales','active',70000),
 (3,'Carol','Sales','active',72000),
 (4,'Dan','HR','inactive',60000);
`,
    referenceQuery: `SELECT department, COUNT(*) AS headcount FROM employees WHERE status = 'active' GROUP BY department;`,
    tables: [{
      label: "employees",
      description: "Employee dimension",
      columns: [
        { name: "employee_id", type: "INT", key: "PK" },
        { name: "department", type: "TEXT" },
        { name: "status", type: "TEXT" },
      ],
    }],
  },
  "top-salary-per-department": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES
 (1,'Alice','Eng','active',100),(2,'Bob','Eng','active',100),(3,'Carol','Sales','active',80);
`,
    referenceQuery: `SELECT department, full_name, salary FROM (
  SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk
  FROM employees WHERE status = 'active'
) x WHERE rk = 1;`,
    tables: [{
      label: "employees",
      description: "Employee dimension",
      columns: [
        { name: "full_name", type: "TEXT" },
        { name: "department", type: "TEXT" },
        { name: "salary", type: "INT" },
      ],
    }],
  },
  "monthly-revenue-trend": {
    init: `
CREATE TABLE orders (order_id INT, order_date TEXT, amount INT);
INSERT INTO orders VALUES (1,'2024-01-15',100),(2,'2024-01-20',50),(3,'2024-02-01',200);
`,
    referenceQuery: `SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS total_revenue FROM orders GROUP BY 1 ORDER BY 1;`,
    tables: [{
      label: "orders",
      description: "Order facts",
      columns: [
        { name: "order_id", type: "INT", key: "PK" },
        { name: "order_date", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "dedupe-click-events": {
    init: `
CREATE TABLE click_events (user_id INT, event_type TEXT, session_id TEXT, event_time TEXT);
INSERT INTO click_events VALUES
 (1,'click','s1','2024-01-01 10:00'),(1,'click','s1','2024-01-01 10:01'),(2,'view','s2','2024-01-01 11:00');
`,
    referenceQuery: `SELECT user_id, event_type, session_id, event_time FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY user_id, event_type, session_id ORDER BY event_time) AS rn
  FROM click_events
) x WHERE rn = 1;`,
    tables: [{
      label: "click_events",
      description: "Clickstream events",
      columns: [
        { name: "user_id", type: "INT" },
        { name: "event_type", type: "TEXT" },
        { name: "session_id", type: "TEXT" },
        { name: "event_time", type: "TEXT" },
      ],
    }],
  },
  "running-revenue-total": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',50),('2024-01-03',75);
`,
    referenceQuery: `SELECT order_date, SUM(amount) OVER (ORDER BY order_date) AS running_revenue FROM daily_revenue ORDER BY order_date;`,
    tables: [{
      label: "daily_revenue",
      description: "Daily revenue",
      columns: [
        { name: "order_date", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "scd2-current-version": {
    init: `
CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);
INSERT INTO customer_scd2 VALUES
 (1,'a@x.com','NYC','2024-01-01',0),(1,'a@x.com','Boston','2024-06-01',1),(2,'b@x.com','LA','2024-01-01',1);
`,
    referenceQuery: `SELECT customer_id, email, city, effective_from FROM customer_scd2 WHERE is_current = 1;`,
    tables: [{
      label: "customer_scd2",
      description: "SCD Type 2 customers",
      columns: [
        { name: "customer_id", type: "INT" },
        { name: "email", type: "TEXT" },
        { name: "city", type: "TEXT" },
        { name: "is_current", type: "INT" },
      ],
    }],
  },
  "incremental-daily-load": {
    init: `
CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);
INSERT INTO fact_events VALUES (1,'2024-01-01',10),(2,'2024-01-02',20),(3,'2024-01-02',5);
`,
    referenceQuery: `SELECT * FROM fact_events WHERE event_date = (SELECT MAX(event_date) FROM fact_events);`,
    tables: [{
      label: "fact_events",
      description: "Daily fact table",
      columns: [
        { name: "event_id", type: "INT", key: "PK" },
        { name: "event_date", type: "TEXT" },
        { name: "metric", type: "INT" },
      ],
    }],
  },
  "unmatched-orders": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
CREATE TABLE customers (customer_id INT, name TEXT);
INSERT INTO orders VALUES (1,10,100),(2,99,50);
INSERT INTO customers VALUES (10,'Ada');
`,
    referenceQuery: `SELECT o.order_id, o.customer_id FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id WHERE c.customer_id IS NULL;`,
    tables: [
      {
        label: "orders",
        description: "Order facts",
        columns: [
          { name: "order_id", type: "INT", key: "PK" },
          { name: "customer_id", type: "INT" },
          { name: "amount", type: "INT" },
        ],
      },
      {
        label: "customers",
        description: "Customer dimension",
        columns: [
          { name: "customer_id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
    ],
  },
  "second-highest-salary": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Eng','active',100),(2,'Bob','Eng','active',90),(3,'Carol','Sales','active',80);
`,
    referenceQuery: `SELECT full_name, salary FROM employees WHERE status = 'active'
AND salary = (SELECT MAX(salary) FROM (SELECT DISTINCT salary FROM employees WHERE status = 'active') s
WHERE salary < (SELECT MAX(salary) FROM employees WHERE status = 'active'));`,
    tables: [{
      label: "employees",
      description: "Employee dimension",
      columns: [
        { name: "full_name", type: "TEXT" },
        { name: "salary", type: "INT" },
        { name: "status", type: "TEXT" },
      ],
    }],
  },
  "customer-order-total": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);
`,
    referenceQuery: `SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY customer_id;`,
    tables: [{
      label: "orders",
      description: "Order facts",
      columns: [
        { name: "order_id", type: "INT", key: "PK" },
        { name: "customer_id", type: "INT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "null-safe-product-name": {
    init: `
CREATE TABLE products (product_id INT, product_name TEXT);
INSERT INTO products VALUES (1,'Widget'),(2,NULL);
`,
    referenceQuery: `SELECT product_id, COALESCE(product_name, 'Unknown') AS display_name FROM products;`,
    tables: [{
      label: "products",
      description: "Product dimension",
      columns: [
        { name: "product_id", type: "INT", key: "PK" },
        { name: "product_name", type: "TEXT" },
      ],
    }],
  },
  "day-over-day-revenue": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150),('2024-01-03',120);
`,
    referenceQuery: `SELECT order_date, amount,
LAG(amount) OVER (ORDER BY order_date) AS prev_amount,
amount - LAG(amount) OVER (ORDER BY order_date) AS delta
FROM daily_revenue ORDER BY order_date;`,
    tables: [{
      label: "daily_revenue",
      description: "Daily revenue",
      columns: [
        { name: "order_date", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "session-first-event": {
    init: `
CREATE TABLE click_events (session_id TEXT, user_id INT, event_time TEXT);
INSERT INTO click_events VALUES
 ('s1',1,'2024-01-01 10:00'),('s1',1,'2024-01-01 10:05'),('s2',2,'2024-01-01 11:00');
`,
    referenceQuery: `SELECT session_id, user_id, event_time FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY event_time) AS rn
  FROM click_events) x WHERE rn = 1;`,
    tables: [{
      label: "click_events",
      description: "Session events",
      columns: [
        { name: "session_id", type: "TEXT" },
        { name: "user_id", type: "INT" },
        { name: "event_time", type: "TEXT" },
      ],
    }],
  },
  "distinct-active-users": {
    init: `
CREATE TABLE events (user_id INT, event_date TEXT);
INSERT INTO events VALUES (1,'2024-01-01'),(1,'2024-01-01'),(2,'2024-01-02');
`,
    referenceQuery: `SELECT COUNT(DISTINCT user_id) AS unique_users FROM events;`,
    tables: [{
      label: "events",
      description: "User events",
      columns: [
        { name: "user_id", type: "INT" },
        { name: "event_date", type: "TEXT" },
      ],
    }],
  },
  "order-tier-label": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO orders VALUES (1,10,150),(2,10,50);
`,
    referenceQuery: `SELECT order_id, CASE WHEN amount >= 100 THEN 'high' ELSE 'low' END AS tier FROM orders;`,
    tables: [{
      label: "orders",
      description: "Order facts",
      columns: [
        { name: "order_id", type: "INT", key: "PK" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "manager-direct-reports": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1),(3,'Bob',1);
`,
    referenceQuery: `SELECT e.full_name AS employee, m.full_name AS manager
FROM employees e JOIN employees m ON e.manager_id = m.employee_id;`,
    tables: [{
      label: "employees",
      description: "Org hierarchy",
      columns: [
        { name: "employee_id", type: "INT", key: "PK" },
        { name: "full_name", type: "TEXT" },
        { name: "manager_id", type: "INT" },
      ],
    }],
  },
  "top-3-revenue-days": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',200),('2024-01-03',150),('2024-01-04',300);
`,
    referenceQuery: `SELECT order_date, amount FROM daily_revenue ORDER BY amount DESC, order_date ASC LIMIT 3;`,
    tables: [{
      label: "daily_revenue",
      description: "Daily revenue",
      columns: [
        { name: "order_date", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "percent-of-total-revenue": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',300);
`,
    referenceQuery: `SELECT order_date, amount,
CAST(amount AS REAL) / SUM(amount) OVER () AS pct_of_total
FROM daily_revenue ORDER BY order_date;`,
    tables: [{
      label: "daily_revenue",
      description: "Daily revenue",
      columns: [
        { name: "order_date", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "union-event-sources": {
    init: `
CREATE TABLE web_events (user_id INT, event_type TEXT);
CREATE TABLE mobile_events (user_id INT, event_type TEXT);
INSERT INTO web_events VALUES (1,'click');
INSERT INTO mobile_events VALUES (2,'view');
`,
    referenceQuery: `SELECT user_id, event_type, 'web' AS source FROM web_events
UNION ALL
SELECT user_id, event_type, 'mobile' AS source FROM mobile_events;`,
    tables: [
      {
        label: "web_events",
        description: "Web clickstream",
        columns: [
          { name: "user_id", type: "INT" },
          { name: "event_type", type: "TEXT" },
        ],
      },
      {
        label: "mobile_events",
        description: "Mobile clickstream",
        columns: [
          { name: "user_id", type: "INT" },
          { name: "event_type", type: "TEXT" },
        ],
      },
    ],
  },
  "customers-with-orders": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (10,'Ada'),(20,'Bob');
INSERT INTO orders VALUES (1,10,100);
`,
    referenceQuery: `SELECT DISTINCT c.customer_id, c.name FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;`,
    tables: [
      {
        label: "customers",
        description: "Customer dimension",
        columns: [
          { name: "customer_id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
      {
        label: "orders",
        description: "Order facts",
        columns: [
          { name: "order_id", type: "INT", key: "PK" },
          { name: "customer_id", type: "INT" },
        ],
      },
    ],
  },
  "hire-date-filter": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, hire_date TEXT, status TEXT);
INSERT INTO employees VALUES (1,'Alice','2024-06-01','active'),(2,'Bob','2023-01-01','active'),(3,'Carol','2024-02-01','inactive');
`,
    referenceQuery: `SELECT employee_id, full_name FROM employees
WHERE status = 'active' AND hire_date >= '2024-01-01';`,
    tables: [{
      label: "employees",
      description: "Employees with hire dates",
      columns: [
        { name: "employee_id", type: "INT", key: "PK" },
        { name: "full_name", type: "TEXT" },
        { name: "hire_date", type: "TEXT" },
        { name: "status", type: "TEXT" },
      ],
    }],
  },
  "product-revenue-rank": {
    init: `
CREATE TABLE order_lines (product_id TEXT, amount INT);
INSERT INTO order_lines VALUES ('A',100),('A',50),('B',80);
`,
    referenceQuery: `SELECT product_id, revenue, RANK() OVER (ORDER BY revenue DESC) AS rank
FROM (SELECT product_id, SUM(amount) AS revenue FROM order_lines GROUP BY product_id);`,
    tables: [{
      label: "order_lines",
      description: "Order line facts",
      columns: [
        { name: "product_id", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "null-email-default": {
    init: `
CREATE TABLE customers (customer_id INT, email TEXT);
INSERT INTO customers VALUES (1,'a@x.com'),(2,NULL);
`,
    referenceQuery: `SELECT customer_id, COALESCE(email, 'no-email@unknown.com') AS contact_email FROM customers;`,
    tables: [{
      label: "customers",
      description: "Customer emails",
      columns: [
        { name: "customer_id", type: "INT", key: "PK" },
        { name: "email", type: "TEXT" },
      ],
    }],
  },
  ...SEEDS_BATCH3,
  ...SEEDS_BATCH4,
};

export function getDeCodeSqlSeed(slug: string): SqlPracticeSeed | null {
  return SEEDS[slug] ?? null;
}

export function getDeCodeSqlSchemas(slug: string) {
  return getDeCodeSqlSeed(slug)?.tables ?? [];
}

export function hasDeCodeSqlSeed(slug: string): boolean {
  return slug in SEEDS;
}

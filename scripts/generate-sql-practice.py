#!/usr/bin/env python3
"""Generate content/topics/sql-practice.md and src/data/sql-practice-questions.json."""

import json
from pathlib import Path

FRONTMATTER = """---
title: SQL Practice — 150 Problems
description: Hands-on SQL coding problems with quiz and timed modes
order: 1.3
parent: sql
hidden: true
difficulty: practice
---

Use the **quiz panel** for random 10 or 20-minute timed practice. Write your query first, then reveal each solution.

"""

question_meta: list[dict] = []


def problem(n, tier, title, body, solution, hint=None):
    hint_block = f"\n\n**Hint:** {hint}" if hint else ""
    tier_key = tier.lower()
    question_meta.append(
        {
            "id": n,
            "tier": tier_key,
            "title": title,
            "body": body.strip(),
            "solution": solution.strip(),
            "anchor": f"q-{n}",
        }
    )
    return f"""<a id="q-{n}"></a>

### {n}. {title}

{body}{hint_block}

<details>
<summary><strong>Show solution</strong></summary>

```sql
{solution.strip()}
```

</details>

"""

problems = []

# BASIC 1-50
basic = [
    ("Select all columns from employees", "Return every column from the `employees` table.", "SELECT *\nFROM employees;"),
    ("Select specific columns", "Return `name` and `salary` from `employees`.", "SELECT name, salary\nFROM employees;"),
    ("Filter by salary", "Employees with salary greater than 5000.", "SELECT *\nFROM employees\nWHERE salary > 5000;"),
    ("Filter by department", "Employees in the IT department.", "SELECT *\nFROM employees\nWHERE department = 'IT';"),
    ("AND condition", "IT employees earning more than 6000.", "SELECT *\nFROM employees\nWHERE department = 'IT'\n  AND salary > 6000;"),
    ("OR condition", "Employees in IT or HR.", "SELECT *\nFROM employees\nWHERE department IN ('IT', 'HR');"),
    ("BETWEEN", "Salaries between 5000 and 8000 inclusive.", "SELECT *\nFROM employees\nWHERE salary BETWEEN 5000 AND 8000;"),
    ("IN operator", "Departments IT, HR, or Finance.", "SELECT *\nFROM employees\nWHERE department IN ('IT', 'HR', 'Finance');"),
    ("LIKE starts with", "Names starting with 'A'.", "SELECT *\nFROM employees\nWHERE name LIKE 'A%';"),
    ("LIKE contains", "Names containing 'an' (case depends on collation).", "SELECT *\nFROM employees\nWHERE name LIKE '%an%';"),
    ("IS NULL", "Employees with no manager.", "SELECT *\nFROM employees\nWHERE manager_id IS NULL;"),
    ("IS NOT NULL", "Employees who have a manager.", "SELECT *\nFROM employees\nWHERE manager_id IS NOT NULL;"),
    ("ORDER BY ascending", "Employees sorted by salary ascending.", "SELECT *\nFROM employees\nORDER BY salary ASC;"),
    ("ORDER BY descending", "Top salaries first.", "SELECT *\nFROM employees\nORDER BY salary DESC;"),
    ("TOP N rows", "Top 5 highest-paid employees (SQL Server).", "SELECT TOP 5 *\nFROM employees\nORDER BY salary DESC;"),
    ("Column alias", "Show name and salary as `employee_salary`.", "SELECT name, salary AS employee_salary\nFROM employees;"),
    ("DISTINCT departments", "List unique departments.", "SELECT DISTINCT department\nFROM employees;"),
    ("COUNT all rows", "Total number of employees.", "SELECT COUNT(*) AS total_employees\nFROM employees;"),
    ("COUNT non-null", "Count employees with a phone number.", "SELECT COUNT(phone) AS employees_with_phone\nFROM employees;"),
    ("SUM salary", "Total payroll.", "SELECT SUM(salary) AS total_payroll\nFROM employees;"),
    ("AVG salary", "Average salary.", "SELECT AVG(salary) AS avg_salary\nFROM employees;"),
    ("MIN and MAX salary", "Lowest and highest salary.", "SELECT MIN(salary) AS min_sal, MAX(salary) AS max_sal\nFROM employees;"),
    ("GROUP BY department", "Employee count per department.", "SELECT department, COUNT(*) AS cnt\nFROM employees\nGROUP BY department;"),
    ("GROUP BY with AVG", "Average salary per department.", "SELECT department, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;"),
    ("HAVING filter", "Departments with more than 5 employees.", "SELECT department, COUNT(*) AS cnt\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5;"),
    ("WHERE + GROUP BY + HAVING", "Departments where avg salary > 7000 (only include salaries >= 5000 in rows before group).",
     "SELECT department, AVG(salary) AS avg_salary\nFROM employees\nWHERE salary >= 5000\nGROUP BY department\nHAVING AVG(salary) > 7000;"),
    ("CASE salary band", "Label salaries High/Medium/Low.",
     "SELECT name, salary,\n  CASE\n    WHEN salary >= 8000 THEN 'High'\n    WHEN salary >= 5000 THEN 'Medium'\n    ELSE 'Low'\n  END AS band\nFROM employees;"),
    ("COALESCE phone", "Show phone or 'Not Available'.", "SELECT name, COALESCE(phone, 'Not Available') AS phone\nFROM employees;"),
    ("Arithmetic column", "Annual salary (salary * 12).", "SELECT name, salary, salary * 12 AS annual_salary\nFROM employees;"),
    ("INNER JOIN", "Employee names with department names.\n\n`employees(emp_id, name, dept_id)` + `departments(dept_id, dept_name)`",
     "SELECT e.name, d.dept_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;"),
    ("LEFT JOIN", "All employees and dept name (NULL if missing).",
     "SELECT e.name, d.dept_name\nFROM employees e\nLEFT JOIN departments d ON e.dept_id = d.dept_id;"),
    ("Filter joined table", "Orders with customer name where amount > 1000.\n\n`orders(order_id, customer_id, amount)` + `customers(customer_id, name)`",
     "SELECT o.order_id, c.name, o.amount\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.customer_id\nWHERE o.amount > 1000;"),
    ("Multiple JOINs", "Order id, customer name, product name.",
     "SELECT o.order_id, c.name AS customer, p.product_name\nFROM orders o\nJOIN customers c ON o.customer_id = c.customer_id\nJOIN order_items oi ON o.order_id = oi.order_id\nJOIN products p ON oi.product_id = p.product_id;"),
    ("GROUP BY after JOIN", "Total order amount per customer.",
     "SELECT c.customer_id, c.name, SUM(o.amount) AS total_spent\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.name;"),
    ("COUNT orders per customer", "How many orders each customer placed.",
     "SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id;"),
    ("DELETE syntax (concept)", "Delete employees in a closed department named 'Temp'. **Do not run on prod.**",
     "DELETE FROM employees\nWHERE department = 'Temp';"),
    ("UPDATE syntax (concept)", "Give 10% raise to IT department.",
     "UPDATE employees\nSET salary = salary * 1.10\nWHERE department = 'IT';"),
    ("INSERT single row", "Insert one employee row.",
     "INSERT INTO employees (emp_id, name, department, salary)\nVALUES (101, 'Rahul', 'IT', 6000);"),
    ("INSERT multiple rows", "Insert two employees in one statement.",
     "INSERT INTO employees (emp_id, name, department, salary)\nVALUES\n  (102, 'Amit', 'HR', 5000),\n  (103, 'Priya', 'IT', 8000);"),
    ("Subquery scalar", "Employees earning above company average.",
     "SELECT *\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);"),
    ("Subquery IN", "Employees in departments with avg salary > 7000.",
     "SELECT *\nFROM employees\nWHERE department IN (\n  SELECT department\n  FROM employees\n  GROUP BY department\n  HAVING AVG(salary) > 7000\n);"),
    ("EXISTS", "Customers who have at least one order.",
     "SELECT c.*\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);"),
    ("NOT EXISTS", "Customers with no orders.",
     "SELECT c.*\nFROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id\n);"),
    ("UNION", "All cities from customers and suppliers (deduped).",
     "SELECT city FROM customers\nUNION\nSELECT city FROM suppliers;"),
    ("UNION ALL", "All cities keeping duplicates.",
     "SELECT city FROM customers\nUNION ALL\nSELECT city FROM suppliers;"),
    ("Simple CTE", "Employees with salary > 5000 using a CTE.",
     "WITH high AS (\n  SELECT * FROM employees WHERE salary > 5000\n)\nSELECT * FROM high;"),
    ("Percentage of total", "Each department's share of total salary (basic subquery).",
     "SELECT department,\n  SUM(salary) AS dept_total,\n  SUM(salary) * 100.0 / (SELECT SUM(salary) FROM employees) AS pct\nFROM employees\nGROUP BY department;"),
    ("Filter NULL with COALESCE in ORDER", "Sort by salary treating NULL as 0.",
     "SELECT *\nFROM employees\nORDER BY COALESCE(salary, 0) DESC;"),
    ("Self join preview", "Employee name with manager name (`manager_id` → `emp_id`).",
     "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.emp_id;"),
    ("Date filter range", "Orders in year 2024 without applying function on column.",
     "SELECT *\nFROM orders\nWHERE order_date >= '2024-01-01'\n  AND order_date < '2025-01-01';"),
]

for title, body, sol in basic:
    problems.append(problem(len(problems) + 1, "Basic", title, body, sol))

assert len(basic) == 50, f"Expected 50 basic problems, got {len(basic)}"

# MEDIUM 51-100
medium = [
    ("Correlated subquery", "Employees earning more than their department average.",
     "SELECT e.*\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(e2.salary)\n  FROM employees e2\n  WHERE e2.department = e.department\n);"),
    ("CTE department stats", "Departments with total salary > 50000.",
     "WITH dept AS (\n  SELECT department, SUM(salary) AS total\n  FROM employees GROUP BY department\n)\nSELECT * FROM dept WHERE total > 50000;"),
    ("Multiple CTEs", "High earners in high-budget departments.",
     "WITH dept_avg AS (\n  SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department\n),\nhigh_dept AS (\n  SELECT department FROM dept_avg WHERE avg_sal > 7000\n)\nSELECT e.*\nFROM employees e\nJOIN high_dept h ON e.department = h.department\nWHERE e.salary > 8000;"),
    ("ROW_NUMBER ranking", "Rank all employees by salary.",
     "SELECT name, salary,\n  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn\nFROM employees;"),
    ("RANK with ties", "Rank salaries allowing ties with gaps.",
     "SELECT name, salary,\n  RANK() OVER (ORDER BY salary DESC) AS rnk\nFROM employees;"),
    ("DENSE_RANK", "Rank salaries without gaps after ties.",
     "SELECT name, salary,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\nFROM employees;"),
    ("Top 3 per department", "Top 3 earners in each department.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY department ORDER BY salary DESC\n  ) AS rn\n  FROM employees\n) x WHERE rn <= 3;"),
    ("LAG previous salary", "Show salary and previous month's salary from `salary_history(emp_id, salary, effective_date)`.",
     "SELECT emp_id, effective_date, salary,\n  LAG(salary) OVER (PARTITION BY emp_id ORDER BY effective_date) AS prev_salary\nFROM salary_history;"),
    ("LEAD next order", "Next order date per customer from `orders(customer_id, order_date)`.",
     "SELECT customer_id, order_date,\n  LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_order\nFROM orders;"),
    ("Running total", "Cumulative revenue by date from `sales(sale_date, revenue)`.",
     "SELECT sale_date, revenue,\n  SUM(revenue) OVER (ORDER BY sale_date ROWS UNBOUNDED PRECEDING) AS running_total\nFROM sales;"),
    ("Running total per customer", "Running order amount per customer.",
     "SELECT customer_id, order_date, amount,\n  SUM(amount) OVER (\n    PARTITION BY customer_id ORDER BY order_date\n    ROWS UNBOUNDED PRECEDING\n  ) AS running_total\nFROM orders;"),
    ("Moving average 3-day", "3-row moving average of revenue.",
     "SELECT sale_date, revenue,\n  AVG(revenue) OVER (\n    ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS moving_avg\nFROM sales;"),
    ("Dept avg with window", "Each employee vs department average without GROUP BY collapse.",
     "SELECT name, department, salary,\n  AVG(salary) OVER (PARTITION BY department) AS dept_avg\nFROM employees;"),
    ("NTILE quartiles", "Split employees into 4 salary buckets.",
     "SELECT name, salary,\n  NTILE(4) OVER (ORDER BY salary) AS quartile\nFROM employees;"),
    ("FIRST_VALUE in partition", "Highest salary in each department shown on every row.",
     "SELECT name, department, salary,\n  FIRST_VALUE(salary) OVER (\n    PARTITION BY department ORDER BY salary DESC\n  ) AS dept_max\nFROM employees;"),
    ("Find duplicates by email", "Emails appearing more than once in `customers(email)`.",
     "SELECT email, COUNT(*) AS cnt\nFROM customers\nGROUP BY email\nHAVING COUNT(*) > 1;"),
    ("Latest record per key", "Latest row per `customer_id` from `customer_history(customer_id, updated_at, ...)`.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id ORDER BY updated_at DESC\n  ) AS rn\n  FROM customer_history\n) x WHERE rn = 1;"),
    ("Second latest transaction", "Second most recent transaction per customer.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id ORDER BY transaction_date DESC\n  ) AS rn\n  FROM transactions\n) x WHERE rn = 2;"),
    ("Employees above dept avg (window)", "Using window instead of correlated subquery.",
     "SELECT * FROM (\n  SELECT *, AVG(salary) OVER (PARTITION BY department) AS dept_avg\n  FROM employees\n) x WHERE salary > dept_avg;"),
    ("INTERSECT customers", "Customer IDs present in both `customers` and `orders`.",
     "SELECT customer_id FROM customers\nINTERSECT\nSELECT customer_id FROM orders;"),
    ("EXCEPT non-ordering customers", "Customers who never ordered.",
     "SELECT customer_id FROM customers\nEXCEPT\nSELECT customer_id FROM orders;"),
    ("SELF JOIN managers", "Employees earning more than their manager.",
     "SELECT e.name AS employee, e.salary AS emp_sal, m.name AS manager, m.salary AS mgr_sal\nFROM employees e\nJOIN employees m ON e.manager_id = m.emp_id\nWHERE e.salary > m.salary;"),
    ("Managers with 5+ reports", "Managers with at least 5 direct reports.",
     "SELECT manager_id, COUNT(*) AS report_count\nFROM employees\nWHERE manager_id IS NOT NULL\nGROUP BY manager_id\nHAVING COUNT(*) >= 5;"),
    ("CROSS JOIN count", "How many rows from CROSS JOIN of 3 employees × 4 departments? **Write query to verify.**",
     "SELECT COUNT(*) AS row_count\nFROM employees e\nCROSS JOIN departments d;"),
    ("FULL OUTER JOIN", "All employees and departments even without match.",
     "SELECT e.name, d.dept_name\nFROM employees e\nFULL OUTER JOIN departments d ON e.dept_id = d.dept_id;"),
    ("RIGHT JOIN", "All departments and matching employees.",
     "SELECT e.name, d.dept_name\nFROM employees e\nRIGHT JOIN departments d ON e.dept_id = d.dept_id;"),
    ("Pivot with CASE", "Sales per product as columns from `sales(product, amount)`.",
     "SELECT\n  SUM(CASE WHEN product = 'A' THEN amount ELSE 0 END) AS product_a,\n  SUM(CASE WHEN product = 'B' THEN amount ELSE 0 END) AS product_b\nFROM sales;"),
    ("Month-over-month change", "Revenue change vs previous month from `monthly_revenue(month, revenue)`.",
     "WITH x AS (\n  SELECT month, revenue,\n    LAG(revenue) OVER (ORDER BY month) AS prev\n  FROM monthly_revenue\n)\nSELECT month, revenue, revenue - prev AS change\nFROM x;"),
    ("MoM growth %", "Month-over-month growth percentage.",
     "WITH x AS (\n  SELECT month, revenue,\n    LAG(revenue) OVER (ORDER BY month) AS prev\n  FROM monthly_revenue\n)\nSELECT month,\n  (revenue - prev) * 100.0 / NULLIF(prev, 0) AS growth_pct\nFROM x;"),
    ("Salary increase detection", "Rows where salary increased vs previous effective date.",
     "SELECT * FROM (\n  SELECT *, LAG(salary) OVER (\n    PARTITION BY emp_id ORDER BY effective_date\n  ) AS prev_sal\n  FROM salary_history\n) x WHERE salary > prev_sal;"),
    ("Products never sold", "Products with no rows in `order_items`.",
     "SELECT p.*\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id\n);"),
    ("Customers spending > 100k", "Customers with total orders over 100000.",
     "SELECT customer_id, SUM(amount) AS total\nFROM orders\nGROUP BY customer_id\nHAVING SUM(amount) > 100000;"),
    ("Customers with 3+ orders", "Customers with more than 3 orders.",
     "SELECT customer_id, COUNT(*) AS cnt\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 3;"),
    ("Highest order per customer", "The order row with max amount per customer.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id ORDER BY amount DESC\n  ) AS rn\n  FROM orders\n) x WHERE rn = 1;"),
    ("Department max headcount", "Department(s) with the most employees.",
     "WITH c AS (\n  SELECT department, COUNT(*) AS cnt\n  FROM employees GROUP BY department\n)\nSELECT * FROM c WHERE cnt = (SELECT MAX(cnt) FROM c);"),
    ("Percentage contribution", "Each department's % of total salary using window.",
     "SELECT department, SUM(salary) AS dept_sal,\n  SUM(salary) * 100.0 / SUM(SUM(salary)) OVER () AS pct\nFROM employees\nGROUP BY department;"),
    ("Recursive CTE hierarchy", "Employee hierarchy levels from CEO (`manager_id IS NULL`).",
     "WITH RECURSIVE eh AS (\n  SELECT emp_id, name, manager_id, 0 AS lvl\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.name, e.manager_id, eh.lvl + 1\n  FROM employees e\n  JOIN eh ON e.manager_id = eh.emp_id\n)\nSELECT * FROM eh;"),
    ("EXISTS vs IN", "Customers with orders — write using EXISTS.",
     "SELECT c.*\nFROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);"),
    ("LEFT JOIN trap fix", "All customers including those without ACTIVE orders only — filter in ON not WHERE.",
     "SELECT c.*, o.order_id\nFROM customers c\nLEFT JOIN orders o\n  ON c.customer_id = o.customer_id AND o.status = 'ACTIVE';"),
    ("Deduplicate keep latest", "Keep one row per email, highest `customer_id`.",
     "WITH d AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY email ORDER BY customer_id DESC\n  ) AS rn FROM customers\n)\nSELECT * FROM d WHERE rn = 1;"),
    ("Scalar subquery in SELECT", "Show each salary and company average side by side.",
     "SELECT name, salary,\n  (SELECT AVG(salary) FROM employees) AS company_avg\nFROM employees;"),
    ("Conditional aggregate", "Count active vs inactive employees in one query (`status` column).",
     "SELECT\n  COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active_cnt,\n  COUNT(*) FILTER (WHERE status = 'INACTIVE') AS inactive_cnt\nFROM employees;"),
    ("SQL Server conditional count", "Same using SUM(CASE) for SQL Server.",
     "SELECT\n  SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_cnt,\n  SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) AS inactive_cnt\nFROM employees;"),
    ("Gap: missing order dates", "Dates in `calendar(dt)` with no sale in `sales(sale_date)`.",
     "SELECT c.dt\nFROM calendar c\nLEFT JOIN sales s ON c.dt = s.sale_date\nWHERE s.sale_date IS NULL;"),
    ("Top 10% by NTILE", "Employees in top decile by salary.",
     "SELECT * FROM (\n  SELECT *, NTILE(10) OVER (ORDER BY salary DESC) AS bucket\n  FROM employees\n) x WHERE bucket = 1;"),
    ("Median with PERCENTILE_CONT", "Median salary (SQL Server).",
     "SELECT DISTINCT\n  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) OVER () AS median_salary\nFROM employees;"),
    ("Running count per day", "Cumulative order count by order_date.",
     "SELECT order_date,\n  COUNT(*) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) AS running_orders\nFROM orders;"),
    ("Join + window", "Each order with customer's previous order amount.",
     "SELECT o.*,\n  LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount\nFROM orders o;"),
    ("Aggregate join filter", "Departments where max salary > 10000.",
     "SELECT department, MAX(salary) AS max_sal\nFROM employees\nGROUP BY department\nHAVING MAX(salary) > 10000;"),
    ("String aggregate", "Comma-separated employee names per department (SQL Server 2017+).",
     "SELECT department,\n  STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY name) AS employees\nFROM employees\nGROUP BY department;"),
]

for title, body, sol in medium:
    problems.append(problem(len(problems) + 1, "Medium", title, body, sol))

assert len(medium) == 50, f"Expected 50 medium problems, got {len(medium)}"

# HARD 101-150
hard = [
    ("Second highest salary", "Second highest distinct salary.",
     "SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);"),
    ("Nth highest salary", "Third highest using DENSE_RANK.",
     "SELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) x WHERE rnk = 3;"),
    ("Second highest — window", "Using DENSE_RANK for duplicate-safe 2nd highest.",
     "SELECT DISTINCT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) x WHERE rnk = 2;"),
    ("Delete duplicates", "Delete duplicate emails keeping lowest customer_id (concept).",
     "WITH d AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY customer_id) AS rn\n  FROM customers\n)\nDELETE FROM d WHERE rn > 1;"),
    ("Employees same salary", "Employees who share salary with someone else.",
     "SELECT *\nFROM employees\nWHERE salary IN (\n  SELECT salary FROM employees GROUP BY salary HAVING COUNT(*) > 1\n);"),
    ("Dept highest avg salary", "Department with highest average salary.",
     "WITH a AS (\n  SELECT department, AVG(salary) AS avg_sal\n  FROM employees GROUP BY department\n)\nSELECT TOP 1 * FROM a ORDER BY avg_sal DESC;"),
    ("Max earner per dept", "Employee(s) with max salary in each department — use RANK for ties.",
     "SELECT * FROM (\n  SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk\n  FROM employees\n) x WHERE rnk = 1;"),
    ("Consecutive login days — island key", "From `logins(user_id, login_date)` find streak groups using `login_date - row_number`.",
     "WITH d AS (\n  SELECT user_id, login_date,\n    DATEADD(day, -ROW_NUMBER() OVER (\n      PARTITION BY user_id ORDER BY login_date\n    ), login_date) AS grp\n  FROM (SELECT DISTINCT user_id, login_date FROM logins) x\n)\nSELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_len\nFROM d\nGROUP BY user_id, grp;"),
    ("Longest consecutive streak", "User with longest login streak from previous problem's logic.",
     "WITH d AS (\n  SELECT user_id, login_date,\n    DATEADD(day, -ROW_NUMBER() OVER (\n      PARTITION BY user_id ORDER BY login_date\n    ), login_date) AS grp\n  FROM (SELECT DISTINCT user_id, login_date FROM logins) x\n), streaks AS (\n  SELECT user_id, COUNT(*) AS len\n  FROM d GROUP BY user_id, grp\n)\nSELECT TOP 1 user_id, len FROM streaks ORDER BY len DESC;"),
    ("Gaps in dates", "Missing dates between min and max in `sales(sale_date)` — use calendar join.",
     "SELECT c.dt AS missing_date\nFROM calendar c\nWHERE c.dt BETWEEN (SELECT MIN(sale_date) FROM sales)\n                   AND (SELECT MAX(sale_date) FROM sales)\n  AND NOT EXISTS (SELECT 1 FROM sales s WHERE s.sale_date = c.dt);"),
    ("Running balance", "Running balance from `transactions(account_id, txn_date, amount)`.",
     "SELECT account_id, txn_date, amount,\n  SUM(amount) OVER (\n    PARTITION BY account_id ORDER BY txn_date\n    ROWS UNBOUNDED PRECEDING\n  ) AS balance\nFROM transactions;"),
    ("YoY comparison", "Compare revenue same month year-over-year.",
     "SELECT month, revenue,\n  LAG(revenue, 12) OVER (ORDER BY month) AS revenue_prev_year,\n  revenue - LAG(revenue, 12) OVER (ORDER BY month) AS yoy_change\nFROM monthly_revenue;"),
    ("Cumulative distinct customers", "Running count of distinct customers seen so far (advanced).",
     "SELECT order_date, customer_id,\n  DENSE_RANK() OVER (ORDER BY customer_id) AS approx_distinct_so_far\nFROM orders;"),
    ("SCD Type 2 expire", "Expire current dimension row when city changes (conceptual MERGE step 1).",
     "UPDATE dim_customer\nSET end_date = CAST(GETDATE() AS date), is_current = 0\nFROM dim_customer t\nJOIN staging_customer s ON t.customer_id = s.customer_id\nWHERE t.is_current = 1 AND t.city <> s.city;"),
    ("SCD Type 2 insert", "Insert new version after expire (conceptual step 2).",
     "INSERT INTO dim_customer (customer_id, city, start_date, end_date, is_current)\nSELECT s.customer_id, s.city, CAST(GETDATE() AS date), '9999-12-31', 1\nFROM staging_customer s\nJOIN dim_customer t ON s.customer_id = t.customer_id AND t.is_current = 1\nWHERE t.city <> s.city;"),
    ("Incremental load filter", "Orders modified after watermark.",
     "SELECT *\nFROM orders\nWHERE modified_at > @last_watermark;"),
    ("Deduplication pipeline", "Keep latest row per business key from staging.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY business_key ORDER BY updated_at DESC\n  ) AS rn\n  FROM staging\n) x WHERE rn = 1;"),
    ("Referential check", "Orders with invalid customer_id not in customers.",
     "SELECT o.*\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.customer_id\nWHERE c.customer_id IS NULL;"),
    ("Data quality null check", "Columns with null rate > 10% (concept on `employees`).",
     "SELECT\n  SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS phone_null_pct\nFROM employees;"),
    ("Pivot year columns", "Revenue by year as columns from `sales(year, revenue)`.",
     "SELECT\n  SUM(CASE WHEN year = 2024 THEN revenue END) AS y2024,\n  SUM(CASE WHEN year = 2025 THEN revenue END) AS y2025,\n  SUM(CASE WHEN year = 2026 THEN revenue END) AS y2026\nFROM sales;"),
    ("Top product per category", "Most expensive product per category.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY category ORDER BY price DESC\n  ) AS rn\n  FROM products\n) x WHERE rn = 1;"),
    ("Customers only one order", "Customers with exactly one order.",
     "SELECT customer_id\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) = 1;"),
    ("Employees no projects", "Employees not in `project_assignments(emp_id)`.",
     "SELECT e.*\nFROM employees e\nWHERE NOT EXISTS (\n  SELECT 1 FROM project_assignments p WHERE p.emp_id = e.emp_id\n);"),
    ("Revenue rank within month", "Rank orders by amount within each month.",
     "SELECT *, RANK() OVER (\n  PARTITION BY YEAR(order_date), MONTH(order_date)\n  ORDER BY amount DESC\n) AS monthly_rank\nFROM orders;"),
    ("Cohort retention", "Customers who ordered in month 1 and month 2 (simplified).",
     "SELECT DISTINCT a.customer_id\nFROM orders a\nJOIN orders b ON a.customer_id = b.customer_id\nWHERE FORMAT(a.order_date, 'yyyy-MM') = '2025-01'\n  AND FORMAT(b.order_date, 'yyyy-MM') = '2025-02';"),
    ("SARGable date filter", "Rewrite `YEAR(order_date)=2024` to range filter.",
     "SELECT * FROM orders\nWHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';"),
    ("Anti-join pattern", "Products not in any order using LEFT JOIN.",
     "SELECT p.*\nFROM products p\nLEFT JOIN order_items oi ON p.product_id = oi.product_id\nWHERE oi.product_id IS NULL;"),
    ("Semi-join duplicate safe", "Customers with high-value order (>5000) without duplicating customer rows.",
     "SELECT c.*\nFROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o\n  WHERE o.customer_id = c.customer_id AND o.amount > 5000\n);"),
    ("Rolling 7-day sum", "7-day rolling revenue.",
     "SELECT sale_date, revenue,\n  SUM(revenue) OVER (\n    ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS rolling_7d\nFROM daily_sales;"),
    ("Session gap 30 min", "New session if gap > 30 min between events (simplified).",
     "SELECT user_id, event_time,\n  SUM(CASE WHEN gap_mins > 30 THEN 1 ELSE 0 END) OVER (\n    PARTITION BY user_id ORDER BY event_time\n  ) AS session_id\nFROM (\n  SELECT user_id, event_time,\n    DATEDIFF(minute, LAG(event_time) OVER (\n      PARTITION BY user_id ORDER BY event_time\n    ), event_time) AS gap_mins\n  FROM events\n) x;"),
    ("Bill of materials explosion", "One-level BOM from `bom(parent_id, child_id, qty)`.",
     "SELECT parent_id, child_id, qty\nFROM bom\nWHERE parent_id = @product_id;"),
    ("FIFO layer count", "Count inventory layers per SKU from `inventory(sku, received_date, qty)`.",
     "SELECT sku, COUNT(*) AS layers\nFROM inventory\nWHERE qty > 0\nGROUP BY sku;"),
    ("Zipper table current", "Current rows from SCD2 `dim(cust_id, city, start_dt, end_dt, is_current)`.",
     "SELECT * FROM dim_customer WHERE is_current = 1;"),
    ("Compare staging vs target", "Staging rows not matching current dimension attribute.",
     "SELECT s.*\nFROM staging_customer s\nJOIN dim_customer d\n  ON s.customer_id = d.customer_id AND d.is_current = 1\nWHERE s.city <> d.city;"),
    ("Rank dense top 2 salaries", "Employees with 1st or 2nd distinct salary level company-wide.",
     "SELECT * FROM (\n  SELECT *, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr\n  FROM employees\n) x WHERE dr <= 2;"),
    ("Mutual managers check", "Pairs where each is other's manager (edge case).",
     "SELECT a.emp_id, b.emp_id\nFROM employees a\nJOIN employees b ON a.manager_id = b.emp_id AND b.manager_id = a.emp_id;"),
    ("Orphan departments", "Departments with zero employees.",
     "SELECT d.*\nFROM departments d\nLEFT JOIN employees e ON d.dept_id = e.dept_id\nWHERE e.emp_id IS NULL;"),
    ("Order sequence gaps", "Order IDs with gaps in sequence (simplified).",
     "SELECT o1.order_id + 1 AS missing_id\nFROM orders o1\nLEFT JOIN orders o2 ON o2.order_id = o1.order_id + 1\nWHERE o2.order_id IS NULL;"),
    ("Weighted average salary", "Weighted avg salary by headcount per dept — verify with two-step.",
     "SELECT SUM(dept_total) * 1.0 / SUM(headcount) AS weighted_avg\nFROM (\n  SELECT department, COUNT(*) AS headcount, SUM(salary) AS dept_total\n  FROM employees GROUP BY department\n) x;"),
    ("Customer first order value", "Amount of each customer's first order.",
     "SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id ORDER BY order_date\n  ) AS rn\n  FROM orders\n) x WHERE rn = 1;"),
    ("Active employees Q1", "Employees hired before Q1 who weren't terminated before Q1 end.",
     "SELECT *\nFROM employees\nWHERE hire_date < '2025-04-01'\n  AND (termination_date IS NULL OR termination_date >= '2025-01-01');"),
    ("Churn definition", "Customers whose last order was > 90 days ago.",
     "SELECT customer_id, MAX(order_date) AS last_order\nFROM orders\nGROUP BY customer_id\nHAVING MAX(order_date) < DATEADD(day, -90, CAST(GETDATE() AS date));"),
    ("Revenue per employee", "Company revenue divided by employee count (scalar subqueries).",
     "SELECT\n  (SELECT SUM(amount) FROM orders) * 1.0 /\n  (SELECT COUNT(*) FROM employees) AS revenue_per_employee;"),
    ("Bucket salaries", "Assign custom salary buckets 0-5k, 5-8k, 8k+.",
     "SELECT name, salary,\n  CASE\n    WHEN salary < 5000 THEN '0-5k'\n    WHEN salary < 8000 THEN '5-8k'\n    ELSE '8k+'\n  END AS bucket\nFROM employees;"),
    ("Merge upsert pattern", "Conceptual MERGE for `target` from `source` on `id`.",
     "MERGE target AS t\nUSING source AS s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.val = s.val\nWHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);"),
    ("Late arriving fact", "Attach fact to current dimension version by business key.",
     "SELECT f.*, d.surrogate_key\nFROM fact_sales f\nJOIN dim_product d\n  ON f.product_bk = d.product_bk AND d.is_current = 1;"),
    ("Histogram buckets", "Count employees per 2000 salary bucket.",
     "SELECT (salary / 2000) * 2000 AS bucket_start, COUNT(*) AS cnt\nFROM employees\nGROUP BY (salary / 2000) * 2000\nORDER BY bucket_start;"),
    ("Interview: explain plan approach", "Write a comment block listing 5 steps you'd take to tune a slow query.",
     "-- 1. Capture actual execution plan\n-- 2. Find highest-cost operators\n-- 3. Check row estimates vs actuals\n-- 4. Review indexes and SARGability\n-- 5. Re-test with production-like volume"),
    ("Self-assessment query", "Write a query returning one row: your readiness score 1-10 as `SELECT 8 AS readiness`.",
     "SELECT 8 AS readiness;"),
    ("Recent hires", "Employees hired in the last 30 days.",
     "SELECT *\nFROM employees\nWHERE hire_date >= DATEADD(day, -30, CAST(GETDATE() AS date));"),
]

for title, body, sol in hard:
    problems.append(problem(len(problems) + 1, "Hard", title, body, sol))

assert len(hard) == 50, f"Expected 50 hard problems, got {len(hard)}"

assert len(problems) == 150, f"Expected 150 problems, got {len(problems)}"

body = FRONTMATTER
body += "## Basic\n\n"
body += "".join(problems[:50])
body += "\n## Medium\n\n"
body += "".join(problems[50:100])
body += "\n## Hard\n\n"
body += "".join(problems[100:150])

body += """
## Done?

Revisit [SQL Notes](/topics/sql-notes) for concepts, then test yourself with [Interview Q&A](/topics/sql-interview).
"""

out = Path(__file__).resolve().parents[1] / "content" / "topics" / "sql-practice.md"
out.write_text(body, encoding="utf-8")
print(f"Wrote {out} ({len(body.splitlines())} lines, 150 problems)")

json_out = Path(__file__).resolve().parents[1] / "src" / "data" / "sql-practice-questions.json"
json_out.parent.mkdir(parents=True, exist_ok=True)
json_out.write_text(json.dumps(question_meta, indent=2), encoding="utf-8")
print(f"Wrote {json_out} ({len(question_meta)} questions)")

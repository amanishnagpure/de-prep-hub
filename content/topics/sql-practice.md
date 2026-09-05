---
title: SQL Practice — 150 Problems
description: Hands-on SQL coding problems with quiz and timed modes
order: 1.3
parent: sql
hidden: true
difficulty: practice
---

Use the **quiz panel** for random 10 or 20-minute timed practice. Write your query first, then reveal each solution.

## Basic

<a id="q-1"></a>

### 1. Select all columns from employees

Return every column from the `employees` table.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees;
```

</details>

<a id="q-2"></a>

### 2. Select specific columns

Return `name` and `salary` from `employees`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary
FROM employees;
```

</details>

<a id="q-3"></a>

### 3. Filter by salary

Employees with salary greater than 5000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE salary > 5000;
```

</details>

<a id="q-4"></a>

### 4. Filter by department

Employees in the IT department.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE department = 'IT';
```

</details>

<a id="q-5"></a>

### 5. AND condition

IT employees earning more than 6000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE department = 'IT'
  AND salary > 6000;
```

</details>

<a id="q-6"></a>

### 6. OR condition

Employees in IT or HR.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE department IN ('IT', 'HR');
```

</details>

<a id="q-7"></a>

### 7. BETWEEN

Salaries between 5000 and 8000 inclusive.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE salary BETWEEN 5000 AND 8000;
```

</details>

<a id="q-8"></a>

### 8. IN operator

Departments IT, HR, or Finance.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE department IN ('IT', 'HR', 'Finance');
```

</details>

<a id="q-9"></a>

### 9. LIKE starts with

Names starting with 'A'.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE name LIKE 'A%';
```

</details>

<a id="q-10"></a>

### 10. LIKE contains

Names containing 'an' (case depends on collation).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE name LIKE '%an%';
```

</details>

<a id="q-11"></a>

### 11. IS NULL

Employees with no manager.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE manager_id IS NULL;
```

</details>

<a id="q-12"></a>

### 12. IS NOT NULL

Employees who have a manager.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE manager_id IS NOT NULL;
```

</details>

<a id="q-13"></a>

### 13. ORDER BY ascending

Employees sorted by salary ascending.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
ORDER BY salary ASC;
```

</details>

<a id="q-14"></a>

### 14. ORDER BY descending

Top salaries first.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
ORDER BY salary DESC;
```

</details>

<a id="q-15"></a>

### 15. TOP N rows

Top 5 highest-paid employees (SQL Server).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT TOP 5 *
FROM employees
ORDER BY salary DESC;
```

</details>

<a id="q-16"></a>

### 16. Column alias

Show name and salary as `employee_salary`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary AS employee_salary
FROM employees;
```

</details>

<a id="q-17"></a>

### 17. DISTINCT departments

List unique departments.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT DISTINCT department
FROM employees;
```

</details>

<a id="q-18"></a>

### 18. COUNT all rows

Total number of employees.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT COUNT(*) AS total_employees
FROM employees;
```

</details>

<a id="q-19"></a>

### 19. COUNT non-null

Count employees with a phone number.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT COUNT(phone) AS employees_with_phone
FROM employees;
```

</details>

<a id="q-20"></a>

### 20. SUM salary

Total payroll.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT SUM(salary) AS total_payroll
FROM employees;
```

</details>

<a id="q-21"></a>

### 21. AVG salary

Average salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT AVG(salary) AS avg_salary
FROM employees;
```

</details>

<a id="q-22"></a>

### 22. MIN and MAX salary

Lowest and highest salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT MIN(salary) AS min_sal, MAX(salary) AS max_sal
FROM employees;
```

</details>

<a id="q-23"></a>

### 23. GROUP BY department

Employee count per department.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department;
```

</details>

<a id="q-24"></a>

### 24. GROUP BY with AVG

Average salary per department.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
```

</details>

<a id="q-25"></a>

### 25. HAVING filter

Departments with more than 5 employees.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

</details>

<a id="q-26"></a>

### 26. WHERE + GROUP BY + HAVING

Departments where avg salary > 7000 (only include salaries >= 5000 in rows before group).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE salary >= 5000
GROUP BY department
HAVING AVG(salary) > 7000;
```

</details>

<a id="q-27"></a>

### 27. CASE salary band

Label salaries High/Medium/Low.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  CASE
    WHEN salary >= 8000 THEN 'High'
    WHEN salary >= 5000 THEN 'Medium'
    ELSE 'Low'
  END AS band
FROM employees;
```

</details>

<a id="q-28"></a>

### 28. COALESCE phone

Show phone or 'Not Available'.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, COALESCE(phone, 'Not Available') AS phone
FROM employees;
```

</details>

<a id="q-29"></a>

### 29. Arithmetic column

Annual salary (salary * 12).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary, salary * 12 AS annual_salary
FROM employees;
```

</details>

<a id="q-30"></a>

### 30. INNER JOIN

Employee names with department names.

`employees(emp_id, name, dept_id)` + `departments(dept_id, dept_name)`

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;
```

</details>

<a id="q-31"></a>

### 31. LEFT JOIN

All employees and dept name (NULL if missing).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;
```

</details>

<a id="q-32"></a>

### 32. Filter joined table

Orders with customer name where amount > 1000.

`orders(order_id, customer_id, amount)` + `customers(customer_id, name)`

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT o.order_id, c.name, o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.amount > 1000;
```

</details>

<a id="q-33"></a>

### 33. Multiple JOINs

Order id, customer name, product name.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT o.order_id, c.name AS customer, p.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id;
```

</details>

<a id="q-34"></a>

### 34. GROUP BY after JOIN

Total order amount per customer.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.customer_id, c.name, SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;
```

</details>

<a id="q-35"></a>

### 35. COUNT orders per customer

How many orders each customer placed.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

</details>

<a id="q-36"></a>

### 36. DELETE syntax (concept)

Delete employees in a closed department named 'Temp'. **Do not run on prod.**

<details>
<summary><strong>Show solution</strong></summary>

```sql
DELETE FROM employees
WHERE department = 'Temp';
```

</details>

<a id="q-37"></a>

### 37. UPDATE syntax (concept)

Give 10% raise to IT department.

<details>
<summary><strong>Show solution</strong></summary>

```sql
UPDATE employees
SET salary = salary * 1.10
WHERE department = 'IT';
```

</details>

<a id="q-38"></a>

### 38. INSERT single row

Insert one employee row.

<details>
<summary><strong>Show solution</strong></summary>

```sql
INSERT INTO employees (emp_id, name, department, salary)
VALUES (101, 'Rahul', 'IT', 6000);
```

</details>

<a id="q-39"></a>

### 39. INSERT multiple rows

Insert two employees in one statement.

<details>
<summary><strong>Show solution</strong></summary>

```sql
INSERT INTO employees (emp_id, name, department, salary)
VALUES
  (102, 'Amit', 'HR', 5000),
  (103, 'Priya', 'IT', 8000);
```

</details>

<a id="q-40"></a>

### 40. Subquery scalar

Employees earning above company average.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

</details>

<a id="q-41"></a>

### 41. Subquery IN

Employees in departments with avg salary > 7000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE department IN (
  SELECT department
  FROM employees
  GROUP BY department
  HAVING AVG(salary) > 7000
);
```

</details>

<a id="q-42"></a>

### 42. EXISTS

Customers who have at least one order.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.*
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

</details>

<a id="q-43"></a>

### 43. NOT EXISTS

Customers with no orders.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.*
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

</details>

<a id="q-44"></a>

### 44. UNION

All cities from customers and suppliers (deduped).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT city FROM customers
UNION
SELECT city FROM suppliers;
```

</details>

<a id="q-45"></a>

### 45. UNION ALL

All cities keeping duplicates.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;
```

</details>

<a id="q-46"></a>

### 46. Simple CTE

Employees with salary > 5000 using a CTE.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH high AS (
  SELECT * FROM employees WHERE salary > 5000
)
SELECT * FROM high;
```

</details>

<a id="q-47"></a>

### 47. Percentage of total

Each department's share of total salary (basic subquery).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department,
  SUM(salary) AS dept_total,
  SUM(salary) * 100.0 / (SELECT SUM(salary) FROM employees) AS pct
FROM employees
GROUP BY department;
```

</details>

<a id="q-48"></a>

### 48. Filter NULL with COALESCE in ORDER

Sort by salary treating NULL as 0.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
ORDER BY COALESCE(salary, 0) DESC;
```

</details>

<a id="q-49"></a>

### 49. Self join preview

Employee name with manager name (`manager_id` → `emp_id`).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

</details>

<a id="q-50"></a>

### 50. Date filter range

Orders in year 2024 without applying function on column.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01';
```

</details>


## Medium

<a id="q-51"></a>

### 51. Correlated subquery

Employees earning more than their department average.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.*
FROM employees e
WHERE e.salary > (
  SELECT AVG(e2.salary)
  FROM employees e2
  WHERE e2.department = e.department
);
```

</details>

<a id="q-52"></a>

### 52. CTE department stats

Departments with total salary > 50000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH dept AS (
  SELECT department, SUM(salary) AS total
  FROM employees GROUP BY department
)
SELECT * FROM dept WHERE total > 50000;
```

</details>

<a id="q-53"></a>

### 53. Multiple CTEs

High earners in high-budget departments.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH dept_avg AS (
  SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department
),
high_dept AS (
  SELECT department FROM dept_avg WHERE avg_sal > 7000
)
SELECT e.*
FROM employees e
JOIN high_dept h ON e.department = h.department
WHERE e.salary > 8000;
```

</details>

<a id="q-54"></a>

### 54. ROW_NUMBER ranking

Rank all employees by salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM employees;
```

</details>

<a id="q-55"></a>

### 55. RANK with ties

Rank salaries allowing ties with gaps.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rnk
FROM employees;
```

</details>

<a id="q-56"></a>

### 56. DENSE_RANK

Rank salaries without gaps after ties.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
FROM employees;
```

</details>

<a id="q-57"></a>

### 57. Top 3 per department

Top 3 earners in each department.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY department ORDER BY salary DESC
  ) AS rn
  FROM employees
) x WHERE rn <= 3;
```

</details>

<a id="q-58"></a>

### 58. LAG previous salary

Show salary and previous month's salary from `salary_history(emp_id, salary, effective_date)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT emp_id, effective_date, salary,
  LAG(salary) OVER (PARTITION BY emp_id ORDER BY effective_date) AS prev_salary
FROM salary_history;
```

</details>

<a id="q-59"></a>

### 59. LEAD next order

Next order date per customer from `orders(customer_id, order_date)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, order_date,
  LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_order
FROM orders;
```

</details>

<a id="q-60"></a>

### 60. Running total

Cumulative revenue by date from `sales(sale_date, revenue)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT sale_date, revenue,
  SUM(revenue) OVER (ORDER BY sale_date ROWS UNBOUNDED PRECEDING) AS running_total
FROM sales;
```

</details>

<a id="q-61"></a>

### 61. Running total per customer

Running order amount per customer.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, order_date, amount,
  SUM(amount) OVER (
    PARTITION BY customer_id ORDER BY order_date
    ROWS UNBOUNDED PRECEDING
  ) AS running_total
FROM orders;
```

</details>

<a id="q-62"></a>

### 62. Moving average 3-day

3-row moving average of revenue.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT sale_date, revenue,
  AVG(revenue) OVER (
    ORDER BY sale_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg
FROM sales;
```

</details>

<a id="q-63"></a>

### 63. Dept avg with window

Each employee vs department average without GROUP BY collapse.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, department, salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees;
```

</details>

<a id="q-64"></a>

### 64. NTILE quartiles

Split employees into 4 salary buckets.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  NTILE(4) OVER (ORDER BY salary) AS quartile
FROM employees;
```

</details>

<a id="q-65"></a>

### 65. FIRST_VALUE in partition

Highest salary in each department shown on every row.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, department, salary,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY salary DESC
  ) AS dept_max
FROM employees;
```

</details>

<a id="q-66"></a>

### 66. Find duplicates by email

Emails appearing more than once in `customers(email)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT email, COUNT(*) AS cnt
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

</details>

<a id="q-67"></a>

### 67. Latest record per key

Latest row per `customer_id` from `customer_history(customer_id, updated_at, ...)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY customer_id ORDER BY updated_at DESC
  ) AS rn
  FROM customer_history
) x WHERE rn = 1;
```

</details>

<a id="q-68"></a>

### 68. Second latest transaction

Second most recent transaction per customer.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY customer_id ORDER BY transaction_date DESC
  ) AS rn
  FROM transactions
) x WHERE rn = 2;
```

</details>

<a id="q-69"></a>

### 69. Employees above dept avg (window)

Using window instead of correlated subquery.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, AVG(salary) OVER (PARTITION BY department) AS dept_avg
  FROM employees
) x WHERE salary > dept_avg;
```

</details>

<a id="q-70"></a>

### 70. INTERSECT customers

Customer IDs present in both `customers` and `orders`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id FROM customers
INTERSECT
SELECT customer_id FROM orders;
```

</details>

<a id="q-71"></a>

### 71. EXCEPT non-ordering customers

Customers who never ordered.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id FROM customers
EXCEPT
SELECT customer_id FROM orders;
```

</details>

<a id="q-72"></a>

### 72. SELF JOIN managers

Employees earning more than their manager.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name AS employee, e.salary AS emp_sal, m.name AS manager, m.salary AS mgr_sal
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;
```

</details>

<a id="q-73"></a>

### 73. Managers with 5+ reports

Managers with at least 5 direct reports.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT manager_id, COUNT(*) AS report_count
FROM employees
WHERE manager_id IS NOT NULL
GROUP BY manager_id
HAVING COUNT(*) >= 5;
```

</details>

<a id="q-74"></a>

### 74. CROSS JOIN count

How many rows from CROSS JOIN of 3 employees × 4 departments? **Write query to verify.**

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT COUNT(*) AS row_count
FROM employees e
CROSS JOIN departments d;
```

</details>

<a id="q-75"></a>

### 75. FULL OUTER JOIN

All employees and departments even without match.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;
```

</details>

<a id="q-76"></a>

### 76. RIGHT JOIN

All departments and matching employees.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;
```

</details>

<a id="q-77"></a>

### 77. Pivot with CASE

Sales per product as columns from `sales(product, amount)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  SUM(CASE WHEN product = 'A' THEN amount ELSE 0 END) AS product_a,
  SUM(CASE WHEN product = 'B' THEN amount ELSE 0 END) AS product_b
FROM sales;
```

</details>

<a id="q-78"></a>

### 78. Month-over-month change

Revenue change vs previous month from `monthly_revenue(month, revenue)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH x AS (
  SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev
  FROM monthly_revenue
)
SELECT month, revenue, revenue - prev AS change
FROM x;
```

</details>

<a id="q-79"></a>

### 79. MoM growth %

Month-over-month growth percentage.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH x AS (
  SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev
  FROM monthly_revenue
)
SELECT month,
  (revenue - prev) * 100.0 / NULLIF(prev, 0) AS growth_pct
FROM x;
```

</details>

<a id="q-80"></a>

### 80. Salary increase detection

Rows where salary increased vs previous effective date.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, LAG(salary) OVER (
    PARTITION BY emp_id ORDER BY effective_date
  ) AS prev_sal
  FROM salary_history
) x WHERE salary > prev_sal;
```

</details>

<a id="q-81"></a>

### 81. Products never sold

Products with no rows in `order_items`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT p.*
FROM products p
WHERE NOT EXISTS (
  SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id
);
```

</details>

<a id="q-82"></a>

### 82. Customers spending > 100k

Customers with total orders over 100000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > 100000;
```

</details>

<a id="q-83"></a>

### 83. Customers with 3+ orders

Customers with more than 3 orders.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, COUNT(*) AS cnt
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 3;
```

</details>

<a id="q-84"></a>

### 84. Highest order per customer

The order row with max amount per customer.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY customer_id ORDER BY amount DESC
  ) AS rn
  FROM orders
) x WHERE rn = 1;
```

</details>

<a id="q-85"></a>

### 85. Department max headcount

Department(s) with the most employees.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH c AS (
  SELECT department, COUNT(*) AS cnt
  FROM employees GROUP BY department
)
SELECT * FROM c WHERE cnt = (SELECT MAX(cnt) FROM c);
```

</details>

<a id="q-86"></a>

### 86. Percentage contribution

Each department's % of total salary using window.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, SUM(salary) AS dept_sal,
  SUM(salary) * 100.0 / SUM(SUM(salary)) OVER () AS pct
FROM employees
GROUP BY department;
```

</details>

<a id="q-87"></a>

### 87. Recursive CTE hierarchy

Employee hierarchy levels from CEO (`manager_id IS NULL`).

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH RECURSIVE eh AS (
  SELECT emp_id, name, manager_id, 0 AS lvl
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.name, e.manager_id, eh.lvl + 1
  FROM employees e
  JOIN eh ON e.manager_id = eh.emp_id
)
SELECT * FROM eh;
```

</details>

<a id="q-88"></a>

### 88. EXISTS vs IN

Customers with orders — write using EXISTS.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.*
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
```

</details>

<a id="q-89"></a>

### 89. LEFT JOIN trap fix

All customers including those without ACTIVE orders only — filter in ON not WHERE.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.*, o.order_id
FROM customers c
LEFT JOIN orders o
  ON c.customer_id = o.customer_id AND o.status = 'ACTIVE';
```

</details>

<a id="q-90"></a>

### 90. Deduplicate keep latest

Keep one row per email, highest `customer_id`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH d AS (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY email ORDER BY customer_id DESC
  ) AS rn FROM customers
)
SELECT * FROM d WHERE rn = 1;
```

</details>

<a id="q-91"></a>

### 91. Scalar subquery in SELECT

Show each salary and company average side by side.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  (SELECT AVG(salary) FROM employees) AS company_avg
FROM employees;
```

</details>

<a id="q-92"></a>

### 92. Conditional aggregate

Count active vs inactive employees in one query (`status` column).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'ACTIVE') AS active_cnt,
  COUNT(*) FILTER (WHERE status = 'INACTIVE') AS inactive_cnt
FROM employees;
```

</details>

<a id="q-93"></a>

### 93. SQL Server conditional count

Same using SUM(CASE) for SQL Server.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_cnt,
  SUM(CASE WHEN status = 'INACTIVE' THEN 1 ELSE 0 END) AS inactive_cnt
FROM employees;
```

</details>

<a id="q-94"></a>

### 94. Gap: missing order dates

Dates in `calendar(dt)` with no sale in `sales(sale_date)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.dt
FROM calendar c
LEFT JOIN sales s ON c.dt = s.sale_date
WHERE s.sale_date IS NULL;
```

</details>

<a id="q-95"></a>

### 95. Top 10% by NTILE

Employees in top decile by salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, NTILE(10) OVER (ORDER BY salary DESC) AS bucket
  FROM employees
) x WHERE bucket = 1;
```

</details>

<a id="q-96"></a>

### 96. Median with PERCENTILE_CONT

Median salary (SQL Server).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT DISTINCT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) OVER () AS median_salary
FROM employees;
```

</details>

<a id="q-97"></a>

### 97. Running count per day

Cumulative order count by order_date.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT order_date,
  COUNT(*) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) AS running_orders
FROM orders;
```

</details>

<a id="q-98"></a>

### 98. Join + window

Each order with customer's previous order amount.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT o.*,
  LAG(amount) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount
FROM orders o;
```

</details>

<a id="q-99"></a>

### 99. Aggregate join filter

Departments where max salary > 10000.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department, MAX(salary) AS max_sal
FROM employees
GROUP BY department
HAVING MAX(salary) > 10000;
```

</details>

<a id="q-100"></a>

### 100. String aggregate

Comma-separated employee names per department (SQL Server 2017+).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT department,
  STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY name) AS employees
FROM employees
GROUP BY department;
```

</details>


## Hard

<a id="q-101"></a>

### 101. Second highest salary

Second highest distinct salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
```

</details>

<a id="q-102"></a>

### 102. Nth highest salary

Third highest using DENSE_RANK.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) x WHERE rnk = 3;
```

</details>

<a id="q-103"></a>

### 103. Second highest — window

Using DENSE_RANK for duplicate-safe 2nd highest.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT DISTINCT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) x WHERE rnk = 2;
```

</details>

<a id="q-104"></a>

### 104. Delete duplicates

Delete duplicate emails keeping lowest customer_id (concept).

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH d AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY customer_id) AS rn
  FROM customers
)
DELETE FROM d WHERE rn > 1;
```

</details>

<a id="q-105"></a>

### 105. Employees same salary

Employees who share salary with someone else.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE salary IN (
  SELECT salary FROM employees GROUP BY salary HAVING COUNT(*) > 1
);
```

</details>

<a id="q-106"></a>

### 106. Dept highest avg salary

Department with highest average salary.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH a AS (
  SELECT department, AVG(salary) AS avg_sal
  FROM employees GROUP BY department
)
SELECT TOP 1 * FROM a ORDER BY avg_sal DESC;
```

</details>

<a id="q-107"></a>

### 107. Max earner per dept

Employee(s) with max salary in each department — use RANK for ties.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
) x WHERE rnk = 1;
```

</details>

<a id="q-108"></a>

### 108. Consecutive login days — island key

From `logins(user_id, login_date)` find streak groups using `login_date - row_number`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH d AS (
  SELECT user_id, login_date,
    DATEADD(day, -ROW_NUMBER() OVER (
      PARTITION BY user_id ORDER BY login_date
    ), login_date) AS grp
  FROM (SELECT DISTINCT user_id, login_date FROM logins) x
)
SELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS streak_len
FROM d
GROUP BY user_id, grp;
```

</details>

<a id="q-109"></a>

### 109. Longest consecutive streak

User with longest login streak from previous problem's logic.

<details>
<summary><strong>Show solution</strong></summary>

```sql
WITH d AS (
  SELECT user_id, login_date,
    DATEADD(day, -ROW_NUMBER() OVER (
      PARTITION BY user_id ORDER BY login_date
    ), login_date) AS grp
  FROM (SELECT DISTINCT user_id, login_date FROM logins) x
), streaks AS (
  SELECT user_id, COUNT(*) AS len
  FROM d GROUP BY user_id, grp
)
SELECT TOP 1 user_id, len FROM streaks ORDER BY len DESC;
```

</details>

<a id="q-110"></a>

### 110. Gaps in dates

Missing dates between min and max in `sales(sale_date)` — use calendar join.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.dt AS missing_date
FROM calendar c
WHERE c.dt BETWEEN (SELECT MIN(sale_date) FROM sales)
                   AND (SELECT MAX(sale_date) FROM sales)
  AND NOT EXISTS (SELECT 1 FROM sales s WHERE s.sale_date = c.dt);
```

</details>

<a id="q-111"></a>

### 111. Running balance

Running balance from `transactions(account_id, txn_date, amount)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT account_id, txn_date, amount,
  SUM(amount) OVER (
    PARTITION BY account_id ORDER BY txn_date
    ROWS UNBOUNDED PRECEDING
  ) AS balance
FROM transactions;
```

</details>

<a id="q-112"></a>

### 112. YoY comparison

Compare revenue same month year-over-year.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT month, revenue,
  LAG(revenue, 12) OVER (ORDER BY month) AS revenue_prev_year,
  revenue - LAG(revenue, 12) OVER (ORDER BY month) AS yoy_change
FROM monthly_revenue;
```

</details>

<a id="q-113"></a>

### 113. Cumulative distinct customers

Running count of distinct customers seen so far (advanced).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT order_date, customer_id,
  DENSE_RANK() OVER (ORDER BY customer_id) AS approx_distinct_so_far
FROM orders;
```

</details>

<a id="q-114"></a>

### 114. SCD Type 2 expire

Expire current dimension row when city changes (conceptual MERGE step 1).

<details>
<summary><strong>Show solution</strong></summary>

```sql
UPDATE dim_customer
SET end_date = CAST(GETDATE() AS date), is_current = 0
FROM dim_customer t
JOIN staging_customer s ON t.customer_id = s.customer_id
WHERE t.is_current = 1 AND t.city <> s.city;
```

</details>

<a id="q-115"></a>

### 115. SCD Type 2 insert

Insert new version after expire (conceptual step 2).

<details>
<summary><strong>Show solution</strong></summary>

```sql
INSERT INTO dim_customer (customer_id, city, start_date, end_date, is_current)
SELECT s.customer_id, s.city, CAST(GETDATE() AS date), '9999-12-31', 1
FROM staging_customer s
JOIN dim_customer t ON s.customer_id = t.customer_id AND t.is_current = 1
WHERE t.city <> s.city;
```

</details>

<a id="q-116"></a>

### 116. Incremental load filter

Orders modified after watermark.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM orders
WHERE modified_at > @last_watermark;
```

</details>

<a id="q-117"></a>

### 117. Deduplication pipeline

Keep latest row per business key from staging.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY business_key ORDER BY updated_at DESC
  ) AS rn
  FROM staging
) x WHERE rn = 1;
```

</details>

<a id="q-118"></a>

### 118. Referential check

Orders with invalid customer_id not in customers.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT o.*
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

</details>

<a id="q-119"></a>

### 119. Data quality null check

Columns with null rate > 10% (concept on `employees`).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS phone_null_pct
FROM employees;
```

</details>

<a id="q-120"></a>

### 120. Pivot year columns

Revenue by year as columns from `sales(year, revenue)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  SUM(CASE WHEN year = 2024 THEN revenue END) AS y2024,
  SUM(CASE WHEN year = 2025 THEN revenue END) AS y2025,
  SUM(CASE WHEN year = 2026 THEN revenue END) AS y2026
FROM sales;
```

</details>

<a id="q-121"></a>

### 121. Top product per category

Most expensive product per category.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY category ORDER BY price DESC
  ) AS rn
  FROM products
) x WHERE rn = 1;
```

</details>

<a id="q-122"></a>

### 122. Customers only one order

Customers with exactly one order.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id
FROM orders
GROUP BY customer_id
HAVING COUNT(*) = 1;
```

</details>

<a id="q-123"></a>

### 123. Employees no projects

Employees not in `project_assignments(emp_id)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT e.*
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM project_assignments p WHERE p.emp_id = e.emp_id
);
```

</details>

<a id="q-124"></a>

### 124. Revenue rank within month

Rank orders by amount within each month.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *, RANK() OVER (
  PARTITION BY YEAR(order_date), MONTH(order_date)
  ORDER BY amount DESC
) AS monthly_rank
FROM orders;
```

</details>

<a id="q-125"></a>

### 125. Cohort retention

Customers who ordered in month 1 and month 2 (simplified).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT DISTINCT a.customer_id
FROM orders a
JOIN orders b ON a.customer_id = b.customer_id
WHERE FORMAT(a.order_date, 'yyyy-MM') = '2025-01'
  AND FORMAT(b.order_date, 'yyyy-MM') = '2025-02';
```

</details>

<a id="q-126"></a>

### 126. SARGable date filter

Rewrite `YEAR(order_date)=2024` to range filter.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';
```

</details>

<a id="q-127"></a>

### 127. Anti-join pattern

Products not in any order using LEFT JOIN.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT p.*
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL;
```

</details>

<a id="q-128"></a>

### 128. Semi-join duplicate safe

Customers with high-value order (>5000) without duplicating customer rows.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT c.*
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id AND o.amount > 5000
);
```

</details>

<a id="q-129"></a>

### 129. Rolling 7-day sum

7-day rolling revenue.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT sale_date, revenue,
  SUM(revenue) OVER (
    ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7d
FROM daily_sales;
```

</details>

<a id="q-130"></a>

### 130. Session gap 30 min

New session if gap > 30 min between events (simplified).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT user_id, event_time,
  SUM(CASE WHEN gap_mins > 30 THEN 1 ELSE 0 END) OVER (
    PARTITION BY user_id ORDER BY event_time
  ) AS session_id
FROM (
  SELECT user_id, event_time,
    DATEDIFF(minute, LAG(event_time) OVER (
      PARTITION BY user_id ORDER BY event_time
    ), event_time) AS gap_mins
  FROM events
) x;
```

</details>

<a id="q-131"></a>

### 131. Bill of materials explosion

One-level BOM from `bom(parent_id, child_id, qty)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT parent_id, child_id, qty
FROM bom
WHERE parent_id = @product_id;
```

</details>

<a id="q-132"></a>

### 132. FIFO layer count

Count inventory layers per SKU from `inventory(sku, received_date, qty)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT sku, COUNT(*) AS layers
FROM inventory
WHERE qty > 0
GROUP BY sku;
```

</details>

<a id="q-133"></a>

### 133. Zipper table current

Current rows from SCD2 `dim(cust_id, city, start_dt, end_dt, is_current)`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM dim_customer WHERE is_current = 1;
```

</details>

<a id="q-134"></a>

### 134. Compare staging vs target

Staging rows not matching current dimension attribute.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT s.*
FROM staging_customer s
JOIN dim_customer d
  ON s.customer_id = d.customer_id AND d.is_current = 1
WHERE s.city <> d.city;
```

</details>

<a id="q-135"></a>

### 135. Rank dense top 2 salaries

Employees with 1st or 2nd distinct salary level company-wide.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
  FROM employees
) x WHERE dr <= 2;
```

</details>

<a id="q-136"></a>

### 136. Mutual managers check

Pairs where each is other's manager (edge case).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT a.emp_id, b.emp_id
FROM employees a
JOIN employees b ON a.manager_id = b.emp_id AND b.manager_id = a.emp_id;
```

</details>

<a id="q-137"></a>

### 137. Orphan departments

Departments with zero employees.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT d.*
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
WHERE e.emp_id IS NULL;
```

</details>

<a id="q-138"></a>

### 138. Order sequence gaps

Order IDs with gaps in sequence (simplified).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT o1.order_id + 1 AS missing_id
FROM orders o1
LEFT JOIN orders o2 ON o2.order_id = o1.order_id + 1
WHERE o2.order_id IS NULL;
```

</details>

<a id="q-139"></a>

### 139. Weighted average salary

Weighted avg salary by headcount per dept — verify with two-step.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT SUM(dept_total) * 1.0 / SUM(headcount) AS weighted_avg
FROM (
  SELECT department, COUNT(*) AS headcount, SUM(salary) AS dept_total
  FROM employees GROUP BY department
) x;
```

</details>

<a id="q-140"></a>

### 140. Customer first order value

Amount of each customer's first order.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY customer_id ORDER BY order_date
  ) AS rn
  FROM orders
) x WHERE rn = 1;
```

</details>

<a id="q-141"></a>

### 141. Active employees Q1

Employees hired before Q1 who weren't terminated before Q1 end.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE hire_date < '2025-04-01'
  AND (termination_date IS NULL OR termination_date >= '2025-01-01');
```

</details>

<a id="q-142"></a>

### 142. Churn definition

Customers whose last order was > 90 days ago.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT customer_id, MAX(order_date) AS last_order
FROM orders
GROUP BY customer_id
HAVING MAX(order_date) < DATEADD(day, -90, CAST(GETDATE() AS date));
```

</details>

<a id="q-143"></a>

### 143. Revenue per employee

Company revenue divided by employee count (scalar subqueries).

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT
  (SELECT SUM(amount) FROM orders) * 1.0 /
  (SELECT COUNT(*) FROM employees) AS revenue_per_employee;
```

</details>

<a id="q-144"></a>

### 144. Bucket salaries

Assign custom salary buckets 0-5k, 5-8k, 8k+.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT name, salary,
  CASE
    WHEN salary < 5000 THEN '0-5k'
    WHEN salary < 8000 THEN '5-8k'
    ELSE '8k+'
  END AS bucket
FROM employees;
```

</details>

<a id="q-145"></a>

### 145. Merge upsert pattern

Conceptual MERGE for `target` from `source` on `id`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
MERGE target AS t
USING source AS s ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.val = s.val
WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val);
```

</details>

<a id="q-146"></a>

### 146. Late arriving fact

Attach fact to current dimension version by business key.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT f.*, d.surrogate_key
FROM fact_sales f
JOIN dim_product d
  ON f.product_bk = d.product_bk AND d.is_current = 1;
```

</details>

<a id="q-147"></a>

### 147. Histogram buckets

Count employees per 2000 salary bucket.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT (salary / 2000) * 2000 AS bucket_start, COUNT(*) AS cnt
FROM employees
GROUP BY (salary / 2000) * 2000
ORDER BY bucket_start;
```

</details>

<a id="q-148"></a>

### 148. Interview: explain plan approach

Write a comment block listing 5 steps you'd take to tune a slow query.

<details>
<summary><strong>Show solution</strong></summary>

```sql
-- 1. Capture actual execution plan
-- 2. Find highest-cost operators
-- 3. Check row estimates vs actuals
-- 4. Review indexes and SARGability
-- 5. Re-test with production-like volume
```

</details>

<a id="q-149"></a>

### 149. Self-assessment query

Write a query returning one row: your readiness score 1-10 as `SELECT 8 AS readiness`.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT 8 AS readiness;
```

</details>

<a id="q-150"></a>

### 150. Recent hires

Employees hired in the last 30 days.

<details>
<summary><strong>Show solution</strong></summary>

```sql
SELECT *
FROM employees
WHERE hire_date >= DATEADD(day, -30, CAST(GETDATE() AS date));
```

</details>


## Done?

Revisit [SQL Notes](/topics/sql-notes) for concepts, then test yourself with [Interview Q&A](/topics/sql-interview).

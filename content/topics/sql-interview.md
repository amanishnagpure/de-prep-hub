---
title: SQL Interview Q&A
description: 69 real SQL interview questions from your Data Engineering interview guide
order: 1.2
parent: sql
hidden: true
difficulty: interview
---

Answer each question out loud before reading the solution.

Real questions from ADF, SQL Server, and Azure Data Engineering interviews. Read the question, answer out loud, then check below.

### 1. What is a primary key?

A column (or set of
columns) that uniquely identifies each row in a table; it enforces
uniqueness and disallows NULLs, and a table can have only one primary
key.


### 2. Difference between primary key and unique key?

A
primary key doesn't allow NULLs and a table can have only one; a unique
key allows one NULL (in most RDBMS) and a table can have multiple unique
keys. Both enforce uniqueness of values.


### 3. Difference between UNION and UNION ALL?

`UNION` combines result sets and removes duplicate rows
(extra overhead for dedup/sort). `UNION ALL` combines result
sets and keeps all rows including duplicates, so it's faster.


### 4. What is the use of a foreign key?

It enforces
referential integrity by ensuring a column's values match values in a
referenced (parent) table's primary/unique key, preventing orphaned
records.


### 5. Difference between WHERE and HAVING clause?

`WHERE` filters individual rows **before**
grouping/aggregation. `HAVING` filters groups
**after** aggregation (`GROUP BY`), and can
reference aggregate functions like
`SUM()`/`COUNT()`.


### 6. What is a CTE (and recursive CTE)?

A Common Table
Expression (`WITH cte_name AS (...)`) is a named, temporary
result set usable within a single query, improving readability and
enabling reuse.


### 7. What is a view?

A virtual table defined by a
stored `SELECT` query; it doesn't store data itself (unless
it's a materialized/indexed view) but presents data dynamically from
underlying tables each time it's queried.


### 8. What is a stored procedure?

A precompiled, named
block of SQL code (with optional input/output parameters and
control-flow logic) stored in the database and invoked via
`EXEC`/`CALL`, used to encapsulate reusable
business logic.


### 9. Write a stored procedure with an input parameter.

```sql
CREATE PROCEDURE GetEmployeesByDept @DeptName VARCHAR(50)
AS
BEGIN
 SELECT * FROM Employees WHERE Department = @DeptName;
END;
```


### 10. Write a stored procedure without an input parameter.

```sql
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
 SELECT * FROM Employees;
END;
```


### 11. Types of index in SQL?

Clustered, Non-clustered,
Unique, Composite (multi-column), Full-text, Filtered, and Columnstore
indexes.


### 12. Difference between clustered and non-clustered index?

A clustered index physically sorts and stores table data
in the order of the indexed column(s) — only one per table. A
non-clustered index is a separate structure holding pointers back to the
actual data rows — a table can have many.


### 13. How do you troubleshoot a slow query?

Check the
execution plan for table scans vs. index seeks, look for missing
indexes, check statistics staleness, look for implicit conversions,
check for parameter sniffing issues, and review row estimates vs. actual
rows.


### 14. How do you optimize a SQL query?

Add appropriate
indexes, avoid `SELECT *`, filter early with
`WHERE`, avoid functions on indexed columns in predicates,
use joins instead of correlated subqueries where possible, update
statistics, and review the execution plan for expensive operators.


### 15. What is the execution order of a SQL query?

`FROM` → `JOIN` → `WHERE` →
`GROUP BY` → `HAVING` → `SELECT` →
`DISTINCT` → `ORDER BY` →
`LIMIT/OFFSET`.


### 16. Syntax to find employees with salary greater than average salary.

```sql
SELECT * FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees);
```


### 17. Syntax to find the 2nd highest salary.

```sql
SELECT MAX(salary) FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);SELECT salary FROM (
 SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk FROM Employees
) t WHERE rnk = 2;
```


### 18. Syntax to find the 2nd highest salary of each department.

```sql
SELECT department, salary FROM (
 SELECT department, salary,
 DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
 FROM Employees
) t WHERE rnk = 2;
```


### 19. Difference between TRUNCATE, DELETE, and DROP?

`DELETE` removes rows (optionally with a `WHERE`
filter), is logged row-by-row, and can be rolled back.
`TRUNCATE` removes all rows at once, is minimally logged,
resets identity counters, and is faster but usually can't be
filtered.


### 20. Difference between window and aggregate function?

An aggregate function (`SUM`, `AVG`,
`COUNT`) collapses multiple rows into one result per group. A
window function (using `OVER()`) computes a value across a
set of related rows **without collapsing them** — each row
keeps its identity while still seeing an aggregate/ranking calculated
over its window.


### 21. What happens if OVER clause is used with an aggregate function?

The aggregate function then behaves as a window
function — it computes the aggregate over the specified partition/window
but returns the result on every row in that partition instead of
collapsing rows into one.


### 22. What is the LEAD (and LAG) window function?

`LEAD(column, n)` returns the value from a row **n rows
ahead** in the ordered result set; `LAG(column, n)`
returns the value from a row **n rows behind** — both are
used for row-to-row comparisons without a self-join.


### 23. What is GROUP BY clause?

Groups rows sharing the
same value(s) in specified column(s) so aggregate functions can be
computed per group.


### 24. What is HAVING clause?

Filters groups after
aggregation, based on conditions on aggregate results (unlike
`WHERE`, which filters rows before aggregation).


### 25. Types of joins?

`INNER JOIN`,
`LEFT (OUTER) JOIN`, `RIGHT (OUTER) JOIN`,
`FULL (OUTER) JOIN`, `CROSS JOIN`, and
`SELF JOIN`.


### 26. What is a self join?

A join of a table with
itself (using table aliases), typically used to compare rows within the
same table — e.g., finding employees and their managers within the same
Employees table.


### 27. Difference between UNION and JOIN?

`UNION` stacks rows from two queries
**vertically** (combining result sets with the same column
structure). `JOIN` combines columns from two tables
**horizontally** based on a related key.


### 28. Syntax to find duplicate records.

```sql
SELECT name, email, COUNT(*)
FROM Employees
GROUP BY name, email
HAVING COUNT(*) > 1;
```


### 29. How do you create a primary key on an existing table?

```sql
ALTER TABLE Employees ADD CONSTRAINT PK_Employees PRIMARY KEY (employee_id);
```


### 30. Write the SCD Type 1 and Type 2 syntax in SQL.

```sql
**Type 1:**UPDATE target t
SET t.salary = s.salary
FROM source s
WHERE t.id = s.id;-- Expire old row
UPDATE target
SET end_date = GETDATE(), is_current = 0
WHERE id IN (SELECT id FROM source) AND is_current = 1;

-- Insert new current row
INSERT INTO target (id, salary, start_date, end_date, is_current)
SELECT id, salary, GETDATE(), NULL, 1 FROM source;
```


### 31. What is a surrogate key?

A system-generated,
artificial unique identifier (often an auto-increment integer) for a
table row, independent of any business/natural key — commonly used in
dimension tables in data warehousing (especially for SCD Type 2).


### 32. You have a DOB column but want to display only the birth year.

```sql
SELECT YEAR(DOB) AS birth_year FROM Employees;
```


### 33. How do you rename a column permanently?

```sql
-- SQL Server
EXEC sp_rename 'Employees.old_name', 'new_name', 'COLUMN';
-- Standard ANSI / MySQL / Postgres
ALTER TABLE Employees RENAME COLUMN old_name TO new_name;
```


### 34. Create a view on the customer table filtering country = USA.

```sql
CREATE VIEW vw_USA_Customers AS
SELECT * FROM Customer WHERE country = 'USA';
```


### 35. Syntax to create a new column categorizing salary into High/Medium/Low (SQL).

```sql
SELECT *,
 CASE
 WHEN salary >= 9000 THEN 'High'
 WHEN salary >= 5000 THEN 'Medium'
 ELSE 'Low'
 END AS salary_range
FROM Employees;
```


### 36. Write a multi-parameter stored procedure for country = ‘USA’ and city = ‘New York’.

```sql
CREATE PROCEDURE GetCustomersByCountryCity
 @Country VARCHAR(50),
 @City VARCHAR(50)
AS
BEGIN
 SELECT * FROM Customer WHERE country = @Country AND city = @City;
END;
-- Execution:
EXEC GetCustomersByCountryCity 'USA', 'New York';
```


### 37. Syntax to delete duplicates using a CTE.

```sql
WITH cte AS (
 SELECT *, ROW_NUMBER() OVER (PARTITION BY name, email ORDER BY id) AS rn
 FROM Employees
)
DELETE FROM cte WHERE rn > 1;
```


### 38. What are the requirements for performing a UNION operation?

Both queries must return the **same number of
columns**, in the **same order**, with
**compatible data types** for each corresponding
column.


### 39. Types of constraints in SQL?

`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`,
`NOT NULL`, `CHECK`, and `DEFAULT`.


### 40. Can you increase the size of a column (e.g., name VARCHAR(20) to 50)?

```sql
ALTER TABLE Employees ALTER COLUMN name VARCHAR(50);
```


### 41. Syntax to create a clustered index.

```sql
CREATE CLUSTERED INDEX IX_Employees_ID ON Employees(employee_id);
```


### 42. How do you create a backup table from an existing table?

```sql
SELECT * INTO Employees_Backup FROM Employees;
-- or (Postgres/others)
CREATE TABLE Employees_Backup AS SELECT * FROM Employees;
```


### 43. Can we do a UNION on 3 tables?

Yes —
`UNION`/`UNION ALL` can combine any number of
`SELECT` statements as long as each has the same column
count, order, and compatible types:

```sql
SELECT * FROM TableA
UNION
SELECT * FROM TableB
UNION
SELECT * FROM TableC;
```


### 44. You’re responsible for production and need to fix an issue in a table, but running a query risks damaging data — your boss asks you to back it up first. How?

Take a full backup/snapshot of the
table before making changes,
e.g. `SELECT * INTO Employees_Backup FROM Employees;` (or a
database-level backup via the DB's native backup tooling), so you can
restore if the fix goes wrong.

---


### 45. What is a composite key? Can you create one?

A
composite key is a primary/unique key made up of **two or more
columns combined**, used when no single column uniquely
identifies a row.

```sql
ALTER TABLE OrderDetails ADD CONSTRAINT PK_OrderDetails PRIMARY KEY (order_id, product_id);
```


### 46. What is a natural key?

A key derived from real,
business-meaningful data that already exists in the source (e.g., an
email address, SSN, or product SKU) — as opposed to a **surrogate
key**, which is an artificially generated identifier with no
business meaning.


### 47. A name column has all lowercase letters — how do you capitalize the first letter?

```sql
SELECT CONCAT(UPPER(LEFT(name,1)), LOWER(SUBSTRING(name,2,LEN(name)))) AS proper_name
FROM Employees;
```


### 48. How do you trim leading/trailing spaces from a column?

```sql
SELECT TRIM(name) AS trimmed_name FROM Employees;
-- (Older SQL Server versions: LTRIM(RTRIM(name)))
```


### 49. A code column starts with a 4-digit year (e.g., “2023BH1042”) — how do you extract just the year into a new column?

```sql
SELECT LEFT(code_column, 4) AS year_extracted FROM Employees;
```


### 50. How do you join 4 tables in SQL?

```sql
SELECT *
FROM TableA A
JOIN TableB B ON A.id = B.a_id
JOIN TableC C ON B.id = C.b_id
JOIN TableD D ON C.id = D.c_id;
```


### 51. How do you rename a table?

```sql
-- SQL Server
EXEC sp_rename 'OldTableName', 'NewTableName';
-- Standard ANSI / MySQL / Postgres
ALTER TABLE OldTableName RENAME TO NewTableName;
```


### 52. Can you create a multi-column (composite) index?

```sql
CREATE INDEX IX_Employees_Dept_Salary ON Employees(department, salary);
```


### 53. How do you display only duplicate records in a table?

```sql
SELECT name, email, COUNT(*) AS cnt
FROM Employees
GROUP BY name, email
HAVING COUNT(*) > 1;
```


### 54. Given table structure Orders(order_id, customer_id, order_amount), Customers(customer_id, customer_name), Payments(order_id, payment_status) — find customer_name and total order_amount for only successfully paid orders.

```sql
SELECT c.customer_name, SUM(o.order_amount) AS total_amount
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Payments p ON o.order_id = p.order_id
WHERE p.payment_status = 'Success'
GROUP BY c.customer_name;
```


### 55. Find customer_name who never placed any order.

```sql
SELECT c.customer_name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```


### 56. Show total orders and successful payments count for each customer.

```sql
SELECT c.customer_name,
 COUNT(o.order_id) AS total_orders,
 SUM(CASE WHEN p.payment_status = 'Success' THEN 1 ELSE 0 END) AS successful_payments
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
LEFT JOIN Payments p ON o.order_id = p.order_id
GROUP BY c.customer_name;
```


### 57. You have Orders and OrderDetails tables — find each order and its quantity.

```sql
SELECT o.order_id, od.quantity
FROM Orders o
JOIN OrderDetails od ON o.order_id = od.order_id;
```


### 58. Find all orders placed in 2022 from an Orders table with an order_date column.

```sql
SELECT * FROM Orders WHERE YEAR(order_date) = 2022;
```


### 59. For an Orders table with order_date, find the previous order date for each row.

```sql
SELECT order_id, order_date,
 LAG(order_date) OVER (ORDER BY order_date) AS previous_order_date
FROM Orders;
```


### 60. Find customers who placed more than 5 orders.

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM Orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```


### 61. Two tables have IDs 1,1,0,1 and 1,1,NULL,0 — how many rows result from INNER, LEFT, RIGHT, and FULL join?

This depends on exact matching pairs, but
conceptually: **INNER JOIN** returns only rows where both
sides have matching (non-null) values; **LEFT JOIN**
returns all rows from the left table plus matches from the right
(unmatched right-side columns as NULL); **RIGHT JOIN** is
the mirror of LEFT; **FULL JOIN** returns all rows from
both sides, matched where possible and NULL-filled where not.


### 62. Given values 101,102,102,103,104,105 — what will ROW_NUMBER() output be?

`ROW_NUMBER()`
always assigns a strictly increasing, unique sequence regardless of
duplicates: 1, 2, 3, 4, 5, 6 (it doesn't skip or repeat for the
duplicate `102` — that's the key difference from
`RANK()`/`DENSE_RANK()`, which do account for
ties).


### 63. What is the default join if you just write “JOIN” without specifying a type?

**INNER JOIN** —
`JOIN` alone defaults to `INNER JOIN` in standard
SQL.


### 64. Difference between OR and IN?

`IN` is
shorthand for multiple `OR` conditions on the **same
column** (`WHERE dept IN ('HR','IT')` is equivalent to
`WHERE dept = 'HR' OR dept = 'IT'`) — more concise and often
more readable/optimizable, but `OR` is more flexible since it
can combine conditions across **different** columns.


### 65. Which operation supports rollback — DELETE, TRUNCATE, or DROP?

`DELETE` (within an explicit transaction)
supports rollback. `TRUNCATE` and `DROP` are
typically auto-committed/minimally logged in most databases and
generally **cannot** be rolled back once committed (though
some databases like SQL Server do allow rolling back TRUNCATE/DROP if
wrapped in an explicit uncommitted transaction).


### 66. Can we apply a WHERE condition on an aggregated column?

**No** — `WHERE` filters rows
before aggregation happens, so it can't reference an aggregate result;
use `HAVING` instead, which filters after aggregation.


### 67. Difference between RANK() and DENSE_RANK()?

Both
assign a rank based on `ORDER BY`, with ties getting the same
rank. `RANK()` **skips** the next rank number(s)
after a tie (e.g., 1,2,2,4).


### 68. What is a temporary table?

A table that exists
only for the duration of a session or a specific scope, automatically
dropped afterward — used to hold intermediate results during complex
processing (`#TempTable` in SQL Server, or
`CREATE TEMPORARY TABLE` in MySQL/Postgres).


### 69. What are the different types of data distribution (e.g., in Synapse/MPP systems)?

**Round-robin** (rows
spread evenly/randomly across nodes, no clustering logic),
**Hash-distributed** (rows distributed based on a hash of a
chosen column, co-locating matching keys for efficient joins), and
**Replicated** (a full copy of a small table stored on
every node, avoiding shuffle for joins against it).

---

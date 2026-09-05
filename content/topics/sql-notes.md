---
title: SQL Notes
description: Complete SQL reference — basics through advanced, data engineering topics, patterns and traps
order: 1.1
parent: sql
hidden: true
difficulty: basic
---

## Basic

### What is SQL?

**SQL = Structured Query Language.**

SQL is used to interact with relational databases.

You can use SQL to:

* Create databases/tables
* Insert data
* Read data
* Update data
* Delete data
* Filter data
* Aggregate data
* Join tables
* Create views
* Create stored procedures
* Manage transactions
* Control permissions

Example:

```sql
SELECT *
FROM employees;
```

---

### What is a Database?

A database is an organized collection of data.

Example:

```text
Company Database
│
├── employees
├── departments
├── salaries
├── projects
└── attendance
```

---

### What is a Table?

A table stores data in **rows and columns**.

Example:

**employees**

| emp_id | name  | dept | salary |
| -----: | ----- | ---- | -----: |
|      1 | Rahul | IT   |   6000 |
|      2 | Amit  | HR   |   5000 |
|      3 | Priya | IT   |   8000 |

* Row → one record
* Column → one attribute

---

### SQL Command Categories

Very important for interviews.

**DDL**

**Data Definition Language**

Used to define database structures.

```sql
CREATE
ALTER
DROP
TRUNCATE
```

Example:

```sql
CREATE TABLE employees (
    emp_id INT,
    name VARCHAR(100),
    salary INT
);
```


**DML**

**Data Manipulation Language**

Used to manipulate data.

```sql
INSERT
UPDATE
DELETE
```

Example:

```sql
INSERT INTO employees
VALUES (1, 'Rahul', 6000);
```


**DQL**

**Data Query Language**

Mainly:

```sql
SELECT
```


**DCL**

**Data Control Language**

```sql
GRANT
REVOKE
```


**TCL**

**Transaction Control Language**

```sql
COMMIT
ROLLBACK
SAVEPOINT
```

---

### CREATE TABLE

```sql
CREATE TABLE employees (
    emp_id INT,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2)
);
```

---

### INSERT

Insert one row:

```sql
INSERT INTO employees
VALUES (1, 'Rahul', 'IT', 6000);
```

Insert selected columns:

```sql
INSERT INTO employees
    (emp_id, name, salary)
VALUES
    (1, 'Rahul', 6000);
```

Multiple rows:

```sql
INSERT INTO employees
VALUES
(1, 'Rahul', 'IT', 6000),
(2, 'Amit', 'HR', 5000),
(3, 'Priya', 'IT', 8000);
```

---

### SELECT

```sql
SELECT *
FROM employees;
```

Specific columns:

```sql
SELECT name, salary
FROM employees;
```

---

### WHERE

Filters individual rows.

```sql
SELECT *
FROM employees
WHERE salary > 5000;
```

Important:

```text
WHERE → filters rows
HAVING → filters groups
```

---

### Comparison Operators

```sql
=
<>
!=
>
<
>=
<=
```

Example:

```sql
SELECT *
FROM employees
WHERE salary >= 5000;
```

---

### AND

```sql
SELECT *
FROM employees
WHERE department = 'IT'
AND salary > 5000;
```

Both conditions must be true.

---

### OR

```sql
SELECT *
FROM employees
WHERE department = 'IT'
OR department = 'HR';
```

At least one condition must be true.

---

### NOT

```sql
SELECT *
FROM employees
WHERE NOT department = 'HR';
```

---

### BETWEEN

```sql
SELECT *
FROM employees
WHERE salary BETWEEN 5000 AND 8000;
```

`BETWEEN` is inclusive.

So:

```text
5000 ≤ salary ≤ 8000
```

---

### IN

Instead of:

```sql
WHERE department = 'IT'
OR department = 'HR'
OR department = 'Finance'
```

Use:

```sql
WHERE department IN ('IT', 'HR', 'Finance');
```

---

### LIKE

Pattern matching.

Starts with:

```sql
WHERE name LIKE 'A%';
```

Ends with:

```sql
WHERE name LIKE '%a';
```

Contains:

```sql
WHERE name LIKE '%rah%';
```

Exactly one character:

```sql
WHERE name LIKE '_a%';
```

---

### NULL

`NULL` means:

> Missing / unknown / unavailable value.

Wrong:

```sql
WHERE salary = NULL
```

Correct:

```sql
WHERE salary IS NULL
```

Not null:

```sql
WHERE salary IS NOT NULL
```

---

### DISTINCT

Removes duplicate results.

```sql
SELECT DISTINCT department
FROM employees;
```

---

### ORDER BY

Sorts result.

Ascending:

```sql
SELECT *
FROM employees
ORDER BY salary ASC;
```

Descending:

```sql
SELECT *
FROM employees
ORDER BY salary DESC;
```

Default is usually ascending.

---

### TOP

SQL Server:

```sql
SELECT TOP 5 *
FROM employees
ORDER BY salary DESC;
```

Returns top 5 highest-paid employees.

---

### LIMIT

MySQL/PostgreSQL:

```sql
SELECT *
FROM employees
LIMIT 5;
```

Databricks SQL also commonly uses:

```sql
LIMIT 5;
```

---

### OFFSET

Used for pagination.

```sql
SELECT *
FROM employees
ORDER BY emp_id
OFFSET 10 ROWS
FETCH NEXT 10 ROWS ONLY;
```

Meaning:

```text
Skip first 10
Take next 10
```

---

### Column Alias

```sql
SELECT
    name,
    salary AS employee_salary
FROM employees;
```

---

### Arithmetic Operators

```sql
+
-
*
/
%
```

Example:

```sql
SELECT
    salary,
    salary * 12 AS annual_salary
FROM employees;
```

---

### CASE

SQL equivalent of if/else.

```sql
SELECT
    name,
    salary,
    CASE
        WHEN salary >= 8000 THEN 'High'
        WHEN salary >= 5000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_category
FROM employees;
```

Very important for Data Engineering.

---

### COALESCE

Returns first non-null value.

```sql
SELECT
    COALESCE(phone, 'Not Available')
FROM employees;
```

Example:

```text
phone = NULL
→ Not Available
```

---

### NULLIF

Returns NULL if two expressions are equal.

```sql
SELECT NULLIF(10, 10);
```

Result:

```text
NULL
```

Useful for avoiding divide-by-zero:

```sql
SELECT revenue / NULLIF(quantity, 0)
FROM sales;
```

---

### Aggregate Functions

Most important:

```sql
COUNT()
SUM()
AVG()
MIN()
MAX()
```

Example:

```sql
SELECT
    COUNT(*) AS employee_count,
    SUM(salary) AS total_salary,
    AVG(salary) AS average_salary,
    MIN(salary) AS minimum_salary,
    MAX(salary) AS maximum_salary
FROM employees;
```

---

### COUNT(*)

Counts rows.

```sql
SELECT COUNT(*)
FROM employees;
```

---

### COUNT(column)

Counts only non-null values.

```sql
SELECT COUNT(phone)
FROM employees;
```

If:

```text
phone
-----
123
NULL
456
```

Then:

```text
COUNT(*)       = 3
COUNT(phone)   = 2
```

---

### GROUP BY

Used to create groups.

```sql
SELECT
    department,
    COUNT(*) AS employee_count
FROM employees
GROUP BY department;
```

Output:

```text
IT       10
HR       5
Finance  8
```

---

### HAVING

Filters groups.

```sql
SELECT
    department,
    COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;
```

---

### WHERE vs HAVING

This is a **very common interview question**.

**WHERE**

Filters rows **before grouping**.

```sql
WHERE salary > 5000
```

**HAVING**

Filters groups **after grouping**.

```sql
HAVING SUM(salary) > 50000
```

Example:

```sql
SELECT
    department,
    SUM(salary) AS total_salary
FROM employees
WHERE salary >= 5000
GROUP BY department
HAVING SUM(salary) > 20000;
```

Execution conceptually:

```text
FROM
 ↓
WHERE
 ↓
GROUP BY
 ↓
HAVING
 ↓
SELECT
```

---

### SQL Logical Execution Order

Extremely important.

When you write:

```sql
SELECT department, AVG(salary)
FROM employees
WHERE salary > 5000
GROUP BY department
HAVING AVG(salary) > 7000
ORDER BY AVG(salary) DESC;
```

SQL logically processes:

```text
1. FROM
2. JOIN
3. WHERE
4. GROUP BY
5. HAVING
6. SELECT
7. DISTINCT
8. ORDER BY
9. LIMIT / TOP / OFFSET
```

This explains many SQL interview questions.

---

## Medium

### JOINS

Joins combine rows from multiple tables.

Suppose:

**employees**

| emp_id | name  | dept_id |
| -----: | ----- | ------: |
|      1 | Rahul |      10 |
|      2 | Amit  |      20 |
|      3 | Priya |      10 |

**departments**

| dept_id | dept_name |
| ------: | --------- |
|      10 | IT        |
|      20 | HR        |
|      30 | Finance   |

---

### INNER JOIN

Returns matching records from both tables.

```sql
SELECT
    e.name,
    d.dept_name
FROM employees e
INNER JOIN departments d
    ON e.dept_id = d.dept_id;
```

Result:

```text
Rahul   IT
Amit    HR
Priya   IT
```

---

### LEFT JOIN

Returns:

> Everything from LEFT table + matching records from RIGHT table.

```sql
SELECT
    e.name,
    d.dept_name
FROM employees e
LEFT JOIN departments d
    ON e.dept_id = d.dept_id;
```

If an employee has no department:

```text
John    NULL
```

---

### RIGHT JOIN

Everything from right table + matching left rows.

```sql
SELECT *
FROM employees e
RIGHT JOIN departments d
    ON e.dept_id = d.dept_id;
```

---

### FULL OUTER JOIN

Returns:

> Matching + unmatched rows from both tables.

```sql
SELECT *
FROM employees e
FULL OUTER JOIN departments d
    ON e.dept_id = d.dept_id;
```

---

### CROSS JOIN

Cartesian product.

If:

```text
employees = 3 rows
departments = 4 rows
```

Result:

```text
3 × 4 = 12 rows
```

```sql
SELECT *
FROM employees
CROSS JOIN departments;
```

Use carefully because it can explode data volume.

---

### SELF JOIN

A table joined with itself.

Typical employee-manager problem:

```text
employees
---------
emp_id
name
manager_id
```

Query:

```sql
SELECT
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m
    ON e.manager_id = m.emp_id;
```

---

### UNION

Combines results and removes duplicates.

```sql
SELECT city FROM customers
UNION
SELECT city FROM suppliers;
```

---

### UNION ALL

Combines results **without removing duplicates**.

```sql
SELECT city FROM customers
UNION ALL
SELECT city FROM suppliers;
```

**Difference**

```text
UNION
→ removes duplicates
→ additional processing

UNION ALL
→ keeps duplicates
→ generally faster
```

---

### INTERSECT

Returns common records.

```sql
SELECT customer_id
FROM customers

INTERSECT

SELECT customer_id
FROM orders;
```

Meaning:

> Customers who have orders.

---

### EXCEPT

Returns records from first query that don't exist in second.

```sql
SELECT customer_id
FROM customers

EXCEPT

SELECT customer_id
FROM orders;
```

Meaning:

> Customers who never ordered.

---

### EXCEPT vs EXCEPT ALL

Where supported:

```text
EXCEPT
```

removes duplicates.

```text
EXCEPT ALL
```

preserves duplicate multiplicity.

This is particularly relevant in PostgreSQL/Databricks/Spark SQL contexts; support varies by database engine.

---

### Subquery

A query inside another query.

Example:

```sql
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);
```

Meaning:

> Employees earning more than average salary.

---

### Correlated Subquery

A subquery that depends on the outer query.

```sql
SELECT e1.*
FROM employees e1
WHERE salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
```

Meaning:

> Employees earning more than their department's average.

---

### EXISTS

Checks whether a subquery returns at least one row.

```sql
SELECT *
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

Meaning:

> Customers who have at least one order.

---

### NOT EXISTS

```sql
SELECT *
FROM customers c
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

Meaning:

> Customers with no orders.

---

### EXISTS vs IN

`EXISTS` checks existence.

`IN` compares values.

For example:

```sql
WHERE customer_id IN (
    SELECT customer_id
    FROM orders
);
```

versus:

```sql
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
);
```

For large correlated datasets, `EXISTS` can often be preferable, but the optimizer and data distribution matter. Don't blindly claim "`EXISTS` is always faster."

---

### CTE

CTE = Common Table Expression.

Syntax:

```sql
WITH high_salary AS (
    SELECT *
    FROM employees
    WHERE salary > 5000
)
SELECT *
FROM high_salary;
```

Benefits:

* Readability
* Break complex queries into logical steps
* Recursive queries
* Easier debugging

---

### Multiple CTEs

```sql
WITH employee_data AS (
    SELECT *
    FROM employees
),
high_salary AS (
    SELECT *
    FROM employee_data
    WHERE salary > 5000
)
SELECT *
FROM high_salary;
```

---

### Recursive CTE

Used for hierarchical data.

Example:

```text
CEO
 ├── Manager 1
 │    ├── Employee 1
 │    └── Employee 2
 └── Manager 2
```

SQL Server example:

```sql
WITH EmployeeHierarchy AS (

    SELECT
        emp_id,
        name,
        manager_id,
        0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    SELECT
        e.emp_id,
        e.name,
        e.manager_id,
        eh.level + 1
    FROM employees e
    JOIN EmployeeHierarchy eh
        ON e.manager_id = eh.emp_id
)

SELECT *
FROM EmployeeHierarchy;
```

---

### Window Functions

One of the **most important SQL topics for Data Engineers**.

Window functions calculate values across related rows **without collapsing rows**.

Example:

```sql
SELECT
    name,
    department,
    salary,
    AVG(salary) OVER (
        PARTITION BY department
    ) AS dept_avg_salary
FROM employees;
```

Every employee remains as a separate row.

---

### GROUP BY vs Window Function

**GROUP BY**

```sql
SELECT
    department,
    AVG(salary)
FROM employees
GROUP BY department;
```

Produces:

```text
IT      7000
HR      5000
```

Rows are collapsed.

**Window:**

```sql
SELECT
    name,
    department,
    salary,
    AVG(salary) OVER (
        PARTITION BY department
    )
FROM employees;
```

Produces:

```text
Rahul  IT  6000  7000
Priya  IT  8000  7000
Amit   HR  5000  5000
```

---

### ROW_NUMBER()

Assigns unique sequential numbers.

```sql
SELECT
    name,
    salary,
    ROW_NUMBER() OVER (
        ORDER BY salary DESC
    ) AS rn
FROM employees;
```

---

### RANK()

```sql
RANK() OVER (
    ORDER BY salary DESC
)
```

If salaries:

```text
10000
10000
8000
7000
```

Rank:

```text
1
1
3
4
```

---

### DENSE_RANK()

Same example:

```text
10000
10000
8000
7000
```

Result:

```text
1
1
2
3
```

---

### ROW_NUMBER vs RANK vs DENSE_RANK

| Function   | Duplicate rank | Gaps |
| ---------- | -------------- | ---- |
| ROW_NUMBER | Unique         | No   |
| RANK       | Same rank      | Yes  |
| DENSE_RANK | Same rank      | No   |

This is extremely important.

---

### PARTITION BY

Don't confuse with database partitions.

Inside a window function:

```sql
PARTITION BY department
```

means:

> Perform calculation separately for each department.

Example:

```sql
ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
)
```

Gives each department its own ranking.

---

### LAG()

Access previous row.

```sql
SELECT
    sale_date,
    revenue,
    LAG(revenue) OVER (
        ORDER BY sale_date
    ) AS previous_revenue
FROM sales;
```

Useful for:

* Month-over-month comparison
* Previous transaction
* Previous salary
* Change detection

---

### LEAD()

Access next row.

```sql
LEAD(revenue) OVER (
    ORDER BY sale_date
)
```

---

### Running Total

```sql
SELECT
    sale_date,
    revenue,
    SUM(revenue) OVER (
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING
        AND CURRENT ROW
    ) AS running_revenue
FROM sales;
```

---

### Moving Average

Example 3-row moving average:

```sql
AVG(revenue) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 2 PRECEDING
    AND CURRENT ROW
)
```

---

### FIRST_VALUE

```sql
FIRST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
)
```

---

### LAST_VALUE

Be careful.

Window frame matters.

Example:

```sql
LAST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary
    ROWS BETWEEN UNBOUNDED PRECEDING
    AND UNBOUNDED FOLLOWING
)
```

Without the correct frame, `LAST_VALUE()` frequently surprises candidates.

---

## Advanced

### Primary Key

Uniquely identifies every row.

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

Properties:

* Unique
* Cannot be NULL
* One primary-key constraint per table
* Can contain multiple columns → composite primary key

---

### Foreign Key

Maintains relationship between tables.

```sql
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
);
```

---

### UNIQUE Constraint

Ensures values are unique.

```sql
email VARCHAR(100) UNIQUE
```

Difference from primary key:

```text
PRIMARY KEY
→ identifies row
→ NOT NULL

UNIQUE
→ prevents duplicate values
→ NULL behavior depends on DBMS
```

---

### NOT NULL

```sql
name VARCHAR(100) NOT NULL
```

Column must contain a value.

---

### CHECK

```sql
salary INT CHECK (salary > 0)
```

---

### DEFAULT

```sql
status VARCHAR(20) DEFAULT 'ACTIVE'
```

---

### Composite Key

Key consisting of multiple columns.

```sql
PRIMARY KEY (customer_id, product_id)
```

Useful when uniqueness is defined by a combination.

---

### Normalization

Normalization reduces:

* Duplicate data
* Update anomalies
* Insert anomalies
* Delete anomalies

---

### First Normal Form — 1NF

Requirements:

* Atomic values
* No repeating groups

Bad:

```text
customer_id | phone
1           | 9876, 1234
```

Better:

```text
customer_id | phone
1           | 9876
1           | 1234
```

---

### Second Normal Form — 2NF

Must:

1. Be in 1NF
2. Have no partial dependency on part of a composite key.

Relevant mainly when a table has a composite key.

---

### Third Normal Form — 3NF

Must:

1. Be in 2NF
2. Have no transitive dependency.

Example:

```text
emp_id → dept_id
dept_id → dept_name
```

Instead of storing:

```text
emp_id | dept_id | dept_name
```

Separate department data.

---

### Denormalization

Intentionally introducing redundancy to improve read performance.

Common in:

* Data warehouses
* Analytics systems
* Reporting systems

---

### OLTP vs OLAP

**OLTP**

Online Transaction Processing.

Examples:

* Banking
* Payments
* E-commerce orders

Characteristics:

```text
Many small transactions
High concurrency
Highly normalized
Fast INSERT/UPDATE
```

**OLAP**

Online Analytical Processing.

Examples:

* Data warehouse
* BI
* Reporting

Characteristics:

```text
Large queries
Aggregations
Historical data
Read-heavy
Often denormalized
```

---

### Index

An index is a data structure that helps the database find rows faster.

Without index:

```text
Scan many/all rows
```

With index:

```text
Navigate index
→ locate matching rows
→ fetch required data
```

---

### Clustered Index

In SQL Server, a clustered index determines the physical/logical organization of the table's data pages around the clustering key.

Important:

> A table can have only one clustered index.

Because the table's data can have only one clustered organization.

---

### Non-Clustered Index

Separate index structure containing key values and row locators.

A table can have multiple nonclustered indexes.

Example:

```sql
CREATE INDEX idx_employee_salary
ON employees(salary);
```

---

### Composite Index

Index on multiple columns.

```sql
CREATE INDEX idx_dept_salary
ON employees(department, salary);
```

Important concept:

**Leftmost prefix**

For:

```text
(department, salary)
```

queries filtering by:

```text
department
```

can benefit strongly.

But a query only filtering by:

```text
salary
```

may not benefit in the same way.

Exact optimizer behavior depends on the DBMS.

---

### Covering Index

An index containing all columns required by a query.

SQL Server:

```sql
CREATE INDEX idx_emp_dept
ON employees(department)
INCLUDE (name, salary);
```

Query:

```sql
SELECT name, salary
FROM employees
WHERE department = 'IT';
```

The index can potentially satisfy the query without additional base-table lookups.

---

### Index Advantages

Indexes can improve:

* SELECT
* JOIN
* WHERE
* ORDER BY
* GROUP BY in some cases

---

### Index Disadvantages

Indexes consume:

* Storage
* Memory/cache
* Write overhead

Every:

```text
INSERT
UPDATE
DELETE
```

may require index maintenance.

Therefore:

> Don't blindly create indexes on every column.

---

### SARGability

SARG = Search ARGument.

A predicate is generally **SARGable** when the database can efficiently use an index to seek/filter.

Bad:

```sql
WHERE YEAR(order_date) = 2026
```

Potentially better:

```sql
WHERE order_date >= '2026-01-01'
AND order_date < '2027-01-01'
```

Why?

Applying a function directly to the indexed column can prevent efficient index seeking in many systems.

---

### Transactions

A transaction is a logical unit of work.

Example:

```text
Transfer ₹1000

Debit account A
Credit account B
```

Both should succeed, or neither should.

---

### ACID

**Atomicity**

All or nothing.

**Consistency**

Database moves from one valid state to another.

**Isolation**

Concurrent transactions shouldn't improperly interfere with each other.

**Durability**

Committed changes survive failures.

---

### COMMIT

Makes transaction changes permanent.

```sql
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 1;

COMMIT;
```

---

### ROLLBACK

Undo uncommitted changes.

```sql
BEGIN TRANSACTION;

UPDATE accounts
SET balance = balance - 1000
WHERE account_id = 1;

ROLLBACK;
```

---

### Isolation Levels

Important advanced interview topic.

Common levels:

```text
READ UNCOMMITTED
READ COMMITTED
REPEATABLE READ
SNAPSHOT / MVCC-style isolation
SERIALIZABLE
```

---

### Dirty Read

Transaction A reads uncommitted data written by Transaction B.

```text
B updates
↓
A reads
↓
B rolls back
```

A saw data that never committed.

---

### Non-Repeatable Read

Transaction reads the same row twice and gets different values because another transaction committed an update between reads.

---

### Phantom Read

Transaction runs a range query twice and sees additional/missing rows because another transaction inserted/deleted matching rows.

---

### Deadlock

Two transactions wait for each other's locks.

Example:

```text
Transaction A locks Row 1
Transaction B locks Row 2

A waits for Row 2
B waits for Row 1
```

Neither can continue.

Database detects the deadlock and normally chooses one transaction as the victim.

---

### View

A view is a stored query that behaves like a virtual table.

```sql
CREATE VIEW employee_summary AS
SELECT
    department,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
```

Then:

```sql
SELECT *
FROM employee_summary;
```

---

### Stored Procedure

A stored procedure is a reusable set of SQL statements stored in the database.

SQL Server:

```sql
CREATE PROCEDURE GetEmployees
    @Department VARCHAR(50)
AS
BEGIN
    SELECT *
    FROM employees
    WHERE department = @Department;
END;
```

Execute:

```sql
EXEC GetEmployees 'IT';
```

---

### Function

Functions return a value/table depending on DBMS and function type.

Example:

```sql
SELECT UPPER(name)
FROM employees;
```

Built-in functions include:

```text
UPPER
LOWER
LEN
SUBSTRING
COALESCE
ROUND
```

---

### Trigger

A trigger automatically executes when an event occurs.

Example events:

```text
INSERT
UPDATE
DELETE
```

Use cases:

* Auditing
* Automatic history tracking
* Enforcing certain business rules

But triggers can make systems harder to reason about and debug, so use them carefully.

---

### Temporary Table

SQL Server:

```sql
CREATE TABLE #temp_employee (
    emp_id INT,
    name VARCHAR(100)
);
```

Temporary tables can be useful for intermediate results, especially when reuse/indexing/statistics matter.

---

### CTE vs Temporary Table

| CTE                                     | Temp Table                                    |
| --------------------------------------- | --------------------------------------------- |
| Query expression                        | Temporary object                              |
| Mainly readability/organization         | Stores intermediate results                   |
| Usually statement-scoped                | Can persist for session/procedure scope       |
| No automatic materialization assumption | Materialized storage                          |
| Good for query structure                | Good for repeated use/intermediate processing |

Important:

> Don't say "CTE is always faster" or "CTE always stores data in memory." Those are incorrect generalizations.

---

### Temporary Table vs Table Variable

SQL Server interview topic.

**Temp table**

```sql
#temp
```

**Table variable**

```sql
DECLARE @table TABLE (...)
```

For small/simple datasets, table variables can be convenient. For larger/intermediate workloads, temporary tables often provide better optimizer/statistics options depending on SQL Server version and workload.

---

### Partitioning

Partitioning splits a large table into logical/physical partitions based on a partitioning key.

Example:

```text
sales
│
├── 2024
├── 2025
└── 2026
```

Instead of scanning all partitions, a query may scan only relevant ones.

This is called:

> Partition pruning.

---

### Partitioning vs Indexing

**Index**

Optimizes access paths within a table.

**Partitioning**

Splits a large table into partitions.

They solve different problems and can be used together.

---

### Query Optimization

When optimizing SQL, look at:

1. Execution plan
2. Indexes
3. Join strategy
4. Filtering
5. Cardinality
6. Statistics
7. Data types
8. Partition pruning
9. Predicate pushdown
10. Unnecessary columns
11. Unnecessary sorting
12. Expensive functions

---

### Execution Plan

Shows how the database intends to execute a query.

Common operators:

```text
Table Scan
Index Scan
Index Seek
Sort
Hash Match
Nested Loops
Merge Join
Aggregate
Filter
```

---

### Index Seek vs Index Scan

**Index Seek**

Navigates to relevant index entries.

Usually preferable when selectivity is high.

**Index Scan**

Reads many/all index entries.

Not necessarily bad.

For a query returning a large percentage of a table, a scan may actually be the better plan.

---

### Join Algorithms

Important advanced topic.

Common physical join strategies:

**Nested Loops**

Good when one input is small and the other has a useful index/access path.

**Hash Join**

Useful for large unsorted inputs and equality joins.

**Merge Join**

Useful when both inputs are appropriately sorted on the join keys.

---

### Statistics

Database statistics describe data distribution and help the optimizer estimate row counts.

Bad cardinality estimates can cause poor execution plans.

---

### Cardinality

Cardinality means, broadly:

> Number of rows / distinct values depending on context.

Example:

```text
employees = 1,000,000 rows
```

Table cardinality:

```text
1 million
```

Column cardinality could mean distinct-value count depending on usage.

---

## Data Engineering

For an **Azure Data Engineer / Databricks role**, don't stop at basic SQL.

Your priority should be:

**Tier 1 — Must know**

```text
SELECT
WHERE
GROUP BY
HAVING
JOIN
CASE
COALESCE
UNION
UNION ALL
Subqueries
CTE
```

**Tier 2 — Extremely important**

```text
ROW_NUMBER
RANK
DENSE_RANK
LAG
LEAD
SUM OVER
AVG OVER
PARTITION BY
Window frames
```

**Tier 3 — Data Engineering**

```text
SCD Type 1
SCD Type 2
MERGE
CDC
Incremental load
Watermark
Deduplication
Data quality
NULL handling
Date/time transformations
```

**Tier 4 — Performance**

```text
Indexes
Execution plans
Statistics
SARGability
Partition pruning
Predicate pushdown
Column pruning
Join optimization
Cardinality
```

**Tier 5 — Warehouse**

```text
Fact table
Dimension table
Star schema
Snowflake schema
Surrogate key
Natural key
Slowly Changing Dimensions
```


### THE SQL ROADMAP I RECOMMEND FOR YOU

Since you're targeting **Data Engineering**, don't study SQL randomly.

Follow this order:

```text
                    SQL
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
     BASIC                     MEDIUM
        │                         │
 SELECT / WHERE               JOIN
 GROUP BY                     CTE
 HAVING                       SUBQUERY
 CASE                         EXISTS
 NULL                         UNION
        │                         │
        └────────────┬────────────┘
                     ↓
               WINDOW FUNCTIONS
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
   ROW_NUMBER      LAG/LEAD      RANK
       │             │             │
       └─────────────┼─────────────┘
                     ↓
                 ADVANCED
                     │
       ┌─────────────┼──────────────┐
       ↓             ↓              ↓
    Indexes       Transactions    Optimization
       │             │              │
       └─────────────┼──────────────┘
                     ↓
              DATA ENGINEERING
                     │
      ┌──────────────┼───────────────┐
      ↓              ↓               ↓
     SCD            CDC          Incremental
      │              │               │
      └──────────────┼───────────────┘
                     ↓
              DATA WAREHOUSING
                     │
             Fact + Dimension
                     │
                Star Schema
```

**Your highest-priority topics**

If your goal is to become **interview-ready**, I'd put your effort approximately like this:

| Topic              | Priority |
| ------------------ | -------: |
| Joins              |    ⭐⭐⭐⭐⭐ |
| GROUP BY / HAVING  |    ⭐⭐⭐⭐⭐ |
| Window Functions   |    ⭐⭐⭐⭐⭐ |
| CTE                |    ⭐⭐⭐⭐⭐ |
| Subqueries         |    ⭐⭐⭐⭐⭐ |
| CASE / NULL        |    ⭐⭐⭐⭐⭐ |
| ROW_NUMBER / RANK  |    ⭐⭐⭐⭐⭐ |
| LAG / LEAD         |    ⭐⭐⭐⭐⭐ |
| Deduplication      |    ⭐⭐⭐⭐⭐ |
| SCD 1/2            |    ⭐⭐⭐⭐⭐ |
| Incremental Load   |    ⭐⭐⭐⭐⭐ |
| Query Optimization |     ⭐⭐⭐⭐ |
| Indexes            |     ⭐⭐⭐⭐ |
| Transactions       |     ⭐⭐⭐⭐ |
| Normalization      |      ⭐⭐⭐ |
| Views / Procedures |      ⭐⭐⭐ |
| Triggers           |       ⭐⭐ |

**One important point:** don't try to memorize these 200 answers word-for-word. For your interviews, the real skill is being able to take a new problem and recognize **which SQL pattern applies**.

If we turn this into your actual preparation, the next useful step is a **SQL Practice Set of ~150 coding problems arranged Basic → Medium → Hard**, where you write the query first and I evaluate it like an interviewer.

## Patterns & Traps

Instead of memorizing 200 isolated questions, master these patterns.

**Pattern 1 — Top N**

```sql
ROW_NUMBER()
RANK()
DENSE_RANK()
```


**Pattern 2 — Latest record**

```sql
ROW_NUMBER() OVER (
    PARTITION BY id
    ORDER BY timestamp DESC
)
```

Then:

```sql
WHERE rn = 1
```


**Pattern 3 — Previous row**

```sql
LAG()
```


**Pattern 4 — Next row**

```sql
LEAD()
```


**Pattern 5 — Running total**

```sql
SUM() OVER (
    ORDER BY date
)
```


**Pattern 6 — Department comparison**

```sql
AVG() OVER (
    PARTITION BY department
)
```


**Pattern 7 — Deduplication**

```sql
ROW_NUMBER() OVER (
    PARTITION BY business_key
    ORDER BY updated_at DESC
)
```

Keep:

```sql
rn = 1
```


**Pattern 8 — Find duplicates**

```sql
GROUP BY key
HAVING COUNT(*) > 1
```


**Pattern 9 — Missing records**

```sql
LEFT JOIN
WHERE right.key IS NULL
```

or:

```sql
NOT EXISTS
```


**Pattern 10 — More than average**

```sql
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
)
```


**Pattern 11 — More than department average**

```sql
AVG(salary) OVER (
    PARTITION BY department
)
```


**Pattern 12 — Consecutive dates**

```text
ROW_NUMBER
+
date arithmetic
+
GROUP BY
```


**Pattern 13 — SCD Type 2**

```text
Business key
+
change detection
+
expire old version
+
insert new version
```

---

These are things interviewers frequently use to catch candidates.

**Trap 1**

```sql
WHERE salary = NULL
```

❌ Wrong.

Use:

```sql
WHERE salary IS NULL
```


**Trap 2**

Thinking:

```sql
COUNT(column)
```

counts NULLs.

❌ It doesn't.


**Trap 3**

Using:

```sql
DISTINCT
```

to hide duplicate JOIN problems.

First investigate the join cardinality.


**Trap 4**

Thinking:

```text
RANK = DENSE_RANK
```

❌ They differ when ties occur.


**Trap 5**

Thinking:

```text
WHERE and HAVING
```

are interchangeable.

❌ They operate at different logical stages.


**Trap 6**

Thinking indexes are always beneficial.

❌ Indexes have write/storage/maintenance costs.


**Trap 7**

Thinking CTE always materializes.

❌ A CTE is primarily a query expression; whether/how it is materialized depends on the optimizer/DBMS.


**Trap 8**

Thinking `UNION ALL` is always bad because it keeps duplicates.

❌ Sometimes duplicate rows are legitimate and `UNION ALL` is exactly what you want.


**Trap 9**

Thinking `LEFT JOIN` always preserves all rows after filtering.

Consider:

```sql
SELECT *
FROM A
LEFT JOIN B
    ON A.id = B.id
WHERE B.status = 'ACTIVE';
```

The `WHERE` condition removes NULL-extended unmatched rows, often making this behave like an inner join for that condition.

If you want to preserve unmatched A rows, the predicate may need to be in the `ON` clause:

```sql
SELECT *
FROM A
LEFT JOIN B
    ON A.id = B.id
   AND B.status = 'ACTIVE';
```

**Very important interview concept.**

---

## Azure & Databricks SQL

### Azure SQL family

| Service | Use case | Interview angle |
|---------|----------|-----------------|
| **Azure SQL Database** | OLTP app database (PaaS) | T-SQL, indexes, DTU/vCore sizing |
| **Azure SQL Managed Instance** | Lift-and-shift SQL Server | Linked servers, agent jobs, near 100% T-SQL compat |
| **Azure Synapse Analytics** | Enterprise DW / analytics | Dedicated SQL pool vs serverless, distribution keys |
| **Azure SQL Edge** | IoT edge | Rare in DE interviews |

**Synapse dedicated SQL pool** (formerly SQL DW):

```sql
-- Distribution styles matter for performance
CREATE TABLE dbo.fact_sales
(
    sale_id     BIGINT NOT NULL,
    product_key INT    NOT NULL,
    amount      DECIMAL(18,2)
)
WITH
(
    CLUSTERED COLUMNSTORE INDEX,
    DISTRIBUTION = HASH(product_key)
);
```

- **HASH** — large fact tables, even join keys
- **ROUND_ROBIN** — staging / unknown join pattern
- **REPLICATE** — small dimension tables

**Serverless SQL pool** — query files in ADLS without provisioning:

```sql
SELECT TOP 100 *
FROM OPENROWSET(
    BULK 'https://<account>.dfs.core.windows.net/raw/sales/*.parquet',
    FORMAT = 'PARQUET'
) AS [result];
```

### Databricks SQL & Spark SQL

- **Delta Lake** — ACID, `MERGE`, time travel
- **Unity Catalog** — `catalog.schema.table`
- **Photon** — vectorized engine

**Delta MERGE:**

```sql
MERGE INTO gold.customer AS tgt
USING staging.customer_updates AS src
ON tgt.customer_id = src.customer_id
WHEN MATCHED AND src.updated_at > tgt.updated_at THEN
  UPDATE SET tgt.name = src.name, tgt.updated_at = src.updated_at
WHEN NOT MATCHED THEN
  INSERT (customer_id, name, updated_at)
  VALUES (src.customer_id, src.name, src.updated_at);
```

**Time travel** (debugging / audit):

```sql
SELECT * FROM gold.orders VERSION AS OF 12;
-- or
SELECT * FROM gold.orders TIMESTAMP AS OF '2024-06-01T00:00:00';
```

**`OPTIMIZE` + `ZORDER`** — file compaction for query speed:

```sql
OPTIMIZE gold.events ZORDER BY (event_date, user_id);
```

### T-SQL vs Spark SQL (quick cheat sheet)

| Feature | SQL Server / Synapse T-SQL | Spark SQL / Databricks |
|---------|---------------------------|------------------------|
| Top N | `TOP n` / `OFFSET-FETCH` | `LIMIT n` |
| String concat | `+` or `CONCAT()` | `CONCAT()` or `\|\|` |
| Date diff | `DATEDIFF(day, a, b)` | `DATEDIFF(b, a)` (unit first) |
| Null handling | `ISNULL`, `COALESCE` | `COALESCE`, `NVL` |
| Semi-join | `EXISTS` | `EXISTS` or `LEFT SEMI JOIN` |
| Upsert | `MERGE` | `MERGE` (Delta) |
| Variables | `@var` | not in pure SQL — use temp views |

### Common Azure DE SQL interview questions

1. **Dedicated vs serverless Synapse** — when to use each?
2. **Distribution key choice** — why HASH on `product_key` not `sale_date`?
3. **Polybase / OPENROWSET** — external tables vs COPY INTO
4. **Delta MERGE** — idempotent pipeline loads
5. **Partition pruning** — filter on partition column in WHERE
6. **CTEs vs temp tables** — in Synapse, `#temp` has limits; prefer CTAS for heavy steps

### Pipeline patterns

```text
Bronze (raw) → Silver (cleansed, conformed) → Gold (aggregated, business-ready)
```

- Bronze: append-only Parquet/Delta, minimal transforms
- Silver: dedupe with `ROW_NUMBER`, type casts, null handling
- Gold: star schema, aggregates, SCD2 dimensions

### Traps specific to cloud SQL

**Trap — forgetting file format in OPENROWSET**

Always specify `FORMAT = 'PARQUET'` (or CSV with parser options).

**Trap — cross join explosion after MERGE**

Validate row counts before/after; use `COUNT(*)` on staging.

**Trap — ZORDER on high-cardinality text columns**

ZORDER works best on columns used in range filters — not random UUIDs.

**Trap — serverless cost**

`SELECT *` on huge Parquet without partition filter = expensive scan.

---

---

---

## Interview Guide — SQL — Plate 1

> **18 questions** — numbered 1–18 in this plate. From *DE Interview Guide*.

### 1. What is a primary key?

**Interview question:** What is a primary key?

**Answer:** A primary key is a column or composite column set that uniquely identifies every row in a relational table. It enforces entity integrity by guaranteeing no duplicate keys and no NULL values in the key columns. In SQL Server and Synapse dedicated pools, the PK also creates a unique clustered or non-clustered index depending on design. In data engineering, the primary key is the anchor for joins, CDC deduplication, and MERGE upsert logic in silver and gold layers.

**Key points:**

- Uniqueness + NOT NULL are mandatory PK properties
- Only one primary key per table (can be composite)
- Often doubles as the clustered index in OLTP designs
- Natural vs surrogate: business key may change; surrogate PK stays stable
- In lakehouse MERGE, match on business/natural key even if surrogate exists

**How to explain in interview:** Define PK → state uniqueness/NOT NULL → give one fact-table example → mention how it supports MERGE/CDC.

**DE example:** In silver.orders, order_id is the PK — CDC replays with duplicate order_id are rejected before gold revenue rollups run in Synapse.

**Common mistake:** Confusing primary key with any indexed column, or allowing NULLs in a 'mostly unique' column used as PK.

**Source:** DE Interview Guide — SQL Q1

### 2. Difference between primary key and unique key?

**Interview question:** Difference between primary key and unique key?

**Answer:** Both primary keys and unique keys enforce uniqueness of values in the constrained column(s). The primary key is the table's main row identifier: it cannot contain NULLs, and SQL Server allows only one primary key per table. A unique key also prevents duplicates but typically permits one NULL (SQL Server allows one NULL in a unique index; behavior varies slightly by engine). A table can have multiple unique constraints — useful for alternate business keys like email or external system IDs.

**Key points:**

- PK: NOT NULL + one per table; UNIQUE: nullable (usually one NULL) + many allowed
- Both create unique indexes under the hood in SQL Server
- Use UNIQUE for alternate keys without making them the clustered PK
- In dimensions, PK is often surrogate; UNIQUE on natural key (e.g., customer_code)
- Duplicate prevention in bronze loads can rely on UNIQUE before silver promotion

**Comparison:**

| Aspect | Primary Key | Unique Key |
| --- | --- | --- |
| NULL allowed | No | Yes (typically one NULL in SQL Server) |
| Count per table | One | Multiple |
| Purpose | Main row identifier | Alternate business uniqueness |
| DE usage | Surrogate in dimensions | Natural/source system keys |

**How to explain in interview:** Contrast role (main identifier vs alternate key), NULL rules, and count allowed per table.

**DE example:** dim_customer has surrogate customer_sk as PK and UNIQUE on source_customer_id from Salesforce — CDC MERGE matches on source_customer_id, not the surrogate.

**Common mistake:** Saying unique keys allow multiple NULLs in all databases — clarify engine-specific behavior.

**Source:** DE Interview Guide — SQL Q2

### 3. Difference between UNION and UNION ALL?

**Interview question:** Difference between UNION and UNION ALL?

**Answer:** UNION and UNION ALL combine the result sets of two or more SELECT statements vertically, requiring identical column count, order, and compatible types. UNION performs an implicit DISTINCT — duplicate rows across the combined set are removed, which requires a sort or hash deduplication step and adds cost. UNION ALL simply concatenates all rows from each branch without deduplication, making it significantly faster when you know duplicates are impossible or acceptable.

**Key points:**

- Both require matching column count, order, and compatible types
- UNION = UNION ALL + deduplication overhead
- Prefer UNION ALL for stacking daily partitions or multi-source bronze feeds
- Column names come from the first SELECT in the chain
- Implicit type conversion can hide bugs — align types explicitly

**Comparison:**

| Aspect | UNION | UNION ALL |
| --- | --- | --- |
| Duplicates | Removed | Kept |
| Performance | Slower (dedup) | Faster (append only) |
| Use when | Need distinct combined set | Partitions/sources are disjoint |

**How to explain in interview:** State vertical stacking, schema rules, then performance tradeoff — always ask if duplicates are possible.

**DE example:** Stack bronze sales from region A/B/C with UNION ALL into silver.stg_sales — no dedup needed because source_id is globally unique per region extract.

**Common mistake:** Defaulting to UNION when UNION ALL suffices, paying unnecessary sort/hash cost on millions of rows.

**Source:** DE Interview Guide — SQL Q3

### 4. What is the use of a foreign key?

**Interview question:** What is the use of a foreign key?

**Answer:** A foreign key constraint links a child table column to a parent table's primary or unique key, enforcing referential integrity at the database level. Inserts or updates in the child table are rejected if the referenced parent value does not exist, and deletes/updates on the parent can be blocked or cascaded depending on ON DELETE/UPDATE rules. In transactional OLTP systems, FKs prevent orphan records. In modern lakehouse pipelines, FKs are often enforced via data quality checks and silver-layer validation rather than physical constraints on Delta/Parquet.

**Key points:**

- Child FK column values must exist in parent PK/UNIQUE column
- ON DELETE CASCADE vs RESTRICT affects parent delete behavior
- Many lakehouse tables skip physical FKs for flexibility and load speed
- DE teams implement referential checks in SQL DQ jobs or Great Expectations
- Orphan detection: LEFT JOIN parent WHERE parent.key IS NULL

**How to explain in interview:** Define referential integrity → give parent/child example → contrast OLTP FK vs lakehouse DQ pattern.

**DE example:** After loading bronze.orders, a Synapse stored proc flags rows where customer_id not in dim_customer — quarantine before gold publish instead of relying on FK at bronze.

**Common mistake:** Assuming FK constraints exist in Delta Lake tables — they do not; integrity is application/DQ enforced.

**Source:** DE Interview Guide — SQL Q4

### 5. Difference between WHERE and HAVING clause?

**Interview question:** Difference between WHERE and HAVING clause?

**Answer:** WHERE and HAVING both filter data, but at different stages of query execution. WHERE filters individual rows before any GROUP BY aggregation occurs — it cannot reference aggregate functions like SUM() or COUNT(). HAVING filters groups after aggregation, and it can reference aggregate expressions and grouped columns. This logical order matters: WHERE reduces rows early (better performance), HAVING trims groups after expensive aggregation.

**Key points:**

- WHERE: row-level, pre-aggregation; HAVING: group-level, post-aggregation
- WHERE cannot use SUM(), COUNT(), AVG() in standard SQL
- Filter business keys in WHERE before GROUP BY for performance
- HAVING COUNT(*) > 5 finds customers with more than 5 orders
- Execution order: WHERE before GROUP BY before HAVING

**Comparison:**

| Aspect | WHERE | HAVING |
| --- | --- | --- |
| Filters | Individual rows | Grouped results |
| Timing | Before GROUP BY | After GROUP BY |
| Aggregates | Not allowed | Allowed |
| Example | status = 'Active' | COUNT(*) > 5 |

**How to explain in interview:** Draw the pipeline: rows → WHERE → GROUP BY → HAVING → SELECT; give one metric example.

**DE example:** Gold customer metrics: WHERE order_date >= @watermark filters rows first; HAVING SUM(amount) > 10000 keeps only high-value customer groups.

**Common mistake:** Putting aggregate conditions in WHERE (invalid) or filtering low-cardinality keys in HAVING instead of WHERE.

**Source:** DE Interview Guide — SQL Q5

### 6. What is a CTE (and recursive CTE)?

**Interview question:** What is a CTE (and recursive CTE)?

**Answer:** A Common Table Expression (CTE) is a named temporary result set defined with WITH cte_name AS (SELECT ...) that exists only for the duration of a single query. CTEs improve readability by breaking complex logic into named steps and can reference themselves recursively for hierarchical data like org charts or bill-of-materials. They are not persisted — unlike temp tables — and the optimizer typically inlines them, though recursion has depth limits.

**Key points:**

- Syntax: WITH cte AS (...) SELECT ... FROM cte
- Improves readability for multi-step transforms in one statement
- Recursive CTE: anchor member + recursive member + UNION ALL
- Can chain multiple CTEs: WITH a AS (...), b AS (...) SELECT ...
- Common pattern: ROW_NUMBER dedup CTE then DELETE/SELECT WHERE rn > 1

**Syntax / example:**

```sql
WITH recent_orders AS (
  SELECT customer_id, MAX(order_date) AS last_order
  FROM Orders
  GROUP BY customer_id
)
SELECT c.customer_name, r.last_order
FROM Customers c
JOIN recent_orders r ON c.customer_id = r.customer_id;
```

**How to explain in interview:** Define scope (single query), show chained CTE for dedup, mention recursive use case briefly.

**DE example:** Databricks SQL silver job: WITH deduped AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ingest_ts DESC) rn FROM bronze.events) SELECT * FROM deduped WHERE rn = 1;

**Common mistake:** Treating CTEs as materialized temp tables — they are logical, not always physically stored.

**Source:** DE Interview Guide — SQL Q6

### 7. What is a view?

**Interview question:** What is a view?

**Answer:** A view is a stored SELECT statement that presents data as a virtual table without physically storing the result set (unless materialized). Each query against the view re-executes the underlying SQL against base tables, so it always reflects current data. Views simplify access control, hide complex joins from consumers, and provide a stable interface when underlying schema evolves. Indexed/materialized views cache results for performance at the cost of refresh complexity.

**Key points:**

- Virtual table — logic stored, data read from base tables at query time
- CREATE VIEW vw_name AS SELECT ...
- Security: grant SELECT on view without exposing base tables
- Materialized/indexed views precompute results (SQL Server indexed views)
- In Synapse serverless, views over OPENROWSET expose lake files as SQL tables

**Syntax / example:**

```sql
CREATE VIEW vw_USA_Customers AS
SELECT customer_id, customer_name, city
FROM Customer
WHERE country = 'USA';
```

**How to explain in interview:** Virtual vs materialized → security/abstraction benefit → one gold-layer consumer example.

**DE example:** Create vw_usa_customers AS SELECT * FROM dim_customer WHERE country = 'USA' — BI team queries view; underlying Delta table path can change without breaking reports.

**Common mistake:** Assuming views store data like tables — non-materialized views re-run the full query every time.

**Source:** DE Interview Guide — SQL Q7

### 8. What is a stored procedure?

**Interview question:** What is a stored procedure?

**Answer:** A stored procedure is a precompiled, named batch of T-SQL stored in the database and invoked with EXEC or EXECUTE. Procedures accept input/output parameters, contain control flow (IF/WHILE), and encapsulate reusable business logic close to the data. In data engineering, they orchestrate ETL steps in Synapse/SQL Server: watermark updates, MERGE operations, partition swaps, and post-load validation. They reduce network round-trips compared to sending ad-hoc SQL from ADF or application code.

**Key points:**

- CREATE PROCEDURE ... AS BEGIN ... END
- Parameters: @param_name datatype, optional OUTPUT
- Precompiled plan can improve repeat execution performance
- Used in Synapse pipelines via Stored Procedure activity in ADF
- Keep idempotent: safe to rerun on pipeline retry

**How to explain in interview:** Define encapsulation → parameters → one ADF/Synapse orchestration example → mention idempotency.

**DE example:** Synapse proc usp_merge_silver_orders runs nightly from ADF — reads @batch_id param, MERGEs bronze staging into silver, updates etl.watermark.

**Common mistake:** Writing procedures without transaction boundaries or error handling for production pipeline reruns.

**Source:** DE Interview Guide — SQL Q8

### 9. Write a stored procedure with an input parameter.

**Interview question:** Write a stored procedure with an input parameter.

**Answer:** A parameterized stored procedure accepts input values at execution time, making the same logic reusable across different filter criteria without dynamic SQL injection risk. In SQL Server, parameters are declared with @name datatype in the CREATE PROCEDURE header and referenced in the body. ADF passes pipeline parameters into stored procedure activities for incremental loads, partition processing, and environment-specific behavior.

**Key points:**

- Parameter declared in proc header: @DeptName VARCHAR(50)
- Called with EXEC GetEmployeesByDept @DeptName = 'Engineering'
- Avoids SQL injection vs string-concatenated dynamic SQL
- ADF Stored Procedure activity maps pipeline parameters to proc params
- Default values: @StartDate DATE = '2020-01-01'

**Syntax / example:**

```sql
CREATE PROCEDURE GetEmployeesByDept
    @DeptName VARCHAR(50)
AS
BEGIN
    SELECT employee_id, name, salary
    FROM Employees
    WHERE Department = @DeptName;
END;

-- EXEC GetEmployeesByDept @DeptName = 'Engineering';
```

**How to explain in interview:** Show CREATE with @param, explain EXEC call, tie to ADF parameter mapping.

**DE example:** ADF passes @LoadDate from trigger schedule into usp_load_daily_sales — same proc handles backfill when @LoadDate is overridden manually.

**Common mistake:** Using string concatenation inside dynamic SQL instead of proper parameters — security and plan-cache issues.

**Source:** DE Interview Guide — SQL Q9

### 10. Write a stored procedure without an input parameter.

**Interview question:** Write a stored procedure without an input parameter.

**Answer:** A stored procedure without parameters runs the same logic every time it is invoked — useful for standardized batch jobs like full dimension refreshes, nightly reconciliation, or publishing gold aggregates. The procedure body still benefits from encapsulation, permissions control, and a cached execution plan. In pipeline design, parameterless procs often serve as fixed orchestration entry points while parameterized procs handle incremental or scoped loads.

**Key points:**

- No parameters in CREATE PROCEDURE header
- EXEC GetAllEmployees; runs identical logic each call
- Good for fixed batch steps: truncate staging, reload, swap partition
- Grant EXECUTE to pipeline service principal only — least privilege
- Combine with TRY/CATCH and TRANSACTION for safe reruns

**Syntax / example:**

```sql
CREATE PROCEDURE GetAllEmployees
AS
BEGIN
    SELECT employee_id, name, department, salary
    FROM Employees;
END;

-- EXEC GetAllEmployees;
```

**How to explain in interview:** Contrast with parameterized version — when fixed batch vs flexible filter applies.

**DE example:** Nightly Synapse job EXEC usp_refresh_gold_kpis — no params needed; proc internally reads watermark table for incremental scope.

**Common mistake:** Creating parameterless procs that hard-code dates or paths instead of reading config/watermark tables.

**Source:** DE Interview Guide — SQL Q10

### 11. Types of index in SQL?

**Interview question:** Types of index in SQL?

**Answer:** SQL Server and Synapse support several index types optimized for different access patterns. Clustered indexes define physical row order (one per table). Non-clustered indexes are separate B-tree structures with pointers to data rows. Unique indexes enforce uniqueness; composite indexes span multiple columns. Specialized types include filtered indexes (partial), full-text indexes (text search), and columnstore indexes (analytics/aggregation on large fact tables).

**Key points:**

- Clustered: physical sort, one per table — often on PK or date partition key
- Non-clustered: many allowed, separate structure with row locator
- Composite/multi-column: column order matters — leading column must be selective or filtered
- Columnstore: batch mode, great for Synapse fact-table aggregations
- Filtered index: WHERE clause on index definition for hot subset

**How to explain in interview:** List 3-4 types with one-line purpose each; connect columnstore to analytics warehouse workload.

**DE example:** Synapse fact_sales: CLUSTERED COLUMNSTORE INDEX for nightly SUM(revenue) by region; non-clustered on order_date for point lookups in debugging.

**Common mistake:** Creating many non-clustered indexes on high-write staging tables — slows MERGE/INSERT throughput.

**Source:** DE Interview Guide — SQL Q11

### 12. Difference between clustered and non-clustered index?

**Interview question:** Difference between clustered and non-clustered index?

**Answer:** A clustered index determines the physical storage order of table rows — the leaf level of the index IS the data. SQL Server allows only one clustered index per table because rows can be sorted one way. A non-clustered index is a separate structure storing index key values plus a row pointer (RID or clustered key lookup), allowing many per table. Clustered suits range scans on the sort key; non-clustered suits additional lookup paths.

**Key points:**

- Clustered: data pages sorted by index key — one per table
- Non-clustered: separate B-tree + pointer to data row
- Heap table = no clustered index; non-clustered uses RID lookup
- Covering non-clustered index includes all queried columns — avoids key lookup
- Synapse: HEAP + CLUSTERED COLUMNSTORE is common for fact tables

**Comparison:**

| Aspect | Clustered Index | Non-Clustered Index |
| --- | --- | --- |
| Storage | Data rows sorted in index order | Separate structure with pointers |
| Count per table | One | Many |
| Leaf level | Is the data | Keys + row locator |
| Best for | Range scans on sort key | Additional search paths |

**How to explain in interview:** Physical order vs separate structure → one per table rule → lookup vs range scan use case.

**DE example:** dim_date clustered on date_key for range scans; non-clustered on fiscal_period for alternate filter path in Power BI direct query.

**Common mistake:** Creating multiple clustered indexes — only one allowed; second would require dropping first.

**Source:** DE Interview Guide — SQL Q12

### 13. How do you troubleshoot a slow query?

**Interview question:** How do you troubleshoot a slow query?

**Answer:** Slow query troubleshooting starts with capturing the actual execution plan and comparing estimated vs actual row counts. Look for table/index scans instead of seeks, missing index suggestions, implicit conversions that prevent index use, stale statistics causing bad cardinality estimates, and parameter sniffing where one cached plan fits some parameter values poorly. In Synapse, also check distribution skew, excessive data movement (DMS), and tempdb spills.

**Key points:**

- Enable actual execution plan (SSMS) or EXPLAIN in Databricks SQL
- Table scan on large fact table = likely missing or unused index
- Compare estimated vs actual rows — large gap signals bad stats
- Check for functions on indexed columns: WHERE YEAR(dt)=2022 blocks index
- Synapse: DMVs for queued queries, resource classes, distribution stats

**How to explain in interview:** Structured flow: measure → plan → scans vs seeks → stats/conversions → fix → validate.

**DE example:** Gold mart query regressed after load doubling: actual plan showed nested loop on 50M rows — added composite index on (order_date, customer_id), updated stats, runtime dropped 40 min to 3 min.

**Common mistake:** Adding indexes blindly without reading the plan — can worsen write performance without helping the bottleneck.

**Source:** DE Interview Guide — SQL Q13

### 14. How do you optimize a SQL query?

**Interview question:** How do you optimize a SQL query?

**Answer:** Query optimization combines schema design, indexing, and SQL rewrite. Filter early with selective WHERE predicates on indexed columns, select only needed columns instead of SELECT *, and ensure statistics are current. Avoid wrapping indexed columns in functions, prefer set-based joins over correlated subqueries, and use appropriate join types. Review the execution plan for expensive operators (sorts, hash spills) and consider partitioning, columnstore, or pre-aggregation for warehouse workloads.

**Key points:**

- SELECT only required columns — reduces I/O and memory grants
- SARGable predicates: order_date >= '2022-01-01' not YEAR(order_date)=2022
- Update statistics after large loads: UPDATE STATISTICS table
- Replace correlated subquery with JOIN where possible
- Synapse: align distribution key with common JOIN/GROUP BY columns

**How to explain in interview:** Index + filter early + avoid SELECT * + plan review — give before/after example with metric.

**DE example:** Rewrite BI query from SELECT * with scalar UDF per row to set-based JOIN with covering index — cut Synapse DWU hours 60%.

**Common mistake:** Optimizing SQL in dev with 1K rows — plan changes completely at production scale; always test at realistic volume.

**Source:** DE Interview Guide — SQL Q14

### 15. What is the execution order of a SQL query?

**Interview question:** What is the execution order of a SQL query?

**Answer:** SQL logical processing order differs from written syntax order — understanding this explains why WHERE cannot use aliases from SELECT and why HAVING comes after GROUP BY. The engine processes FROM/JOIN first to assemble rows, applies WHERE filtering, groups with GROUP BY, filters groups with HAVING, projects SELECT columns, removes duplicates with DISTINCT, sorts with ORDER BY, and finally applies LIMIT/OFFSET. This order drives both correctness and performance tuning.

**Key points:**

- Logical order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
- SELECT aliases not visible in WHERE of same query level
- DISTINCT after SELECT projection
- ORDER BY can use SELECT aliases (processed after SELECT)
- Explains why aggregate filters belong in HAVING not WHERE

**How to explain in interview:** Recite the sequence once, then give two traps: alias in WHERE, aggregate in WHERE.

**DE example:** Debugging gold SQL: analyst puts metric alias in WHERE — explain logical order, move predicate to HAVING or subquery.

**Common mistake:** Memorizing written order (SELECT first) instead of logical execution order — leads to invalid SQL attempts.

**Source:** DE Interview Guide — SQL Q15

### 16. Syntax to find employees with salary greater than average salary.

**Interview question:** Syntax to find employees with salary greater than average salary.

**Answer:** Finding employees earning above the average salary requires comparing each row's salary to an aggregate computed over the entire table (or relevant partition). A subquery in the WHERE clause computes AVG(salary) once and filters rows where salary exceeds that scalar result. Alternatively, a window function AVG(salary) OVER() adds the average as a column for comparison without a subquery. Both approaches are set-based and preferred over cursor loops in ETL.

**Key points:**

- Scalar subquery: WHERE salary > (SELECT AVG(salary) FROM Employees)
- Subquery must return single value — aggregate without GROUP BY
- Window alternative: WHERE salary > AVG(salary) OVER() in outer query
- Partition AVG by department if comparing within dept: OVER(PARTITION BY dept)
- Set-based filter scales in warehouse SQL vs row-by-row procedural code

**Syntax / example:**

```sql
SELECT employee_id, name, salary
FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees);
```

**How to explain in interview:** State the pattern (row vs aggregate comparison), write subquery form, mention window alternative.

**DE example:** Flag high-earner outliers in HR silver: employees with salary > 2x AVG(salary) OVER(PARTITION BY department) go to DQ review table.

**Common mistake:** Using HAVING without GROUP BY incorrectly, or comparing to AVG in WHERE without subquery/window.

**Source:** DE Interview Guide — SQL Q16

### 17. Syntax to find the 2nd highest salary.

**Interview question:** Syntax to find the 2nd highest salary.

**Answer:** The Nth highest salary is a classic window-function or subquery problem. The subquery approach finds MAX(salary) where salary is less than the overall MAX to get 2nd highest — extensible but awkward for N>2. The window approach uses DENSE_RANK() or ROW_NUMBER() OVER (ORDER BY salary DESC) and filters rank = N, which scales cleanly to any N and handles ties differently depending on rank function choice.

**Key points:**

- Subquery: MAX where salary < (SELECT MAX...) gives 2nd highest only
- DENSE_RANK handles ties — both 9000 get rank 2, next is rank 3
- ROW_NUMBER breaks ties arbitrarily — unique ranks even with ties
- OFFSET/FETCH: ORDER BY salary DESC OFFSET 1 ROW FETCH NEXT 1 ROW ONLY
- In DE: top-N per group uses PARTITION BY department

**Syntax / example:**

```sql
-- Subquery approach
SELECT MAX(salary) AS second_highest
FROM Employees
WHERE salary < (SELECT MAX(salary) FROM Employees);

-- Window approach (handles any N)
SELECT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employees
) t
WHERE rnk = 2;
```

**How to explain in interview:** Offer two solutions (subquery + window), explain tie behavior, state which rank function you'd pick.

**DE example:** Compensation analytics: DENSE_RANK() OVER (ORDER BY total_comp DESC) = 2 for second-highest paid employee in gold.hr_summary.

**Common mistake:** Using ROW_NUMBER when ties should share rank — use DENSE_RANK or RANK instead.

**Source:** DE Interview Guide — SQL Q17

### 18. Syntax to find the 2nd highest salary of each department.

**Interview question:** Syntax to find the 2nd highest salary of each department.

**Answer:** Finding the 2nd highest salary per department requires partitioning the ranking window by department while ordering by salary within each partition. DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) assigns ranks within each dept independently; filtering rnk = 2 returns the second-highest earner per group. This pattern is fundamental for top-N-per-group problems in data engineering — latest event per user, second-most-recent order, etc.

**Key points:**

- PARTITION BY department resets rank per group
- ORDER BY salary DESC within partition
- Filter outer query: WHERE rnk = 2
- ROW_NUMBER if you need exactly one row per dept even with salary ties
- Same pattern for dedup: PARTITION BY key ORDER BY timestamp DESC, keep rn=1

**Syntax / example:**

```sql
SELECT department, employee_id, salary
FROM (
  SELECT department, employee_id, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM Employees
) t
WHERE rnk = 2;
```

**How to explain in interview:** Say 'partition by group, order by metric, filter rank=N' — connect to dedup pattern.

**DE example:** Sales leaderboard: 2nd top rep per region using DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) — published to gold.sales_rankings.

**Common mistake:** Forgetting PARTITION BY — ranks globally instead of per department.

**Source:** DE Interview Guide — SQL Q18


---

## Interview Guide — SQL — Plate 2

> **18 questions** — numbered 1–18 in this plate. From *DE Interview Guide*.

### 1. Difference between TRUNCATE, DELETE, and DROP?

**Interview question:** Difference between TRUNCATE, DELETE, and DROP?

**Answer:** DELETE, TRUNCATE, and DROP serve different purposes with different logging, speed, and recoverability. DELETE removes rows optionally filtered by WHERE, logs each row deletion, fires triggers, and can be rolled back in a transaction. TRUNCATE removes all rows quickly with minimal logging, resets identity seeds, and cannot filter by WHERE. DROP removes the entire table object including structure, indexes, and constraints — the most destructive operation.

**Key points:**

- DELETE: row-level, WHERE allowed, fully logged, triggers fire, rollback OK
- TRUNCATE: all rows, minimal log, resets IDENTITY, no WHERE, no row triggers
- DROP: removes table object entirely — structure gone
- Staging refresh: TRUNCATE + INSERT faster than DELETE for full reload
- Production fixes: DELETE with WHERE or backup first — never casual TRUNCATE

**Comparison:**

| Aspect | DELETE | TRUNCATE | DROP |
| --- | --- | --- | --- |
| Scope | Specific rows (WHERE) | All rows | Entire table object |
| WHERE clause | Yes | No | N/A |
| Rollback | Yes (in transaction) | Limited/varies | No after commit |
| Speed | Slower (row log) | Fast (deallocates pages) | Instant metadata drop |
| IDENTITY reset | No | Yes | N/A |

**How to explain in interview:** Three-way comparison: scope (rows vs all rows vs object), logging, rollback, triggers.

**DE example:** Bronze staging truncate-and-load nightly: TRUNCATE TABLE stg_orders; INSERT from external table. Accidental prod DELETE caught by transaction rollback after row-count alert.

**Common mistake:** Using TRUNCATE when you need conditional row removal — TRUNCATE has no WHERE clause.

**Source:** DE Interview Guide — SQL Q19

### 2. Difference between window and aggregate function?

**Interview question:** Difference between window and aggregate function?

**Answer:** Aggregate functions like SUM, AVG, and COUNT collapse multiple rows into a single value per group when used with GROUP BY — the result set shrinks. Window functions with OVER() compute aggregates across a window of rows but return a value on every row without collapsing the result set. This lets you compare each row to a group total (e.g., each order's amount vs customer lifetime total) in one query pass.

**Key points:**

- Aggregate + GROUP BY: one output row per group
- Window aggregate: SUM(amount) OVER (PARTITION BY customer_id) on every row
- Window preserves row detail; GROUP BY loses individual rows
- Running totals: SUM(amount) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING)
- Choose based on output grain needed by downstream gold table

**Comparison:**

| Aspect | Aggregate + GROUP BY | Window + OVER() |
| --- | --- | --- |
| Output rows | One per group | Same as input rows |
| Row detail | Lost | Preserved |
| Example | Total sales per region | Each sale + region total column |

**How to explain in interview:** Draw two result shapes: collapsed groups vs same row count with extra column.

**DE example:** Each order row gets pct_of_customer_total = order_amount / SUM(order_amount) OVER (PARTITION BY customer_id) in silver for analytics without losing order grain.

**Common mistake:** Using GROUP BY when you need per-row comparison to group aggregate — use window instead.

**Source:** DE Interview Guide — SQL Q20

### 3. What happens if OVER clause is used with an aggregate function?

**Interview question:** What happens if OVER clause is used with an aggregate function?

**Answer:** When you add an OVER clause to an aggregate function, it transforms from a grouping aggregate into a window aggregate. Instead of collapsing rows via GROUP BY, the function computes the aggregate over the specified partition/window and repeats that value on every row in the partition. For example, SUM(salary) OVER (PARTITION BY department) adds each department's total salary to every employee row in that department.

**Key points:**

- SUM(col) OVER (PARTITION BY x ORDER BY y) — no GROUP BY needed
- Partition defines the window scope; ORDER BY enables running aggregates
- Frame clause ROWS BETWEEN controls which rows in partition are included
- Combines detail and summary in one pass — avoids self-join to group totals
- Execution: window operator after joins/filters in plan

**Syntax / example:**

```sql
SELECT employee_id, department, salary,
       AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM Employees;
```

**How to explain in interview:** Show one example: AVG(score) OVER (PARTITION BY class) on each student row.

**DE example:** Add running_revenue = SUM(order_amount) OVER (PARTITION BY customer_id ORDER BY order_date) in streaming silver SQL for customer journey metrics.

**Common mistake:** Mixing GROUP BY and window on same columns incorrectly — understand they operate at different grains.

**Source:** DE Interview Guide — SQL Q21

### 4. What is the LEAD (and LAG) window function?

**Interview question:** What is the LEAD (and LAG) window function?

**Answer:** LAG and LEAD are window functions that access a row at a fixed offset before or after the current row within an ordered partition, without a self-join. LAG(column, n) looks n rows back; LEAD(column, n) looks n rows ahead. Default offset is 1. They are essential for period-over-period analysis, session gap detection, and comparing consecutive events in event streams loaded to bronze/silver.

**Key points:**

- LAG(col, n, default) — previous row value; LEAD — next row value
- ORDER BY in OVER defines 'previous' and 'next'
- PARTITION BY resets sequence per group (per customer, per device)
- Gap detection: DATEDIFF(day, LAG(order_date), order_date) > 30
- Avoid self-join on row_number ± 1 — LAG/LEAD is cleaner and often faster

**Syntax / example:**

```sql
SELECT order_id, customer_id, order_date,
       LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order_date,
       LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_order_date
FROM Orders;
```

**How to explain in interview:** Define offset direction, show ORDER BY + PARTITION BY, give period-over-period example.

**DE example:** CDC event stream: LAG(status) OVER (PARTITION BY account_id ORDER BY event_ts) flags status flips for fraud detection in Databricks SQL.

**Common mistake:** Forgetting ORDER BY in OVER — offset direction becomes undefined.

**Source:** DE Interview Guide — SQL Q22

### 5. What is GROUP BY clause?

**Interview question:** What is GROUP BY clause?

**Answer:** GROUP BY collapses rows sharing the same values in specified column(s) into groups, enabling aggregate functions (SUM, COUNT, AVG, MIN, MAX) to compute one result per group. All non-aggregated columns in SELECT must appear in GROUP BY (or be functionally dependent in engines that allow it). In data engineering, GROUP BY defines the grain of gold aggregate tables — daily sales by region, orders per customer, error counts per pipeline run.

**Key points:**

- Every non-aggregate SELECT column must be in GROUP BY
- Defines output grain: GROUP BY region, order_date → one row per region-day
- COUNT(*), COUNT(col), COUNT(DISTINCT col) behave differently with NULLs
- ROLLUP/CUBE/GROUPING SETS for subtotals in reporting queries
- Pre-aggregate in gold to avoid repeated heavy GROUP BY in BI tools

**How to explain in interview:** Define grain explicitly: 'I need one row per X, so GROUP BY X'.

**DE example:** Gold fct_daily_sales: GROUP BY sale_date, region_id, product_category with SUM(revenue), COUNT(DISTINCT order_id) — BI queries simple SELECT from gold.

**Common mistake:** Selecting columns not in GROUP BY (invalid in strict SQL) — classic interview trap.

**Source:** DE Interview Guide — SQL Q23

### 6. What is HAVING clause?

**Interview question:** What is HAVING clause?

**Answer:** HAVING filters groups after GROUP BY based on conditions involving aggregate functions or grouped columns. Unlike WHERE, which operates on individual rows before aggregation, HAVING can reference SUM(), COUNT(), AVG() and similar expressions. Use HAVING for predicates like 'customers with more than 5 orders' or 'departments where average salary exceeds company average'. For performance, still push row-level filters to WHERE first.

**Key points:**

- Applied after GROUP BY, before SELECT projection in logical order
- Can filter on COUNT(*), SUM(amount), AVG(score), etc.
- Cannot replace WHERE for row-level filters — use both together
- Example: HAVING COUNT(*) > 5 AND SUM(amount) > 10000
- Some engines allow HAVING on GROUP BY columns without aggregate

**How to explain in interview:** Pair with WHERE example: WHERE status='Active' reduces rows; HAVING COUNT(*)>5 filters groups.

**DE example:** Find churn-risk customers: GROUP BY customer_id HAVING MAX(order_date) < DATEADD(month, -6, GETDATE()) AND COUNT(*) >= 3.

**Common mistake:** Using WHERE COUNT(*) > 5 — invalid because COUNT not available pre-aggregation.

**Source:** DE Interview Guide — SQL Q24

### 7. Types of joins?

**Interview question:** Types of joins?

**Answer:** SQL joins combine rows from two or more tables based on related columns. INNER JOIN returns only matching rows from both sides. LEFT JOIN keeps all left rows plus matches (NULLs for non-matches). RIGHT JOIN mirrors LEFT. FULL OUTER JOIN keeps all rows from both sides. CROSS JOIN produces Cartesian product. SELF JOIN is a table joined to itself with aliases for hierarchical or sequential comparisons.

**Key points:**

- INNER: intersection of keys — most common for fact-dimension enrichment
- LEFT: preserve driving table — orphan detection with WHERE right.key IS NULL
- FULL OUTER: merge with NULLs on both sides — reconciliation jobs
- CROSS JOIN: every combination — rare, usually accidental without ON
- Synapse: join on distribution key avoids data movement shuffle

**How to explain in interview:** Name join type → who is preserved → one fact-dim example → mention NULL behavior.

**DE example:** Enrich fct_orders with dim_customer via INNER JOIN on customer_id; LEFT JOIN variant finds orphan orders missing dimension match for DQ quarantine.

**Common mistake:** Using INNER JOIN when you need all driving-table rows — loses non-matching records silently.

**Source:** DE Interview Guide — SQL Q25

### 8. What is a self join?

**Interview question:** What is a self join?

**Answer:** A self join joins a table to itself using different aliases, treating one alias as the 'left' entity and another as the 'right'. It compares or relates rows within the same table — classic use cases include employee-to-manager hierarchy (employee.manager_id = mgr.employee_id), finding consecutive events, and duplicate pair detection. The logic is identical to a regular join; only the source table appears twice.

**Key points:**

- Same physical table, two aliases: Employees e JOIN Employees m
- Manager hierarchy: e.manager_id = m.employee_id
- Consecutive rows: t1.id + 1 = t2.id with date match
- Must use meaningful aliases — e and m, curr and prev
- Performance: index on join columns; self joins can be expensive at scale

**Syntax / example:**

```sql
SELECT e.employee_id, e.name AS employee,
       m.name AS manager
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.employee_id;
```

**How to explain in interview:** Draw one table twice with aliases; walk through manager example step by step.

**DE example:** Org hierarchy in gold.dim_employee: self join on manager_id = employee_id to compute management_chain for HR reporting.

**Common mistake:** Forgetting aliases — 'ambiguous column name' error; or missing tie-breaker in duplicate self-joins.

**Source:** DE Interview Guide — SQL Q26

### 9. Difference between UNION and JOIN?

**Interview question:** Difference between UNION and JOIN?

**Answer:** UNION and JOIN operate on completely different axes. UNION stacks result sets vertically — rows from query A appended below rows from query B — requiring identical column structure. JOIN combines tables horizontally — adding columns from a second table based on a key match. UNION merges similar-shaped datasets (e.g., regional extracts); JOIN enriches rows with related attributes (fact + dimension).

**Key points:**

- UNION: vertical stack, same columns, increases row count
- JOIN: horizontal combine, related keys, increases column count
- UNION needs compatible schemas; JOIN needs relationship/key
- UNION ALL for stacking partitions; JOIN for star schema enrichment
- Cannot JOIN two unrelated result sets without a key — use UNION to combine

**Comparison:**

| Aspect | UNION | JOIN |
| --- | --- | --- |
| Direction | Vertical (stack rows) | Horizontal (add columns) |
| Requirement | Same column count/types | Related key column |
| Row count | Sum of inputs (minus dedup) | Based on join type |
| DE use | Combine regional/partition extracts | Fact-dimension enrichment |

**How to explain in interview:** Use hand gesture: vertical stack vs horizontal widen — one example each.

**DE example:** UNION ALL three regional bronze extracts into silver.stg_sales; then JOIN dim_product on product_id to add category columns.

**Common mistake:** Trying to UNION tables with different column counts or using JOIN when stacking same-shape feeds.

**Source:** DE Interview Guide — SQL Q27

### 10. Syntax to find duplicate records.

**Interview question:** Syntax to find duplicate records.

**Answer:** Duplicate detection groups by the business key columns and uses HAVING COUNT(*) > 1 to find key combinations appearing more than once. This identifies duplicate groups, not individual duplicate rows — to list all rows in duplicate groups, join back or use window functions. In data engineering, run this check on bronze/silver after each load; quarantine duplicates before MERGE to gold.

**Key points:**

- GROUP BY business keys + HAVING COUNT(*) > 1
- Returns key values that are duplicated, not every duplicate row
- To list all dup rows: join subquery back to source on keys
- ROW_NUMBER dedup: keep rn=1, delete or filter rn>1
- Log duplicate count in pipeline metadata for SLA monitoring

**Syntax / example:**

```sql
SELECT email, customer_name, COUNT(*) AS dup_count
FROM Customers
GROUP BY email, customer_name
HAVING COUNT(*) > 1;
```

**How to explain in interview:** Explain GROUP BY + HAVING pattern, then mention ROW_NUMBER for remediation.

**DE example:** Post-load DQ on bronze.customers: GROUP BY email HAVING COUNT(*)>1 — alert if count > 0 before silver MERGE on email.

**Common mistake:** Using SELECT DISTINCT to find duplicates — DISTINCT hides the problem instead of counting occurrences.

**Source:** DE Interview Guide — SQL Q28

### 11. How do you create a primary key on an existing table?

**Interview question:** How do you create a primary key on an existing table?

**Answer:** Adding a primary key to an existing table uses ALTER TABLE with ADD CONSTRAINT. The column(s) must already contain unique, non-null values — otherwise the constraint creation fails. SQL Server creates a unique index backing the PK. On large warehouse tables, validate uniqueness first with a GROUP BY/HAVING check, and consider doing this during a maintenance window since index build can lock the table.

**Key points:**

- ALTER TABLE ... ADD CONSTRAINT PK_name PRIMARY KEY (col)
- All PK columns must be NOT NULL and unique before adding
- Pre-check: SELECT col, COUNT(*) FROM t GROUP BY col HAVING COUNT(*)>1
- Existing clustered index may need to be dropped/replaced
- Lakehouse bronze often skips PK; enforce at silver promotion

**Syntax / example:**

```sql
ALTER TABLE Employees
ADD CONSTRAINT PK_Employees PRIMARY KEY (employee_id);
```

**How to explain in interview:** State ALTER syntax, pre-validation step, and when you'd add PK in medallion flow.

**DE example:** After cleansing duplicate order_ids in silver staging, add PRIMARY KEY (order_id) before enabling MERGE to gold.fct_orders.

**Common mistake:** Adding PK before deduplication — constraint creation fails on duplicate keys in production load.

**Source:** DE Interview Guide — SQL Q29

### 12. Write the SCD Type 1 and Type 2 syntax in SQL.

**Interview question:** Write the SCD Type 1 and Type 2 syntax in SQL.

**Answer:** Slowly Changing Dimension Type 1 overwrites the current attribute values in place — no history is preserved. Type 2 preserves history by closing the current row (setting end_date, is_current=0) and inserting a new row with updated attributes and a new surrogate key or version. In SQL Server/Synapse, Type 1 is a simple UPDATE join; Type 2 requires expire-then-insert or MERGE with conditional logic. Delta Lake MERGE is the modern lakehouse equivalent.

**Key points:**

- Type 1: UPDATE target SET col = source.col — overwrites, no history
- Type 2: expire old row + insert new current row with version dates
- Type 2 needs surrogate key, effective_start, effective_end, is_current flag
- MERGE INTO supports both patterns with WHEN MATCHED/NOT MATCHED
- Choose Type 1 for typos; Type 2 for audit/compliance (address, tier changes)

**Syntax / example:**

```sql
-- Type 1: overwrite
UPDATE t
SET t.salary = s.salary, t.updated_at = GETDATE()
FROM dim_employee t
INNER JOIN stg_employee s ON t.employee_id = s.employee_id
WHERE t.salary <> s.salary;

-- Type 2: expire + insert
UPDATE dim_employee
SET end_date = GETDATE(), is_current = 0
WHERE employee_id IN (SELECT employee_id FROM stg_employee s WHERE s.address <> dim_employee.address)
  AND is_current = 1;

INSERT INTO dim_employee (employee_id, address, start_date, end_date, is_current)
SELECT s.employee_id, s.address, GETDATE(), NULL, 1
FROM stg_employee s
WHERE NOT EXISTS (
  SELECT 1 FROM dim_employee d
  WHERE d.employee_id = s.employee_id AND d.is_current = 1 AND d.address = s.address
);
```

**How to explain in interview:** Contrast overwrite vs versioned row — walk through expire+insert steps for Type 2.

**DE example:** Customer dimension in Synapse: Type 2 MERGE on natural key — address change closes old dim row, inserts new with customer_sk+1; email typo uses Type 1 UPDATE.

**Common mistake:** Using Type 1 when compliance requires historical reporting — loses point-in-time accuracy.

**Source:** DE Interview Guide — SQL Q30

### 13. What is a surrogate key?

**Interview question:** What is a surrogate key?

**Answer:** A surrogate key is an artificial, system-generated identifier (typically an IDENTITY integer or UUID) assigned to each row independent of business data. Unlike natural keys (email, SKU, SSN), surrogate keys are stable, numeric, and never change when business attributes update. In data warehousing, surrogate keys are essential for SCD Type 2 dimensions where multiple versions of the same business entity need distinct keys while sharing the same natural key.

**Key points:**

- Generated by system: IDENTITY, SEQUENCE, or UUID — no business meaning
- Stable when natural key attributes change (SCD Type 2)
- Smaller join keys than composite natural keys — better index performance
- Fact tables reference dimension surrogate keys, not natural keys
- Natural key still stored and often UNIQUE-constrained for lookup/MERGE

**How to explain in interview:** Define surrogate vs natural → why Type 2 needs it → fact table join example.

**DE example:** dim_customer: customer_sk (surrogate, PK) + source_customer_id (natural, UNIQUE). fct_orders joins on customer_sk; CDC MERGE matches on source_customer_id.

**Common mistake:** Using natural key alone as PK in Type 2 dimensions — cannot have multiple rows for same entity history.

**Source:** DE Interview Guide — SQL Q31

### 14. You have a DOB column but want to display only the birth year.

**Interview question:** You have a DOB column but want to display only the birth year.

**Answer:** Extracting the birth year from a date column uses date functions without modifying stored data. In SQL Server, YEAR(dob) returns the four-digit year; alternatively FORMAT(dob, 'yyyy') or DATEPART(year, dob) work. In SELECT queries, this creates a derived column for reporting. For frequently queried year values on large tables, consider a persisted computed column or include year in the gold table grain during ETL.

**Key points:**

- YEAR(dob) — SQL Server; EXTRACT(YEAR FROM dob) — ANSI/Postgres/Databricks
- Non-sargable: WHERE YEAR(dob)=1990 prevents index use on dob
- Prefer: WHERE dob >= '1990-01-01' AND dob < '1991-01-01'
- Persist computed column if year filter is hot path
- Cast/format only at presentation layer when possible

**Syntax / example:**

```sql
SELECT employee_id, name, DOB, YEAR(DOB) AS birth_year
FROM Employees;
```

**How to explain in interview:** Show YEAR() extraction, immediately mention sargability trap for filters.

**DE example:** Gold demographic segment: derive birth_year in silver ETL once rather than YEAR(dob) in every BI query against 100M-row table.

**Common mistake:** Filtering with YEAR(dob)=1990 on indexed column — forces scan; use date range instead.

**Source:** DE Interview Guide — SQL Q32

### 15. How do you rename a column permanently?

**Interview question:** How do you rename a column permanently?

**Answer:** Renaming a column permanently requires DDL depending on the platform. SQL Server uses sp_rename, which is a metadata-only change but can break dependencies (views, procs) if not updated. Standard SQL and Postgres use ALTER TABLE ... RENAME COLUMN. In production pipelines, prefer adding a new column and deprecating the old one to avoid breaking downstream views, ADF mappings, and BI reports during schema evolution.

**Key points:**

- SQL Server: EXEC sp_rename 'Table.OldCol', 'NewCol', 'COLUMN'
- ANSI/Postgres: ALTER TABLE t RENAME COLUMN old TO new
- sp_rename does not automatically update dependent views/procs
- Schema evolution in lakehouse: add column + COALESCE migration pattern
- Document rename in migration script with rollback step

**Syntax / example:**

```sql
-- SQL Server
EXEC sp_rename 'Employees.old_name', 'new_name', 'COLUMN';

-- ANSI / Postgres / Databricks SQL
ALTER TABLE Employees RENAME COLUMN old_name TO new_name;
```

**How to explain in interview:** Give platform-specific syntax, then warn about downstream dependency impact.

**DE example:** Renaming cust_nm to customer_name in Synapse gold: update view definitions same release; ADF Copy mappings versioned in Git.

**Common mistake:** Renaming column without updating dependent views — silent failures or broken pipelines next run.

**Source:** DE Interview Guide — SQL Q33

### 16. Create a view on the customer table filtering country = USA.

**Interview question:** Create a view on the customer table filtering country = USA.

**Answer:** A view filtering customers by country creates a reusable, security-friendly interface over the base table. The view definition stores the SELECT with the WHERE predicate; consumers query the view name instead of repeating the filter. DBAs can grant SELECT on the view without exposing other countries' data. Underlying data remains in the base table; the view reflects current data on each query.

**Key points:**

- CREATE VIEW vw AS SELECT ... WHERE country = 'USA'
- No data duplication — filter applied at query time
- Row-level security alternative in modern platforms
- Dependent views need CREATE OR ALTER when base changes
- Synapse serverless views can wrap OPENROWSET over Parquet paths

**Syntax / example:**

```sql
CREATE VIEW vw_USA_Customers AS
SELECT customer_id, customer_name, city, state
FROM Customer
WHERE country = 'USA';
```

**How to explain in interview:** CREATE VIEW syntax → abstraction/security benefit → note non-materialized behavior.

**DE example:** vw_usa_customers exposes only USA rows to regional BI workspace — base dim_customer holds global data with RLS backup.

**Common mistake:** Expecting view to materialize/filter once — every query re-scans base table unless indexed/materialized.

**Source:** DE Interview Guide — SQL Q34

### 17. Syntax to create a new column categorizing salary into High/Medium/Low …

**Interview question:** Syntax to create a new column categorizing salary into High/Medium/Low (SQL).

**Answer:** Salary categorization uses a searched CASE expression to map numeric salary into labeled buckets (High/Medium/Low). CASE evaluates conditions top-to-bottom and returns the first match. This derived column can be computed at query time or persisted in a gold table during ETL. Thresholds should be configurable — hard-coding in many queries leads to inconsistent business rules across reports.

**Key points:**

- Searched CASE: CASE WHEN salary >= X THEN 'High' ... END
- Order conditions from most specific/highest threshold first
- ELSE catches remaining rows — always include or accept NULL
- Persist in gold for consistent BI semantics across teams
- Simple CASE alternative: CASE dept WHEN 'HR' THEN ... END

**Syntax / example:**

```sql
SELECT employee_id, name, salary,
  CASE
    WHEN salary >= 9000 THEN 'High'
    WHEN salary >= 5000 THEN 'Medium'
    ELSE 'Low'
  END AS salary_range
FROM Employees;
```

**How to explain in interview:** Write CASE with three bands, mention centralizing thresholds in a config/reference table.

**DE example:** Gold employee table includes salary_band column computed in silver ETL — HR and Finance dashboards use same thresholds from config table join.

**Common mistake:** Overlapping or wrong condition order — rows match wrong band; missing ELSE leaves NULLs silently.

**Source:** DE Interview Guide — SQL Q35

### 18. Write a multi-parameter stored procedure for country = ‘USA’ and city =…

**Interview question:** Write a multi-parameter stored procedure for country = ‘USA’ and city = ‘New York’.

**Answer:** Multi-parameter stored procedures accept several input values, enabling flexible filtering without duplicating procedure logic. Each parameter is declared with name and datatype in the CREATE header and bound at execution with EXEC. ADF pipeline parameters map cleanly to procedure parameters for environment-specific loads. Always use parameterized calls — never concatenate user input into dynamic SQL.

**Key points:**

- Multiple @params in CREATE PROCEDURE header
- EXEC proc @Country='USA', @City='New York' — order can be named
- Combine with optional defaults for partial filtering
- ADF Stored Procedure activity maps @pipeline().parameters to proc params
- Validate/sanitize params inside proc for defense in depth

**Syntax / example:**

```sql
CREATE PROCEDURE GetCustomersByCountryCity
    @Country VARCHAR(50),
    @City VARCHAR(50)
AS
BEGIN
    SELECT customer_id, customer_name, city, country
    FROM Customer
    WHERE country = @Country AND city = @City;
END;

EXEC GetCustomersByCountryCity @Country = 'USA', @City = 'New York';
```

**How to explain in interview:** Show two-param CREATE, EXEC example, mention ADF mapping.

**DE example:** Regional extract proc filters by @Country and @City from ADF ForEach over region list — same proc, parameterized reruns per geography.

**Common mistake:** Building dynamic SQL via string concat from parameters — SQL injection and plan cache pollution.

**Source:** DE Interview Guide — SQL Q36


---

## Interview Guide — SQL — Plate 3

> **18 questions** — numbered 1–18 in this plate. From *DE Interview Guide*.

### 1. Syntax to delete duplicates using a CTE.

**Interview question:** Syntax to delete duplicates using a CTE.

**Answer:** Deleting duplicates with a CTE uses ROW_NUMBER() partitioned by the duplicate key columns, ordered by a tie-breaker (e.g., lowest id keeps first). The CTE assigns rn=1 to the survivor row; DELETE WHERE rn > 1 removes extras. This is safer than DISTINCT because you control which duplicate survives. Wrap in a transaction and validate row counts before commit in production.

**Key points:**

- CTE + ROW_NUMBER() OVER (PARTITION BY keys ORDER BY tiebreaker)
- DELETE FROM cte WHERE rn > 1 — SQL Server allows delete via CTE
- ORDER BY id ASC keeps oldest; DESC keeps newest ingest
- Run SELECT count before DELETE; backup or snapshot first
- In lakehouse prefer MERGE dedup over physical DELETE on Delta

**Syntax / example:**

```sql
WITH cte AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM Employees
)
DELETE FROM cte WHERE rn > 1;
```

**How to explain in interview:** Explain PARTITION BY keys, ORDER BY tiebreaker, DELETE rn>1; mention transaction.

**DE example:** One-time silver cleanup: CTE dedup on (customer_id, order_date) keeping latest ingest_ts before adding UNIQUE constraint.

**Common mistake:** Deleting without tie-breaker ORDER BY — random survivor row kept.

**Source:** DE Interview Guide — SQL Q37

### 2. What are the requirements for performing a UNION operation?

**Interview question:** What are the requirements for performing a UNION operation?

**Answer:** UNION requires each participating SELECT to return the same number of columns in the same ordinal position, with compatible data types that SQL can implicitly or explicitly convert. Column names in the result come from the first SELECT. Mismatched schemas cause errors at compile time. In ETL, align schemas in staging with CAST/CONVERT before UNION ALL of heterogeneous regional feeds.

**Key points:**

- Same column count in every SELECT branch
- Same column order — position 1 maps to position 1
- Compatible types: INT + BIGINT OK; VARCHAR + INT needs CAST
- Result column names from first SELECT only
- Use explicit CAST in each branch for consistent types

**How to explain in interview:** List three rules (count, order, types); warn about positional not name matching.

**DE example:** Union bronze extracts: region A has amount DECIMAL(10,2), region B has FLOAT — CAST both to DECIMAL(18,2) before UNION ALL.

**Common mistake:** Assuming UNION aligns by column name — it aligns by position, not name.

**Source:** DE Interview Guide — SQL Q38

### 3. Types of constraints in SQL?

**Interview question:** Types of constraints in SQL?

**Answer:** SQL constraints enforce data integrity rules at the database level. PRIMARY KEY and UNIQUE ensure uniqueness; FOREIGN KEY enforces referential integrity; NOT NULL prevents missing values; CHECK validates domain rules (e.g., salary > 0); DEFAULT supplies values when none provided. In medallion architectures, constraints are often strongest at silver/gold in the warehouse while bronze remains schema-on-read with DQ checks.

**Key points:**

- PRIMARY KEY: unique + NOT NULL, one per table
- FOREIGN KEY: child references parent
- UNIQUE: alternate key uniqueness
- NOT NULL: mandatory column values
- CHECK: boolean expression validation; DEFAULT: fallback value

**How to explain in interview:** Name all six types with one-line purpose; contrast bronze flexibility vs silver enforcement.

**DE example:** Silver table: CHECK (order_amount >= 0), NOT NULL on order_id, FK to dim_customer — bronze allows messy data, silver enforces rules.

**Common mistake:** Over-constraining bronze landing tables — load failures on every bad source row; validate progressively.

**Source:** DE Interview Guide — SQL Q39

### 4. Can you increase the size of a column (e.g., name VARCHAR(20) to 50)?

**Interview question:** Can you increase the size of a column (e.g., name VARCHAR(20) to 50)?

**Answer:** Increasing column size (e.g., VARCHAR(20) to VARCHAR(50)) uses ALTER TABLE ALTER COLUMN in SQL Server. The operation modifies metadata and may require row-size validation if decreasing size. Increasing VARCHAR length is usually online and fast; decreasing can fail if existing data exceeds new length. On large Synapse tables, test in lower environment and check dependent objects.

**Key points:**

- ALTER TABLE t ALTER COLUMN col VARCHAR(50)
- Increasing size generally safe; decreasing may truncate/fail
- NOT NULL/PK columns need full column spec in some engines
- No automatic update to downstream ADF schema mappings
- Document in migration script with pre-check MAX(LEN(col))

**Syntax / example:**

```sql
ALTER TABLE Employees
ALTER COLUMN name VARCHAR(50) NOT NULL;
```

**How to explain in interview:** Give ALTER syntax, direction matters (expand vs shrink), mention pipeline schema sync.

**DE example:** Source CRM expands name field — ALTER COLUMN customer_name VARCHAR(200) on silver before prod load; update ADF dataset schema in same release.

**Common mistake:** Shrinking column without checking MAX(LEN()) — migration fails mid-deploy.

**Source:** DE Interview Guide — SQL Q40

### 5. Syntax to create a clustered index.

**Interview question:** Syntax to create a clustered index.

**Answer:** Creating a clustered index physically orders table data by the indexed column(s). Syntax: CREATE CLUSTERED INDEX index_name ON table(column). If the table is a heap, the first clustered index converts it to clustered table structure. Choose the clustered key for common range scan patterns — often date in fact tables or surrogate PK in dimensions. Only one clustered index allowed per table.

**Key points:**

- CREATE CLUSTERED INDEX IX_name ON table(col)
- One per table — often PK or date partition column
- Rebuild may be needed after large bulk load: ALTER INDEX REORGANIZE/REBUILD
- Synapse fact tables often use CLUSTERED COLUMNSTORE instead of B-tree
- Leading column of composite clustered key defines sort order

**Syntax / example:**

```sql
CREATE CLUSTERED INDEX IX_Employees_ID
ON Employees(employee_id);
```

**How to explain in interview:** Syntax + one-per-table rule + choose key aligned to query pattern.

**DE example:** After initial load of 500M-row fact_events, create clustered index on (event_date, event_id) matching nightly DELETE+INSERT partition pattern.

**Common mistake:** Creating clustered index on low-cardinality column alone — poor sort utility and hot-spot inserts.

**Source:** DE Interview Guide — SQL Q41

### 6. How do you create a backup table from an existing table?

**Interview question:** How do you create a backup table from an existing table?

**Answer:** Backup tables capture a point-in-time copy before destructive changes. SQL Server SELECT * INTO new_table FROM source quickly copies structure and data without pre-declaring columns. Postgres/MySQL use CREATE TABLE AS SELECT. For production fixes, also consider native BACKUP DATABASE or table-level export to ADLS. Always verify row counts match: source COUNT = backup COUNT.

**Key points:**

- SELECT * INTO Employees_Backup FROM Employees — SQL Server
- CREATE TABLE backup AS SELECT * FROM t — Postgres/others
- Copies data + infers schema; no indexes/constraints copied
- Compare COUNT(*) before and after backup creation
- Prefer snapshot/backup over SELECT INTO for large prod tables in Synapse

**Syntax / example:**

```sql
SELECT * INTO Employees_Backup FROM Employees;

-- Verify
SELECT COUNT(*) FROM Employees;
SELECT COUNT(*) FROM Employees_Backup;
```

**How to explain in interview:** Lead with safety narrative, give SELECT INTO syntax, mention row-count validation.

**DE example:** Before one-time DELETE fix on gold.dim_product, SELECT * INTO dim_product_bak_20250905 FROM dim_product — rollback script ready if validation fails.

**Common mistake:** Running fix without backup because 'it's just one UPDATE' — no rollback path when join affects more rows than expected.

**Source:** DE Interview Guide — SQL Q42

### 7. Can we do a UNION on 3 tables?

**Interview question:** Can we do a UNION on 3 tables?

**Answer:** UNION and UNION ALL support chaining any number of SELECT statements as long as each branch satisfies schema compatibility rules. Each UNION connects two operands; additional tables extend the chain: A UNION B UNION C. All branches except the last can omit ALL; mixing UNION (dedup) and UNION ALL in one chain requires careful ordering. For multi-source bronze ingestion, UNION ALL is preferred when sources are disjoint.

**Key points:**

- A UNION ALL B UNION ALL C — valid for any N tables
- Every branch must match column count, order, types
- UNION deduplicates final combined set across all branches
- Parentheses may be needed for precedence with mixed UNION/ALL
- Column names from first SELECT in chain

**Syntax / example:**

```sql
SELECT order_id, amount, 'RegionA' AS source FROM RegionA_Sales
UNION ALL
SELECT order_id, amount, 'RegionB' AS source FROM RegionB_Sales
UNION ALL
SELECT order_id, amount, 'RegionC' AS source FROM RegionC_Sales;
```

**How to explain in interview:** Confirm yes for N tables, restate schema rules, show three-table example.

**DE example:** Combine five SaaS vendor staging tables into silver.unified_events with UNION ALL — each vendor mapped to common column layout via CAST.

**Common mistake:** Different column orders across branches — silent wrong data alignment in UNION.

**Source:** DE Interview Guide — SQL Q43

### 8. You’re responsible for production and need to fix an issue in a table, …

**Interview question:** You’re responsible for production and need to fix an issue in a table, but running a query risks damaging data — your boss asks you to back it up first. How?

**Answer:** Production data fixes demand a rollback strategy before any DML runs. Take a table-level backup with SELECT * INTO backup_table FROM target, or use native backup/snapshot tools. Document expected row impact, run in explicit transaction with pre/post row counts, and validate with SELECT before COMMIT. In cloud warehouses, consider time-travel (Delta) or database restore point if available.

**Key points:**

- SELECT * INTO backup FROM table before UPDATE/DELETE
- BEGIN TRAN → fix → validate → COMMIT or ROLLBACK
- Log before/after COUNT(*) and sample changed rows
- Delta Lake: RESTORE TABLE TO VERSION AS OF timestamp
- Get approval/ticket for prod DML — change management

**Syntax / example:**

```sql
SELECT * INTO Employees_Backup_20250905 FROM Employees;

BEGIN TRANSACTION;
  -- test scope first
  SELECT * FROM Employees WHERE <fix_condition>;
  -- apply fix
  UPDATE Employees SET ... WHERE <fix_condition>;
  -- validate counts
  -- COMMIT; or ROLLBACK;
```

**How to explain in interview:** Safety-first narrative: backup → transaction → validate → commit; mention Delta time travel.

**DE example:** Boss asks for prod fix: snapshot dim_customer to ADLS Parquet backup, run fix in transaction, share validation query results before commit.

**Common mistake:** Running UPDATE without WHERE clause test on SELECT first — mass accidental update.

**Source:** DE Interview Guide — SQL Q44

### 9. What is a composite key? Can you create one?

**Interview question:** What is a composite key? Can you create one?

**Answer:** A composite key combines two or more columns to uniquely identify a row when no single column is unique alone. Common in junction/bridge tables like order_details (order_id + product_id) or event logs (device_id + event_ts). Create with ALTER TABLE ADD CONSTRAINT PRIMARY KEY (col1, col2). Composite keys affect index design — leading column order impacts seek performance.

**Key points:**

- Multi-column PRIMARY KEY or UNIQUE constraint
- Typical for many-to-many detail/fact grain tables
- All columns in composite PK must be NOT NULL
- Index seeks use leading column first — order matters
- Surrogate single-column PK + UNIQUE composite is alternative pattern

**Syntax / example:**

```sql
ALTER TABLE OrderDetails
ADD CONSTRAINT PK_OrderDetails PRIMARY KEY (order_id, product_id);
```

**How to explain in interview:** Explain when single column fails, show ALTER TABLE composite PK syntax.

**DE example:** fct_order_line grain is (order_id, line_number) composite PK — gold aggregations at order level use GROUP BY order_id.

**Common mistake:** Adding surrogate PK but losing composite business grain — duplicates possible at business key level.

**Source:** DE Interview Guide — SQL Q45

### 10. What is a natural key?

**Interview question:** What is a natural key?

**Answer:** A natural key is a business identifier derived from real-world data — email, SSN, product SKU, order number from source system. It has meaning to business users and often comes from upstream applications. Natural keys can change (email update, SKU remap) and may be composite or non-numeric. Data warehouses typically store natural keys alongside surrogate keys for lookup, MERGE matching, and audit.

**Key points:**

- Business-meaningful: SKU, email, employee_number
- Comes from source system — not generated by DWH
- Can change over time — problem for PK in Type 2 SCD
- Used for CDC MERGE match keys and source reconciliation
- Often enforced with UNIQUE constraint, not always as PK

**How to explain in interview:** Define with business example, contrast surrogate, explain MERGE match on natural key.

**DE example:** Salesforce Contact Id is natural key in bronze/silver; warehouse assigns contact_sk surrogate for fct_interactions joins and SCD Type 2 history.

**Common mistake:** Using volatile natural key (email) as sole PK without surrogate — breaks when customer updates email.

**Source:** DE Interview Guide — SQL Q46

### 11. A name column has all lowercase letters — how do you capitalize the fir…

**Interview question:** A name column has all lowercase letters — how do you capitalize the first letter?

**Answer:** Capitalizing the first letter of a name while lowercasing the rest uses string functions: UPPER(LEFT(name,1)) concatenated with LOWER(SUBSTRING(name,2,...)). SQL Server lacks a single INITCAP like Oracle; Databricks/Postgres may offer INITCAP(). For data cleansing in bronze-to-silver, apply once during transform rather than in every downstream query. Handle NULL and empty strings explicitly.

**Key points:**

- UPPER(LEFT(name,1)) + LOWER(SUBSTRING(name,2,LEN(name)))
- Handle NULL: CASE WHEN name IS NULL THEN NULL ELSE ... END
- TRIM before casing — leading spaces break LEFT(name,1)
- Databricks: initcap(name) one-shot alternative
- Persist cleansed name in silver — don't repeat in every report

**Syntax / example:**

```sql
SELECT CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2, LEN(name)))) AS proper_name
FROM Employees
WHERE name IS NOT NULL;
```

**How to explain in interview:** Show CONCAT pattern, mention NULL/trim edge cases, persist in silver.

**DE example:** Bronze HR feed has lowercase names — standardize in silver ETL with CONCAT/UPPER/LOWER before loading gold dim_employee.

**Common mistake:** Only UPPER(name) — entire string uppercase instead of proper case.

**Source:** DE Interview Guide — SQL Q47

### 12. How do you trim leading/trailing spaces from a column?

**Interview question:** How do you trim leading/trailing spaces from a column?

**Answer:** Trimming leading and trailing whitespace uses TRIM() in SQL Server 2017+ and ANSI SQL. Older SQL Server: LTRIM(RTRIM(column)). Whitespace in keys causes join failures — 'ABC' vs 'ABC ' — common in CSV bronze loads. Clean in silver ETL and add DQ check for LEN(col) <> LEN(TRIM(col)) on critical keys.

**Key points:**

- TRIM(col) — removes leading and trailing spaces
- Legacy SQL Server: LTRIM(RTRIM(col))
- TRIM affects join keys — silent non-match on padded values
- Also watch non-breaking spaces and Unicode whitespace
- Apply in bronze→silver cleanse step, not at query time

**Syntax / example:**

```sql
SELECT TRIM(name) AS trimmed_name FROM Employees;

-- SQL Server pre-2017
SELECT LTRIM(RTRIM(name)) AS trimmed_name FROM Employees;
```

**How to explain in interview:** TRIM syntax, explain join failure scenario, mention legacy LTRIM/RTRIM.

**DE example:** CRM export has padded customer_code — TRIM in silver MERGE ON clause prevents orphan fact rows in gold.

**Common mistake:** Joining on untrimmed keys — undercount in reconciliation, 'missing' dimension matches.

**Source:** DE Interview Guide — SQL Q48

### 13. A code column starts with a 4-digit year (e.g., “2023BH1042”) — how do …

**Interview question:** A code column starts with a 4-digit year (e.g., “2023BH1042”) — how do you extract just the year into a new column?

**Answer:** Extracting a fixed prefix like a 4-digit year from a code column uses LEFT(code, 4) when the year always occupies the first four characters. Alternatives: SUBSTRING(code, 1, 4) or REGEXP/SUBSTRING with patterns for variable formats. Cast result to INT if numeric comparisons needed. Document parsing rules when source format changes — version the extraction logic.

**Key points:**

- LEFT(code_column, 4) when year is fixed prefix
- SUBSTRING(code, 1, 4) equivalent
- CAST(LEFT(code,4) AS INT) for numeric year filters
- Regex/substring for non-fixed patterns: SUBSTRING with CHARINDEX
- Validate: WHERE LEN(code) >= 4 AND LEFT(code,4) NOT LIKE '%[^0-9]%'

**Syntax / example:**

```sql
SELECT code_column,
       LEFT(code_column, 4) AS year_extracted
FROM Employees
WHERE LEN(code_column) >= 4;
```

**How to explain in interview:** Confirm fixed-width prefix assumption, show LEFT, mention validation.

**DE example:** Invoice code '2023BH1042' → batch_year = LEFT(invoice_code, 4) in silver for partition pruning in gold aggregations by year.

**Common mistake:** Using RIGHT instead of LEFT, or not validating length — short codes produce garbage year.

**Source:** DE Interview Guide — SQL Q49

### 14. How do you join 4 tables in SQL?

**Interview question:** How do you join 4 tables in SQL?

**Answer:** Joining four tables chains JOIN clauses sequentially, each with an ON condition linking to the prior table. Order logically from fact through dimensions or along foreign key path — optimizer reordering may differ from written order. Ensure join keys are indexed/distributed appropriately. In Synapse, align distribution keys on join columns to minimize data movement.

**Key points:**

- Chain: A JOIN B ON ... JOIN C ON ... JOIN D ON ...
- Each ON links new table to already-joined set
- Start from fact table, join dimensions — star schema pattern
- INNER vs LEFT depends on whether unmatched rows needed
- Synapse: HASH distribute on common join key across large tables

**Syntax / example:**

```sql
SELECT c.customer_name, p.product_name, o.order_amount, d.calendar_date
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN OrderDetails od ON o.order_id = od.order_id
JOIN Products p ON od.product_id = p.product_id;
```

**How to explain in interview:** Write chain left-to-right, name ON keys, mention fact-first star pattern.

**DE example:** fct_orders JOIN dim_customer JOIN dim_product JOIN dim_date — four-table star join in Synapse gold view for BI consumption.

**Common mistake:** Cartesian product from missing ON clause on one join — row explosion.

**Source:** DE Interview Guide — SQL Q50

### 15. How do you rename a table?

**Interview question:** How do you rename a table?

**Answer:** Renaming a table uses platform-specific DDL. SQL Server: EXEC sp_rename 'OldName', 'NewName'. Standard SQL/Postgres: ALTER TABLE OldName RENAME TO NewName. Renaming breaks hard-coded references in ADF datasets, stored procedures, views, and BI reports — update all dependents in the same release. Prefer views as stable interface when table names may change.

**Key points:**

- SQL Server: EXEC sp_rename 'OldTable', 'NewTable'
- Postgres: ALTER TABLE old RENAME TO new
- Update views, procs, ADF linked services referencing old name
- sp_rename does not auto-update dependent object definitions
- Synapse: check external table and CETAS dependencies

**Syntax / example:**

```sql
-- SQL Server
EXEC sp_rename 'OldTableName', 'NewTableName';

-- Postgres / ANSI
ALTER TABLE OldTableName RENAME TO NewTableName;
```

**How to explain in interview:** Platform syntax + dependency warning + view abstraction tip.

**DE example:** Rename stg_sales_v1 to stg_sales after schema change — update ADF pipeline JSON and Synapse proc in same PR.

**Common mistake:** Renaming table without grep-searching codebase for references — pipeline fails overnight.

**Source:** DE Interview Guide — SQL Q51

### 16. Can you create a multi-column (composite) index?

**Interview question:** Can you create a multi-column (composite) index?

**Answer:** Composite (multi-column) indexes index several columns in defined order — the leading column is most important for seek operations. CREATE INDEX idx ON table(col1, col2) supports queries filtering on col1 or col1+col2; filtering only col2 may not use the index efficiently. Match index column order to common WHERE/JOIN predicate patterns in warehouse queries.

**Key points:**

- CREATE INDEX IX ON table(dept, salary) — column order matters
- Leading column must be in predicate for efficient seek
- Covering index: INCLUDE columns for index-only scan
- Too many indexes hurt INSERT/MERGE on staging tables
- Synapse: index strategy differs — focus on distribution + CCI

**Syntax / example:**

```sql
CREATE NONCLUSTERED INDEX IX_Employees_Dept_Salary
ON Employees(department, salary)
INCLUDE (employee_id, name);
```

**How to explain in interview:** Syntax + leading column rule + covering INCLUDE mention.

**DE example:** Non-clustered index on (order_date, customer_id) for nightly reconciliation query filtering both columns — INCLUDE (order_amount) for covering scan.

**Common mistake:** Reversing column order vs query filter — index on (customer_id, order_date) unused when only filtering order_date.

**Source:** DE Interview Guide — SQL Q52

### 17. How do you display only duplicate records in a table?

**Interview question:** How do you display only duplicate records in a table?

**Answer:** Displaying duplicate records means listing key combinations that appear more than once, typically via GROUP BY with HAVING COUNT(*) > 1. This shows which values are duplicated and how many times. To list all rows participating in duplicate groups (not just the keys), join the grouped result back to the source or use ROW_NUMBER() > 1 filter. Use for bronze DQ before silver promotion.

**Key points:**

- GROUP BY keys HAVING COUNT(*) > 1 shows duplicate key groups
- Add COUNT(*) column to show duplication factor
- Full row listing: INNER JOIN grouped subquery back to table
- ROW_NUMBER(): WHERE rn > 1 lists all non-survivor duplicate rows
- Alert when duplicate group count > 0 in pipeline

**Syntax / example:**

```sql
SELECT email, COUNT(*) AS duplicate_count
FROM Employees
GROUP BY email
HAVING COUNT(*) > 1;
```

**How to explain in interview:** Give GROUP BY/HAVING first, then explain join-back for full rows.

**DE example:** Bronze ingest DQ: HAVING COUNT(*)>1 on transaction_id — block silver MERGE if any duplicates, route to quarantine Delta table.

**Common mistake:** Confusing 'show duplicate keys' with 'show all duplicate rows' — different queries.

**Source:** DE Interview Guide — SQL Q53

### 18. Given table structure Orders(order_id, customer_id, order_amount), Cust…

**Interview question:** Given table structure Orders(order_id, customer_id, order_amount), Customers(customer_id, customer_name), Payments(order_id, payment_status) — find customer_name and total order_amount for only successfully paid orders.

**Answer:** This scenario joins Orders to Customers for names and to Payments for success filter, then aggregates SUM(order_amount) per customer. The INNER JOIN to Payments restricts to successfully paid orders only — unpaid orders excluded entirely. GROUP BY customer_name collapses to one row per customer with total paid amount. Verify grain: if a customer has multiple orders, SUM aggregates correctly.

**Key points:**

- Three-table join: Orders → Customers, Orders → Payments
- WHERE payment_status = 'Success' filters paid orders only
- GROUP BY customer_name with SUM(order_amount)
- INNER JOIN Payments excludes orders without payment records
- Check for duplicate payment rows inflating SUM — dedup if needed

**Syntax / example:**

```sql
SELECT c.customer_name, SUM(o.order_amount) AS total_amount
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Payments p ON o.order_id = p.order_id
WHERE p.payment_status = 'Success'
GROUP BY c.customer_name;
```

**How to explain in interview:** Name tables and join keys, explain INNER on Payments, end with GROUP BY grain.

**DE example:** Gold customer revenue mart: same pattern in Synapse proc — only 'Success' payments count toward customer_lifetime_value.

**Common mistake:** Filtering payment_status in WHERE on LEFT JOIN to Orders — accidentally inner-join behavior.

**Source:** DE Interview Guide — SQL Q54


---

## Interview Guide — SQL — Plate 4

> **15 questions** — numbered 1–15 in this plate. From *DE Interview Guide*.

### 1. Find customer_name who never placed any order.

**Interview question:** Find customer_name who never placed any order.

**Answer:** Customers who never placed an order are found with LEFT JOIN from Customers to Orders, filtering WHERE order_id IS NULL on the Orders side. This anti-join pattern preserves all customers and identifies those with no matching order. NOT EXISTS and NOT IN are equivalent alternatives; NOT EXISTS is generally preferred for NULL safety and often better optimized.

**Key points:**

- LEFT JOIN Orders + WHERE o.order_id IS NULL
- Alternative: NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.customer_id)
- Avoid NOT IN if Orders.customer_id nullable — NULL poisons NOT IN
- Anti-join common for churn analysis and marketing segments
- COUNT left side rows with null match for metric

**Syntax / example:**

```sql
SELECT c.customer_id, c.customer_name
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

**How to explain in interview:** Draw LEFT JOIN diagram, highlight NULL check on right side.

**DE example:** Marketing segment 'never purchased': LEFT JOIN fct_orders, filter NULL — export to Campaign tool from gold view.

**Common mistake:** Using INNER JOIN — excludes the very customers you want to find.

**Source:** DE Interview Guide — SQL Q55

### 2. Show total orders and successful payments count for each customer.

**Interview question:** Show total orders and successful payments count for each customer.

**Answer:** This query combines LEFT JOINs to preserve all customers while counting orders and successful payments per customer. COUNT(o.order_id) counts orders (NULLs excluded automatically). Conditional aggregation SUM(CASE WHEN payment_status='Success' THEN 1 ELSE 0 END) counts successful payments without filtering out customers with zero successes. GROUP BY customer_name produces one summary row per customer.

**Key points:**

- LEFT JOIN preserves customers with zero orders
- COUNT(o.order_id) — NULL order ids not counted
- Conditional SUM(CASE...) for successful payment count
- Multiple LEFT JOINs can multiply rows if Payments has many per order — consider subquery dedup
- Alternative: COUNT(DISTINCT CASE WHEN ... THEN p.payment_id END)

**Syntax / example:**

```sql
SELECT c.customer_name,
       COUNT(o.order_id) AS total_orders,
       SUM(CASE WHEN p.payment_status = 'Success' THEN 1 ELSE 0 END) AS successful_payments
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
LEFT JOIN Payments p ON o.order_id = p.order_id
GROUP BY c.customer_name;
```

**How to explain in interview:** Explain why LEFT JOIN, show conditional aggregate, warn about join fan-out.

**DE example:** Customer 360 gold table: total_orders and successful_payments columns updated nightly — LEFT JOIN pattern keeps inactive customers visible.

**Common mistake:** INNER JOIN to Orders — drops customers with no orders from result entirely.

**Source:** DE Interview Guide — SQL Q56

### 3. You have Orders and OrderDetails tables — find each order and its quant…

**Interview question:** You have Orders and OrderDetails tables — find each order and its quantity.

**Answer:** Joining Orders to OrderDetails on order_id returns each order with its line-item quantities. INNER JOIN returns only orders that have detail rows; LEFT JOIN would include orders with no lines (NULL quantity). Grain of result is order_id + line level if multiple details per order — one row per order line, not per order unless aggregated.

**Key points:**

- JOIN OrderDetails od ON o.order_id = od.order_id
- Result grain: one row per order line item
- SUM(od.quantity) GROUP BY o.order_id for order-level total qty
- INNER JOIN excludes header-only orders without details
- Index/distribute on order_id for join performance

**Syntax / example:**

```sql
SELECT o.order_id, o.order_date, od.product_id, od.quantity
FROM Orders o
JOIN OrderDetails od ON o.order_id = od.order_id;
```

**How to explain in interview:** State join key, clarify line-level grain, mention aggregation for order totals.

**DE example:** Silver order enrichment: join header to lines before aggregating to gold fct_order with total_quantity = SUM(quantity).

**Common mistake:** Assuming one row per order without GROUP BY when multiple OrderDetails exist — duplicated header columns.

**Source:** DE Interview Guide — SQL Q57

### 4. Find all orders placed in 2022 from an Orders table with an order_date …

**Interview question:** Find all orders placed in 2022 from an Orders table with an order_date column.

**Answer:** Filtering orders by year from a date column can use YEAR(order_date) = 2022 for readability, but sargable range predicates perform better on indexed columns: order_date >= '2022-01-01' AND order_date < '2023-01-01'. In partitioned tables, align filter with partition key for partition elimination. Persist order_year in gold if year filtering is dominant access pattern.

**Key points:**

- YEAR(order_date) = 2022 — readable but often non-sargable
- Range filter: >= '2022-01-01' AND < '2023-01-01' — index friendly
- Partition elimination when table partitioned on order_date
- Databricks: year(order_date) = 2022 with partition column order_year
- Timezone: convert to UTC before date extraction if sources mixed

**Syntax / example:**

```sql
SELECT * FROM Orders
WHERE order_date >= '2022-01-01'
  AND order_date < '2023-01-01';
```

**How to explain in interview:** Show YEAR syntax, immediately pivot to sargable range for performance.

**DE example:** Synapse fact_orders partitioned on order_date — range filter prunes partitions; YEAR() function forces full scan.

**Common mistake:** YEAR(order_date)=2022 on billion-row fact — full scan; use range or partition column.

**Source:** DE Interview Guide — SQL Q58

### 5. For an Orders table with order_date, find the previous order date for e…

**Interview question:** For an Orders table with order_date, find the previous order date for each row.

**Answer:** Finding the previous order date per row uses LAG(order_date) OVER (ORDER BY order_date) or PARTITION BY customer_id for per-customer sequences. LAG looks one row back in the ordered window without self-join. Gap analysis: DATEDIFF between current and LAG date. Essential for sessionization and reorder pattern detection in event pipelines.

**Key points:**

- LAG(order_date) OVER (ORDER BY order_date) — global sequence
- PARTITION BY customer_id for per-customer previous order
- Optional third arg: LAG(col, 1, default) for first row
- LEAD for next order date — forward-looking analysis
- Requires ORDER BY in OVER — defines chronological direction

**Syntax / example:**

```sql
SELECT order_id, customer_id, order_date,
       LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS previous_order_date
FROM Orders;
```

**How to explain in interview:** Name LAG, show PARTITION BY customer, give gap-detection use case.

**DE example:** Customer reorder SLA: DATEDIFF(day, LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date), order_date) in gold analytics.

**Common mistake:** Self-join on row_number ± 1 instead of LAG — more complex and error-prone with gaps.

**Source:** DE Interview Guide — SQL Q59

### 6. Find customers who placed more than 5 orders.

**Interview question:** Find customers who placed more than 5 orders.

**Answer:** Customers with more than five orders require GROUP BY customer_id and HAVING COUNT(*) > 5. WHERE cannot filter on COUNT — aggregation must complete first. COUNT(*) counts all orders per group; COUNT(DISTINCT order_id) guards against duplicate rows in source. Result grain is one row per qualifying customer.

**Key points:**

- GROUP BY customer_id HAVING COUNT(*) > 5
- HAVING not WHERE for aggregate threshold
- COUNT(DISTINCT order_id) if duplicates possible in source
- Combine WHERE on order_date in same query to scope time window
- Output: customer_id + order_count for downstream segment export

**Syntax / example:**

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM Orders
GROUP BY customer_id
HAVING COUNT(*) > 5;
```

**How to explain in interview:** State grain (per customer), GROUP BY, HAVING threshold — quick clean answer.

**DE example:** Loyalty tier promotion: customers with HAVING COUNT(*) > 5 orders in trailing 12 months — computed in gold SQL job.

**Common mistake:** WHERE COUNT(*) > 5 — syntax error; classic WHERE vs HAVING trap.

**Source:** DE Interview Guide — SQL Q60

### 7. Two tables have IDs 1,1,0,1 and 1,1,NULL,0 — how many rows result from …

**Interview question:** Two tables have IDs 1,1,0,1 and 1,1,NULL,0 — how many rows result from INNER, LEFT, RIGHT, and FULL join?

**Answer:** Join row counts depend on join type and NULL matching behavior. INNER JOIN returns only rows where join keys match — NULL does not match NULL or anything in standard SQL. LEFT JOIN keeps all left rows; unmatched right columns are NULL. RIGHT JOIN mirrors LEFT. FULL OUTER JOIN keeps all from both sides with NULLs where no match. With IDs 1,1,0,1 vs 1,1,NULL,0 — INNER matches on key=1 producing multiple pairings; 0 and NULL typically produce no inner matches.

**Key points:**

- INNER: only matching non-NULL key pairs (usually)
- NULL = NULL is UNKNOWN — not a match in INNER JOIN
- LEFT: all left rows + matched right; NULL fill for non-match
- FULL OUTER: union of left and right preservation
- Cross join cardinality: matches multiply — 3 left 1s × 2 right 1s = 6 pairs for key 1

**Comparison:**

| Join Type | Rows Returned | NULL key behavior |
| --- | --- | --- |
| INNER | Matching keys only | NULL never matches |
| LEFT | All left + matches | Right NULL if no match |
| RIGHT | All right + matches | Left NULL if no match |
| FULL OUTER | All from both | NULL fill on non-match side |

**How to explain in interview:** Explain per join type who survives, emphasize NULL never matches in INNER.

**DE example:** Reconciliation FULL OUTER JOIN between source and target counts — investigate NULL key rows separately in DQ, don't assume they match.

**Common mistake:** Expecting NULL keys to join — they don't in INNER; causes undercount in reconciliation.

**Source:** DE Interview Guide — SQL Q61

### 8. Given values 101,102,102,103,104,105 — what will ROW_NUMBER() output be?

**Interview question:** Given values 101,102,102,103,104,105 — what will ROW_NUMBER() output be?

**Answer:** ROW_NUMBER() assigns a unique sequential integer to each row within its partition, ordered by the OVER clause — ties receive different numbers arbitrarily (1,2,3,4,5,6 for six values including duplicate 102). RANK and DENSE_RANK would both give rank 2 to tied 102 values but differ on next rank. Use ROW_NUMBER when you need exactly one row per group (dedup); use RANK/DENSE_RANK when ties should share rank.

**Key points:**

- ROW_NUMBER: unique 1..N even with duplicate values
- Duplicate 102 gets different row numbers (e.g., 2 and 3)
- RANK: 1,2,2,4 — skips after tie
- DENSE_RANK: 1,2,2,3 — no skip
- Dedup pattern: WHERE ROW_NUMBER()... = 1

**How to explain in interview:** Output 1-6 for six rows, contrast with RANK giving 1,2,2,4.

**DE example:** Dedup bronze events: ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ingest_ts DESC) = 1 — ties broken by timestamp, not shared.

**Common mistake:** Using ROW_NUMBER for 'top salary with ties' — should use RANK or DENSE_RANK.

**Source:** DE Interview Guide — SQL Q62

### 9. What is the default join if you just write “JOIN” without specifying a …

**Interview question:** What is the default join if you just write “JOIN” without specifying a type?

**Answer:** In standard SQL, JOIN without a qualifier defaults to INNER JOIN — only matching rows from both tables are returned. You must explicitly specify LEFT, RIGHT, or FULL OUTER when those semantics are needed. This default catches developers who omit JOIN type expecting all rows preserved. Always write INNER explicitly in production code for clarity.

**Key points:**

- JOIN = INNER JOIN in ANSI SQL and SQL Server
- Must specify LEFT/RIGHT/FULL for outer join semantics
- Omitting OUTER keyword changes result dramatically
- Cross join requires CROSS keyword or missing ON (accidental)
- Code review: flag bare JOIN when LEFT was intended

**How to explain in interview:** State default clearly, give consequence example of wrong join type.

**DE example:** Pipeline bug: developer wrote JOIN instead of LEFT JOIN to dimension — silently dropped orphan fact rows, revenue underreported 3%.

**Common mistake:** Assuming JOIN keeps all left rows — that's LEFT JOIN; bare JOIN is INNER.

**Source:** DE Interview Guide — SQL Q63

### 10. Difference between OR and IN?

**Interview question:** Difference between OR and IN?

**Answer:** IN is syntactic sugar for multiple OR conditions on the same column: WHERE dept IN ('HR','IT') equals WHERE dept='HR' OR dept='IT'. IN is more readable and can optimize well with index seeks. OR is more flexible for combining conditions across different columns or complex expressions. Extended IN lists may hit parameter limits — consider temp table or join to lookup table.

**Key points:**

- IN: same column, multiple discrete values
- OR: any conditions, including cross-column logic
- NOT IN: watch NULLs in list — yields UNKNOWN/empty
- Large IN lists: join to temp table of keys instead
- IN (subquery) for dynamic key sets from staging

**Comparison:**

| Aspect | IN | OR |
| --- | --- | --- |
| Scope | Same column values | Any conditions |
| Readability | Cleaner for value lists | Flexible, verbose lists |
| Example | dept IN ('HR','IT') | dept='HR' OR dept='IT' |
| Cross-column | No | Yes |

**How to explain in interview:** Show equivalence for same column, explain when OR required for multi-column.

**DE example:** Filter fact table to active regions: WHERE region_id IN (SELECT region_id FROM cfg_active_regions) — config-driven, no hard-coded OR chain.

**Common mistake:** NOT IN with nullable subquery column — unexpected empty result; use NOT EXISTS.

**Source:** DE Interview Guide — SQL Q64

### 11. Which operation supports rollback — DELETE, TRUNCATE, or DROP?

**Interview question:** Which operation supports rollback — DELETE, TRUNCATE, or DROP?

**Answer:** DELETE supports rollback when executed inside an explicit transaction that has not yet committed — ROLLBACK restores deleted rows (with full logging). TRUNCATE and DROP are DDL-like operations: TRUNCATE deallocates pages with minimal logging; DROP removes the object. SQL Server allows rolling back TRUNCATE/DROP only if still inside an uncommitted transaction. Once committed, recovery requires backup restore, not ROLLBACK.

**Key points:**

- DELETE: DML, row-level log, rollback in open transaction
- TRUNCATE: fast deallocate, minimal log, limited rollback
- DROP: removes object metadata — catastrophic if committed
- Always BEGIN TRAN + COUNT check before prod DELETE
- Delta time travel / DB restore for post-commit recovery

**Comparison:**

| Operation | Rollback (in transaction) | After commit recovery |
| --- | --- | --- |
| DELETE | Yes | Backup/log restore |
| TRUNCATE | Sometimes (before commit) | Backup only |
| DROP | Sometimes (before commit) | Backup/redeploy schema |

**How to explain in interview:** Rank by recoverability: DELETE best, TRUNCATE conditional, DROP worst; mention transaction wrapper.

**DE example:** Accidental TRUNCATE staging in transaction — ROLLBACK succeeds if not committed; committed TRUNCATE needs restore from snapshot.

**Common mistake:** Assuming TRUNCATE is always rollback-safe after commit — it is not recoverable without backup.

**Source:** DE Interview Guide — SQL Q65

### 12. Can we apply a WHERE condition on an aggregated column?

**Interview question:** Can we apply a WHERE condition on an aggregated column?

**Answer:** WHERE operates on individual rows before GROUP BY aggregation — aggregate functions like SUM() or COUNT() are not yet computed, so WHERE cannot filter on them. Use HAVING for post-aggregation filters on group results. You can filter raw columns in WHERE before grouping (e.g., WHERE status='Active' before COUNT), but not WHERE COUNT(*) > 5 — that belongs in HAVING.

**Key points:**

- WHERE: pre-aggregation row filter — no SUM/COUNT/AVG
- HAVING: post-aggregation group filter — aggregates allowed
- Valid: WHERE order_date > '2024-01-01' GROUP BY customer HAVING COUNT(*)>5
- Invalid: WHERE COUNT(*) > 5
- Subquery workaround: filter aggregated result in outer query WHERE

**How to explain in interview:** Binary answer: No for WHERE on aggregates — redirect to HAVING with example.

**DE example:** Gold job filters active orders in WHERE, then HAVING SUM(amount)>1000 for high-value customers — two-stage filter pattern.

**Common mistake:** WHERE SUM(amount) > 1000 with GROUP BY — invalid; must be HAVING.

**Source:** DE Interview Guide — SQL Q66

### 13. Difference between RANK() and DENSE_RANK()?

**Interview question:** Difference between RANK() and DENSE_RANK()?

**Answer:** RANK() and DENSE_RANK() both assign ranking based on ORDER BY with ties receiving the same rank. After a tie, RANK() skips subsequent numbers (1,2,2,4 — rank 3 skipped). DENSE_RANK() does not skip (1,2,2,3). ROW_NUMBER() never ties. Choose RANK for competition-style ranking with gaps; DENSE_RANK for consecutive rank levels; ROW_NUMBER for dedup.

**Key points:**

- Tie handling: same rank for equal ORDER BY values
- RANK: gaps after tie (Olympic ranking style)
- DENSE_RANK: no gaps (1,2,2,3)
- ROW_NUMBER: unique ranks even with ties
- PARTITION BY for rank within groups

**Comparison:**

| Function | Tie behavior | After tie (next rank) |
| --- | --- | --- |
| RANK() | Same rank | Skips (1,2,2,4) |
| DENSE_RANK() | Same rank | No skip (1,2,2,3) |
| ROW_NUMBER() | Unique always | N/A |

**How to explain in interview:** Show tie example 1,2,2 — RANK gives 4 next, DENSE_RANK gives 3.

**DE example:** Sales top-3 per region: DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) <= 3 includes all tied for 3rd place.

**Common mistake:** Using RANK when business wants consecutive top-N without gaps — should use DENSE_RANK.

**Source:** DE Interview Guide — SQL Q67

### 14. What is a temporary table?

**Interview question:** What is a temporary table?

**Answer:** Temporary tables hold intermediate results for complex multi-step processing within a session or procedure scope. SQL Server: #LocalTemp (session-scoped), ##GlobalTemp (cross-session). CREATE TABLE #t or SELECT INTO #t. They support indexes and statistics — useful for large staging in procs. Automatically dropped when scope ends. Alternative: CTE for simpler single-statement logic; temp tables for multi-step ETL in T-SQL.

**Key points:**

- #TempTable — session scope; ##Global — all sessions
- CREATE TABLE #stg (...); INSERT...; used in multi-step proc
- Can index temp tables — helps large staging joins
- Auto-dropped when session/proc ends
- Synapse: temp tables supported with limitations; prefer permanent staging in ETL

**How to explain in interview:** Contrast #temp vs CTE (persist across statements vs single query), mention scope.

**DE example:** Synapse proc: INSERT INTO #stg FROM bronze external table → dedup in #stg → MERGE to silver — temp table holds batch scope.

**Common mistake:** Using global temp ## without cleanup — blocks and confusion in shared dev servers.

**Source:** DE Interview Guide — SQL Q68

### 15. What are the different types of data distribution (e.g., in Synapse/MPP…

**Interview question:** What are the different types of data distribution (e.g., in Synapse/MPP systems)?

**Answer:** In MPP systems like Azure Synapse Analytics dedicated SQL pool, table distribution controls how rows spread across compute nodes, directly impacting join performance and data movement. ROUND_ROBIN distributes rows evenly without key logic — simple but joins require shuffle. HASH distributes by hash of a column, co-locating matching keys on same node for efficient joins. REPLICATED copies a small table to every node, eliminating shuffle when joining to large fact tables.

**Key points:**

- ROUND_ROBIN: even spread, no key — good staging, bad for large joins
- HASH(column): same key same node — choose frequent JOIN/GROUP BY column
- REPLICATED: full copy on each node — small dimensions only (<2GB guideline)
- Wrong distribution key → massive Data Movement (DMS) in plans
- CTAS to recreate table with correct distribution when fixing skew

**Comparison:**

| Distribution | How rows spread | Best for |
| --- | --- | --- |
| ROUND_ROBIN | Even/random across nodes | Staging, no clear join key |
| HASH | By hash of chosen column | Large fact tables, join key |
| REPLICATED | Full copy on every node | Small dimension tables |

**How to explain in interview:** Name three types, one-line purpose each, tie HASH/REPLICATE to join optimization.

**DE example:** Redesign fct_sales HASH(order_id) joining dim_customer REPLICATED — eliminated 80% DMS in Synapse plan, query 12x faster.

**Common mistake:** HASH on low-cardinality column (e.g., gender) — severe skew, one node does most work.

**Source:** DE Interview Guide — SQL Q69


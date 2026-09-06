/**
 * Full LeetCode-style problem bodies keyed by slug.
 * Used by scripts/seed-de-code.mjs
 */

export const PROBLEM_CONTENT = {
  "filter-active-employees": {
    description: `An HR analytics team needs a list of engineers who are currently active in the workforce system.

You are given a table \`employees\` with employee profiles. Write an SQL query to report the \`employee_id\` and \`full_name\` of every employee who satisfies **both** conditions:

- \`department = 'Engineering'\`
- \`status = 'active'\`

Return the result in any order.`,
    examples: [
      {
        input: `employees table:
+-------------+-----------+-------------+----------+--------+
| employee_id | full_name | department  | status   | salary |
+-------------+-----------+-------------+----------+--------+
| 1           | Alice     | Engineering | active   | 90000  |
| 2           | Bob       | Engineering | active   | 85000  |
| 3           | Carol     | Sales       | active   | 70000  |
| 4           | Dan       | Engineering | inactive | 80000  |
+-------------+-----------+-------------+----------+--------+`,
        output: `+-------------+-----------+
| employee_id | full_name |
+-------------+-----------+
| 1           | Alice     |
| 2           | Bob       |
+-------------+-----------+`,
        explanation: `Alice and Bob are in Engineering and active. Carol is Sales. Dan is inactive.`,
      },
      {
        input: `employees table:
+-------------+-----------+-------------+----------+
| employee_id | full_name | department  | status   |
+-------------+-----------+-------------+----------+
| 10          | Eve       | Engineering | active   |
| 11          | Frank     | Marketing   | active   |
+-------------+-----------+-------------+----------+`,
        output: `+-------------+-----------+
| employee_id | full_name |
+-------------+-----------+
| 10          | Eve       |
+-------------+-----------+`,
        explanation: `Only Eve matches both filters; Frank is in Marketing.`,
      },
    ],
    constraints: [
      `All columns in employees are non-null for this problem.`,
      `Use SELECT / WITH only.`,
      `Result column names must be employee_id and full_name.`,
    ],
    followUp: `How would you extend the query to exclude contractors if an employment_type column existed?`,
  },

  "department-headcount": {
    description: `Workforce planning requires an active headcount snapshot by department.

Using the \`employees\` table, write a query that returns:

- \`department\` — department name
- \`headcount\` — number of **active** employees in that department

Only include departments with at least one active employee.`,
    examples: [
      {
        input: `employees table:
+-------------+-----------+-------------+----------+
| employee_id | full_name | department  | status   |
+-------------+-----------+-------------+----------+
| 1           | Alice     | Engineering | active   |
| 2           | Bob       | Sales       | active   |
| 3           | Carol     | Sales       | active   |
| 4           | Dan       | HR          | inactive |
+-------------+-----------+-------------+----------+`,
        output: `+-------------+-----------+
| department  | headcount |
+-------------+-----------+
| Engineering | 1         |
| Sales       | 2         |
+-------------+-----------+`,
        explanation: `HR has no active employees, so it is omitted.`,
      },
      {
        input: `employees table:
+-------------+-----------+-------------+----------+
| employee_id | full_name | department  | status   |
+-------------+-----------+-------------+----------+
| 1           | Alice     | Engineering | active   |
| 2           | Bob       | Engineering | active   |
| 3           | Carol     | Engineering | active   |
+-------------+-----------+-------------+----------+`,
        output: `+-------------+-----------+
| department  | headcount |
+-------------+-----------+
| Engineering | 3         |
+-------------+-----------+`,
        explanation: `All three active employees share one department.`,
      },
    ],
    constraints: [
      `Count only rows where status = 'active'.`,
      `Output columns must be named department and headcount.`,
    ],
  },

  "top-salary-per-department": {
    description: `Compensation review needs the top earners in each department. When multiple employees tie for the highest salary within a department, **include all of them**.

Write a query returning \`department\`, \`full_name\`, and \`salary\` for every active employee who has the maximum salary in their department.`,
    examples: [
      {
        input: `employees (active):
+-------------+-----------+-------------+--------+
| employee_id | full_name | department  | salary |
+-------------+-----------+-------------+--------+
| 1           | Alice     | Eng         | 100    |
| 2           | Bob       | Eng         | 100    |
| 3           | Carol     | Sales       | 80     |
+-------------+-----------+-------------+--------+`,
        output: `+-------------+-----------+--------+
| department  | full_name | salary |
+-------------+-----------+--------+
| Eng         | Alice     | 100    |
| Eng         | Bob       | 100    |
| Sales       | Carol     | 80     |
+-------------+-----------+--------+`,
        explanation: `Alice and Bob tie for top salary in Eng.`,
      },
      {
        input: `employees (active):
+-------------+-----------+-------------+--------+
| employee_id | full_name | department  | salary |
+-------------+-----------+-------------+--------+
| 1           | Alice     | Eng         | 90     |
| 2           | Bob       | Eng         | 100    |
| 3           | Carol     | Sales       | 100    |
+-------------+-----------+-------------+--------+`,
        output: `+-------------+-----------+--------+
| department  | full_name | salary |
+-------------+-----------+--------+
| Eng         | Bob       | 100    |
| Sales       | Carol     | 100    |
+-------------+-----------+--------+
`,
        explanation: `No tie in Eng — only Bob has the max salary of 100.`,
      },
    ],
    constraints: [
      `Consider only status = 'active' employees.`,
      `Ties must all appear (use RANK or equivalent).`,
    ],
    followUp: `How would DENSE_RANK change the result?`,
  },

  "monthly-revenue-trend": {
    description: `Finance wants monthly revenue totals from the order fact table.

Given table \`orders\` with \`order_id\`, \`order_date\`, and \`amount\`, return:

- \`month\` — calendar month in YYYY-MM format
- \`total_revenue\` — sum of amount for that month

Sort by month ascending.`,
    examples: [
      {
        input: `orders:
+----------+------------+--------+
| order_id | order_date | amount |
+----------+------------+--------+
| 1        | 2024-01-15 | 100    |
| 2        | 2024-01-20 | 50     |
| 3        | 2024-02-01 | 200    |
+----------+------------+--------+`,
        output: `+---------+---------------+
| month   | total_revenue |
+---------+---------------+
| 2024-01 | 150           |
| 2024-02 | 200           |
+---------+---------------+`,
        explanation: `January: 100+50=150. February: 200.`,
      },
      {
        input: `orders:
+----------+------------+--------+
| order_id | order_date | amount |
+----------+------------+--------+
| 1        | 2024-03-10 | 30     |
| 2        | 2024-03-10 | 20     |
| 3        | 2024-04-01 | 100    |
+----------+------------+--------+`,
        output: `+---------+---------------+
| month   | total_revenue |
+---------+---------------+
| 2024-03 | 50            |
| 2024-04 | 100           |
+---------+---------------+`,
        explanation: `Two orders in March sum to 50; April has one order.`,
      },
    ],
    constraints: [`order_date is a valid date string.`, `amount is a positive integer.`],
  },

  "dedupe-click-events": {
    description: `The clickstream pipeline ingested duplicate events from at-least-once delivery. For analytics, each logical event is identified by the tuple (\`user_id\`, \`event_type\`, \`session_id\`). When duplicates exist, keep **only the earliest** row by \`event_time\`.

Table \`click_events\`:

| Column     | Type     | Description              |
|------------|----------|--------------------------|
| user_id    | int      | User identifier          |
| event_type | text     | Event name (click, view) |
| session_id | text     | Session identifier       |
| event_time | datetime | When the event occurred  |

Write a query returning \`user_id\`, \`event_type\`, \`session_id\`, and \`event_time\` for deduplicated rows.`,
    examples: [
      {
        input: `click_events:
+---------+------------+------------+---------------------+
| user_id | event_type | session_id | event_time          |
+---------+------------+------------+---------------------+
| 1       | click      | s1         | 2024-01-01 10:00:00 |
| 1       | click      | s1         | 2024-01-01 10:01:00 |
| 2       | view       | s2         | 2024-01-01 11:00:00 |
+---------+------------+------------+---------------------+`,
        output: `+---------+------------+------------+---------------------+
| user_id | event_type | session_id | event_time          |
+---------+------------+------------+---------------------+
| 1       | click      | s1         | 2024-01-01 10:00:00 |
| 2       | view       | s2         | 2024-01-01 11:00:00 |
+---------+------------+------------+---------------------+`,
        explanation: `The second click for user 1 in session s1 (10:01:00) is dropped; the earliest row is kept.`,
      },
      {
        input: `click_events:
+---------+------------+------------+---------------------+
| user_id | event_type | session_id | event_time          |
+---------+------------+------------+---------------------+
| 3       | view       | s9         | 2024-02-01 09:00:00 |
+---------+------------+------------+---------------------+`,
        output: `Same single row returned (no duplicates to remove).`,
        explanation: `When there is only one row per key, output equals input.`,
      },
    ],
    constraints: [
      `Use a window dedupe pattern (ROW_NUMBER or equivalent).`,
      `Return SELECT only — do not DELETE or UPDATE source data.`,
    ],
    followUp: `How would you keep the latest event instead of the earliest?`,
  },

  "running-revenue-total": {
    description: `Leadership reviews daily performance using a cumulative revenue curve.

Table \`daily_revenue\` contains one row per calendar day:

| Column     | Type | Description        |
|------------|------|--------------------|
| order_date | date | Calendar day       |
| amount     | int  | Revenue that day   |

Write a query returning \`order_date\` and \`running_revenue\`, where \`running_revenue\` is the sum of \`amount\` from the earliest date through the current row's date. Order by \`order_date\` ascending.`,
    examples: [
      {
        input: `daily_revenue:
+------------+--------+
| order_date | amount |
+------------+--------+
| 2024-01-01 | 100    |
| 2024-01-02 | 50     |
| 2024-01-03 | 75     |
+------------+--------+`,
        output: `+------------+-----------------+
| order_date | running_revenue |
+------------+-----------------+
| 2024-01-01 | 100             |
| 2024-01-02 | 150             |
| 2024-01-03 | 225             |
+------------+-----------------+`,
        explanation: `Running totals: 100 → 150 → 225.`,
      },
      {
        input: `daily_revenue:
+------------+--------+
| order_date | amount |
+------------+--------+
| 2024-06-01 | 10     |
+------------+--------+`,
        output: `+------------+-----------------+
| order_date | running_revenue |
+------------+-----------------+
| 2024-06-01 | 10              |
+------------+-----------------+`,
        explanation: `Single-day series: running total equals that day's amount.`,
      },
    ],
    constraints: [
      `Use a window aggregate (SUM OVER ORDER BY order_date).`,
      `Result must be sorted by order_date ascending.`,
    ],
  },

  "scd2-current-version": {
    description: `The analytics warehouse stores customer attributes using **Slowly Changing Dimension Type 2**. Each change creates a new row; historical rows remain with \`is_current = 0\`.

Table \`customer_scd2\`:

| Column         | Type | Description                          |
|----------------|------|--------------------------------------|
| customer_id    | int  | Business key                         |
| email          | text | Email at this version                |
| city           | text | City at this version                 |
| effective_from | date | Version start date                   |
| is_current     | int  | 1 = current version, 0 = historical  |

Return the **current** snapshot: \`customer_id\`, \`email\`, \`city\`, \`effective_from\` where \`is_current = 1\`.`,
    examples: [
      {
        input: `customer_scd2:
+-------------+--------+-------+----------------+------------+
| customer_id | email  | city  | effective_from | is_current |
+-------------+--------+-------+----------------+------------+
| 1           | a@x.com| NYC   | 2024-01-01     | 0          |
| 1           | a@x.com| Boston| 2024-06-01     | 1          |
| 2           | b@x.com| LA    | 2024-01-01     | 1          |
+-------------+--------+-------+----------------+------------+`,
        output: `+-------------+--------+-------+----------------+
| customer_id | email  | city  | effective_from |
+-------------+--------+-------+----------------+
| 1           | a@x.com| Boston| 2024-06-01     |
| 2           | b@x.com| LA    | 2024-01-01     |
+-------------+--------+-------+----------------+`,
        explanation: `Customer 1 moved from NYC to Boston; only the Boston row is current.`,
      },
      {
        input: `customer_scd2:
+-------------+--------+-------+----------------+------------+
| customer_id | email  | city  | effective_from | is_current |
+-------------+--------+-------+----------------+------------+
| 9           | z@x.com| Austin| 2024-01-01     | 1          |
+-------------+--------+-------+----------------+------------+`,
        output: `Same row returned.`,
        explanation: `Customer with only one version and is_current = 1 passes through unchanged.`,
      },
    ],
    constraints: [`Filter is_current = 1.`, `Do not return expired versions.`],
    followUp: `How would you query state as-of 2024-03-01?`,
  },

  "incremental-daily-load": {
    description: `A nightly batch job loads only the latest \`event_date\` partition from \`fact_events\` into the serving layer.

Write a query that selects **all columns** for rows whose \`event_date\` equals the maximum \`event_date\` in the table. This simulates an incremental daily extract.`,
    examples: [
      {
        input: `fact_events:
+----------+------------+--------+
| event_id | event_date | metric |
+----------+------------+--------+
| 1        | 2024-01-01 | 10     |
| 2        | 2024-01-02 | 20     |
| 3        | 2024-01-02 | 5      |
+----------+------------+--------+`,
        output: `+----------+------------+--------+
| event_id | event_date | metric |
+----------+------------+--------+
| 2        | 2024-01-02 | 20     |
| 3        | 2024-01-02 | 5      |
+----------+------------+--------+`,
        explanation: `MAX(event_date) is 2024-01-02; both rows for that date are returned.`,
      },
      {
        input: `fact_events:
+----------+------------+--------+
| event_id | event_date | metric |
+----------+------------+--------+
| 7        | 2024-05-01 | 99     |
+----------+------------+--------+`,
        output: `+----------+------------+--------+
| event_id | event_date | metric |
+----------+------------+--------+
| 7        | 2024-05-01 | 99     |
+----------+------------+--------+`,
        explanation: `When max date is unique, one row is returned.`,
      },
    ],
    constraints: [
      `Use a scalar subquery or CTE for MAX(event_date).`,
      `Return every column from fact_events.`,
    ],
  },

  "unmatched-orders": {
    description: `Data quality checks often surface fact rows that fail referential integrity. The orders table may reference customers that no longer exist in the dimension.

Tables:

| Table      | Key columns                          |
|------------|--------------------------------------|
| orders     | order_id, customer_id, amount        |
| customers  | customer_id, name                    |

Write a query returning \`order_id\` and \`customer_id\` for orders whose \`customer_id\` has **no matching row** in \`customers\`.`,
    examples: [
      {
        input: `orders:
+----------+-------------+--------+
| order_id | customer_id | amount |
+----------+-------------+--------+
| 1        | 10          | 100    |
| 2        | 99          | 50     |
+----------+-------------+--------+
customers:
+-------------+------+
| customer_id | name |
+-------------+------+
| 10          | Ada  |
+-------------+------+`,
        output: `+----------+-------------+
| order_id | customer_id |
+----------+-------------+
| 2        | 99          |
+----------+-------------+`,
        explanation: `customer_id 99 is missing from customers — order 2 is orphaned.`,
      },
      {
        input: `All order customer_ids exist in customers`,
        output: `Empty result set`,
        explanation: `No orphan orders when every customer_id matches.`,
      },
    ],
    constraints: [
      `Use LEFT JOIN or NOT EXISTS pattern.`,
      `Return only order_id and customer_id columns.`,
    ],
    followUp: `How would you count orphan orders per day if orders had order_date?`,
  },

  "second-highest-salary": {
    description: `HR analytics needs the **second highest** distinct salary among active employees.

Using table \`employees\` (\`employee_id\`, \`full_name\`, \`salary\`, \`status\`), return \`full_name\` and \`salary\` for every active employee whose salary equals the second highest distinct salary among active employees.

If fewer than two distinct salaries exist among active employees, return no rows.`,
    examples: [
      {
        input: `employees (active):
+-------------+-----------+--------+
| employee_id | full_name | salary |
+-------------+-----------+--------+
| 1           | Alice     | 100    |
| 2           | Bob       | 90     |
| 3           | Carol     | 80     |
+-------------+-----------+--------+`,
        output: `+-----------+--------+
| full_name | salary |
+-----------+--------+
| Bob       | 90     |
+-----------+--------+`,
        explanation: `Distinct salaries: 100, 90, 80. Second highest is 90.`,
      },
      {
        input: `employees (active):
+-------------+-----------+--------+
| employee_id | full_name | salary |
+-------------+-----------+--------+
| 1           | Alice     | 100    |
+-------------+-----------+--------+`,
        output: `Empty result`,
        explanation: `Only one distinct salary — no second highest.`,
      },
    ],
    constraints: [
      `Consider status = 'active' only.`,
      `Use DISTINCT salary when finding ranks.`,
    ],
  },

  "customer-order-total": {
    description: `Finance wants lifetime order value per customer from the \`orders\` fact table.

Return \`customer_id\` and \`total_spent\` — the sum of \`amount\` for each customer. Sort by \`customer_id\` ascending.`,
    examples: [
      {
        input: `orders:
+----------+-------------+--------+
| order_id | customer_id | amount |
+----------+-------------+--------+
| 1        | 10          | 100    |
| 2        | 10          | 50     |
| 3        | 20          | 200    |
+----------+-------------+--------+`,
        output: `+-------------+-------------+
| customer_id | total_spent |
+-------------+-------------+
| 10          | 150         |
| 20          | 200         |
+-------------+-------------+`,
        explanation: `Customer 10: 100+50=150. Customer 20: 200.`,
      },
      {
        input: `orders:
+----------+-------------+--------+
| order_id | customer_id | amount |
+----------+-------------+--------+
| 1        | 5           | 75     |
+----------+-------------+--------+`,
        output: `+-------------+-------------+
| customer_id | total_spent |
+-------------+-------------+
| 5           | 75          |
+-------------+-------------+`,
        explanation: `Single customer with one order.`,
      },
    ],
    constraints: [
      `Use GROUP BY customer_id.`,
      `Column alias must be total_spent.`,
    ],
  },

  "null-safe-product-name": {
    description: `Product dimension rows sometimes arrive with missing names from upstream ETL. Reporting should never show blank product labels.

From table \`products\` (\`product_id\`, \`product_name\`), return \`product_id\` and \`display_name\`, where \`display_name\` is \`product_name\` when present, otherwise the literal **'Unknown'**.`,
    examples: [
      {
        input: `products:
+------------+--------------+
| product_id | product_name |
+------------+--------------+
| 1          | Widget       |
| 2          | NULL         |
+------------+--------------+`,
        output: `+------------+--------------+
| product_id | display_name |
+------------+--------------+
| 1          | Widget       |
| 2          | Unknown      |
+------------+--------------+`,
        explanation: `COALESCE replaces NULL name with 'Unknown'.`,
      },
      {
        input: `products:
+------------+--------------+
| product_id | product_name |
+------------+--------------+
| 3          | Gadget       |
+------------+--------------+`,
        output: `+------------+--------------+
| product_id | display_name |
+------------+--------------+
| 3          | Gadget       |
+------------+--------------+`,
        explanation: `Non-null names pass through unchanged.`,
      },
    ],
    constraints: [
      `Use COALESCE or IFNULL.`,
      `Output column must be named display_name.`,
    ],
  },

  "day-over-day-revenue": {
    description: `Executive dashboards track day-over-day revenue change. Using \`daily_revenue\` (\`order_date\`, \`amount\`), return:

- \`order_date\`
- \`amount\` — revenue that day
- \`prev_amount\` — previous day's amount (NULL for the first date)
- \`delta\` — \`amount - prev_amount\` (NULL when prev_amount is NULL)

Order by \`order_date\` ascending.`,
    examples: [
      {
        input: `daily_revenue:
+------------+--------+
| order_date | amount |
+------------+--------+
| 2024-01-01 | 100    |
| 2024-01-02 | 150    |
| 2024-01-03 | 120    |
+------------+--------+`,
        output: `+------------+--------+-------------+-------+
| order_date | amount | prev_amount | delta |
+------------+--------+-------------+-------+
| 2024-01-01 | 100    | NULL        | NULL  |
| 2024-01-02 | 150    | 100         | 50    |
| 2024-01-03 | 120    | 150         | -30   |
+------------+--------+-------------+-------+`,
        explanation: `LAG(amount) supplies previous day; delta is the difference.`,
      },
      {
        input: `Single row in daily_revenue`,
        output: `One row with prev_amount and delta NULL`,
        explanation: `First row has no prior day.`,
      },
    ],
    constraints: [
      `Use LAG window function ordered by order_date.`,
      `First row must have NULL prev_amount and delta.`,
    ],
    followUp: `How would you compute percent change instead of absolute delta?`,
  },

  "session-first-event": {
    description: `Funnel analysis starts at the first event in each session. From \`click_events\` (\`session_id\`, \`user_id\`, \`event_time\`), return the **earliest** event per \`session_id\`.

Output columns: \`session_id\`, \`user_id\`, \`event_time\`.`,
    examples: [
      {
        input: `click_events:
+------------+---------+---------------------+
| session_id | user_id | event_time          |
+------------+---------+---------------------+
| s1         | 1       | 2024-01-01 10:00:00 |
| s1         | 1       | 2024-01-01 10:05:00 |
| s2         | 2       | 2024-01-01 11:00:00 |
+------------+---------+---------------------+`,
        output: `+------------+---------+---------------------+
| session_id | user_id | event_time          |
+------------+---------+---------------------+
| s1         | 1       | 2024-01-01 10:00:00 |
| s2         | 2       | 2024-01-01 11:00:00 |
+------------+---------+---------------------+`,
        explanation: `For session s1, 10:00:00 is earlier than 10:05:00.`,
      },
      {
        input: `One row per session_id`,
        output: `Same rows returned`,
        explanation: `No duplicate sessions — each session contributes one row.`,
      },
    ],
    constraints: [
      `One row per session_id.`,
      `Use ROW_NUMBER or MIN(event_time) with GROUP BY.`,
    ],
  },

  "sum-csv-amount-column": {
    examples: [
      {
        input: `text = "id,amount\\n1,10\\n2,5"`,
        output: `15`,
        explanation: `Two data rows: 10 + 5 = 15.`,
      },
      {
        input: `text = "id,amount\\n1,4\\n2,6\\n3,0"`,
        output: `10`,
        explanation: `4 + 6 + 0 = 10.`,
      },
    ],
    constraints: [
      `Header includes an amount column (case-sensitive name).`,
      `Use Python standard library only.`,
      `Amount values are non-negative integers.`,
    ],
  },

  "dedupe-records-by-id": {
    description: `Downstream systems expect at most one record per \`id\`. You are given a list of dictionaries representing rows that may contain duplicate \`id\` values.

Return a new list with duplicates removed. When multiple rows share the same \`id\`, **the last occurrence in the input list wins** (later rows overwrite earlier ones). Preserve the relative order of the final unique ids as they first appear in the deduplicated result.`,
    functionSignature: `def dedupe_by_id(rows: list[dict]) -> list[dict]:`,
    examples: [
      {
        input: `rows = [{"id": 1, "v": "a"}, {"id": 2, "v": "b"}, {"id": 1, "v": "c"}]`,
        output: `[{"id": 1, "v": "c"}, {"id": 2, "v": "b"}]`,
        explanation: `The second row with id=1 replaces the first; id=2 appears once.`,
      },
      {
        input: `rows = [{"id": 5, "x": 1}, {"id": 5, "x": 2}]`,
        output: `[{"id": 5, "x": 2}]`,
        explanation: `Only the last id=5 row is kept.`,
      },
    ],
    constraints: [
      `1 <= len(rows) <= 10^5`,
      `Each dict contains an id key with hashable values.`,
    ],
  },

  "parse-event-json": {
    description: `Streaming events arrive as JSON strings. Implement a helper that parses the payload and returns the integer \`user_id\` field.

The JSON is always valid and always contains \`user_id\` as an integer.`,
    functionSignature: `def extract_user_id(payload: str) -> int:`,
    examples: [
      {
        input: `payload = '{"user_id": 42, "event": "click"}'`,
        output: `42`,
        explanation: `Parse JSON and read user_id.`,
      },
      {
        input: `payload = '{"user_id": 0, "session": "abc"}'`,
        output: `0`,
        explanation: `user_id may be zero.`,
      },
    ],
    constraints: [
      `Valid JSON with integer user_id key.`,
      `Standard library only (json module).`,
    ],
  },

  "moving-average-window": {
    description: `Time-series dashboards often show a simple moving average over a fixed window. Given a list of numeric samples and window size \`k\`, compute the average of each contiguous subarray of length \`k\`.

Return a list of length \`len(nums) - k + 1\`, where element \`i\` is the average of \`nums[i..i+k-1]\`.`,
    functionSignature: `def moving_average(nums: list[float], k: int) -> list[float]:`,
    examples: [
      {
        input: `nums = [1, 2, 3, 4], k = 2`,
        output: `[1.5, 2.5, 3.5]`,
        explanation: `Windows: (1+2)/2=1.5, (2+3)/2=2.5, (3+4)/2=3.5.`,
      },
      {
        input: `nums = [10, 20, 30], k = 3`,
        output: `[20.0]`,
        explanation: `Single window: (10+20+30)/3 = 20.`,
      },
    ],
    constraints: [
      `1 <= k <= len(nums) <= 10^4`,
      `Return floating-point averages.`,
    ],
  },

  "partition-files-by-date": {
    description: `Data lake writes use Hive-style partition paths. Given a date string in \`YYYY-MM-DD\` format, return the partition path:

\`year=YYYY/month=MM/day=DD\`

Month and day must be **zero-padded to two digits**.`,
    functionSignature: `def partition_path(date_str: str) -> str:`,
    examples: [
      {
        input: `date_str = "2024-03-05"`,
        output: `"year=2024/month=03/day=05"`,
        explanation: `March → month=03, day → 05.`,
      },
      {
        input: `date_str = "2024-12-01"`,
        output: `"year=2024/month=12/day=01"`,
        explanation: `December and day 01 are zero-padded.`,
      },
    ],
    constraints: [
      `date_str is a valid ISO date (YYYY-MM-DD).`,
      `Do not use external date libraries unless in standard library.`,
    ],
  },

  "filter-active-users": {
    description: `You are given a PySpark DataFrame \`df\` representing user profiles with at least columns \`user_id\` and \`status\`. Some rows have \`status = 'inactive'\` and should be excluded from downstream reporting.

Filter \`df\` to **active users only** (\`status == 'active'\`) and assign the result to a variable named \`active\`.`,
    examples: [
      {
        input: `df:
+---------+----------+
| user_id | status   |
+---------+----------+
| 1       | active   |
| 2       | inactive |
| 3       | active   |
+---------+----------+`,
        output: `active:
+---------+--------+
| user_id | status |
+---------+--------+
| 1       | active |
| 3       | active |
+---------+--------+`,
        explanation: `User 2 is filtered out because status is inactive.`,
      },
      {
        input: `df with all rows status = 'active'`,
        output: `active contains every row from df`,
        explanation: `No rows removed when everyone is active.`,
      },
    ],
    constraints: [
      `Use DataFrame API only (no raw SQL).`,
      `Result variable must be named active.`,
    ],
  },

  "daily-event-count": {
    description: `Product analytics needs daily event volume from a raw event log DataFrame \`df\` with columns \`event_date\` and \`event_id\`.

Group by \`event_date\` and count events per day. Assign the aggregated DataFrame to \`daily\` with columns \`event_date\` and \`count\` (or Spark's default count column name).`,
    examples: [
      {
        input: `df:
+------------+----------+
| event_date | event_id |
+------------+----------+
| 2024-01-01 | e1       |
| 2024-01-01 | e2       |
| 2024-01-02 | e3       |
+------------+----------+`,
        output: `daily:
+------------+-----+
| event_date | count|
+------------+-----+
| 2024-01-01 | 2   |
| 2024-01-02 | 1   |
+------------+-----+`,
        explanation: `Two events on Jan 1, one on Jan 2.`,
      },
      {
        input: `df:
+------------+----------+
| event_date | event_id |
+------------+----------+
| 2024-03-01 | e1       |
+------------+----------+`,
        output: `daily:
+------------+-----+
| event_date | count|
+------------+-----+
| 2024-03-01 | 1   |
+------------+-----+`,
        explanation: `Single event yields count of 1.`,
      },
    ],
    constraints: [
      `Use groupBy on event_date.`,
      `Variable name: daily`,
    ],
  },

  "join-orders-customers": {
    description: `Build an enriched order dataset by joining two DataFrames:

- \`orders\`: \`order_id\`, \`customer_id\`, \`amount\`
- \`customers\`: \`customer_id\`, \`name\`, \`region\`

Perform an **inner join** on \`customer_id\` so only orders with a matching customer are kept. Assign the result to \`joined\`.`,
    examples: [
      {
        input: `orders: (1, c1, 100), (2, c2, 50)
customers: (c1, Alice, US)`,
        output: `joined has one row: order 1 with Alice, US`,
        explanation: `Order 2 has customer c2 with no match — dropped by inner join.`,
      },
      {
        input: `Both orders match customers`,
        output: `All matching order + customer columns appear in joined`,
        explanation: `Standard inner join semantics on customer_id.`,
      },
    ],
    constraints: [
      `Join key: customer_id`,
      `Join type: inner`,
      `Variable name: joined`,
    ],
  },

  "dedupe-with-window": {
    description: `Event logs may contain duplicate \`user_id\` rows from retries. Keep **one row per user_id** — the row with the **earliest** \`event_time\`.

Use a window function (\`row_number\` over \`partitionBy("user_id").orderBy("event_time")\`) and filter to rank 1. Assign the result to \`deduped\`.`,
    examples: [
      {
        input: `df:
+---------+---------------------+
| user_id | event_time          |
+---------+---------------------+
| 1       | 2024-01-01 10:00:00 |
| 1       | 2024-01-01 10:05:00 |
| 2       | 2024-01-01 11:00:00 |
+---------+---------------------+`,
        output: `deduped keeps user 1 at 10:00:00 and user 2 at 11:00:00`,
        explanation: `Earlier event_time wins for user 1.`,
      },
      {
        input: `df with unique user_id per row`,
        output: `deduped identical to df`,
        explanation: `No duplicates means no rows dropped.`,
      },
    ],
    constraints: [
      `Use Window and row_number — not dropDuplicates alone.`,
      `Variable name: deduped`,
    ],
    followUp: `How would you keep the latest event per user instead?`,
  },

  "repartition-before-write": {
    description: `Before writing a large DataFrame to object storage, you want exactly **8 output files** to balance parallelism and small-file overhead.

Take DataFrame \`df\` and repartition it to 8 partitions. Assign the repartitioned DataFrame to \`out\`.`,
    examples: [
      {
        input: `df with 200 partitions`,
        output: `out.rdd.getNumPartitions() == 8`,
        explanation: `repartition(8) reshuffles to eight partitions.`,
      },
      {
        input: `df already has 8 partitions`,
        output: `out still has 8 partitions (may reshuffle)`,
        explanation: `repartition(8) targets eight partitions regardless of current count.`,
      },
    ],
    constraints: [
      `Use repartition(8), not coalesce(8).`,
      `Variable name: out`,
    ],
    followUp: `When is coalesce preferable to repartition before a write?`,
  },

  "cache-reused-df": {
    description: `A pipeline runs two actions on the same transformed DataFrame \`df\` (for example, \`count()\` and \`write\`). Without caching, Spark recomputes the lineage for each action.

Cache \`df\` in memory (or memory+disk per Spark defaults) and assign to \`cached\` so subsequent actions reuse the materialized data.`,
    examples: [
      {
        input: `df used in count() then write.parquet(...)`,
        output: `cached = df.cache() before both actions`,
        explanation: `Second action reads from cache instead of recomputing upstream transforms.`,
      },
      {
        input: `df used once after cache()`,
        output: `cached materialized; single action still benefits on re-read`,
        explanation: `Cache persists until unpersist or session ends.`,
      },
    ],
    constraints: [
      `Use .cache() on the DataFrame.`,
      `Variable name: cached`,
    ],
    followUp: `When should you use persist(StorageLevel.DISK_ONLY) instead?`,
  },

  "pair-sum-target": {
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice. Return the answer in any order.`,
    functionSignature: `def pair_sum_target(nums: list[int], target: int) -> list[int]:`,
    examples: [
      {
        input: `nums = [2, 7, 11, 15], target = 9`,
        output: `[0, 1]`,
        explanation: `nums[0] + nums[1] = 2 + 7 = 9.`,
      },
      {
        input: `nums = [3, 2, 4], target = 6`,
        output: `[1, 2]`,
        explanation: `nums[1] + nums[2] = 2 + 4 = 6.`,
      },
    ],
    constraints: [
      `2 <= len(nums) <= 10^4`,
      `-10^9 <= nums[i], target <= 10^9`,
      `Exactly one valid pair exists.`,
    ],
  },

  "has-duplicate": {
    description: `Given an integer array \`nums\`, return \`True\` if any value appears **at least twice** in the array, or \`False\` if every element is distinct.`,
    functionSignature: `def has_duplicate(nums: list[int]) -> bool:`,
    examples: [
      {
        input: `nums = [1, 2, 3, 1]`,
        output: `True`,
        explanation: `1 appears at indices 0 and 3.`,
      },
      {
        input: `nums = [1, 2, 3, 4]`,
        output: `False`,
        explanation: `All elements are distinct.`,
      },
    ],
    constraints: [
      `1 <= len(nums) <= 10^5`,
      `-10^9 <= nums[i] <= 10^9`,
    ],
  },

  "top-k-frequent": {
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.`,
    functionSignature: `def top_k_frequent(nums: list[int], k: int) -> list[int]:`,
    examples: [
      {
        input: `nums = [1, 1, 1, 2, 2, 3], k = 2`,
        output: `[1, 2]`,
        explanation: `1 appears 3 times, 2 appears 2 times; 3 appears once.`,
      },
      {
        input: `nums = [1], k = 1`,
        output: `[1]`,
        explanation: `Single element is the only frequent one.`,
      },
    ],
    constraints: [
      `1 <= len(nums) <= 10^5`,
      `1 <= k <= number of distinct elements in nums`,
    ],
  },

  "merge-intervals": {
    description: `Given an array of intervals where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

Two intervals \`[a, b]\` and \`[c, d]\` overlap if \`a <= d\` and \`c <= b\`. Return the merged list sorted by start time.`,
    functionSignature: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:`,
    examples: [
      {
        input: `intervals = [[1, 3], [2, 6], [8, 10]]`,
        output: `[[1, 6], [8, 10]]`,
        explanation: `[1,3] and [2,6] overlap → merge to [1,6]. [8,10] is separate.`,
      },
      {
        input: `intervals = [[1, 4], [4, 5]]`,
        output: `[[1, 5]]`,
        explanation: `Intervals that touch at 4 are merged.`,
      },
    ],
    constraints: [
      `0 <= len(intervals) <= 10^4`,
      `intervals[i].length == 2`,
      `0 <= start_i <= end_i <= 10^4`,
    ],
  },

  "binary-search-index": {
    description: `Given a **sorted** array of distinct integers \`nums\` and a \`target\` value, return the index of \`target\` if it is in \`nums\`, or \`-1\` otherwise.

You must write an algorithm with **O(log n)** runtime complexity.`,
    functionSignature: `def binary_search_index(nums: list[int], target: int) -> int:`,
    examples: [
      {
        input: `nums = [-1, 0, 3, 5, 9, 12], target = 9`,
        output: `4`,
        explanation: `9 exists at index 4.`,
      },
      {
        input: `nums = [-1, 0, 3, 5, 9, 12], target = 2`,
        output: `-1`,
        explanation: `2 is not in the array.`,
      },
    ],
    constraints: [
      `1 <= len(nums) <= 10^4`,
      `nums is sorted in ascending order`,
      `All values in nums are distinct`,
      `-10^4 <= nums[i], target <= 10^4`,
    ],
  },
};

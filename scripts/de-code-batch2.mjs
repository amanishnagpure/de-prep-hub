/** Additional DE Code problems + rich hints. Merged by seed-de-code.mjs */

export const BATCH2_CONTENT = {
  "distinct-active-users": {
    description: `Marketing reports **unique reach** from raw event logs. Duplicate rows for the same user on the same day should still count that user once.

Table \`events\`:

| Column    | Type | Description   |
|-----------|------|---------------|
| user_id   | int  | User identifier |
| event_date| date | Event day     |

Return a single row with column \`unique_users\` — the count of **distinct** \`user_id\` values in \`events\`.`,
    examples: [
      {
        input: `events:
+---------+------------+
| user_id | event_date |
+---------+------------+
| 1       | 2024-01-01 |
| 1       | 2024-01-01 |
| 2       | 2024-01-02 |
+---------+------------+`,
        output: `+---------------+
| unique_users  |
+---------------+
| 2             |
+---------------+`,
        explanation: `user_id 1 appears twice but counts once; users 1 and 2 → 2 unique users.`,
      },
      {
        input: `events:
+---------+------------+
| user_id | event_date |
+---------+------------+
| 9       | 2024-03-01 |
+---------+------------+`,
        output: `unique_users = 1`,
        explanation: `Single user in the table.`,
      },
    ],
    constraints: [`Use COUNT(DISTINCT user_id).`, `Output column name: unique_users`],
  },

  "order-tier-label": {
    description: `Finance classifies orders into spend tiers for reporting. Using table \`orders\` (\`order_id\`, \`amount\`), return:

- \`order_id\`
- \`tier\` — \`'high'\` when \`amount >= 100\`, otherwise \`'low'\``,
    examples: [
      {
        input: `orders:
+----------+--------+
| order_id | amount |
+----------+--------+
| 1        | 150    |
| 2        | 50     |
+----------+--------+`,
        output: `+----------+------+
| order_id | tier |
+----------+------+
| 1        | high |
| 2        | low  |
+----------+------+`,
        explanation: `150 meets the high threshold; 50 is low.`,
      },
      {
        input: `orders:
+----------+--------+
| order_id | amount |
+----------+--------+
| 3        | 100    |
+----------+--------+`,
        output: `tier = high`,
        explanation: `Amount exactly 100 is still high (>= 100).`,
      },
    ],
    constraints: [`Use CASE WHEN expression.`, `Tier values must be lowercase high or low.`],
  },

  "manager-direct-reports": {
    description: `Org analytics lists each employee alongside their manager's name. Table \`employees\` includes \`employee_id\`, \`full_name\`, and \`manager_id\` (NULL for executives).

Return \`employee\` (employee full name) and \`manager\` (manager full name) for rows where \`manager_id\` is not NULL.`,
    examples: [
      {
        input: `employees:
+-------------+-----------+------------+
| employee_id | full_name | manager_id |
+-------------+-----------+------------+
| 1           | CEO       | NULL       |
| 2           | Alice     | 1          |
| 3           | Bob       | 1          |
+-------------+-----------+------------+`,
        output: `+----------+---------+
| employee | manager |
+----------+---------+
| Alice    | CEO     |
| Bob      | CEO     |
+----------+---------+`,
        explanation: `Self-join employees on manager_id = employee_id.`,
      },
      {
        input: `Only CEO row with NULL manager_id`,
        output: `Empty result`,
        explanation: `No rows where manager_id IS NOT NULL.`,
      },
    ],
    constraints: [`Self-join employees table.`, `Exclude rows with NULL manager_id.`],
    followUp: `How would you include employees without managers as manager = 'None'?`,
  },

  "top-3-revenue-days": {
    description: `Leadership reviews the highest-revenue days from \`daily_revenue\` (\`order_date\`, \`amount\`).

Return the **top 3** days by \`amount\` descending. Include \`order_date\` and \`amount\`. Break ties by \`order_date\` ascending.`,
    examples: [
      {
        input: `daily_revenue:
+------------+--------+
| order_date | amount |
+------------+--------+
| 2024-01-01 | 100    |
| 2024-01-02 | 200    |
| 2024-01-03 | 150    |
| 2024-01-04 | 300    |
+------------+--------+`,
        output: `Top 3: (2024-01-04, 300), (2024-01-02, 200), (2024-01-03, 150)`,
        explanation: `ORDER BY amount DESC LIMIT 3.`,
      },
      {
        input: `Fewer than 3 rows in table`,
        output: `Return all rows sorted by amount DESC`,
        explanation: `LIMIT 3 returns fewer rows when table is small.`,
      },
    ],
    constraints: [`Use ORDER BY amount DESC`, `LIMIT 3`],
  },

  "percent-of-total-revenue": {
    description: `Each day's revenue should be shown as a **share of total** revenue across all days in \`daily_revenue\`.

Return \`order_date\`, \`amount\`, and \`pct_of_total\` where \`pct_of_total\` = \`amount / SUM(amount) OVER ()\`. Order by \`order_date\`.`,
    examples: [
      {
        input: `daily_revenue:
+------------+--------+
| order_date | amount |
+------------+--------+
| 2024-01-01 | 100    |
| 2024-01-02 | 300    |
+------------+--------+`,
        output: `+------------+--------+----------------+
| order_date | amount | pct_of_total   |
+------------+--------+----------------+
| 2024-01-01 | 100    | 0.25           |
| 2024-01-02 | 300    | 0.75           |
+------------+--------+----------------+`,
        explanation: `Total is 400. Day 1 is 100/400 = 0.25.`,
      },
      {
        input: `Single day amount 50`,
        output: `pct_of_total = 1.0`,
        explanation: `One row represents 100% of total.`,
      },
    ],
    constraints: [
      `Use window SUM(amount) OVER () as denominator.`,
      `Cast to REAL for decimal division in SQLite.`,
    ],
  },

  "union-event-sources": {
    description: `Web and mobile clickstreams land in separate tables with identical schemas. Analytics needs a **combined** event stream.

Tables \`web_events\` and \`mobile_events\`: (\`user_id\`, \`event_type\`).

Return all rows from both sources using \`UNION ALL\`. Column order: \`user_id\`, \`event_type\`, \`source\` where \`source\` is \`'web'\` or \`'mobile'\`.`,
    examples: [
      {
        input: `web_events: (1, click)
mobile_events: (2, view)`,
        output: `(1, click, web) and (2, view, mobile)`,
        explanation: `UNION ALL both selects with literal source label.`,
      },
      {
        input: `Empty mobile_events, one web row`,
        output: `Only web row with source = web`,
        explanation: `UNION ALL preserves duplicates and empty sides.`,
      },
    ],
    constraints: [
      `Use UNION ALL (not UNION).`,
      `Add source column via string literal in each branch.`,
    ],
    followUp: `When would UNION (distinct) be safer than UNION ALL?`,
  },

  "customers-with-orders": {
    description: `CRM wants customers who have placed at least one order.

Using \`customers\` (\`customer_id\`, \`name\`) and \`orders\` (\`order_id\`, \`customer_id\`, \`amount\`), return distinct \`customer_id\` and \`name\` for customers with ≥1 order.`,
    examples: [
      {
        input: `customers: (10, Ada), (20, Bob)
orders: (1, 10, 100)`,
        output: `(10, Ada) only`,
        explanation: `Bob has no orders.`,
      },
      {
        input: `Customer with two orders`,
        output: `One row for that customer (DISTINCT)`,
        explanation: `Multiple orders still yield one customer row.`,
      },
    ],
    constraints: [`Use INNER JOIN or EXISTS.`, `Return distinct customers only.`],
  },

  "hire-date-filter": {
    description: `Recruiting tracks recent hires. From \`employees\` (\`employee_id\`, \`full_name\`, \`hire_date\`, \`status\`), return \`employee_id\` and \`full_name\` for **active** employees hired on or after \`2024-01-01\`.`,
    examples: [
      {
        input: `employees:
+-------------+-----------+------------+----------+
| employee_id | full_name | hire_date  | status   |
+-------------+-----------+------------+----------+
| 1           | Alice     | 2024-06-01 | active   |
| 2           | Bob       | 2023-01-01 | active   |
| 3           | Carol     | 2024-02-01 | inactive |
+-------------+-----------+------------+----------+`,
        output: `(1, Alice) only`,
        explanation: `Bob hired before cutoff; Carol inactive.`,
      },
      {
        input: `No active hires after 2024-01-01`,
        output: `Empty result`,
        explanation: `Both date and status filters must pass.`,
      },
    ],
    constraints: [
      `hire_date >= '2024-01-01'`,
      `status = 'active'`,
    ],
  },

  "product-revenue-rank": {
    description: `Merchandising ranks products by revenue. Aggregate \`order_lines\` (\`product_id\`, \`amount\`) to revenue per product, then assign \`rank\` using \`RANK() OVER (ORDER BY revenue DESC)\`.

Return \`product_id\`, \`revenue\`, and \`rank\`.`,
    examples: [
      {
        input: `order_lines:
+------------+--------+
| product_id | amount |
+------------+--------+
| A          | 100    |
| A          | 50     |
| B          | 80     |
+------------+--------+`,
        output: `A revenue 150 rank 1; B revenue 80 rank 2`,
        explanation: `SUM amount by product_id, then window RANK.`,
      },
      {
        input: `Two products tie on revenue`,
        output: `Both get rank 1; next rank is 3 (standard RANK)`,
        explanation: `RANK skips after ties.`,
      },
    ],
    constraints: [`GROUP BY product_id first.`, `Use RANK() window function.`],
  },

  "null-email-default": {
    description: `Email campaigns require a sendable address. From \`customers\` (\`customer_id\`, \`email\`), return \`customer_id\` and \`contact_email\` where missing emails become \`'no-email@unknown.com'\`.`,
    examples: [
      {
        input: `customers:
+-------------+-------+
| customer_id | email |
+-------------+-------+
| 1           | a@x.com |
| 2           | NULL  |
+-------------+-------+`,
        output: `(1, a@x.com), (2, no-email@unknown.com)`,
        explanation: `COALESCE replaces NULL.`,
      },
      {
        input: `All emails present`,
        output: `contact_email equals email`,
        explanation: `COALESCE passes through non-null values.`,
      },
    ],
    constraints: [`Use COALESCE(email, 'no-email@unknown.com').`, `Alias: contact_email`],
  },

  "chunk-list": {
    description: `Batch ETL often processes fixed-size chunks. Split list \`items\` into sublists of at most \`size\` elements (last chunk may be smaller).

Return a list of lists preserving order.`,
    functionSignature: `def chunk_list(items: list, size: int) -> list[list]:`,
    examples: [
      { input: `items = [1, 2, 3, 4, 5], size = 2`, output: `[[1, 2], [3, 4], [5]]`, explanation: `Two full chunks plus remainder.` },
      { input: `items = [], size = 3`, output: `[]`, explanation: `Empty input → empty output.` },
    ],
    constraints: [`1 <= size <= 10^4`, `0 <= len(items) <= 10^5`],
  },

  "flatten-one-level": {
    description: `Semi-structured records nest list fields one level deep. Flatten \`nested\` — a list of lists — into a single list preserving left-to-right order.`,
    functionSignature: `def flatten_one_level(nested: list[list]) -> list:`,
    examples: [
      { input: `[[1, 2], [3], []]`, output: `[1, 2, 3]`, explanation: `Concatenate inner lists in order.` },
      { input: `[]`, output: `[]`, explanation: `Empty outer list.` },
    ],
    constraints: [`Inner lists contain hashable elements.`, `Standard library only.`],
  },

  "parse-log-level": {
    description: `Log lines follow \`LEVEL: message\` where LEVEL is uppercase (INFO, WARN, ERROR). Return the level string before the first colon.`,
    functionSignature: `def parse_log_level(line: str) -> str:`,
    examples: [
      { input: `"INFO: job started"`, output: `"INFO"`, explanation: `Split on first colon.` },
      { input: `"ERROR: connection failed"`, output: `"ERROR"`, explanation: `Return level token only.` },
    ],
    constraints: [`Line always contains exactly one colon separator after level.`],
  },

  "rows-above-threshold": {
    description: `Quality rules flag metric rows above a limit. Given \`rows\` (list of dicts with key \`value\`) and integer \`threshold\`, return dicts where \`value > threshold\` preserving order.`,
    functionSignature: `def rows_above_threshold(rows: list[dict], threshold: int) -> list[dict]:`,
    examples: [
      { input: `rows=[{"id":1,"value":10},{"id":2,"value":3}], threshold=5`, output: `[{"id":1,"value":10}]`, explanation: `Only 10 > 5.` },
      { input: `threshold=100 on empty list`, output: `[]`, explanation: `No rows pass.` },
    ],
    constraints: [`Each dict has integer value key.`],
  },

  "select-column-projection": {
    description: `Reduce wide tables before export. From DataFrame \`df\`, select only columns \`user_id\` and \`event_type\`. Assign to \`projected\`.`,
    examples: [
      { input: `df has extra columns amount, ts`, output: `projected has only user_id, event_type`, explanation: `Use select on column names.` },
      { input: `df already has only those columns`, output: `projected same schema`, explanation: `Projection is idempotent.` },
    ],
    constraints: [`Variable name: projected`, `Use .select()`],
  },

  "drop-duplicates-by-key": {
    description: `Retry logic duplicates \`user_id\` rows in \`df\`. Keep one row per \`user_id\` using \`dropDuplicates\` on that key. Assign to \`unique_users\`.`,
    examples: [
      { input: `Two rows user_id=1`, output: `one row for user_id 1`, explanation: `dropDuplicates(['user_id']).` },
      { input: `All user_ids unique`, output: `same row count`, explanation: `Nothing removed.` },
    ],
    constraints: [`Use dropDuplicates with subset user_id.`, `Variable: unique_users`],
  },

  "sum-amount-by-region": {
    description: `Regional sales rollup: group DataFrame \`sales\` (\`region\`, \`amount\`) by \`region\` and sum \`amount\`. Assign to \`by_region\`.`,
    examples: [
      { input: `US: 10, 20; EU: 5`, output: `US total 30, EU total 5`, explanation: `groupBy region, sum amount.` },
      { input: `Single region`, output: `one aggregated row`, explanation: `One group.` },
    ],
    constraints: [`Variable name: by_region`, `Use groupBy + sum`],
  },

  "sort-events-desc": {
    description: `Debug views show newest events first. Sort \`df\` by \`event_time\` descending. Assign to \`sorted_df\`.`,
    examples: [
      { input: `times 10:00, 11:00, 09:00`, output: `11:00, 10:00, 09:00`, explanation: `orderBy event_time descending.` },
      { input: `Single row`, output: `unchanged order`, explanation: `Sort of one row.` },
    ],
    constraints: [`Variable: sorted_df`, `Use orderBy with descending`],
  },

  "valid-parentheses": {
    description: `Pipeline config strings use nested brackets. Given string \`s\` containing only \`(\`, \`)\`, \`[\`, \`]\`, \`{\`, \`}\`, return \`True\` if brackets are valid and properly closed.`,
    functionSignature: `def valid_parentheses(s: str) -> bool:`,
    examples: [
      { input: `s = "()"`, output: `True`, explanation: `Simple pair.` },
      { input: `s = "(]"`, output: `False`, explanation: `Mismatched bracket types.` },
    ],
    constraints: [`0 <= len(s) <= 10^4`],
  },

  "max-subarray-sum": {
    description: `Anomaly detection scans for the contiguous subarray with the largest sum (Kadane's algorithm). Return that maximum sum for integer list \`nums\`.`,
    functionSignature: `def max_subarray_sum(nums: list[int]) -> int:`,
    examples: [
      { input: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`, output: `6`, explanation: `Subarray [4,-1,2,1] sums to 6.` },
      { input: `nums = [1]`, output: `1`, explanation: `Single element.` },
    ],
    constraints: [`1 <= len(nums) <= 10^5`, `At least one element in nums`],
  },

  "reverse-words": {
    description: `Log message cleanup reverses word order in a string (words separated by single spaces, no leading/trailing spaces). Return the reversed sentence.`,
    functionSignature: `def reverse_words(s: str) -> str:`,
    examples: [
      { input: `s = "hello world"`, output: `"world hello"`, explanation: `Swap word order.` },
      { input: `s = "a"`, output: `"a"`, explanation: `Single word unchanged.` },
    ],
    constraints: [`1 <= len(s) <= 10^4`, `Words separated by single space`],
  },
};

export const BATCH2_HINTS = {
  "filter-active-employees": [
    "Combine filters with **AND** in the WHERE clause.",
    "Select only the two columns asked for — avoid SELECT *.",
  ],
  "department-headcount": [
    "Filter \`status = 'active'\` **before** GROUP BY.",
    "Use \`COUNT(*)\` or \`COUNT(employee_id)\` aliased as \`headcount\`.",
  ],
  "top-salary-per-department": [
    "Window functions: \`RANK() OVER (PARTITION BY department ORDER BY salary DESC)\`.",
    "Filter \`rk = 1\` in an outer query to keep top earners including ties.",
  ],
  "monthly-revenue-trend": [
    "SQLite: \`strftime('%Y-%m', order_date)\` for month bucket.",
    "GROUP BY month and SUM(amount); ORDER BY month.",
  ],
  "dedupe-click-events": [
    "Partition by (\`user_id\`, \`event_type\`, \`session_id\`) — all three keys.",
    "\`ROW_NUMBER() ... ORDER BY event_time\` then filter \`rn = 1\`.",
  ],
  "running-revenue-total": [
    "Use \`SUM(amount) OVER (ORDER BY order_date)\` for running total.",
    "Keep \`ORDER BY order_date\` in outer query for readable output.",
  ],
  "distinct-active-users": [
    "\`COUNT(DISTINCT user_id)\` — do not count rows.",
    "Alias the result column \`unique_users\`.",
  ],
  "order-tier-label": [
    "\`CASE WHEN amount >= 100 THEN 'high' ELSE 'low' END\`",
    "Boundary: 100 is **high** (>= not >).",
  ],
  "manager-direct-reports": [
    "Self-join: \`employees e JOIN employees m ON e.manager_id = m.employee_id\`.",
    "Add \`WHERE e.manager_id IS NOT NULL\` to skip executives.",
  ],
  "union-event-sources": [
    "Two SELECTs with literal \`'web'\` / \`'mobile'\` as \`source\`, combined with **UNION ALL**.",
    "Column lists must match in both branches.",
  ],
  "chunk-list": [
    "Slice with \`range(0, len(items), size)\` and list comprehension.",
    "Handle \`size <= 0\` only if you add validation — tests use positive size.",
  ],
  "valid-parentheses": [
    "Use a stack: push opening brackets, pop on matching close.",
    "Return False if stack non-empty at end or mismatch on pop.",
  ],
  "max-subarray-sum": [
    "Track \`current_sum\` and \`best\`; reset current when it goes negative (Kadane).",
    "Initialize \`best\` to first element or negative infinity pattern.",
  ],
  "select-column-projection": [
    "\`projected = df.select('user_id', 'event_type')\`",
    "Or pass a list: \`.select(['user_id', 'event_type'])\`",
  ],
};

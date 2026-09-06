/** Batch 3 — SQL toward 50 + extra hints */

const lc = (description, examples, constraints, extra = {}) => ({
  description,
  examples,
  constraints,
  ...extra,
});

export const BATCH3_CONTENT = {
  "average-order-value": lc(
    `Customer success tracks **average order value (AOV)** per account.

Table \`orders\`: \`customer_id\`, \`amount\`.

Return \`customer_id\` and \`avg_order_value\` (average of \`amount\` per customer). Order by \`customer_id\`.`,
    [
      { input: `orders: (10,100), (10,200), (20,50)`, output: `(10, 150.0), (20, 50.0)`, explanation: `Customer 10: (100+200)/2 = 150.` },
      { input: `Single order for customer 5 amount 75`, output: `avg_order_value = 75`, explanation: `One order → average equals that amount.` },
    ],
    [`Use AVG(amount) with GROUP BY customer_id.`, `Alias: avg_order_value`]
  ),

  "first-order-per-customer": lc(
    `Lifecycle marketing needs each customer's **first purchase date**.

From \`orders\` (\`customer_id\`, \`order_date\`), return \`customer_id\` and \`first_order_date\` (minimum \`order_date\`). Sort by \`customer_id\`.`,
    [
      { input: `customer 10 orders on 2024-01-05 and 2024-02-01`, output: `first_order_date = 2024-01-05`, explanation: `MIN(order_date) per customer.` },
      { input: `One order per customer`, output: `first_order_date equals that order's date`, explanation: `MIN of one value.` },
    ],
    [`GROUP BY customer_id`, `Use MIN(order_date)`]
  ),

  "duplicate-email-addresses": lc(
    `CRM data quality flags emails registered to multiple accounts.

From \`customers\` (\`customer_id\`, \`email\`), return \`email\` and \`account_count\` for emails appearing **more than once**. Ignore NULL emails.`,
    [
      { input: `a@x.com on ids 1,2; b@y.com on id 3`, output: `a@x.com account_count 2`, explanation: `Only duplicate email returned.` },
      { input: `All emails unique`, output: `Empty result`, explanation: `HAVING COUNT(*) > 1 filters none.` },
    ],
    [`WHERE email IS NOT NULL`, `GROUP BY email HAVING COUNT(*) > 1`]
  ),

  "revenue-by-region": lc(
    `Regional sales dashboard aggregates order revenue by customer region.

Join \`orders\` to \`customers\` on \`customer_id\`. Return \`region\` and \`revenue\` (SUM of \`amount\`).`,
    [
      { input: `US customer orders 100+50; EU customer order 200`, output: `US 150, EU 200`, explanation: `SUM amount grouped by region.` },
      { input: `Two US customers`, output: `Single US row with combined revenue`, explanation: `GROUP BY merges same region.` },
    ],
    [`INNER JOIN on customer_id`, `Alias revenue for SUM(amount)`]
  ),

  "products-never-ordered": lc(
    `Catalog cleanup finds products with **zero** order history.

Tables \`products\` (\`product_id\`, \`product_name\`) and \`order_lines\` (\`product_id\`, \`amount\`).

Return \`product_id\` and \`product_name\` for products with no matching \`order_lines\` row.`,
    [
      { input: `Product A ordered; Product B never ordered`, output: `Only Product B`, explanation: `LEFT JOIN + WHERE order_lines.product_id IS NULL.` },
      { input: `All products have orders`, output: `Empty`, explanation: `No anti-join matches.` },
    ],
    [`Use LEFT JOIN anti-join pattern.`],
    { followUp: `How does NOT EXISTS compare for performance?` }
  ),

  "recent-active-users": lc(
    `Engagement metrics count users active in the **last 7 calendar days** relative to the max \`event_date\` in \`events\`.

Return \`active_user_id\` — distinct \`user_id\` where \`event_date\` >= max_date - 6 days (7-day window including max day).`,
    [
      { input: `Max date 2024-01-10; users on 2024-01-09 and 2024-01-01`, output: `Only user from 2024-01-09 if within 7 days of max`, explanation: `Filter relative to MAX(event_date).` },
      { input: `All events on same max date`, output: `Those users included`, explanation: `Window includes max day.` },
    ],
    [`SQLite: date((SELECT MAX(event_date) FROM events), '-6 days')`, `SELECT DISTINCT user_id`]
  ),

  "order-count-by-status": lc(
    `Operations monitors order pipeline volume by status.

Table \`orders\` includes \`status\` (\`pending\`, \`shipped\`, etc.). Return \`status\` and \`order_count\`.`,
    [
      { input: `2 pending, 3 shipped`, output: `pending 2, shipped 3`, explanation: `GROUP BY status, COUNT(*).` },
      { input: `Single status only`, output: `One row`, explanation: `One group.` },
    ],
    [`COUNT(*) aliased order_count`]
  ),

  "salary-band-count": lc(
    `HR buckets active employees by salary band:

- \`low\`: salary < 70000
- \`mid\`: 70000 <= salary < 90000  
- \`high\`: salary >= 90000

Return \`band\` and \`headcount\` for **active** employees only.`,
    [
      { input: `Active: 60k, 80k, 100k salaries`, output: `low 1, mid 1, high 1`, explanation: `CASE WHEN in subquery then GROUP BY band.` },
      { input: `All active same band`, output: `Single band row`, explanation: `One bucket.` },
    ],
    [`Filter status = 'active'`, `Use nested CASE expression`]
  ),

  "email-domain-extract": lc(
    `Marketing segments users by email domain. From \`customers\` (\`customer_id\`, \`email\`), return \`customer_id\` and \`domain\` — substring **after** \`@\`. Skip NULL emails.`,
    [
      { input: `a@company.com`, output: `domain = company.com`, explanation: `SUBSTR after INSTR for '@'.` },
      { input: `NULL email row`, output: `Excluded`, explanation: `WHERE email IS NOT NULL.` },
    ],
    [`SQLite: SUBSTR(email, INSTR(email, '@') + 1)`]
  ),

  "rolling-3-day-average": lc(
    `Smooth daily metrics with a **3-day rolling average** of revenue.

From \`daily_revenue\` (\`order_date\`, \`amount\`), return \`order_date\`, \`amount\`, and \`rolling_avg\` using a window of the current row and **2 preceding rows** ordered by date.`,
    [
      { input: `3 days amounts 10, 20, 30`, output: `Day3 rolling_avg = 20`, explanation: `(10+20+30)/3 = 20.` },
      { input: `First day only`, output: `rolling_avg = amount (partial window)`, explanation: `Window shrinks at start.` },
    ],
    [`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`, `ORDER BY order_date in OVER clause`]
  ),

  "dedupe-staging-rows": lc(
    `Staging table \`staging\` has duplicate \`value\` rows with different \`id\`. Keep the row with the **smallest id** per \`value\`.

Return \`id\` and \`value\` for deduplicated rows.`,
    [
      { input: `ids 1,2 value 'A'; id 3 value 'B'`, output: `id 1 (A) and id 3 (B)`, explanation: `ROW_NUMBER partition by value order by id.` },
      { input: `All values unique`, output: `All rows kept`, explanation: `rn always 1.` },
    ],
    [`ROW_NUMBER() OVER (PARTITION BY value ORDER BY id)`, `Filter rn = 1`]
  ),

  "customers-missing-email": lc(
    `Compliance export lists accounts missing email addresses.

From \`customers\` (\`customer_id\`, \`name\`, \`email\`), return \`customer_id\` and \`name\` where \`email\` IS NULL.`,
    [
      { input: `Customer 2 email NULL`, output: `Row for customer 2`, explanation: `IS NULL filter.` },
      { input: `All emails populated`, output: `Empty`, explanation: `No NULLs.` },
    ],
    [`Do not return email column.`]
  ),

  "total-revenue": lc(
    `Executive KPI tile shows **total revenue** across all orders in one number.

Return single column \`total_revenue\` — SUM of \`amount\` from \`orders\`.`,
    [
      { input: `orders amounts 10, 20, 30`, output: `total_revenue = 60`, explanation: `Single aggregate row.` },
      { input: `No orders (empty table)`, output: `NULL or 0 per SQL engine`, explanation: `SUM of empty set is NULL in SQL.` },
    ],
    [`One-row result`, `SUM(amount) AS total_revenue`]
  ),

  "rank-orders-per-customer": lc(
    `Identify each customer's largest order. Assign \`rn\` = row number per \`customer_id\` ordered by \`amount\` DESC.

Return \`order_id\`, \`customer_id\`, \`amount\`, \`rn\` from \`orders\`.`,
    [
      { input: `Customer 10 orders 50 and 100`, output: `100 gets rn=1, 50 gets rn=2`, explanation: `ROW_NUMBER partition by customer.` },
      { input: `Tied amounts same customer`, output: `Deterministic tie-break by ORDER BY`, explanation: `ROW_NUMBER breaks ties arbitrarily.` },
    ],
    [`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC)`],
    { followUp: `Use RANK() if ties should share rn.` }
  ),

  "union-daily-snapshots": lc(
    `Two batch snapshots \`snapshot_a\` and \`snapshot_b\` share schema (\`metric_date\`, \`value\`). Combine into one timeline with \`source\` column \`'a'\` or \`'b'\`.`,
    [
      { input: `snapshot_a: (2024-01-01, 10); snapshot_b: (2024-01-02, 5)`, output: `Two rows with sources a and b`, explanation: `UNION ALL with literal source labels.` },
      { input: `One snapshot empty`, output: `Rows from non-empty snapshot only`, explanation: `UNION ALL preserves all rows.` },
    ],
    [`UNION ALL two SELECTs`, `Add source literal per branch`]
  ),

  "orders-above-average": lc(
    `Flag high-value orders: return \`order_id\` and \`amount\` for orders where \`amount\` is **strictly greater than** the average \`amount\` across all orders.`,
    [
      { input: `amounts 10, 20, 30 avg=20`, output: `order_id for amount 30`, explanation: `Compare to scalar subquery AVG.` },
      { input: `All amounts equal`, output: `Empty (none strictly above avg)`, explanation: `> not >=.` },
    ],
    [`Subquery: SELECT AVG(amount) FROM orders`, `Filter amount > average`]
  ),

  "warehouse-low-stock": lc(
    `Inventory alerts list products where \`stock_qty\` is below \`reorder_level\`.

Return \`product_id\`, \`product_name\`, \`stock_qty\`, \`reorder_level\` from \`products\`.`,
    [
      { input: `Widget stock 5 reorder 10`, output: `Widget row included`, explanation: `5 < 10.` },
      { input: `Stock equals reorder_level`, output: `Excluded (not below)`, explanation: `Strictly less than.` },
    ],
    [`WHERE stock_qty < reorder_level`]
  ),

  "funnel-step-counts": lc(
    `Product funnel counts **distinct users** per \`event_type\` in \`events\` (\`user_id\`, \`event_type\`).

Return \`event_type\` and \`user_count\`.`,
    [
      { input: `2 users click, 1 views`, output: `click 2, view 1`, explanation: `COUNT(DISTINCT user_id) per type.` },
      { input: `Same user two click events`, output: `click user_count 1`, explanation: `Distinct users.` },
    ],
    [`GROUP BY event_type`]
  ),

  "data-freshness-timestamp": lc(
    `Pipeline SLA monitors table freshness. Return \`latest_update\` — the MAX \`updated_at\` from \`ingestion_log\` (\`table_name\`, \`updated_at\`).`,
    [
      { input: `updates 2024-01-01, 2024-01-03`, output: `latest_update = 2024-01-03`, explanation: `MAX(updated_at).` },
      { input: `Single row`, output: `That timestamp`, explanation: `MAX of one value.` },
    ],
    [`Single-row aggregate`, `Column alias latest_update`]
  ),

  "active-pct-headcount": lc(
    `Workforce KPI: percent of employees who are active.

Return \`active_pct\` = (count active / count all) as a decimal from \`employees\` (\`status\`). Single row.`,
    [
      { input: `3 active, 1 inactive`, output: `active_pct = 0.75`, explanation: `3/4 = 0.75; cast to REAL.` },
      { input: `All active`, output: `1.0`, explanation: `100% active.` },
    ],
    [`CAST counts as REAL for division`, `One output column active_pct`]
  ),

  "running-order-count": lc(
    `Ops tracks cumulative orders shipped over time. From \`orders\` (\`order_date\`), return \`order_date\` and \`running_count\` — count of orders from the first date through each day (use window COUNT).`,
    [
      { input: `3 orders across 2 dates`, output: `running_count increases`, explanation: `COUNT(*) OVER (ORDER BY order_date).` },
      { input: `One order`, output: `running_count = 1`, explanation: `Single row window.` },
    ],
    [`ORDER BY order_date in window`, `Alias running_count`]
  ),

  "exclude-cancelled-orders": lc(
    `Revenue reporting excludes cancelled orders. Return all columns from \`orders\` where \`status\` is **not** \`'cancelled'\`.`,
    [
      { input: `pending + cancelled rows`, output: `Only pending`, explanation: `WHERE status != 'cancelled'.` },
      { input: `No cancelled`, output: `All rows`, explanation: `Filter passes all.` },
    ],
    [`Use <> or != for cancelled status`]
  ),

  "extract-order-year": lc(
    `Annual rollup prep extracts year from \`order_date\`. Return \`order_year\` and \`total_amount\` — sum of \`amount\` grouped by year (YYYY).`,
    [
      { input: `2023 and 2024 orders`, output: `Two year rows`, explanation: `strftime('%Y', order_date) group by.` },
      { input: `Same year only`, output: `One row`, explanation: `Single group.` },
    ],
    [`SQLite strftime for year bucket`]
  ),

  "count-null-emails": lc(
    `Data quality scorecard counts missing emails. Return \`missing_email_count\` — number of rows in \`customers\` where \`email\` IS NULL.`,
    [
      { input: `2 NULL emails, 3 populated`, output: `missing_email_count = 2`, explanation: `SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END).` },
      { input: `No NULLs`, output: `0`, explanation: `Zero nulls.` },
    ],
    [`Single aggregate row`]
  ),

  "january-revenue": lc(
    `Seasonal analysis isolates January revenue. Return \`total_january_revenue\` — SUM(\`amount\`) where month of \`order_date\` is January (month 01).`,
    [
      { input: `Jan orders 100+50, Feb 200`, output: `150`, explanation: `Filter month = 01 only.` },
      { input: `No January orders`, output: `NULL or 0`, explanation: `Empty filter.` },
    ],
    [`strftime('%m', order_date) = '01'`]
  ),

  "employees-without-manager": lc(
    `Executive roster lists top-level leaders with no manager assigned.

From \`employees\` (\`employee_id\`, \`full_name\`, \`manager_id\`), return \`employee_id\` and \`full_name\` where \`manager_id\` IS NULL.`,
    [
      { input: `CEO manager_id NULL; Alice reports to CEO`, output: `CEO row only`, explanation: `IS NULL filter.` },
      { input: `Everyone has manager_id set`, output: `Empty`, explanation: `No executives without manager.` },
    ],
    [`WHERE manager_id IS NULL`]
  ),

  "parse-json-array-length": {
    description: `API payloads store JSON arrays as strings. Return the number of elements in the JSON array \`payload\` (always a JSON array of primitives).`,
    functionSignature: `def json_array_length(payload: str) -> int:`,
    examples: [
      { input: `'[1, 2, 3]'`, output: `3`, explanation: `json.loads then len.` },
      { input: `'[]'`, output: `0`, explanation: `Empty array.` },
    ],
    constraints: [`Valid JSON array string.`, `Standard library json module.`],
  },

  "slugify-column-name": {
    description: `Normalize messy column headers to snake_case slugs: lowercase, spaces → underscores, strip non-alphanumeric except underscore.`,
    functionSignature: `def slugify_column(name: str) -> str:`,
    examples: [
      { input: `"Order Date"`, output: `"order_date"`, explanation: `Lowercase and replace space.` },
      { input: `"Revenue ($)"`, output: `"revenue"`, explanation: `Strip punctuation; lowercase with underscores.` },
    ],
    constraints: [`Input non-empty string.`],
  },

  "longest-increasing-subsequence-length": {
    description: `Metric anomaly pipelines track longest increasing run in a series. Return the length of the **longest strictly increasing subsequence** in \`nums\` (not necessarily contiguous). Classic O(n log n) or O(n²) acceptable.`,
    functionSignature: `def lis_length(nums: list[int]) -> int:`,
    examples: [
      { input: `[10, 9, 2, 5, 3, 7, 101, 18]`, output: `4`, explanation: `LIS [2,3,7,18] length 4.` },
      { input: `[1]`, output: `1`, explanation: `Single element.` },
    ],
    constraints: [`1 <= len(nums) <= 5000`],
  },

  "groupby-multiple-keys": {
    description: `Aggregate \`df\` (\`region\`, \`category\`, \`amount\`) by **both** \`region\` and \`category\`, summing \`amount\`. Assign to \`rollup\`.`,
    examples: [
      { input: `US-Electronics 10, US-Electronics 5, US-Books 3`, output: `US-Electronics sum 15`, explanation: `groupBy region, category.` },
      { input: `Single group key combo`, output: `One row`, explanation: `One aggregate.` },
    ],
    constraints: [`Variable: rollup`, `sum('amount')`],
  },

  "withcolumn-derived": {
    description: `Add computed column \`amount_usd\` = \`amount\` * \`fx_rate\` to \`df\` using \`withColumn\`. Assign result to \`enriched\`.`,
    examples: [
      { input: `amount 100 fx_rate 1.2`, output: `amount_usd 120`, explanation: `withColumn multiply.` },
      { input: `fx_rate 1.0`, output: `amount_usd equals amount`, explanation: `Identity rate.` },
    ],
    constraints: [`Variable name: enriched`],
  },
};

export const BATCH3_HINTS = {
  "average-order-value": ["`GROUP BY customer_id`", "Use `AVG(amount)` — result is per-customer average"],
  "products-never-ordered": ["LEFT JOIN order_lines ON product_id", "Keep rows WHERE order_lines.product_id IS NULL"],
  "orders-above-average": ["Scalar subquery `(SELECT AVG(amount) FROM orders)`", "Strict inequality: amount **>** average"],
  "rolling-3-day-average": ["`AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`"],
  "recent-active-users": ["Find max date first, then filter `event_date >= date(max, '-6 days')`"],
  "rank-orders-per-customer": ["`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC)`"],
  "parse-json-array-length": ["`len(json.loads(payload))`"],
  "longest-increasing-subsequence-length": ["Patience sorting or O(n²) DP on indices", "Strictly increasing: use `<` not `<=`"],
};

import { DEFAULT_CHALLENGE_LIMITS, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const SQL_REFERENCE = `WITH cfg AS (
  SELECT as_of_date FROM pipeline_config LIMIT 1
),
deduped_current AS (
  SELECT customer_id, name, city
  FROM (
    SELECT customer_id, name, city,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY name, city) AS rn
    FROM customers_current
  ) t WHERE rn = 1
),
active_dim AS (
  SELECT customer_id, name, city, effective_from, effective_to, current_flag
  FROM customers_previous
  WHERE current_flag = 1
),
changes AS (
  SELECT dc.customer_id, dc.name, dc.city, cfg.as_of_date
  FROM deduped_current dc
  CROSS JOIN cfg
  LEFT JOIN active_dim ad ON dc.customer_id = ad.customer_id
  WHERE ad.customer_id IS NULL
     OR IFNULL(dc.name, '') != IFNULL(ad.name, '')
     OR IFNULL(dc.city, '') != IFNULL(ad.city, '')
),
history AS (
  SELECT customer_id, name, city, effective_from, effective_to, current_flag
  FROM customers_previous
  WHERE current_flag = 0
),
expired AS (
  SELECT p.customer_id, p.name, p.city, p.effective_from, cfg.as_of_date AS effective_to, 0 AS current_flag
  FROM customers_previous p
  CROSS JOIN cfg
  INNER JOIN changes c ON p.customer_id = c.customer_id
  WHERE p.current_flag = 1
),
unchanged_active AS (
  SELECT p.customer_id, p.name, p.city, p.effective_from, p.effective_to, p.current_flag
  FROM customers_previous p
  WHERE p.current_flag = 1
    AND p.customer_id NOT IN (SELECT customer_id FROM changes)
),
new_rows AS (
  SELECT c.customer_id, c.name, c.city, c.as_of_date AS effective_from, NULL AS effective_to, 1 AS current_flag
  FROM changes c
)
SELECT customer_id, name, city, effective_from, effective_to, current_flag FROM history
UNION ALL
SELECT customer_id, name, city, effective_from, effective_to, current_flag FROM expired
UNION ALL
SELECT customer_id, name, city, effective_from, effective_to, current_flag FROM unchanged_active
UNION ALL
SELECT customer_id, name, city, effective_from, effective_to, current_flag FROM new_rows;`;

const PYSPARK_REFERENCE = `as_of = pipeline_config.collect()[0]["as_of_date"]

cw = Window.partitionBy("customer_id").orderBy("name", "city")
current = (
    customers_current
    .withColumn("_rn", row_number().over(cw))
    .filter(col("_rn") == 1)
    .drop("_rn")
)

active = customers_previous.filter(col("current_flag") == 1)

changed = current.alias("c").join(active.alias("a"), "customer_id", "left").filter(
    col("a.customer_id").isNull()
    | (F.coalesce(col("c.name"), F.lit("")) != F.coalesce(col("a.name"), F.lit("")))
    | (F.coalesce(col("c.city"), F.lit("")) != F.coalesce(col("a.city"), F.lit("")))
).select(col("c.customer_id").alias("customer_id"))

history = customers_previous.filter(col("current_flag") == 0).select(
    col("customer_id").cast("int"),
    col("name").cast("string"),
    col("city").cast("string"),
    col("effective_from").cast("string"),
    col("effective_to").cast("string"),
    col("current_flag").cast("int"),
)

expired = active.join(changed, "customer_id").select(
    col("customer_id").cast("int"),
    col("name").cast("string"),
    col("city").cast("string"),
    col("effective_from").cast("string"),
    F.lit(as_of).cast("string").alias("effective_to"),
    F.lit(0).cast("int").alias("current_flag"),
)

unchanged_active = active.join(changed, "customer_id", "left_anti").select(
    col("customer_id").cast("int"),
    col("name").cast("string"),
    col("city").cast("string"),
    col("effective_from").cast("string"),
    col("effective_to").cast("string"),
    col("current_flag").cast("int"),
)

new_rows = current.join(changed, "customer_id").select(
    col("customer_id").cast("int"),
    col("name").cast("string"),
    col("city").cast("string"),
    F.lit(as_of).cast("string").alias("effective_from"),
    F.lit(None).cast("string").alias("effective_to"),
    F.lit(1).cast("int").alias("current_flag"),
)

customer_dimension = history.unionByName(expired).unionByName(unchanged_active).unionByName(new_rows)`;

const FIXTURES = [
  {
    id: "public",
    label: "Attribute change (city update)",
    isHidden: false,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-02" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [{ customer_id: 101, name: "Alice", city: "Bangalore" }],
    },
  },
  {
    id: "hidden-new-customer",
    label: "New customer",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-01" }],
      customers_previous: [],
      customers_current: [{ customer_id: 102, name: "Bob", city: "Delhi" }],
    },
  },
  {
    id: "hidden-no-change",
    label: "No attribute change",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-02" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [{ customer_id: 101, name: "Alice", city: "Chennai" }],
    },
  },
  {
    id: "hidden-multiple-changes",
    label: "Mixed new, changed, unchanged",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-03" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
        {
          customer_id: 102,
          name: "Bob",
          city: "Delhi",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [
        { customer_id: 101, name: "Alice", city: "Bangalore" },
        { customer_id: 102, name: "Bob", city: "Delhi" },
        { customer_id: 103, name: "Carol", city: "Mumbai" },
      ],
    },
  },
  {
    id: "hidden-duplicate-source",
    label: "Duplicate source records",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-02" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [
        { customer_id: 101, name: "Alice", city: "Bangalore" },
        { customer_id: 101, name: "Alice", city: "Bangalore" },
      ],
    },
  },
  {
    id: "hidden-null-attribute",
    label: "NULL attribute in source",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-02" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [{ customer_id: 101, name: "Alice", city: null }],
    },
  },
  {
    id: "hidden-multiple-customers",
    label: "Historical rows preserved",
    isHidden: true,
    tables: {
      pipeline_config: [{ as_of_date: "2026-01-02" }],
      customers_previous: [
        {
          customer_id: 101,
          name: "Alice",
          city: "Mumbai",
          effective_from: "2025-12-01",
          effective_to: "2026-01-01",
          current_flag: 0,
        },
        {
          customer_id: 101,
          name: "Alice",
          city: "Chennai",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
        {
          customer_id: 102,
          name: "Bob",
          city: "Delhi",
          effective_from: "2026-01-01",
          effective_to: null,
          current_flag: 1,
        },
      ],
      customers_current: [
        { customer_id: 101, name: "Alice", city: "Bangalore" },
        { customer_id: 102, name: "Bob", city: "Delhi" },
      ],
    },
  },
];

const SQL_TABLES = [
  {
    label: "pipeline_config",
    description: "Batch load metadata",
    columns: [{ name: "as_of_date", type: "TEXT" }],
  },
  {
    label: "customers_previous",
    description: "Existing SCD Type 2 dimension",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
      { name: "effective_from", type: "TEXT" },
      { name: "effective_to", type: "TEXT" },
      { name: "current_flag", type: "INT" },
    ],
  },
  {
    label: "customers_current",
    description: "Today's customer source snapshot",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
    ],
  },
];

export default {
  outputTable: "customer_dimension",
  resultVar: "customer_dimension",
  pyspark: {
    referenceCode: PYSPARK_REFERENCE,
    fixtures: FIXTURES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 120000 },
  },
  sql: {
    referenceQuery: SQL_REFERENCE,
    fixtures: sqlFixturesFromPyspark(FIXTURES),
    tables: SQL_TABLES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 120000 },
  },
  adversarial: {
    pyspark: `# Missing expire step — overwrites dimension with source only
customer_dimension = customers_current.select(
    col("customer_id"),
    col("name"),
    col("city"),
    F.lit("2026-01-01").alias("effective_from"),
    F.lit(None).cast("string").alias("effective_to"),
    F.lit(1).alias("current_flag"),
)`,
    sql: `SELECT customer_id, name, city, '2026-01-01' AS effective_from, NULL AS effective_to, 1 AS current_flag FROM customers_current`,
  },
};

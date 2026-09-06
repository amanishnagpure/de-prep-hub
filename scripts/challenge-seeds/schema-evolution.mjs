import { DEFAULT_CHALLENGE_LIMITS, fx, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const SQL_REFERENCE = `SELECT
  CAST(customer_id AS INTEGER) AS customer_id,
  TRIM(name) AS name,
  TRIM(city) AS city,
  NULL AS email
FROM customer_events_v1
UNION ALL
SELECT
  CAST(customer_id AS INTEGER) AS customer_id,
  TRIM(name) AS name,
  TRIM(city) AS city,
  email
FROM customer_events_v2;`;

const PYSPARK_REFERENCE = `v1_norm = customer_events_v1.select(
    col("customer_id").cast("int"),
    F.trim(col("name")).alias("name"),
    F.trim(col("city")).alias("city"),
    F.lit(None).cast("string").alias("email"),
)

v2_norm = customer_events_v2.select(
    col("customer_id").cast("int"),
    F.trim(col("name")).alias("name"),
    F.trim(col("city")).alias("city"),
    col("email").cast("string"),
)

customer_events_normalized = v1_norm.unionByName(v2_norm)`;

const ADVERSARIAL_SQL = `SELECT customer_id, name, city, NULL AS email FROM customer_events_v1
UNION ALL
SELECT customer_id, city AS name, name AS city, NULL AS email FROM customer_events_v2;`;

const ADVERSARIAL_PYSPARK = `v1e = customer_events_v1.withColumn("email", F.lit(None).cast("string"))
v2_pos = customer_events_v2.select(
    col("customer_id"),
    col("city"),
    col("name"),
    F.lit(None).cast("string").alias("email"),
)
customer_events_normalized = v1e.union(v2_pos)`;

const FIXTURES = [
  fx(
    "public",
    "Merge v1-only rows into canonical schema (v2 batch empty)",
    false,
    {
      customer_events_v1: [
        { customer_id: 1, name: "Alice", city: "NYC" },
        { customer_id: 2, name: "Bob", city: "LA" },
      ],
      customer_events_v2: [],
    },
    {
      purpose: "basic-normalization",
      tests: ["schema-evolution", "nullable-default"],
    }
  ),
  fx(
    "hidden-missing-new-column",
    "v1 rows without email column in source",
    true,
    {
      customer_events_v1: [
        { customer_id: 10, name: "Eve", city: "Boston" },
        { customer_id: 11, name: "Frank", city: "Denver" },
      ],
      customer_events_v2: [],
    },
    {
      purpose: "missing-new-column",
      tests: ["schema-evolution", "backward-compatibility"],
    }
  ),
  fx(
    "hidden-added-column",
    "v2 introduces populated email",
    true,
    {
      customer_events_v1: [{ customer_id: 20, name: "Grace", city: "Austin" }],
      customer_events_v2: [
        { customer_id: 21, name: "Henry", city: "Seattle", email: "henry@example.com" },
        { customer_id: 22, name: "Ivy", city: "Miami", email: "ivy@example.com" },
      ],
    },
    {
      purpose: "added-column",
      tests: ["additive-evolution", "nullable-default"],
    }
  ),
  fx(
    "hidden-reordered-columns",
    "v2 source column order differs from v1",
    true,
    {
      customer_events_v1: [{ customer_id: 30, name: "Jack", city: "Portland" }],
      customer_events_v2: [
        { customer_id: 31, name: "Kate", city: "Chicago", email: "kate@example.com" },
      ],
    },
    {
      purpose: "reordered-columns",
      tests: ["column-mapping", "schema-evolution"],
    }
  ),
  fx(
    "hidden-nullable-change",
    "Explicit NULL email in v2 vs missing column in v1",
    true,
    {
      customer_events_v1: [{ customer_id: 40, name: "Leo", city: "Dallas" }],
      customer_events_v2: [
        { customer_id: 41, name: "Mia", city: "Phoenix", email: null },
        { customer_id: 42, name: "Noah", city: "Atlanta", email: "noah@example.com" },
      ],
    },
    {
      purpose: "nullable-change",
      tests: ["null-handling", "backward-compatibility"],
    }
  ),
  fx(
    "hidden-mixed-schema",
    "Both schema versions present in one batch",
    true,
    {
      customer_events_v1: [
        { customer_id: 50, name: "Olivia", city: "Detroit" },
        { customer_id: 51, name: "Paul", city: "Minneapolis" },
      ],
      customer_events_v2: [
        { customer_id: 52, name: "Quinn", city: "San Diego", email: "quinn@example.com" },
        { customer_id: 53, name: "Rita", city: "Tampa", email: null },
      ],
    },
    {
      purpose: "mixed-schema",
      tests: ["normalization", "schema-evolution"],
    }
  ),
  fx(
    "hidden-unexpected-column",
    "v2 carries forward-incompatible phone column",
    true,
    {
      customer_events_v1: [{ customer_id: 60, name: "Sam", city: "Vegas" }],
      customer_events_v2: [
        {
          customer_id: 61,
          name: "Tina",
          city: "Orlando",
          email: "tina@example.com",
          phone: "555-0100",
        },
      ],
    },
    {
      purpose: "unexpected-column",
      tests: ["schema-enforcement", "forward-compatibility"],
    }
  ),
  fx(
    "hidden-type-compatible-change",
    "Whitespace in v1 text fields needs normalization",
    true,
    {
      customer_events_v1: [
        { customer_id: 70, name: "  Uma  ", city: "  Raleigh  " },
        { customer_id: 71, name: "Victor", city: "Columbus" },
      ],
      customer_events_v2: [
        { customer_id: 72, name: "Wendy", city: "Salt Lake", email: "wendy@example.com" },
      ],
    },
    {
      purpose: "type-compatible-change",
      tests: ["casting", "normalization"],
    }
  ),
];

const SQL_TABLES = [
  {
    label: "customer_events_v1",
    description: "Legacy customer event feed (customer_id, name, city)",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
    ],
  },
  {
    label: "customer_events_v2",
    description: "Evolved feed — adds email; may include extra columns in some batches",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
      { name: "email", type: "TEXT" },
      { name: "phone", type: "TEXT" },
    ],
  },
];

export default {
  outputTable: "customer_events_normalized",
  resultVar: "customer_events_normalized",
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
    pyspark: ADVERSARIAL_PYSPARK,
    sql: ADVERSARIAL_SQL,
  },
};

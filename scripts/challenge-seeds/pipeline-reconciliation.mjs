import { DEFAULT_CHALLENGE_LIMITS, fx, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const SQL_REFERENCE = `WITH pay AS (
  SELECT order_id, SUM(amount) AS source_amount
  FROM payments_source
  GROUP BY order_id
),
tgt AS (
  SELECT order_id, SUM(amount) AS target_amount
  FROM orders_target
  GROUP BY order_id
),
amount_mismatches AS (
  SELECT COUNT(*) AS cnt
  FROM pay p
  INNER JOIN tgt t ON p.order_id = t.order_id
  WHERE ABS(p.source_amount - t.target_amount) > 0.001
)
SELECT 'source_target_count' AS rule_id,
       'Record count reconciliation' AS rule_name,
       ABS((SELECT COUNT(*) FROM orders_source) - (SELECT COUNT(*) FROM orders_target)) AS violation_count,
       CASE WHEN (SELECT COUNT(*) FROM orders_source) = (SELECT COUNT(*) FROM orders_target) THEN 1 ELSE 0 END AS passed
UNION ALL
SELECT 'source_target_amount',
       'Total amount reconciliation',
       CASE
         WHEN ABS(
           COALESCE((SELECT SUM(amount) FROM payments_source), 0)
           - COALESCE((SELECT SUM(amount) FROM orders_target), 0)
         ) <= 0.001 THEN 0
         ELSE 1
       END,
       CASE
         WHEN ABS(
           COALESCE((SELECT SUM(amount) FROM payments_source), 0)
           - COALESCE((SELECT SUM(amount) FROM orders_target), 0)
         ) <= 0.001 THEN 1
         ELSE 0
       END
UNION ALL
SELECT 'missing_target_records',
       'Source records absent in target',
       (SELECT COUNT(*) FROM orders_source s
        WHERE NOT EXISTS (SELECT 1 FROM orders_target t WHERE t.order_id = s.order_id)),
       CASE WHEN (SELECT COUNT(*) FROM orders_source s
                  WHERE NOT EXISTS (SELECT 1 FROM orders_target t WHERE t.order_id = s.order_id)) = 0
            THEN 1 ELSE 0 END
UNION ALL
SELECT 'unexpected_target_records',
       'Target records absent in source',
       (SELECT COUNT(DISTINCT t.order_id) FROM orders_target t
        WHERE NOT EXISTS (SELECT 1 FROM orders_source s WHERE s.order_id = t.order_id)),
       CASE WHEN (SELECT COUNT(DISTINCT t.order_id) FROM orders_target t
                  WHERE NOT EXISTS (SELECT 1 FROM orders_source s WHERE s.order_id = t.order_id)) = 0
            THEN 1 ELSE 0 END
UNION ALL
SELECT 'amount_mismatch',
       'Same ID, different amount',
       (SELECT cnt FROM amount_mismatches),
       CASE WHEN (SELECT cnt FROM amount_mismatches) = 0 THEN 1 ELSE 0 END
UNION ALL
SELECT 'duplicate_target_records',
       'Duplicate business keys in target',
       (SELECT COUNT(*) - COUNT(DISTINCT order_id) FROM orders_target),
       CASE WHEN (SELECT COUNT(*) FROM orders_target)
                 = (SELECT COUNT(DISTINCT order_id) FROM orders_target)
            THEN 1 ELSE 0 END;`;

const PYSPARK_REFERENCE = `pay = payments_source.groupBy("order_id").agg(F.sum("amount").alias("source_amount"))
tgt = orders_target.groupBy("order_id").agg(F.sum("amount").alias("target_amount"))

count_v = abs(orders_source.count() - orders_target.count())

src_total = payments_source.agg(F.coalesce(F.sum("amount"), F.lit(0.0))).collect()[0][0] or 0.0
tgt_total = orders_target.agg(F.coalesce(F.sum("amount"), F.lit(0.0))).collect()[0][0] or 0.0
amount_total_v = 0 if abs(float(src_total) - float(tgt_total)) <= 0.001 else 1

missing_v = orders_source.join(orders_target.select("order_id").distinct(), "order_id", "left_anti").count()

unexpected_v = (
    orders_target.join(orders_source.select("order_id").distinct(), "order_id", "left_anti")
    .select("order_id")
    .distinct()
    .count()
)

amount_mismatch_v = (
    pay.join(tgt, "order_id")
    .filter(F.abs(col("source_amount") - col("target_amount")) > 0.001)
    .count()
)

dup_tgt_v = orders_target.count() - orders_target.select("order_id").distinct().count()

def rule_row(rule_id, rule_name, violations):
    return spark.createDataFrame(
        [(rule_id, rule_name, int(violations), 1 if violations == 0 else 0)],
        "rule_id STRING, rule_name STRING, violation_count INT, passed INT",
    )

reconciliation_results = (
    rule_row("source_target_count", "Record count reconciliation", count_v)
    .unionByName(rule_row("source_target_amount", "Total amount reconciliation", amount_total_v))
    .unionByName(rule_row("missing_target_records", "Source records absent in target", missing_v))
    .unionByName(rule_row("unexpected_target_records", "Target records absent in source", unexpected_v))
    .unionByName(rule_row("amount_mismatch", "Same ID, different amount", amount_mismatch_v))
    .unionByName(rule_row("duplicate_target_records", "Duplicate business keys in target", dup_tgt_v))
)`;

const ADVERSARIAL_SQL = `SELECT 'source_target_count' AS rule_id,
       'Record count reconciliation' AS rule_name,
       ABS((SELECT COUNT(*) FROM orders_source) - (SELECT COUNT(*) FROM orders_target)) AS violation_count,
       CASE WHEN (SELECT COUNT(*) FROM orders_source) = (SELECT COUNT(*) FROM orders_target) THEN 1 ELSE 0 END AS passed
UNION ALL
SELECT 'source_target_amount', 'Total amount reconciliation', 0, 1
UNION ALL
SELECT 'missing_target_records',
       'Source records absent in target',
       (SELECT COUNT(*) FROM orders_source s
        WHERE NOT EXISTS (SELECT 1 FROM orders_target t WHERE t.order_id = s.order_id)),
       CASE WHEN (SELECT COUNT(*) FROM orders_source s
                  WHERE NOT EXISTS (SELECT 1 FROM orders_target t WHERE t.order_id = s.order_id)) = 0
            THEN 1 ELSE 0 END
UNION ALL
SELECT 'unexpected_target_records',
       'Target records absent in source',
       (SELECT COUNT(DISTINCT t.order_id) FROM orders_target t
        WHERE NOT EXISTS (SELECT 1 FROM orders_source s WHERE s.order_id = t.order_id)),
       CASE WHEN (SELECT COUNT(DISTINCT t.order_id) FROM orders_target t
                  WHERE NOT EXISTS (SELECT 1 FROM orders_source s WHERE s.order_id = t.order_id)) = 0
            THEN 1 ELSE 0 END
UNION ALL
SELECT 'amount_mismatch', 'Same ID, different amount', 0, 1
UNION ALL
SELECT 'duplicate_target_records',
       'Duplicate business keys in target',
       (SELECT COUNT(*) - COUNT(DISTINCT order_id) FROM orders_target),
       CASE WHEN (SELECT COUNT(*) FROM orders_target)
                 = (SELECT COUNT(DISTINCT order_id) FROM orders_target)
            THEN 1 ELSE 0 END;`;

const ADVERSARIAL_PYSPARK = `count_v = abs(orders_source.count() - orders_target.count())

missing_v = orders_source.join(orders_target.select("order_id").distinct(), "order_id", "left_anti").count()

unexpected_v = (
    orders_target.join(orders_source.select("order_id").distinct(), "order_id", "left_anti")
    .select("order_id")
    .distinct()
    .count()
)

def rule_row(rule_id, rule_name, violations):
    return spark.createDataFrame(
        [(rule_id, rule_name, int(violations), 1 if violations == 0 else 0)],
        "rule_id STRING, rule_name STRING, violation_count INT, passed INT",
    )

reconciliation_results = (
    rule_row("source_target_count", "Record count reconciliation", count_v)
    .unionByName(rule_row("source_target_amount", "Total amount reconciliation", 0))
    .unionByName(rule_row("missing_target_records", "Source records absent in target", missing_v))
    .unionByName(rule_row("unexpected_target_records", "Target records absent in source", unexpected_v))
    .unionByName(rule_row("amount_mismatch", "Same ID, different amount", 0))
    .unionByName(rule_row("duplicate_target_records", "Duplicate business keys in target", 0))
)`;

const SOURCE_ORDERS = [
  { order_id: 1, customer_id: 101, status: "PAID" },
  { order_id: 2, customer_id: 102, status: "NEW" },
];

const SOURCE_PAYMENTS = [
  { payment_id: 1, order_id: 1, amount: 500 },
  { payment_id: 2, order_id: 2, amount: 200 },
];

const TARGET_ORDERS = [
  { order_id: 1, amount: 500 },
  { order_id: 2, amount: 200 },
];

const FIXTURES = [
  fx(
    "public",
    "Fully reconciled source and target",
    false,
    {
      orders_source: SOURCE_ORDERS,
      payments_source: SOURCE_PAYMENTS,
      orders_target: TARGET_ORDERS,
    },
    {
      purpose: "baseline-reconciliation",
      tests: ["reconciliation", "record-count"],
    }
  ),
  fx(
    "hidden-count-mismatch",
    "Row counts differ without a missing order_id",
    true,
    {
      orders_source: SOURCE_ORDERS,
      payments_source: SOURCE_PAYMENTS,
      orders_target: [
        { order_id: 1, amount: 500 },
        { order_id: 1, amount: 500 },
        { order_id: 2, amount: 200 },
      ],
    },
    {
      purpose: "count-mismatch",
      tests: ["record-count", "reconciliation"],
    }
  ),
  fx(
    "hidden-missing-record",
    "Source order absent from target",
    true,
    {
      orders_source: [
        ...SOURCE_ORDERS,
        { order_id: 3, customer_id: 103, status: "PAID" },
      ],
      payments_source: [
        ...SOURCE_PAYMENTS,
        { payment_id: 3, order_id: 3, amount: 150 },
      ],
      orders_target: TARGET_ORDERS,
    },
    {
      purpose: "missing-record",
      tests: ["completeness", "reconciliation"],
    }
  ),
  fx(
    "hidden-unexpected-record",
    "Target order not present in source",
    true,
    {
      orders_source: SOURCE_ORDERS,
      payments_source: SOURCE_PAYMENTS,
      orders_target: [
        ...TARGET_ORDERS,
        { order_id: 99, amount: 75 },
      ],
    },
    {
      purpose: "unexpected-record",
      tests: ["completeness", "reconciliation"],
    }
  ),
  fx(
    "hidden-amount-mismatch",
    "Matching keys with different amounts",
    true,
    {
      orders_source: SOURCE_ORDERS,
      payments_source: SOURCE_PAYMENTS,
      orders_target: [
        { order_id: 1, amount: 500 },
        { order_id: 2, amount: 250 },
      ],
    },
    {
      purpose: "amount-mismatch",
      tests: ["reconciliation", "amount-consistency"],
    }
  ),
  fx(
    "hidden-duplicate-target",
    "Duplicate order_id rows in target",
    true,
    {
      orders_source: SOURCE_ORDERS,
      payments_source: SOURCE_PAYMENTS,
      orders_target: [
        { order_id: 1, amount: 500 },
        { order_id: 1, amount: 500 },
        { order_id: 2, amount: 200 },
      ],
    },
    {
      purpose: "duplicate-target",
      tests: ["uniqueness", "reconciliation"],
    }
  ),
  fx(
    "hidden-multiple-mismatches",
    "Missing record, amount drift, and duplicate key",
    true,
    {
      orders_source: [
        ...SOURCE_ORDERS,
        { order_id: 3, customer_id: 103, status: "SHIPPED" },
      ],
      payments_source: [
        ...SOURCE_PAYMENTS,
        { payment_id: 3, order_id: 3, amount: 300 },
      ],
      orders_target: [
        { order_id: 1, amount: 500 },
        { order_id: 1, amount: 450 },
        { order_id: 2, amount: 250 },
      ],
    },
    {
      purpose: "multiple-mismatches",
      tests: ["reconciliation", "completeness", "amount-consistency"],
    }
  ),
];

const SQL_TABLES = [
  {
    label: "orders_source",
    description: "Source-system order headers (authoritative order grain)",
    columns: [
      { name: "order_id", type: "INT", key: "PK" },
      { name: "customer_id", type: "INT" },
      { name: "status", type: "TEXT" },
    ],
  },
  {
    label: "payments_source",
    description: "Source-system payments — authoritative order amounts",
    columns: [
      { name: "payment_id", type: "INT", key: "PK" },
      { name: "order_id", type: "INT" },
      { name: "amount", type: "DOUBLE" },
    ],
  },
  {
    label: "orders_target",
    description: "Downstream warehouse orders table under reconciliation",
    columns: [
      { name: "order_id", type: "INT", key: "PK" },
      { name: "amount", type: "DOUBLE" },
    ],
  },
];

export default {
  outputTable: "reconciliation_results",
  resultVar: "reconciliation_results",
  pyspark: {
    referenceCode: PYSPARK_REFERENCE,
    fixtures: FIXTURES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 90000 },
  },
  sql: {
    referenceQuery: SQL_REFERENCE,
    fixtures: sqlFixturesFromPyspark(FIXTURES),
    tables: SQL_TABLES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 90000 },
  },
  adversarial: {
    pyspark: ADVERSARIAL_PYSPARK,
    sql: ADVERSARIAL_SQL,
  },
};

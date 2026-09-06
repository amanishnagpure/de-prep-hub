import { DEFAULT_CHALLENGE_LIMITS, fx, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const ALLOWED_STATUSES = "('NEW', 'PAID', 'SHIPPED', 'CANCELLED')";

const SQL_REFERENCE = `SELECT 'null_customer_id' AS rule_id,
       'NOT NULL customer_id' AS rule_name,
       (SELECT COUNT(*) FROM customers WHERE customer_id IS NULL) AS violation_count,
       CASE WHEN (SELECT COUNT(*) FROM customers WHERE customer_id IS NULL) = 0 THEN 1 ELSE 0 END AS passed
UNION ALL
SELECT 'duplicate_customer',
       'Unique customer_id',
       (SELECT COUNT(*) - COUNT(DISTINCT customer_id) FROM customers),
       CASE WHEN (SELECT COUNT(*) FROM customers) = (SELECT COUNT(DISTINCT customer_id) FROM customers) THEN 1 ELSE 0 END
UNION ALL
SELECT 'orphan_order',
       'Referential integrity orders.customer_id',
       (SELECT COUNT(*) FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.customer_id
        WHERE o.customer_id IS NOT NULL AND c.customer_id IS NULL),
       CASE WHEN (SELECT COUNT(*) FROM orders o
                  LEFT JOIN customers c ON o.customer_id = c.customer_id
                  WHERE o.customer_id IS NOT NULL AND c.customer_id IS NULL) = 0 THEN 1 ELSE 0 END
UNION ALL
SELECT 'invalid_order_status',
       'Valid order status domain',
       (SELECT COUNT(*) FROM orders WHERE status NOT IN ${ALLOWED_STATUSES}),
       CASE WHEN (SELECT COUNT(*) FROM orders WHERE status NOT IN ${ALLOWED_STATUSES}) = 0 THEN 1 ELSE 0 END
UNION ALL
SELECT 'negative_payment',
       'Non-negative payment amount',
       (SELECT COUNT(*) FROM payments WHERE amount < 0),
       CASE WHEN (SELECT COUNT(*) FROM payments WHERE amount < 0) = 0 THEN 1 ELSE 0 END
UNION ALL
SELECT 'null_payment_order_id',
       'NOT NULL payments.order_id',
       (SELECT COUNT(*) FROM payments WHERE order_id IS NULL),
       CASE WHEN (SELECT COUNT(*) FROM payments WHERE order_id IS NULL) = 0 THEN 1 ELSE 0 END
UNION ALL
SELECT 'duplicate_payment_id',
       'Unique payment_id',
       (SELECT COUNT(*) - COUNT(DISTINCT payment_id) FROM payments),
       CASE WHEN (SELECT COUNT(*) FROM payments) = (SELECT COUNT(DISTINCT payment_id) FROM payments) THEN 1 ELSE 0 END;`;

const PYSPARK_REFERENCE = `null_customer = customers.filter(col("customer_id").isNull()).count()
dup_customer = customers.count() - customers.select("customer_id").distinct().count()
orphan_order = (
    orders.alias("o")
    .join(customers.alias("c"), col("o.customer_id") == col("c.customer_id"), "left")
    .filter(col("o.customer_id").isNotNull() & col("c.customer_id").isNull())
    .count()
)
invalid_status = orders.filter(~col("status").isin(["NEW", "PAID", "SHIPPED", "CANCELLED"])).count()
negative_payment = payments.filter(col("amount") < 0).count()
null_pay_order = payments.filter(col("order_id").isNull()).count()
dup_payment = payments.count() - payments.select("payment_id").distinct().count()

def rule_row(rule_id, rule_name, violations):
    return spark.createDataFrame(
        [(rule_id, rule_name, int(violations), 1 if violations == 0 else 0)],
        "rule_id STRING, rule_name STRING, violation_count INT, passed INT",
    )

quality_results = (
    rule_row("null_customer_id", "NOT NULL customer_id", null_customer)
    .unionByName(rule_row("duplicate_customer", "Unique customer_id", dup_customer))
    .unionByName(rule_row("orphan_order", "Referential integrity orders.customer_id", orphan_order))
    .unionByName(rule_row("invalid_order_status", "Valid order status domain", invalid_status))
    .unionByName(rule_row("negative_payment", "Non-negative payment amount", negative_payment))
    .unionByName(rule_row("null_payment_order_id", "NOT NULL payments.order_id", null_pay_order))
    .unionByName(rule_row("duplicate_payment_id", "Unique payment_id", dup_payment))
)`;

const CLEAN_CUSTOMERS = [
  { customer_id: 101, name: "Alice", email: "alice@example.com", created_date: "2026-01-01" },
  { customer_id: 102, name: "Bob", email: "bob@example.com", created_date: "2026-01-02" },
];

const CLEAN_ORDERS = [
  { order_id: 1, customer_id: 101, status: "PAID", order_date: "2026-01-05" },
  { order_id: 2, customer_id: 102, status: "NEW", order_date: "2026-01-06" },
];

const CLEAN_PAYMENTS = [
  { payment_id: 1, order_id: 1, amount: 500, payment_date: "2026-01-05" },
  { payment_id: 2, order_id: 2, amount: 200, payment_date: "2026-01-06" },
];

const FIXTURES = [
  fx(
    "public",
    "Clean dataset — all checks pass",
    false,
    {
      customers: CLEAN_CUSTOMERS,
      orders: CLEAN_ORDERS,
      payments: CLEAN_PAYMENTS,
    },
    {
      purpose: "baseline-quality-checks",
      tests: ["validation", "multi-table"],
    }
  ),
  fx(
    "hidden-null-customer-id",
    "NULL customer_id",
    true,
    {
      customers: [
        ...CLEAN_CUSTOMERS,
        { customer_id: null, name: "Ghost", email: "ghost@example.com", created_date: "2026-01-03" },
      ],
      orders: CLEAN_ORDERS,
      payments: CLEAN_PAYMENTS,
    },
    {
      purpose: "null-validation",
      tests: ["not-null"],
    }
  ),
  fx(
    "hidden-duplicate-customer",
    "Duplicate customer_id",
    true,
    {
      customers: [
        ...CLEAN_CUSTOMERS,
        { customer_id: 101, name: "Alice Duplicate", email: "dup@example.com", created_date: "2026-01-04" },
      ],
      orders: CLEAN_ORDERS,
      payments: CLEAN_PAYMENTS,
    },
    {
      purpose: "duplicate-record",
      tests: ["uniqueness", "deduplication"],
    }
  ),
  fx(
    "hidden-orphan-order",
    "Order without matching customer",
    true,
    {
      customers: CLEAN_CUSTOMERS,
      orders: [
        ...CLEAN_ORDERS,
        { order_id: 99, customer_id: 999, status: "NEW", order_date: "2026-01-07" },
      ],
      payments: CLEAN_PAYMENTS,
    },
    {
      purpose: "referential-integrity",
      tests: ["foreign-key", "referential-integrity"],
    }
  ),
  fx(
    "hidden-invalid-status",
    "Invalid order status value",
    true,
    {
      customers: CLEAN_CUSTOMERS,
      orders: [
        ...CLEAN_ORDERS,
        { order_id: 3, customer_id: 101, status: "INVALID", order_date: "2026-01-08" },
      ],
      payments: CLEAN_PAYMENTS,
    },
    {
      purpose: "domain-validation",
      tests: ["allowed-values"],
    }
  ),
  fx(
    "hidden-negative-payment",
    "Negative payment amount",
    true,
    {
      customers: CLEAN_CUSTOMERS,
      orders: CLEAN_ORDERS,
      payments: [
        ...CLEAN_PAYMENTS,
        { payment_id: 3, order_id: 1, amount: -50, payment_date: "2026-01-09" },
      ],
    },
    {
      purpose: "range-validation",
      tests: ["value-range"],
    }
  ),
];

const SQL_TABLES = [
  {
    label: "customers",
    description: "Customer master records",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "email", type: "TEXT" },
      { name: "created_date", type: "TEXT" },
    ],
  },
  {
    label: "orders",
    description: "Customer orders",
    columns: [
      { name: "order_id", type: "INT", key: "PK" },
      { name: "customer_id", type: "INT" },
      { name: "status", type: "TEXT" },
      { name: "order_date", type: "TEXT" },
    ],
  },
  {
    label: "payments",
    description: "Order payments",
    columns: [
      { name: "payment_id", type: "INT", key: "PK" },
      { name: "order_id", type: "INT" },
      { name: "amount", type: "DOUBLE" },
      { name: "payment_date", type: "TEXT" },
    ],
  },
];

export default {
  outputTable: "quality_results",
  resultVar: "quality_results",
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
    pyspark: `quality_results = spark.createDataFrame(
    [
        ("null_customer_id", "NOT NULL customer_id", 0, 1),
        ("duplicate_customer", "Unique customer_id", 0, 1),
        ("orphan_order", "Referential integrity orders.customer_id", 0, 1),
        ("invalid_order_status", "Valid order status domain", 0, 1),
        ("negative_payment", "Non-negative payment amount", 0, 1),
        ("null_payment_order_id", "NOT NULL payments.order_id", 0, 1),
        ("duplicate_payment_id", "Unique payment_id", 0, 1),
    ],
    "rule_id STRING, rule_name STRING, violation_count INT, passed INT",
)`,
    sql: `SELECT 'null_customer_id' AS rule_id, 'NOT NULL customer_id' AS rule_name, 0 AS violation_count, 1 AS passed
UNION ALL SELECT 'duplicate_customer', 'Unique customer_id', 0, 1
UNION ALL SELECT 'orphan_order', 'Referential integrity orders.customer_id', 0, 1
UNION ALL SELECT 'invalid_order_status', 'Valid order status domain', 0, 1
UNION ALL SELECT 'negative_payment', 'Non-negative payment amount', 0, 1
UNION ALL SELECT 'null_payment_order_id', 'NOT NULL payments.order_id', 0, 1
UNION ALL SELECT 'duplicate_payment_id', 'Unique payment_id', 0, 1`,
  },
};

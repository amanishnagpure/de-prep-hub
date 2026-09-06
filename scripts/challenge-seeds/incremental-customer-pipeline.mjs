import { DEFAULT_CHALLENGE_LIMITS, sqlFixturesFromPyspark } from "./_shared.mjs";

const YESTERDAY_BASE = [
  { customer_id: 101, name: "Alice", city: "Chennai" },
  { customer_id: 102, name: "Bob", city: "Bangalore" },
];

const COMPARISON = {
  schema: true,
  columnOrder: false,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const PYSPARK_REFERENCE = `cust_w = Window.partitionBy("customer_id").orderBy("name")
customers = (
    customers_today
    .withColumn("_rn", row_number().over(cust_w))
    .filter(col("_rn") == 1)
    .drop("_rn")
    .select("customer_id", "name", "city")
)

ord_w = Window.partitionBy("order_id").orderBy("order_id")
orders_dedup = (
    orders
    .withColumn("_rn", row_number().over(ord_w))
    .filter(col("_rn") == 1)
    .drop("_rn")
)

order_stats = orders_dedup.groupBy("customer_id").agg(
    F.count(F.lit(1)).alias("order_count"),
    F.coalesce(F.sum("amount"), F.lit(0.0)).alias("total_revenue"),
)

customer_daily_summary = (
    customers
    .join(order_stats, "customer_id", "left")
    .fillna(0, subset=["order_count", "total_revenue"])
)`;

const SQL_REFERENCE = `WITH deduped_customers AS (
  SELECT customer_id, name, city
  FROM (
    SELECT customer_id, name, city,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY name) AS rn
    FROM customers_today
  ) WHERE rn = 1
),
deduped_orders AS (
  SELECT order_id, customer_id, amount
  FROM (
    SELECT order_id, customer_id, amount,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_id) AS rn
    FROM orders
  ) WHERE rn = 1
),
order_stats AS (
  SELECT customer_id,
         COUNT(*) AS order_count,
         COALESCE(SUM(amount), 0) AS total_revenue
  FROM deduped_orders
  GROUP BY customer_id
)
SELECT c.customer_id, c.name, c.city,
       COALESCE(o.order_count, 0) AS order_count,
       COALESCE(o.total_revenue, 0) AS total_revenue
FROM deduped_customers c
LEFT JOIN order_stats o ON c.customer_id = o.customer_id;`;

const FIXTURES = [
  {
    id: "public",
    label: "Normal daily load",
    isHidden: false,
    tables: {
      customers_today: [
        { customer_id: 101, name: "Alice", city: "Chennai" },
        { customer_id: 102, name: "Bob", city: "Bangalore" },
        { customer_id: 103, name: "Carol", city: "Mumbai" },
      ],
      customers_yesterday: YESTERDAY_BASE,
      orders: [
        { order_id: 1, customer_id: 101, amount: 500 },
        { order_id: 2, customer_id: 101, amount: 300 },
        { order_id: 3, customer_id: 103, amount: 700 },
      ],
    },
  },
  {
    id: "hidden-duplicate-customers",
    label: "Duplicate customer rows",
    isHidden: true,
    tables: {
      customers_today: [
        { customer_id: 101, name: "Alice", city: "Chennai" },
        { customer_id: 101, name: "Alice", city: "Chennai" },
        { customer_id: 102, name: "Bob", city: "Bangalore" },
      ],
      customers_yesterday: YESTERDAY_BASE,
      orders: [{ order_id: 1, customer_id: 101, amount: 500 }],
    },
  },
  {
    id: "hidden-no-orders",
    label: "Customer without orders",
    isHidden: true,
    tables: {
      customers_today: [{ customer_id: 104, name: "Dana", city: "Delhi" }],
      customers_yesterday: [],
      orders: [],
    },
  },
  {
    id: "hidden-null-amount",
    label: "NULL order amount",
    isHidden: true,
    tables: {
      customers_today: [{ customer_id: 101, name: "Alice", city: "Chennai" }],
      customers_yesterday: [{ customer_id: 101, name: "Alice", city: "Chennai" }],
      orders: [
        { order_id: 1, customer_id: 101, amount: null },
        { order_id: 2, customer_id: 101, amount: 200 },
      ],
    },
  },
  {
    id: "hidden-duplicate-order",
    label: "Duplicate order_id",
    isHidden: true,
    tables: {
      customers_today: [{ customer_id: 101, name: "Alice", city: "Chennai" }],
      customers_yesterday: [{ customer_id: 101, name: "Alice", city: "Chennai" }],
      orders: [
        { order_id: 1, customer_id: 101, amount: 500 },
        { order_id: 1, customer_id: 101, amount: 500 },
      ],
    },
  },
];

const SQL_TABLES = [
  {
    label: "customers_today",
    description: "Today's customer master snapshot",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
    ],
  },
  {
    label: "customers_yesterday",
    description: "Yesterday's customer snapshot",
    columns: [
      { name: "customer_id", type: "INT", key: "PK" },
      { name: "name", type: "TEXT" },
      { name: "city", type: "TEXT" },
    ],
  },
  {
    label: "orders",
    description: "Order transactions",
    columns: [
      { name: "order_id", type: "INT", key: "PK" },
      { name: "customer_id", type: "INT" },
      { name: "amount", type: "DOUBLE" },
    ],
  },
];

export default {
  outputTable: "customer_daily_summary",
  resultVar: "customer_daily_summary",
  pyspark: {
    referenceCode: PYSPARK_REFERENCE,
    fixtures: FIXTURES,
    comparison: COMPARISON,
    limits: DEFAULT_CHALLENGE_LIMITS,
  },
  sql: {
    referenceQuery: SQL_REFERENCE,
    fixtures: sqlFixturesFromPyspark(FIXTURES),
    tables: SQL_TABLES,
    comparison: COMPARISON,
    limits: DEFAULT_CHALLENGE_LIMITS,
  },
  adversarial: {
    pyspark: `customer_daily_summary = customers_today.join(orders, "customer_id").groupBy("customer_id", "name", "city").agg(
    F.count("order_id").alias("order_count"),
    F.sum("amount").alias("total_revenue")
)`,
    sql: `WITH deduped_customers AS (
  SELECT customer_id, name, city FROM customers_today
),
order_stats AS (
  SELECT customer_id, COUNT(*) AS order_count, SUM(amount) AS total_revenue FROM orders GROUP BY customer_id
)
SELECT c.customer_id, c.name, c.city, COALESCE(o.order_count, 0) AS order_count, COALESCE(o.total_revenue, 0) AS total_revenue
FROM deduped_customers c INNER JOIN order_stats o ON c.customer_id = o.customer_id;`,
  },
};

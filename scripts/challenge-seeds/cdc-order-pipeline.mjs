import { DEFAULT_CHALLENGE_LIMITS, fx, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const SQL_REFERENCE = `WITH deduped_events AS (
  SELECT event_id, order_id, operation, event_timestamp, customer_id, amount, status
  FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY event_timestamp, event_id) AS rn
    FROM orders_cdc_events
  ) WHERE rn = 1
),
ordered AS (
  SELECT *,
         ROW_NUMBER() OVER (ORDER BY event_timestamp, event_id) AS seq
  FROM deduped_events
),
last_event AS (
  SELECT order_id, operation, customer_id, amount, status,
         ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY seq DESC) AS rn
  FROM ordered
),
final_event AS (
  SELECT order_id, operation, customer_id, amount, status
  FROM last_event WHERE rn = 1
),
touched AS (
  SELECT DISTINCT order_id FROM deduped_events
),
from_events AS (
  SELECT order_id, customer_id, amount, status
  FROM final_event
  WHERE operation IN ('I', 'U')
),
snapshot_remaining AS (
  SELECT s.order_id, s.customer_id, s.amount, s.status
  FROM orders_snapshot s
  WHERE s.order_id NOT IN (SELECT order_id FROM touched)
)
SELECT order_id, customer_id, amount, status FROM snapshot_remaining
UNION ALL
SELECT order_id, customer_id, amount, status FROM from_events;`;

const PYSPARK_REFERENCE = `ew = Window.partitionBy("event_id").orderBy("event_timestamp", "event_id")
deduped = (
    orders_cdc_events
    .withColumn("_rn", row_number().over(ew))
    .filter(col("_rn") == 1)
    .drop("_rn")
)

ordered = deduped.withColumn(
    "seq", row_number().over(Window.orderBy("event_timestamp", "event_id"))
)

lw = Window.partitionBy("order_id").orderBy(col("seq").desc())
last_ev = (
    ordered
    .withColumn("_rn", row_number().over(lw))
    .filter(col("_rn") == 1)
    .drop("_rn")
)

touched = deduped.select("order_id").distinct()

from_events = last_ev.filter(col("operation").isin(["I", "U"])).select(
    col("order_id").cast("int"),
    col("customer_id").cast("int"),
    col("amount").cast("double"),
    col("status").cast("string"),
)

snapshot_remaining = orders_snapshot.join(touched, "order_id", "left_anti").select(
    col("order_id").cast("int"),
    col("customer_id").cast("int"),
    col("amount").cast("double"),
    col("status").cast("string"),
)

orders_current = snapshot_remaining.unionByName(from_events)`;

const FIXTURES = [
  fx(
    "public",
    "Normal insert, update, and new order",
    false,
    {
      orders_snapshot: [
        { order_id: 1, customer_id: 101, amount: 500, status: "NEW" },
      ],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T10:00:00",
          customer_id: 101,
          amount: 600,
          status: "PAID",
        },
        {
          event_id: "e2",
          order_id: 2,
          operation: "I",
          event_timestamp: "2026-01-02T11:00:00",
          customer_id: 102,
          amount: 300,
          status: "NEW",
        },
      ],
    },
    {
      purpose: "basic-cdc-operations",
      tests: ["insert", "update", "snapshot-merge"],
    }
  ),
  fx(
    "hidden-multiple-updates",
    "Multiple updates for same order",
    true,
    {
      orders_snapshot: [{ order_id: 1, customer_id: 101, amount: 100, status: "NEW" }],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T09:00:00",
          customer_id: 101,
          amount: 200,
          status: "PAID",
        },
        {
          event_id: "e2",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T10:00:00",
          customer_id: 101,
          amount: 300,
          status: "SHIPPED",
        },
      ],
    },
    {
      purpose: "multiple-updates-same-order",
      tests: ["update", "event-ordering"],
    }
  ),
  fx(
    "hidden-delete",
    "Delete event removes order",
    true,
    {
      orders_snapshot: [{ order_id: 1, customer_id: 101, amount: 500, status: "PAID" }],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 1,
          operation: "D",
          event_timestamp: "2026-01-02T12:00:00",
          customer_id: 101,
          amount: null,
          status: null,
        },
      ],
    },
    {
      purpose: "delete-event",
      tests: ["delete", "snapshot-merge"],
    }
  ),
  fx(
    "hidden-duplicate-event",
    "Duplicate CDC event id",
    true,
    {
      orders_snapshot: [{ order_id: 1, customer_id: 101, amount: 100, status: "NEW" }],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T10:00:00",
          customer_id: 101,
          amount: 200,
          status: "PAID",
        },
        {
          event_id: "e1",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T10:00:00",
          customer_id: 101,
          amount: 999,
          status: "BAD",
        },
      ],
    },
    {
      purpose: "duplicate-cdc-event",
      tests: ["idempotency", "deduplication"],
    }
  ),
  fx(
    "hidden-out-of-order",
    "Out-of-order event timestamps",
    true,
    {
      orders_snapshot: [{ order_id: 1, customer_id: 101, amount: 100, status: "NEW" }],
      orders_cdc_events: [
        {
          event_id: "e2",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T11:00:00",
          customer_id: 101,
          amount: 300,
          status: "SHIPPED",
        },
        {
          event_id: "e1",
          order_id: 1,
          operation: "U",
          event_timestamp: "2026-01-02T09:00:00",
          customer_id: 101,
          amount: 200,
          status: "PAID",
        },
      ],
    },
    {
      purpose: "out-of-order-events",
      tests: ["event-ordering", "update"],
    }
  ),
  fx(
    "hidden-insert-update-delete",
    "Insert, update, then delete lifecycle",
    true,
    {
      orders_snapshot: [],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 5,
          operation: "I",
          event_timestamp: "2026-01-01T08:00:00",
          customer_id: 105,
          amount: 150,
          status: "NEW",
        },
        {
          event_id: "e2",
          order_id: 5,
          operation: "U",
          event_timestamp: "2026-01-01T09:00:00",
          customer_id: 105,
          amount: 175,
          status: "PAID",
        },
        {
          event_id: "e3",
          order_id: 5,
          operation: "D",
          event_timestamp: "2026-01-01T10:00:00",
          customer_id: 105,
          amount: null,
          status: null,
        },
      ],
    },
    {
      purpose: "insert-update-delete-lifecycle",
      tests: ["insert", "update", "delete"],
    }
  ),
  fx(
    "hidden-update-unseen",
    "Update for order not in snapshot",
    true,
    {
      orders_snapshot: [],
      orders_cdc_events: [
        {
          event_id: "e1",
          order_id: 9,
          operation: "U",
          event_timestamp: "2026-01-02T10:00:00",
          customer_id: 109,
          amount: 420,
          status: "PAID",
        },
      ],
    },
    {
      purpose: "update-unseen-order",
      tests: ["upsert", "update"],
    }
  ),
];

const SQL_TABLES = [
  {
    label: "orders_snapshot",
    description: "Baseline orders before applying CDC events",
    columns: [
      { name: "order_id", type: "INT", key: "PK" },
      { name: "customer_id", type: "INT" },
      { name: "amount", type: "DOUBLE" },
      { name: "status", type: "TEXT" },
    ],
  },
  {
    label: "orders_cdc_events",
    description: "Change data capture event stream (I/U/D)",
    columns: [
      { name: "event_id", type: "TEXT", key: "PK" },
      { name: "order_id", type: "INT" },
      { name: "operation", type: "TEXT" },
      { name: "event_timestamp", type: "TEXT" },
      { name: "customer_id", type: "INT" },
      { name: "amount", type: "DOUBLE" },
      { name: "status", type: "TEXT" },
    ],
  },
];

export default {
  outputTable: "orders_current",
  resultVar: "orders_current",
  pyspark: {
    referenceCode: PYSPARK_REFERENCE,
    fixtures: FIXTURES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 120000, maxFixtureCount: 8 },
  },
  sql: {
    referenceQuery: SQL_REFERENCE,
    fixtures: sqlFixturesFromPyspark(FIXTURES),
    tables: SQL_TABLES,
    comparison: COMPARISON,
    limits: { ...DEFAULT_CHALLENGE_LIMITS, timeLimitMs: 120000, maxFixtureCount: 8 },
  },
  adversarial: {
    pyspark: `orders_current = orders_snapshot.unionByName(
    orders_cdc_events.filter(col("operation").isin(["I", "U"])).select(
        "order_id", "customer_id", "amount", "status"
    )
).dropDuplicates(["order_id"])`,
    sql: `SELECT order_id, customer_id, amount, status FROM orders_snapshot
UNION
SELECT order_id, customer_id, amount, status FROM orders_cdc_events WHERE operation IN ('I', 'U')`,
  },
};

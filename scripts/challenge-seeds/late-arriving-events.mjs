import { DEFAULT_CHALLENGE_LIMITS, fx, sqlFixturesFromPyspark } from "./_shared.mjs";

const COMPARISON = {
  schema: true,
  columnOrder: true,
  rowOrder: false,
  allowExtraColumns: false,
  ignoreColumnCase: true,
};

const SQL_REFERENCE = `WITH cfg AS (
  SELECT max_lateness_minutes FROM pipeline_config LIMIT 1
),
deduped AS (
  SELECT event_id, entity_id, value, event_timestamp, processing_timestamp
  FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY event_timestamp, event_id) AS rn
    FROM events
  ) WHERE rn = 1
),
accepted AS (
  SELECT d.*
  FROM deduped d, cfg
  WHERE (julianday(d.processing_timestamp) - julianday(d.event_timestamp)) * 24 * 60
        <= cfg.max_lateness_minutes
),
ranked AS (
  SELECT entity_id, value, event_timestamp,
         ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY event_timestamp DESC, event_id DESC) AS rn
  FROM accepted
),
latest AS (
  SELECT entity_id, value, event_timestamp FROM ranked WHERE rn = 1
),
snapshot_only AS (
  SELECT s.entity_id, s.value, s.event_timestamp
  FROM state_snapshot s
  WHERE s.entity_id NOT IN (SELECT entity_id FROM latest)
)
SELECT entity_id, value, event_timestamp FROM snapshot_only
UNION ALL
SELECT entity_id, value, event_timestamp FROM latest;`;

const PYSPARK_REFERENCE = `max_lateness = pipeline_config.collect()[0]["max_lateness_minutes"]

ew = Window.partitionBy("event_id").orderBy("event_timestamp", "event_id")
deduped = (
    events.withColumn("_rn", row_number().over(ew))
    .filter(col("_rn") == 1)
    .drop("_rn")
)

accepted = deduped.filter(
    (unix_timestamp(col("processing_timestamp")) - unix_timestamp(col("event_timestamp"))) / 60.0
    <= max_lateness
)

lw = Window.partitionBy("entity_id").orderBy(col("event_timestamp").desc(), col("event_id").desc())
latest = (
    accepted.withColumn("_rn", row_number().over(lw))
    .filter(col("_rn") == 1)
    .drop("_rn")
    .select(
        col("entity_id").cast("int"),
        col("value").cast("int"),
        col("event_timestamp").cast("string"),
    )
)

snapshot_only = (
    state_snapshot.join(latest.select("entity_id"), "entity_id", "left_anti")
    .select(
        col("entity_id").cast("int"),
        col("value").cast("int"),
        col("event_timestamp").cast("string"),
    )
)

entity_state = snapshot_only.unionByName(latest)`;

const CONFIG = [{ max_lateness_minutes: 60 }];

const FIXTURES = [
  fx(
    "public",
    "In-order and out-of-order accepted events",
    false,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 1, value: 100, event_timestamp: "2026-01-01T10:00:00" }],
      events: [
        {
          event_id: "e1",
          entity_id: 1,
          value: 110,
          event_timestamp: "2026-01-01T11:00:00",
          processing_timestamp: "2026-01-01T11:05:00",
        },
        {
          event_id: "e2",
          entity_id: 1,
          value: 105,
          event_timestamp: "2026-01-01T10:30:00",
          processing_timestamp: "2026-01-01T11:10:00",
        },
      ],
    },
    {
      purpose: "event-time-merge",
      tests: ["event-time", "event-ordering"],
    }
  ),
  fx(
    "hidden-out-of-order",
    "Processing order differs from event time",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 2, value: 50, event_timestamp: "2026-01-01T08:00:00" }],
      events: [
        {
          event_id: "a",
          entity_id: 2,
          value: 80,
          event_timestamp: "2026-01-01T09:00:00",
          processing_timestamp: "2026-01-01T10:00:00",
        },
        {
          event_id: "b",
          entity_id: 2,
          value: 70,
          event_timestamp: "2026-01-01T08:30:00",
          processing_timestamp: "2026-01-01T10:05:00",
        },
      ],
    },
    {
      purpose: "out-of-order-events",
      tests: ["event-ordering", "event-time"],
    }
  ),
  fx(
    "hidden-late-event",
    "Late but within lateness window",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 3, value: 100, event_timestamp: "2026-01-01T09:00:00" }],
      events: [
        {
          event_id: "late1",
          entity_id: 3,
          value: 150,
          event_timestamp: "2026-01-01T09:30:00",
          processing_timestamp: "2026-01-01T10:15:00",
        },
      ],
    },
    {
      purpose: "late-event",
      tests: ["event-time", "lateness-handling"],
    }
  ),
  fx(
    "hidden-very-late-event",
    "Event exceeds lateness threshold",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 4, value: 100, event_timestamp: "2026-01-01T09:00:00" }],
      events: [
        {
          event_id: "toolate",
          entity_id: 4,
          value: 999,
          event_timestamp: "2026-01-01T07:00:00",
          processing_timestamp: "2026-01-01T10:30:00",
        },
      ],
    },
    {
      purpose: "watermark-policy",
      tests: ["lateness-handling", "watermark"],
    }
  ),
  fx(
    "hidden-same-event-time",
    "Deterministic tie-break on event_id",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 5, value: 10, event_timestamp: "2026-01-01T08:00:00" }],
      events: [
        {
          event_id: "a1",
          entity_id: 5,
          value: 100,
          event_timestamp: "2026-01-01T10:00:00",
          processing_timestamp: "2026-01-01T10:01:00",
        },
        {
          event_id: "b2",
          entity_id: 5,
          value: 200,
          event_timestamp: "2026-01-01T10:00:00",
          processing_timestamp: "2026-01-01T10:02:00",
        },
      ],
    },
    {
      purpose: "same-event-time",
      tests: ["deterministic-ordering", "event-time"],
    }
  ),
  fx(
    "hidden-duplicate-event",
    "Duplicate event_id in stream",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 6, value: 40, event_timestamp: "2026-01-01T08:00:00" }],
      events: [
        {
          event_id: "dup",
          entity_id: 6,
          value: 90,
          event_timestamp: "2026-01-01T09:00:00",
          processing_timestamp: "2026-01-01T09:05:00",
        },
        {
          event_id: "dup",
          entity_id: 6,
          value: 999,
          event_timestamp: "2026-01-01T09:00:00",
          processing_timestamp: "2026-01-01T09:10:00",
        },
      ],
    },
    {
      purpose: "duplicate-event",
      tests: ["idempotency", "deduplication"],
    }
  ),
  fx(
    "hidden-late-update",
    "Late update corrects event-time state",
    true,
    {
      pipeline_config: CONFIG,
      state_snapshot: [{ entity_id: 7, value: 100, event_timestamp: "2026-01-01T08:00:00" }],
      events: [
        {
          event_id: "u1",
          entity_id: 7,
          value: 120,
          event_timestamp: "2026-01-01T08:30:00",
          processing_timestamp: "2026-01-01T09:20:00",
        },
        {
          event_id: "u2",
          entity_id: 7,
          value: 130,
          event_timestamp: "2026-01-01T09:00:00",
          processing_timestamp: "2026-01-01T09:05:00",
        },
      ],
    },
    {
      purpose: "late-update",
      tests: ["state-correction", "event-time"],
    }
  ),
];

const SQL_TABLES = [
  {
    label: "pipeline_config",
    description: "Lateness policy (minutes between event time and processing time)",
    columns: [{ name: "max_lateness_minutes", type: "INT" }],
  },
  {
    label: "state_snapshot",
    description: "Known entity state before applying the event batch",
    columns: [
      { name: "entity_id", type: "INT", key: "PK" },
      { name: "value", type: "INT" },
      { name: "event_timestamp", type: "TEXT" },
    ],
  },
  {
    label: "events",
    description: "Event stream with event time and processing time",
    columns: [
      { name: "event_id", type: "TEXT", key: "PK" },
      { name: "entity_id", type: "INT" },
      { name: "value", type: "INT" },
      { name: "event_timestamp", type: "TEXT" },
      { name: "processing_timestamp", type: "TEXT" },
    ],
  },
];

const ADVERSARIAL_SQL = `WITH cfg AS (
  SELECT max_lateness_minutes FROM pipeline_config LIMIT 1
),
deduped AS (
  SELECT event_id, entity_id, value, event_timestamp, processing_timestamp
  FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY processing_timestamp) AS rn
    FROM events
  ) WHERE rn = 1
),
ranked AS (
  SELECT entity_id, value, event_timestamp,
         ROW_NUMBER() OVER (PARTITION BY entity_id ORDER BY processing_timestamp DESC) AS rn
  FROM deduped
),
latest AS (
  SELECT entity_id, value, event_timestamp FROM ranked WHERE rn = 1
),
snapshot_only AS (
  SELECT s.entity_id, s.value, s.event_timestamp
  FROM state_snapshot s
  WHERE s.entity_id NOT IN (SELECT entity_id FROM latest)
)
SELECT entity_id, value, event_timestamp FROM snapshot_only
UNION ALL
SELECT entity_id, value, event_timestamp FROM latest;`;

const ADVERSARIAL_PYSPARK = `ew = Window.partitionBy("event_id").orderBy("processing_timestamp")
deduped = events.withColumn("_rn", row_number().over(ew)).filter(col("_rn") == 1).drop("_rn")

lw = Window.partitionBy("entity_id").orderBy(col("processing_timestamp").desc())
latest = (
    deduped.withColumn("_rn", row_number().over(lw))
    .filter(col("_rn") == 1)
    .drop("_rn")
    .select(
        col("entity_id").cast("int"),
        col("value").cast("int"),
        col("event_timestamp").cast("string"),
    )
)

snapshot_only = (
    state_snapshot.join(latest.select("entity_id"), "entity_id", "left_anti")
    .select(
        col("entity_id").cast("int"),
        col("value").cast("int"),
        col("event_timestamp").cast("string"),
    )
)

entity_state = snapshot_only.unionByName(latest)`;

export default {
  outputTable: "entity_state",
  resultVar: "entity_state",
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

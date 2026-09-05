---
title: System Design Notes
description: Deep data engineering architecture reference for interviews
parent: system-design
hidden: true
order: 1
difficulty: basic
---

# System Design Master Notes

Built for **Data Engineering** architecture interviews — batch vs streaming, Kafka, CDC, lakehouse, medallion, SLAs, backfill, idempotency, and data quality.

Each topic: **Concept → Architecture → Tradeoffs → DE example → Mistakes → Interview → Practice**

---

## Batch vs Streaming

### 1. Processing paradigms

**Concept:** Batch processes bounded datasets in scheduled jobs; streaming processes unbounded events continuously with low latency.

**Architecture:**

- **Batch:** Airflow DAG → Spark → Delta gold
- **Streaming:** Kafka → Flink/Spark Streaming → serving layer
- **Micro-batch:** Spark Structured Streaming (trigger interval)

**Tradeoffs:**

- Batch: simpler correctness, cheaper
- Stream: lower latency, higher ops complexity
- Micro-batch: compromise latency vs exactly-once

**DE example:** Daily 500 GB log files → nightly Spark job. Fraud alerts → Kafka + Flink < 1s.

**Common mistake:** Choosing streaming for a daily report that only needs T+1 freshness.

**Interview:** When would you use Lambda vs Kappa?

**Practice:** Practice #1, #2, #7

### 2. Lambda architecture

**Concept:** Combines speed layer (stream) and batch layer (batch) with a serving layer that merges views.

**Architecture:**

```
Sources → [Stream path] → Real-time view
       → [Batch path]  → Batch view → Serving (merge)
```

**Tradeoffs:**

- Accurate historical batch + fast approximate stream
- Dual pipeline maintenance
- Reconciliation between layers required

**DE example:** Clickstream: Flink 5-min counts + Spark daily exact counts; dashboard shows stream, finance uses batch.

**Common mistake:** Ignoring reconciliation — numbers never match between layers.

**Interview:** How do you reconcile Lambda layers?

**Practice:** Practice #5

### 3. Kappa architecture

**Concept:** Single stream processing path; reprocess history by replaying the log.

**Architecture:**

```
Sources → Kafka (immutable log) → Stream processor → Sink
                    ↑ replay for new logic / backfill
```

**Tradeoffs:**

- One codebase
- Replay can be expensive at scale
- Requires durable log with long retention

**DE example:** New aggregation logic: deploy job, reset offsets, replay 30-day retention.

**Common mistake:** Replaying without capacity planning — overwhelms consumers.

**Interview:** What are replay tradeoffs in Kappa?

**Practice:** Practice #14

### 4. Micro-batch (Structured Streaming)

**Concept:** Spark treats stream as series of small batch jobs with watermarking.

**Architecture:**

- `readStream` → transformations → `writeStream`
- Trigger: `processingTime='1 minute'`
- Checkpoint dir for fault tolerance

**Tradeoffs:**

- Easier for Spark teams
- Latency floor = trigger interval
- Not true record-by-record for all ops

**DE example:** IoT aggregates every 30s using processingTime trigger.

**Common mistake:** Using processingTime when event-time ordering matters.

**Interview:** Explain watermarks in Spark Streaming.

**Practice:** Practice #7

### 5. Event time vs processing time

**Concept:** Event time = when event occurred; processing time = when pipeline processed it.

**Architecture:**

- Always prefer `timestamp` column from payload for windows
- Watermark: `withWatermark('event_time', '10 minutes')`

**Tradeoffs:**

- Event time: correct under delay
- Processing time: simpler, wrong under lag

**DE example:** Mobile clicks arriving late: 15-min allowed lateness, drop or side-output late data.

**Common mistake:** Windowing on ingest time when events can arrive out of order.

**Interview:** How handle late data?

**Practice:** Interview #19

### 6. Windowing strategies

**Concept:** Tumbling (fixed, non-overlapping), sliding (overlap), session (gap-based).

**Architecture:**

- Flink: `Tumble`, `Slide`, `Session` windows on event time
- Group by key for per-entity windows

**Tradeoffs:**

- Smaller windows → more state, more output
- Session windows need gap tuning

**DE example:** Session analytics: 30-min gap groups user clicks into sessions.

**Common mistake:** Global windows without keys — cannot scale.

**Interview:** Difference tumbling vs sliding?

**Practice:** Practice #5

### 7. Message queues vs streams

**Concept:** Queue: competing consumers, message deleted after ack. Log: retained, replayable, ordered per partition.

**Architecture:**

| Queue (SQS) | Log (Kafka) |
|-------------|-------------|
| Point-to-point | Pub-sub + replay |
| Fire-and-forget | Durable retention |

**Tradeoffs:**

- Queue for task distribution
- Log for event sourcing and CDC

**DE example:** Order fulfillment tasks → SQS. Order events for analytics → Kafka.

**Common mistake:** Using SQS when multiple consumers need same events.

**Interview:** Kafka vs RabbitMQ for DE?

**Practice:** Interview #4

### 8. Apache Kafka core model

**Concept:** Distributed commit log: producers write to topics; consumers read with offset.

**Architecture:**

- Topic → N partitions
- Replication factor for durability
- ISR for leader election

**Tradeoffs:**

- Partitions enable parallelism
- More partitions → more overhead

**DE example:** Payments topic: 24 partitions, key=`account_id`, RF=3.

**Common mistake:** Too few partitions — cannot scale consumers.

**Interview:** Explain partitions and consumer groups.

**Practice:** Interview #4, #5

### 9. Kafka producers and consumers

**Concept:** Producers batch and compress; consumers poll and commit offsets.

**Architecture:**

- `acks=all` for durability
- Idempotent producer: `enable.idempotence=true`
- Manual commit after successful sink write

**Tradeoffs:**

- Sync produce: safer, slower
- Async: higher throughput, risk on failure

**DE example:** Finance producer: acks=all, idempotent, Snappy compression.

**Common mistake:** Auto-commit before processing — can lose messages on crash.

**Interview:** How achieve at-least-once consumption?

**Practice:** Interview #5

### 10. Stream processing engines

**Concept:** Flink: true streaming, low latency. Spark Streaming: micro-batch. Kafka Streams: library embedded in apps.

**Architecture:**

| Engine | Strength |
|--------|----------|
| Flink | Stateful CEP, exactly-once |
| Spark SS | Unified batch/stream API |
| ksqlDB | SQL on Kafka |

**Tradeoffs:**

- Flink ops learning curve
- Spark team velocity on SS

**DE example:** CEP for fraud: Flink pattern detection on transaction stream.

**Common mistake:** Running heavy stateful joins without keyed streams.

**Interview:** Flink vs Spark Streaming?

**Practice:** Practice #5, #12

### 11. Unified batch and stream (Spark 3+)

**Concept:** Same DataFrame API; batch = bounded, stream = unbounded.

**Architecture:**

- `spark.read` vs `spark.readStream`
- `foreachBatch` for custom MERGE to Delta

**Tradeoffs:**

- Code reuse across modes
- Stream-specific: watermarks, output modes

**DE example:** Single silver MERGE logic in `foreachBatch` for CDC stream.

**Common mistake:** Sharing code without testing stream edge cases.

**Interview:** How use foreachBatch with Delta?

**Practice:** Interview #33

### 12. When NOT to stream

**Concept:** If latency requirement is hours/days, batch is simpler and cheaper.

**Architecture:**

Signals: T+1 SLA, bounded daily volume, no real-time alerts, team lacks streaming ops.

**Tradeoffs:**

- Avoid premature streaming
- Start batch, add stream when SLA demands

**DE example:** Weekly regulatory report — batch only.

**Common mistake:** Streaming because it is trendy.

**Interview:** Convince stakeholder to stay batch?

**Practice:** Interview #1

### 13. Hybrid ingestion patterns

**Concept:** Kafka Connect, Fivetran, ADF copy, Spark autoloader for different sources.

**Architecture:**

- DB CDC → Debezium Connect
- Files → Autoloader / COPY INTO
- APIs → scheduled pull to bronze

**Tradeoffs:**

- Managed vs custom
- Cost per connector

**DE example:** S3 logs: Autoloader with schema inference + evolution.

**Common mistake:** One-off scripts without orchestration.

**Interview:** Compare Autoloader vs COPY INTO.

**Practice:** Practice #1

### 14. Orchestration for batch

**Concept:** Airflow, Dagster, Prefect schedule and depend batch jobs.

**Architecture:**

- Sensors wait for data arrival
- Retries with exponential backoff
- SLAs and alerting built-in

**Tradeoffs:**

- Airflow: mature, YAML-heavy
- Dagster: asset-centric lineage

**DE example:** Airflow DAG: bronze → silver → gold with TaskGroup per domain.

**Common mistake:** No dependency between silver and gold — race conditions.

**Interview:** Airflow vs Databricks Jobs?

**Practice:** Interview #38

### 15. Capacity estimation

**Concept:** Back-of-envelope: events/sec × payload size × retention; partition count; shuffle size.

**Architecture:**

Example: 10K evt/s × 2 KB × 86400 s ≈ 1.7 TB/day raw.

**Tradeoffs:**

- 2× headroom for peaks
- Storage = raw × replication × layers

**DE example:** Justify 32 Kafka partitions: target 10 MB/s per partition.

**Common mistake:** Skipping estimation — surprise bills and lag.

**Interview:** Estimate storage for 1M events/min?

**Practice:** Case study prep

### 16. Kafka retention and replay

**Concept:** Brokers retain log segments by time or size; consumers control offset.

**Architecture:**

- `retention.ms`, `retention.bytes`
- Compacted topics for changelog
- Consumer `auto.offset.reset=earliest` for replay

**Tradeoffs:**

- Long retention = storage cost
- Replay impacts downstream and source if re-fetching

**DE example:** 7-day retention for order events; compacted customer dimension topic.

**Common mistake:** Replay production topic without throttling consumers.

**Interview:** How long retain Kafka data?

**Practice:** Interview #6

### 17. Delivery semantics

**Concept:** At-most-once, at-least-once, exactly-once — pick based on business tolerance.

**Architecture:**

| Semantic | Behavior |
|----------|----------|
| At-most-once | May lose messages |
| At-least-once | May duplicate |
| Exactly-once | No dup/loss (hard) |

**Tradeoffs:**

- Exactly-once needs transactional sinks
- At-least-once + idempotent MERGE is pragmatic

**DE example:** Payments: at-least-once Kafka + MERGE on `txn_id`.

**Common mistake:** Claiming exactly-once without end-to-end proof.

**Interview:** Explain EOS Kafka to Delta.

**Practice:** Interview #5, #33

### 18. Batch scheduling patterns

**Concept:** Cron, event-driven, and data-aware triggers for pipeline starts.

**Architecture:**

- Cron: daily 2 AM
- File arrival sensor: S3 prefix
- Upstream DAG sensor in Airflow

**Tradeoffs:**

- Event-driven reduces idle wait
- Sensors can cause deadlock if misconfigured

**DE example:** Trigger silver when bronze partition `_ingest_date=today` has files.

**Common mistake:** Hard-coded dates in backfill scripts.

**Interview:** Sensor vs schedule?

**Practice:** Practice #1

## CDC & Lakehouse

### 1. Change Data Capture overview

**Concept:** Captures row-level changes (INSERT, UPDATE, DELETE) from operational databases.

**Architecture:**

- Log-based: read transaction log (WAL/binlog)
- Query-based: poll on `updated_at`
- Trigger-based: DB triggers (avoid in prod)

**Tradeoffs:**

- Log-based: low impact, complete
- Poll: misses deletes without soft delete

**DE example:** Debezium tails Postgres WAL → Kafka.

**Common mistake:** Polling large table full scan every minute.

**Interview:** CDC methods comparison?

**Practice:** Interview #7, #8

### 2. Debezium architecture

**Concept:** Kafka Connect source connector emits change events with `before`, `after`, `op`.

**Architecture:**

```
Postgres WAL → Debezium → Kafka topic(s)
Schema history → separate topic
```

**Tradeoffs:**

- Single message per row change
- Schema evolution via Apicurio/Confluent Registry

**DE example:** Customers table CDC with primary key `id`.

**Common mistake:** Not monitoring connector lag vs DB.

**Interview:** What is in a Debezium event?

**Practice:** Practice #6

### 3. Handling deletes in CDC

**Concept:** Delete events have `op=d` and `before` payload; tombstones in compacted topics.

**Architecture:**

- Soft delete in source simplifies
- Hard delete: propagate tombstone or `is_deleted` flag in silver

**Tradeoffs:**

- Tombstones: compaction removes history
- Audit may require delete log table

**DE example:** GDPR delete: CDC delete → purge silver/gold rows.

**Common mistake:** Ignoring deletes — ghost records in warehouse.

**Interview:** How propagate deletes to Snowflake?

**Practice:** Practice #6

### 4. Schema Registry

**Concept:** Central contract for Avro/Protobuf/JSON schemas; compatibility modes.

**Architecture:**

- BACKWARD: new consumers read old data
- FORWARD: old consumers read new data
- FULL: both

**Tradeoffs:**

- Prevents breaking producers
- Requires CI for schema changes

**DE example:** Avro schema for `orders` with optional `discount_code`.

**Common mistake:** Deploying incompatible schema Friday night.

**Interview:** Schema compatibility modes?

**Practice:** Interview #20

### 5. Data lake fundamentals

**Concept:** Cheap object storage holding raw and processed files in open formats.

**Architecture:**

- S3 / ADLS / GCS
- Formats: Parquet, ORC, Avro, JSON
- Hive metastore or Glue Catalog

**Tradeoffs:**

- Schema-on-read flexibility
- No ACID without table format

**DE example:** 10 PB raw JSON logs in S3 `s3://datalake/bronze/`.

**Common mistake:** Storing small JSON files unpartitioned.

**Interview:** Lake vs warehouse?

**Practice:** Interview #9

### 6. Data warehouse role

**Concept:** Optimized analytical SQL engine with governance and BI integration.

**Architecture:**

- Snowflake, BigQuery, Redshift, Synapse
- Columnar, caching, result reuse

**Tradeoffs:**

- Higher cost per TB
- Less flexible for ML raw features

**DE example:** Gold marts in Snowflake for Tableau.

**Common mistake:** Dumping all raw data into warehouse — cost explosion.

**Interview:** When keep warehouse vs lake only?

**Practice:** Interview #9

### 7. Lakehouse definition

**Concept:** ACID tables on object storage bridging lake economics and warehouse features.

**Architecture:**

- Delta Lake, Iceberg, Hudi
- Time travel, MERGE, schema enforcement
- Open engines query same tables

**Tradeoffs:**

- Less mature than native warehouse for some BI
- Ops for compaction

**DE example:** Enterprise standard: Delta bronze/silver, Snowflake gold BI.

**Common mistake:** Lakehouse without governance catalog.

**Interview:** What problems does lakehouse solve?

**Practice:** Interview #10

### 8. Delta Lake internals

**Concept:** Transaction log (`_delta_log`) provides ACID; Parquet data files.

**Architecture:**

- Optimistic concurrency
- `MERGE`, `UPDATE`, `DELETE` SQL
- `OPTIMIZE` + `ZORDER` for layout

**Tradeoffs:**

- Databricks optimized
- Lock service needed on some clouds

**DE example:** Hourly `MERGE` CDC into `silver.customers`.

**Common mistake:** Never running OPTIMIZE — read amplification.

**Interview:** How does Delta achieve ACID?

**Practice:** Interview #11

### 9. Apache Iceberg internals

**Concept:** Metadata tree: snapshots, manifests, manifest lists; hidden partitioning.

**Architecture:**

- Snapshot isolation
- Partition evolution without rewrite
- Multi-engine (Spark, Flink, Trino)

**Tradeoffs:**

- More moving parts in metadata
- Growing ecosystem

**DE example:** Trino federated queries on Iceberg silver.

**Common mistake:** User-facing partition columns when hidden partitions exist.

**Interview:** Iceberg vs Delta?

**Practice:** Interview #11, Practice #11

### 10. Apache Hudi

**Concept:** Record-level indexing (Bloom, HBase) for upserts; incremental pulls.

**Architecture:**

- MoR vs CoW table types
- Useful for frequent upserts on PK

**Tradeoffs:**

- MoR: faster write, slower read until compaction
- CoW: opposite

**DE example:** CDC upserts to Hudi MoR table on S3.

**Common mistake:** CoW for high-frequency updates.

**Interview:** When choose Hudi?

**Practice:** Lakehouse comparison

### 11. Table format selection

**Concept:** Decision matrix based on platform, engines, and team.

**Architecture:**

| Criteria | Delta | Iceberg | Hudi |
|----------|-------|---------|------|
| Databricks | ★★★ | ★★ | ★ |
| Multi-engine | ★★ | ★★★ | ★★ |

**Tradeoffs:**

- Avoid three formats in one org
- Standardize with escape hatch

**DE example:** Multi-cloud analytics → Iceberg.

**Common mistake:** Different formats per team — governance nightmare.

**Interview:** Pitch Iceberg to mixed engine team.

**Practice:** Practice #11

### 12. Unity Catalog and Glue

**Concept:** Central governance: databases, tables, ACLs, lineage.

**Architecture:**

- Row/column masks
- External locations for storage creds
- Lineage from jobs

**Tradeoffs:**

- Single source of truth
- Setup effort

**DE example:** Unity Catalog three-level namespace `catalog.schema.table`.

**Common mistake:** Wild-west S3 paths without catalog registration.

**Interview:** How enforce RBAC on gold?

**Practice:** Governance

### 13. CDC to lakehouse pipeline

**Concept:** End-to-end: source DB → Debezium → Kafka → Spark/Flink → Delta/Iceberg.

**Architecture:**

```
OLTP → Debezium → Kafka → Structured Streaming → MERGE silver
```

**Tradeoffs:**

- End-to-end latency minutes typical
- Ordering per PK partition

**DE example:** Postgres → Delta silver in 5 min P95.

**Common mistake:** MERGE without primary key — duplicates.

**Interview:** Design CDC to Delta.

**Practice:** Practice #6

### 14. Snapshot vs incremental extraction

**Concept:** Full snapshot periodic vs CDC incremental.

**Architecture:**

- Snapshot: simple, heavy on source
- CDC: efficient, complex

**Tradeoffs:**

- Initial load: snapshot then CDC
- Hybrid for dimension tables

**DE example:** Initial 10M row snapshot + ongoing CDC.

**Common mistake:** CDC without initial snapshot baseline.

**Interview:** Initial load strategy?

**Practice:** Practice #6

### 15. Data lake zones

**Concept:** Landing (raw), curated (cleaned), consumption (marts) — aligns with medallion.

**Architecture:**

- Landing: short retention optional
- Curated: long retention, governed

**Tradeoffs:**

- Clear ownership per zone
- Lifecycle policies per zone

**DE example:** Landing 7-day retention; curated 7-year with Glacier tiering.

**Common mistake:** Same bucket, no prefix isolation.

**Interview:** Zone vs medallion layer?

**Practice:** Medallion chapter

### 16. Open formats comparison

**Concept:** Parquet columnar default; Avro for Kafka row serialization; JSON for flexibility.

**Architecture:**

| Format | Use case |
|--------|----------|
| Parquet | Analytics lake tables |
| Avro | Kafka + schema registry |
| JSON | Semi-structured bronze |

**Tradeoffs:**

- Parquet: best compression for analytics
- Avro: schema evolution in streaming

**DE example:** Bronze JSON → silver Parquet/Delta.

**Common mistake:** JSON in gold serving layer — slow queries.

**Interview:** Parquet vs Avro?

**Practice:** Interview #9

### 17. External vs managed tables

**Concept:** External: data in your bucket; managed: platform controls location.

**Architecture:**

- External: portable, you manage lifecycle
- Managed: simpler ops, vendor lock

**Tradeoffs:**

- Lakehouse typically external tables on S3
- Warehouse native tables for gold

**DE example:** Delta external table on `s3://corp-datalake/silver/`.

**Common mistake:** No lifecycle policy on external bucket.

**Interview:** External table tradeoffs?

**Practice:** Lakehouse

### 18. Time travel and auditing

**Concept:** Query historical snapshots for debugging and compliance.

**Architecture:**

- Delta: `VERSION AS OF` / `TIMESTAMP AS OF`
- Iceberg: snapshot id

**Tradeoffs:**

- Storage of old files until vacuum
- Audit investigations

**DE example:** Reproduce March revenue report with March 15 snapshot.

**Common mistake:** Aggressive VACUUM deleting audit history.

**Interview:** Time travel use cases?

**Practice:** Practice #18

## Medallion Architecture

### 1. Medallion overview

**Concept:** Databricks pattern: Bronze (raw), Silver (cleaned), Gold (business-ready).

**Architecture:**

```
Sources → Bronze → Silver → Gold → BI/ML
```

**Tradeoffs:**

- Progressive trust and quality
- Clear replay boundaries

**DE example:** Enterprise analytics platform standard layout.

**Common mistake:** Skipping silver — dirty data in gold.

**Interview:** Explain three layers.

**Practice:** Interview #12

### 2. Bronze layer design

**Concept:** Immutable raw ingest with metadata columns.

**Architecture:**

Required columns: `_ingest_timestamp`, `_source_system`, `_raw_file` or `_offset`

**Tradeoffs:**

- Append-only
- No business transforms
- Cheap storage class OK

**DE example:** API JSON landed with `_payload` string column.

**Common mistake:** Mutating bronze on correction.

**Interview:** Bronze best practices?

**Practice:** Interview #13, Practice #4

### 3. Silver layer design

**Concept:** Conformed, deduplicated, typed entities aligned to enterprise model.

**Architecture:**

- Surrogate keys
- SCD Type 2 for dims
- DQ validation gates

**Tradeoffs:**

- Most engineering effort here
- Reusable across use cases

**DE example:** `silver.customer` SCD2 with `valid_from`, `valid_to`.

**Common mistake:** Different silver models per downstream team.

**Interview:** Silver responsibilities?

**Practice:** Interview #14

### 4. Gold layer design

**Concept:** Purpose-built datasets for BI, ML, and APIs.

**Architecture:**

- Star schema or wide feature tables
- Denormalized for query speed
- Documented grain

**Tradeoffs:**

- Duplication OK for performance
- Tied to SLA tiers

**DE example:** `gold.daily_revenue_by_region` grain: day × region.

**Common mistake:** Gold tables with unclear grain.

**Interview:** Gold vs semantic layer?

**Practice:** Interview #15

### 5. SCD Type 1 vs 2

**Concept:** Type 1 overwrite; Type 2 history with new row.

**Architecture:**

- Type 1: simple, no history
- Type 2: audit, point-in-time correct

**Tradeoffs:**

- Type 1 loses history
- Type 2 storage growth

**DE example:** Customer address: Type 2 for compliance; status flag: Type 1.

**Common mistake:** Type 2 on high-churn table without archive policy.

**Interview:** When SCD2?

**Practice:** Practice #10

### 6. Incremental MERGE pattern

**Concept:** Upsert new/changed rows using SQL MERGE or DataFrame API.

**Architecture:**

```sql
MERGE INTO silver.orders t
USING staging s ON t.id = s.id
WHEN MATCHED THEN UPDATE ...
WHEN NOT MATCHED THEN INSERT ...
```

**Tradeoffs:**

- Idempotent per batch
- Needs match key + ordering for CDC

**DE example:** CDC stream `foreachBatch` MERGE every minute.

**Common mistake:** MERGE without dedupe — duplicates on replay.

**Interview:** Idempotent MERGE?

**Practice:** Interview #16

### 7. Dedup strategies

**Concept:** Window function ROW_NUMBER, dropDuplicates, or merge with latest timestamp.

**Architecture:**

- `ROW_NUMBER() OVER (PARTITION BY id ORDER BY ts DESC) = 1`
- Compacted Kafka changelog

**Tradeoffs:**

- Window dedupe costs shuffle
- Keep latest by sequence number for CDC

**DE example:** Orders dedupe on `order_id` keeping max `event_seq`.

**Common mistake:** Dedupe only in gold — silver still duplicated.

**Interview:** Dedupe in streaming?

**Practice:** Practice #9

### 8. Data contracts between layers

**Concept:** Explicit schema, SLAs, and ownership documented per table.

**Architecture:**

- Contract YAML in repo
- Breaking change = major version

**Tradeoffs:**

- Enables parallel team development
- CI validates contracts

**DE example:** `contracts/silver_orders.yaml` with required columns.

**Common mistake:** Tribal knowledge only.

**Interview:** What is a data contract?

**Practice:** Interview #20

### 9. Domain-driven medallion

**Concept:** Align bronze/silver/gold per domain (sales, marketing) not single monolith.

**Architecture:**

- Domain teams own silver/gold
- Platform provides bronze patterns

**Tradeoffs:**

- Federation vs consistency tradeoff
- Data mesh alignment

**DE example:** Sales domain owns `silver.sales_*` tables.

**Common mistake:** One team owns all gold — bottleneck.

**Interview:** Medallion vs data mesh?

**Practice:** Interview #36

### 10. Cross-domain joins

**Concept:** Conformed dimensions (date, customer) in shared silver; facts domain-specific.

**Architecture:**

- Shared `silver.dim_date`
- Avoid gold-to-gold joins across domains in BI

**Tradeoffs:**

- Conformed dims reduce duplication
- Governance on shared entities

**DE example:** Join `gold.sales` to `silver.dim_customer` via surrogate key.

**Common mistake:** Each domain defines own customer ID.

**Interview:** Conformed dimensions?

**Practice:** Practice #10

### 11. Medallion for streaming

**Concept:** Bronze from Kafka Connect; silver via streaming MERGE; gold micro-batch or batch.

**Architecture:**

- Bronze: raw events
- Silver: sessionization, enrichment
- Gold: rolling aggregates

**Tradeoffs:**

- Stream silver, batch gold common
- Latency tiers per layer

**DE example:** Bronze Kafka → silver enriched events → gold 5-min KPIs.

**Common mistake:** Same batch job for all layers — latency mismatch.

**Interview:** Streaming medallion?

**Practice:** Practice #5

### 12. Testing medallion pipelines

**Concept:** Unit tests on transforms, integration on sample data, contract tests on schemas.

**Architecture:**

- `pytest` + local Spark
- CI runs on PR
- Reconciliation tests bronze vs source counts

**Tradeoffs:**

- Shift-left quality
- Slower CI if not parallelized

**DE example:** Assert silver row count within 0.1% of bronze after filters.

**Common mistake:** Prod-only testing.

**Interview:** How test pipelines?

**Practice:** DQ chapter

### 13. Lineage and impact analysis

**Concept:** Track data flow bronze → gold for breaking change impact.

**Architecture:**

- OpenLineage, Unity Catalog lineage
- Tag PII columns

**Tradeoffs:**

- Required for compliance
- Enables safe refactors

**DE example:** Impact: changing `silver.orders` schema flags 12 gold jobs.

**Common mistake:** No lineage — blind deploys.

**Interview:** Why lineage matters?

**Practice:** Observability

### 14. Versioning gold tables

**Concept:** `orders_daily_v2` or feature flags during migration.

**Architecture:**

- Dual-write period
- Compare metrics
- Cutover via view swap

**Tradeoffs:**

- Safer migrations
- Temporary storage cost

**DE example:** Run v1 and v2 gold parallel for 2 weeks.

**Common mistake:** Big-bang gold rewrite.

**Interview:** Safe gold migration?

**Practice:** Practice #14

### 15. Anti-patterns

**Concept:** Gold in bronze, mutable bronze, skipping DQ, monolithic gold warehouse.

**Architecture:**

List: hero ETL scripts, no ownership, no freshness monitors.

**Tradeoffs:**

- Recognize in legacy systems
- Plan incremental remediation

**DE example:** Audit found 400 tables in bronze used directly by BI.

**Common mistake:** Boil the ocean rewrite.

**Interview:** Medallion anti-patterns?

**Practice:** Interview #12

### 16. Compaction and file layout

**Concept:** Optimize small files into larger objects for read performance.

**Architecture:**

- Delta `OPTIMIZE` + `ZORDER`
- Iceberg rewrite data files
- Target 128MB–1GB per file

**Tradeoffs:**

- Compaction consumes compute
- Schedule off-peak

**DE example:** Weekly OPTIMIZE on high-write silver tables.

**Common mistake:** Millions of 10KB files in bronze.

**Interview:** Small file problem?

**Practice:** Interview #32

### 17. PII handling in medallion

**Concept:** Hash/tokenize early; restrict gold exposure.

**Architecture:**

- Bronze may contain raw PII (encrypted)
- Silver: tokenize
- Gold: aggregates only where possible

**Tradeoffs:**

- Compliance vs analytics utility
- Right to erasure complexity

**DE example:** Email hashed SHA-256 with salt in silver.

**Common mistake:** PII in wide gold table exported to Excel.

**Interview:** PII in pipelines?

**Practice:** Interview #21

## Scalability & Reliability

### 1. Horizontal vs vertical scaling

**Concept:** Scale out (more nodes) vs scale up (bigger nodes).

**Architecture:**

- Data pipelines prefer horizontal
- Shuffle-bound jobs may need fat executors temporarily

**Tradeoffs:**

- Horizontal: elasticity
- Vertical: limits hit eventually

**DE example:** Kafka: add partitions and consumers.

**Common mistake:** Only vertical scaling on single-node ETL.

**Interview:** Scale Kafka consumers?

**Practice:** Interview #24

### 2. Partitioning strategies

**Concept:** Divide data for parallelism and pruning.

**Architecture:**

- Time: `year/month/day`
- Entity: `region`, `tenant_id`
- Avoid skewed keys alone

**Tradeoffs:**

- Right partition = fast queries
- Wrong = small files or hotspots

**DE example:** Partition gold by `order_date`, Z-order `customer_id`.

**Common mistake:** Partition on low-cardinality only — huge files.

**Interview:** Choose partition column?

**Practice:** Interview #31

### 3. Data skew mitigation

**Concept:** Salting, adaptive query execution, broadcast joins, isolate heavy keys.

**Architecture:**

- `salt_key = concat(id, floor(rand()*10))`
- AQE coalesce skewed partitions

**Tradeoffs:**

- Skew causes stragglers
- Monitor stage duration variance

**DE example:** Join on skewed `product_id='OTHER'` — broadcast dim.

**Common mistake:** Ignore straggler tasks.

**Interview:** Fix skew in Spark?

**Practice:** Interview #24

### 4. Fault tolerance in batch

**Concept:** Idempotent tasks, retry, checkpoint intermediate results.

**Architecture:**

- Airflow `retries=3`
- Write to staging then atomic promote
- Partition overwrite idempotent

**Tradeoffs:**

- Transient failures expected
- Non-idempotent writes dangerous

**DE example:** Write to `staging/`, validate, `ALTER TABLE SWAP`.

**Common mistake:** Partial write without transaction.

**Interview:** Idempotent batch writes?

**Practice:** Interview #16

### 5. Fault tolerance in streaming

**Concept:** Checkpointing, WAL, exactly-once sinks.

**Architecture:**

- Spark: checkpoint directory
- Flink: checkpoint to durable storage
- Kafka: offset commit after process

**Tradeoffs:**

- Recovery from last checkpoint
- State rebuild time matters

**DE example:** Flink 60s checkpoint interval, EXACTLY_ONCE mode.

**Common mistake:** Delete checkpoint dir casually.

**Interview:** Streaming recovery?

**Practice:** Interview #25

### 6. SLA dimensions

**Concept:** Freshness, completeness, accuracy, availability.

**Architecture:**

| Metric | Example |
|--------|----------|
| Freshness | Gold < 2h behind source |
| Completeness | 99.9% row match |
| Accuracy | DQ rules pass |
| Availability | 99.5% job success |

**Tradeoffs:**

- Tier SLAs by business criticality
- Measure objectively

**DE example:** Tier-1 `fact_orders`: 1h freshness, page on breach.

**Common mistake:** SLA without measurement.

**Interview:** Define pipeline SLA?

**Practice:** Interview #18, Practice #8

### 7. Backfill design

**Concept:** Reprocess historical data after logic change or new metric.

**Architecture:**

Steps: freeze offsets / snapshot state → batch reprocess range → validate → resume stream → swap tables

**Tradeoffs:**

- Resource intensive
- Coordinate with downstream consumers

**DE example:** Backfill 90 days orders for new tax column.

**Common mistake:** Backfill prod without notifying consumers.

**Interview:** Backfill while streaming?

**Practice:** Interview #17, Practice #14

### 8. Idempotency patterns

**Concept:** Deterministic output for same input regardless of run count.

**Architecture:**

- Natural/business keys
- `MERGE` not blind `INSERT`
- Dedupe on `event_id`

**Tradeoffs:**

- Foundation for at-least-once
- Required for backfill safety

**DE example:** Ledger: upsert on `transaction_id`.

**Common mistake:** Auto-increment surrogate in streaming sink.

**Interview:** Idempotency in DE?

**Practice:** Interview #16

### 9. Circuit breaker and rate limiting

**Concept:** Protect source systems and sinks from overload.

**Architecture:**

- Token bucket on API ingest
- Pause consumer on downstream failure
- Exponential backoff

**Tradeoffs:**

- Prevents cascade failures
- May increase lag temporarily

**DE example:** Throttle JDBC extract to 1000 rows/s.

**Common mistake:** Hammer source DB during backfill.

**Interview:** Protect OLTP from ETL?

**Practice:** CDC chapter

### 10. Multi-AZ and disaster recovery

**Concept:** Replicate storage and compute across zones/regions.

**Architecture:**

- S3 cross-region replication
- Kafka MirrorMaker 2
- RPO/RTO documented

**Tradeoffs:**

- Cost of standby
- Failover testing required

**DE example:** DR: secondary region Delta replicas, quarterly drill.

**Common mistake:** DR never tested.

**Interview:** DR for data platform?

**Practice:** Interview #34

### 11. Observability stack

**Concept:** Metrics, logs, traces for pipelines.

**Architecture:**

- Job duration, rows processed, lag, error rate
- OpenTelemetry, Prometheus, Datadog

**Tradeoffs:**

- Proactive vs reactive ops
- SLO dashboards

**DE example:** Grafana panel: gold table freshness heatmap.

**Common mistake:** Email-only alerts nobody reads.

**Interview:** Monitor pipelines?

**Practice:** Interview #39

### 12. Incident response runbook

**Concept:** Detect → triage → mitigate → postmortem.

**Architecture:**

1. Page on SLA breach
2. Identify failing stage
3. Rerun from checkpoint or rollback deploy
4. Blameless postmortem with action items

**Tradeoffs:**

- Runbooks reduce MTTR
- On-call rotation

**DE example:** Runbook: Kafka lag > 1h → scale consumers checklist.

**Common mistake:** No runbook — reinvent each incident.

**Interview:** Pipeline down steps?

**Practice:** Practice #8

### 13. Capacity planning

**Concept:** Forecast storage, compute, network for 12–24 months.

**Architecture:**

- Growth rate on events and users
- Layer multiplication factor (bronze×3 for silver/gold)

**Tradeoffs:**

- Under-provision → lag
- Over-provision → waste

**DE example:** Plan 40% YoY event growth, review quarterly.

**Common mistake:** Ignore retention growth.

**Interview:** Estimate Kafka retention storage?

**Practice:** Interview #4

### 14. Cost governance

**Concept:** Chargeback, budgets, optimization reviews.

**Architecture:**

- Tag jobs with `cost_center`
- Monthly top-10 expensive queries report

**Tradeoffs:**

- FinOps partnership
- Autoscaling policies

**DE example:** Spot instances for non-critical bronze transforms.

**Common mistake:** No cluster auto-termination.

**Interview:** Optimize cloud data costs?

**Practice:** Interview #35

### 15. Security and compliance

**Concept:** Encryption at rest/transit, IAM least privilege, audit logs.

**Architecture:**

- SSE-KMS on buckets
- PrivateLink for warehouse
- Column masks on PII

**Tradeoffs:**

- Compliance gates release
- SOC2 audit trail

**DE example:** All bronze buckets encrypted, no public ACLs.

**Common mistake:** Shared admin credentials.

**Interview:** Secure data lake?

**Practice:** Interview #37

### 16. Data quality framework

**Concept:** Automated checks at pipeline boundaries with quarantine and alerting.

**Architecture:**

- Great Expectations / Deequ suites
- Fail vs warn thresholds
- Quarantine bad records

**Tradeoffs:**

- Balance strictness vs availability
- Trend DQ scores over time

**DE example:** Silver gate: reject batch if null PK rate > 0.1%.

**Common mistake:** DQ only in notebooks.

**Interview:** Design DQ framework?

**Practice:** Interview #22, Practice #16

### 17. Dead letter queues

**Concept:** Isolate poison messages without blocking main pipeline.

**Architecture:**

- DLQ Kafka topic or Delta table
- Include error reason and raw payload
- Monitor depth, replay tooling

**Tradeoffs:**

- Essential for streaming
- Replay needs idempotent sink

**DE example:** Malformed JSON → `dlq.events` with `_error` column.

**Common mistake:** Infinite retry on bad message.

**Interview:** DLQ pattern?

**Practice:** Interview #23

### 18. Autoscaling compute

**Concept:** Dynamic cluster sizing based on queue depth and job metrics.

**Architecture:**

- Databricks autoscaling
- EMR managed scaling
- K8s HPA for Flink task managers

**Tradeoffs:**

- Scale-down delay avoids thrashing
- Min nodes for baseline

**DE example:** Scale 2→20 workers when Airflow queue > 10 tasks.

**Common mistake:** Fixed 100-node cluster for 1-hour daily job.

**Interview:** When autoscale vs fixed?

**Practice:** Cost chapter

## Case Studies

### 1. E-commerce order pipeline

**Requirements:** 10K orders/s peak, T+0 dashboard optional, T+1 finance exact.

**Design:** Kafka orders → Flink real-time KPIs + Spark nightly gold reconciliation.

**Key points:** Lambda pattern, idempotent MERGE, partition by `order_date`.

**Practice:** #5

### 2. Clickstream at scale

**Requirements:** 100M events/day, session analytics, funnel metrics.

**Design:** SDK → Kafka (session_id key) → bronze Connect → silver sessionization → gold funnel.

**Key points:** Watermark 30 min, state TTL on sessions.

**Practice:** #5, #7

### 3. CDC PostgreSQL to Snowflake

**Requirements:** Near-real-time sync, deletes propagated.

**Design:** Debezium → Kafka → Spark MERGE Delta staging → Snowflake MERGE.

**Key points:** Schema registry, initial snapshot, lag monitoring.

**Practice:** #6

### 4. IoT sensor platform

**Requirements:** 1M devices, 5s heartbeat, anomaly alerts.

**Design:** MQTT → Kafka → Flink rules + bronze archive → weekly batch ML retrain.

**Key points:** Quarantine invalid readings, DLQ.

**Practice:** #9

### 5. Financial ledger

**Requirements:** Exactly-once, immutable audit, 7-year retention.

**Design:** Kafka EOS → Delta MERGE on `txn_id` → WORM archive.

**Key points:** Compensating entries not updates.

**Practice:** #19

### 6. Multi-tenant SaaS analytics

**Requirements:** 1000 tenants, isolation, fair scheduling.

**Design:** `tenant_id` everywhere, RLS in warehouse, per-tenant quotas.

**Key points:** No cross-tenant leaks.

**Interview:** #29

### 7. Marketing attribution

**Requirements:** Join ad clicks to conversions, 30-day lookback.

**Design:** Bronze per channel → silver unified events → gold attribution model.

**Key points:** Identity graph, PII controls.

### 8. Real-time personalization

**Requirements:** Sub-100ms feature serving.

**Design:** Kafka → Flink features → Redis store; batch backfill from gold.

**Key points:** Point-in-time correctness.

**Practice:** #17

### 9. Hadoop to cloud migration

**Requirements:** Minimize downtime, phased cutover.

**Design:** Lift HDFS → S3 bronze, migrate Hive to Delta per domain, parallel run.

**Key points:** Avoid big-bang.

**Practice:** #3

### 10. GDPR erasure platform

**Requirements:** Delete user within 30 days all layers.

**Design:** Consent API → CDC deletes → batch purge jobs → audit log.

**Key points:** Legal hold exceptions.

**Interview:** #37

### 11. Log analytics platform

**Requirements:** Centralized search + daily metrics.

**Design:** Fluent Bit → Kafka → OpenSearch hot + S3 cold + Spark aggregations.

**Key points:** ILM policies.

### 12. Supply chain tracking

**Requirements:** Partner file drops, SLA breach alerts.

**Design:** API + SFTP bronze → silver normalized shipments → gold SLA dashboard.

**Key points:** Late files, schema variants.

### 13. Recommendation ML pipeline

**Requirements:** Daily model refresh, low train-serve skew.

**Design:** Medallion gold features → Feast offline/online → training pipeline.

**Key points:** Point-in-time joins.

**Practice:** #17

### 14. Healthcare FHIR pipeline

**Requirements:** HIPAA, de-identified analytics.

**Design:** Encrypted bronze, de-ID silver, aggregate-only gold.

**Key points:** No PHI in logs.

### 15. Interview walkthrough framework

**45-minute structure:**

1. Clarify requirements (scale, latency, sources) — 5 min
2. Capacity estimate — 5 min
3. High-level diagram — 10 min
4. Deep dive one component — 15 min
5. Failure modes, SLAs, idempotency — 5 min
6. Tradeoffs and evolution — 5 min

**Tip:** Draw ingest → process → store → serve. Always mention backfill and DQ.

**Interview:** #40


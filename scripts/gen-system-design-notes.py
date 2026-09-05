#!/usr/bin/env python3
"""Generate system-design-notes.md content."""

from pathlib import Path

FRONTMATTER = """---
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

"""


def section_block(num, title, concept, arch, tradeoffs, de_example, mistake, interview, practice_ref):
    return f"""### {num}. {title}

**Concept:** {concept}

**Architecture:**

{arch}

**Tradeoffs:**

{tradeoffs}

**DE example:** {de_example}

**Common mistake:** {mistake}

**Interview:** {interview}

**Practice:** {practice_ref}

"""


def case_block(num, title, body):
    return f"""### {num}. {title}

{body}

"""


def build_chapter(title, topics):
    out = f"## {title}\n\n"
    for i, t in enumerate(topics, 1):
        if len(t) != 8:
            raise ValueError(f"Topic {t[0]!r} has {len(t)} elements, expected 8")
        out += section_block(i, *t)
    return out


def main():
    ch1 = build_chapter("Batch vs Streaming", [
        ("Processing paradigms", "Batch processes bounded datasets in scheduled jobs; streaming processes unbounded events continuously with low latency.", "- **Batch:** Airflow DAG → Spark → Delta gold\n- **Streaming:** Kafka → Flink/Spark Streaming → serving layer\n- **Micro-batch:** Spark Structured Streaming (trigger interval)", "- Batch: simpler correctness, cheaper\n- Stream: lower latency, higher ops complexity\n- Micro-batch: compromise latency vs exactly-once", "Daily 500 GB log files → nightly Spark job. Fraud alerts → Kafka + Flink < 1s.", "Choosing streaming for a daily report that only needs T+1 freshness.", "When would you use Lambda vs Kappa?", "Practice #1, #2, #7"),
        ("Lambda architecture", "Combines speed layer (stream) and batch layer (batch) with a serving layer that merges views.", "```\nSources → [Stream path] → Real-time view\n       → [Batch path]  → Batch view → Serving (merge)\n```", "- Accurate historical batch + fast approximate stream\n- Dual pipeline maintenance\n- Reconciliation between layers required", "Clickstream: Flink 5-min counts + Spark daily exact counts; dashboard shows stream, finance uses batch.", "Ignoring reconciliation — numbers never match between layers.", "How do you reconcile Lambda layers?", "Practice #5"),
        ("Kappa architecture", "Single stream processing path; reprocess history by replaying the log.", "```\nSources → Kafka (immutable log) → Stream processor → Sink\n                    ↑ replay for new logic / backfill\n```", "- One codebase\n- Replay can be expensive at scale\n- Requires durable log with long retention", "New aggregation logic: deploy job, reset offsets, replay 30-day retention.", "Replaying without capacity planning — overwhelms consumers.", "What are replay tradeoffs in Kappa?", "Practice #14"),
        ("Micro-batch (Structured Streaming)", "Spark treats stream as series of small batch jobs with watermarking.", "- `readStream` → transformations → `writeStream`\n- Trigger: `processingTime='1 minute'`\n- Checkpoint dir for fault tolerance", "- Easier for Spark teams\n- Latency floor = trigger interval\n- Not true record-by-record for all ops", "IoT aggregates every 30s using processingTime trigger.", "Using processingTime when event-time ordering matters.", "Explain watermarks in Spark Streaming.", "Practice #7"),
        ("Event time vs processing time", "Event time = when event occurred; processing time = when pipeline processed it.", "- Always prefer `timestamp` column from payload for windows\n- Watermark: `withWatermark('event_time', '10 minutes')`", "- Event time: correct under delay\n- Processing time: simpler, wrong under lag", "Mobile clicks arriving late: 15-min allowed lateness, drop or side-output late data.", "Windowing on ingest time when events can arrive out of order.", "How handle late data?", "Interview #19"),
        ("Windowing strategies", "Tumbling (fixed, non-overlapping), sliding (overlap), session (gap-based).", "- Flink: `Tumble`, `Slide`, `Session` windows on event time\n- Group by key for per-entity windows", "- Smaller windows → more state, more output\n- Session windows need gap tuning", "Session analytics: 30-min gap groups user clicks into sessions.", "Global windows without keys — cannot scale.", "Difference tumbling vs sliding?", "Practice #5"),
        ("Message queues vs streams", "Queue: competing consumers, message deleted after ack. Log: retained, replayable, ordered per partition.", "| Queue (SQS) | Log (Kafka) |\n|-------------|-------------|\n| Point-to-point | Pub-sub + replay |\n| Fire-and-forget | Durable retention |", "- Queue for task distribution\n- Log for event sourcing and CDC", "Order fulfillment tasks → SQS. Order events for analytics → Kafka.", "Using SQS when multiple consumers need same events.", "Kafka vs RabbitMQ for DE?", "Interview #4"),
        ("Apache Kafka core model", "Distributed commit log: producers write to topics; consumers read with offset.", "- Topic → N partitions\n- Replication factor for durability\n- ISR for leader election", "- Partitions enable parallelism\n- More partitions → more overhead", "Payments topic: 24 partitions, key=`account_id`, RF=3.", "Too few partitions — cannot scale consumers.", "Explain partitions and consumer groups.", "Interview #4, #5"),
        ("Kafka producers and consumers", "Producers batch and compress; consumers poll and commit offsets.", "- `acks=all` for durability\n- Idempotent producer: `enable.idempotence=true`\n- Manual commit after successful sink write", "- Sync produce: safer, slower\n- Async: higher throughput, risk on failure", "Finance producer: acks=all, idempotent, Snappy compression.", "Auto-commit before processing — can lose messages on crash.", "How achieve at-least-once consumption?", "Interview #5"),
        ("Stream processing engines", "Flink: true streaming, low latency. Spark Streaming: micro-batch. Kafka Streams: library embedded in apps.", "| Engine | Strength |\n|--------|----------|\n| Flink | Stateful CEP, exactly-once |\n| Spark SS | Unified batch/stream API |\n| ksqlDB | SQL on Kafka |", "- Flink ops learning curve\n- Spark team velocity on SS", "CEP for fraud: Flink pattern detection on transaction stream.", "Running heavy stateful joins without keyed streams.", "Flink vs Spark Streaming?", "Practice #5, #12"),
        ("Unified batch and stream (Spark 3+)", "Same DataFrame API; batch = bounded, stream = unbounded.", "- `spark.read` vs `spark.readStream`\n- `foreachBatch` for custom MERGE to Delta", "- Code reuse across modes\n- Stream-specific: watermarks, output modes", "Single silver MERGE logic in `foreachBatch` for CDC stream.", "Sharing code without testing stream edge cases.", "How use foreachBatch with Delta?", "Interview #33"),
        ("When NOT to stream", "If latency requirement is hours/days, batch is simpler and cheaper.", "Signals: T+1 SLA, bounded daily volume, no real-time alerts, team lacks streaming ops.", "- Avoid premature streaming\n- Start batch, add stream when SLA demands", "Weekly regulatory report — batch only.", "Streaming because it is trendy.", "Convince stakeholder to stay batch?", "Interview #1"),
        ("Hybrid ingestion patterns", "Kafka Connect, Fivetran, ADF copy, Spark autoloader for different sources.", "- DB CDC → Debezium Connect\n- Files → Autoloader / COPY INTO\n- APIs → scheduled pull to bronze", "- Managed vs custom\n- Cost per connector", "S3 logs: Autoloader with schema inference + evolution.", "One-off scripts without orchestration.", "Compare Autoloader vs COPY INTO.", "Practice #1"),
        ("Orchestration for batch", "Airflow, Dagster, Prefect schedule and depend batch jobs.", "- Sensors wait for data arrival\n- Retries with exponential backoff\n- SLAs and alerting built-in", "- Airflow: mature, YAML-heavy\n- Dagster: asset-centric lineage", "Airflow DAG: bronze → silver → gold with TaskGroup per domain.", "No dependency between silver and gold — race conditions.", "Airflow vs Databricks Jobs?", "Interview #38"),
        ("Capacity estimation", "Back-of-envelope: events/sec × payload size × retention; partition count; shuffle size.", "Example: 10K evt/s × 2 KB × 86400 s ≈ 1.7 TB/day raw.", "- 2× headroom for peaks\n- Storage = raw × replication × layers", "Justify 32 Kafka partitions: target 10 MB/s per partition.", "Skipping estimation — surprise bills and lag.", "Estimate storage for 1M events/min?", "Case study prep"),
        ("Kafka retention and replay", "Brokers retain log segments by time or size; consumers control offset.", "- `retention.ms`, `retention.bytes`\n- Compacted topics for changelog\n- Consumer `auto.offset.reset=earliest` for replay", "- Long retention = storage cost\n- Replay impacts downstream and source if re-fetching", "7-day retention for order events; compacted customer dimension topic.", "Replay production topic without throttling consumers.", "How long retain Kafka data?", "Interview #6"),
        ("Delivery semantics", "At-most-once, at-least-once, exactly-once — pick based on business tolerance.", "| Semantic | Behavior |\n|----------|----------|\n| At-most-once | May lose messages |\n| At-least-once | May duplicate |\n| Exactly-once | No dup/loss (hard) |", "- Exactly-once needs transactional sinks\n- At-least-once + idempotent MERGE is pragmatic", "Payments: at-least-once Kafka + MERGE on `txn_id`.", "Claiming exactly-once without end-to-end proof.", "Explain EOS Kafka to Delta.", "Interview #5, #33"),
        ("Batch scheduling patterns", "Cron, event-driven, and data-aware triggers for pipeline starts.", "- Cron: daily 2 AM\n- File arrival sensor: S3 prefix\n- Upstream DAG sensor in Airflow", "- Event-driven reduces idle wait\n- Sensors can cause deadlock if misconfigured", "Trigger silver when bronze partition `_ingest_date=today` has files.", "Hard-coded dates in backfill scripts.", "Sensor vs schedule?", "Practice #1"),
    ])

    ch2 = build_chapter("CDC & Lakehouse", [
        ("Change Data Capture overview", "Captures row-level changes (INSERT, UPDATE, DELETE) from operational databases.", "- Log-based: read transaction log (WAL/binlog)\n- Query-based: poll on `updated_at`\n- Trigger-based: DB triggers (avoid in prod)", "- Log-based: low impact, complete\n- Poll: misses deletes without soft delete", "Debezium tails Postgres WAL → Kafka.", "Polling large table full scan every minute.", "CDC methods comparison?", "Interview #7, #8"),
        ("Debezium architecture", "Kafka Connect source connector emits change events with `before`, `after`, `op`.", "```\nPostgres WAL → Debezium → Kafka topic(s)\nSchema history → separate topic\n```", "- Single message per row change\n- Schema evolution via Apicurio/Confluent Registry", "Customers table CDC with primary key `id`.", "Not monitoring connector lag vs DB.", "What is in a Debezium event?", "Practice #6"),
        ("Handling deletes in CDC", "Delete events have `op=d` and `before` payload; tombstones in compacted topics.", "- Soft delete in source simplifies\n- Hard delete: propagate tombstone or `is_deleted` flag in silver", "- Tombstones: compaction removes history\n- Audit may require delete log table", "GDPR delete: CDC delete → purge silver/gold rows.", "Ignoring deletes — ghost records in warehouse.", "How propagate deletes to Snowflake?", "Practice #6"),
        ("Schema Registry", "Central contract for Avro/Protobuf/JSON schemas; compatibility modes.", "- BACKWARD: new consumers read old data\n- FORWARD: old consumers read new data\n- FULL: both", "- Prevents breaking producers\n- Requires CI for schema changes", "Avro schema for `orders` with optional `discount_code`.", "Deploying incompatible schema Friday night.", "Schema compatibility modes?", "Interview #20"),
        ("Data lake fundamentals", "Cheap object storage holding raw and processed files in open formats.", "- S3 / ADLS / GCS\n- Formats: Parquet, ORC, Avro, JSON\n- Hive metastore or Glue Catalog", "- Schema-on-read flexibility\n- No ACID without table format", "10 PB raw JSON logs in S3 `s3://datalake/bronze/`.", "Storing small JSON files unpartitioned.", "Lake vs warehouse?", "Interview #9"),
        ("Data warehouse role", "Optimized analytical SQL engine with governance and BI integration.", "- Snowflake, BigQuery, Redshift, Synapse\n- Columnar, caching, result reuse", "- Higher cost per TB\n- Less flexible for ML raw features", "Gold marts in Snowflake for Tableau.", "Dumping all raw data into warehouse — cost explosion.", "When keep warehouse vs lake only?", "Interview #9"),
        ("Lakehouse definition", "ACID tables on object storage bridging lake economics and warehouse features.", "- Delta Lake, Iceberg, Hudi\n- Time travel, MERGE, schema enforcement\n- Open engines query same tables", "- Less mature than native warehouse for some BI\n- Ops for compaction", "Enterprise standard: Delta bronze/silver, Snowflake gold BI.", "Lakehouse without governance catalog.", "What problems does lakehouse solve?", "Interview #10"),
        ("Delta Lake internals", "Transaction log (`_delta_log`) provides ACID; Parquet data files.", "- Optimistic concurrency\n- `MERGE`, `UPDATE`, `DELETE` SQL\n- `OPTIMIZE` + `ZORDER` for layout", "- Databricks optimized\n- Lock service needed on some clouds", "Hourly `MERGE` CDC into `silver.customers`.", "Never running OPTIMIZE — read amplification.", "How does Delta achieve ACID?", "Interview #11"),
        ("Apache Iceberg internals", "Metadata tree: snapshots, manifests, manifest lists; hidden partitioning.", "- Snapshot isolation\n- Partition evolution without rewrite\n- Multi-engine (Spark, Flink, Trino)", "- More moving parts in metadata\n- Growing ecosystem", "Trino federated queries on Iceberg silver.", "User-facing partition columns when hidden partitions exist.", "Iceberg vs Delta?", "Interview #11, Practice #11"),
        ("Apache Hudi", "Record-level indexing (Bloom, HBase) for upserts; incremental pulls.", "- MoR vs CoW table types\n- Useful for frequent upserts on PK", "- MoR: faster write, slower read until compaction\n- CoW: opposite", "CDC upserts to Hudi MoR table on S3.", "CoW for high-frequency updates.", "When choose Hudi?", "Lakehouse comparison"),
        ("Table format selection", "Decision matrix based on platform, engines, and team.", "| Criteria | Delta | Iceberg | Hudi |\n|----------|-------|---------|------|\n| Databricks | ★★★ | ★★ | ★ |\n| Multi-engine | ★★ | ★★★ | ★★ |", "- Avoid three formats in one org\n- Standardize with escape hatch", "Multi-cloud analytics → Iceberg.", "Different formats per team — governance nightmare.", "Pitch Iceberg to mixed engine team.", "Practice #11"),
        ("Unity Catalog and Glue", "Central governance: databases, tables, ACLs, lineage.", "- Row/column masks\n- External locations for storage creds\n- Lineage from jobs", "- Single source of truth\n- Setup effort", "Unity Catalog three-level namespace `catalog.schema.table`.", "Wild-west S3 paths without catalog registration.", "How enforce RBAC on gold?", "Governance"),
        ("CDC to lakehouse pipeline", "End-to-end: source DB → Debezium → Kafka → Spark/Flink → Delta/Iceberg.", "```\nOLTP → Debezium → Kafka → Structured Streaming → MERGE silver\n```", "- End-to-end latency minutes typical\n- Ordering per PK partition", "Postgres → Delta silver in 5 min P95.", "MERGE without primary key — duplicates.", "Design CDC to Delta.", "Practice #6"),
        ("Snapshot vs incremental extraction", "Full snapshot periodic vs CDC incremental.", "- Snapshot: simple, heavy on source\n- CDC: efficient, complex", "- Initial load: snapshot then CDC\n- Hybrid for dimension tables", "Initial 10M row snapshot + ongoing CDC.", "CDC without initial snapshot baseline.", "Initial load strategy?", "Practice #6"),
        ("Data lake zones", "Landing (raw), curated (cleaned), consumption (marts) — aligns with medallion.", "- Landing: short retention optional\n- Curated: long retention, governed", "- Clear ownership per zone\n- Lifecycle policies per zone", "Landing 7-day retention; curated 7-year with Glacier tiering.", "Same bucket, no prefix isolation.", "Zone vs medallion layer?", "Medallion chapter"),
        ("Open formats comparison", "Parquet columnar default; Avro for Kafka row serialization; JSON for flexibility.", "| Format | Use case |\n|--------|----------|\n| Parquet | Analytics lake tables |\n| Avro | Kafka + schema registry |\n| JSON | Semi-structured bronze |", "- Parquet: best compression for analytics\n- Avro: schema evolution in streaming", "Bronze JSON → silver Parquet/Delta.", "JSON in gold serving layer — slow queries.", "Parquet vs Avro?", "Interview #9"),
        ("External vs managed tables", "External: data in your bucket; managed: platform controls location.", "- External: portable, you manage lifecycle\n- Managed: simpler ops, vendor lock", "- Lakehouse typically external tables on S3\n- Warehouse native tables for gold", "Delta external table on `s3://corp-datalake/silver/`.", "No lifecycle policy on external bucket.", "External table tradeoffs?", "Lakehouse"),
        ("Time travel and auditing", "Query historical snapshots for debugging and compliance.", "- Delta: `VERSION AS OF` / `TIMESTAMP AS OF`\n- Iceberg: snapshot id", "- Storage of old files until vacuum\n- Audit investigations", "Reproduce March revenue report with March 15 snapshot.", "Aggressive VACUUM deleting audit history.", "Time travel use cases?", "Practice #18"),
    ])

    ch3 = build_chapter("Medallion Architecture", [
        ("Medallion overview", "Databricks pattern: Bronze (raw), Silver (cleaned), Gold (business-ready).", "```\nSources → Bronze → Silver → Gold → BI/ML\n```", "- Progressive trust and quality\n- Clear replay boundaries", "Enterprise analytics platform standard layout.", "Skipping silver — dirty data in gold.", "Explain three layers.", "Interview #12"),
        ("Bronze layer design", "Immutable raw ingest with metadata columns.", "Required columns: `_ingest_timestamp`, `_source_system`, `_raw_file` or `_offset`", "- Append-only\n- No business transforms\n- Cheap storage class OK", "API JSON landed with `_payload` string column.", "Mutating bronze on correction.", "Bronze best practices?", "Interview #13, Practice #4"),
        ("Silver layer design", "Conformed, deduplicated, typed entities aligned to enterprise model.", "- Surrogate keys\n- SCD Type 2 for dims\n- DQ validation gates", "- Most engineering effort here\n- Reusable across use cases", "`silver.customer` SCD2 with `valid_from`, `valid_to`.", "Different silver models per downstream team.", "Silver responsibilities?", "Interview #14"),
        ("Gold layer design", "Purpose-built datasets for BI, ML, and APIs.", "- Star schema or wide feature tables\n- Denormalized for query speed\n- Documented grain", "- Duplication OK for performance\n- Tied to SLA tiers", "`gold.daily_revenue_by_region` grain: day × region.", "Gold tables with unclear grain.", "Gold vs semantic layer?", "Interview #15"),
        ("SCD Type 1 vs 2", "Type 1 overwrite; Type 2 history with new row.", "- Type 1: simple, no history\n- Type 2: audit, point-in-time correct", "- Type 1 loses history\n- Type 2 storage growth", "Customer address: Type 2 for compliance; status flag: Type 1.", "Type 2 on high-churn table without archive policy.", "When SCD2?", "Practice #10"),
        ("Incremental MERGE pattern", "Upsert new/changed rows using SQL MERGE or DataFrame API.", "```sql\nMERGE INTO silver.orders t\nUSING staging s ON t.id = s.id\nWHEN MATCHED THEN UPDATE ...\nWHEN NOT MATCHED THEN INSERT ...\n```", "- Idempotent per batch\n- Needs match key + ordering for CDC", "CDC stream `foreachBatch` MERGE every minute.", "MERGE without dedupe — duplicates on replay.", "Idempotent MERGE?", "Interview #16"),
        ("Dedup strategies", "Window function ROW_NUMBER, dropDuplicates, or merge with latest timestamp.", "- `ROW_NUMBER() OVER (PARTITION BY id ORDER BY ts DESC) = 1`\n- Compacted Kafka changelog", "- Window dedupe costs shuffle\n- Keep latest by sequence number for CDC", "Orders dedupe on `order_id` keeping max `event_seq`.", "Dedupe only in gold — silver still duplicated.", "Dedupe in streaming?", "Practice #9"),
        ("Data contracts between layers", "Explicit schema, SLAs, and ownership documented per table.", "- Contract YAML in repo\n- Breaking change = major version", "- Enables parallel team development\n- CI validates contracts", "`contracts/silver_orders.yaml` with required columns.", "Tribal knowledge only.", "What is a data contract?", "Interview #20"),
        ("Domain-driven medallion", "Align bronze/silver/gold per domain (sales, marketing) not single monolith.", "- Domain teams own silver/gold\n- Platform provides bronze patterns", "- Federation vs consistency tradeoff\n- Data mesh alignment", "Sales domain owns `silver.sales_*` tables.", "One team owns all gold — bottleneck.", "Medallion vs data mesh?", "Interview #36"),
        ("Cross-domain joins", "Conformed dimensions (date, customer) in shared silver; facts domain-specific.", "- Shared `silver.dim_date`\n- Avoid gold-to-gold joins across domains in BI", "- Conformed dims reduce duplication\n- Governance on shared entities", "Join `gold.sales` to `silver.dim_customer` via surrogate key.", "Each domain defines own customer ID.", "Conformed dimensions?", "Practice #10"),
        ("Medallion for streaming", "Bronze from Kafka Connect; silver via streaming MERGE; gold micro-batch or batch.", "- Bronze: raw events\n- Silver: sessionization, enrichment\n- Gold: rolling aggregates", "- Stream silver, batch gold common\n- Latency tiers per layer", "Bronze Kafka → silver enriched events → gold 5-min KPIs.", "Same batch job for all layers — latency mismatch.", "Streaming medallion?", "Practice #5"),
        ("Testing medallion pipelines", "Unit tests on transforms, integration on sample data, contract tests on schemas.", "- `pytest` + local Spark\n- CI runs on PR\n- Reconciliation tests bronze vs source counts", "- Shift-left quality\n- Slower CI if not parallelized", "Assert silver row count within 0.1% of bronze after filters.", "Prod-only testing.", "How test pipelines?", "DQ chapter"),
        ("Lineage and impact analysis", "Track data flow bronze → gold for breaking change impact.", "- OpenLineage, Unity Catalog lineage\n- Tag PII columns", "- Required for compliance\n- Enables safe refactors", "Impact: changing `silver.orders` schema flags 12 gold jobs.", "No lineage — blind deploys.", "Why lineage matters?", "Observability"),
        ("Versioning gold tables", "`orders_daily_v2` or feature flags during migration.", "- Dual-write period\n- Compare metrics\n- Cutover via view swap", "- Safer migrations\n- Temporary storage cost", "Run v1 and v2 gold parallel for 2 weeks.", "Big-bang gold rewrite.", "Safe gold migration?", "Practice #14"),
        ("Anti-patterns", "Gold in bronze, mutable bronze, skipping DQ, monolithic gold warehouse.", "List: hero ETL scripts, no ownership, no freshness monitors.", "- Recognize in legacy systems\n- Plan incremental remediation", "Audit found 400 tables in bronze used directly by BI.", "Boil the ocean rewrite.", "Medallion anti-patterns?", "Interview #12"),
        ("Compaction and file layout", "Optimize small files into larger objects for read performance.", "- Delta `OPTIMIZE` + `ZORDER`\n- Iceberg rewrite data files\n- Target 128MB–1GB per file", "- Compaction consumes compute\n- Schedule off-peak", "Weekly OPTIMIZE on high-write silver tables.", "Millions of 10KB files in bronze.", "Small file problem?", "Interview #32"),
        ("PII handling in medallion", "Hash/tokenize early; restrict gold exposure.", "- Bronze may contain raw PII (encrypted)\n- Silver: tokenize\n- Gold: aggregates only where possible", "- Compliance vs analytics utility\n- Right to erasure complexity", "Email hashed SHA-256 with salt in silver.", "PII in wide gold table exported to Excel.", "PII in pipelines?", "Interview #21"),
    ])

    ch4 = build_chapter("Scalability & Reliability", [
        ("Horizontal vs vertical scaling", "Scale out (more nodes) vs scale up (bigger nodes).", "- Data pipelines prefer horizontal\n- Shuffle-bound jobs may need fat executors temporarily", "- Horizontal: elasticity\n- Vertical: limits hit eventually", "Kafka: add partitions and consumers.", "Only vertical scaling on single-node ETL.", "Scale Kafka consumers?", "Interview #24"),
        ("Partitioning strategies", "Divide data for parallelism and pruning.", "- Time: `year/month/day`\n- Entity: `region`, `tenant_id`\n- Avoid skewed keys alone", "- Right partition = fast queries\n- Wrong = small files or hotspots", "Partition gold by `order_date`, Z-order `customer_id`.", "Partition on low-cardinality only — huge files.", "Choose partition column?", "Interview #31"),
        ("Data skew mitigation", "Salting, adaptive query execution, broadcast joins, isolate heavy keys.", "- `salt_key = concat(id, floor(rand()*10))`\n- AQE coalesce skewed partitions", "- Skew causes stragglers\n- Monitor stage duration variance", "Join on skewed `product_id='OTHER'` — broadcast dim.", "Ignore straggler tasks.", "Fix skew in Spark?", "Interview #24"),
        ("Fault tolerance in batch", "Idempotent tasks, retry, checkpoint intermediate results.", "- Airflow `retries=3`\n- Write to staging then atomic promote\n- Partition overwrite idempotent", "- Transient failures expected\n- Non-idempotent writes dangerous", "Write to `staging/`, validate, `ALTER TABLE SWAP`.", "Partial write without transaction.", "Idempotent batch writes?", "Interview #16"),
        ("Fault tolerance in streaming", "Checkpointing, WAL, exactly-once sinks.", "- Spark: checkpoint directory\n- Flink: checkpoint to durable storage\n- Kafka: offset commit after process", "- Recovery from last checkpoint\n- State rebuild time matters", "Flink 60s checkpoint interval, EXACTLY_ONCE mode.", "Delete checkpoint dir casually.", "Streaming recovery?", "Interview #25"),
        ("SLA dimensions", "Freshness, completeness, accuracy, availability.", "| Metric | Example |\n|--------|----------|\n| Freshness | Gold < 2h behind source |\n| Completeness | 99.9% row match |\n| Accuracy | DQ rules pass |\n| Availability | 99.5% job success |", "- Tier SLAs by business criticality\n- Measure objectively", "Tier-1 `fact_orders`: 1h freshness, page on breach.", "SLA without measurement.", "Define pipeline SLA?", "Interview #18, Practice #8"),
        ("Backfill design", "Reprocess historical data after logic change or new metric.", "Steps: freeze offsets / snapshot state → batch reprocess range → validate → resume stream → swap tables", "- Resource intensive\n- Coordinate with downstream consumers", "Backfill 90 days orders for new tax column.", "Backfill prod without notifying consumers.", "Backfill while streaming?", "Interview #17, Practice #14"),
        ("Idempotency patterns", "Deterministic output for same input regardless of run count.", "- Natural/business keys\n- `MERGE` not blind `INSERT`\n- Dedupe on `event_id`", "- Foundation for at-least-once\n- Required for backfill safety", "Ledger: upsert on `transaction_id`.", "Auto-increment surrogate in streaming sink.", "Idempotency in DE?", "Interview #16"),
        ("Circuit breaker and rate limiting", "Protect source systems and sinks from overload.", "- Token bucket on API ingest\n- Pause consumer on downstream failure\n- Exponential backoff", "- Prevents cascade failures\n- May increase lag temporarily", "Throttle JDBC extract to 1000 rows/s.", "Hammer source DB during backfill.", "Protect OLTP from ETL?", "CDC chapter"),
        ("Multi-AZ and disaster recovery", "Replicate storage and compute across zones/regions.", "- S3 cross-region replication\n- Kafka MirrorMaker 2\n- RPO/RTO documented", "- Cost of standby\n- Failover testing required", "DR: secondary region Delta replicas, quarterly drill.", "DR never tested.", "DR for data platform?", "Interview #34"),
        ("Observability stack", "Metrics, logs, traces for pipelines.", "- Job duration, rows processed, lag, error rate\n- OpenTelemetry, Prometheus, Datadog", "- Proactive vs reactive ops\n- SLO dashboards", "Grafana panel: gold table freshness heatmap.", "Email-only alerts nobody reads.", "Monitor pipelines?", "Interview #39"),
        ("Incident response runbook", "Detect → triage → mitigate → postmortem.", "1. Page on SLA breach\n2. Identify failing stage\n3. Rerun from checkpoint or rollback deploy\n4. Blameless postmortem with action items", "- Runbooks reduce MTTR\n- On-call rotation", "Runbook: Kafka lag > 1h → scale consumers checklist.", "No runbook — reinvent each incident.", "Pipeline down steps?", "Practice #8"),
        ("Capacity planning", "Forecast storage, compute, network for 12–24 months.", "- Growth rate on events and users\n- Layer multiplication factor (bronze×3 for silver/gold)", "- Under-provision → lag\n- Over-provision → waste", "Plan 40% YoY event growth, review quarterly.", "Ignore retention growth.", "Estimate Kafka retention storage?", "Interview #4"),
        ("Cost governance", "Chargeback, budgets, optimization reviews.", "- Tag jobs with `cost_center`\n- Monthly top-10 expensive queries report", "- FinOps partnership\n- Autoscaling policies", "Spot instances for non-critical bronze transforms.", "No cluster auto-termination.", "Optimize cloud data costs?", "Interview #35"),
        ("Security and compliance", "Encryption at rest/transit, IAM least privilege, audit logs.", "- SSE-KMS on buckets\n- PrivateLink for warehouse\n- Column masks on PII", "- Compliance gates release\n- SOC2 audit trail", "All bronze buckets encrypted, no public ACLs.", "Shared admin credentials.", "Secure data lake?", "Interview #37"),
        ("Data quality framework", "Automated checks at pipeline boundaries with quarantine and alerting.", "- Great Expectations / Deequ suites\n- Fail vs warn thresholds\n- Quarantine bad records", "- Balance strictness vs availability\n- Trend DQ scores over time", "Silver gate: reject batch if null PK rate > 0.1%.", "DQ only in notebooks.", "Design DQ framework?", "Interview #22, Practice #16"),
        ("Dead letter queues", "Isolate poison messages without blocking main pipeline.", "- DLQ Kafka topic or Delta table\n- Include error reason and raw payload\n- Monitor depth, replay tooling", "- Essential for streaming\n- Replay needs idempotent sink", "Malformed JSON → `dlq.events` with `_error` column.", "Infinite retry on bad message.", "DLQ pattern?", "Interview #23"),
        ("Autoscaling compute", "Dynamic cluster sizing based on queue depth and job metrics.", "- Databricks autoscaling\n- EMR managed scaling\n- K8s HPA for Flink task managers", "- Scale-down delay avoids thrashing\n- Min nodes for baseline", "Scale 2→20 workers when Airflow queue > 10 tasks.", "Fixed 100-node cluster for 1-hour daily job.", "When autoscale vs fixed?", "Cost chapter"),
    ])

    case_studies = [
        ("E-commerce order pipeline", "**Requirements:** 10K orders/s peak, T+0 dashboard optional, T+1 finance exact.\n\n**Design:** Kafka orders → Flink real-time KPIs + Spark nightly gold reconciliation.\n\n**Key points:** Lambda pattern, idempotent MERGE, partition by `order_date`.\n\n**Practice:** #5"),
        ("Clickstream at scale", "**Requirements:** 100M events/day, session analytics, funnel metrics.\n\n**Design:** SDK → Kafka (session_id key) → bronze Connect → silver sessionization → gold funnel.\n\n**Key points:** Watermark 30 min, state TTL on sessions.\n\n**Practice:** #5, #7"),
        ("CDC PostgreSQL to Snowflake", "**Requirements:** Near-real-time sync, deletes propagated.\n\n**Design:** Debezium → Kafka → Spark MERGE Delta staging → Snowflake MERGE.\n\n**Key points:** Schema registry, initial snapshot, lag monitoring.\n\n**Practice:** #6"),
        ("IoT sensor platform", "**Requirements:** 1M devices, 5s heartbeat, anomaly alerts.\n\n**Design:** MQTT → Kafka → Flink rules + bronze archive → weekly batch ML retrain.\n\n**Key points:** Quarantine invalid readings, DLQ.\n\n**Practice:** #9"),
        ("Financial ledger", "**Requirements:** Exactly-once, immutable audit, 7-year retention.\n\n**Design:** Kafka EOS → Delta MERGE on `txn_id` → WORM archive.\n\n**Key points:** Compensating entries not updates.\n\n**Practice:** #19"),
        ("Multi-tenant SaaS analytics", "**Requirements:** 1000 tenants, isolation, fair scheduling.\n\n**Design:** `tenant_id` everywhere, RLS in warehouse, per-tenant quotas.\n\n**Key points:** No cross-tenant leaks.\n\n**Interview:** #29"),
        ("Marketing attribution", "**Requirements:** Join ad clicks to conversions, 30-day lookback.\n\n**Design:** Bronze per channel → silver unified events → gold attribution model.\n\n**Key points:** Identity graph, PII controls."),
        ("Real-time personalization", "**Requirements:** Sub-100ms feature serving.\n\n**Design:** Kafka → Flink features → Redis store; batch backfill from gold.\n\n**Key points:** Point-in-time correctness.\n\n**Practice:** #17"),
        ("Hadoop to cloud migration", "**Requirements:** Minimize downtime, phased cutover.\n\n**Design:** Lift HDFS → S3 bronze, migrate Hive to Delta per domain, parallel run.\n\n**Key points:** Avoid big-bang.\n\n**Practice:** #3"),
        ("GDPR erasure platform", "**Requirements:** Delete user within 30 days all layers.\n\n**Design:** Consent API → CDC deletes → batch purge jobs → audit log.\n\n**Key points:** Legal hold exceptions.\n\n**Interview:** #37"),
        ("Log analytics platform", "**Requirements:** Centralized search + daily metrics.\n\n**Design:** Fluent Bit → Kafka → OpenSearch hot + S3 cold + Spark aggregations.\n\n**Key points:** ILM policies."),
        ("Supply chain tracking", "**Requirements:** Partner file drops, SLA breach alerts.\n\n**Design:** API + SFTP bronze → silver normalized shipments → gold SLA dashboard.\n\n**Key points:** Late files, schema variants."),
        ("Recommendation ML pipeline", "**Requirements:** Daily model refresh, low train-serve skew.\n\n**Design:** Medallion gold features → Feast offline/online → training pipeline.\n\n**Key points:** Point-in-time joins.\n\n**Practice:** #17"),
        ("Healthcare FHIR pipeline", "**Requirements:** HIPAA, de-identified analytics.\n\n**Design:** Encrypted bronze, de-ID silver, aggregate-only gold.\n\n**Key points:** No PHI in logs."),
        ("Interview walkthrough framework", "**45-minute structure:**\n\n1. Clarify requirements (scale, latency, sources) — 5 min\n2. Capacity estimate — 5 min\n3. High-level diagram — 10 min\n4. Deep dive one component — 15 min\n5. Failure modes, SLAs, idempotency — 5 min\n6. Tradeoffs and evolution — 5 min\n\n**Tip:** Draw ingest → process → store → serve. Always mention backfill and DQ.\n\n**Interview:** #40"),
    ]

    ch5 = "## Case Studies\n\n"
    for i, (title, body) in enumerate(case_studies, 1):
        ch5 += case_block(i, title, body)

    content = FRONTMATTER + ch1 + ch2 + ch3 + ch4 + ch5
    out_path = Path(__file__).resolve().parents[1] / "content/topics/system-design-notes.md"
    out_path.write_text(content)
    line_count = content.count("\n") + 1
    print(f"Wrote {out_path} ({line_count} lines)")


if __name__ == "__main__":
    main()

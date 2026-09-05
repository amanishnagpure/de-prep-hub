---
title: System Design Interview Q&A
description: 40 conceptual system design questions for Data Engineering interviews
parent: system-design
hidden: true
order: 3
difficulty: interview
---

# System Design Interview Flashcards

### 1. Batch vs streaming — when to choose each?

Batch: bounded datasets, high throughput, simpler exactly-once, cheaper compute (spot), daily/hourly SLAs. Streaming: sub-minute latency, unbounded events, real-time dashboards/alerts, CDC propagation. Lambda: both paths. Kappa: single stream reprocess. DE: start batch unless latency requirement forces streaming.

### 2. What is Lambda architecture?

Speed layer (stream) + batch layer (historical) + serving layer merge. Pros: mature patterns. Cons: dual code paths, reconciliation complexity. Modern DE often replaces with lakehouse + streaming tables or unified batch/stream engine (Spark Structured Streaming, Flink).

### 3. What is Kappa architecture?

All data through a single stream; reprocess history by replaying Kafka from offset 0 with new logic. Pros: one pipeline. Cons: replay cost, schema evolution on replay, long recovery. Good when event log is source of truth.

### 4. Explain Kafka topics, partitions, and consumer groups.

Topic = logical stream. Partition = ordered, immutable log shard; key determines partition. Consumer group = cooperative consumers; one consumer per partition max for ordered processing. DE: partition by entity key for ordering; scale consumers ≤ partitions.

### 5. What is Kafka exactly-once semantics?

Producer idempotence + transactions (read-process-write). Requires idempotent producer, transactional writes to Kafka and external sink, or EOS in Kafka Connect / Flink. At-least-once + idempotent sink is often simpler in practice.

### 6. How does Kafka retention work?

Time-based (retention.ms) or size-based. Compacted topics keep latest key. DE: balance replay window vs storage; compacted changelog for CDC; delete policy for raw events with downstream lake archive.

### 7. What is CDC (Change Data Capture)?

Capture row-level inserts/updates/deletes from OLTP. Methods: transaction log tailing (Debezium), triggers, timestamp polling. Delivers ordered change events to Kafka/lake. DE: enables near-real-time warehouse sync without full extracts.

### 8. Debezium vs custom JDBC polling?

Debezium: log-based, low latency, captures deletes, schema history topic. JDBC poll: simpler, higher latency, misses deletes without soft-delete column, load on source DB. Prefer log-based for production CDC.

### 9. Data lake vs data warehouse?

Lake: cheap object storage (S3/ADLS), schema-on-read, raw/semi-structured, open formats (Parquet, Delta). Warehouse: optimized columnar store (Snowflake, BigQuery), schema-on-write, SQL BI, governance. Lakehouse merges both with ACID tables on lake.

### 10. What is a lakehouse?

ACID transactions, time travel, schema enforcement on data lake (Delta Lake, Iceberg, Hudi). Unified batch + streaming, BI + ML. DE: bronze/silver/gold on Delta/Iceberg instead of separate warehouse for raw layers.

### 11. Delta Lake vs Apache Iceberg?

Delta: Databricks-native, deep Spark integration, Unity Catalog. Iceberg: engine-agnostic (Spark, Flink, Trino), hidden partitioning, broader vendor support. Both: ACID, time travel, schema evolution. Choose based on platform and multi-engine needs.

### 12. What is medallion architecture?

Bronze (raw ingest), Silver (cleaned/conformed), Gold (business aggregates/marts). Progressive quality. DE: bronze append-only, silver dedupe/SCD, gold star schema or wide tables for BI.

### 13. Bronze layer best practices?

Immutable append, source metadata columns (_ingest_time, _source_file), minimal transforms, partition by ingest date. Enables replay and audit. Never overwrite bronze; fix downstream.

### 14. Silver layer responsibilities?

Dedupe, type coercion, PII hashing, SCD Type 2, join reference data, enforce PK uniqueness. Quality gates before gold. Idempotent merges keyed on business key + sequence.

### 15. Gold layer design?

Denormalized marts, KPIs, feature tables. Optimized for query patterns (partition pruning, Z-order/cluster). SLA-driven refresh. Document grain and freshness.

### 16. How do you design for idempotency?

Deterministic keys, MERGE/upsert, dedupe windows, idempotent producers, at-least-once + dedupe on sink. Backfill must produce same result as incremental. Use run_id or event_id for deduplication.

### 17. What is a backfill strategy?

Pause/stream offset, run batch over historical range, validate counts/hashes, cutover, resume streaming. Or dual-write period. Iceberg/Delta time travel helps compare. Communicate SLA impact.

### 18. How do you define data pipeline SLAs?

Freshness (max lag), completeness (% rows vs source), accuracy (DQ rules pass rate), availability (job success %). Measure per table/layer. Alert on breach; tier critical vs best-effort datasets.

### 19. Late-arriving data handling?

Watermark in streaming, allowed lateness window, reprocess micro-batches, partition by event time not processing time. Batch: sliding window re-runs or merge updates into silver. Document max lateness assumption.

### 20. Schema evolution strategies?

Additive columns safe; renames via view alias; breaking changes versioned table (orders_v2) or compatibility mode in Avro/Protobuf. Delta/Iceberg schema evolution + migration jobs. Contract tests between producer/consumer.

### 21. How to handle PII in pipelines?

Tokenize/hash at bronze→silver boundary, column-level encryption, RBAC on gold, mask in non-prod. Audit access. GDPR delete propagation via CDC tombstones.

### 22. What is data quality framework?

Expectations at ingest (Great Expectations, Deequ): null checks, range, uniqueness, referential integrity, freshness. Fail pipeline or quarantine bad records. Metrics to observability dashboard.

### 23. Dead letter queue (DLQ) pattern?

Route failed records to DLQ topic/table with error reason. Monitor DLQ depth; replay after fix. Prevents poison pill blocking main pipeline. Essential for streaming consumers.

### 24. How to scale Spark jobs?

Partition input (avoid skew — salting, AQE), right-size shuffle partitions, broadcast small dims, cache judiciously, use column pruning on Parquet/Delta, autoscale cluster, separate job types (ETL vs ad-hoc).

### 25. Streaming state management?

RocksDB state in Flink/Spark, changelog topic for recovery. Size state carefully; TTL old keys. Stateful joins need keyed streams with aligned watermarks.

### 26. Event time vs processing time?

Event time = when event occurred (embedded timestamp). Processing time = when processed. Use event time for analytics correctness; processing time simpler but wrong under lag. Watermarks estimate event time progress.

### 27. Design real-time fraud detection pipeline.

Ingest transactions (Kafka), enrich with Redis feature store, rules + ML model in Flink, alert sink, store features back. Key by account_id, 1-min tumbling window, SLA < 500ms. DLQ for malformed events.

### 28. Design clickstream analytics at scale.

Web → Kafka (partition by session_id) → Flink aggregation → Delta silver → hourly gold rollups in Spark. Raw bronze from Kafka Connect to S3. Lambda for daily reconciliation batch.

### 29. Design CDC from PostgreSQL to Snowflake.

Debezium → Kafka → Snowflake Kafka connector or Spark merge to Delta staging → COPY/MERGE to Snowflake. Handle deletes via op column. Schema registry for Avro. Monitor replication lag.

### 30. Design multi-tenant SaaS analytics.

Tenant_id on every row, row-level security in warehouse, separate gold schemas or shared with RLS. Noisy neighbor: quota per tenant, fair scheduling. Bronze shared, gold isolated per tier.

### 31. How to choose partition columns?

High cardinality used in filters (date, region). Avoid too many small files. Hive-style year/month/day for time series. Iceberg hidden partitions reduce user burden.

### 32. Small file problem and fixes?

Too many tiny files slow reads. Fix: compaction jobs, optimal file size (128MB–1GB), coalesce on write, auto-compaction in Delta/Iceberg, avoid over-partitioning.

### 33. Exactly-once from Kafka to Delta?

Structured Streaming with foreachBatch MERGE, checkpoint location, transactional writes. Or Kafka Connect Delta sink. Dedupe on (topic, partition, offset) or business key.

### 34. Disaster recovery for data platform?

Cross-region replication (S3 CRR, Kafka MirrorMaker), backup retention policies, RPO/RTO per tier, runbook for failover, periodic restore drills. Metadata in Unity Catalog / Glue replicated.

### 35. Cost optimization levers?

Spot/preemptible workers, partition pruning, columnar formats, lifecycle policies on bronze, right-size clusters, schedule off-peak, compress, dedupe before wide joins, serverless where fit (Glue, Databricks SQL).

### 36. Data mesh vs centralized lake?

Mesh: domain-owned data products, federated governance, self-serve platform. Centralized: one lake/warehouse team. Hybrid common. DE interview: explain tradeoffs — consistency vs autonomy.

### 37. Orchestration: Airflow vs Dagster vs native?

Airflow: mature, cron DAGs, heavy ops. Dagster: software-defined assets, lineage native. Databricks Jobs / ADF: managed, tight cloud integration. Choose by team skill and cloud.

### 38. How to monitor data pipelines?

Job success/failure, duration trend, rows in/out, freshness lag, DQ pass rate, cost per run. OpenTelemetry, Datadog, Monte Carlo, custom Grafana. SLO dashboards per gold table.

### 39. Design GDPR right-to-erasure.

Delete request API → propagate to all layers via CDC delete events or batch purge job keyed on user_id. Tombstone in Kafka. Audit log. Hard delete vs anonymize tradeoff.

### 40. Interview framework for DE system design?

1) Clarify requirements (scale, latency, sources). 2) Capacity estimate. 3) High-level diagram (ingest, process, store, serve). 4) Deep dive one path. 5) Failure modes, SLAs, idempotency, backfill. 6) Tradeoffs and evolution.


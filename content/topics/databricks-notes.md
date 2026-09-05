---
title: Databricks Notes
description: Delta Lake, Unity Catalog, and lakehouse patterns for Data Engineering interviews
parent: databricks
hidden: true
order: 1
difficulty: basic
---

# Databricks Master Notes

Built for **Data Engineering** interviews — Delta Lake → Unity Catalog → Workflows → Medallion on DBX.

Each topic: **Concept → Syntax → Example → DE example → Mistake → Interview → Practice**

---

## Delta Lake

### 1. What is Delta Lake?

**Concept:** Open storage layer on Parquet adding ACID transactions, time travel, schema enforcement, and unified batch/streaming.

**Syntax:**

```sql
CREATE TABLE bronze.events USING DELTA
AS SELECT * FROM json.`/mnt/raw/events/`
```

**Example:** Replace raw Parquet folder with managed Delta table.

**DE example:** Bronze ingestion from ADLS landing zone with schema-on-read then enforce schema at silver.

**Common mistake:** Treating Delta as a separate database — it's file format + transaction log on object storage.

**Interview:** Delta vs plain Parquet for DE?

**Practice:** Practice #1

### 2. Transaction Log (_delta_log)

**Concept:** Ordered JSON commits record every change; readers reconstruct table state from Parquet data files + log.

**Syntax:**

```sql
DESCRIBE HISTORY catalog.schema.orders
```

**Example:** Audit who ran OPTIMIZE and when.

**DE example:** Debug failed MERGE by inspecting commit metrics in history.

**Common mistake:** Manually deleting Parquet files without understanding log — causes corruption.

**Interview:** What happens if _delta_log is deleted?

**Practice:** Practice #2

### 3. CREATE TABLE vs CTAS

**Concept:** Explicit DDL gives control over location, properties, partitioning; CTAS infers schema from query.

**Syntax:**

```sql
CREATE TABLE IF NOT EXISTS silver.customers (
  customer_id STRING NOT NULL,
  email STRING
) USING DELTA
PARTITIONED BY (country)
LOCATION 'abfss://silver@acct.dfs.core.windows.net/customers'
```

**Example:** Define silver table with NOT NULL on business keys.

**DE example:** Medallion silver layer with enforced keys before gold aggregations.

**Common mistake:** CTAS without column comments or constraints when governance matters.

**Interview:** When prefer explicit CREATE TABLE?

**Practice:** Practice #3

### 4. Schema Enforcement

**Concept:** Delta rejects writes that don't match table schema (type mismatch, extra columns depending on mode).

**Syntax:**

```sql
ALTER TABLE bronze.events ADD COLUMN source STRING
```

**Example:** Block bad API payload columns from landing.

**DE example:** Enable `delta.columnMapping.mode` when renaming columns in production.

**Common mistake:** Disabling enforcement to 'fix' upstream — hides data quality debt.

**Interview:** Schema enforcement vs evolution?

**Practice:** Practice #4

### 5. Schema Evolution

**Concept:** Add/rename/drop columns via ALTER or mergeSchema option on append.

**Syntax:**

```sql
df.write.format('delta').option('mergeSchema', 'true').mode('append').save(path)
```

**Example:** New optional field from SaaS API.

**DE example:** Bronze accepts new fields; silver applies explicit ALTER after review.

**Common mistake:** mergeSchema=true on every write in prod without governance review.

**Interview:** mergeSchema vs ALTER TABLE?

**Practice:** Practice #5

### 6. Partitioning

**Concept:** Physical layout by partition columns — prune files on filter; avoid high-cardinality keys.

**Syntax:**

```sql
CREATE TABLE gold.sales USING DELTA
PARTITIONED BY (order_date)
AS SELECT ...
```

**Example:** Daily partition on `dt` for incremental reads.

**DE example:** Bronze by ingest_date; gold by business_date after timezone normalization.

**Common mistake:** Partitioning on `customer_id` — millions of tiny files.

**Interview:** Partition vs Z-ORDER?

**Practice:** Practice #6

### 7. Liquid Clustering (DBR 13+)

**Concept:** Clustering keys replace static partitions; Delta automatically rewrites layout on OPTIMIZE.

**Syntax:**

```sql
CREATE TABLE gold.events USING DELTA
CLUSTER BY (event_date, region)
AS SELECT ...
```

**Example:** Replace daily partition with cluster keys when filters vary.

**DE example:** High-cardinality event tables with multi-column filter patterns.

**Common mistake:** Mixing PARTITIONED BY and CLUSTER BY without understanding migration path.

**Interview:** Liquid clustering vs partitioning?

**Practice:** Practice #7

### 8. Time Travel

**Concept:** Query historical table versions via VERSION AS OF or TIMESTAMP AS OF.

**Syntax:**

```sql
SELECT * FROM silver.orders VERSION AS OF 5
SELECT * FROM silver.orders TIMESTAMP AS OF '2024-06-01'
```

**Example:** Compare row counts before/after bad deploy.

**DE example:** Recover deleted rows after mistaken DELETE — restore or INSERT from old version.

**Common mistake:** Assuming time travel works after VACUUM removed old files.

**Interview:** How long can you time travel?

**Practice:** Practice #8

### 9. RESTORE TABLE

**Concept:** Revert table to earlier version metadata + data file set.

**Syntax:**

```sql
RESTORE TABLE silver.orders TO VERSION AS OF 12
```

**Example:** Undo catastrophic MERGE.

**DE example:** Runbook step after failed production job — restore then fix pipeline.

**Common mistake:** RESTORE without checking retention — files may be gone post-VACUUM.

**Interview:** RESTORE vs INSERT from time travel?

**Practice:** Practice #9

### 10. Streaming Reads/Writes

**Concept:** Structured Streaming on Delta — exactly-once with checkpoint; merge for upserts.

**Syntax:**

```sql
spark.readStream.format('delta').load(path)

 df.writeStream.format('delta').option('checkpointLocation', cp).start(path)
```

**Example:** Kafka → bronze Delta append stream.

**DE example:** CDC from Event Hubs into bronze with Auto Loader + Delta.

**Common mistake:** Same checkpoint path for two different streams.

**Interview:** At-least-once vs exactly-once on Delta?

**Practice:** Practice #10

## Unity Catalog

### 1. Unity Catalog Overview

**Concept:** Unified governance layer: metastore, catalogs, schemas, tables, views, permissions, lineage.

**Syntax:**

```sql
SHOW CATALOGS;
SHOW SCHEMAS IN prod;
SHOW TABLES IN prod.silver;
```

**Example:** Three-tier namespace: prod.silver.orders.

**DE example:** Separate dev/staging/prod catalogs with same schema layout.

**Common mistake:** Hive metastore + UC mixed without migration plan.

**Interview:** UC vs legacy Hive metastore?

**Practice:** Practice #11

### 2. Metastore & Identity

**Concept:** One metastore per region/cloud; ties to account identity (users, groups, service principals).

**Syntax:**

```sql
CREATE CATALOG prod;
CREATE SCHEMA prod.finance;
```

**Example:** Assign finance group SELECT on prod.finance.*.

**DE example:** Service principal per ADF/Databricks job with least privilege.

**Common mistake:** Shared personal token on production jobs.

**Interview:** Who can create catalogs?

**Practice:** Practice #12

### 3. GRANT / REVOKE

**Concept:** Fine-grained privileges on securable objects.

**Syntax:**

```sql
GRANT SELECT ON TABLE prod.gold.revenue TO `data-analysts`;
REVOKE MODIFY ON TABLE prod.silver.pii FROM `interns`;
```

**Example:** Analysts read gold only.

**DE example:** Deny direct bronze access; pipelines use service principal with MODIFY.

**Common mistake:** GRANT ALL to wide groups — audit nightmare.

**Interview:** Difference SELECT vs USAGE?

**Practice:** Practice #13

### 4. External Locations

**Concept:** Register cloud storage paths; credentials via storage credential + external location.

**Syntax:**

```sql
CREATE EXTERNAL LOCATION bronze_loc
URL 'abfss://bronze@acct.dfs.core.windows.net/'
WITH (STORAGE CREDENTIAL azure_cred)
```

**Example:** UC-managed access to ADLS without SAS in notebooks.

**DE example:** Central IT registers locations; DE creates external tables under approved paths.

**Common mistake:** Notebook with account key instead of UC external location.

**Interview:** External location vs DBFS mount?

**Practice:** Practice #14

### 5. Managed vs External Tables

**Concept:** Managed: UC controls lifecycle. External: data files live at LOCATION you specify.

**Syntax:**

```sql
CREATE EXTERNAL TABLE prod.bronze.raw
USING DELTA
LOCATION 'abfss://bronze@.../raw/'
```

**Example:** External bronze on ADLS; managed gold in UC default storage.

**DE example:** Medallion bronze/silver external; gold managed for simpler DROP.

**Common mistake:** DROP TABLE on external — drops metadata only, files remain (or confusion).

**Interview:** When external vs managed?

**Practice:** Practice #15

### 6. Volumes (UC Volumes)

**Concept:** Governed non-tabular files — ML models, configs, unstructured landing.

**Syntax:**

```sql
CREATE VOLUME prod.bronze.landing
COMMENT 'Raw file drops';
```

**Example:** Store CSV landing before Auto Loader.

**DE example:** Replace ad-hoc dbfs:/mnt paths with UC volumes.

**Common mistake:** Mixing dbfs paths and volumes without access policies.

**Interview:** Volumes vs external tables?

**Practice:** Practice #16

### 7. Lineage & Audit

**Concept:** Automatic column/table lineage; audit logs for access and DDL.

**Syntax:**

```sql
-- View lineage in Catalog Explorer or:
DESCRIBE TABLE EXTENDED prod.gold.orders
```

**Example:** Trace gold column back to bronze source.

**DE example:** Compliance: who accessed PII table last week.

**Common mistake:** Ignoring lineage when renaming columns — breaks downstream docs.

**Interview:** How does UC capture lineage?

**Practice:** Practice #17

### 8. Row Filters & Column Masks

**Concept:** Dynamic views for ABAC — filter rows or mask columns by group.

**Syntax:**

```sql
CREATE VIEW prod.gold.orders_masked AS
SELECT * FROM prod.gold.orders
WHERE IS_ACCOUNT_GROUP_MEMBER('regional_sales')
```

**Example:** Regional sales sees own region only.

**DE example:** PII masking on email column for non-admin roles.

**Common mistake:** Copying masked view to new table — masks don't apply to materialized copy.

**Interview:** Row filter vs static WHERE in view?

**Practice:** Practice #18

## Workflows

### 1. Databricks Workflows

**Concept:** Native orchestration: jobs, tasks, schedules, dependencies, retries, alerts.

**Syntax:**

```sql
-- Defined in UI or databricks.yml (Asset Bundles)
# Task types: notebook, SQL, Python, pipeline, condition
```

**Example:** Nightly medallion refresh job.

**DE example:** Replace fragile notebook-only chains with multi-task job.

**Common mistake:** One giant notebook instead of composable tasks.

**Interview:** Workflows vs ADF for Databricks?

**Practice:** Practice #19

### 2. Job Tasks & Dependencies

**Concept:** DAG of tasks; upstream success triggers downstream.

**Syntax:**

```sql
Task A (bronze) → Task B (silver) → Task C (gold)
Condition task on row count
```

**Example:** Silver runs only if bronze row count > 0.

**DE example:** Failure path alerts on-call via webhook notification.

**Common mistake:** Circular dependencies or missing retry on transient cluster failures.

**Interview:** How handle task failure?

**Practice:** Practice #20

### 3. Schedules & Triggers

**Concept:** Cron schedule, continuous, or triggered by file arrival / another job.

**Syntax:**

```sql
Schedule: 0 30 6 * * ?  (6:30 AM daily)
Trigger: file arrival on ADLS path
```

**Example:** Hourly incremental vs daily full refresh.

**DE example:** File arrival trigger for landing zone drops from ADF.

**Common mistake:** Overlapping runs without concurrency limit — double loads.

**Interview:** Prevent concurrent job runs?

**Practice:** Practice #21

### 4. Clusters & Job Compute

**Concept:** Job clusters spin up per run; all-purpose for dev; serverless SQL for warehouses.

**Syntax:**

```sql
# Job cluster: autoscale 2-8 workers, spot with fallback
```

**Example:** Right-size memory for wide MERGE operations.

**DE example:** Use job cluster policy enforcing tags and instance types.

**Common mistake:** All-purpose cluster for production cron — cost + no isolation.

**Interview:** Job cluster vs all-purpose?

**Practice:** Practice #22

### 5. Delta Live Tables (DLT)

**Concept:** Declarative pipelines: EXPECT constraints, automatic lineage, medallion in Python/SQL.

**Syntax:**

```sql
@dlt.table(name='silver_orders')
def silver_orders():
    return dlt.read('bronze_orders').filter('amount > 0')
```

**Example:** Bronze→silver with quality expectations.

**DE example:** DLT pipeline as single Workflow task replacing 3 notebooks.

**Common mistake:** EXPECT without ON VIOLATION strategy — pipeline stops unexpectedly.

**Interview:** DLT vs manual notebooks?

**Practice:** Practice #23

### 6. Parameters & Widgets

**Concept:** Pass run-time params to notebooks/SQL tasks.

**Syntax:**

```sql
dbutils.widgets.text('run_date', '2024-01-01')
run_date = dbutils.widgets.get('run_date')
```

**Example:** Backfill with start/end date params.

**DE example:** ADF passes pipeline trigger time as widget to Databricks notebook.

**Common mistake:** Hard-coded dates in production notebooks.

**Interview:** Pass params from ADF to Databricks?

**Practice:** Practice #24

### 7. Notifications & Monitoring

**Concept:** Email, Slack, PagerDuty on success/failure; run history and metrics.

**Syntax:**

```sql
Job settings → Notifications → On failure → webhook
```

**Example:** Alert if gold job exceeds SLA duration.

**DE example:** Integrate with Azure Monitor via webhook for enterprise alerting.

**Common mistake:** Alert on success only — misses silent partial failures.

**Interview:** Monitor MERGE metrics?

**Practice:** Practice #25

### 8. Asset Bundles (databricks.yml)

**Concept:** CI/CD deploy jobs, pipelines, schemas as code.

**Syntax:**

```sql
bundle:
  name: medallion
resources:
  jobs:
    refresh_silver:
      tasks: [...]
```

**Example:** GitHub Actions deploys to staging then prod.

**DE example:** Version-controlled job definitions matching dev workspace.

**Common mistake:** Manual UI changes in prod not synced to repo.

**Interview:** Bundles vs Terraform?

**Practice:** Practice #26

## DE Patterns

### 1. Medallion Architecture on DBX

**Concept:** Bronze (raw) → Silver (cleaned/conformed) → Gold (business aggregates) on Delta in UC.

**Syntax:**

```sql
prod.bronze.raw_events → prod.silver.events → prod.gold.daily_kpis
```

**Example:** Each layer separate schema/catalog path.

**DE example:** Bronze append-only; silver MERGE; gold incremental aggregates.

**Common mistake:** Skipping silver — dirty logic duplicated in every gold model.

**Interview:** Why three layers?

**Practice:** Practice #27

### 2. Bronze Ingestion Patterns

**Concept:** Auto Loader, COPY INTO, or structured streaming from cloud storage.

**Syntax:**

```sql
spark.readStream.format('cloudFiles')
  .option('cloudFiles.format', 'json')
  .load('abfss://bronze@.../landing/')
```

**Example:** Incremental file discovery with checkpoint.

**DE example:** ADF copies to landing; Auto Loader ingests to Delta bronze.

**Common mistake:** Re-listing entire bucket every run without Auto Loader.

**Interview:** Auto Loader vs COPY INTO?

**Practice:** Practice #28

### 3. Silver Conformance

**Concept:** Dedupe, type cast, conform keys, apply business rules.

**Syntax:**

```sql
MERGE INTO silver.customers t
USING bronze.customers s
ON t.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
```

**Example:** Latest record per customer_id from CDC stream.

**DE example:** Standardize country codes ISO-3166 at silver.

**Common mistake:** MERGE without unique key — duplicates multiply.

**Interview:** Silver vs gold responsibility?

**Practice:** Practice #29

### 4. Gold Aggregations

**Concept:** Business-ready KPIs, star schema facts/dims, wide marts.

**Syntax:**

```sql
CREATE OR REPLACE TABLE gold.daily_revenue AS
SELECT order_date, region, SUM(amount) revenue
FROM silver.orders
GROUP BY 1, 2
```

**Example:** Daily revenue mart for Power BI.

**DE example:** Incremental gold using MERGE on (date, region) keys.

**Common mistake:** Full rebuild of huge gold table daily.

**Interview:** Incremental gold pattern?

**Practice:** Practice #30

### 5. CDC with MERGE

**Concept:** Apply inserts/updates/deletes from change feed using MERGE.

**Syntax:**

```sql
MERGE INTO silver.orders t
USING cdc.orders c
ON t.order_id = c.order_id
WHEN MATCHED AND c._op = 'D' THEN DELETE
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
```

**Example:** SQL Server CDC via ADF → bronze → silver MERGE.

**DE example:** Idempotent hourly sync with watermark on modified_at.

**Common mistake:** Not handling deletes in CDC — ghost rows in silver.

**Interview:** MERGE vs overwrite partition?

**Practice:** Practice #1

### 6. SCD Type 2 on Delta

**Concept:** Track history with effective dates and current flag.

**Syntax:**

```sql
WHEN MATCHED AND t.hash <> s.hash THEN UPDATE SET end_date = current_date(), is_current = false
WHEN NOT MATCHED THEN INSERT ...
```

**Example:** Customer address history.

**DE example:** Dimension table for star schema in gold.

**Common mistake:** SCD2 without closing previous row — overlapping validity.

**Interview:** SCD2 vs snapshot tables?

**Practice:** Practice #2

### 7. Incremental Watermarks

**Concept:** Track high-water mark column for delta extracts.

**Syntax:**

```sql
WHERE updated_at > (SELECT watermark FROM control.ingestion_state WHERE table = 'orders')
```

**Example:** Only pull changed rows from source.

**DE example:** Store watermark in Delta control table updated post-success.

**Common mistake:** Watermark advanced before commit succeeds — data loss.

**Interview:** Watermark vs Change Data Feed?

**Practice:** Practice #3

### 8. Change Data Feed (CDF)

**Concept:** Delta feature emitting row-level changes between versions.

**Syntax:**

```sql
ALTER TABLE silver.orders SET TBLPROPERTIES (delta.enableChangeDataFeed = true)

SELECT * FROM table_changes('silver.orders', 5, 10)
```

**Example:** Downstream gold consumes CDF instead of full scan.

**DE example:** Event-driven gold refresh on silver commits.

**Common mistake:** CDF enabled late — no history before enablement.

**Interview:** CDF vs streaming MERGE?

**Practice:** Practice #4

### 9. OPTIMIZE & Z-ORDER

**Concept:** Compact small files; co-locate related data for filter pruning.

**Syntax:**

```sql
OPTIMIZE prod.gold.events
ZORDER BY (customer_id, event_date)
```

**Example:** After heavy append ingest, run nightly OPTIMIZE.

**DE example:** Z-ORDER on join/filter columns before large MERGE jobs.

**Common mistake:** OPTIMIZE on every micro-batch — expensive.

**Interview:** When run OPTIMIZE?

**Practice:** Practice #5

### 10. VACUUM & Retention

**Concept:** Remove files no longer referenced; default retention 7 days for time travel.

**Syntax:**

```sql
VACUUM prod.silver.orders RETAIN 168 HOURS
SET delta.deletedFileRetentionDuration = 'interval 7 days'
```

**Example:** Reclaim storage after large DELETE.

**DE example:** Align VACUUM schedule with compliance retention policy.

**Common mistake:** VACUUM RETAIN 0 HOURS — breaks time travel and concurrent readers.

**Interview:** VACUUM vs DROP?

**Practice:** Practice #6

## Traps

### 1. Small Files Problem

**Concept:** Too many tiny Parquet files from over-partitioning or frequent appends — slow reads.

**Syntax:**

```sql
OPTIMIZE table ZORDER BY (...)
-- or repartition before write:
 df.repartition(200).write.format('delta').mode('append')
```

**Example:** Kafka micro-batches creating thousands of files/hour.

**DE example:** Auto Loader with triggered batch + scheduled OPTIMIZE.

**Common mistake:** Ignoring file count in DESCRIBE DETAIL.

**Interview:** Detect small file problem?

**Practice:** Practice #7

### 2. MERGE Cardinality Explosion

**Concept:** Non-unique merge keys duplicate target rows exponentially.

**Syntax:**

```sql
-- Always validate keys first:
SELECT merge_key, COUNT(*) FROM source GROUP BY 1 HAVING COUNT(*) > 1
```

**Example:** Duplicate order_id in staging blows up fact table.

**DE example:** Pre-MERGE dedupe with ROW_NUMBER on updated_at.

**Common mistake:** Assuming source is unique without QA check.

**Interview:** Debug MERGE row count spike?

**Practice:** Practice #1

### 3. Concurrent Write Conflicts

**Concept:** Optimistic concurrency — second writer fails if log changed.

**Syntax:**

```sql
-- Retry pattern in notebook job with exponential backoff
```

**Example:** Two jobs MERGE same table overlap.

**DE example:** Serialize writes per table via job concurrency = 1.

**Common mistake:** No retry on ConcurrentModificationException.

**Interview:** Handle Delta write conflicts?

**Practice:** Practice #2

### 4. Shallow Clone Pitfalls

**Concept:** CLONE copies metadata only — shares data files; not backup if VACUUM on source.

**Syntax:**

```sql
CREATE TABLE dev.test CLONE prod.gold.orders
```

**Example:** Dev sandbox from prod snapshot.

**DE example:** Quick QA environment without copying TB of data.

**Common mistake:** Thinking CLONE protects from source VACUUM deleting shared files.

**Interview:** Shallow vs deep clone?

**Practice:** Practice #8

### 5. Schema Drift in Bronze

**Concept:** Upstream adds columns/types — pipeline breaks at silver.

**Syntax:**

```sql
ALTER TABLE bronze.events ADD COLUMN new_field STRING
-- or evolve with mergeSchema on controlled basis
```

**Example:** API v2 adds nested field.

**DE example:** Schema registry + bronze allow-list before silver promotion.

**Common mistake:** Silent mergeSchema in prod without notification.

**Interview:** Manage schema drift?

**Practice:** Practice #4

### 6. Timezone & Timestamp Traps

**Concept:** TIMESTAMP WITHOUT TIMEZONE vs UTC; daylight saving bugs.

**Syntax:**

```sql
CAST(event_ts AS TIMESTAMP) -- know session timezone
-- prefer: to_utc_timestamp(event_ts, 'America/New_York')
```

**Example:** Daily partition off by one day near UTC midnight.

**DE example:** Store UTC in silver; convert at gold/BI.

**Common mistake:** Mixing local and UTC in same partition column.

**Interview:** Best practice for timestamps?

**Practice:** Practice #9

### 7. Overwriting vs MERGE

**Concept:** replaceWhere / overwrite partition drops history and breaks incremental consumers.

**Syntax:**

```sql
INSERT OVERWRITE prod.gold.daily PARTITION (dt='2024-01-01')
-- vs MERGE for idempotent upsert
```

**Example:** Re-run job replaces whole partition — OK if isolated.

**DE example:** Use MERGE for silver CDC; overwrite only controlled gold partitions.

**Common mistake:** Dynamic partition overwrite on shared table mid-stream.

**Interview:** When overwrite is safe?

**Practice:** Practice #10

### 8. Cost & Cluster Sizing

**Concept:** Over-provisioned clusters, no auto-termination, repeated full scans.

**Syntax:**

```sql
ANALYZE TABLE prod.gold.orders COMPUTE STATISTICS
EXPLAIN COST SELECT ...
```

**Example:** I3.xlarge cluster for 1MB daily job.

**DE example:** Job policies: max workers, spot, auto-terminate 10 min.

**Common mistake:** SELECT * on billion-row table in dev notebook.

**Interview:** Reduce Databricks spend?

**Practice:** Practice #22

---

---

---

---

---

---

---

## DE2 Interview — Databricks Fundamentals

> **10 questions** — numbered 1–10 in this chapter. DE2 PySpark + Databricks theory.

### 1. What is Databricks and what are its advantages?

**Interview question:** What is Databricks and what are its advantages?

**Answer:**

Databricks is a cloud-based data and AI platform built around Apache Spark. It provides a unified environment for data engineering, analytics, machine learning, SQL, and data governance.

**Advantages:**

* Distributed data processing
* Built on Apache Spark
* Delta Lake for reliable data storage
* Auto Loader for incremental file ingestion
* Unity Catalog for governance
* Photon for accelerated execution
* Autoscaling
* Job/workflow orchestration
* Cloud integration
* Supports batch and streaming
* Collaborative notebooks

**Source:** DE2 Interview Sheet — Q1

### 2. What are the major components of Databricks?

**Interview question:** What are the major components of Databricks?

**Answer:**

The major components are Workspace, Compute, Notebooks, Jobs/Workflows, SQL Warehouses, Delta Lake, Unity Catalog, and Git integration.

```text
Databricks
│
├── Workspace
├── Compute
├── Notebooks
├── Jobs / Workflows
├── SQL Warehouse
├── Delta Lake
└── Unity Catalog
```

**Source:** DE2 Interview Sheet — Q2

### 3. What is Databricks Workspace?

**Interview question:** What is Databricks Workspace?

**Answer:**

Databricks Workspace is the collaborative environment where developers create and manage notebooks, files, dashboards, queries, jobs, and other Databricks resources.

**Simple example:**

As a developer, I use the Workspace to:

* Create Python/PySpark notebooks
* Run SQL
* Develop pipelines
* Schedule jobs
* Collaborate with team members
* Connect code with Git

**Source:** DE2 Interview Sheet — Q3

### 4. What are the different types of Databricks compute/clusters?

**Interview question:** What are the different types of Databricks compute/clusters?

**Answer:**

Databricks provides different compute options depending on the workload. Commonly, we use compute for interactive development, job workloads, serverless workloads, and SQL Warehouses for SQL analytics.

**Main categories:**

```text
Interactive development → All-Purpose / interactive compute
Production jobs         → Job compute
Managed execution        → Serverless
SQL analytics            → SQL Warehouse
```

**Source:** DE2 Interview Sheet — Q4

### 5. All-Purpose Cluster vs Job Cluster?

**Interview question:** All-Purpose Cluster vs Job Cluster?

**Answer:**

All-Purpose compute is mainly used for interactive development, testing, exploration, and debugging. Job compute is intended for automated production workloads and is associated with job execution.

| All-Purpose          | Job                            |
| -------------------- | ------------------------------ |
| Development          | Production jobs                |
| Interactive          | Automated                      |
| Can be reused        | Job-specific                   |
| Useful for debugging | Better workload isolation      |
| Can remain running   | Typically terminates after job |

**Interview line:**

> I would use interactive compute during development and job compute for scheduled production pipelines.

**Source:** DE2 Interview Sheet — Q5

### 6. What is Serverless Compute?

**Interview question:** What is Serverless Compute?

**Answer:**

Serverless compute allows Databricks to manage the underlying compute infrastructure, including provisioning and scaling, so the user doesn't have to manage the cluster infrastructure directly.

**Advantages:**

* Faster startup
* Less infrastructure management
* Automatic scaling
* Easier operations
* Useful for variable workloads

**Source:** DE2 Interview Sheet — Q6

### 7. Job Cluster vs Serverless Compute?

**Interview question:** Job Cluster vs Serverless Compute?

**Answer:**

With job compute, we can have more explicit control over the compute configuration. With serverless, Databricks manages more of the underlying infrastructure automatically.

```text
Job Compute
→ More control

Serverless
→ More abstraction and less management
```

The choice depends on workload requirements, supported features, performance and cost.

**Source:** DE2 Interview Sheet — Q7

### 8. What is a SQL Warehouse?

**Interview question:** What is a SQL Warehouse?

**Answer:**

A SQL Warehouse is Databricks compute optimized for SQL analytics, dashboards, BI workloads, and interactive SQL queries.

```text
PySpark/Data Engineering → Spark Compute
SQL/BI                  → SQL Warehouse
```

**Source:** DE2 Interview Sheet — Q8

### 9. What is Unity Catalog?

**Interview question:** What is Unity Catalog?

**Answer:**

Unity Catalog is Databricks' centralized governance solution for managing and securing data and AI assets. It provides access control, discovery, auditing, lineage, and centralized governance.

**Hierarchy:**

```text
Metastore
   ↓
Catalog
   ↓
Schema
   ↓
Table / View / Volume
```

**Main benefits:**

* Access control
* Data discovery
* Auditing
* Lineage
* Centralized governance

**Source:** DE2 Interview Sheet — Q9

### 10. How do you optimize Databricks cluster performance?

**Interview question:** How do you optimize Databricks cluster performance?

**Answer:**

I first identify the actual bottleneck using Spark UI rather than simply increasing cluster size. I check CPU, memory, shuffle, data skew, spills, task distribution, input size, and executor failures. Then I optimize the query and data layout before scaling the cluster.

**Things I check:**

* Right cluster size
* Autoscaling
* Number of executors
* Executor memory
* CPU utilization
* Partition count
* Shuffle
* Data skew
* Broadcast joins
* AQE
* Photon
* File sizes
* Data skipping
* Partition pruning

**Important:**

> **Optimize the workload first, then increase compute if necessary.**

# 2. Spark Architecture & Fundamentals

**Source:** DE2 Interview Sheet — Q10


---

## DE2 Interview — Photon & Delta Lake

> **15 questions** — numbered 1–15 in this chapter. DE2 PySpark + Databricks theory.

### 1. What is Photon Accelerator?

**Interview question:** What is Photon Accelerator?

**Answer:**

Photon is Databricks' native vectorized query execution engine designed to accelerate supported SQL and DataFrame workloads. It uses optimized native execution to improve CPU efficiency for supported operations.

**Simple idea:**

```text
Spark planning
      ↓
Photon execution for supported operations
      ↓
Faster processing
```

**Source:** DE2 Interview Sheet — Q76

### 2. How does Photon improve Spark Performance?

**Interview question:** How does Photon improve Spark Performance?

**Answer:**

See detailed sections below.

Photon uses techniques such as:

* Vectorized execution
* Native execution
* Efficient CPU utilization
* Optimized memory processing
* Efficient implementations of supported operations

It can accelerate workloads involving:

* Scans
* Filters
* Joins
* Aggregations
* SQL/DataFrame operations

**Source:** DE2 Interview Sheet — Q77

### 3. Photon vs Apache Spark?

**Interview question:** Photon vs Apache Spark?

**Answer:**

Apache Spark is the distributed processing engine and programming framework. Photon is a Databricks execution engine designed to accelerate supported Spark SQL and DataFrame workloads.

```text
Spark
→ Distributed processing framework

Photon
→ Optimized execution engine
```

Photon doesn't replace Spark as a whole.

**Source:** DE2 Interview Sheet — Q78

### 4. Photon vs Catalyst?

**Interview question:** Photon vs Catalyst?

**Answer:**

See detailed sections below.

**Catalyst:**

> Determines and optimizes the query plan.

**Photon:**

> Executes supported operations efficiently.

```text
Catalyst
→ "How should this query execute?"

Photon
→ "Execute supported operations efficiently."
```

**Source:** DE2 Interview Sheet — Q79

### 5. Photon vs AQE?

**Interview question:** Photon vs AQE?

**Answer:**

Photon and AQE solve different problems. Photon focuses on efficient execution of supported operations, while AQE dynamically changes the physical plan using runtime statistics.

```text
Catalyst → Initial optimization
AQE      → Runtime adaptation
Photon   → Efficient execution
```

They can work together.

**Source:** DE2 Interview Sheet — Q80

### 6. Does Photon solve Data Skew?

**Interview question:** Does Photon solve Data Skew?

**Answer:**

See detailed sections below.

> **No, not fundamentally.**

Photon can improve execution efficiency, but it doesn't eliminate the underlying uneven distribution.

For severe skew, consider:

* AQE skew optimization
* Salting
* Broadcast joins
* Better data distribution

# 9. Delta Lake

**Source:** DE2 Interview Sheet — Q81

### 7. What is a Data Lake?

**Interview question:** What is a Data Lake?

**Answer:**

A data lake is a centralized storage environment for storing large volumes of structured, semi-structured, and unstructured data, usually in cloud object storage such as ADLS, S3, or GCS.

Examples:

```text
ADLS
S3
GCS
```

**Source:** DE2 Interview Sheet — Q82

### 8. What is Delta Lake?

**Interview question:** What is Delta Lake?

**Answer:**

Delta Lake is an open-source storage layer that adds reliability and transactional capabilities to data lakes. Delta typically stores data in Parquet and uses a transaction log to track table changes and versions.

**Features:**

* ACID transactions
* Schema enforcement
* Schema evolution
* Time Travel
* UPDATE
* DELETE
* MERGE
* Change Data Feed
* Data management features

**Source:** DE2 Interview Sheet — Q83

### 9. What is a Delta Table?

**Interview question:** What is a Delta Table?

**Answer:**

A Delta table is a table stored using the Delta format. It consists primarily of Parquet data files along with a `_delta_log` containing transaction information and table metadata.

Conceptually:

```text
Delta Table
│
├── Parquet files
│
└── _delta_log
```

**Source:** DE2 Interview Sheet — Q84

### 10. Data Lake vs Delta Lake vs Delta Table?

**Interview question:** Data Lake vs Delta Lake vs Delta Table?

**Answer:**

See detailed sections below.

**Data Lake:**

> The storage environment/architecture.

**Delta Lake:**

> The storage layer/protocol that adds transactional and table-management capabilities.

**Delta Table:**

> A specific table stored using Delta Lake.

```text
Cloud Storage
      ↓
Data Lake
      ↓
Delta Lake
      ↓
Delta Table
```

**Source:** DE2 Interview Sheet — Q85

### 11. Why use Delta Lake instead of Parquet?

**Interview question:** Why use Delta Lake instead of Parquet?

**Answer:**

Parquet is a columnar file format, while Delta Lake adds a transaction layer and table semantics on top of Parquet-based storage.

Delta provides:

* ACID transactions
* Schema enforcement
* Schema evolution
* Time Travel
* MERGE
* UPDATE
* DELETE
* CDF

**Simple::**

```text
Parquet
→ File format

Delta
→ Parquet + transaction log + table capabilities
```

**Source:** DE2 Interview Sheet — Q86

### 12. What is the Delta Transaction Log?

**Interview question:** What is the Delta Transaction Log?

**Answer:**

The Delta transaction log, stored in `_delta_log`, records the changes and metadata needed to determine the state of a Delta table at each version.

It can contain information about:

* Added files
* Removed files
* Metadata
* Protocol/configuration changes
* Other transaction actions

Conceptually:

```text
_delta_log

Version 0
Version 1
Version 2
Version 3
...
```

**Source:** DE2 Interview Sheet — Q87

### 13. How does Delta Lake provide ACID properties?

**Interview question:** How does Delta Lake provide ACID properties?

**Answer:**

Delta Lake uses its transaction protocol and transaction log to provide atomic commits, consistent table snapshots, concurrency control, and durable committed state.

For example:

```text
Transaction
    ↓
Prepare changes
    ↓
Commit atomically
    ↓
New table version
```

Readers see a consistent table snapshot.

**Source:** DE2 Interview Sheet — Q88

### 14. What are ACID properties?

**Interview question:** What are ACID properties?

**Answer:**

See detailed sections below.

**Atomicity:**

> Transaction happens completely or not at all.

**Consistency:**

> Transaction keeps the database/table in a valid state.

**Isolation:**

> Concurrent transactions are managed so that readers don't see invalid intermediate states.

**Durability:**

> Once committed, the changes remain durable.

**Easy memory:**

```text
A → All or nothing
C → Correct state
I → Independent transactions
D → Data remains after commit
```

**Source:** DE2 Interview Sheet — Q89

### 15. What happens internally when you update/delete data in a Delta table?

**Interview question:** What happens internally when you update/delete data in a Delta table?

**Answer:**

A successful modification creates a new Delta transaction-log version. Depending on the operation and runtime capabilities, Delta can either rewrite affected files or use deletion vectors for supported row-level changes. The old files can become obsolete rather than being immediately physically deleted.

**Without deletion vectors:**

```text
Old Parquet
    ↓
Rewrite affected data
    ↓
New Parquet
    ↓
New Delta version
```

**With deletion vectors:**

```text
Existing Parquet
      +
Deletion Vector
      ↓
New Delta version
```

The transaction log records the new table state.

# 10. Delta Features & Data Management

**Source:** DE2 Interview Sheet — Q90


---

## DE2 Interview — Delta Management

> **10 questions** — numbered 1–10 in this chapter. DE2 PySpark + Databricks theory.

### 1. What is Schema Evolution?

**Interview question:** What is Schema Evolution?

**Answer:**

Schema evolution is the ability to intentionally allow supported changes to a table's schema, such as adding new columns, when the operation and configuration permit it.

Existing:

```text
id
name
age
```

Incoming:

```text
id
name
age
salary
```

With appropriate schema evolution:

```text
id
name
age
salary
```

**Source:** DE2 Interview Sheet — Q91

### 2. Schema Evolution vs Schema Enforcement?

**Interview question:** Schema Evolution vs Schema Enforcement?

**Answer:**

See detailed sections below.

**Schema Enforcement:**

> Protects the existing table schema and rejects incompatible writes.

**Schema Evolution:**

> Allows supported schema changes when explicitly enabled/configured.

```text
Enforcement
→ Protect schema

Evolution
→ Change schema intentionally
```

**Easy memory:**

> **Enforcement = Don't unexpectedly change my schema.**

> **Evolution = I allow controlled schema changes.**

**Source:** DE2 Interview Sheet — Q92

### 3. What is Auto Loader?

**Interview question:** What is Auto Loader?

**Answer:**

Auto Loader is a Databricks feature for incrementally ingesting new files from cloud object storage. It uses the `cloudFiles` source and tracks processed files so pipelines can efficiently process newly arriving data at scale.

Example:

```python
df = spark.readStream \
    .format("cloudFiles") \
    .option("cloudFiles.format", "json") \
    .load("/mnt/source")
```

**Source:** DE2 Interview Sheet — Q93

### 4. How does Auto Loader work?

**Interview question:** How does Auto Loader work?

**Answer:**

See detailed sections below.

Conceptually:

```text
ADLS / S3
    ↓
New files arrive
    ↓
Auto Loader detects files
    ↓
Spark processes them
    ↓
Delta table
```

Checkpointing allows the streaming query to track progress.

**Advantages:**

* Incremental ingestion
* Scales to large file counts
* Handles continuously arriving files
* Supports schema inference/evolution features
* Integrates with Structured Streaming

**Source:** DE2 Interview Sheet — Q94

### 5. What is CDC and CDF?

**Interview question:** What is CDC and CDF?

**Answer:**

See detailed sections below.

**CDC:**

> Change Data Capture is a general technique for capturing changes such as INSERT, UPDATE, and DELETE from a source system.

Example:

```text
SQL Server
   ↓
CDC
   ↓
Changed records
```

**CDF:**

> Change Data Feed is a Delta Lake feature that exposes row-level changes made to a Delta table.

```text
CDC
→ General change-capture concept

CDF
→ Delta change-feed feature
```

**Source:** DE2 Interview Sheet — Q95

### 6. CDF vs CDC?

**Interview question:** CDF vs CDC?

**Answer:**

See detailed sections below.

| CDC                       | CDF                         |
| ------------------------- | --------------------------- |
| General concept           | Delta feature               |
| Captures source changes   | Exposes Delta table changes |
| Often source → Databricks | Delta → downstream          |
| INSERT/UPDATE/DELETE      | Delta row-level changes     |

Typical architecture:

```text
Source DB
   ↓
CDC
   ↓
Databricks
   ↓
Delta Table
   ↓
CDF
   ↓
Downstream
```

**Source:** DE2 Interview Sheet — Q96

### 7. What is Z-Ordering?

**Interview question:** What is Z-Ordering?

**Answer:**

Z-Ordering is a Delta data-layout optimization technique that improves the clustering of values across files for selected columns. This can improve data skipping for queries that frequently filter on those columns.

Example:

```sql
OPTIMIZE transactions
ZORDER BY (customer_id);
```

**Important:**

> Z-Ordering is **not the same as partitioning** and does not mean one customer is placed into exactly one file.

**Source:** DE2 Interview Sheet — Q97

### 8. What is Data Skipping and how does Z-Ordering help?

**Interview question:** What is Data Skipping and how does Z-Ordering help?

**Answer:**

See detailed sections below.

**Data skipping:**

> Delta can use file-level statistics to determine that certain files cannot contain the requested values and skip reading them.

Suppose query:

```sql
WHERE customer_id = 12345
```

If files have useful statistics:

```text
File 1 → 1–100       → SKIP
File 2 → 101–200     → SKIP
File 3 → 12300–12400 → READ
File 4 → 50000–60000 → SKIP
```

This is a simplified illustration.

**Z-Ordering:**

```text
Z-Ordering
     ↓
Better data locality
     ↓
Better file statistics/data skipping
     ↓
Less data read
     ↓
Potentially faster query
```

**Source:** DE2 Interview Sheet — Q98

### 9. What is Delta OPTIMIZE and why is it needed?

**Interview question:** What is Delta OPTIMIZE and why is it needed?

**Answer:**

`OPTIMIZE` reorganizes Delta table data, commonly by compacting small files into larger files. Depending on the operation and platform capabilities, it can also apply data-layout optimization such as Z-Ordering.

Example:

```sql
OPTIMIZE transactions;
```

**Why?:**

Suppose:

```text
Before:

10,000 small files
```

After optimization:

```text
Fewer larger files
```

Benefits:

* Reduces small-file overhead
* Improves read efficiency
* Can improve data skipping
* Better file layout

**With Z-Ordering:**

```sql
OPTIMIZE transactions
ZORDER BY (customer_id);
```

**Source:** DE2 Interview Sheet — Q99

### 10. What is VACUUM and how does it affect Time Travel?

**Interview question:** What is VACUUM and how does it affect Time Travel?

**Answer:**

`VACUUM` removes old physical data files that are no longer needed by the active Delta table and are older than the configured retention period. If those old files are removed, Time Travel to versions that depend on them may no longer be possible.

Conceptually:

```text
Delta Version 10
      ↓
Old files
      ↓
New versions created
      ↓
Old files become obsolete
      ↓
VACUUM
      ↓
Physical cleanup
```

**Important distinction:**

`VACUUM` primarily removes **obsolete physical data files**. It is not simply "deleting Delta history."

**Time Travel:**

Before cleanup:

```sql
SELECT *
FROM customers VERSION AS OF 10;
```

may work.

After the required old data files have been physically removed:

```text
Old version
   ↓
Required files unavailable
   ↓
Time Travel may fail
```

**⚠️ Interview point:**

> **Don't say VACUUM immediately deletes old versions from the transaction log.** Its main purpose is cleaning up obsolete data files.

# Appendix

## Final DE2 Revision Sheet

If you have limited time before your interview, memorize these chains:

**Spark Architecture:**

```text
Driver
 ↓
DAG
 ↓
Job
 ↓
Stages
 ↓
Tasks
 ↓
Executors
```

**Shuffle:**

```text
Wide transformation
 ↓
Shuffle
 ↓
Data redistribution
 ↓
New shuffle partitions
```

**Data Skew:**

```text
Hot key
 ↓
Uneven shuffle distribution
 ↓
Large partition
 ↓
Slow task
 ↓
Straggler
```

**Salting:**

```text
Hot key
 ↓
Add salt
 ↓
Multiple composite keys
 ↓
Multiple partitions
 ↓
Better parallelism
```

**AQE:**

```text
Initial plan
 ↓
Execute
 ↓
Runtime statistics
 ↓
AQE
 ↓
Adapt plan
```

**Delta:**

```text
Parquet files
      +
_delta_log
      ↓
Delta Lake
      ↓
ACID + Time Travel + MERGE + UPDATE + DELETE
```

**Delta DELETE:**

```text
DELETE
 ↓
New Delta transaction/version
 ↓
Deletion Vector OR file rewrite
 ↓
New table state
```

**Z-Ordering:**

```text
OPTIMIZE ZORDER
 ↓
Better data locality
 ↓
Better file-level statistics
 ↓
More data skipping
 ↓
Less data read
```

**VACUUM:**

```text
Obsolete physical files
 ↓
Retention period
 ↓
VACUUM
 ↓
Physical cleanup
 ↓
Historical Time Travel may become unavailable
```

**Most important DE2 optimization chain:**

```text
Slow Spark Job
     ↓
Spark UI
     ↓
Find bottleneck
     ↓
Shuffle?
     ↓
Skew?
     ↓
Join?
     ↓
Too many/few partitions?
     ↓
File layout?
     ↓
AQE / Broadcast / Salting / Partitioning
     ↓
Cluster tuning
```

This is the **100-question theory set**.

**Source:** DE2 Interview Sheet — Q100


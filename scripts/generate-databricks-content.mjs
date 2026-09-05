#!/usr/bin/env node
/**
 * Generates databricks-notes.md, databricks-interview.md, databricks-practice-questions.json
 * Run: node scripts/generate-databricks-content.mjs
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");

function block(t) {
  const lines = [
    `### ${t.n}. ${t.title}`,
    "",
    `**Concept:** ${t.concept}`,
    "",
  ];
  if (t.syntax) {
    lines.push("**Syntax:**", "", "```sql", t.syntax.trim(), "```", "");
  }
  lines.push(`**Example:** ${t.example}`, "", `**DE example:** ${t.de}`, "");
  lines.push(`**Common mistake:** ${t.mistake}`, "", `**Interview:** ${t.interview}`, "");
  if (t.practice) lines.push(`**Practice:** ${t.practice}`, "");
  lines.push("");
  return lines.join("\n");
}

const deltaLake = [
  { n: 1, title: "What is Delta Lake?", concept: "Open storage layer on Parquet adding ACID transactions, time travel, schema enforcement, and unified batch/streaming.", syntax: "CREATE TABLE bronze.events USING DELTA\nAS SELECT * FROM json.`/mnt/raw/events/`", example: "Replace raw Parquet folder with managed Delta table.", de: "Bronze ingestion from ADLS landing zone with schema-on-read then enforce schema at silver.", mistake: "Treating Delta as a separate database — it's file format + transaction log on object storage.", interview: "Delta vs plain Parquet for DE?", practice: "Practice #1" },
  { n: 2, title: "Transaction Log (_delta_log)", concept: "Ordered JSON commits record every change; readers reconstruct table state from Parquet data files + log.", syntax: "DESCRIBE HISTORY catalog.schema.orders", example: "Audit who ran OPTIMIZE and when.", de: "Debug failed MERGE by inspecting commit metrics in history.", mistake: "Manually deleting Parquet files without understanding log — causes corruption.", interview: "What happens if _delta_log is deleted?", practice: "Practice #2" },
  { n: 3, title: "CREATE TABLE vs CTAS", concept: "Explicit DDL gives control over location, properties, partitioning; CTAS infers schema from query.", syntax: "CREATE TABLE IF NOT EXISTS silver.customers (\n  customer_id STRING NOT NULL,\n  email STRING\n) USING DELTA\nPARTITIONED BY (country)\nLOCATION 'abfss://silver@acct.dfs.core.windows.net/customers'", example: "Define silver table with NOT NULL on business keys.", de: "Medallion silver layer with enforced keys before gold aggregations.", mistake: "CTAS without column comments or constraints when governance matters.", interview: "When prefer explicit CREATE TABLE?", practice: "Practice #3" },
  { n: 4, title: "Schema Enforcement", concept: "Delta rejects writes that don't match table schema (type mismatch, extra columns depending on mode).", syntax: "ALTER TABLE bronze.events ADD COLUMN source STRING", example: "Block bad API payload columns from landing.", de: "Enable `delta.columnMapping.mode` when renaming columns in production.", mistake: "Disabling enforcement to 'fix' upstream — hides data quality debt.", interview: "Schema enforcement vs evolution?", practice: "Practice #4" },
  { n: 5, title: "Schema Evolution", concept: "Add/rename/drop columns via ALTER or mergeSchema option on append.", syntax: "df.write.format('delta').option('mergeSchema', 'true').mode('append').save(path)", example: "New optional field from SaaS API.", de: "Bronze accepts new fields; silver applies explicit ALTER after review.", mistake: "mergeSchema=true on every write in prod without governance review.", interview: "mergeSchema vs ALTER TABLE?", practice: "Practice #5" },
  { n: 6, title: "Partitioning", concept: "Physical layout by partition columns — prune files on filter; avoid high-cardinality keys.", syntax: "CREATE TABLE gold.sales USING DELTA\nPARTITIONED BY (order_date)\nAS SELECT ...", example: "Daily partition on `dt` for incremental reads.", de: "Bronze by ingest_date; gold by business_date after timezone normalization.", mistake: "Partitioning on `customer_id` — millions of tiny files.", interview: "Partition vs Z-ORDER?", practice: "Practice #6" },
  { n: 7, title: "Liquid Clustering (DBR 13+)", concept: "Clustering keys replace static partitions; Delta automatically rewrites layout on OPTIMIZE.", syntax: "CREATE TABLE gold.events USING DELTA\nCLUSTER BY (event_date, region)\nAS SELECT ...", example: "Replace daily partition with cluster keys when filters vary.", de: "High-cardinality event tables with multi-column filter patterns.", mistake: "Mixing PARTITIONED BY and CLUSTER BY without understanding migration path.", interview: "Liquid clustering vs partitioning?", practice: "Practice #7" },
  { n: 8, title: "Time Travel", concept: "Query historical table versions via VERSION AS OF or TIMESTAMP AS OF.", syntax: "SELECT * FROM silver.orders VERSION AS OF 5\nSELECT * FROM silver.orders TIMESTAMP AS OF '2024-06-01'", example: "Compare row counts before/after bad deploy.", de: "Recover deleted rows after mistaken DELETE — restore or INSERT from old version.", mistake: "Assuming time travel works after VACUUM removed old files.", interview: "How long can you time travel?", practice: "Practice #8" },
  { n: 9, title: "RESTORE TABLE", concept: "Revert table to earlier version metadata + data file set.", syntax: "RESTORE TABLE silver.orders TO VERSION AS OF 12", example: "Undo catastrophic MERGE.", de: "Runbook step after failed production job — restore then fix pipeline.", mistake: "RESTORE without checking retention — files may be gone post-VACUUM.", interview: "RESTORE vs INSERT from time travel?", practice: "Practice #9" },
  { n: 10, title: "Streaming Reads/Writes", concept: "Structured Streaming on Delta — exactly-once with checkpoint; merge for upserts.", syntax: "spark.readStream.format('delta').load(path)\n\n df.writeStream.format('delta').option('checkpointLocation', cp).start(path)", example: "Kafka → bronze Delta append stream.", de: "CDC from Event Hubs into bronze with Auto Loader + Delta.", mistake: "Same checkpoint path for two different streams.", interview: "At-least-once vs exactly-once on Delta?", practice: "Practice #10" },
];

const unityCatalog = [
  { n: 1, title: "Unity Catalog Overview", concept: "Unified governance layer: metastore, catalogs, schemas, tables, views, permissions, lineage.", syntax: "SHOW CATALOGS;\nSHOW SCHEMAS IN prod;\nSHOW TABLES IN prod.silver;", example: "Three-tier namespace: prod.silver.orders.", de: "Separate dev/staging/prod catalogs with same schema layout.", mistake: "Hive metastore + UC mixed without migration plan.", interview: "UC vs legacy Hive metastore?", practice: "Practice #11" },
  { n: 2, title: "Metastore & Identity", concept: "One metastore per region/cloud; ties to account identity (users, groups, service principals).", syntax: "CREATE CATALOG prod;\nCREATE SCHEMA prod.finance;", example: "Assign finance group SELECT on prod.finance.*.", de: "Service principal per ADF/Databricks job with least privilege.", mistake: "Shared personal token on production jobs.", interview: "Who can create catalogs?", practice: "Practice #12" },
  { n: 3, title: "GRANT / REVOKE", concept: "Fine-grained privileges on securable objects.", syntax: "GRANT SELECT ON TABLE prod.gold.revenue TO `data-analysts`;\nREVOKE MODIFY ON TABLE prod.silver.pii FROM `interns`;", example: "Analysts read gold only.", de: "Deny direct bronze access; pipelines use service principal with MODIFY.", mistake: "GRANT ALL to wide groups — audit nightmare.", interview: "Difference SELECT vs USAGE?", practice: "Practice #13" },
  { n: 4, title: "External Locations", concept: "Register cloud storage paths; credentials via storage credential + external location.", syntax: "CREATE EXTERNAL LOCATION bronze_loc\nURL 'abfss://bronze@acct.dfs.core.windows.net/'\nWITH (STORAGE CREDENTIAL azure_cred)", example: "UC-managed access to ADLS without SAS in notebooks.", de: "Central IT registers locations; DE creates external tables under approved paths.", mistake: "Notebook with account key instead of UC external location.", interview: "External location vs DBFS mount?", practice: "Practice #14" },
  { n: 5, title: "Managed vs External Tables", concept: "Managed: UC controls lifecycle. External: data files live at LOCATION you specify.", syntax: "CREATE EXTERNAL TABLE prod.bronze.raw\nUSING DELTA\nLOCATION 'abfss://bronze@.../raw/'", example: "External bronze on ADLS; managed gold in UC default storage.", de: "Medallion bronze/silver external; gold managed for simpler DROP.", mistake: "DROP TABLE on external — drops metadata only, files remain (or confusion).", interview: "When external vs managed?", practice: "Practice #15" },
  { n: 6, title: "Volumes (UC Volumes)", concept: "Governed non-tabular files — ML models, configs, unstructured landing.", syntax: "CREATE VOLUME prod.bronze.landing\nCOMMENT 'Raw file drops';", example: "Store CSV landing before Auto Loader.", de: "Replace ad-hoc dbfs:/mnt paths with UC volumes.", mistake: "Mixing dbfs paths and volumes without access policies.", interview: "Volumes vs external tables?", practice: "Practice #16" },
  { n: 7, title: "Lineage & Audit", concept: "Automatic column/table lineage; audit logs for access and DDL.", syntax: "-- View lineage in Catalog Explorer or:\nDESCRIBE TABLE EXTENDED prod.gold.orders", example: "Trace gold column back to bronze source.", de: "Compliance: who accessed PII table last week.", mistake: "Ignoring lineage when renaming columns — breaks downstream docs.", interview: "How does UC capture lineage?", practice: "Practice #17" },
  { n: 8, title: "Row Filters & Column Masks", concept: "Dynamic views for ABAC — filter rows or mask columns by group.", syntax: "CREATE VIEW prod.gold.orders_masked AS\nSELECT * FROM prod.gold.orders\nWHERE IS_ACCOUNT_GROUP_MEMBER('regional_sales')", example: "Regional sales sees own region only.", de: "PII masking on email column for non-admin roles.", mistake: "Copying masked view to new table — masks don't apply to materialized copy.", interview: "Row filter vs static WHERE in view?", practice: "Practice #18" },
];

const workflows = [
  { n: 1, title: "Databricks Workflows", concept: "Native orchestration: jobs, tasks, schedules, dependencies, retries, alerts.", syntax: "-- Defined in UI or databricks.yml (Asset Bundles)\n# Task types: notebook, SQL, Python, pipeline, condition", example: "Nightly medallion refresh job.", de: "Replace fragile notebook-only chains with multi-task job.", mistake: "One giant notebook instead of composable tasks.", interview: "Workflows vs ADF for Databricks?", practice: "Practice #19" },
  { n: 2, title: "Job Tasks & Dependencies", concept: "DAG of tasks; upstream success triggers downstream.", syntax: "Task A (bronze) → Task B (silver) → Task C (gold)\nCondition task on row count", example: "Silver runs only if bronze row count > 0.", de: "Failure path alerts on-call via webhook notification.", mistake: "Circular dependencies or missing retry on transient cluster failures.", interview: "How handle task failure?", practice: "Practice #20" },
  { n: 3, title: "Schedules & Triggers", concept: "Cron schedule, continuous, or triggered by file arrival / another job.", syntax: "Schedule: 0 30 6 * * ?  (6:30 AM daily)\nTrigger: file arrival on ADLS path", example: "Hourly incremental vs daily full refresh.", de: "File arrival trigger for landing zone drops from ADF.", mistake: "Overlapping runs without concurrency limit — double loads.", interview: "Prevent concurrent job runs?", practice: "Practice #21" },
  { n: 4, title: "Clusters & Job Compute", concept: "Job clusters spin up per run; all-purpose for dev; serverless SQL for warehouses.", syntax: "# Job cluster: autoscale 2-8 workers, spot with fallback", example: "Right-size memory for wide MERGE operations.", de: "Use job cluster policy enforcing tags and instance types.", mistake: "All-purpose cluster for production cron — cost + no isolation.", interview: "Job cluster vs all-purpose?", practice: "Practice #22" },
  { n: 5, title: "Delta Live Tables (DLT)", concept: "Declarative pipelines: EXPECT constraints, automatic lineage, medallion in Python/SQL.", syntax: "@dlt.table(name='silver_orders')\ndef silver_orders():\n    return dlt.read('bronze_orders').filter('amount > 0')", example: "Bronze→silver with quality expectations.", de: "DLT pipeline as single Workflow task replacing 3 notebooks.", mistake: "EXPECT without ON VIOLATION strategy — pipeline stops unexpectedly.", interview: "DLT vs manual notebooks?", practice: "Practice #23" },
  { n: 6, title: "Parameters & Widgets", concept: "Pass run-time params to notebooks/SQL tasks.", syntax: "dbutils.widgets.text('run_date', '2024-01-01')\nrun_date = dbutils.widgets.get('run_date')", example: "Backfill with start/end date params.", de: "ADF passes pipeline trigger time as widget to Databricks notebook.", mistake: "Hard-coded dates in production notebooks.", interview: "Pass params from ADF to Databricks?", practice: "Practice #24" },
  { n: 7, title: "Notifications & Monitoring", concept: "Email, Slack, PagerDuty on success/failure; run history and metrics.", syntax: "Job settings → Notifications → On failure → webhook", example: "Alert if gold job exceeds SLA duration.", de: "Integrate with Azure Monitor via webhook for enterprise alerting.", mistake: "Alert on success only — misses silent partial failures.", interview: "Monitor MERGE metrics?", practice: "Practice #25" },
  { n: 8, title: "Asset Bundles (databricks.yml)", concept: "CI/CD deploy jobs, pipelines, schemas as code.", syntax: "bundle:\n  name: medallion\nresources:\n  jobs:\n    refresh_silver:\n      tasks: [...]", example: "GitHub Actions deploys to staging then prod.", de: "Version-controlled job definitions matching dev workspace.", mistake: "Manual UI changes in prod not synced to repo.", interview: "Bundles vs Terraform?", practice: "Practice #26" },
];

const dePatterns = [
  { n: 1, title: "Medallion Architecture on DBX", concept: "Bronze (raw) → Silver (cleaned/conformed) → Gold (business aggregates) on Delta in UC.", syntax: "prod.bronze.raw_events → prod.silver.events → prod.gold.daily_kpis", example: "Each layer separate schema/catalog path.", de: "Bronze append-only; silver MERGE; gold incremental aggregates.", mistake: "Skipping silver — dirty logic duplicated in every gold model.", interview: "Why three layers?", practice: "Practice #27" },
  { n: 2, title: "Bronze Ingestion Patterns", concept: "Auto Loader, COPY INTO, or structured streaming from cloud storage.", syntax: "spark.readStream.format('cloudFiles')\n  .option('cloudFiles.format', 'json')\n  .load('abfss://bronze@.../landing/')", example: "Incremental file discovery with checkpoint.", de: "ADF copies to landing; Auto Loader ingests to Delta bronze.", mistake: "Re-listing entire bucket every run without Auto Loader.", interview: "Auto Loader vs COPY INTO?", practice: "Practice #28" },
  { n: 3, title: "Silver Conformance", concept: "Dedupe, type cast, conform keys, apply business rules.", syntax: "MERGE INTO silver.customers t\nUSING bronze.customers s\nON t.customer_id = s.customer_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *", example: "Latest record per customer_id from CDC stream.", de: "Standardize country codes ISO-3166 at silver.", mistake: "MERGE without unique key — duplicates multiply.", interview: "Silver vs gold responsibility?", practice: "Practice #29" },
  { n: 4, title: "Gold Aggregations", concept: "Business-ready KPIs, star schema facts/dims, wide marts.", syntax: "CREATE OR REPLACE TABLE gold.daily_revenue AS\nSELECT order_date, region, SUM(amount) revenue\nFROM silver.orders\nGROUP BY 1, 2", example: "Daily revenue mart for Power BI.", de: "Incremental gold using MERGE on (date, region) keys.", mistake: "Full rebuild of huge gold table daily.", interview: "Incremental gold pattern?", practice: "Practice #30" },
  { n: 5, title: "CDC with MERGE", concept: "Apply inserts/updates/deletes from change feed using MERGE.", syntax: "MERGE INTO silver.orders t\nUSING cdc.orders c\nON t.order_id = c.order_id\nWHEN MATCHED AND c._op = 'D' THEN DELETE\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *", example: "SQL Server CDC via ADF → bronze → silver MERGE.", de: "Idempotent hourly sync with watermark on modified_at.", mistake: "Not handling deletes in CDC — ghost rows in silver.", interview: "MERGE vs overwrite partition?", practice: "Practice #1" },
  { n: 6, title: "SCD Type 2 on Delta", concept: "Track history with effective dates and current flag.", syntax: "WHEN MATCHED AND t.hash <> s.hash THEN UPDATE SET end_date = current_date(), is_current = false\nWHEN NOT MATCHED THEN INSERT ...", example: "Customer address history.", de: "Dimension table for star schema in gold.", mistake: "SCD2 without closing previous row — overlapping validity.", interview: "SCD2 vs snapshot tables?", practice: "Practice #2" },
  { n: 7, title: "Incremental Watermarks", concept: "Track high-water mark column for delta extracts.", syntax: "WHERE updated_at > (SELECT watermark FROM control.ingestion_state WHERE table = 'orders')", example: "Only pull changed rows from source.", de: "Store watermark in Delta control table updated post-success.", mistake: "Watermark advanced before commit succeeds — data loss.", interview: "Watermark vs Change Data Feed?", practice: "Practice #3" },
  { n: 8, title: "Change Data Feed (CDF)", concept: "Delta feature emitting row-level changes between versions.", syntax: "ALTER TABLE silver.orders SET TBLPROPERTIES (delta.enableChangeDataFeed = true)\n\nSELECT * FROM table_changes('silver.orders', 5, 10)", example: "Downstream gold consumes CDF instead of full scan.", de: "Event-driven gold refresh on silver commits.", mistake: "CDF enabled late — no history before enablement.", interview: "CDF vs streaming MERGE?", practice: "Practice #4" },
  { n: 9, title: "OPTIMIZE & Z-ORDER", concept: "Compact small files; co-locate related data for filter pruning.", syntax: "OPTIMIZE prod.gold.events\nZORDER BY (customer_id, event_date)", example: "After heavy append ingest, run nightly OPTIMIZE.", de: "Z-ORDER on join/filter columns before large MERGE jobs.", mistake: "OPTIMIZE on every micro-batch — expensive.", interview: "When run OPTIMIZE?", practice: "Practice #5" },
  { n: 10, title: "VACUUM & Retention", concept: "Remove files no longer referenced; default retention 7 days for time travel.", syntax: "VACUUM prod.silver.orders RETAIN 168 HOURS\nSET delta.deletedFileRetentionDuration = 'interval 7 days'", example: "Reclaim storage after large DELETE.", de: "Align VACUUM schedule with compliance retention policy.", mistake: "VACUUM RETAIN 0 HOURS — breaks time travel and concurrent readers.", interview: "VACUUM vs DROP?", practice: "Practice #6" },
];

const traps = [
  { n: 1, title: "Small Files Problem", concept: "Too many tiny Parquet files from over-partitioning or frequent appends — slow reads.", syntax: "OPTIMIZE table ZORDER BY (...)\n-- or repartition before write:\n df.repartition(200).write.format('delta').mode('append')", example: "Kafka micro-batches creating thousands of files/hour.", de: "Auto Loader with triggered batch + scheduled OPTIMIZE.", mistake: "Ignoring file count in DESCRIBE DETAIL.", interview: "Detect small file problem?", practice: "Practice #7" },
  { n: 2, title: "MERGE Cardinality Explosion", concept: "Non-unique merge keys duplicate target rows exponentially.", syntax: "-- Always validate keys first:\nSELECT merge_key, COUNT(*) FROM source GROUP BY 1 HAVING COUNT(*) > 1", example: "Duplicate order_id in staging blows up fact table.", de: "Pre-MERGE dedupe with ROW_NUMBER on updated_at.", mistake: "Assuming source is unique without QA check.", interview: "Debug MERGE row count spike?", practice: "Practice #1" },
  { n: 3, title: "Concurrent Write Conflicts", concept: "Optimistic concurrency — second writer fails if log changed.", syntax: "-- Retry pattern in notebook job with exponential backoff", example: "Two jobs MERGE same table overlap.", de: "Serialize writes per table via job concurrency = 1.", mistake: "No retry on ConcurrentModificationException.", interview: "Handle Delta write conflicts?", practice: "Practice #2" },
  { n: 4, title: "Shallow Clone Pitfalls", concept: "CLONE copies metadata only — shares data files; not backup if VACUUM on source.", syntax: "CREATE TABLE dev.test CLONE prod.gold.orders", example: "Dev sandbox from prod snapshot.", de: "Quick QA environment without copying TB of data.", mistake: "Thinking CLONE protects from source VACUUM deleting shared files.", interview: "Shallow vs deep clone?", practice: "Practice #8" },
  { n: 5, title: "Schema Drift in Bronze", concept: "Upstream adds columns/types — pipeline breaks at silver.", syntax: "ALTER TABLE bronze.events ADD COLUMN new_field STRING\n-- or evolve with mergeSchema on controlled basis", example: "API v2 adds nested field.", de: "Schema registry + bronze allow-list before silver promotion.", mistake: "Silent mergeSchema in prod without notification.", interview: "Manage schema drift?", practice: "Practice #4" },
  { n: 6, title: "Timezone & Timestamp Traps", concept: "TIMESTAMP WITHOUT TIMEZONE vs UTC; daylight saving bugs.", syntax: "CAST(event_ts AS TIMESTAMP) -- know session timezone\n-- prefer: to_utc_timestamp(event_ts, 'America/New_York')", example: "Daily partition off by one day near UTC midnight.", de: "Store UTC in silver; convert at gold/BI.", mistake: "Mixing local and UTC in same partition column.", interview: "Best practice for timestamps?", practice: "Practice #9" },
  { n: 7, title: "Overwriting vs MERGE", concept: "replaceWhere / overwrite partition drops history and breaks incremental consumers.", syntax: "INSERT OVERWRITE prod.gold.daily PARTITION (dt='2024-01-01')\n-- vs MERGE for idempotent upsert", example: "Re-run job replaces whole partition — OK if isolated.", de: "Use MERGE for silver CDC; overwrite only controlled gold partitions.", mistake: "Dynamic partition overwrite on shared table mid-stream.", interview: "When overwrite is safe?", practice: "Practice #10" },
  { n: 8, title: "Cost & Cluster Sizing", concept: "Over-provisioned clusters, no auto-termination, repeated full scans.", syntax: "ANALYZE TABLE prod.gold.orders COMPUTE STATISTICS\nEXPLAIN COST SELECT ...", example: "I3.xlarge cluster for 1MB daily job.", de: "Job policies: max workers, spot, auto-terminate 10 min.", mistake: "SELECT * on billion-row table in dev notebook.", interview: "Reduce Databricks spend?", practice: "Practice #22" },
];

const notesHeader = `---
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

`;

let fullNotes = notesHeader;
fullNotes += "## Delta Lake\n\n" + deltaLake.map(block).join("");
fullNotes += "## Unity Catalog\n\n" + unityCatalog.map(block).join("");
fullNotes += "## Workflows\n\n" + workflows.map(block).join("");
fullNotes += "## DE Patterns\n\n" + dePatterns.map(block).join("");
fullNotes += "## Traps\n\n" + traps.map(block).join("");

const interviewQs = [
  ["What is Delta Lake?", "Open storage format on Parquet with ACID transaction log, time travel, schema enforcement, and unified batch/streaming APIs."],
  ["Delta vs Parquet?", "Parquet is file format only; Delta adds _delta_log for transactions, DML, time travel, MERGE, CDF."],
  ["What is the transaction log?", "JSON files in _delta_log recording commits — add/remove files, metadata, protocol. Source of truth for table state."],
  ["Explain ACID on object storage.", "Optimistic concurrency via log ordering; writers check version; readers see consistent snapshot."],
  ["What is time travel?", "Query prior table versions with VERSION AS OF or TIMESTAMP AS OF using retained data files."],
  ["How long is history retained?", "Default 7 days deleted file retention; configurable via table property and VACUUM RETAIN."],
  ["RESTORE vs time travel query?", "RESTORE mutates table to old version; time travel is read-only SELECT."],
  ["Schema enforcement vs evolution?", "Enforcement rejects incompatible writes; evolution adds/changes columns via ALTER or mergeSchema."],
  ["When use mergeSchema?", "Controlled bronze evolution; avoid blind mergeSchema in production silver/gold."],
  ["Partition vs Z-ORDER?", "Partition splits directories by column value; Z-ORDER colocates related rows in files for multi-column filters."],
  ["Liquid clustering?", "DBR 13+ replaces static partitions; OPTIMIZE maintains cluster layout automatically."],
  ["What is MERGE?", "Upsert: MATCHED update/delete, NOT MATCHED insert — idempotent CDC pattern."],
  ["MERGE vs INSERT OVERWRITE?", "MERGE row-level idempotent; overwrite replaces partitions/files — risky for shared tables."],
  ["Change Data Feed?", "Emits row changes between versions when enabled — downstream incremental without full scan."],
  ["OPTIMIZE purpose?", "Compacts small files into larger ones; optional ZORDER BY for data layout."],
  ["When run OPTIMIZE?", "After large appends/streaming batches; schedule off-peak; not every micro-batch."],
  ["VACUUM purpose?", "Physically deletes orphaned data files past retention — frees storage."],
  ["VACUUM risk?", "RETAIN too low removes files needed for time travel and clones sharing files."],
  ["Small files problem?", "Too many tiny files slow listing/reads — fix with OPTIMIZE, repartition, avoid bad partitioning."],
  ["Concurrent write failure?", "Retry job; serialize writers; design idempotent MERGE keys."],
  ["Shallow vs deep clone?", "Shallow: shared data files, metadata copy. Deep: copies data — independent, costlier."],
  ["What is Unity Catalog?", "Unified governance: metastore, 3-level namespace, ACLs, lineage, external locations."],
  ["Catalog.schema.table?", "prod.silver.orders — catalog=env/domain, schema=layer, table=entity."],
  ["GRANT SELECT vs USAGE?", "USAGE on schema/catalog to traverse; SELECT on table/view to read data."],
  ["External location?", "Registered storage path with credential — UC-enforced access to ADLS/S3."],
  ["Managed vs external table?", "Managed: UC owns files. External: data at LOCATION; DROP may leave files."],
  ["UC Volumes?", "Governed file storage for unstructured/config files — not tabular Delta."],
  ["Row filter / column mask?", "Dynamic ABAC in views — filter rows or mask PII by group membership."],
  ["Lineage in UC?", "Automatic table/column lineage from query activity; audit logs for access."],
  ["Workflows vs ADF?", "Workflows native to Databricks jobs; ADF orchestrates cross-service including Databricks notebook activity."],
  ["Job cluster vs all-purpose?", "Job cluster: ephemeral per run, cheaper for production. All-purpose: interactive dev."],
  ["DLT key benefit?", "Declarative pipelines, EXPECT data quality, built-in lineage, less boilerplate."],
  ["EXPECT constraint?", "Data quality rule in DLT — fail, drop, or alert on violation."],
  ["Medallion layers?", "Bronze raw, silver cleaned/conformed, gold business-ready aggregates/marts."],
  ["Bronze ingestion options?", "Auto Loader, COPY INTO, structured streaming, ADF copy + notebook."],
  ["Auto Loader vs COPY INTO?", "Auto Loader incremental file notification/scaling; COPY INTO simpler batch loads."],
  ["Silver responsibilities?", "Dedupe, conform types/keys, business rules, MERGE CDC — not final KPIs."],
  ["Gold responsibilities?", "Aggregates, star schema, KPIs for BI — built from silver."],
  ["SCD Type 2 on Delta?", "MERGE closes old row (end_date, is_current=false), inserts new version."],
  ["Incremental watermark?", "High-water column in control table — extract WHERE col > watermark after success."],
  ["CDF vs MERGE stream?", "CDF reads changes between versions; streaming MERGE applies incoming CDC continuously."],
  ["File arrival trigger?", "Workflow starts when files land in monitored path — common with ADF drops."],
  ["Prevent duplicate job runs?", "Max concurrent runs = 1; idempotent MERGE; check control table."],
  ["Pass params from ADF?", "Base parameters / notebook widgets / job parameters on triggered run."],
  ["Asset Bundles?", "databricks.yml CI/CD for jobs, pipelines, schemas — infra as code."],
];

let interviewMd = `---
title: Databricks Interview Q&A
description: 45 conceptual Databricks questions for Data Engineering interviews
parent: databricks
hidden: true
order: 3
difficulty: interview
---

# Databricks Interview Flashcards

`;

interviewQs.forEach(([q, a], i) => {
  interviewMd += `### ${i + 1}. ${q}\n\n${a}\n\n`;
});

const practice = [
  { id: 1, tier: "basic", category: "merge", title: "Basic MERGE upsert", body: "MERGE staging into `silver.orders` on `order_id`. Update all columns when matched, insert when not.", solution: "MERGE INTO silver.orders AS t\nUSING staging.orders AS s\nON t.order_id = s.order_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *", anchor: "q-1" },
  { id: 2, tier: "basic", category: "merge", title: "MERGE with DELETE (CDC)", body: "Apply CDC: delete when `_op = 'D'`, else upsert.", solution: "MERGE INTO silver.orders AS t\nUSING cdc.orders AS s\nON t.order_id = s.order_id\nWHEN MATCHED AND s._op = 'D' THEN DELETE\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED AND s._op <> 'D' THEN INSERT *", anchor: "q-2" },
  { id: 3, tier: "medium", category: "merge", title: "Dedupe before MERGE", body: "Write SQL to keep latest row per `customer_id` from staging using `updated_at`.", solution: "MERGE INTO silver.customers AS t\nUSING (\n  SELECT * FROM (\n    SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) rn\n    FROM staging.customers\n  ) WHERE rn = 1\n) AS s\nON t.customer_id = s.customer_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *", anchor: "q-3" },
  { id: 4, tier: "medium", category: "delta-lake", title: "Time travel audit", body: "Compare row counts between current table and version 3.", solution: "SELECT\n  (SELECT COUNT(*) FROM silver.orders) AS current_cnt,\n  (SELECT COUNT(*) FROM silver.orders VERSION AS OF 3) AS v3_cnt", anchor: "q-4" },
  { id: 5, tier: "basic", category: "optimize-vacuum", title: "OPTIMIZE with Z-ORDER", body: "Compact `gold.events` and Z-ORDER by `event_date`, `region`.", solution: "OPTIMIZE gold.events\nZORDER BY (event_date, region)", anchor: "q-5" },
  { id: 6, tier: "basic", category: "optimize-vacuum", title: "VACUUM with retention", body: "Remove orphaned files older than 7 days from `silver.orders`.", solution: "VACUUM silver.orders RETAIN 168 HOURS", anchor: "q-6" },
  { id: 7, tier: "medium", category: "optimize-vacuum", title: "Describe table detail", body: "Write query to inspect file count and size for a Delta table.", solution: "DESCRIBE DETAIL silver.orders", anchor: "q-7" },
  { id: 8, tier: "medium", category: "delta-lake", title: "Enable Change Data Feed", body: "Enable CDF on existing Delta table `silver.orders`.", solution: "ALTER TABLE silver.orders\nSET TBLPROPERTIES (delta.enableChangeDataFeed = true)", anchor: "q-8" },
  { id: 9, tier: "hard", category: "delta-lake", title: "Read CDF changes", body: "Select changes between versions 10 and 15 for `silver.orders`.", solution: "SELECT * FROM table_changes('silver.orders', 10, 15)", anchor: "q-9" },
  { id: 10, tier: "basic", category: "delta-lake", title: "Create partitioned Delta table", body: "Create `bronze.events` partitioned by `ingest_date` from JSON path.", solution: "CREATE TABLE bronze.events\nUSING DELTA\nPARTITIONED BY (ingest_date)\nAS SELECT *, current_date() AS ingest_date\nFROM json.`abfss://bronze@acct.dfs.core.windows.net/events/`", anchor: "q-10" },
  { id: 11, tier: "basic", category: "unity-catalog", title: "Grant read access", body: "Grant SELECT on `prod.gold.revenue` to group `analysts`.", solution: "GRANT SELECT ON TABLE prod.gold.revenue TO `analysts`", anchor: "q-11" },
  { id: 12, tier: "medium", category: "unity-catalog", title: "Create external table", body: "Register Delta path as external table in UC.", solution: "CREATE EXTERNAL TABLE prod.bronze.raw_orders (\n  order_id STRING,\n  amount DOUBLE\n)\nUSING DELTA\nLOCATION 'abfss://bronze@acct.dfs.core.windows.net/raw_orders/'", anchor: "q-12" },
  { id: 13, tier: "medium", category: "unity-catalog", title: "Revoke modify access", body: "Revoke MODIFY on silver PII table from interns group.", solution: "REVOKE MODIFY ON TABLE prod.silver.customer_pii FROM `interns`", anchor: "q-13" },
  { id: 14, tier: "basic", category: "unity-catalog", title: "Show table lineage context", body: "Display extended metadata for UC table.", solution: "DESCRIBE TABLE EXTENDED prod.gold.orders", anchor: "q-14" },
  { id: 15, tier: "hard", category: "unity-catalog", title: "Create catalog and schema", body: "Create `prod` catalog and `silver` schema.", solution: "CREATE CATALOG IF NOT EXISTS prod;\nCREATE SCHEMA IF NOT EXISTS prod.silver;", anchor: "q-15" },
  { id: 16, tier: "basic", category: "workflows", title: "Pass job parameter", body: "In notebook, read widget `run_date` default today.", solution: "dbutils.widgets.text('run_date', '2024-01-01')\nrun_date = dbutils.widgets.get('run_date')", anchor: "q-16" },
  { id: 17, tier: "medium", category: "workflows", title: "Conditional SQL task", body: "Write SQL that fails job if bronze row count is zero today.", solution: "SELECT CASE WHEN COUNT(*) = 0 THEN raise_error('No bronze rows') END\nFROM bronze.orders\nWHERE ingest_date = current_date()", anchor: "q-17" },
  { id: 18, tier: "medium", category: "workflows", title: "Incremental filter", body: "Select rows from silver where `updated_at` > job watermark param.", solution: "SELECT * FROM silver.orders\nWHERE updated_at > '${watermark}'", anchor: "q-18" },
  { id: 19, tier: "basic", category: "medallion", title: "Bronze append stream", body: "Append streaming JSON from path to Delta bronze with checkpoint.", solution: "spark.readStream.format('json')\n  .load('abfss://bronze@.../landing/')\n  .writeStream.format('delta')\n  .option('checkpointLocation', 'abfss://.../_checkpoints/bronze_events')\n  .trigger(availableNow=True)\n  .start('abfss://bronze@.../delta/events')", anchor: "q-19" },
  { id: 20, tier: "medium", category: "medallion", title: "Silver daily aggregate", body: "Build gold daily revenue from silver orders.", solution: "CREATE OR REPLACE TABLE gold.daily_revenue AS\nSELECT order_date, region, SUM(amount) AS revenue\nFROM silver.orders\nWHERE order_status = 'completed'\nGROUP BY order_date, region", anchor: "q-20" },
  { id: 21, tier: "medium", category: "medallion", title: "Incremental gold MERGE", body: "MERGE daily revenue summary into gold for today's date.", solution: "MERGE INTO gold.daily_revenue AS t\nUSING (\n  SELECT order_date, region, SUM(amount) revenue\n  FROM silver.orders\n  WHERE order_date = current_date()\n  GROUP BY 1, 2\n) s\nON t.order_date = s.order_date AND t.region = s.region\nWHEN MATCHED THEN UPDATE SET revenue = s.revenue\nWHEN NOT MATCHED THEN INSERT *", anchor: "q-21" },
  { id: 22, tier: "hard", category: "workflows", title: "Watermark control table", body: "Update control table watermark after successful silver load.", solution: "MERGE INTO control.ingestion_state AS t\nUSING (SELECT 'orders' AS table_name, MAX(updated_at) AS wm FROM silver.orders) s\nON t.table_name = s.table_name\nWHEN MATCHED THEN UPDATE SET watermark = s.wm, updated_at = current_timestamp()\nWHEN NOT MATCHED THEN INSERT *", anchor: "q-22" },
  { id: 23, tier: "hard", category: "merge", title: "SCD Type 2 MERGE", body: "When hash changes, close current row and insert new version.", solution: "MERGE INTO gold.dim_customer t\nUSING staging.customer s\nON t.customer_id = s.customer_id AND t.is_current = true\nWHEN MATCHED AND t.row_hash <> s.row_hash THEN UPDATE SET end_date = current_date(), is_current = false\nWHEN NOT MATCHED THEN INSERT (customer_id, attrs, start_date, end_date, is_current, row_hash)\nVALUES (s.customer_id, s.attrs, current_date(), NULL, true, s.row_hash)", anchor: "q-23" },
  { id: 24, tier: "medium", category: "delta-lake", title: "Schema evolution ALTER", body: "Add nullable column `source_system` to bronze table.", solution: "ALTER TABLE bronze.orders ADD COLUMN source_system STRING", anchor: "q-24" },
  { id: 25, tier: "hard", category: "medallion", title: "Clone prod to dev", body: "Create dev copy of gold orders for testing (shallow clone).", solution: "CREATE OR REPLACE TABLE dev.gold.orders SHALLOW CLONE prod.gold.orders", anchor: "q-25" },
];

fs.writeFileSync(path.join(root, "content/topics/databricks-notes.md"), fullNotes);
fs.writeFileSync(path.join(root, "content/topics/databricks-interview.md"), interviewMd);
fs.writeFileSync(path.join(root, "content/topics/databricks-practice.md"), `---
title: Databricks Practice
description: 25 Delta Lake and lakehouse practice problems
parent: databricks
hidden: true
order: 2
difficulty: practice
---

# Databricks Practice

25 problems — Delta MERGE, OPTIMIZE/VACUUM, Unity Catalog, Workflows, Medallion.

Use the **Practice** workspace in Databricks Lab.
`);
fs.writeFileSync(path.join(root, "src/data/databricks-practice-questions.json"), JSON.stringify(practice, null, 2));

console.log("Generated:");
console.log("  notes:", fullNotes.split("\n").length, "lines");
console.log("  interview:", interviewQs.length, "questions");
console.log("  practice:", practice.length, "problems");

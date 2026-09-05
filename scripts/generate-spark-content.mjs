#!/usr/bin/env node
/**
 * Generates spark-notes.md, spark-interview.md, spark-practice-questions.json
 * Run: node scripts/generate-spark-content.mjs
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
    lines.push("**Syntax:**", "", "```python", t.syntax.trim(), "```", "");
  }
  lines.push(`**Example:** ${t.example}`, "", `**DE example:** ${t.de}`, "");
  lines.push(`**Common mistake:** ${t.mistake}`, "", `**Interview:** ${t.interview}`, "");
  if (t.practice) lines.push(`**Practice:** ${t.practice}`, "");
  lines.push("");
  return lines.join("\n");
}

// ─── EASY (18 topics) ───────────────────────────────────────────────────────
const easyTopics = [
  { n: 1, title: "SparkSession & SparkContext", concept: "Entry point to Spark. SparkSession wraps SparkContext and provides DataFrame API.", syntax: "from pyspark.sql import SparkSession\n\nspark = SparkSession.builder \\\n    .appName(\"de-pipeline\") \\\n    .config(\"spark.sql.shuffle.partitions\", \"200\") \\\n    .getOrCreate()", example: "Create session in Databricks notebook or local dev.", de: "Single SparkSession per JVM; reuse across ADF-triggered Databricks jobs.", mistake: "Creating multiple SparkSessions in one app.", interview: "SparkSession vs SparkContext?", practice: "Practice #1" },
  { n: 2, title: "DataFrame basics", concept: "Distributed collection of rows with named columns — primary PySpark abstraction.", syntax: "df = spark.read.parquet(\"abfss://lake/silver/orders\")\ndf.printSchema()\ndf.show(5)\ndf.count()", example: "Inspect bronze landing data.", de: "Read Delta table from ADLS Gen2 via abfss path.", mistake: "Calling show() on billion-row table without limit.", interview: "DataFrame vs RDD?", practice: "Practice #2" },
  { n: 3, title: "Reading Parquet", concept: "Columnar format — default for lakehouse silver/gold layers.", syntax: 'df = spark.read.parquet("path/to/table")\ndf = spark.read.format("parquet").load("path")', example: "Load partitioned orders.", de: "Read `abfss://container/silver/orders/dt=2024-01-01/`.", mistake: "Reading too many small files without coalesce.", interview: "Why Parquet in Spark?", practice: "Practice #3" },
  { n: 4, title: "Reading CSV", concept: "Text delimited ingest with schema control.", syntax: 'df = spark.read.option("header", True) \\\n    .option("inferSchema", False) \\\n    .schema(schema) \\\n    .csv("path")', example: "Ingest vendor CSV export.", de: "Bronze layer: explicit schema, never inferSchema in prod.", mistake: "inferSchema on large files — expensive double pass.", interview: "CSV vs Parquet in Spark?", practice: "Practice #4" },
  { n: 5, title: "Reading JSON", concept: "Semi-structured API and document payloads.", syntax: 'df = spark.read.json("path")\ndf = spark.read.option("multiline", True).json("big.json")', example: "Load REST API dump.", de: "Bronze JSONL from Event Hub capture.", mistake: "Not handling nested structs — use explode later.", interview: "json vs jsonl?", practice: "Practice #5" },
  { n: 6, title: "Reading Delta Lake", concept: "ACID table format on data lake — Databricks standard.", syntax: 'df = spark.read.format("delta").load("abfss://lake/gold/dim_customer")\ndf = spark.table("catalog.schema.dim_customer")', example: "Query gold dimension.", de: "Unity Catalog managed tables in Databricks.", mistake: "Treating Delta as plain Parquet without time travel.", interview: "Delta vs Parquet?", practice: "Practice #6" },
  { n: 7, title: "select() & withColumn()", concept: "Project and derive columns — lazy transformations.", syntax: 'df.select("id", "amount")\ndf.withColumn("total", col("qty") * col("price"))', example: "Add computed column.", de: "Derive partition column `dt` from timestamp.", mistake: "Chaining withColumn in loop — use selectExpr.", interview: "select vs withColumn?", practice: "Practice #7" },
  { n: 8, title: "filter() / where()", concept: "Row filtering — predicate pushdown when possible.", syntax: 'df.filter(col("amount") > 100)\ndf.where("country = \'IN\'")', example: "Active customers only.", de: "Partition pruning: filter `dt = '2024-01-01'` early.", mistake: "Filtering after expensive join instead of before.", interview: "filter vs where?", practice: "Practice #8" },
  { n: 9, title: "distinct() & dropDuplicates()", concept: "Remove duplicate rows.", syntax: 'df.distinct()\ndf.dropDuplicates(["order_id"])', example: "Dedupe CDC feed.", de: "Keep latest by `updated_at` — sort + dropDuplicates or window.", mistake: "distinct() on wide rows — specify subset.", interview: "distinct vs dropDuplicates?", practice: "Practice #9" },
  { n: 10, title: "orderBy() / sort()", concept: "Sort within partitions; global sort requires shuffle.", syntax: 'df.orderBy(col("ts").desc())\ndf.sort("region", "amount")', example: "Latest event first.", de: "Sort before window functions.", mistake: "Global sort on huge data without need.", interview: "orderBy cost?", practice: "Practice #10" },
  { n: 11, title: "groupBy() & agg()", concept: "Split-apply-combine — triggers shuffle.", syntax: 'df.groupBy("region").agg(\n    sum("amount").alias("total"),\n    count("*").alias("n")\n)', example: "Revenue by region.", de: "Same as SQL GROUP BY — push aggregations to Spark.", mistake: "groupBy without agg — returns GroupedData.", interview: "groupBy shuffle?", practice: "Practice #11" },
  { n: 12, title: "count() & collect()", concept: "Actions that trigger execution. collect() brings all data to driver.", syntax: "n = df.count()\nrows = df.limit(10).collect()", example: "Row count audit.", de: "Never collect() large DataFrames — OOM driver.", mistake: "df.collect() on TB table.", interview: "count vs collect?", practice: "Practice #12" },
  { n: 13, title: "show() & take()", concept: "Inspect small samples on driver.", syntax: "df.show(20, truncate=False)\ndf.take(5)", example: "Debug transform output.", de: "QA sample in notebook before promote.", mistake: "show() without truncate on wide strings.", interview: "take vs collect?", practice: "" },
  { n: 14, title: "write modes", concept: "Save DataFrame: append, overwrite, ignore, error.", syntax: 'df.write.mode("overwrite").parquet("out")\ndf.write.mode("append").format("delta").save("path")', example: "Daily partition append.", de: "Idempotent overwrite on partition `dt`.", mistake: "overwrite entire table when meant partition only.", interview: "append vs overwrite?", practice: "Practice #13" },
  { n: 15, title: "partitionBy()", concept: "Hive-style directory partitioning on write.", syntax: 'df.write.partitionBy("dt", "region").parquet("out")', example: "Partition by date.", de: "ADLS layout: `orders/dt=2024-01-01/region=IN/`.", mistake: "Too many partition columns → small files.", interview: "partitionBy best practices?", practice: "Practice #14" },
  { n: 16, title: "col() & F functions", concept: "pyspark.sql.functions for column expressions.", syntax: "from pyspark.sql import functions as F\n\nF.col(\"amount\")\nF.when(F.col(\"x\") > 0, \"pos\").otherwise(\"neg\")", example: "Conditional logic.", de: "F.coalesce, F.trim for data quality.", mistake: "Python UDF when built-in exists.", interview: "col vs string column ref?", practice: "Practice #15" },
  { n: 17, title: "cast() & dtypes", concept: "Explicit type coercion for schema alignment.", syntax: 'df.withColumn("id", col("id").cast("string"))\ndf.withColumn("amt", col("amt").cast("decimal(18,2)"))', example: "Align bronze to silver schema.", de: "Cast IDs to string to preserve leading zeros.", mistake: "Implicit cast failures → null silently.", interview: "cast vs astype?", practice: "" },
  { n: 18, title: "null handling", concept: "isNull, isNotNull, coalesce, fillna, dropna.", syntax: 'df.filter(col("id").isNotNull())\ndf.fillna({"country": "UNK"})\ndf.dropna(subset=["order_id"])', example: "DQ gate on keys.", de: "Reject batch if null rate on key > threshold.", mistake: "SQL NULL semantics — null != null.", interview: "coalesce vs fillna?", practice: "Practice #16" },
];

// ─── MEDIUM (18 topics) ─────────────────────────────────────────────────────
const mediumTopics = [
  { n: 1, title: "Inner / Left / Right / Full joins", concept: "Combine DataFrames on keys — shuffle join by default.", syntax: 'df.join(other, on="id", how="left")\ndf.join(other, df.a == other.b, "inner")', example: "Enrich orders with customers.", de: "Fact-dimension joins in gold layer.", mistake: "Join without filtering null keys first.", interview: "Join types in Spark?", practice: "Practice #17" },
  { n: 2, title: "Broadcast join", concept: "Replicate small table to all executors — avoids shuffle on small side.", syntax: "from pyspark.sql.functions import broadcast\n\ndf.join(broadcast(dim), \"id\")", example: "Join fact to small lookup.", de: "Broadcast dimension < 10MB (configurable).", mistake: "Broadcasting large table — driver OOM.", interview: "When broadcast join?", practice: "Practice #18" },
  { n: 3, title: "Sort-merge join", concept: "Default for large-large joins — both sides sorted and merged.", syntax: "# Automatic — no API call\n# spark.sql.join.preferSortMergeJoin = true", example: "Fact join fact on key.", de: "Ensure join keys are reasonably distributed.", mistake: "Cartesian product from missing join condition.", interview: "Sort-merge vs hash join?", practice: "Practice #19" },
  { n: 4, title: "Window functions", concept: "Partition + order + frame for analytics without collapsing rows.", syntax: "from pyspark.sql.window import Window\n\nw = Window.partitionBy(\"user_id\").orderBy(\"ts\")\ndf.withColumn(\"rn\", F.row_number().over(w))", example: "Rank per user.", de: "Deduplicate CDC: row_number keep rn=1.", mistake: "Missing partitionBy in window — global window.", interview: "Window vs groupBy?", practice: "Practice #20" },
  { n: 5, title: "row_number / rank / dense_rank", concept: "Ranking functions over window.", syntax: "F.row_number().over(w)\nF.rank().over(w)\nF.dense_rank().over(w)", example: "Top N per category.", de: "Latest record per business key.", mistake: "rank skips after ties; dense_rank doesn't.", interview: "row_number vs rank?", practice: "Practice #21" },
  { n: 6, title: "lag / lead", concept: "Access previous/next row in partition.", syntax: "F.lag(\"amount\", 1).over(w)\nF.lead(\"ts\", 1).over(w)", example: "Previous balance.", de: "Session gap detection in event streams.", mistake: "Wrong orderBy in window spec.", interview: "lag use case in DE?", practice: "Practice #22" },
  { n: 7, title: "sum/avg over window", concept: "Running aggregates without GROUP BY collapse.", syntax: "w = Window.partitionBy(\"acct\").orderBy(\"dt\").rowsBetween(Window.unboundedPreceding, 0)\nF.sum(\"amt\").over(w)", example: "Running total.", de: "Cumulative metrics for reporting.", mistake: "rowsBetween vs rangeBetween confusion.", interview: "Window frame types?", practice: "Practice #23" },
  { n: 8, title: "explode & posexplode", concept: "Flatten array column to rows.", syntax: 'df.select("id", F.explode("tags").alias("tag"))\ndf.select(F.posexplode("items"))', example: "Unnest JSON array.", de: "Bronze nested API → silver normalized.", mistake: "explode on null array.", interview: "explode vs lateral view?", practice: "Practice #24" },
  { n: 9, title: "pivot / stack", concept: "Wide ↔ long reshaping.", syntax: 'df.groupBy("region").pivot("product").sum("sales")\ndf.selectExpr("stack(2, \'q1\', q1, \'q2\', q2) as (q, val)")', example: "Sales matrix.", de: "Report-friendly wide tables in gold.", mistake: "pivot without agg on duplicates.", interview: "pivot in Spark?", practice: "" },
  { n: 10, title: "union / unionByName", concept: "Stack DataFrames vertically.", syntax: "df1.union(df2)\ndf1.unionByName(df2, allowMissingColumns=True)", example: "Combine daily files.", de: "Union bronze batches before silver.", mistake: "union without matching column order — use unionByName.", interview: "union vs unionAll?", practice: "Practice #25" },
  { n: 11, title: "UDF basics", concept: "User-defined functions — Python serialization overhead.", syntax: "from pyspark.sql.functions import udf\nfrom pyspark.sql.types import StringType\n\n@udf(StringType())\ndef clean(s):\n    return s.strip().lower() if s else None", example: "Custom parse logic.", de: "Last resort — prefer built-in F functions.", mistake: "UDF on every row when vectorized F exists.", interview: "UDF performance cost?", practice: "" },
  { n: 12, title: "Pandas UDF (vectorized)", concept: "Batch Arrow-based UDF — much faster than row UDF.", syntax: "import pandas as pd\n\n@F.pandas_udf(StringType())\ndef normalize(s: pd.Series) -> pd.Series:\n    return s.str.strip().str.lower()", example: "Vectorized string clean.", de: "Use when built-ins insufficient.", mistake: "Row UDF when pandas UDF fits.", interview: "pandas UDF vs UDF?", practice: "" },
  { n: 13, title: "Spark SQL", concept: "Register temp views and run SQL on DataFrames.", syntax: 'df.createOrReplaceTempView("orders")\nspark.sql("SELECT region, SUM(amount) FROM orders GROUP BY region")', example: "SQL-first analysts.", de: "Mix PySpark and SQL in Databricks notebooks.", mistake: "Global temp view name collisions.", interview: "DataFrame vs SQL API?", practice: "Practice #26" },
  { n: 14, title: "Caching & persist", concept: "Store DataFrame in memory/disk for reuse.", syntax: "df.cache()  # MEMORY_AND_DISK\ndf.persist(StorageLevel.MEMORY_ONLY)", example: "Iterative ML or repeated joins.", de: "Cache dimension used in multiple joins.", mistake: "Cache everything — memory pressure.", interview: "cache vs persist?", practice: "Practice #27" },
  { n: 15, title: "Repartition & coalesce", concept: "Change partition count — repartition shuffles, coalesce narrows.", syntax: "df.repartition(200, \"region\")\ndf.coalesce(10)", example: "Balance before write.", de: "coalesce before single-file export cautiously.", mistake: "coalesce to increase partitions — use repartition.", interview: "repartition vs coalesce?", practice: "Practice #28" },
  { n: 16, title: "Handling skew", concept: "Uneven key distribution causes straggler tasks.", syntax: "# Salting keys, AQE skew join\nspark.conf.set(\"spark.sql.adaptive.skewJoin.enabled\", \"true\")", example: "Hot key in join.", de: "Salt + explode pattern for skewed dimension.", mistake: "Ignoring skew in prod SLAs.", interview: "Skew join strategies?", practice: "Practice #29" },
  { n: 17, title: "Bucket joins", concept: "Pre-bucketed tables avoid shuffle on join.", syntax: 'df.write.bucketBy(32, "id").sortBy("id").saveAsTable("t")', example: "Optimized recurring joins.", de: "Delta liquid clustering (Databricks).", mistake: "Bucket count mismatch across tables.", interview: "Bucketing benefits?", practice: "" },
  { n: 18, title: "Delta MERGE", concept: "Upsert/delete/insert — CDC and SCD patterns.", syntax: 'from delta.tables import DeltaTable\n\nDeltaTable.forPath(spark, path).alias("t") \\\n  .merge(source.alias("s"), "t.id = s.id") \\\n  .whenMatchedUpdateAll() \\\n  .whenNotMatchedInsertAll() \\\n  .execute()', example: "Incremental CDC apply.", de: "Silver SCD Type 1/2 on Databricks.", mistake: "MERGE without match condition uniqueness.", interview: "MERGE vs overwrite?", practice: "Practice #30" },
];

// ─── ADVANCED (15 topics) ───────────────────────────────────────────────────
const advancedTopics = [
  { title: "Lazy evaluation & DAG", concept: "Transformations build logical plan; actions trigger execution.", example: "filter + select = one optimized stage.", de: "Explain plan before expensive job.", mistake: "Assuming each withColumn is separate job.", interview: "Lazy vs eager?", practice: "" },
  { title: "Stages & tasks", concept: "DAG split at shuffle boundaries into stages; tasks per partition.", example: "Wide transformation = new stage.", de: "Spark UI: identify straggler stage.", mistake: "Too many small tasks overhead.", interview: "What triggers shuffle?", practice: "" },
  { title: "Partitions vs tasks", concept: "RDD/DataFrame split into partitions; one task per partition typically.", example: "200 partitions ≈ 200 tasks per stage.", de: "Target 128MB–1GB per partition.", mistake: "1 partition or 100k partitions.", interview: "Ideal partition size?", practice: "" },
  { title: "Shuffle mechanics", concept: "Exchange data across network for join/groupBy/sort.", example: "groupBy key redistribution.", de: "Shuffle is main cost — minimize.", mistake: "Repeated shuffle on same key.", interview: "Reduce shuffle how?", practice: "" },
  { title: "AQE — Adaptive Query Execution", concept: "Runtime plan optimization: coalesce, skew join, switch join strategy.", syntax: "spark.conf.set(\"spark.sql.adaptive.enabled\", \"true\")", example: "Auto coalesce post-shuffle.", de: "Enable on Databricks runtime 7+.", mistake: "Disabling AQE without reason.", interview: "What does AQE do?", practice: "" },
  { title: "Catalyst optimizer", concept: "Rule-based optimizer on logical plan — predicate pushdown, column pruning.", example: "Filter pushed to Parquet scan.", de: "Partition pruning on `dt`.", mistake: "Disabling optimizer rules.", interview: "Catalyst vs Tungsten?", practice: "" },
  { title: "Tungsten & whole-stage codegen", concept: "Off-heap memory and generated JVM bytecode for hot loops.", example: "Faster aggregations.", de: "Why Spark SQL beats hand RDD.", mistake: "Python UDF breaks codegen.", interview: "Tungsten benefit?", practice: "" },
  { title: "Spark UI & Spark History Server", concept: "Monitor jobs, stages, storage, SQL tab.", example: "Find skewed task duration.", de: "Debug ADF → Databricks job failures.", mistake: "Not checking Spark UI on slow jobs.", interview: "How debug slow Spark job?", practice: "" },
  { title: "Speculative execution", concept: "Run duplicate tasks for stragglers.", example: "Auto on by default.", de: "Helps skew slightly; not substitute for fix.", mistake: "Relying only on speculation for skew.", interview: "Speculation trade-off?", practice: "" },
  { title: "Dynamic partition overwrite", concept: "Overwrite only partitions present in written DataFrame.", syntax: 'spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")', example: "Daily dt partition reload.", de: "Idempotent incremental without dropping table.", mistake: "Static overwrite drops other partitions.", interview: "Dynamic vs static overwrite?", practice: "" },
  { title: "Z-ordering / liquid clustering", concept: "Multi-dimensional clustering for skip pruning (Delta).", example: "ZORDER BY (customer_id, dt).", de: "Databricks OPTIMIZE + ZORDER.", mistake: "Over-zordering low-cardinality cols.", interview: "Z-order vs partition?", practice: "" },
  { title: "Structured Streaming basics", concept: "Micro-batch stream processing on DataFrame API.", syntax: 'spark.readStream.format("delta").load("bronze")\n  .writeStream.format("delta").trigger(processingTime="1 minute").start()', example: "Bronze → silver stream.", de: "Event Hub → Delta bronze.", mistake: "Treating streaming like batch semantics.", interview: "Micro-batch vs continuous?", practice: "" },
  { title: "Checkpointing streams", concept: "Fault-tolerant offset and state storage.", example: "Recover after cluster restart.", de: "ADLS checkpoint location.", mistake: "Deleting checkpoint casually.", interview: "Why checkpoint?", practice: "" },
  { title: "Watermarking", concept: "Bound state for late events in aggregations.", syntax: 'df.withWatermark("event_time", "10 minutes")', example: "Drop very late events.", de: "Session windows in streaming.", mistake: "No watermark → unbounded state.", interview: "Watermark purpose?", practice: "" },
  { title: "Cost-based optimizer (CBO)", concept: "Uses table statistics for join order.", syntax: "ANALYZE TABLE t COMPUTE STATISTICS", example: "Better join plan.", de: "Run ANALYZE on Delta gold tables.", mistake: "Stale stats → bad plans.", interview: "CBO requirements?", practice: "" },
];

// ─── DE (20 topics) ─────────────────────────────────────────────────────────
const deTopics = [
  { title: "Medallion architecture in Spark", concept: "Bronze raw → Silver cleaned → Gold business-ready on Delta.", example: "Layered ADLS paths.", de: "Databricks medallion template.", mistake: "Skipping bronze audit trail.", interview: "Explain medallion?", practice: "" },
  { title: "Incremental load patterns", concept: "Watermark, CDC, MERGE for delta loads.", example: "Daily append new dt.", de: "ADF copy incremental + Spark MERGE.", mistake: "Full reload at scale.", interview: "Incremental strategies?", practice: "" },
  { title: "CDC with Delta MERGE", concept: "Apply inserts/updates/deletes from change feed.", example: "Debezium → bronze → silver MERGE.", de: "Databricks CDF change data feed.", mistake: "Not handling deletes in MERGE.", interview: "CDC in lakehouse?", practice: "" },
  { title: "SCD Type 2 in Spark", concept: "Track history with effective dates and current flag.", example: "MERGE + insert new version row.", de: "Dimension history in gold.", mistake: "Updating in place losing history.", interview: "SCD2 implementation?", practice: "" },
  { title: "Data quality in pipelines", concept: "Expectations, quarantine, metrics.", example: "Great Expectations on Spark.", de: "Fail pipeline on null key rate.", mistake: "DQ only in BI layer.", interview: "Where enforce DQ?", practice: "" },
  { title: "Partition strategy", concept: "Balance pruning vs small files.", example: "Partition by dt; bucket by id.", de: "ADLS folder layout for ADF.", mistake: "High-cardinality partition columns.", interview: "Partition column choice?", practice: "" },
  { title: "Small file problem", concept: "Many tiny files hurt listing and read performance.", example: "Compaction job.", de: "OPTIMIZE on Delta; coalesce on write.", mistake: "Streaming micro-batches without compaction.", interview: "Fix small files?", practice: "" },
  { title: "ADF + Databricks pattern", concept: "ADF orchestrates; Databricks runs PySpark.", example: "Copy Activity → Notebook.", de: "Parameterize notebook with @pipeline().", mistake: "Heavy transform in ADF Mapping Data Flows only.", interview: "ADF vs Databricks?", practice: "" },
  { title: "Unity Catalog", concept: "Centralized governance: tables, ACLs, lineage.", example: "three-level namespace catalog.schema.table.", de: "Enterprise Databricks governance.", mistake: "Hive metastore sprawl.", interview: "Unity Catalog benefits?", practice: "" },
  { title: "Secrets & credentials", concept: "Databricks secrets scopes, not hardcoded.", example: "dbutils.secrets.get.", de: "Key Vault backed scopes.", mistake: "Keys in notebook source.", interview: "Secret management?", practice: "" },
  { title: "Cluster sizing", concept: "Driver + workers, memory, cores autoscaling.", example: "Memory-heavy shuffle needs RAM.", de: "Job clusters vs all-purpose.", mistake: "Under-provisioned driver for collect.", interview: "Size cluster how?", practice: "" },
  { title: "Photon engine", concept: "Databricks native vectorized engine on Delta.", example: "Faster SQL/DF on Databricks.", de: "Enable on compatible workloads.", mistake: "Assuming Photon on all ops.", interview: "Photon vs vanilla Spark?", practice: "" },
  { title: "Testing PySpark", concept: "pytest with local SparkSession or chispa.", example: "Assert schema and row equality.", de: "CI unit tests for transforms.", mistake: "No tests on business logic.", interview: "Test Spark how?", practice: "" },
  { title: "CI/CD for notebooks", concept: "Repos, workflows, bundle deploy.", example: "Databricks Asset Bundles.", de: "Git integration in Databricks.", mistake: "Manual notebook export.", interview: "Deploy pipelines?", practice: "" },
  { title: "Lineage & observability", concept: "Track data flow and job metrics.", example: "Unity Catalog lineage.", de: "Azure Monitor + Spark listener.", mistake: "No row-count reconciliation.", interview: "Observability in DE?", practice: "" },
  { title: "Multi-hop ETL in one session", concept: "Chain transforms; cache hot intermediates.", example: "Bronze read → silver write → gold agg.", de: "Single Databricks job DAG.", mistake: "Write-read-write unnecessary round trips.", interview: "Pipeline modularization?", practice: "" },
  { title: "Handling schema evolution", concept: "mergeSchema, Delta auto merge.", syntax: 'df.write.option("mergeSchema", "true").mode("append")', example: "New API field added.", de: "Bronze permissive; silver strict.", mistake: "Breaking prod on new column.", interview: "Schema evolution?", practice: "" },
  { title: "Time travel (Delta)", concept: "Query historical versions via version or timestamp.", syntax: "spark.read.format(\"delta\").option(\"versionAsOf\", 5).load(path)", example: "Audit before bad MERGE.", de: "Rollback analysis.", mistake: "Not knowing version exists after mistake.", interview: "Time travel use?", practice: "" },
  { title: "VACUUM & retention", concept: "Remove old files no longer referenced.", example: "VACUUM table RETAIN 168 HOURS.", de: "Storage cost control.", mistake: "Vacuum breaking time travel window.", interview: "VACUUM cautions?", practice: "" },
  { title: "End-to-end DE pipeline story", concept: "Ingest → validate → transform → load → monitor.", example: "Interview narrative.", de: "ADF trigger → Databricks PySpark → Delta gold → Power BI.", mistake: "Can't explain failure recovery.", interview: "Walk through pipeline?", practice: "" },
];

// ─── TRAPS (15 topics) ──────────────────────────────────────────────────────
const trapTopics = [
  { title: "collect() on large data", concept: "Brings all partitions to driver — OOM.", example: "Never on production tables.", de: "Use write or take(n) or agg.", mistake: "df.collect() for 'quick check'.", interview: "collect danger?", practice: "" },
  { title: "count() triggers full scan", concept: "Action scans entire dataset.", example: "Expensive on huge table.", de: "Use metadata stats or approximate if ok.", mistake: "Repeated count in loop.", interview: "count cost?", practice: "" },
  { title: "UDF kills optimization", concept: "Black box to Catalyst; no predicate pushdown.", example: "Prefer F functions.", de: "pandas UDF better than row UDF.", mistake: "UDF for trim/lower.", interview: "UDF downsides?", practice: "" },
  { title: "Shuffle partition default 200", concept: "May be wrong for tiny or huge jobs.", example: "Tune spark.sql.shuffle.partitions.", de: "AQE coalesce helps.", mistake: "Never tuning partitions.", interview: "How many shuffle partitions?", practice: "" },
  { title: "Cartesian join", concept: "Missing join condition → cross product.", example: "Explodes row count.", de: "spark.sql.crossJoin.enabled=false default.", mistake: "Implicit cross join.", interview: "Detect cartesian?", practice: "" },
  { title: "Data skew", concept: "One key has most rows — straggler task.", example: "Hot user_id.", de: "Salt keys, AQE skew join.", mistake: "Ignoring Spark UI task skew.", interview: "Fix skew?", practice: "" },
  { title: "Small files on write", concept: "Too many partitions per write.", example: "repartition(10000) before save.", de: "Batch before write; OPTIMIZE.", mistake: "One file per micro-batch forever.", interview: "Small file fix?", practice: "" },
  { title: "cache() without unpersist", concept: "Memory leak across notebooks.", example: "unpersist when done.", de: "Cluster memory pressure.", mistake: "Cache and forget.", interview: "When unpersist?", practice: "" },
  { title: "Driver OOM", concept: "Driver holds broadcast, collect, plan too large.", example: "Increase driver memory.", de: "Avoid huge broadcast.", mistake: "broadcast(10GB table).", interview: "Driver vs executor OOM?", practice: "" },
  { title: "Executor OOM", concept: "Task memory spike — skew or wide rows.", example: "Increase memory or fix skew.", de: "Spill to disk if configured.", mistake: "Only adding executors without fix.", interview: "Executor OOM debug?", practice: "" },
  { title: "toPandas() on big data", concept: "Collects entire DataFrame to pandas.", example: "Same as collect danger.", de: "Use Spark or sample.", mistake: "toPandas() in prod transform.", interview: "toPandas when ok?", practice: "" },
  { title: "Assuming order without orderBy", concept: "Partitions unordered; union order not guaranteed.", example: "Must sort for deterministic output.", de: "Explicit orderBy before export.", mistake: "Relying on file read order.", interview: "Is Spark ordered?", practice: "" },
  { title: "Null join keys", concept: "Null never matches in equi-join.", example: "Filter or coalesce keys.", de: "Surrogate keys for nulls.", mistake: "Losing rows silently.", interview: "Null in join?", practice: "" },
  { title: "Timezone in timestamps", concept: "Session timezone affects parsing/display.", example: "Store UTC; convert at edge.", de: "spark.sql.session.timeZone = UTC.", mistake: "Mixed naive timestamps.", interview: "Timestamp best practice?", practice: "" },
  { title: "pandas vs PySpark boundary", concept: "pandas on driver; Spark distributed.", example: "mapInPandas for partition-local pandas.", de: "Know when to stay in Spark.", mistake: "Pandas loop on collected data at scale.", interview: "When leave Spark?", practice: "" },
];

function shortTopics(items) {
  return items.map((t, i) => block({ n: i + 1, ...t }));
}

const notesFrontmatter = `---
title: Spark Notes
description: Deep PySpark reference for Data Engineering interviews
parent: spark
hidden: true
order: 1
difficulty: basic
---

`;

const fullNotes = notesFrontmatter + [
  "# Spark Master Notes",
  "",
  "Built for **Data Engineering** interviews — PySpark → partitions → shuffle → optimization → Databricks/ADF.",
  "",
  "Each topic: **Concept → Syntax → Example → DE example → Mistake → Interview → Practice**",
  "",
  "---",
  "",
  "## Basic",
  "",
  "### Easy — PySpark Fundamentals",
  "",
  easyTopics.map(block).join("\n"),
  "---",
  "",
  "## Medium",
  "",
  "### Medium — Joins, Windows & Optimization",
  "",
  mediumTopics.map(block).join("\n"),
  "---",
  "",
  "## Advanced",
  "",
  "### Advanced Spark Internals",
  "",
  shortTopics(advancedTopics),
  "---",
  "",
  "## Data Engineering",
  "",
  "### Data Engineering with Spark",
  "",
  shortTopics(deTopics),
  "---",
  "",
  "## Patterns & Traps",
  "",
  shortTopics(trapTopics),
].join("\n");

// ─── INTERVIEW 45 ───────────────────────────────────────────────────────────
const interviewQs = [
  ["What is Apache Spark?", "Unified analytics engine for large-scale data processing. In-memory, distributed, supports batch and streaming. DE: core of Databricks lakehouse workloads."],
  ["RDD vs DataFrame vs Dataset?", "RDD: low-level, opaque. DataFrame: structured, Catalyst optimized (PySpark). Dataset: typed, Scala/Java primarily. DE: use DataFrame API in PySpark."],
  ["Lazy evaluation?", "Transformations build DAG; actions (count, write) trigger execution. Enables optimization. DE: explain plan before expensive job."],
  ["What triggers a shuffle?", "Operations redistributing data: groupBy, join, repartition, distinct, orderBy (global). DE: shuffle is main performance cost."],
  ["Partition vs bucket?", "Partition: directory pruning on disk. Bucket: hash grouping within files for join optimization. DE: partition by dt; bucket high-cardinality join keys."],
  ["What is a stage?", "Set of tasks with pipelined ops, separated by shuffle boundaries. DE: Spark UI shows stage duration for debugging."],
  ["Broadcast join when?", "Small table fits in memory (default <10MB, configurable). Avoids shuffle on small side. DE: broadcast dimension tables."],
  ["Sort-merge join?", "Default large-large join. Both sides sorted on join key, merged. DE: ensure stats and AQE enabled."],
  ["What is data skew?", "Uneven key distribution — one partition much larger. Causes stragglers. DE: salt keys, AQE skew join, isolate hot keys."],
  ["How fix skewed join?", "Salting, broadcast if one side small, AQE skew optimization, pre-aggregate, filter hot keys separately."],
  ["cache vs persist?", "cache() = persist(MEMORY_AND_DISK). persist levels: MEMORY_ONLY, DISK_ONLY, etc. DE: cache reused intermediates; unpersist after."],
  ["repartition vs coalesce?", "repartition: full shuffle, up or down. coalesce: narrow, only reduce partitions. DE: coalesce before write to limit files; repartition for balance."],
  ["What is AQE?", "Adaptive Query Execution — runtime replanning: coalesce partitions, skew join, switch join strategy. Enable spark.sql.adaptive.enabled."],
  ["Catalyst optimizer?", "Logical plan optimization: predicate pushdown, column pruning, constant folding. DE: partition pruning on Parquet/Delta."],
  ["What is Tungsten?", "Physical execution: off-heap memory, whole-stage codegen. Faster CPU cache-friendly ops."],
  ["Delta Lake vs Parquet?", "Delta adds ACID transactions, time travel, MERGE, schema enforcement on Parquet files. DE: standard for Databricks gold."],
  ["MERGE in Delta?", "Upsert pattern: whenMatchedUpdate, whenNotMatchedInsert, whenMatchedDelete. DE: CDC and SCD implementations."],
  ["Dynamic partition overwrite?", "Only overwrite partitions present in written data, not entire table. spark.sql.sources.partitionOverwriteMode=dynamic."],
  ["Window function in Spark?", "Analytics over partition without collapsing rows. Requires partitionBy, orderBy, optional frame. DE: dedupe, running totals."],
  ["row_number vs rank?", "row_number: unique sequential. rank: ties same rank, gaps after. dense_rank: ties same, no gaps. DE: row_number for dedupe."],
  ["Why avoid UDF?", "Python serialization per row, no Catalyst optimization, breaks codegen. Prefer built-in functions or pandas UDF."],
  ["pandas UDF benefit?", "Vectorized Arrow batches — much faster than row UDF. Use when built-ins insufficient."],
  ["collect() danger?", "Pulls all data to driver — OOM on large datasets. Use write, take(n), or aggregations instead."],
  ["count() cost?", "Full scan action. Avoid in loops. Consider table statistics for metadata."],
  ["Ideal partition size?", "Roughly 128MB–1GB per partition for HDFS/ADLS. Tune spark.sql.shuffle.partitions and file compaction."],
  ["Small file problem?", "Too many tiny files slow metadata ops and reads. Fix: coalesce, batch writes, Delta OPTIMIZE, compaction jobs."],
  ["Structured Streaming model?", "Micro-batch (default) or continuous processing. Treats stream as unbounded table. DE: Event Hub → Delta bronze."],
  ["Checkpoint in streaming?", "Stores offsets and state for fault recovery. Don't delete checkpoint without understanding reset."],
  ["Watermark?", "Bounds late data in aggregations; drops events older than threshold from state."],
  ["Medallion architecture?", "Bronze (raw) → Silver (cleaned/conformed) → Gold (business aggregates). DE: standard Databricks pattern."],
  ["Incremental load strategies?", "Watermark column, CDC MERGE, partition append, change data feed. Avoid full reload at scale."],
  ["SCD Type 2 in Spark?", "Track versions with effective dates; MERGE closes old row, inserts new. Gold dimension pattern."],
  ["How debug slow Spark job?", "Spark UI: SQL tab, stages, task skew histogram, shuffle read/write size, GC time."],
  ["Driver OOM causes?", "collect, large broadcast, huge query plan, too many partitions metadata. Increase driver memory or fix pattern."],
  ["Executor OOM causes?", "Skew, large rows, spill failure, insufficient memory. Fix skew, tune memory, increase executors."],
  ["When use Spark vs pandas?", "pandas: single-node, interactive, small data. Spark: distributed, TB+, cluster. DE: Databricks threshold ~few GB driver."],
  ["Unity Catalog?", "Databricks governance: catalog.schema.table, ACLs, lineage, audit. Three-level namespace."],
  ["ADF + Databricks integration?", "ADF orchestrates schedules; Notebook/JAR activity runs PySpark on job cluster. Pass parameters via widgets."],
  ["Photon?", "Databricks vectorized query engine on Delta — faster for many SQL/DataFrame workloads."],
  ["Z-ordering?", "Multi-dimensional data layout for file skipping. OPTIMIZE ZORDER BY (cols). Complements partitioning."],
  ["Time travel Delta?", "Query versionAsOf or timestampAsOf. Audit and recover from bad writes within retention."],
  ["Schema evolution?", "mergeSchema on append; Delta auto merge. Bronze permissive, silver contract enforced."],
  ["Null in equi-join?", "Null keys don't match. Use coalesce or filter. Rows with null join keys dropped from inner join."],
  ["Cartesian join?", "Missing or always-true join condition. Explodes rows. Prevent with explicit keys and crossJoin enabled check."],
  ["Explain end-to-end Spark pipeline?", "Ingest (ADF/copy) → bronze Delta → PySpark validate/transform → silver MERGE → gold aggregates → BI. Idempotent, monitored, tested."],
];

let interviewMd = `---
title: Spark Interview Q&A
description: 45 conceptual PySpark questions for Data Engineering interviews
parent: spark
hidden: true
order: 3
difficulty: interview
---

# Spark Interview Flashcards

`;

interviewQs.forEach(([q, a], i) => {
  interviewMd += `### ${i + 1}. ${q}\n\n${a}\n\n`;
});

// ─── PRACTICE 30 ────────────────────────────────────────────────────────────
const practice = [
  { id: 1, tier: "basic", category: "transformations", title: "Filter high amounts", body: "Return rows where `amount` > 1000.", solution: 'from pyspark.sql import functions as F\n\ndef high_amounts(df):\n    return df.filter(F.col("amount") > 1000)', anchor: "q-1" },
  { id: 2, tier: "basic", category: "transformations", title: "Select and rename", body: "Select `id`, `name` and rename `name` to `customer_name`.", solution: 'def select_rename(df):\n    return df.select("id", F.col("name").alias("customer_name"))', anchor: "q-2" },
  { id: 3, tier: "basic", category: "transformations", title: "Add total column", body: "Add column `total` = `qty` * `price`.", solution: 'def add_total(df):\n    return df.withColumn("total", F.col("qty") * F.col("price"))', anchor: "q-3" },
  { id: 4, tier: "basic", category: "transformations", title: "Drop null keys", body: "Remove rows where `order_id` is null.", solution: 'def drop_null_keys(df):\n    return df.filter(F.col("order_id").isNotNull())', anchor: "q-4" },
  { id: 5, tier: "basic", category: "transformations", title: "Cast id to string", body: "Cast `customer_id` to string type.", solution: 'def cast_id(df):\n    return df.withColumn("customer_id", F.col("customer_id").cast("string"))', anchor: "q-5" },
  { id: 6, tier: "basic", category: "transformations", title: "Group sum by region", body: "Total `sales` per `region`.", solution: 'def sales_by_region(df):\n    return df.groupBy("region").agg(F.sum("sales").alias("total_sales"))', anchor: "q-6" },
  { id: 7, tier: "basic", category: "transformations", title: "Distinct countries", body: "Return distinct `country` values.", solution: 'def distinct_countries(df):\n    return df.select("country").distinct()', anchor: "q-7" },
  { id: 8, tier: "basic", category: "transformations", title: "Fill null country", body: "Replace null `country` with 'UNK'.", solution: 'def fill_country(df):\n    return df.fillna({"country": "UNK"})', anchor: "q-8" },
  { id: 9, tier: "medium", category: "transformations", title: "Conditional flag", body: "Add `is_premium` = 1 if `amount` >= 500 else 0.", solution: 'def premium_flag(df):\n    return df.withColumn(\n        "is_premium",\n        F.when(F.col("amount") >= 500, 1).otherwise(0)\n    )', anchor: "q-9" },
  { id: 10, tier: "medium", category: "transformations", title: "Explode tags", body: "Explode array column `tags` into rows.", solution: 'def explode_tags(df):\n    return df.select("id", F.explode("tags").alias("tag"))', anchor: "q-10" },
  { id: 11, tier: "basic", category: "joins", title: "Inner join orders customers", body: "Inner join `orders` and `customers` on `customer_id`.", solution: 'def join_orders_customers(orders, customers):\n    return orders.join(customers, on="customer_id", how="inner")', anchor: "q-11" },
  { id: 12, tier: "basic", category: "joins", title: "Left join enrich", body: "Left join `facts` with `dim` on `id`, keep all facts.", solution: 'def left_enrich(facts, dim):\n    return facts.join(dim, facts.id == dim.id, "left")', anchor: "q-12" },
  { id: 13, tier: "medium", category: "joins", title: "Broadcast join", body: "Join large `facts` to small `lookup` using broadcast.", solution: 'from pyspark.sql.functions import broadcast\n\ndef broadcast_join(facts, lookup):\n    return facts.join(broadcast(lookup), "key")', anchor: "q-13" },
  { id: 14, tier: "medium", category: "joins", title: "Anti join", body: "Rows in `all_customers` not in `active` on `id`.", solution: 'def inactive_customers(all_customers, active):\n    return all_customers.join(active.select("id"), "id", "left_anti")', anchor: "q-14" },
  { id: 15, tier: "medium", category: "joins", title: "Multi-key join", body: "Join on `region` and `product_id`.", solution: 'def multi_join(a, b):\n    return a.join(b, ["region", "product_id"], "inner")', anchor: "q-15" },
  { id: 16, tier: "hard", category: "joins", title: "Join with null-safe coalesce", body: "Join on coalesced keys: `coalesce(a.id, -1) = coalesce(b.id, -1)`.", solution: 'def null_safe_join(a, b):\n    return a.join(\n        b,\n        F.coalesce(a.id, F.lit(-1)) == F.coalesce(b.id, F.lit(-1)),\n        "inner"\n    )', anchor: "q-16" },
  { id: 17, tier: "basic", category: "window", title: "Row number dedupe", body: "Keep one row per `user_id` — latest by `ts` (row_number = 1).", solution: 'from pyspark.sql.window import Window\n\ndef dedupe_latest(df):\n    w = Window.partitionBy("user_id").orderBy(F.col("ts").desc())\n    return df.withColumn("rn", F.row_number().over(w)).filter(F.col("rn") == 1).drop("rn")', anchor: "q-17" },
  { id: 18, tier: "medium", category: "window", title: "Running sum", body: "Running sum of `amount` per `account_id` ordered by `dt`.", solution: 'def running_sum(df):\n    w = Window.partitionBy("account_id").orderBy("dt").rowsBetween(Window.unboundedPreceding, 0)\n    return df.withColumn("running_total", F.sum("amount").over(w))', anchor: "q-18" },
  { id: 19, tier: "medium", category: "window", title: "Lag previous amount", body: "Previous `amount` per `user_id` ordered by `event_time`.", solution: 'def lag_amount(df):\n    w = Window.partitionBy("user_id").orderBy("event_time")\n    return df.withColumn("prev_amount", F.lag("amount", 1).over(w))', anchor: "q-19" },
  { id: 20, tier: "medium", category: "window", title: "Rank by revenue", body: "Dense rank `revenue` per `region` descending.", solution: 'def rank_revenue(df):\n    w = Window.partitionBy("region").orderBy(F.col("revenue").desc())\n    return df.withColumn("rev_rank", F.dense_rank().over(w))', anchor: "q-20" },
  { id: 21, tier: "hard", category: "window", title: "7-day moving avg", body: "Moving average of `value` over last 7 rows per `sensor_id`.", solution: 'def moving_avg_7(df):\n    w = Window.partitionBy("sensor_id").orderBy("ts").rowsBetween(-6, 0)\n    return df.withColumn("ma7", F.avg("value").over(w))', anchor: "q-21" },
  { id: 22, tier: "hard", category: "window", title: "Session gap flag", body: "Flag new session if gap > 30 min from previous event per `user_id`.", solution: 'def session_flag(df):\n    w = Window.partitionBy("user_id").orderBy("event_time")\n    return df.withColumn(\n        "new_session",\n        F.when(\n            F.col("event_time").cast("long") - F.lag("event_time").over(w).cast("long") > 1800,\n            1\n        ).otherwise(0)\n    )', anchor: "q-22" },
  { id: 23, tier: "basic", category: "optimization", title: "Repartition before write", body: "Repartition to 10 files before write.", solution: 'def repartition_write(df, path):\n    df.repartition(10).write.mode("overwrite").parquet(path)', anchor: "q-23" },
  { id: 24, tier: "basic", category: "optimization", title: "Cache and use", body: "Cache `dim` and join twice to same fact.", solution: 'def cache_dim_join(fact, dim):\n    dim_cached = dim.cache()\n    a = fact.join(dim_cached, "id")\n    b = fact.join(dim_cached, "id")\n    dim_cached.unpersist()\n    return a, b', anchor: "q-24" },
  { id: 25, tier: "medium", category: "optimization", title: "Partition prune filter", body: "Read only `dt = '2024-01-01'` partition from orders.", solution: 'def read_partition(spark, base_path):\n    return spark.read.parquet(base_path).filter(F.col("dt") == "2024-01-01")', anchor: "q-25" },
  { id: 26, tier: "medium", category: "optimization", title: "Coalesce output files", body: "Write with coalesce(4) to limit output files.", solution: 'def write_coalesced(df, path):\n    df.coalesce(4).write.mode("overwrite").parquet(path)', anchor: "q-26" },
  { id: 27, tier: "medium", category: "optimization", title: "Select columns early", body: "Project only needed columns before join.", solution: 'def project_before_join(fact, dim):\n    return fact.select("id", "amount").join(dim.select("id", "name"), "id")', anchor: "q-27" },
  { id: 28, tier: "hard", category: "optimization", title: "Salt skewed join", body: "Salt `facts` with random 0-9 on key for skewed join prep.", solution: 'import random\nfrom pyspark.sql.types import IntegerType\n\ndef salt_key(df):\n    return df.withColumn("salt", (F.rand() * 10).cast(IntegerType()))', anchor: "q-28" },
  { id: 29, tier: "hard", category: "optimization", title: "AQE config snippet", body: "Set Spark conf to enable AQE and skew join.", solution: 'def enable_aqe(spark):\n    spark.conf.set("spark.sql.adaptive.enabled", "true")\n    spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")', anchor: "q-29" },
  { id: 30, tier: "hard", category: "optimization", title: "Dynamic partition overwrite", body: "Configure dynamic partition overwrite mode.", solution: 'def enable_dynamic_overwrite(spark):\n    spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")', anchor: "q-30" },
];

fs.writeFileSync(path.join(root, "content/topics/spark-notes.md"), fullNotes);
fs.writeFileSync(path.join(root, "content/topics/spark-interview.md"), interviewMd);
fs.writeFileSync(path.join(root, "src/data/spark-practice-questions.json"), JSON.stringify(practice, null, 2));

console.log("Generated:");
console.log("  notes:", fullNotes.split("\n").length, "lines");
console.log("  interview:", interviewQs.length, "questions");
console.log("  practice:", practice.length, "problems");

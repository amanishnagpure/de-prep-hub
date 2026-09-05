---
title: Cloud Interview Q&A
description: 50 conceptual Azure Data Engineering questions for interviews
parent: cloud
hidden: true
order: 3
difficulty: interview
---

# Cloud Interview Flashcards

### 1. What is Azure Data Factory?

Cloud ETL/ELT orchestration service. Coordinates data movement and transformation via pipelines, linked services, datasets, and triggers — serverless, pay per execution.

### 2. Linked service vs dataset?

Linked service = connection string/credentials to a resource (SQL, ADLS, Blob). Dataset = schema/location pointer within that linked service (table name, file path, format).

### 3. Get Metadata vs Lookup?

Get Metadata returns structural info (exists, size, child items) without row data. Lookup returns small tabular result sets (max 5000 rows, 4 MB) for control/watermark queries.

### 4. Lookup activity limits?

Max 5000 rows and 4 MB result size. Not for bulk reads — use Copy or Data Flow.

### 5. What is a Fail activity?

Deliberately fails pipeline with custom error code/message. Use for validation gates (empty file, zero rows) so Monitor/alerts fire.

### 6. Integration Runtime types?

Azure IR (cloud), Self-hosted IR (on-prem/private), Azure-SSIS IR. IR executes copy, data flow, and external lookups.

### 7. When use Self-hosted IR?

On-prem data sources, VNet-isolated resources without public endpoint, or when data cannot leave local network. Install on VM near source.

### 8. Copy activity performance knobs?

DIU/parallel copies, partitioned source query, compression (Parquet), staging account, IR placement near source.

### 9. Mapping Data Flow vs Copy?

Copy = movement with light mapping. Mapping Data Flow = visual Spark-based transforms (joins, aggregates, derived columns) at scale.

### 10. Schedule trigger vs tumbling window?

Schedule = cron-style single run. Tumbling window = backfill/reprocess fixed time slices with dependency on previous window state.

### 11. Event-based trigger?

Fires on Blob events (Event Grid), tumbling window completion, or custom event. Enables event-driven ingestion without polling.

### 12. Pipeline parameters vs variables?

Parameters = external inputs at invoke time. Variables = mutable values set inside pipeline via Set Variable activity.

### 13. Execute Pipeline activity?

Calls child pipeline with parameter passing — modular orchestration pattern for reusable ETL blocks.

### 14. ForEach activity concurrency?

Iterates array with optional batch count limiting parallel iterations — balance throughput vs throttling.

### 15. ADF Git integration purpose?

Source control for pipelines/data flows; publish generates ARM templates for CI/CD. Secrets never committed — use Key Vault refs.

### 16. What is ADLS Gen2?

Hadoop-compatible data lake storage on Azure Blob with hierarchical namespace (true folders), POSIX ACLs, and analytics optimizations.

### 17. ADLS Gen2 vs Blob storage?

Gen2 adds hierarchical namespace, ACLs, directory operations — required for most lakehouse patterns. Blob is flat namespace.

### 18. Hot, Cool, Archive tiers?

Hot = frequent access; Cool = 30+ days infrequent; Archive = rare access, high rehydration latency. Lifecycle policies automate tiering.

### 19. RBAC vs ACLs on ADLS?

RBAC (Azure roles like Storage Blob Data Reader) at scope level. ACLs = POSIX fine-grained per folder/file. Both can apply — effective permission is intersection.

### 20. Managed Identity for ADLS?

ADF/Synapse MSI gets Storage Blob Data Contributor on storage account — no account keys in linked services.

### 21. ABFS path format?

`abfss://container@account.dfs.core.windows.net/path` — preferred for Spark/Synapse over wasbs.

### 22. What is Azure Synapse Analytics?

Unified analytics: serverless SQL, dedicated SQL pools, Spark pools, pipelines — integrated with ADLS and Power BI.

### 23. Serverless SQL pool use case?

Ad-hoc T-SQL over data lake files via OPENROWSET/external tables. Pay per TB scanned — no infrastructure to manage.

### 24. Dedicated SQL pool use case?

MPP warehouse for predictable BI workloads. Pause/resume for cost. DISTRIBUTION HASH/ROUND_ROBIN, CCI indexes.

### 25. COPY INTO vs INSERT?

COPY INTO bulk loads from ADLS Parquet/CSV in parallel — orders of magnitude faster than row-by-row INSERT on dedicated pool.

### 26. External table in Synapse?

Metadata pointer to files in ADLS — query in place without loading. CETAS materializes results back to lake.

### 27. CETAS?

CREATE EXTERNAL TABLE AS SELECT — run query once, write results to ADLS, reduce repeated scan costs.

### 28. Synapse Spark pool?

On-demand Spark for big data transforms, Delta Lake, ML. Separate from SQL pools; auto-scale executors.

### 29. Synapse Link for Cosmos DB?

Near real-time analytics: CDC from Cosmos to Synapse SQL tables without custom ETL pipelines.

### 30. Azure Key Vault in ADF?

Store secrets; linked services reference secret names. ADF MSI needs Get permission. Enables secret rotation without pipeline edits.

### 31. Medallion architecture on Azure?

Bronze (raw) → Silver (cleansed/conformed) → Gold (business aggregates) on ADLS, orchestrated by ADF/Databricks/Synapse Spark.

### 32. Bronze layer best practices?

Immutable raw landing, partition by ingest date, retain source format, minimal transforms, audit metadata columns.

### 33. Silver layer best practices?

Schema enforcement, dedupe, SCD handling, quality filters, Parquet/Delta, quarantine bad records.

### 34. Gold layer best practices?

Denormalized star/summary tables for BI, business KPIs, optimized for read, often Synapse tables or Power BI datasets.

### 35. Watermark pattern in ADF?

Lookup last processed timestamp → incremental Copy with WHERE clause → update watermark on success.

### 36. Idempotent pipeline design?

Safe to rerun: overwrite partition, MERGE upsert, check processed file log, move files to processed folder.

### 37. Parameterized datasets?

Dynamic file paths using `@dataset().param` or pipeline expressions — one dataset definition, many concrete paths.

### 38. Conditional activity?

If/else branching on expression — route success/failure paths, skip activities, trigger alerts.

### 39. Until activity?

Loop until condition true — polling pattern (with timeout caution). Prefer event triggers over tight loops.

### 40. Data Flow debug cluster?

Temporary Spark cluster for interactive debugging in ADF UI — shut down when done to avoid cost.

### 41. Private endpoint for ADF?

Managed private endpoints connect ADF in managed VNet to ADLS/SQL/KV without public internet. Approve connection on target.

### 42. Azure Monitor for ADF?

Pipeline run metrics, failures, duration alerts, Log Analytics diagnostic settings, integration with action groups.

### 43. Delta Lake on Azure?

Open format with ACID transactions on ADLS — used in Databricks/Synapse Spark for reliable upserts and time travel.

### 44. PolyBase in Synapse?

Bulk load/query external data in dedicated pool. Largely superseded by COPY INTO but still in legacy docs.

### 45. Distribution key choice?

HASH on high-cardinality join column avoids data shuffle; REPLICATE for small dims; ROUND_ROBIN default staging.

### 46. Pause dedicated SQL pool?

Stops compute billing; storage persists. Resume before queries. Critical cost control for dev/test.

### 47. ADF ARM template deployment?

Publish from Git generates ARM — deploy across environments with parameter files for linked service endpoints.

### 48. Storage events trigger duplicate handling?

Event Grid may deliver duplicates — design idempotent processing with file ETag or processed registry table.

### 49. Cross-region replication for ADLS?

GRS/RA-GRS for DR; secondary read access optional. Consider RPO/RTO for lake disaster recovery strategy.

### 50. Common ADF interview trap?

Using Lookup for file existence check or large reads — correct answer is Get Metadata for structure, Copy/Data Flow for data.

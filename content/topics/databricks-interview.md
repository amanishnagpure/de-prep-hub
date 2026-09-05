---
title: Databricks Interview Q&A
description: 45 conceptual Databricks questions for Data Engineering interviews
parent: databricks
hidden: true
order: 3
difficulty: interview
---

# Databricks Interview Flashcards

### 1. What is Delta Lake?

Open storage format on Parquet with ACID transaction log, time travel, schema enforcement, and unified batch/streaming APIs.

### 2. Delta vs Parquet?

Parquet is file format only; Delta adds _delta_log for transactions, DML, time travel, MERGE, CDF.

### 3. What is the transaction log?

JSON files in _delta_log recording commits — add/remove files, metadata, protocol. Source of truth for table state.

### 4. Explain ACID on object storage.

Optimistic concurrency via log ordering; writers check version; readers see consistent snapshot.

### 5. What is time travel?

Query prior table versions with VERSION AS OF or TIMESTAMP AS OF using retained data files.

### 6. How long is history retained?

Default 7 days deleted file retention; configurable via table property and VACUUM RETAIN.

### 7. RESTORE vs time travel query?

RESTORE mutates table to old version; time travel is read-only SELECT.

### 8. Schema enforcement vs evolution?

Enforcement rejects incompatible writes; evolution adds/changes columns via ALTER or mergeSchema.

### 9. When use mergeSchema?

Controlled bronze evolution; avoid blind mergeSchema in production silver/gold.

### 10. Partition vs Z-ORDER?

Partition splits directories by column value; Z-ORDER colocates related rows in files for multi-column filters.

### 11. Liquid clustering?

DBR 13+ replaces static partitions; OPTIMIZE maintains cluster layout automatically.

### 12. What is MERGE?

Upsert: MATCHED update/delete, NOT MATCHED insert — idempotent CDC pattern.

### 13. MERGE vs INSERT OVERWRITE?

MERGE row-level idempotent; overwrite replaces partitions/files — risky for shared tables.

### 14. Change Data Feed?

Emits row changes between versions when enabled — downstream incremental without full scan.

### 15. OPTIMIZE purpose?

Compacts small files into larger ones; optional ZORDER BY for data layout.

### 16. When run OPTIMIZE?

After large appends/streaming batches; schedule off-peak; not every micro-batch.

### 17. VACUUM purpose?

Physically deletes orphaned data files past retention — frees storage.

### 18. VACUUM risk?

RETAIN too low removes files needed for time travel and clones sharing files.

### 19. Small files problem?

Too many tiny files slow listing/reads — fix with OPTIMIZE, repartition, avoid bad partitioning.

### 20. Concurrent write failure?

Retry job; serialize writers; design idempotent MERGE keys.

### 21. Shallow vs deep clone?

Shallow: shared data files, metadata copy. Deep: copies data — independent, costlier.

### 22. What is Unity Catalog?

Unified governance: metastore, 3-level namespace, ACLs, lineage, external locations.

### 23. Catalog.schema.table?

prod.silver.orders — catalog=env/domain, schema=layer, table=entity.

### 24. GRANT SELECT vs USAGE?

USAGE on schema/catalog to traverse; SELECT on table/view to read data.

### 25. External location?

Registered storage path with credential — UC-enforced access to ADLS/S3.

### 26. Managed vs external table?

Managed: UC owns files. External: data at LOCATION; DROP may leave files.

### 27. UC Volumes?

Governed file storage for unstructured/config files — not tabular Delta.

### 28. Row filter / column mask?

Dynamic ABAC in views — filter rows or mask PII by group membership.

### 29. Lineage in UC?

Automatic table/column lineage from query activity; audit logs for access.

### 30. Workflows vs ADF?

Workflows native to Databricks jobs; ADF orchestrates cross-service including Databricks notebook activity.

### 31. Job cluster vs all-purpose?

Job cluster: ephemeral per run, cheaper for production. All-purpose: interactive dev.

### 32. DLT key benefit?

Declarative pipelines, EXPECT data quality, built-in lineage, less boilerplate.

### 33. EXPECT constraint?

Data quality rule in DLT — fail, drop, or alert on violation.

### 34. Medallion layers?

Bronze raw, silver cleaned/conformed, gold business-ready aggregates/marts.

### 35. Bronze ingestion options?

Auto Loader, COPY INTO, structured streaming, ADF copy + notebook.

### 36. Auto Loader vs COPY INTO?

Auto Loader incremental file notification/scaling; COPY INTO simpler batch loads.

### 37. Silver responsibilities?

Dedupe, conform types/keys, business rules, MERGE CDC — not final KPIs.

### 38. Gold responsibilities?

Aggregates, star schema, KPIs for BI — built from silver.

### 39. SCD Type 2 on Delta?

MERGE closes old row (end_date, is_current=false), inserts new version.

### 40. Incremental watermark?

High-water column in control table — extract WHERE col > watermark after success.

### 41. CDF vs MERGE stream?

CDF reads changes between versions; streaming MERGE applies incoming CDC continuously.

### 42. File arrival trigger?

Workflow starts when files land in monitored path — common with ADF drops.

### 43. Prevent duplicate job runs?

Max concurrent runs = 1; idempotent MERGE; check control table.

### 44. Pass params from ADF?

Base parameters / notebook widgets / job parameters on triggered run.

### 45. Asset Bundles?

databricks.yml CI/CD for jobs, pipelines, schemas — infra as code.


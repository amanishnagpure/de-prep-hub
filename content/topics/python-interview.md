---
title: Python Interview Q&A
description: 60 conceptual Python questions for Data Engineering interviews
parent: python
hidden: true
order: 3
difficulty: interview
---

# Python Interview Flashcards

### 1. List vs tuple?

Lists are mutable, tuples immutable. Tuples usable as dict keys and for fixed records. DE: use tuples for composite group keys.

### 2. List vs set?

Lists ordered; sets unique unordered with O(1) membership. DE: sets for dedupe/seen keys.

### 3. Dictionary internals?

Hash table — O(1) average lookup. Keys must be hashable. DE: JSON-like rows.

### 4. Mutable vs immutable?

Mutable: list, dict, set. Immutable: str, tuple, int, float. DE: copy before mutate in shared pipelines.

### 5. `is` vs `==`?

`is` identity, `==` value. Use `is None`, not `== None`.

### 6. Shallow vs deep copy?

Shallow shares nested objects; deep recursive. DE: deepcopy template rows.

### 7. What is LEGB?

Name lookup: Local, Enclosing, Global, Built-in.

### 8. What are comprehensions?

Concise list/dict/set builders. Prefer over map for readability.

### 9. `map()` vs comprehension?

Comprehension more idiomatic; similar speed for simple cases.

### 10. `*args` vs `**kwargs`?

Positional tuple vs keyword dict for flexible APIs.

### 11. What is an iterator?

Object with __next__; consumes stream once.

### 12. What is an iterable?

Can be looped; may produce fresh iterator each time.

### 13. What is a generator?

Iterator from function with yield; memory efficient.

### 14. Why use `yield`?

Lazy production of batches — flat memory on large files.

### 15. What is a decorator?

Function wrapping another for cross-cutting concerns (retry, log).

### 16. What is a closure?

Inner function capturing outer scope variables.

### 17. What is a context manager?

Guarantees setup/teardown via `with`.

### 18. What does `with` do?

Calls __enter__/__exit__ — close files/connections.

### 19. What is GIL?

Global Interpreter Lock — one bytecode thread at a time in CPython.

### 20. Threading vs multiprocessing?

Threads for I/O; processes for CPU-bound work.

### 21. Series vs DataFrame?

Series 1D; DataFrame 2D table.

### 22. `loc` vs `iloc`?

Label vs position indexing.

### 23. `merge` vs `concat`?

Join on keys vs stack tables.

### 24. `groupby`?

Split-apply-combine aggregations.

### 25. `agg` vs `transform`?

agg reduces groups; transform keeps row count.

### 26. `apply` vs vectorization?

Vectorization uses C speed; apply is Python loop.

### 27. `pivot` vs `pivot_table`?

pivot no agg; pivot_table aggregates.

### 28. How handle NULLs?

isna, fillna, dropna — understand None vs NaN.

### 29. How remove duplicates?

drop_duplicates with subset + keep + sort tie-breaker.

### 30. How optimize DataFrame memory?

category dtype, downcast, read only needed columns.

### 31. How structure an ETL pipeline?

Extract → validate → transform → load; modular functions; config/logging.

### 32. How make ETL idempotent?

MERGE/upsert on business key; partition overwrite; dedupe.

### 33. How implement retries?

Retry transient errors with capped exponential backoff.

### 34. What is exponential backoff?

Increasing wait 1s,2s,4s… between retries.

### 35. How handle API pagination?

Loop cursor/next link until exhausted.

### 36. How handle API failures?

Classify 4xx fatal vs 5xx/timeout retry; log context.

### 37. How implement incremental loading?

Watermark on updated_at; load only > last_wm.

### 38. What is a watermark?

High-water mark timestamp/ID for incremental extracts.

### 39. How do you implement logging?

logging module, structured fields, correct levels.

### 40. How do you test ETL?

pytest pure transforms; mock IO; fixture DataFrames.

### 41. How handle schema changes?

Schema registry, contract tests, evolve with defaults.

### 42. How manage secrets?

Key Vault / Databricks secrets — never in code/git.

### 43. How process large CSV files?

chunksize, csv reader, or Spark — never full read.

### 44. Why Parquet over CSV?

Columnar, compressed, schema embedded — faster analytics.

### 45. When use pandas vs PySpark?

pandas: single-node, interactive. PySpark: distributed TB+.

### 46. Python vs PySpark?

Driver pandas collects; Spark distributes on cluster.

### 47. Pandas memory limitations?

Bounded by driver RAM — typically < few GB practical.

### 48. What happens reading 20 GB CSV in pandas?

OOM or extreme swap — don't do it.

### 49. How would you process 20 GB?

Spark/Databricks, DuckDB, or chunked/streaming writes.

### 50. Why Spark for large datasets?

Distributed memory/disk, fault tolerance, optimizer.

### 51. What is lazy evaluation?

Spark builds DAG; executes on action — optimizes plan.

### 52. What is serialization?

Pickle/Arrow for moving data between processes/executors.

### 53. GIL impact on ETL?

CPU Python threads won't speed pandas; use processes or Spark.

### 54. How parallelize Python workloads?

multiprocessing per file, Spark for data, async for I/O.

### 55. How make pipeline restartable?

Checkpoints, watermarks, idempotent loads.

### 56. How prevent duplicate loads?

MERGE keys, dedupe, idempotent partitions.

### 57. How handle partial failure?

Stage quarantine, retry slices, dead-letter queue.

### 58. How monitor ETL pipeline?

Metrics, alerts, row counts, duration, data quality KPIs.

### 59. How design reusable ETL components?

Pure functions, config-driven maps, shared package.

### 60. Explain production Python pipeline end-to-end?

Orchestrator (ADF) triggers extract → validate → transform in Databricks → Delta load → monitor/alert.


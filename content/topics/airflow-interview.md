---
title: Airflow Interview Q&A
description: 40 conceptual Airflow questions for Data Engineering interviews
parent: airflow
hidden: true
order: 3
difficulty: interview
---

# Airflow Interview Flashcards

### 1. What is a DAG in Airflow?

Directed Acyclic Graph of tasks with dependencies. No cycles. Represents a workflow like ETL pipeline.

### 2. DAG vs task?

DAG is the workflow container; task (operator instance) is one unit of work.

### 3. Airflow 2.x TaskFlow API?

Use @task decorator; functions become tasks; return values pass via XCom automatically.

### 4. Bitshift operators?

`>>` and `<<` set upstream/downstream. `a >> b` means a before b.

### 5. What is XCom?

Cross-communication — tasks exchange small metadata via metadata DB. Pass references not big data.

### 6. XCom limitations?

Stored in metadata DB — size limits. Use object storage for large payloads.

### 7. PythonOperator vs @task?

@task is TaskFlow sugar with cleaner data passing; PythonOperator is classic explicit style.

### 8. What is a Sensor?

Special operator polling until condition met. Can block workers — use deferrable/reschedule.

### 9. poke vs reschedule mode?

Poke holds worker slot while waiting; reschedule frees worker between pokes.

### 10. Deferrable operators?

Release worker; Triggerer resumes when async event fires — efficient for I/O waits.

### 11. ExternalTaskSensor use case?

Wait for task in another DAG (same logical date) before proceeding.

### 12. TriggerDagRunOperator?

Starts another DAG run; can pass conf JSON.

### 13. What is catchup?

If True, scheduler creates all missed intervals from start_date. Usually False in prod.

### 14. How backfill?

`airflow dags backfill -s START -e END -d DAG_ID` or manual triggers with conf.

### 15. Logical date vs run time?

Run triggered at schedule time but processes data interval (ds). Often previous day for daily.

### 16. What is ds?

Template macro for data interval date YYYY-MM-DD.

### 17. depends_on_past?

Task runs only if previous interval's instance succeeded.

### 18. max_active_runs?

Caps concurrent DAG runs — prevents overlapping backfills.

### 19. Pools?

Limit concurrent tasks sharing a slot pool — e.g. cap Spark jobs.

### 20. default_args purpose?

Shared task kwargs: owner, retries, retry_delay, callbacks.

### 21. Why idempotent pipelines?

Retries and backfills re-run same interval — must not duplicate or corrupt data.

### 22. TaskGroup vs SubDAG?

TaskGroup is Airflow 2 replacement — no separate DAG, better UI, no deadlocks.

### 23. Dynamic task mapping?

Expand task over iterable at runtime — one mapped instance per item.

### 24. Datasets (Airflow 2.4+)?

Data-aware scheduling — downstream runs when upstream dataset updated.

### 25. Executor types?

Sequential (dev), Celery (distributed workers), Kubernetes (pods per task).

### 26. Metadata database role?

Stores DAGs, runs, task states, XCom, connections — Postgres in prod.

### 27. Connections vs Variables?

Connections: typed credentials for hooks. Variables: key-value config.

### 28. How test DAGs in CI?

DagBag import, assert task count, no cycles, `airflow dags list-import-errors`.

### 29. Parse time vs run time?

Parse: scheduler imports DAG file. Run: task execute() on worker. Keep parse lightweight.

### 30. Common parse-time mistake?

Network calls, DB queries, heavy imports at module level.

### 31. BranchPythonOperator?

Returns task_id(s) to run; other branches skipped.

### 32. Why avoid SubDAG?

Complexity, scheduler deadlocks, deprecated in favor of TaskGroups.

### 33. KubernetesPodOperator?

Runs task in ephemeral K8s pod — isolated deps.

### 34. Provider packages?

Integrations split from core — install `apache-airflow-providers-*` as needed.

### 35. SLA vs execution_timeout?

SLA alerts if task late to complete; execution_timeout kills hung task.

### 36. Clear task?

Resets state for rerun; optionally downstream. Use after fix for idempotent reload.

### 37. Airflow 1 vs 2 major changes?

No contrib, TaskFlow, REST API, multiple schedulers, timezone-aware, datasets.

### 38. How handle secrets?

Connections + secrets backend (Vault, AWS SM); never in git.

### 39. Sensor at scale problem?

Occupies workers — deferrable, reschedule, or replace with datasets/events.

### 40. Race on same partition?

Use max_active_runs=1, partition locks, merge semantics.

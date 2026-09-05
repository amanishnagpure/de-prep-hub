---
title: Airflow Notes
description: Deep Airflow 2.x reference for Data Engineering interviews
parent: airflow
hidden: true
order: 1
difficulty: basic
---

# Airflow Master Notes

Built for **Data Engineering** interviews — DAG design → operators → scheduling → production → traps.

Each topic: **Concept → Syntax → Example → DE example → Mistake → Interview → Practice**

---

## DAGs

### 1. What is a DAG?

**Concept:** Directed Acyclic Graph — a workflow of tasks with dependencies; no cycles allowed.

**Syntax:**

```python
from airflow import DAG
from datetime import datetime

with DAG(
    dag_id="etl_orders",
    start_date=datetime(2024, 1, 1),
    schedule="0 6 * * *",
    catchup=False,
) as dag:
    ...
```

**Example:** Bronze → Silver → Gold pipeline as three dependent tasks.

**DE example:** Daily orders ETL: extract from API, transform in Spark, load to warehouse.

**Common mistake:** Putting business logic inside DAG definition file at parse time — slows scheduler.

**Interview:** Why must a DAG be acyclic?

**Practice:** Practice #1


### 2. DAG context manager (Airflow 2.x)

**Concept:** Prefer `with DAG(...) as dag:` — tasks auto-register to DAG.

**Syntax:**

```python
with DAG("my_dag", start_date=..., schedule=...) as dag:
    t1 = BashOperator(task_id="t1", bash_command="echo hi")
    t2 = BashOperator(task_id="t2", bash_command="echo bye")
    t1 >> t2
```

**Example:** Clean scope; tasks bound without passing dag= everywhere.

**DE example:** Standard pattern in production repos — lint-friendly.

**Common mistake:** Mixing TaskFlow API and classic operators without consistent style.

**Interview:** DAG vs TaskGroup — when use each?

**Practice:** Practice #2


### 3. Task dependencies

**Concept:** Define execution order with bitshift operators or set_upstream/downstream.

**Syntax:**

```python
extract >> transform >> load
# or
extract.set_downstream(transform)
transform.set_upstream(extract)
```

**Example:** Linear ETL chain.

**DE example:** Branch only after validation task passes.

**Common mistake:** Creating implicit deps via XCom without explicit edges — hard to debug.

**Interview:** How represent parallel tasks then join?

**Practice:** Practice #3


### 4. TaskGroups

**Concept:** Logical grouping of tasks — collapses UI, shares prefix.

**Syntax:**

```python
from airflow.utils.task_group import TaskGroup

with TaskGroup("staging") as staging:
    a = EmptyOperator(task_id="a")
    b = EmptyOperator(task_id="b")
    a >> b
extract >> staging >> load
```

**Example:** Group all staging transforms.

**DE example:** Organize 20 table loads under `staging.orders`, `staging.customers`.

**Common mistake:** TaskGroup id collisions across DAGs — use unique group_id.

**Interview:** TaskGroup vs SubDAG (deprecated)?

**Practice:** Practice #4


### 5. Dynamic task mapping

**Concept:** Airflow 2.3+ expands one task over a list at runtime.

**Syntax:**

```python
@task
def process(file: str) -> str:
    return file

files = process.expand(file=["a.csv", "b.csv"])
```

**Example:** One task per partition file.

**DE example:** Map over S3 keys from upstream XCom list.

**Common mistake:** Mapping over unbounded lists — exhaust workers.

**Interview:** Dynamic mapping vs traditional for-loop in one task?

**Practice:** Practice #5


### 6. TaskFlow API (@task)

**Concept:** Decorator turns Python callables into tasks; XCom handled automatically.

**Syntax:**

```python
from airflow.decorators import task

@task
def extract() -> list[dict]:
    return [{"id": 1}]

@task
def load(rows: list[dict]):
    ...

load(extract())
```

**Example:** Type-hinted data flow between tasks.

**DE example:** Lightweight Python transforms without BashOperator.

**Common mistake:** Returning huge objects via XCom — use object storage instead.

**Interview:** TaskFlow vs PythonOperator?

**Practice:** Practice #6


### 7. dag_id and task_id rules

**Concept:** Unique identifiers; alphanumeric + underscores; task_id unique within DAG.

**Syntax:**

```python
task_id="load_fact_orders"
dag_id="warehouse_daily_etl"
```

**Example:** Naming convention: `{layer}_{entity}_{action}`.

**DE example:** `prod_bronze_ingest_events` — searchable in UI.

**Common mistake:** Renaming task_id breaks historical logs and downstream refs.

**Interview:** What happens if two tasks share task_id?

**Practice:** Practice #7


### 8. default_args

**Concept:** Shared kwargs for all tasks in DAG — owner, retries, email, etc.

**Syntax:**

```python
default_args = {
    "owner": "data-platform",
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
    "depends_on_past": False,
}
```

**Example:** Central retry policy.

**DE example:** Set `on_failure_callback` once for Slack alerts.

**Common mistake:** Putting `start_date` in default_args in Airflow 2 — belongs on DAG.

**Interview:** Which args belong in default_args vs DAG?

**Practice:** Practice #8


### 9. Tags and doc_md

**Concept:** Metadata for UI filtering and documentation.

**Syntax:**

```python
with DAG(..., tags=["etl", "finance"], doc_md=__doc__) as dag:
    """Loads finance marts daily."""
```

**Example:** Filter DAGs by team tag.

**DE example:** Link runbook in doc_md markdown.

**Common mistake:** No tags on 200 DAGs — discovery nightmare.

**Interview:** How organize DAGs at scale?

**Practice:** Practice #9


### 10. max_active_runs

**Concept:** Limit concurrent DAG runs — prevents overlap backfills.

**Syntax:**

```python
with DAG(..., max_active_runs=1) as dag:
```

**Example:** Only one ETL run at a time.

**DE example:** Warehouse load DAG — avoid double-write same partition.

**Common mistake:** max_active_runs=1 with long runs blocks scheduled runs.

**Interview:** max_active_runs vs pool?

**Practice:** Practice #10


### 11. DAG parsing and import errors

**Concept:** Scheduler parses DAG files periodically; syntax errors block entire file.

**Syntax:**

```python
# Keep heavy imports lazy inside functions
# Validate with: airflow dags list-import-errors
```

**Example:** Broken import hides all DAGs in file.

**DE example:** CI runs `airflow dags list-import-errors` on PR.

**Common mistake:** Top-level DB connections at parse time.

**Interview:** Why DAG files must be fast to parse?

**Practice:** Practice #11


### 12. SubDAGs (deprecated)

**Concept:** Old pattern for grouping — replaced by TaskGroups.

**Syntax:**

```python
# Avoid SubDagOperator — use TaskGroup instead
```

**Example:** Legacy codebases may still have them.

**DE example:** Migration plan: SubDAG → TaskGroup.

**Common mistake:** Creating new SubDAGs in 2024+.

**Interview:** Why SubDAGs were problematic?

**Practice:** Practice #12


### 13. Cross-DAG dependencies

**Concept:** Trigger or wait on external DAG via ExternalTaskSensor / TriggerDagRunOperator.

**Syntax:**

```python
TriggerDagRunOperator(
    task_id="trigger_downstream",
    trigger_dag_id="downstream_mart",
    wait_for_completion=True,
)
```

**Example:** Upstream raw ingest triggers curated layer.

**DE example:** Master pipeline triggers domain DAGs.

**Common mistake:** Circular cross-DAG triggers.

**Interview:** ExternalTaskSensor vs TriggerDagRunOperator?

**Practice:** Practice #13


### 14. Idempotent DAG design

**Concept:** Re-running same logical date produces same outcome — critical for backfill.

**Syntax:**

```python
@task
def load_partition(ds: str):
    # overwrite partition ds, don't append blindly
    ...
```

**Example:** DELETE + INSERT or MERGE for partition.

**DE example:** Replace `{ds}` partition in lakehouse idempotently.

**Common mistake:** Append-only loads on retry — duplicate rows.

**Interview:** How prove a pipeline is idempotent?

**Practice:** Practice #14



## Operators

### 1. BaseOperator contract

**Concept:** Every task is an operator instance with execute() logic.

**Syntax:**

```python
PythonOperator(
    task_id="run_fn",
    python_callable=my_fn,
    op_kwargs={"dt": "{{ ds }}"},
)
```

**Example:** Wrap any Python function.

**DE example:** Callable connects to Spark session or DB.

**Common mistake:** Non-serializable op_kwargs at parse time.

**Interview:** Operator vs Sensor?

**Practice:** Practice #15


### 2. PythonOperator

**Concept:** Runs Python callable in subprocess on worker.

**Syntax:**

```python
def work(**context):
    ds = context["ds"]
    ...

PythonOperator(task_id="work", python_callable=work, provide_context=True)
```

**Example:** Small transforms, API calls.

**DE example:** Trigger Databricks job with REST.

**Common mistake:** Heavy ML training in PythonOperator — use deferrable/K8s.

**Interview:** Where does PythonOperator code run?

**Practice:** Practice #16


### 3. BashOperator

**Concept:** Shell command on worker — simple but environment-dependent.

**Syntax:**

```python
BashOperator(
    task_id="curl_api",
    bash_command="curl -f https://api.example.com/health",
)
```

**Example:** Invoke CLI tools.

**DE example:** Run `dbt run --select tag:daily`.

**Common mistake:** Unquoted Jinja in bash — injection risk.

**Interview:** BashOperator vs PythonOperator?

**Practice:** Practice #17


### 4. EmptyOperator

**Concept:** No-op for structure, start/end markers, branching.

**Syntax:**

```python
start = EmptyOperator(task_id="start")
end = EmptyOperator(task_id="end")
```

**Example:** Join parallel branches.

**DE example:** Sync point before warehouse load.

**Common mistake:** Overusing EmptyOperator instead of TaskGroup boundaries.

**Interview:** Use case for EmptyOperator?

**Practice:** Practice #18


### 5. BranchPythonOperator

**Concept:** Choose one downstream path based on callable return (task_id or list).

**Syntax:**

```python
def pick(**ctx):
    return "path_a" if condition else "path_b"

branch = BranchPythonOperator(task_id="branch", python_callable=pick)
```

**Example:** Skip load on empty extract.

**DE example:** Route bad data to quarantine DAG branch.

**Common mistake:** Not joining skipped branches — dangling tasks.

**Interview:** How skip downstream tasks properly?

**Practice:** Practice #19


### 6. TriggerDagRunOperator

**Concept:** Fire another DAG; optionally wait for completion.

**Syntax:**

```python
TriggerDagRunOperator(
    task_id="trigger",
    trigger_dag_id="child_dag",
    conf={"run_id": "{{ run_id }}"},
)
```

**Example:** Orchestrate micro-DAGs.

**DE example:** Domain team owns child DAG triggered by platform.

**Common mistake:** Not passing conf for partition date.

**Interview:** Trigger vs ExternalTaskSensor?

**Practice:** Practice #20


### 7. Sensors overview

**Concept:** Operators that poll until condition true or timeout.

**Syntax:**

```python
from airflow.sensors.filesystem import FileSensor

wait = FileSensor(
    task_id="wait_file",
    filepath="/data/incoming/done.flag",
    poke_interval=60,
    timeout=3600,
)
```

**Example:** Wait for upstream drop.

**DE example:** S3KeySensor for landing bucket marker.

**Common mistake:** Sensor occupying worker slot entire poke interval (use reschedule mode).

**Interview:** Sensor modes: poke vs reschedule?

**Practice:** Practice #21


### 8. ExternalTaskSensor

**Concept:** Wait for task in another DAG to succeed for same logical date.

**Syntax:**

```python
ExternalTaskSensor(
    task_id="wait_upstream",
    external_dag_id="raw_ingest",
    external_task_id="done",
    mode="reschedule",
)
```

**Example:** Downstream waits for upstream completion.

**DE example:** Mart DAG waits for bronze completion.

**Common mistake:** Wrong execution_delta across timezones.

**Interview:** How handle different schedules?

**Practice:** Practice #22


### 9. SqlSensor / DbApiHook

**Concept:** Poll SQL until row exists or condition met.

**Syntax:**

```python
SqlSensor(
    task_id="wait_rows",
    conn_id="warehouse",
    sql="SELECT 1 FROM staging.ready WHERE dt='{{ ds }}'",
)
```

**Example:** Wait until staging table populated.

**DE example:** Check row count > threshold before promote.

**Common mistake:** Expensive SQL every poke — optimize or use deferrable.

**Interview:** Sensor vs short PythonOperator poll?

**Practice:** Practice #23


### 10. Deferrable operators (Airflow 2.2+)

**Concept:** Release worker while waiting — async triggers resume task.

**Syntax:**

```python
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor

S3KeySensor(
    task_id="wait_s3",
    bucket_key="s3://bucket/{{ ds }}/_SUCCESS",
    deferrable=True,
)
```

**Example:** Efficient S3 waits.

**DE example:** Scale sensors without worker exhaustion.

**Common mistake:** Triggerer not running — deferrable tasks stall.

**Interview:** Worker vs Triggerer?

**Practice:** Practice #24


### 11. KubernetesPodOperator

**Concept:** Run task in ephemeral K8s pod — isolated dependencies.

**Syntax:**

```python
KubernetesPodOperator(
    task_id="spark_submit",
    name="spark-job",
    namespace="airflow",
    image="my-spark:3.5",
    cmds=["spark-submit", "job.py"],
)
```

**Example:** Heavy jobs with custom image.

**DE example:** Run dbt in container matching prod.

**Common mistake:** No resource limits — cluster starvation.

**Interview:** K8s operator vs Celery worker?

**Practice:** Practice #25


### 12. Provider packages

**Concept:** Airflow 2 splits integrations into `apache-airflow-providers-*`.

**Syntax:**

```python
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
```

**Example:** Install only providers you need.

**DE example:** Pin provider versions in requirements.txt.

**Common mistake:** Importing from old `airflow.contrib` paths.

**Interview:** How upgrade providers safely?


### 13. Custom operators

**Concept:** Subclass BaseOperator for reusable org-specific logic.

**Syntax:**

```python
class LoadPartitionOperator(BaseOperator):
    template_fields = ("partition",)
    def execute(self, context):
        load(self.partition)
```

**Example:** Standardize lakehouse partition loads.

**DE example:** Internal SDK operator used by all teams.

**Common mistake:** Not setting template_fields — Jinja won't render.

**Interview:** When build custom vs use PythonOperator?


### 14. Operator retries and callbacks

**Concept:** retries, retry_delay, on_failure_callback, on_success_callback.

**Syntax:**

```python
default_args = {
    "retries": 3,
    "retry_exponential_backoff": True,
    "on_failure_callback": slack_alert,
}
```

**Example:** Alert after final failure only.

**DE example:** PagerDuty on prod DAG failure.

**Common mistake:** Retries on non-idempotent side effects.

**Interview:** Retry vs SLA miss?



## Scheduling

### 1. schedule / timetable

**Concept:** Cron or preset defines when DAG runs; Airflow 2.4+ uses `schedule` param.

**Syntax:**

```python
schedule="0 2 * * *"  # daily 2am
# or
from airflow.timetables.trigger import CronTriggerTimetable
```

**Example:** Nightly batch window.

**DE example:** Align with warehouse maintenance window.

**Common mistake:** Using `schedule_interval` alias inconsistently.

**Interview:** Cron vs timedelta schedule?


### 2. start_date and end_date

**Concept:** DAG active from start_date; end_date optional stop.

**Syntax:**

```python
start_date=datetime(2024, 1, 1, tzinfo=timezone.utc)
```

**Example:** Historical backfill anchor.

**DE example:** Use UTC consistently across teams.

**Common mistake:** Naive datetime — timezone bugs.

**Interview:** Why start_date is not 'first run time'?


### 3. Logical date (execution_date / data interval)

**Concept:** Each run processes a data interval — `ds`, `data_interval_start`, `data_interval_end`.

**Syntax:**

```python
# Templates:
# {{ ds }} — YYYY-MM-DD
# {{ data_interval_start }}
```

**Example:** Monday run processes Sunday data.

**DE example:** Partition key = `{{ ds }}` for daily loads.

**Common mistake:** Confusing run time with data interval.

**Interview:** Explain ds vs execution_date in Airflow 2.


### 4. catchup

**Concept:** If True, scheduler creates all missed runs between start_date and now.

**Syntax:**

```python
catchup=False  # typical for prod
```

**Example:** New DAG shouldn't replay 2 years.

**DE example:** Enable catchup once for historical backfill then disable.

**Common mistake:** catchup=True on high-frequency DAG — DDoS yourself.

**Interview:** How backfill without catchup?


### 5. Backfill CLI

**Concept:** `airflow dags backfill` creates runs for date range manually.

**Syntax:**

```python
airflow dags backfill -s 2024-01-01 -e 2024-01-31 -d my_dag --reset-dagruns
```

**Example:** Fill January after bug fix.

**DE example:** Reprocess month after schema change.

**Common mistake:** Backfill without max_active_runs limit.

**Interview:** Backfill vs clear?


### 6. depends_on_past

**Concept:** Task only runs if previous interval's task succeeded.

**Syntax:**

```python
default_args = {"depends_on_past": True}
```

**Example:** Sequential daily snapshots.

**DE example:** Incremental watermark chains.

**Common mistake:** depends_on_past=True blocks after single failure.

**Interview:** When use depends_on_past?


### 7. wait_for_downstream

**Concept:** Task waits for prior interval's downstream tasks.

**Syntax:**

```python
task = PythonOperator(..., wait_for_downstream=True)
```

**Example:** Strict ordering across days.

**DE example:** Rare in DE — prefer explicit sensors.

**Common mistake:** Combining with depends_on_past unexpectedly.

**Interview:** Difference from ExternalTaskSensor?


### 8. Pools and priorities

**Concept:** Pools limit concurrent tasks; priority_weight breaks ties.

**Syntax:**

```python
task = PythonOperator(..., pool="spark_pool", priority_weight=10)
```

**Example:** Cap Spark submits at 5.

**DE example:** Reserve pool for critical SLA DAGs.

**Common mistake:** Default pool too small — global deadlock.

**Interview:** Pool vs executor parallelism?


### 9. SLAs and timeouts

**Concept:** sla=timedelta warns if task late; execution_timeout kills hung tasks.

**Syntax:**

```python
PythonOperator(..., sla=timedelta(hours=2), execution_timeout=timedelta(minutes=30))
```

**Example:** Alert if extract not done by 8am.

**DE example:** SLA miss email to on-call.

**Common mistake:** sla on DAG not task — know where it applies.

**Interview:** SLA vs execution_timeout?


### 10. Manual triggers and conf

**Concept:** Trigger DAG with JSON conf for ad-hoc runs.

**Syntax:**

```python
# UI or CLI:
airflow dags trigger my_dag --conf '{"backfill_dt": "2024-06-01"}'
```

**Example:** One-off reprocess.

**DE example:** Pass partition override via conf.

**Common mistake:** Not reading conf in tasks — silent no-op.

**Interview:** How pass parameters to manual run?


### 11. Paused DAGs

**Concept:** Paused DAGs don't schedule; existing tasks may still complete.

**Syntax:**

```python
# airflow dags pause my_dag
```

**Example:** Freeze during migration.

**DE example:** Pause lower env during cutover.

**Common mistake:** Forgetting to unpause after deploy.

**Interview:** Pause DAG vs pool slot 0?


### 12. Data-aware scheduling (datasets)

**Concept:** Airflow 2.4+ Dataset objects — schedule when upstream data updates.

**Syntax:**

```python
from airflow.datasets import Dataset

out = Dataset("s3://curated/orders")

@task(outlets=[out])
def build(): ...

with DAG(..., schedule=[Dataset("s3://raw/orders")]): ...
```

**Example:** Event-driven downstream.

**DE example:** Replace brittle ExternalTaskSensor chains.

**Common mistake:** Over-migrating stable cron to datasets too early.

**Interview:** Datasets vs sensors?


### 13. Timezone handling

**Concept:** Store UTC; display local in UI; use pendulum/timezone aware.

**Syntax:**

```python
from pendulum import datetime

start_date=datetime(2024, 1, 1, tz="UTC")
```

**Example:** Global team single source of truth.

**DE example:** Cron in UTC even for US business reports.

**Common mistake:** Mixing naive and aware datetimes.

**Interview:** How DST affects scheduling?


### 14. Clear and rerun tasks

**Concept:** Clear resets task state for rerun; downstream optional.

**Syntax:**

```python
# UI: Clear task / Clear downstream
```

**Example:** Fix transform and rerun from middle.

**DE example:** Clear failed load only, keep extract.

**Common mistake:** Clear downstream on non-idempotent append load.

**Interview:** Clear vs mark success?



## Production

### 1. Executor types

**Concept:** Sequential, Local, Celery, Kubernetes — where tasks run.

**Syntax:**

```python
# airflow.cfg
# executor = CeleryExecutor
```

**Example:** Prod: Celery or K8s for scale.

**DE example:** Match executor to infra (EKS + KPO).

**Common mistake:** SequentialExecutor in prod.

**Interview:** Compare Celery vs Kubernetes executor.


### 2. Metadata database

**Concept:** Postgres/MySQL stores DAG runs, task states, connections.

**Syntax:**

```python
# AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://...
```

**Example:** Back up metadata DB.

**DE example:** Managed RDS with PITR.

**Common mistake:** SQLite in production.

**Interview:** What lives in metadata DB?


### 3. Connections and Variables

**Concept:** Connections store secrets/credentials; Variables store config.

**Syntax:**

```python
from airflow.hooks.base import BaseHook

conn = BaseHook.get_connection("warehouse")
# or Variable.get("batch_size")
```

**Example:** Never hardcode passwords in DAG.

**DE example:** Use K8s secrets backend or Vault.

**Common mistake:** Variables for large JSON blobs.

**Interview:** Connection vs Variable?


### 4. Secrets backends

**Concept:** Fetch connections from AWS Secrets Manager, Vault, etc.

**Syntax:**

```python
[secrets]
backend = airflow.providers.amazon.aws.secrets.secrets_manager.SecretsManagerBackend
```

**Example:** No secrets in git.

**DE example:** Rotate DB creds without DAG redeploy.

**Common mistake:** Secrets in environment variables logged.

**Interview:** How rotate credentials?


### 5. Logging and monitoring

**Concept:** Task logs in remote storage (S3/GCS); metrics to Prometheus/StatsD.

**Syntax:**

```python
[logging]
remote_logging = True
remote_base_log_folder = s3://logs/airflow/
```

**Example:** Centralized log search.

**DE example:** Datadog alerts on task failure rate.

**Common mistake:** Local disk fills on workers.

**Interview:** Where find task logs in K8s?


### 6. RBAC and multi-tenancy

**Concept:** Roles limit UI/API access; DAG-level access via tags/roles.

**Syntax:**

```python
# FAB auth manager roles: Admin, Op, Viewer
```

**Example:** Analyst Viewer, DE Op.

**DE example:** Separate prod/staging Airflow instances.

**Common mistake:** Shared admin creds.

**Interview:** How isolate teams?


### 7. CI/CD for DAGs

**Concept:** Lint, test, sync DAG bundle to object storage or git-sync sidecar.

**Syntax:**

```python
# CI: ruff, pytest, airflow dags list-import-errors
```

**Example:** PR checks before deploy.

**DE example:** Deploy DAGs separately from platform upgrades.

**Common mistake:** Editing DAGs directly on scheduler box.

**Interview:** DAG deployment strategies?


### 8. Testing DAGs

**Concept:** dag.test(), unit test structure, mock hooks.

**Syntax:**

```python
def test_dag_loaded():
    dag = dagbag.get_dag("my_dag")
    assert dag is not None
    assert len(dag.tasks) == 5
```

**Example:** Assert no cycles, required tasks exist.

**DE example:** CI DagBag import test on every commit.

**Common mistake:** No tests — broken deploy Friday night.

**Interview:** What to test without running tasks?


### 9. Performance: DAG file layout

**Concept:** Fast imports; factory pattern for parameterized DAGs.

**Syntax:**

```python
def build_dag(dag_id, schedule):
    with DAG(dag_id, ...) as dag:
        ...
    return dag

globals()[f"etl_{team}"] = build_dag(...)
```

**Example:** Generate 50 similar DAGs.

**DE example:** Per-domain DAG factories.

**Common mistake:** 500MB DAG file imported every 30s.

**Interview:** Dynamic DAG generation pitfalls?


### 10. Kubernetes / Helm deployment

**Concept:** Official chart runs webserver, scheduler, workers, triggerer.

**Syntax:**

```python
# helm install airflow apache-airflow/airflow
```

**Example:** Horizontally scale workers.

**DE example:** EKS + IRSA for S3 logs.

**Common mistake:** Single replica scheduler without HA.

**Interview:** Components of Airflow on K8s?


### 11. Lineage and OpenLineage

**Concept:** Track data flow from tasks for observability.

**Syntax:**

```python
from airflow.providers.openlineage.plugins.listener import OpenLineageListener
```

**Example:** Marquez/DataHub integration.

**DE example:** Column lineage from Spark operator.

**Common mistake:** No lineage on ad-hoc PythonOperator SQL.

**Interview:** Why lineage matters for DE?


### 12. Upgrade strategy (1.x → 2.x)

**Concept:** Breaking changes: REST auth, operators namespace, subDAG removal.

**Syntax:**

```python
# Use Ruff/airflow upgrade checks
```

**Example:** Blue/green Airflow cluster.

**DE example:** Run 2.x in staging with prod DAG imports.

**Common mistake:** Big bang upgrade without import error scan.

**Interview:** Top Airflow 2 migration gotchas?


### 13. High availability

**Concept:** Multiple schedulers (2.0+), redundant webservers, DB HA.

**Syntax:**

```python
# scheduler: replicas > 1 with same config
```

**Example:** No single point of failure.

**DE example:** Active-active schedulers with job partitioning.

**Common mistake:** One scheduler handling all parse load.

**Interview:** How many schedulers?


### 14. Cost optimization

**Concept:** Right-size workers, deferrable sensors, tear down idle K8s pods.

**Syntax:**

```python
# Use Celery autoscale or K8s HPA
```

**Example:** Spot workers for non-SLA workloads.

**DE example:** Schedule heavy DAGs off-peak.

**Common mistake:** 24/7 max workers for nightly-only DAG.

**Interview:** Sensor cost at scale?



## Traps

### 1. Top-level code in DAG files

**Concept:** Code at module import runs every parse — must be lightweight.

**Syntax:**

```python
# BAD: requests.get(...) at top level
# GOOD: inside python_callable
```

**Example:** Parse loop hammers API.

**DE example:** Scheduler CPU spike from heavy imports.

**Common mistake:** Database queries when defining tasks.

**Interview:** What runs at parse time?


### 2. XCom size limits

**Concept:** Metadata DB stores XCom — large payloads hurt performance.

**Syntax:**

```python
# Push S3 path, not 10GB DataFrame
return {"s3_key": "s3://bucket/data.parquet"}
```

**Example:** Pass reference not data.

**DE example:** Store extract in lake; XCom only path.

**Common mistake:** Returning pandas DataFrame via TaskFlow.

**Interview:** XCom backend alternatives?


### 3. Implicit execution_date confusion

**Concept:** Airflow 2 data interval model changed templates — read docs for version.

**Syntax:**

```python
{{ data_interval_start | ds }}
```

**Example:** Off-by-one partition bugs.

**DE example:** Integration test template rendering.

**Common mistake:** Copying Airflow 1 snippets.

**Interview:** ds in Airflow 2.2+?


### 4. Non-idempotent operators

**Concept:** Retries duplicate side effects — email, charge, append.

**Syntax:**

```python
# Use merge/upsert; check if already processed
```

**Example:** Double Slack alert on retry.

**DE example:** MERGE INTO partition on reload.

**Common mistake:** INSERT-only fact loads with retries=3.

**Interview:** Design for at-least-once?


### 5. Sensor anti-patterns

**Concept:** Too many sensors starve workers; infinite poke without timeout.

**Syntax:**

```python
mode="reschedule", timeout=3600, deferrable=True
```

**Example:** 100 FileSensors block queue.

**DE example:** Replace with dataset or event.

**Common mistake:** poke_interval=1 on SqlSensor.

**Interview:** Sensor zombie tasks?


### 6. Circular dependencies

**Concept:** DAG cycles break scheduler; cross-DAG loops too.

**Syntax:**

```python
# Validate with dag.test() / cycle check
```

**Example:** A >> B >> A import error.

**DE example:** Architecture review dependency graph.

**Common mistake:** ExternalTaskSensor both directions.

**Interview:** Detect cycles in CI?


### 7. Timezone/DST bugs

**Concept:** Spring forward gap, fall back duplicate hour.

**Syntax:**

```python
Always UTC in code; document business TZ in doc_md
```

**Example:** Missing run on DST day.

**DE example:** Finance close DAG misses hour.

**Common mistake:** Local timezone cron without tests.

**Interview:** How test DST transitions?


### 8. Variable/Connection not found

**Concept:** Missing secret fails at task runtime not parse.

**Syntax:**

```python
Variable.get("key", default_var=None)
```

**Example:** Staging missing prod connection id.

**DE example:** Export connections per env via IaC.

**Common mistake:** Same conn_id name different creds across envs undocumented.

**Interview:** Fail fast on missing Variable?


### 9. DAG versioning / task renames

**Concept:** Renaming breaks history, sensors, and dashboards.

**Syntax:**

```python
# Deprecate old task_id gradually
```

**Example:** ExternalTaskSensor still points to old id.

**DE example:** Alias period during migration.

**Common mistake:** Big bang rename Friday.

**Interview:** Safe task rename process?


### 10. Resource leaks in PythonOperator

**Concept:** Unclosed connections/files on worker.

**Syntax:**

```python
try:
    ...
finally:
    conn.close()
```

**Example:** Worker OOM after weeks.

**DE example:** Context managers for DB sessions.

**Common mistake:** Global Spark session per worker.

**Interview:** Why tasks should be stateless?


### 11. Misusing SubDAG / dead code paths

**Concept:** Legacy patterns, unreachable branches after refactors.

**Syntax:**

```python
# Remove dead operators; lint DAG structure
```

**Example:** Branch never taken still scheduled.

**DE example:** Quarterly DAG audit.

**Common mistake:** Copy-paste DAGs diverge silently.

**Interview:** DAG hygiene practices?


### 12. Concurrency and race conditions

**Concept:** Parallel tasks writing same partition.

**Syntax:**

```python
max_active_runs=1; partition locks in load logic
```

**Example:** Two runs overwrite same file.

**DE example:** Optimistic locking on watermark table.

**Common mistake:** Parallel backfills same dates.

**Interview:** Prevent double writes?


### 13. Alert fatigue

**Concept:** on_failure_callback on every retry spam.

**Syntax:**

```python
def alert(context):
    if context["task_instance"].try_number >= context["ti"].max_tries:
        notify()
```

**Example:** Slack noise ignored.

**DE example:** Route to PagerDuty only final failure.

**Common mistake:** Email on every retry attempt.

**Interview:** Smart alerting pattern?


### 14. Skipping testing backfill paths

**Concept:** Happy path works; backfill/catchup exposes bugs.

**Syntax:**

```python
# Test: airflow dags test my_dag 2024-01-15
```

**Example:** Backfill duplicates rows.

**DE example:** Staging backfill dry-run before prod.

**Common mistake:** Only testing latest run.

**Interview:** How validate backfill safety?



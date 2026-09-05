# 1. Databricks Fundamentals

## 1. What is Databricks and what are its advantages?

### 🎯 Interview-ready answer

> Databricks is a cloud-based data and AI platform built around Apache Spark. It provides a unified environment for data engineering, analytics, machine learning, SQL, and data governance.

### Advantages

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

---

## 2. What are the major components of Databricks?

### 🎯 Interview-ready answer

> The major components are Workspace, Compute, Notebooks, Jobs/Workflows, SQL Warehouses, Delta Lake, Unity Catalog, and Git integration.

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

---

## 3. What is Databricks Workspace?

### 🎯 Interview-ready answer

> Databricks Workspace is the collaborative environment where developers create and manage notebooks, files, dashboards, queries, jobs, and other Databricks resources.

### Simple example

As a developer, I use the Workspace to:

* Create Python/PySpark notebooks
* Run SQL
* Develop pipelines
* Schedule jobs
* Collaborate with team members
* Connect code with Git

---

## 4. What are the different types of Databricks compute/clusters?

### 🎯 Interview-ready answer

> Databricks provides different compute options depending on the workload. Commonly, we use compute for interactive development, job workloads, serverless workloads, and SQL Warehouses for SQL analytics.

### Main categories

```text
Interactive development → All-Purpose / interactive compute
Production jobs         → Job compute
Managed execution        → Serverless
SQL analytics            → SQL Warehouse
```

---

## 5. All-Purpose Cluster vs Job Cluster?

### 🎯 Interview-ready answer

> All-Purpose compute is mainly used for interactive development, testing, exploration, and debugging. Job compute is intended for automated production workloads and is associated with job execution.

| All-Purpose          | Job                            |
| -------------------- | ------------------------------ |
| Development          | Production jobs                |
| Interactive          | Automated                      |
| Can be reused        | Job-specific                   |
| Useful for debugging | Better workload isolation      |
| Can remain running   | Typically terminates after job |

### Interview line

> I would use interactive compute during development and job compute for scheduled production pipelines.

---

## 6. What is Serverless Compute?

### 🎯 Interview-ready answer

> Serverless compute allows Databricks to manage the underlying compute infrastructure, including provisioning and scaling, so the user doesn't have to manage the cluster infrastructure directly.

### Advantages

* Faster startup
* Less infrastructure management
* Automatic scaling
* Easier operations
* Useful for variable workloads

---

## 7. Job Cluster vs Serverless Compute?

### 🎯 Interview-ready answer

> With job compute, we can have more explicit control over the compute configuration. With serverless, Databricks manages more of the underlying infrastructure automatically.

```text
Job Compute
→ More control

Serverless
→ More abstraction and less management
```

The choice depends on workload requirements, supported features, performance and cost.

---

## 8. What is a SQL Warehouse?

### 🎯 Interview-ready answer

> A SQL Warehouse is Databricks compute optimized for SQL analytics, dashboards, BI workloads, and interactive SQL queries.

```text
PySpark/Data Engineering → Spark Compute
SQL/BI                  → SQL Warehouse
```

---

## 9. What is Unity Catalog?

### 🎯 Interview-ready answer

> Unity Catalog is Databricks' centralized governance solution for managing and securing data and AI assets. It provides access control, discovery, auditing, lineage, and centralized governance.

### Hierarchy

```text
Metastore
   ↓
Catalog
   ↓
Schema
   ↓
Table / View / Volume
```

### Main benefits

* Access control
* Data discovery
* Auditing
* Lineage
* Centralized governance

---

## 10. How do you optimize Databricks cluster performance?

### 🎯 Interview-ready answer

> I first identify the actual bottleneck using Spark UI rather than simply increasing cluster size. I check CPU, memory, shuffle, data skew, spills, task distribution, input size, and executor failures. Then I optimize the query and data layout before scaling the cluster.

### Things I check

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

### Important

> **Optimize the workload first, then increase compute if necessary.**

---

# 2. Spark Architecture & Fundamentals

## 11. What is Apache Spark and why is it used?

### 🎯 Interview-ready answer

> Apache Spark is a distributed data processing engine used to process large datasets across multiple machines in parallel. It supports batch processing, SQL, streaming, machine learning, and other workloads.

### Why Spark?

* Distributed processing
* Parallel execution
* Scalable
* Fault tolerant
* Supports SQL and DataFrames
* Batch + streaming
* In-memory processing where beneficial

---

## 12. Explain Spark architecture.

### 🎯 Interview-ready answer

> Spark follows a driver-executor architecture. The Driver coordinates the application and creates the execution plan. Executors run tasks and process data. A cluster/resource manager provides the resources required by the application.

```text
             Driver
                │
        SparkSession
                │
        DAG / Scheduler
                │
        Cluster Resources
        /       |       \
       ↓        ↓        ↓
 Executor    Executor   Executor
    ↓           ↓          ↓
 Tasks        Tasks      Tasks
```

---

## 13. What is a Driver?

### 🎯 Interview-ready answer

> The Driver is the central coordinating process of a Spark application. It creates the SparkSession, builds the execution plan, divides work into stages and tasks, schedules the tasks, and monitors execution.

### Remember

> **Driver decides and coordinates; Executors perform the work.**

---

## 14. What is an Executor?

### 🎯 Interview-ready answer

> An Executor is a process running on a worker that executes Spark tasks and stores intermediate or cached data.

Executors:

* Execute tasks
* Process partitions
* Store cached data
* Handle shuffle data
* Report status to Driver

---

## 15. Driver vs Executor?

| Driver                      | Executor                   |
| --------------------------- | -------------------------- |
| Coordinates application     | Executes tasks             |
| Creates execution plan      | Processes data             |
| Schedules tasks             | Runs tasks                 |
| Maintains application state | Stores cached/shuffle data |
| One logical driver          | Multiple executors         |

### Easy memory trick

> **Driver = Manager**

> **Executor = Worker**

---

## 16. What is SparkSession?

### 🎯 Interview-ready answer

> SparkSession is the main entry point for working with Spark DataFrames, SQL, and other Spark functionality in modern Spark applications.

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("MyApp") \
    .getOrCreate()
```

---

## 17. What is SparkContext?

### 🎯 Interview-ready answer

> SparkContext is the lower-level entry point to Spark's core execution functionality. It connects the application to the cluster and provides access to Spark's underlying execution context.

In modern applications, SparkSession provides access to it:

```python
spark.sparkContext
```

---

## 18. SparkSession vs SparkContext?

### 🎯 Interview-ready answer

> SparkContext is the lower-level core Spark entry point, while SparkSession is the higher-level unified entry point for DataFrames, SQL, and Spark applications.

```text
SparkSession
     ↓
SparkContext
     ↓
Cluster resources
```

---

## 19. What is Cluster Manager?

### 🎯 Interview-ready answer

> A cluster manager is responsible for providing and managing compute resources for Spark applications.

Conceptually:

```text
Spark Application
       ↓
Cluster Manager
       ↓
Resources / Executors
```

Examples include Kubernetes and Spark Standalone; cloud platforms can provide their own resource-management mechanisms.

---

## 20. What is a DAG?

### 🎯 Interview-ready answer

> DAG stands for Directed Acyclic Graph. Spark represents the sequence of transformations and their dependencies as a DAG and uses it to determine how the computation should be executed.

Example:

```text
Read
 ↓
Filter
 ↓
Select
 ↓
GroupBy
 ↓
Write
```

---

## 21. What is a Job, Stage and Task?

### Job

> A Job is created when an action triggers Spark execution.

### Stage

> A Stage is a group of tasks that can execute within the same stage without crossing a shuffle boundary.

### Task

> A Task is the smallest unit of Spark execution and generally processes one partition.

```text
Action
 ↓
Job
 ↓
Stages
 ↓
Tasks
```

---

## 22. Job vs Stage vs Task?

Suppose:

```python
df.groupBy("department").count()
```

Conceptually:

```text
Job
│
├── Stage 1
│     ├── Task
│     ├── Task
│     └── Task
│
└── Stage 2
      ├── Task
      ├── Task
      └── Task
```

A shuffle commonly creates a stage boundary.

---

## 23. What happens internally when a Spark job is submitted?

### 🎯 Interview-ready answer

> When an action is called, Spark analyzes the transformations, creates an execution plan, builds a DAG, divides the DAG into stages based on dependencies and shuffle boundaries, creates tasks for partitions, and schedules those tasks on executors.

```text
Action
 ↓
Logical/physical planning
 ↓
DAG
 ↓
Stages
 ↓
Tasks
 ↓
Executors
 ↓
Result
```

---

# 3. Transformations, Actions & Execution

## 24. What are transformations?

### 🎯 Interview-ready answer

> Transformations are operations that create a new DataFrame or RDD from an existing one. They are generally lazy and don't immediately execute the computation.

Examples:

```python
filter()
select()
withColumn()
join()
groupBy()
```

---

## 25. What are actions?

### 🎯 Interview-ready answer

> Actions trigger Spark execution and produce a result, return data to the driver, or write data to storage.

Examples:

```python
count()
show()
collect()
first()
write
```

---

## 26. Transformation vs Action?

```text
Transformation
→ Builds computation

Action
→ Triggers execution
```

Example:

```python
df2 = df.filter("salary > 5000")  # Transformation

df2.count()                       # Action
```

---

## 27. What is Lazy Evaluation?

### 🎯 Interview-ready answer

> Lazy evaluation means Spark doesn't immediately execute transformations. It builds an execution plan and waits until an action is called.

Example:

```python
df.filter(...)
  .select(...)
  .groupBy(...)
```

Spark waits until:

```python
.count()
```

or another action.

---

## 28. Why does Spark use Lazy Evaluation?

### Main benefits

* Query optimization
* Avoid unnecessary computation
* Combine operations
* Reduce data movement
* Build an optimized execution plan

### Interview line

> Lazy evaluation allows Spark to understand the complete computation before executing it.

---

## 29. What is Lineage?

### 🎯 Interview-ready answer

> Lineage is the chain of transformations used to derive a dataset from its source. Spark uses lineage for fault recovery by recomputing lost data when necessary.

```text
Source
 ↓
Filter
 ↓
Join
 ↓
Aggregation
```

---

## 30. What are Narrow Transformations?

### 🎯 Interview-ready answer

> A narrow transformation is one where an output partition depends on a small number of input partitions and doesn't require a shuffle across the cluster.

Examples:

```python
filter()
select()
map()
```

---

## 31. What are Wide Transformations?

### 🎯 Interview-ready answer

> A wide transformation is one where data from multiple input partitions may need to be redistributed to create output partitions. This generally requires a shuffle.

Examples:

```python
groupBy()
join()
distinct()
orderBy()
repartition()
```

---

## 32. Narrow vs Wide Transformations?

| Narrow                      | Wide                     |
| --------------------------- | ------------------------ |
| No full shuffle             | Shuffle usually required |
| Less expensive              | More expensive           |
| Data stays relatively local | Data redistributed       |
| `filter()`                  | `groupBy()`              |
| `select()`                  | `join()`                 |

### Easy memory

> **Narrow = data doesn't need to travel much.**

> **Wide = data needs redistribution.**

---

## 33. Which operations cause a shuffle?

Common operations:

```text
groupBy
join
distinct
orderBy
sort
repartition
reduceByKey
```

Also, some window operations may require data redistribution depending on their partitioning/order requirements.

> Always verify the actual physical plan rather than assuming every operation always shuffles.

---

# 4. Partitioning & Shuffle

## 34. What is a partition?

### 🎯 Interview-ready answer

> A partition is a logical chunk of distributed data. Spark processes partitions in parallel, with tasks generally processing one partition at a time for a stage.

Example:

```text
100 GB data
     ↓
100 partitions
     ↓
100 tasks for that stage
```

Actual concurrency depends on available executor cores.

---

## 35. How does Spark determine the number of partitions?

It depends on several factors:

* Input file splits
* Existing partitioning
* Shuffle configuration
* `spark.sql.shuffle.partitions`
* Explicit `repartition()`
* `coalesce()`
* AQE

### Important

> Input partitions and shuffle partitions are not necessarily the same.

---

## 36. Partition vs Task?

> **Partition is data; Task is work.**

```text
Partition → Chunk of data
Task      → Computation performed on that partition
```

Generally:

```text
1 partition → 1 task
```

for a particular stage.

---

## 37. What is repartition?

### 🎯 Interview-ready answer

> `repartition()` redistributes data across partitions and generally causes a shuffle. It can increase or decrease the number of partitions and can also partition data based on columns.

```python
df.repartition(100)
```

or:

```python
df.repartition(100, "customer_id")
```

---

## 38. What is coalesce?

### 🎯 Interview-ready answer

> `coalesce()` is primarily used to reduce the number of partitions while avoiding a full shuffle in the normal case.

```python
df.coalesce(10)
```

It is commonly useful before writing when we want fewer output files.

---

## 39. Repartition vs Coalesce?

| Repartition                  | Coalesce                     |
| ---------------------------- | ---------------------------- |
| Increase/decrease partitions | Primarily decreases          |
| Usually shuffle              | Usually avoids full shuffle  |
| More expensive               | Cheaper                      |
| Redistributes data           | Combines existing partitions |

### Interview line

> I use `repartition()` when I need redistribution, and `coalesce()` when I mainly need to reduce partitions.

---

## 40. What happens when you have too many partitions?

Potential problems:

* Too many tasks
* Task scheduling overhead
* Many small files during writes
* Excessive task-management overhead

Example:

```text
1 GB
↓
10,000 partitions
```

can create many tiny tasks.

---

## 41. What happens when you have too few partitions?

Potential problems:

* Poor parallelism
* Underutilized executors
* Large partitions
* Memory pressure
* Long-running tasks

So the goal is **balanced partition sizing and sufficient parallelism**, not simply maximum partition count.

---

## 42. What is Shuffle?

### 🎯 Interview-ready answer

> Shuffle is the process of redistributing data across partitions or executors according to a required partitioning scheme.

Example:

```python
df.groupBy("customer_id").count()
```

Spark needs records for the same customer to reach the same logical aggregation partition.

```text
Partitions
   ↓
Shuffle
   ↓
New partition layout
```

---

## 43. Why is Shuffle expensive?

Shuffle can involve:

* Network transfer
* Serialization
* Disk I/O
* Sorting
* Memory usage
* Spill
* Synchronization

### Interview line

> Shuffle is expensive because data may need to move between executors and be written/read through intermediate storage.

---

## 44. What happens internally during a Shuffle?

Conceptually:

```text
Input partitions
      ↓
Partition data by key
      ↓
Shuffle write
      ↓
Network transfer
      ↓
Shuffle read
      ↓
New partitions
```

Example:

```python
df.groupBy("department").count()
```

records with the same department need to be brought together.

---

## 45. What are Shuffle Read and Shuffle Write?

### Shuffle Write

> Data written by the upstream stage as shuffle output.

### Shuffle Read

> Data read by the downstream stage from that shuffle output.

Spark UI provides both metrics and they are useful for troubleshooting performance.

---

## 46. How can you reduce Shuffle?

### Techniques

* Filter early
* Select only required columns
* Broadcast small tables
* Avoid unnecessary `groupBy`
* Avoid unnecessary `distinct`
* Avoid unnecessary `repartition`
* Use appropriate partitioning
* Handle skew
* Use AQE

### Core principle

> **Move less data across the network.**

---

# 5. Joins

## 47. What is Broadcast Join?

### 🎯 Interview-ready answer

> Broadcast Join is a join optimization where a sufficiently small table is copied to each executor so that the large table doesn't need a full shuffle for the join.

```python
from pyspark.sql.functions import broadcast

result = large_df.join(
    broadcast(small_df),
    "customer_id"
)
```

---

## 48. How does Broadcast Join work internally?

Suppose:

```text
Large table → 5 TB
Small table → 50 MB
```

Instead of shuffling both:

```text
Small table
   ↓
Broadcast
   ↓
Every executor
   ↓
Local join with large partitions
```

This can avoid a large shuffle.

---

## 49. When should you use Broadcast Join?

Use it when:

* One side is sufficiently small
* It can safely fit in executor memory
* You want to avoid a large shuffle

Typical example:

```text
Fact table → TBs
Dimension → MBs
```

---

## 50. When should you NOT use Broadcast Join?

Avoid it when:

* Table is too large
* Executors have insufficient memory
* Broadcasting creates memory pressure
* Replication overhead is too high

### Important

> Don't blindly broadcast based only on row count. Consider the actual size and runtime behavior.

---

## 51. What is Sort Merge Join?

### 🎯 Interview-ready answer

> Sort Merge Join is a distributed join strategy commonly used when both datasets are large. Spark repartitions the datasets by the join key, sorts the relevant data within partitions, and then merges matching records.

```text
Table A → Shuffle → Sort
                       \
                        → Merge
                       /
Table B → Shuffle → Sort
```

---

## 52. Broadcast Hash Join vs Sort Merge Join?

| Broadcast Hash Join     | Sort Merge Join                  |
| ----------------------- | -------------------------------- |
| Small + large table     | Large + large                    |
| Broadcasts small side   | Redistributes both sides         |
| Can avoid large shuffle | Usually requires shuffle         |
| Memory-dependent        | More scalable for large datasets |

---

## 53. How does Spark choose a Join Strategy?

### 🎯 Interview-ready answer

> Spark's optimizer considers factors such as table statistics, estimated sizes, join type, broadcast thresholds, and the physical plan. AQE can also adapt the strategy using runtime statistics in supported cases.

Possible strategies include:

* Broadcast Hash Join
* Sort Merge Join
* Shuffle Hash Join
* Broadcast Nested Loop Join in specific cases

---

## 54. How would you optimize a join between a 5-TB table and a 50-MB table?

### 🎯 Interview-ready answer

> I would first filter and select only required columns from both sides. If the resulting small side is safely broadcastable, I would use a broadcast join to avoid shuffling the 5-TB table. I would verify the execution plan and Spark UI to confirm the expected strategy.

```python
large_df.join(
    broadcast(small_df),
    "customer_id"
)
```

---

## 55. How would you optimize a join between two large tables?

### 🎯 Interview-ready answer

> I would first reduce the data on both sides by filtering early and selecting only required columns. Then I would inspect the join-key distribution for skew, analyze the physical plan, and choose an appropriate distributed join strategy. I would also use AQE and address skew if required.

---

# 6. Data Skew & Salting

## 56. What is Data Skewness?

### 🎯 Interview-ready answer

> Data skew occurs when data is significantly unevenly distributed across partitions, usually because some join or grouping keys have disproportionately many records. This can cause one or a few partitions to become much larger than others and create slow straggler tasks.

Example:

```text
P1 → 2 GB
P2 → 3 GB
P3 → 2 GB
P4 → 95 GB 🔴
```

---

## 57. Why does Data Skew occur?

Common reasons:

* Highly uneven key distribution
* Hot keys
* Null/default keys
* Poor partitioning key
* Uneven join-key frequency

Example:

```text
C001 → 100 million
C002 → 1,000
C003 → 500
```

`C001` is highly skewed.

---

## 58. What is a Hot Key?

### 🎯 Interview-ready answer

> A hot key is a key value that occurs much more frequently than other values and therefore can cause a disproportionate amount of data to be sent to one or a few partitions.

Example:

```text
C001 → 100M
C002 → 10K
C003 → 5K
```

`C001` is a hot key.

---

## 59. How does Data Skew affect Spark Performance?

It can cause:

* Straggler tasks
* Uneven CPU usage
* Large shuffle partitions
* Memory pressure
* Disk spilling
* Executor OOM
* Longer stage execution

Example:

```text
Task 1 → 2 minutes
Task 2 → 2 minutes
Task 3 → 2 minutes
Task 4 → 45 minutes 🔴
```

---

## 60. How do you detect Data Skew using Spark UI?

Look for:

* One/few tasks much slower
* Large difference in shuffle read
* Large difference in input size
* Large spill
* Uneven partition sizes

Example:

```text
Task 1 → 500 MB
Task 2 → 450 MB
Task 3 → 600 MB
Task 4 → 50 GB 🔴
```

Strong indication of skew.

---

## 61. What is Salting?

### 🎯 Interview-ready answer

> Salting is a technique used to handle data skew by adding an artificial salt value to a skewed key so that records belonging to the same hot key can be distributed across multiple partitions.

Instead of:

```text
C001
```

we create:

```text
C001_0
C001_1
C001_2
C001_3
```

---

## 62. How does Salting solve Data Skew?

Without salting:

```text
C001
 ↓
Same partition
 ↓
90 GB 🔴
```

With salting:

```text
C001_0 → P1
C001_1 → P2
C001_2 → P3
C001_3 → P4
```

The hot key's records can be distributed across multiple partitions.

### Important

> Number of salt values is a tuning parameter; it does **not** have to equal the number of Spark partitions.

---

## 63. What are the disadvantages of Salting?

* More complex code
* Can increase data volume
* Small-side replication may be required for joins
* Choosing salt count requires tuning
* Extra processing overhead

So don't use salting unnecessarily.

---

## 64. Does `repartition()` solve Data Skew?

### 🎯 Interview-ready answer

> Not necessarily. `repartition()` redistributes data, but if the same hot key is still mapped to the same partition, the skew can remain.

```text
repartition()
      ↓
Same hot key
      ↓
Same partitioning bucket
      ↓
Still skewed
```

You need a technique such as:

* AQE skew optimization
* Salting
* Broadcast join
* Better partitioning strategy

depending on the problem.

---

## 65. How does AQE handle Data Skew?

### 🎯 Interview-ready answer

> AQE can identify abnormally large shuffle partitions at runtime and, for supported skewed join scenarios, split those partitions into smaller pieces so that the work can be processed in parallel.

```text
450 GB skewed partition
        ↓
AQE
        ↓
90 + 90 + 90 + 90 + 90 GB
        ↓
Parallel tasks
```

---

# 7. Spark Optimization

## 66. What is AQE?

### 🎯 Interview-ready answer

> AQE, or Adaptive Query Execution, is a Spark feature that uses runtime statistics to dynamically adjust the physical execution plan while the query is running.

### Major capabilities

* Coalesce small shuffle partitions
* Optimize skewed joins
* Dynamically change certain join strategies

---

## 67. How does AQE work?

### 🎯 Simple explanation

Normally:

```text
Initial plan
   ↓
Execute
```

With AQE:

```text
Initial plan
   ↓
Execute stage
   ↓
Collect runtime statistics
   ↓
AQE analyzes actual data
   ↓
Modify plan
   ↓
Continue execution
```

### Production example

You configured:

```text
2000 shuffle partitions
```

After a shuffle, AQE discovers most are tiny.

It can combine them:

```text
2000 tiny partitions
        ↓
AQE
        ↓
Fewer reasonably sized partitions
```

---

## 68. What are the Major Features of AQE?

### 1. Coalescing shuffle partitions

```text
Many small partitions
        ↓
Combine
```

### 2. Skew join optimization

```text
Huge skewed partition
        ↓
Split into smaller pieces
```

### 3. Dynamic join strategy changes

```text
Initial strategy
        ↓
Runtime statistics
        ↓
Better strategy
```

---

## 69. AQE vs Catalyst Optimizer?

### Catalyst

> Catalyst is Spark SQL's query optimization framework that analyzes and optimizes the query plan.

### AQE

> AQE adapts the physical execution plan using actual runtime statistics.

```text
Catalyst
→ Plan optimization

AQE
→ Runtime adaptation
```

---

## 70. What is Catalyst Optimizer?

### 🎯 Interview-ready answer

> Catalyst is Spark SQL's query optimization framework. It analyzes SQL/DataFrame operations, resolves the logical plan, applies optimization rules, and helps generate an efficient physical execution plan.

Conceptually:

```text
SQL/DataFrame
      ↓
Logical Plan
      ↓
Analysis
      ↓
Optimized Logical Plan
      ↓
Physical Plan
      ↓
Execution
```

---

## 71. What is Predicate Pushdown?

### 🎯 Interview-ready answer

> Predicate pushdown means pushing filter conditions as close as possible to the data source so that unnecessary data is not read.

Without:

```text
Read entire table
      ↓
Filter
```

With pushdown:

```text
Filter pushed toward source
      ↓
Read less data
```

This reduces I/O.

---

## 72. What is Column Pruning?

### 🎯 Interview-ready answer

> Column pruning means Spark reads only the columns required by the query instead of reading unnecessary columns.

Example:

```sql
SELECT customer_id, amount
FROM sales;
```

If the table has 100 columns, a columnar source such as Parquet can avoid reading many of the unused columns.

---

## 73. What is Partition Pruning?

### 🎯 Interview-ready answer

> Partition pruning means Spark skips entire table partitions that cannot satisfy the query filter.

Suppose data is partitioned by:

```text
year
```

Query:

```sql
WHERE year = 2026
```

Spark can skip:

```text
2020
2021
2022
2023
2024
2025
```

and read only the relevant partition(s).

---

## 74. How do you optimize a slow Spark job?

### 🎯 Interview-ready answer

> I first identify the bottleneck using Spark UI and the execution plan. I check input size, task distribution, shuffle, skew, spills, joins, partitioning, and executor resource usage. Then I optimize the data processing and only increase cluster resources if necessary.

### My checklist

```text
1. Spark UI
2. Execution plan
3. Filter early
4. Column pruning
5. Partition pruning
6. Join optimization
7. Broadcast where appropriate
8. Fix skew
9. Tune partitions
10. AQE
11. Delta optimization
12. Cluster tuning
```

---

## 75. How do you troubleshoot a slow Spark job using Spark UI?

### 🎯 Interview-ready answer

> I first identify the slowest stage and then compare task duration, input size, shuffle read/write, spill, executor metrics, and failed tasks. If one task is much slower than the others, I investigate skew. If shuffle is high, I investigate joins, aggregations, or repartitioning.

### Check:

* Longest stage
* Task duration
* Shuffle read
* Shuffle write
* Input/output
* Spill
* Executor memory
* CPU
* Failed tasks
* Skew

---

# 8. Photon

## 76. What is Photon Accelerator?

### 🎯 Interview-ready answer

> Photon is Databricks' native vectorized query execution engine designed to accelerate supported SQL and DataFrame workloads. It uses optimized native execution to improve CPU efficiency for supported operations.

### Simple idea

```text
Spark planning
      ↓
Photon execution for supported operations
      ↓
Faster processing
```

---

## 77. How does Photon improve Spark Performance?

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

---

## 78. Photon vs Apache Spark?

### 🎯 Interview-ready answer

> Apache Spark is the distributed processing engine and programming framework. Photon is a Databricks execution engine designed to accelerate supported Spark SQL and DataFrame workloads.

```text
Spark
→ Distributed processing framework

Photon
→ Optimized execution engine
```

Photon doesn't replace Spark as a whole.

---

## 79. Photon vs Catalyst?

### Catalyst

> Determines and optimizes the query plan.

### Photon

> Executes supported operations efficiently.

```text
Catalyst
→ "How should this query execute?"

Photon
→ "Execute supported operations efficiently."
```

---

## 80. Photon vs AQE?

### 🎯 Interview-ready answer

> Photon and AQE solve different problems. Photon focuses on efficient execution of supported operations, while AQE dynamically changes the physical plan using runtime statistics.

```text
Catalyst → Initial optimization
AQE      → Runtime adaptation
Photon   → Efficient execution
```

They can work together.

---

## 81. Does Photon solve Data Skew?

> **No, not fundamentally.**

Photon can improve execution efficiency, but it doesn't eliminate the underlying uneven distribution.

For severe skew, consider:

* AQE skew optimization
* Salting
* Broadcast joins
* Better data distribution

---

# 9. Delta Lake

## 82. What is a Data Lake?

### 🎯 Interview-ready answer

> A data lake is a centralized storage environment for storing large volumes of structured, semi-structured, and unstructured data, usually in cloud object storage such as ADLS, S3, or GCS.

Examples:

```text
ADLS
S3
GCS
```

---

## 83. What is Delta Lake?

### 🎯 Interview-ready answer

> Delta Lake is an open-source storage layer that adds reliability and transactional capabilities to data lakes. Delta typically stores data in Parquet and uses a transaction log to track table changes and versions.

### Features

* ACID transactions
* Schema enforcement
* Schema evolution
* Time Travel
* UPDATE
* DELETE
* MERGE
* Change Data Feed
* Data management features

---

## 84. What is a Delta Table?

### 🎯 Interview-ready answer

> A Delta table is a table stored using the Delta format. It consists primarily of Parquet data files along with a `_delta_log` containing transaction information and table metadata.

Conceptually:

```text
Delta Table
│
├── Parquet files
│
└── _delta_log
```

---

## 85. Data Lake vs Delta Lake vs Delta Table?

### Data Lake

> The storage environment/architecture.

### Delta Lake

> The storage layer/protocol that adds transactional and table-management capabilities.

### Delta Table

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

---

## 86. Why use Delta Lake instead of Parquet?

### 🎯 Interview-ready answer

> Parquet is a columnar file format, while Delta Lake adds a transaction layer and table semantics on top of Parquet-based storage.

Delta provides:

* ACID transactions
* Schema enforcement
* Schema evolution
* Time Travel
* MERGE
* UPDATE
* DELETE
* CDF

### Simple:

```text
Parquet
→ File format

Delta
→ Parquet + transaction log + table capabilities
```

---

## 87. What is the Delta Transaction Log?

### 🎯 Interview-ready answer

> The Delta transaction log, stored in `_delta_log`, records the changes and metadata needed to determine the state of a Delta table at each version.

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

---

## 88. How does Delta Lake provide ACID properties?

### 🎯 Interview-ready answer

> Delta Lake uses its transaction protocol and transaction log to provide atomic commits, consistent table snapshots, concurrency control, and durable committed state.

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

---

## 89. What are ACID properties?

### Atomicity

> Transaction happens completely or not at all.

### Consistency

> Transaction keeps the database/table in a valid state.

### Isolation

> Concurrent transactions are managed so that readers don't see invalid intermediate states.

### Durability

> Once committed, the changes remain durable.

### Easy memory

```text
A → All or nothing
C → Correct state
I → Independent transactions
D → Data remains after commit
```

---

## 90. What happens internally when you update/delete data in a Delta table?

### 🎯 Interview-ready answer

> A successful modification creates a new Delta transaction-log version. Depending on the operation and runtime capabilities, Delta can either rewrite affected files or use deletion vectors for supported row-level changes. The old files can become obsolete rather than being immediately physically deleted.

### Without deletion vectors

```text
Old Parquet
    ↓
Rewrite affected data
    ↓
New Parquet
    ↓
New Delta version
```

### With deletion vectors

```text
Existing Parquet
      +
Deletion Vector
      ↓
New Delta version
```

The transaction log records the new table state.

---

# 10. Delta Features & Data Management

## 91. What is Schema Evolution?

### 🎯 Interview-ready answer

> Schema evolution is the ability to intentionally allow supported changes to a table's schema, such as adding new columns, when the operation and configuration permit it.

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

---

## 92. Schema Evolution vs Schema Enforcement?

### Schema Enforcement

> Protects the existing table schema and rejects incompatible writes.

### Schema Evolution

> Allows supported schema changes when explicitly enabled/configured.

```text
Enforcement
→ Protect schema

Evolution
→ Change schema intentionally
```

### Easy memory

> **Enforcement = Don't unexpectedly change my schema.**

> **Evolution = I allow controlled schema changes.**

---

## 93. What is Auto Loader?

### 🎯 Interview-ready answer

> Auto Loader is a Databricks feature for incrementally ingesting new files from cloud object storage. It uses the `cloudFiles` source and tracks processed files so pipelines can efficiently process newly arriving data at scale.

Example:

```python
df = spark.readStream \
    .format("cloudFiles") \
    .option("cloudFiles.format", "json") \
    .load("/mnt/source")
```

---

## 94. How does Auto Loader work?

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

### Advantages

* Incremental ingestion
* Scales to large file counts
* Handles continuously arriving files
* Supports schema inference/evolution features
* Integrates with Structured Streaming

---

## 95. What is CDC and CDF?

### CDC

> Change Data Capture is a general technique for capturing changes such as INSERT, UPDATE, and DELETE from a source system.

Example:

```text
SQL Server
   ↓
CDC
   ↓
Changed records
```

### CDF

> Change Data Feed is a Delta Lake feature that exposes row-level changes made to a Delta table.

```text
CDC
→ General change-capture concept

CDF
→ Delta change-feed feature
```

---

## 96. CDF vs CDC?

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

---

## 97. What is Z-Ordering?

### 🎯 Interview-ready answer

> Z-Ordering is a Delta data-layout optimization technique that improves the clustering of values across files for selected columns. This can improve data skipping for queries that frequently filter on those columns.

Example:

```sql
OPTIMIZE transactions
ZORDER BY (customer_id);
```

### Important

> Z-Ordering is **not the same as partitioning** and does not mean one customer is placed into exactly one file.

---

## 98. What is Data Skipping and how does Z-Ordering help?

### Data skipping

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

### Z-Ordering

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

---

## 99. What is Delta OPTIMIZE and why is it needed?

### 🎯 Interview-ready answer

> `OPTIMIZE` reorganizes Delta table data, commonly by compacting small files into larger files. Depending on the operation and platform capabilities, it can also apply data-layout optimization such as Z-Ordering.

Example:

```sql
OPTIMIZE transactions;
```

### Why?

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

### With Z-Ordering

```sql
OPTIMIZE transactions
ZORDER BY (customer_id);
```

---

## 100. What is VACUUM and how does it affect Time Travel?

### 🎯 Interview-ready answer

> `VACUUM` removes old physical data files that are no longer needed by the active Delta table and are older than the configured retention period. If those old files are removed, Time Travel to versions that depend on them may no longer be possible.

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

### Important distinction

`VACUUM` primarily removes **obsolete physical data files**. It is not simply "deleting Delta history."

### Time Travel

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

### ⚠️ Interview point

> **Don't say VACUUM immediately deletes old versions from the transaction log.** Its main purpose is cleaning up obsolete data files.

---

# Appendix

## Final DE2 Revision Sheet

If you have limited time before your interview, memorize these chains:

### Spark Architecture

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

### Shuffle

```text
Wide transformation
 ↓
Shuffle
 ↓
Data redistribution
 ↓
New shuffle partitions
```

### Data Skew

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

### Salting

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

### AQE

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

### Delta

```text
Parquet files
      +
_delta_log
      ↓
Delta Lake
      ↓
ACID + Time Travel + MERGE + UPDATE + DELETE
```

### Delta DELETE

```text
DELETE
 ↓
New Delta transaction/version
 ↓
Deletion Vector OR file rewrite
 ↓
New table state
```

### Z-Ordering

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

### VACUUM

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

### Most important DE2 optimization chain

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

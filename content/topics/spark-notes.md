---
title: PySpark Notes
description: 100 in-depth PySpark topics — Basic, Medium, and Advance
parent: spark
hidden: true
order: 1
difficulty: basic
---

## Basic

> **🟢 PART 1 — PySpark BASIC** — Topics 1–35 (35 topics). Each topic covers what it is, why it's used, examples, production perspective, and an interview-ready answer.

### 1. What is PySpark?

**What is it?:**

**PySpark is the Python API for Apache Spark.**

Apache Spark is a distributed data-processing engine that allows us to process huge amounts of data across multiple machines.

PySpark allows us to use Spark using Python.

**Simple example:**

Suppose you have:

```text
1 TB transaction data
```

Using normal Python on one machine can be difficult.

With Spark:

```text
                 1 TB Data
                     |
        ---------------------------
        |            |            |
      Node 1       Node 2       Node 3
        |            |            |
     Process      Process      Process
        |            |            |
        ----------- Result --------
```

Spark distributes the work.

**Why use PySpark?:**

* Large-scale data processing
* Distributed computing
* Parallel processing
* Fault tolerance
* Handles structured and semi-structured data
* Batch processing
* Streaming
* SQL/DataFrame support

**Interview-ready answer:**

**PySpark is the Python API for Apache Spark. It allows us to process large datasets in a distributed manner by distributing data and computation across multiple machines.**

### 2. Apache Spark vs PySpark

This is a very common confusion.

**Apache Spark:**

Spark is the **actual distributed processing engine**.

**PySpark:**

PySpark is the **Python interface/API used to interact with Spark**.

```text
Python Code
     ↓
  PySpark
     ↓
Apache Spark
     ↓
Cluster
     ↓
Executors
     ↓
Process Data
```

**Example:**

When you write:

```python
df.filter(df.salary > 5000)
```

You are using the **PySpark API**.

Spark internally executes the operation using its execution engine.

**Interview-ready answer:**

**Apache Spark is the distributed processing engine, while PySpark is its Python API that allows us to write Spark applications using Python.**

### 3. Why use PySpark?

Imagine a company has:

```text
10 TB customer transactions
```

You don't want one machine to process everything.

PySpark can distribute the work.

**Major advantages:**

**1. Distributed processing:**

Data can be processed across many machines.

**2. Scalability:**

You can increase cluster resources when data grows.

**3. Fault tolerance:**

If a task fails, Spark can recompute the required data using lineage.

**4. Lazy evaluation:**

Spark doesn't immediately execute transformations.

It builds an execution plan first.

**5. Optimization:**

Spark has:

* Catalyst Optimizer
* AQE
* Predicate Pushdown
* Column Pruning
* etc.

**Interview-ready answer:**

**I use PySpark when I need to process large datasets that cannot be efficiently handled on a single machine. Its main advantages are distributed processing, scalability, fault tolerance and built-in query optimization.**

### 4. Spark Architecture

This is one of the **most important topics**.

Spark has mainly:

```text
             Driver
               |
        Cluster Manager
               |
       -----------------
       |       |       |
   Executor Executor Executor
       |       |       |
     Tasks   Tasks   Tasks
       |       |       |
      Data   Data    Data
```

**Main components:**

1. Driver
2. Cluster Manager
3. Executors
4. Tasks
5. Partitions

**Driver:**

The Driver is the **brain of the Spark application**.

It:

* Runs your main application
* Creates SparkSession
* Builds execution plans
* Creates jobs
* Creates stages
* Schedules tasks
* Coordinates executors

**Executors:**

Executors are worker processes that actually process the data.

They:

* Execute tasks
* Store cached data
* Perform transformations
* Return results/status to Driver

**Cluster Manager:**

Responsible for allocating resources.

Examples:

* Spark Standalone
* YARN
* Kubernetes
* Databricks-managed infrastructure

**Interview-ready answer:**

**Spark follows a driver-executor architecture. The Driver coordinates the application and creates the execution plan, while Executors execute tasks on data partitions. The Cluster Manager provides the required resources.**

### 5. Driver

The Driver is the **central coordinator**.

Suppose you write:

```python
df.filter(df.salary > 5000).count()
```

The Driver:

```text
Your application
      ↓
Driver
      ↓
Creates execution plan
      ↓
Creates stages
      ↓
Creates tasks
      ↓
Sends tasks to Executors
```

Executors then process the partitions.

**Important:**

Driver does **not normally process all your data itself**.

It coordinates the work.

**Driver OOM:**

A common production problem is:

```python
df.collect()
```

If the DataFrame contains millions of records, `collect()` brings all records to the Driver.

That can cause:

```text
Driver OutOfMemory
```

**Interview-ready answer:**

**The Driver is responsible for coordinating the Spark application. It creates the execution plan, divides work into jobs, stages and tasks, and schedules those tasks on executors.**

### 6. Executors

Executors are worker processes.

Example:

```text
Driver
 |
 +---- Executor 1
 |       ├── Task 1
 |       ├── Task 2
 |
 +---- Executor 2
 |       ├── Task 3
 |       ├── Task 4
 |
 +---- Executor 3
         ├── Task 5
         └── Task 6
```

Executors:

* Run tasks
* Process partitions
* Store cached data
* Perform shuffle operations

**Executor memory:**

Executor memory is used for things like:

* Execution
* Caching
* Shuffle-related processing
* Internal data structures

If memory is insufficient, you can get:

```text
Executor OOM
```

**Interview-ready answer:**

**Executors are worker processes that run tasks assigned by the Driver. They process data partitions and can also store cached or persisted data.**

### 7. Cluster Manager

The Cluster Manager manages cluster resources.

It decides:

> "How many CPU cores and how much memory can this Spark application get?"

Common cluster managers:

**Spark Standalone:**

Spark's own cluster manager.

**YARN:**

Common in Hadoop environments.

**Kubernetes:**

Runs Spark workloads in Kubernetes.

**Databricks:**

Databricks manages the infrastructure and compute for you.

**Interview-ready answer:**

**A Cluster Manager is responsible for allocating compute resources such as CPU and memory to Spark applications. Examples include YARN, Kubernetes and Spark Standalone.**

### 8. SparkSession

`SparkSession` is the **main entry point for modern Spark applications**.

You commonly create it using:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("MyApp") \
    .getOrCreate()
```

Then:

```python
df = spark.read.csv("employees.csv")
```

**SparkSession provides access to::**

* DataFrame API
* SQL
* Catalog
* Configuration
* SparkContext

Conceptually:

```text
SparkSession
     |
     +-- DataFrame API
     |
     +-- Spark SQL
     |
     +-- Catalog
     |
     +-- SparkContext
```

**Interview-ready answer:**

**SparkSession is the main entry point for working with Spark DataFrames and Spark SQL. It provides access to Spark functionality and internally gives access to SparkContext.**

### 9. SparkContext

`SparkContext` is the lower-level connection between your application and the Spark cluster.

It coordinates with the cluster manager and executors.

Historically:

```text
SparkContext
```

was the main entry point for Spark.

Modern applications generally use:

```text
SparkSession
```

which provides access to the underlying SparkContext.

You can see it using:

```python
spark.sparkContext
```

**Interview-ready answer:**

**SparkContext is the lower-level entry point responsible for connecting the Spark application to the cluster and coordinating execution. In modern PySpark applications, we generally use SparkSession, which provides access to SparkContext.**

### 10. RDD vs DataFrame

Very important interview question.

**RDD:**

RDD = **Resilient Distributed Dataset**

It is a low-level distributed collection of objects.

Example:

```python
rdd = spark.sparkContext.parallelize([1, 2, 3, 4])
```

**DataFrame:**

A DataFrame is a distributed collection of data organized into named columns with a schema.

Example:

```text
+----+------+
| id |salary|
+----+------+
| 1  |5000  |
| 2  |7000  |
+----+------+
```

**Main difference:**

| RDD                    | DataFrame              |
| ---------------------- | ---------------------- |
| Low level              | Higher level           |
| No fixed column schema | Has schema             |
| Less optimized         | Highly optimized       |
| Object-oriented data   | Tabular data           |
| More control           | Easier for ETL         |
| Usually less preferred | Preferred for most ETL |

**Interview-ready answer:**

**RDD is a lower-level distributed data structure, while DataFrame is a higher-level structured API with schema and query optimization. For most modern ETL workloads, I prefer DataFrames because Spark can optimize them using Catalyst and other optimizations.**

### 11. What is a DataFrame?

A DataFrame is a distributed table.

Example:

```text
employee_id | name   | salary | dept
------------|--------|--------|------
1           | Amit   | 5000   | IT
2           | Rahul  | 7000   | HR
3           | Neha   | 9000   | IT
```

Unlike pandas, Spark DataFrames are distributed across the cluster.

**Creating one:**

```python
data = [
    (1, "Amit", 5000),
    (2, "Rahul", 7000)
]

df = spark.createDataFrame(
    data,
    ["id", "name", "salary"]
)
```

**Interview-ready answer:**

**A PySpark DataFrame is a distributed collection of structured data organized into named columns. It provides a high-level API for data processing and allows Spark to optimize queries.**

### 12. Creating a DataFrame

Common ways:

**From Python data:**

```python
data = [
    (1, "Amit"),
    (2, "Rahul")
]

df = spark.createDataFrame(
    data,
    ["id", "name"]
)
```

**From CSV:**

```python
df = spark.read.csv(
    "employees.csv",
    header=True,
    inferSchema=True
)
```

**From JSON:**

```python
df = spark.read.json("employees.json")
```

**From Parquet:**

```python
df = spark.read.parquet("employees.parquet")
```

**Interview point:**

In production, we usually read data from:

* ADLS
* S3
* GCS
* Delta tables
* databases
* Kafka/streaming sources

### 13. Schema and Data Types

Schema describes:

> What columns exist and what types of data they contain.

Example:

```text
root
 |-- id: integer
 |-- name: string
 |-- salary: double
```

Common types:

* StringType
* IntegerType
* LongType
* DoubleType
* FloatType
* BooleanType
* DateType
* TimestampType
* ArrayType
* StructType
* MapType

**Explicit schema:**

```python
from pyspark.sql.types import *

schema = StructType([
    StructField("id", IntegerType()),
    StructField("name", StringType()),
    StructField("salary", DoubleType())
])
```

Then:

```python
df = spark.createDataFrame(data, schema)
```

**Why explicit schema?:**

It is safer than relying on inference.

Benefits:

* Better reliability
* Avoid unexpected data types
* Better performance during ingestion
* Useful in production pipelines

### 14. `printSchema()`

Used to inspect DataFrame schema.

```python
df.printSchema()
```

Output:

```text
root
 |-- id: integer
 |-- name: string
 |-- salary: double
```

Very useful for debugging.

### 15. `show()`

Displays DataFrame records.

```python
df.show()
```

Example:

```text
+---+-----+------+
|id |name |salary|
+---+-----+------+
|1  |Amit |5000  |
|2  |Rahul|7000  |
+---+-----+------+
```

You can specify number of rows:

```python
df.show(10)
```

**Important:**

`show()` is an **action** because Spark needs to execute work to produce rows.

### 16. `select()`

Used to select columns.

```python
df.select("name", "salary")
```

Or:

```python
df.select(
    "name",
    "salary"
)
```

**Expression:**

```python
df.select(
    "name",
    (df.salary * 12).alias("annual_salary")
)
```

**Important:**

`select()` is a **transformation**.

It creates a new DataFrame.

### 17. `filter()` / `where()`

Used to filter records.

```python
df.filter(df.salary > 5000)
```

Equivalent:

```python
df.where(df.salary > 5000)
```

SQL-style:

```python
df.filter("salary > 5000")
```

**Multiple conditions:**

```python
df.filter(
    (df.salary > 5000) &
    (df.dept == "IT")
)
```

**Important:**

`filter()` is a transformation.

### 18. `withColumn()`

Used to:

* Create a new column
* Modify an existing column

Example:

```python
df.withColumn(
    "annual_salary",
    df.salary * 12
)
```

Modify:

```python
df.withColumn(
    "salary",
    df.salary * 1.10
)
```

**Important:**

It does not modify the original DataFrame in place.

```python
df2 = df.withColumn(...)
```

### 19. `drop()`

Used to remove columns.

```python
df.drop("salary")
```

Multiple:

```python
df.drop("salary", "age")
```

Again, it returns a new DataFrame.

### 20. `withColumnRenamed()`

Used to rename columns.

```python
df.withColumnRenamed(
    "salary",
    "monthly_salary"
)
```

Useful when source column names are bad or inconsistent.

### 21. `alias()`

Used to give temporary names to:

* Columns
* Expressions
* Tables/DataFrames

Example:

```python
df.select(
    df.salary.alias("employee_salary")
)
```

With aggregation:

```python
df.groupBy("dept").agg(
    sum("salary").alias("total_salary")
)
```

### 22. `lit()`

`lit()` creates a constant value.

Example:

```python
from pyspark.sql.functions import lit

df.withColumn(
    "country",
    lit("India")
)
```

Result:

```text
id | name | country
---|------|--------
1  | Amit | India
2  | Rahul| India
```

Without `lit()`:

```python
withColumn("country", "India")
```

Spark may interpret `"India"` as a column reference rather than a constant.

### 23. `cast()`

Used to change a column's data type.

Example:

```python
df.withColumn(
    "salary",
    df.salary.cast("double")
)
```

Or:

```python
df.withColumn(
    "id",
    df.id.cast("string")
)
```

Very common when processing raw data.

Example:

```text
CSV
salary = "5000"
       ↓
cast
       ↓
salary = 5000.0
```

### 24. `when()` / `otherwise()`

Used for conditional logic.

SQL equivalent:

```sql
CASE WHEN
```

Example:

```python
from pyspark.sql.functions import when

df.withColumn(
    "salary_range",
    when(df.salary >= 10000, "High")
    .when(df.salary >= 5000, "Medium")
    .otherwise("Low")
)
```

Result:

```text
salary | salary_range
-------|-------------
12000  | High
7000   | Medium
3000   | Low
```

Very common in transformation logic.

### 25. `distinct()`

Removes duplicate **rows**.

Suppose:

```text
id | name
---|-----
1  | Amit
1  | Amit
2  | Rahul
```

```python
df.distinct()
```

Result:

```text
1 Amit
2 Rahul
```

**Important:**

`distinct()` considers the **entire row**.

### 26. `dropDuplicates()`

Removes duplicate records based on specified columns.

Example:

```python
df.dropDuplicates(["customer_id"])
```

Suppose:

```text
customer_id | transaction | amount
------------|-------------|-------
101         | T1          | 500
101         | T2          | 700
102         | T3          | 300
```

It keeps one record for customer 101.

**Difference:**

```python
distinct()
```

→ entire row

```python
dropDuplicates(["customer_id"])
```

→ specified columns

**Production use:**

Deduplicating CDC/source data.

### 27. `orderBy()` / `sort()`

Used for sorting.

```python
df.orderBy("salary")
```

Descending:

```python
from pyspark.sql.functions import desc

df.orderBy(desc("salary"))
```

**Important performance point:**

Global sorting generally requires a **shuffle**.

So sorting a huge dataset can be expensive.

### 28. `groupBy()`

Used to group records based on one or more columns.

Example:

```python
df.groupBy("dept")
```

Usually combined with aggregation:

```python
df.groupBy("dept").sum("salary")
```

Conceptually:

```text
Input

IT     5000
HR     6000
IT     7000
HR     8000

        ↓ groupBy dept

IT → 5000 + 7000
HR → 6000 + 8000
```

**Critical Spark concept:**

`groupBy()` is generally a **wide transformation** and requires a **shuffle**.

We'll study this deeply later.

### 29. Aggregations

Common aggregation functions:

```python
count()
sum()
avg()
min()
max()
```

Example:

```python
from pyspark.sql.functions import *

df.groupBy("dept").agg(
    count("*").alias("employee_count"),
    sum("salary").alias("total_salary"),
    avg("salary").alias("avg_salary")
)
```

Output:

```text
dept | employee_count | total_salary | avg_salary
-----|----------------|--------------|-----------
IT   | 10             | 80000        | 8000
HR   | 5              | 35000        | 7000
```

### 30. `countDistinct()`

Counts unique values.

```python
df.select(
    countDistinct("customer_id")
)
```

Example:

```text
customer_id
-----------
101
101
102
103
103
```

Result:

```text
3
```

**Production example:**

Count unique customers who made transactions.

### 31. Null Handling

Null values are extremely common in real data.

Example:

```text
id | name | salary
---|------|-------
1  | Amit | 5000
2  | Rahul| null
```

**Check null:**

```python
df.filter(
    df.salary.isNull()
)
```

**Remove nulls:**

```python
df.dropna()
```

**Fill nulls:**

```python
df.fillna({
    "salary": 0
})
```

**Conditional handling:**

```python
df.withColumn(
    "salary",
    when(df.salary.isNull(), 0)
    .otherwise(df.salary)
)
```

**Important:**

Null handling depends on business rules.

Don't blindly replace every null with zero.

### 32. String Functions

PySpark provides many built-in functions.

Examples:

```python
upper()
lower()
trim()
length()
substring()
concat()
regexp_replace()
split()
```

Example:

```python
from pyspark.sql.functions import upper

df.withColumn(
    "name",
    upper("name")
)
```

Input:

```text
amit
```

Output:

```text
AMIT
```

**Production example:**

Cleaning customer names from raw source systems.

### 33. Date & Timestamp Functions

Very important for Data Engineering.

Common functions:

```text
current_date()
current_timestamp()
to_date()
to_timestamp()
date_format()
datediff()
date_add()
date_sub()
year()
month()
day()
```

Example:

```python
from pyspark.sql.functions import to_date

df.withColumn(
    "order_date",
    to_date("order_date")
)
```

Example:

```python
df.withColumn(
    "year",
    year("order_date")
)
```

**Production example:**

A transaction pipeline might need:

```text
transaction_timestamp
        ↓
transaction_date
        ↓
year/month/day
        ↓
partitioning
```

### 34. Reading CSV / JSON / Parquet

**CSV:**

```python
df = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \
    .csv("path")
```

Better production approach:

```python
df = spark.read \
    .option("header", True) \
    .schema(schema) \
    .csv("path")
```

**JSON:**

```python
df = spark.read.json("path")
```

For multiline JSON:

```python
df = spark.read \
    .option("multiline", True) \
    .json("path")
```

**Parquet:**

```python
df = spark.read.parquet("path")
```

Parquet is very common in Data Engineering because it is a **columnar format** and works efficiently with Spark.

### 35. Writing DataFrames

Basic syntax:

```python
df.write \
    .mode("overwrite") \
    .parquet("output/path")
```

Common modes:

**append:**

```python
.mode("append")
```

Adds data.

**overwrite:**

```python
.mode("overwrite")
```

Replaces existing output according to the write semantics.

**ignore:**

```python
.mode("ignore")
```

Does nothing if output already exists.

**error / errorifexists:**

Fails if output already exists.

**Writing partitioned data:**

Very common in production:

```python
df.write \
    .partitionBy("year", "month") \
    .parquet("output/path")
```

Conceptually:

```text
output/
 ├── year=2025/
 │    ├── month=01/
 │    ├── month=02/
 │
 └── year=2026/
      ├── month=01/
      └── month=02/
```

Later, if a query filters:

```sql
WHERE year = 2026
AND month = 1
```

Spark may be able to skip unrelated partitions.

This is called **partition pruning**, which we'll cover in the advanced section.

## Medium

> **🟡 PART 2 — PySpark MEDIUM** — Topics 36–70 (35 topics). Each topic covers what it is, why it's used, examples, production perspective, and an interview-ready answer.

### 36. Joins in PySpark

A **join** combines data from two DataFrames using a common column or condition.

Example:

**Employees:**

```text
id | name | dept_id
---|------|--------
1  | Amit | 10
2  | Rahul| 20
3  | Neha | 10
```

**Departments:**

```text
dept_id | dept_name
--------|----------
10      | IT
20      | HR
```

We want:

```text
id | name  | dept_name
---|-------|----------
1  | Amit  | IT
2  | Rahul | HR
3  | Neha  | IT
```

**Code:**

```python
result = employees.join(
    departments,
    employees.dept_id == departments.dept_id,
    "inner"
)
```

**Why joins matter:**

In real projects, data is usually distributed across multiple tables:

```text
Customer
    ↓
Transactions
    ↓
Account
    ↓
Branch
```

Joining them is extremely common.

**Important:**

Joins can become expensive because Spark may need to **shuffle data across executors**.

We'll study join optimization in Advanced.

### 37. Inner Join

Returns only matching records.

```python
df1.join(
    df2,
    df1.id == df2.id,
    "inner"
)
```

Example:

```text
A              B

1 Amit         1 IT
2 Rahul        3 HR
3 Neha
```

Result:

```text
1 Amit IT
```

and

```text
3 Neha HR
```

because IDs 1 and 3 exist in both.

**Interview-ready answer:**

**Inner join returns only the records that have matching keys in both DataFrames.**

### 38. Left / Right / Full Join

**Left Join:**

Keeps **all records from the left DataFrame**.

```python
df1.join(
    df2,
    "id",
    "left"
)
```

Example:

```text
Left              Right

1 Amit            1 IT
2 Rahul           3 HR
3 Neha
```

Result:

```text
1 Amit  IT
2 Rahul NULL
3 Neha  HR
```

**Right Join:**

Keeps all records from the right DataFrame.

**Full Join:**

Keeps all records from both sides.

```text
1 Amit IT
2 Rahul NULL
3 Neha HR
```

depending on matching keys.

**Interview-ready answer:**

**Left join keeps all records from the left side, right join keeps all records from the right side, and full join keeps records from both sides, filling unmatched columns with nulls.**

### 39. Semi Join

A **left semi join** returns records from the left DataFrame where a matching record exists in the right DataFrame.

But it returns **only columns from the left DataFrame**.

Example:

```python
customers.join(
    active_customers,
    "customer_id",
    "left_semi"
)
```

If:

```text
Customers

101
102
103

Active

101
103
```

Result:

```text
101
103
```

**Think of it as::**

> "Give me customers who exist in the active customer table."

It is similar conceptually to:

```sql
WHERE EXISTS (...)
```

### 40. Anti Join

The opposite idea.

Returns left-side records where **no matching record exists** on the right.

```python
customers.join(
    active_customers,
    "customer_id",
    "left_anti"
)
```

Example:

```text
Customers: 101, 102, 103
Active:    101, 103
```

Result:

```text
102
```

**Production example:**

Find records present in source but missing in target.

```text
Source
 ↓
Target
 ↓
left_anti
 ↓
Missing records
```

Very useful for reconciliation.

### 41. Cross Join

A cross join creates a **Cartesian product**.

If:

```text
A = 3 rows
B = 4 rows
```

Result:

```text
3 × 4 = 12 rows
```

Code:

```python
df1.crossJoin(df2)
```

**Why dangerous?:**

If:

```text
1 million × 1 million
```

you potentially get:

```text
1 trillion combinations
```

This can be extremely expensive.

**Interview-ready answer:**

**Cross join produces every possible combination of rows from both DataFrames. I avoid it unless the business requirement specifically needs a Cartesian product.**

### 42. Multiple-column joins

Sometimes one column isn't enough.

Example:

```text
customer_id
transaction_date
```

Join on both:

```python
result = df1.join(
    df2,
    (df1.customer_id == df2.customer_id) &
    (df1.transaction_date == df2.transaction_date),
    "inner"
)
```

**Production example:**

A transaction may be uniquely identified by:

```text
customer_id + transaction_date + transaction_id
```

### 43. Join with different column names

Suppose:

```text
df1.customer_id
df2.cust_id
```

You can write:

```python
df1.join(
    df2,
    df1.customer_id == df2.cust_id,
    "inner"
)
```

Or rename first.

```python
df2 = df2.withColumnRenamed(
    "cust_id",
    "customer_id"
)
```

Then:

```python
df1.join(df2, "customer_id")
```

### 44. `groupBy().agg()`

This is the preferred way to perform multiple aggregations.

Example:

```python
from pyspark.sql.functions import *

df.groupBy("dept").agg(
    count("*").alias("employee_count"),
    sum("salary").alias("total_salary"),
    avg("salary").alias("avg_salary")
)
```

Output:

```text
dept | employee_count | total_salary | avg_salary
-----|----------------|--------------|-----------
IT   | 10             | 80000        | 8000
HR   | 5              | 35000        | 7000
```

**Why `.agg()`?:**

Because it lets you perform multiple aggregations together.

### 45. Multiple aggregations

Example:

```python
df.groupBy("department").agg(
    min("salary").alias("min_salary"),
    max("salary").alias("max_salary"),
    avg("salary").alias("avg_salary"),
    sum("salary").alias("total_salary")
)
```

This is common in reporting pipelines.

### 46. `collect_list()` / `collect_set()`

These collect values into arrays.

**`collect_list()`:**

Keeps duplicates.

```python
df.groupBy("customer_id").agg(
    collect_list("product").alias("products")
)
```

Example:

```text
Customer 101

Laptop
Phone
Laptop
```

Result:

```text
[Laptop, Phone, Laptop]
```

**`collect_set()`:**

Removes duplicates.

```python
collect_set("product")
```

Result:

```text
[Laptop, Phone]
```

**Important production warning:**

Don't blindly use these on groups with huge numbers of records.

A single group containing millions of values can cause serious memory pressure.

### 47. `explode()`

Used to convert array elements into separate rows.

Suppose:

```text
id | products
---|------------------
1  | [Laptop, Phone]
2  | [Tablet, Mouse]
```

Use:

```python
from pyspark.sql.functions import explode

df.select(
    "id",
    explode("products").alias("product")
)
```

Result:

```text
id | product
---|--------
1  | Laptop
1  | Phone
2  | Tablet
2  | Mouse
```

**Production use:**

Very common when processing nested JSON/API data.

### 48. Array and Struct Operations

Real JSON data often looks like:

```json
{
  "customer_id": 101,
  "address": {
    "city": "Chennai",
    "state": "Tamil Nadu"
  },
  "orders": [
    {"id": 1, "amount": 500},
    {"id": 2, "amount": 700}
  ]
}
```

Spark represents this using:

```text
StructType
ArrayType
MapType
```

Access nested fields:

```python
df.select("address.city")
```

Access array:

```python
df.select("orders")
```

Explode:

```python
df.select(
    "customer_id",
    explode("orders").alias("order")
)
```

Then:

```python
df.select(
    "order.id",
    "order.amount"
)
```

### 49. Nested JSON processing

Typical pipeline:

```text
Raw JSON
   ↓
Read using Spark
   ↓
Nested Struct/Array
   ↓
explode()
   ↓
Flatten fields
   ↓
Silver DataFrame
```

Example:

```python
df.select(
    "customer_id",
    "address.city",
    explode("orders").alias("order")
)
```

Then:

```python
df.select(
    "customer_id",
    "city",
    "order.id",
    "order.amount"
)
```

**Production example:**

API responses frequently contain nested JSON.

PySpark is particularly useful for flattening these structures.

### 50. `spark.sql()` and Spark SQL

Spark supports SQL directly.

Example:

```python
df.createOrReplaceTempView("employees")
```

Then:

```python
result = spark.sql("""
    SELECT department,
           AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
""")
```

You can then:

```python
result.show()
```

**DataFrame API vs Spark SQL:**

Both are ultimately translated into Spark's query planning/execution framework.

So:

```python
df.filter(df.salary > 5000)
```

and:

```sql
SELECT *
FROM employees
WHERE salary > 5000
```

can represent equivalent operations.

# 🟡 WINDOW FUNCTIONS

Now we enter a very important DE interview area.

### 51. Window Functions

A window function performs calculations across related rows **without collapsing them into one row per group**.

This is the key difference from `groupBy()`.

**`groupBy`:**

```text
10 employees
   ↓
1 department row
```

**Window:**

```text
10 employees
   ↓
10 employee rows
+
calculation across them
```

Example:

```text
employee | dept | salary
---------|------|-------
A        | IT   | 5000
B        | IT   | 7000
C        | IT   | 9000
```

We can calculate:

```text
employee | salary | department_avg
---------|--------|---------------
A        | 5000   | 7000
B        | 7000   | 7000
C        | 9000   | 7000
```

### 52. `row_number()`

Assigns sequential numbers within each window.

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

window = Window.partitionBy("dept").orderBy(
    col("salary").desc()
)

df.withColumn(
    "row_num",
    row_number().over(window)
)
```

Result:

```text
dept | salary | row_num
-----|--------|--------
IT   | 9000   | 1
IT   | 7000   | 2
IT   | 5000   | 3
```

**Production use:**

Find latest record per customer:

```text
partitionBy(customer_id)
orderBy(timestamp DESC)
```

Then:

```text
row_number = 1
```

### 53. `rank()`

Ranks records but leaves gaps after ties.

Example:

```text
salary

10000
10000
8000
```

Rank:

```text
1
1
3
```

Because two rows occupy rank 1.

### 54. `dense_rank()`

Same concept as rank, but does not leave gaps.

```text
salary

10000
10000
8000
```

Result:

```text
1
1
2
```

**Difference:**

```text
rank()       → 1, 1, 3
dense_rank() → 1, 1, 2
```

### 55. `lag()` / `lead()`

Used to access previous or next rows.

**`lag()`:**

Gets previous row.

```python
df.withColumn(
    "previous_salary",
    lag("salary").over(window)
)
```

Example:

```text
month | salary | previous_salary
------|--------|----------------
Jan   | 5000   | null
Feb   | 6000   | 5000
Mar   | 7000   | 6000
```

**`lead()`:**

Gets next row.

```python
lead("salary").over(window)
```

**Production use:**

Compare:

```text
Current month sales
vs
Previous month sales
```

### 56. Running Totals

Example:

```text
month | sales
------|------
Jan   | 100
Feb   | 200
Mar   | 300
```

Running total:

```text
Jan → 100
Feb → 300
Mar → 600
```

Code:

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import sum

window = Window \
    .partitionBy("customer_id") \
    .orderBy("date") \
    .rowsBetween(
        Window.unboundedPreceding,
        Window.currentRow
    )

df.withColumn(
    "running_total",
    sum("amount").over(window)
)
```

### 57. Window `partitionBy()`

Do not confuse this with Spark's physical partitioning.

In:

```python
Window.partitionBy("customer_id")
```

we are saying:

> "Perform this window calculation separately for each customer."

Example:

```text
Customer 101
  Jan
  Feb
  Mar

Customer 102
  Jan
  Feb
```

The calculation resets for each customer.

**Important distinction:**

```python
Window.partitionBy()
```

≠

```python
df.repartition()
```

Window partitioning defines the **logical window grouping**.

`repartition()` controls **physical Spark data distribution**.

### 58. Window `orderBy()`

Defines the order in which Spark evaluates the window calculation.

Example:

```python
Window.partitionBy("customer_id") \
      .orderBy("transaction_date")
```

This means:

> For each customer, process rows in transaction-date order.

Very important for:

* `lag`
* `lead`
* `row_number`
* running totals
* rankings

### 59. Transformation vs Action

**Transformation:**

Creates a new DataFrame/RDD and builds the computation.

Examples:

```text
select()
filter()
withColumn()
groupBy()
join()
```

Example:

```python
df2 = df.filter(df.salary > 5000)
```

Nothing is actually executed yet.

**Action:**

Triggers Spark execution.

Examples:

```text
show()
count()
collect()
first()
write()
```

Example:

```python
df2.count()
```

Now Spark executes the required plan.

**Interview-ready answer:**

**Transformations define what processing needs to happen, while actions trigger execution and produce a result or write data.**

### 60. Lazy Evaluation

Spark transformations are **lazy**.

Example:

```python
df2 = df.filter(df.salary > 5000)

df3 = df2.select("name", "salary")

df3.show()
```

When you run:

```python
filter()
select()
```

Spark doesn't immediately process the data.

It builds a plan:

```text
Read
 ↓
Filter
 ↓
Select
```

Only when:

```python
show()
```

runs does Spark execute it.

**Why?:**

Because Spark can optimize the complete plan before execution.

For example:

```text
Read 100 columns
      ↓
Need only 2 columns
      ↓
Spark can potentially read only required columns
```

This is one reason lazy evaluation is powerful.

### 61. Narrow Transformation

A narrow transformation is one where each output partition depends on a **small number of input partitions**, typically one.

Examples:

```text
filter
select
withColumn
map
```

Conceptually:

```text
Input P1 ─────→ Output P1
Input P2 ─────→ Output P2
Input P3 ─────→ Output P3
```

No data needs to move between partitions.

Therefore:

**No shuffle.**

**Interview-ready answer:**

**A narrow transformation does not require data to be redistributed across partitions. Each output partition can be computed from a limited set of input partitions.**

### 62. Wide Transformation

A wide transformation requires data to be redistributed across partitions.

Examples:

```text
groupBy
join
distinct
orderBy
repartition
```

Example:

```python
df.groupBy("customer_id").count()
```

Spark needs all records belonging to the same customer to come together.

Therefore:

```text
Partition 1 ──┐
Partition 2 ──┼──→ Shuffle → New partitions
Partition 3 ──┤
Partition 4 ──┘
```

**Important:**

Wide transformations generally involve **shuffle**.

### 63. Shuffle

Shuffle means:

**Redistributing data across partitions.**
Suppose:

```text
P1: A B C
P2: A C D
P3: B D E
```

We do:

```python
groupBy("customer")
```

Spark needs all A records together, all B records together, etc.

So data moves:

```text
P1 ─┐
P2 ─┼──→ Shuffle ──→ New partition layout
P3 ─┘
```

**Why shuffle is expensive?:**

Because it may involve:

* Network transfer
* Serialization
* Disk I/O
* Memory usage
* Sorting/hashing
* Spill

**Interview-ready answer:**

**Shuffle is the process of redistributing data across partitions, usually because a computation such as groupBy or join requires related records to be colocated. Shuffle is expensive because it involves network and potentially disk I/O.**

### 64. DAG

DAG = **Directed Acyclic Graph**.

Spark represents the sequence/dependencies of transformations as a DAG.

Example:

```python
df2 = df.filter(...)
df3 = df2.select(...)
df4 = df3.groupBy(...)
df4.show()
```

Conceptually:

```text
Read
 ↓
Filter
 ↓
Select
 ↓
GroupBy
 ↓
Action
```

Spark's DAG Scheduler uses these dependencies to create stages.

**Why DAG?:**

It allows Spark to understand:

* What operations are required
* Dependencies between operations
* Where stages can be split
* How tasks should be scheduled

### 65. Job

A **Spark job is created when an action is triggered**.

Example:

```python
df.count()
```

This triggers a job.

Another:

```python
df.write.parquet(...)
```

also triggers a job.

**Example:**

```python
df.filter(...).count()
```

Conceptually:

```text
Action
  ↓
Job
  ↓
Stages
  ↓
Tasks
```

### 66. Stage

A Spark job is divided into **stages**.

The major boundary is usually a **shuffle**.

Example:

```text
Filter
  ↓
Select
  ↓
Shuffle
  ↓
GroupBy
  ↓
Action
```

Can conceptually become:

```text
Stage 1
Filter
Select
  ↓
Shuffle
  ↓
Stage 2
GroupBy
  ↓
Result
```

**Important:**

A stage contains tasks that can run in parallel.

### 67. Task

A task is the **smallest unit of execution sent to an executor**.

Typically:

> One task processes one partition for a stage.

Example:

```text
Stage
 ↓
Partition 1 → Task 1
Partition 2 → Task 2
Partition 3 → Task 3
Partition 4 → Task 4
```

These tasks can execute in parallel across executors.

**Very important relationship:**

```text
Job
 ↓
Stages
 ↓
Tasks
 ↓
Partitions
```

### 68. Lineage

Lineage describes how a DataFrame/RDD was derived from its source data.

Example:

```text
Raw Data
   ↓
filter
   ↓
select
   ↓
groupBy
   ↓
Result
```

Spark remembers these dependencies.

**Why useful?:**

For fault tolerance.

Suppose one partition is lost.

Spark can use lineage to recompute the missing data rather than necessarily recomputing the entire dataset.

**Interview-ready answer:**

**Lineage is the record of the transformations and dependencies used to derive a dataset. Spark uses lineage for fault recovery by recomputing lost partitions when necessary.**

### 69. What is a Partition?

A partition is a **logical chunk of distributed data**.

Suppose:

```text
1 million records
```

Spark may divide them into:

```text
P0 → 250K
P1 → 250K
P2 → 250K
P3 → 250K
```

Each partition can be processed independently.

Therefore:

```text
4 partitions
      ↓
4 tasks
```

for a stage processing those partitions.

**Important:**

A partition is **not necessarily a physical file**.

This is a common interview trap.

You can have:

```text
100 files
```

and:

```text
200 Spark partitions
```

or other relationships depending on how the data is read and processed.

### 70. `repartition()` vs `coalesce()`

Extremely important.

**`repartition()`:**

Changes the number/distribution of partitions and generally performs a **shuffle**.

```python
df2 = df.repartition(10)
```

Or partition by a column:

```python
df2 = df.repartition(
    10,
    "customer_id"
)
```

Data is redistributed.

**Use when::**

* You need more partitions
* You need better distribution
* You want to partition by a key
* You need to rebalance data

**`coalesce()`:**

Usually used to **reduce** the number of partitions with less/no full shuffle.

```python
df2 = df.coalesce(5)
```

Example:

```text
Before:

P1
P2
P3
P4
P5
P6
P7
P8

       ↓ coalesce(4)

P1
P2
P3
P4
```

It is generally more efficient than repartition when simply reducing partitions, because it avoids a full shuffle.

**Important limitation:**

Coalesce is mainly useful for **reducing** partitions.

If you need to increase partitions:

```python
repartition()
```

is the normal choice.

## Advance

> **🔴 PART 3 — PySpark ADVANCED** — Topics 71–100 (30 topics). Each topic covers what it is, why it's used, examples, production perspective, and an interview-ready answer.

### 71. Number of Partitions

A **partition** is a chunk of data that Spark processes independently.

Suppose:

```text
1 GB data
↓
4 partitions

P1 → 250 MB
P2 → 250 MB
P3 → 250 MB
P4 → 250 MB
```

Spark can create tasks to process these partitions in parallel.

```text
4 partitions
     ↓
4 tasks
```

**How to check:**

```python
df.rdd.getNumPartitions()
```

**Why number of partitions matters:**

Too few:

```text
Huge partitions
↓
Less parallelism
↓
Long-running tasks
```

Too many:

```text
Tiny partitions
↓
Too many tasks
↓
Scheduling overhead
↓
Small files
```

**Important:**

There is **no single perfect partition count**.

It depends on:

* Data size
* Cluster resources
* Operation
* File size
* Shuffle size

**Interview-ready answer:**

**The number of partitions controls the parallelism of Spark processing. Too few partitions can cause poor parallelism, while too many can create scheduling and overhead problems.**

### 72. `spark.sql.shuffle.partitions`

This controls the default number of partitions used by many Spark SQL/DataFrame shuffle operations.

Example:

```python
spark.conf.get("spark.sql.shuffle.partitions")
```

You can configure:

```python
spark.conf.set(
    "spark.sql.shuffle.partitions",
    200
)
```

Suppose:

```python
df.groupBy("customer_id").count()
```

A shuffle occurs.

The shuffle output may initially be divided into the configured number of shuffle partitions.

**Example:**

```text
spark.sql.shuffle.partitions = 200

GroupBy
   ↓
Shuffle
   ↓
200 shuffle partitions
```

**Important:**

This is **not the same as the number of input partitions**.

You might have:

```text
Input partitions = 50
Shuffle partitions = 200
```

**With AQE:**

AQE can dynamically coalesce shuffle partitions and make runtime adjustments, so the configured value is not necessarily the final number of partitions processed downstream.

**Interview-ready answer:**

**`spark.sql.shuffle.partitions` controls the default number of partitions for shuffle operations in Spark SQL. I tune it based on data volume and cluster size, while AQE can dynamically adjust the final partitioning.**

### 73. Shuffle Read vs Shuffle Write

This is important when reading Spark UI.

**Shuffle Write:**

During the shuffle-producing stage, Spark writes intermediate shuffle data.

```text
Stage 1
   ↓
Shuffle Write
   ↓
Shuffle files
```

Example:

```text
groupBy(customer_id)
```

Spark redistributes data and writes shuffle output.

**Shuffle Read:**

The next stage reads the shuffle data.

```text
Shuffle files
     ↓
Shuffle Read
     ↓
Stage 2
```

**Simple flow:**

```text
Stage 1
   |
   | Shuffle Write
   ↓
Intermediate shuffle data
   |
   | Shuffle Read
   ↓
Stage 2
```

**Production debugging:**

Suppose Spark UI shows:

```text
Task 1 → 100 MB
Task 2 → 120 MB
Task 3 → 110 MB
Task 4 → 800 GB
```

This is a strong indication of a **skew problem**.

### 74. Partition Pruning

Partition pruning means Spark avoids reading unnecessary table partitions based on a filter.

Suppose data is physically partitioned by:

```text
year
month
```

Directory:

```text
transactions/
├── year=2025/
│   ├── month=01/
│   ├── month=02/
│
└── year=2026/
    ├── month=01/
    ├── month=02/
```

Query:

```sql
SELECT *
FROM transactions
WHERE year = 2026
AND month = 1;
```

Spark can potentially read only:

```text
year=2026/month=01
```

instead of everything.

**Without pruning:**

```text
Read 5 TB
```

**With pruning:**

```text
Read 100 GB
```

Huge performance improvement.

**Important distinction:**

**Partition pruning ≠ data skipping.**

Partition pruning works at the **table partition/directory level**.

Data skipping can work using **file-level statistics**.

### 75. File Partitioning

This is about how data is physically organized into directories.

Example:

```python
df.write \
  .partitionBy("country") \
  .parquet("output")
```

Result:

```text
output/
├── country=India/
├── country=USA/
├── country=UK/
└── country=Canada/
```

Query:

```sql
WHERE country = 'India'
```

Spark can prune other directories.

**Good partition columns:**

Usually:

* Frequently filtered
* Reasonable number of distinct values

Good:

```text
date
year
month
country
```

Potentially bad:

```text
customer_id
transaction_id
```

because millions of distinct values can create enormous numbers of partitions/directories.

### 76. Small File Problem

One of the most common production problems in data lakes.

Suppose you have:

```text
1 TB data
```

but it is stored as:

```text
10 million files
```

with each file only around:

```text
100 KB
```

This is inefficient.

**Why?:**

Spark must perform:

* File listing
* File opening
* Metadata handling
* Task scheduling

for huge numbers of tiny files.

Instead, we'd prefer a reasonable number of larger files.

Conceptually:

```text
BAD

10 million × tiny files

GOOD

reasonable number × larger files
```

**Causes:**

Common causes:

* Excessive partitions
* Frequent small writes
* Streaming micro-batches
* Over-partitioning
* Bad partition columns

**Solutions:**

Depending on the storage/table technology:

* Compaction
* `coalesce()`
* `repartition()`
* Delta `OPTIMIZE`
* Better ingestion/write design

# 🚀 PERFORMANCE OPTIMIZATION

### 77. Cache vs Persist

Both are used to keep computed data for reuse.

Example:

```python
df.cache()
```

Then:

```python
df.count()
df.groupBy("dept").count()
df.filter(...).show()
```

The first action materializes the cache.

Later operations can reuse it instead of recomputing the lineage.

**`cache()`:**

Uses the default storage level.

```python
df.cache()
```

**`persist()`:**

Allows you to choose the storage level.

Conceptually:

```python
df.persist(...)
```

Possible storage levels include:

```text
MEMORY_ONLY
MEMORY_AND_DISK
DISK_ONLY
```

**Important:**

Caching is **lazy**.

This:

```python
df.cache()
```

doesn't immediately calculate everything.

An action must occur.

**When to cache?:**

Use when:

```text
Expensive DataFrame
       ↓
Used multiple times
```

Don't cache everything.

**Interview-ready answer:**

**Cache and persist are used to avoid recomputing a DataFrame that is reused multiple times. Cache uses the default storage level, while persist allows me to explicitly choose the storage level.**

### 78. Broadcast Join

Suppose:

```text
Transactions = 5 TB
Customers = 50 MB
```

A normal join might require expensive shuffling.

But if the smaller dataset fits within the broadcast constraints, Spark can broadcast it to executors.

```text
             Customers
               50 MB
                 |
        Broadcast to executors
       /          |          \
 Executor 1   Executor 2   Executor 3
      |            |           |
  Transactions  Transactions Transactions
```

Then each executor can join its local transaction data with the broadcast customer data.

**Code:**

```python
from pyspark.sql.functions import broadcast

result = transactions.join(
    broadcast(customers),
    "customer_id"
)
```

**Benefit:**

Avoids a large shuffle of the big table in suitable cases.

**Warning:**

Don't broadcast a huge dataset.

It can cause executor memory problems.

### 79. Join Strategies

Spark can use different physical strategies for joins.

Common ones include:

**1. Broadcast Hash Join:**

Small side is broadcast.

**2. Sort Merge Join:**

Both sides are shuffled and sorted by join key.

Very common for large-large joins.

**3. Shuffle Hash Join:**

Data is shuffled and hash-based joining is used under suitable conditions.

**4. Broadcast Nested Loop / Cartesian-related strategies:**

Used in specific join conditions and cases.

**How Spark chooses:**

Spark considers:

* Statistics
* Data size
* Join type
* Join condition
* Configuration
* AQE/runtime information

### 80. Sort Merge Join

Very important for large datasets.

Suppose:

```text
Transactions = 5 TB
Customers = 2 TB
```

Broadcasting isn't practical.

Spark may use:

```text
Transactions
     ↓
Shuffle by customer_id
     ↓
Sort
     ↓
Merge
```

and similarly for the other DataFrame.

Conceptually:

```text
Left                 Right
  ↓                     ↓
Shuffle               Shuffle
  ↓                     ↓
Sort                  Sort
  ↓                     ↓
       Merge Join
```

**Why expensive?:**

Because:

* Shuffle
* Network transfer
* Sorting
* Disk/memory usage

can all be involved.

**Interview-ready answer:**

**Sort Merge Join is commonly used when both sides of the join are large and cannot be efficiently broadcast. Spark shuffles both datasets by the join key, sorts them, and then merges matching records.**

### 81. Broadcast Hash Join

If one side is small:

```text
Large = 5 TB
Small = 20 MB
```

Spark can broadcast the small dataset.

```text
Small table
    ↓
Broadcast
 ↓   ↓   ↓
E1  E2  E3

Large data remains distributed
```

Each executor builds a hash structure from the broadcast data and performs the join locally.

**Main advantage:**

Avoids shuffling the large table.

### 82. Join Hints

Sometimes you want to influence Spark's join strategy.

Example:

```python
from pyspark.sql.functions import broadcast

df1.join(
    broadcast(df2),
    "id"
)
```

Spark SQL also supports hints.

Example:

```sql
SELECT /*+ BROADCAST(customers) */
       *
FROM transactions
JOIN customers
ON transactions.customer_id = customers.customer_id
```

**Important:**

Hints are **requests to the optimizer**, not magic guarantees in every situation.

Use them when you understand the data and execution plan.

### 83. Predicate Pushdown

Predicate = filtering condition.

Predicate pushdown means Spark/storage layer tries to apply the filter as close to the data source as possible.

Suppose:

```python
df.filter(df.salary > 10000)
```

Instead of:

```text
Read everything
 ↓
Filter
```

the source may be able to do:

```text
Read only relevant data
 ↓
Filter
```

For columnar formats like Parquet, this can significantly reduce I/O.

**Example:**

```text
5 TB Parquet
   ↓
salary > 10000
   ↓
Read less data
```

**Interview-ready answer:**

**Predicate pushdown means pushing filter conditions closer to the data source so that unnecessary data is not read or processed. This reduces I/O and improves performance.**

### 84. Column Pruning

Column pruning means Spark reads only the columns required by the query.

Suppose the file contains:

```text
100 columns
```

but your query needs:

```text
customer_id
amount
```

Spark can potentially read only those required columns, especially with columnar formats.

```text
100 columns
     ↓
Query needs 2
     ↓
Read 2 columns
```

**Why useful?:**

Less:

* Disk I/O
* Network transfer
* Memory usage
* Processing

### 85. Catalyst Optimizer

Catalyst is Spark SQL's query optimizer.

Suppose you write:

```python
df.filter(...)
  .select(...)
  .groupBy(...)
```

Spark doesn't simply execute each line independently.

It builds a plan.

Conceptually:

```text
PySpark / SQL
      ↓
Logical Plan
      ↓
Catalyst Optimizer
      ↓
Optimized Logical Plan
      ↓
Physical Plan
      ↓
Execution
```

Catalyst can perform optimizations such as:

* Predicate pushdown
* Column pruning
* Constant folding
* Join optimization
* Expression simplification

**Interview-ready answer:**

**Catalyst is Spark SQL's query optimization framework. It analyzes logical plans and applies optimization rules before producing a physical execution plan.**

### 86. Physical vs Logical Plan

This is an important interview concept.

**Logical Plan:**

Describes **what** you want to do.

Example:

```text
Read
 ↓
Filter
 ↓
Join
 ↓
Aggregate
```

It doesn't specify exactly how the computation will execute.

**Physical Plan:**

Describes **how Spark will execute it**.

For example:

```text
FileScan
 ↓
Filter
 ↓
BroadcastHashJoin
 ↓
HashAggregate
```

**Flow:**

```text
PySpark Code
     ↓
Logical Plan
     ↓
Catalyst
     ↓
Optimized Logical Plan
     ↓
Physical Plan
     ↓
Tasks
```

### 87. `explain()`

Used to inspect the execution plan.

```python
df.explain()
```

More detail:

```python
df.explain(True)
```

You may see:

```text
== Parsed Logical Plan ==
...

== Analyzed Logical Plan ==
...

== Optimized Logical Plan ==
...

== Physical Plan ==
...
```

**Why use it?:**

To understand:

* Is there a shuffle?
* Is Spark using broadcast?
* Is a filter pushed down?
* Is a Sort Merge Join being used?
* Is partition pruning happening?

**Production debugging:**

If a join is unexpectedly slow:

```python
df.explain(True)
```

may show:

```text
SortMergeJoin
```

when you expected a broadcast join.

That gives you a starting point for investigation.

### 88. Adaptive Query Execution — AQE

AQE is one of the most important advanced Spark concepts.

**AQE allows Spark to adjust parts of the execution plan using runtime statistics.**

Without AQE:

```text
Statistics before execution
       ↓
Plan
       ↓
Execute
```

With AQE:

```text
Initial Plan
     ↓
Execute stage
     ↓
Runtime statistics
     ↓
AQE analyzes actual data
     ↓
Adjust plan
     ↓
Continue execution
```

**Main capabilities:**

**1. Coalescing shuffle partitions:**

If you configured:

```text
2000 partitions
```

but many are tiny, AQE can combine them into fewer partitions.

**2. Skew handling:**

If a shuffle partition is extremely large, AQE can split skewed partitions in supported scenarios, particularly skewed joins.

**3. Dynamic join strategy changes:**

Runtime statistics can allow Spark to choose a better join strategy in supported cases.

**Interview-ready answer:**

**AQE, or Adaptive Query Execution, allows Spark to use runtime statistics to dynamically improve the execution plan. It can coalesce small shuffle partitions, handle supported skewed partitions, and adjust certain join strategies.**

### 89. What is Data Skew?

Data skew occurs when data is **unevenly distributed**.

Example:

```text
Customer A → 10 records
Customer B → 20 records
Customer C → 15 records
Customer X → 500 million records
```

If we do:

```python
groupBy("customer_id")
```

the hot customer can create a very large partition.

```text
P1 → 10 GB
P2 → 11 GB
P3 → 9 GB
P4 → 500 GB 🔴
```

Then:

```text
Task 1 → 2 min
Task 2 → 2 min
Task 3 → 2 min
Task 4 → 2 hours 🔴
```

The whole stage may wait for the slow task.

### 90. Detecting Data Skew

**Spark UI:**

Look at:

* Task duration
* Shuffle Read
* Shuffle Write
* Input size
* Records processed

Suppose:

```text
Task 1 → 100 MB
Task 2 → 120 MB
Task 3 → 110 MB
Task 4 → 500 GB
```

Strong skew signal.

**Data-level investigation:**

Check key frequency:

```python
df.groupBy("customer_id") \
  .count() \
  .orderBy("count", ascending=False) \
  .show()
```

You might discover:

```text
customer_id | count
------------|---------
999         | 500000000
101         | 1000
102         | 900
```

Customer 999 is a **hot key**.

### 91. Hot Keys

A hot key is a key that appears far more frequently than other keys.

Example:

```text
customer_id = 999
```

appears:

```text
500 million times
```

while normal customers appear:

```text
100–10,000 times
```

When Spark partitions by that key:

```text
hash(999)
    ↓
same partition
```

That partition becomes huge.

### 92. Salting

Salting is a technique for distributing records belonging to a hot key across multiple partitions.

Without salt:

```text
customer 999
     ↓
hash(999)
     ↓
one partition
     ↓
huge partition 🔴
```

With salt:

```text
999_0
999_1
999_2
999_3
999_4
```

Now the records can be distributed across multiple shuffle partitions.

**Important:**

Salt count is **not the same as Spark partition count**.

For example:

```text
Spark shuffle partitions = 200
Salt values = 10
```

They are separate concepts.

### 93. Salting for Joins

Suppose:

```text
Large table
customer 999 → 500 million records

Small table
customer 999 → 1 record
```

Normal join:

```text
999
 ↓
one hot partition
```

With salting:

**Large side:**

Add:

```text
salt = 0–9
```

So:

```text
999 + 0
999 + 1
...
999 + 9
```

**Small side:**

Replicate the matching key across salts:

```text
999 + 0
999 + 1
...
999 + 9
```

Then join using:

```text
customer_id + salt
```

This spreads the hot-key join workload.

**Important:**

Salting increases data volume on the small side because of replication, so it should be used selectively.

### 94. AQE Skew Handling

AQE can detect certain skewed shuffle partitions at runtime.

Conceptually:

```text
Shuffle
 ↓
Partition sizes known
 ↓
AQE detects:
P4 = extremely large
 ↓
Split P4
 ↓
Multiple tasks process pieces
```

Instead of:

```text
Task 4
500 GB
```

you might effectively get several smaller pieces processed in parallel.

**AQE vs Salting:**

| AQE                                     | Salting                              |
| --------------------------------------- | ------------------------------------ |
| Automatic/runtime                       | Manual                               |
| Uses runtime statistics                 | Changes data                         |
| No application-level key transformation | Requires salt column                 |
| Good first option for supported cases   | Useful when AQE isn't sufficient     |
| Particularly useful for skew joins      | Can handle specific hot-key patterns |

# 💻 ADVANCED PYSPARK / PRODUCTION

### 95. UDF vs Built-in Functions

UDF = **User Defined Function**.

Suppose you need custom logic:

```python
def classify_salary(salary):
    if salary > 10000:
        return "High"
    return "Low"
```

You can create a UDF.

But whenever possible, prefer Spark's built-in functions.

**Why?:**

Built-in functions are generally better optimized by Spark.

Example:

```python
when(col("salary") > 10000, "High") \
.otherwise("Low")
```

is generally preferable to a Python UDF for this simple logic.

**Why Python UDF can be slower:**

Data may need to cross between:

```text
JVM Spark process
       ↕
Python process
```

This creates serialization/communication overhead.

**Interview-ready answer:**

**I prefer built-in Spark functions over Python UDFs because Spark can optimize built-in expressions more effectively and Python UDFs can introduce serialization and Python-JVM communication overhead.**

### 96. Pandas UDF / Vectorized UDF

Pandas UDFs allow us to use Python/Pandas logic in a vectorized way.

Instead of processing:

```text
one row
one row
one row
```

vectorized processing works on batches/Series.

Conceptually:

```text
Traditional Python UDF

Row → Python
Row → Python
Row → Python

Pandas UDF

Batch → Python/Pandas
```

This can significantly reduce per-row overhead compared with standard Python UDFs.

**But:**

Still prefer built-in Spark functions when they can solve the problem.

### 97. `map()` vs `mapPartitions()`

Mostly discussed with RDDs.

**`map()`:**

Processes one record at a time.

```python
rdd.map(lambda x: x * 2)
```

Conceptually:

```text
Record 1 → function
Record 2 → function
Record 3 → function
```

**`mapPartitions()`:**

Processes an entire partition at once.

```python
rdd.mapPartitions(my_function)
```

Conceptually:

```text
Partition
   ↓
Function called once
   ↓
Process many records
```

**Why useful?:**

Suppose you need an expensive resource:

```text
Database connection
API client
```

With `map()` you might create it repeatedly.

With `mapPartitions()`:

```text
Partition
   ↓
Create connection once
   ↓
Process records
   ↓
Close connection
```

This can be much more efficient.

**Warning:**

External API/database calls from Spark need careful design because retries can cause duplicate requests.

### 98. Driver OOM / Executor OOM / Spill

Very important for production debugging.

**Driver OOM:**

Driver runs out of memory.

Common mistake:

```python
df.collect()
```

on a huge DataFrame.

```text
Huge distributed data
       ↓
collect()
       ↓
Driver
       ↓
💥 OOM
```

**Fix:**

Don't collect huge datasets.

Use:

```python
df.limit(100).show()
```

or aggregate before collecting.

**Executor OOM:**

An executor runs out of memory.

Possible causes:

* Huge partition
* Data skew
* Large broadcast
* Excessive caching
* Expensive operations
* Too much data processed by one task

**Spill:**

When Spark's memory isn't sufficient for an operation, some intermediate data can spill to disk.

Conceptually:

```text
Memory
  ↓
Not enough
  ↓
Spill
  ↓
Disk
```

Spilling prevents some failures but can significantly slow execution.

**Interview-ready answer:**

**Driver OOM usually happens when too much data is brought to the Driver, while Executor OOM occurs when an executor cannot handle its workload or memory requirements. Spill occurs when Spark writes intermediate data from memory to disk because available memory is insufficient.**

### 99. Incremental Processing, CDC, SCD & Upsert

These are extremely important Data Engineering concepts.

**Incremental Processing:**

Instead of processing the entire table every day:

```text
10 TB full table
↓
Process 10 TB daily
```

we process only new/changed records.

```text
10 TB historical
+
10 GB new data
↓
Process 10 GB
```

Much more efficient.

Common approaches:

```text
timestamp
watermark
CDC
change version
business date
```

**CDC:**

CDC = **Change Data Capture**

Captures:

```text
INSERT
UPDATE
DELETE
```

from a source system.

Example:

```text
Source DB
   ↓
CDC
   ↓
Data Lake
   ↓
Silver/Gold
```

**SCD:**

Slowly Changing Dimension.

**SCD Type 1:**

Overwrite old value.

```text
Before:
Amit | Chennai

After:
Amit | Mumbai
```

History is not retained.

**SCD Type 2:**

Maintain history.

```text
Amit | Chennai | 2025-01-01 | 2026-05-01
Amit | Mumbai  | 2026-05-01 | NULL
```

**Upsert:**

Upsert means:

```text
If record exists
    → UPDATE

If record doesn't exist
    → INSERT
```

Delta Lake commonly supports this pattern using `MERGE`.

Conceptually:

```text
Source
  ↓
MERGE
  ├── Match → UPDATE
  └── No match → INSERT
```

### 100. End-to-End Production PySpark Pipeline & Optimization

Now combine everything.

Imagine a banking pipeline.

```text
                 Source DB
                    ↓
                   CDC
                    ↓
               ADLS / S3
                    ↓
             Bronze / Raw
                    ↓
                 PySpark
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       Clean                Validate
          ↓                   ↓
          └─────────┬─────────┘
                    ↓
                 Silver
                    ↓
             Join / Aggregate
                    ↓
                  Gold
                    ↓
             BI / Analytics
```

**Example PySpark pipeline:**

**Step 1 — Read:**

```python
transactions = spark.read.parquet(
    "/data/bronze/transactions"
)
```

**Step 2 — Select required columns:**

```python
transactions = transactions.select(
    "transaction_id",
    "customer_id",
    "amount",
    "transaction_date"
)
```

This enables **column pruning**.

**Step 3 — Filter:**

```python
transactions = transactions.filter(
    col("amount") > 0
)
```

Potentially enables **predicate pushdown**, depending on the source/format and expression.

**Step 4 — Clean:**

```python
transactions = transactions.dropDuplicates(
    ["transaction_id"]
)
```

**Step 5 — Join dimension:**

If customers are small:

```python
result = transactions.join(
    broadcast(customers),
    "customer_id",
    "left"
)
```

Potentially avoids a large shuffle.

**Step 6 — Aggregate:**

```python
result = result.groupBy(
    "customer_id"
).agg(
    sum("amount").alias("total_amount")
)
```

This requires a shuffle.

**Step 7 — Check execution plan:**

```python
result.explain(True)
```

Look for:

```text
BroadcastHashJoin
```

or:

```text
SortMergeJoin
```

and identify expensive operations.

**Step 8 — Write:**

```python
result.write \
    .mode("append") \
    .parquet("/data/gold/customer_summary")
```

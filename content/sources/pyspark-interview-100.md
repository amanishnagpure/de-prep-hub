# 🟢 PART 1 — PySpark Fundamentals & DataFrames

## Questions 1–20

---

# 1. What is PySpark?

### 🎯 Interview Answer

> **PySpark is the Python API for Apache Spark. It allows us to process large amounts of data in a distributed manner using Python. Instead of processing the complete dataset on a single machine, Spark divides the data into partitions and processes them in parallel across multiple executors.**

### 💡 Simple Explanation

Suppose we have **1 TB of transaction data**.

Instead of:

```text
1 TB
 ↓
One machine
 ↓
Process everything
```

Spark can do:

```text
                 1 TB
                  ↓
        ┌─────────┼─────────┐
        ↓         ↓         ↓
      Node 1    Node 2    Node 3
        ↓         ↓         ↓
      Data      Data      Data
        └─────────┼─────────┘
                  ↓
               Result
```

### Why PySpark?

* Distributed processing
* Handles large datasets
* Parallel execution
* Fault tolerance
* DataFrame and SQL APIs
* Batch and streaming support
* Query optimization

### ⚠️ Important

PySpark is **not the processing engine itself**.

```text
Python
  ↓
PySpark API
  ↓
Apache Spark engine
  ↓
Cluster
```

---

# 2. What is the difference between Apache Spark and PySpark?

### 🎯 Interview Answer

> **Apache Spark is the distributed data-processing engine, while PySpark is the Python API used to interact with Spark. Spark provides the actual execution engine, and PySpark allows Python developers to use Spark's capabilities.**

### 💡 Simple

Think:

```text
Spark = Engine
PySpark = Python interface to the engine
```

For example:

```python
df.filter(df.salary > 5000)
```

This is PySpark code, but Spark executes the underlying distributed computation.

### Other Spark APIs

Spark can also be used through:

* Scala
* Java
* Python
* SQL

---

# 3. Why do we use PySpark for Data Engineering?

### 🎯 Interview Answer

> **We use PySpark when we need to process large datasets that cannot be efficiently handled on a single machine. It provides distributed processing, scalability, fault tolerance and optimization features, making it suitable for large-scale ETL pipelines.**

### Example

Suppose a bank receives:

```text
Daily transactions = 500 GB
```

Using a single-machine library may become difficult.

PySpark can distribute the processing.

### Typical DE pipeline

```text
Source DB
   ↓
ADLS / S3
   ↓
PySpark
   ↓
Clean
   ↓
Transform
   ↓
Join
   ↓
Aggregate
   ↓
Delta / Parquet
```

---

# 4. What are the main advantages of PySpark?

### 🎯 Interview Answer

> **The main advantages of PySpark are distributed processing, scalability, fault tolerance, lazy evaluation, query optimization, and support for DataFrames, SQL and streaming.**

### Main advantages

### 1. Distributed processing

Processes data across multiple machines.

### 2. Scalability

You can increase compute resources as data grows.

### 3. Fault tolerance

Spark can recompute lost data using lineage.

### 4. Lazy evaluation

Spark delays execution until an action is called.

### 5. Optimization

Spark has:

* Catalyst Optimizer
* Adaptive Query Execution
* Predicate Pushdown
* Column Pruning

### 6. Multiple APIs

You can use:

* DataFrame API
* SQL
* RDD API

---

# 5. What are the main components of Spark architecture?

### 🎯 Interview Answer

> **The main components of Spark architecture are the Driver, Executors and Cluster Manager. The Driver coordinates the application, Executors perform the actual tasks, and the Cluster Manager provides the required resources.**

### Architecture

```text
                 Driver
                   |
            Cluster Manager
                   |
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Executor 1  Executor 2  Executor 3
       ↓           ↓           ↓
     Tasks       Tasks       Tasks
       ↓           ↓           ↓
    Partitions  Partitions  Partitions
```

### Driver

Coordinates.

### Executor

Executes.

### Cluster Manager

Allocates resources.

---

# 6. What is a Driver in Spark?

### 🎯 Interview Answer

> **The Driver is the central coordinator of a Spark application. It runs the main application, creates the execution plan, divides the work into jobs, stages and tasks, and schedules those tasks on executors.**

### Think of Driver as

```text
Driver = Brain / Manager
```

It:

* Creates SparkSession
* Builds logical and physical plans
* Creates jobs
* Creates stages
* Schedules tasks
* Tracks execution

### Example

You write:

```python
df.filter(df.salary > 5000).count()
```

The Driver coordinates:

```text
Code
 ↓
Plan
 ↓
Job
 ↓
Stages
 ↓
Tasks
 ↓
Executors
```

### ⚠️ Common mistake

Don't say:

> "Driver processes all the data."

The Driver **coordinates** the distributed processing.

---

# 7. What is an Executor?

### 🎯 Interview Answer

> **An Executor is a worker process that runs tasks assigned by the Driver. Executors process data partitions and can also store cached or persisted data.**

### Architecture

```text
Driver
  |
  ├── Executor 1
  │      ├── Task
  │      └── Task
  |
  ├── Executor 2
  │      ├── Task
  │      └── Task
  |
  └── Executor 3
         ├── Task
         └── Task
```

### Executors perform

* Computation
* Shuffle processing
* Data reading/writing
* Caching/persisting

### Important

Driver:

> Coordinates

Executor:

> Executes

---

# 8. What is a Cluster Manager?

### 🎯 Interview Answer

> **A Cluster Manager is responsible for allocating resources such as CPU and memory to Spark applications and helping launch the required Spark processes.**

Common examples:

* YARN
* Kubernetes
* Spark Standalone

In Databricks, compute resources are managed through the Databricks platform.

### Simple analogy

```text
Cluster Manager
      ↓
"How much CPU and memory can this application use?"
```

---

# 9. What is SparkSession?

### 🎯 Interview Answer

> **SparkSession is the main entry point for modern Spark applications. It is used to create DataFrames, execute Spark SQL, read and write data, access configuration and interact with the Spark environment.**

### Creating SparkSession

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("EmployeePipeline") \
    .getOrCreate()
```

Then:

```python
df = spark.read.parquet("/data/employees")
```

And:

```python
spark.sql("SELECT * FROM employees")
```

### Conceptually

```text
SparkSession
   |
   ├── DataFrame API
   ├── Spark SQL
   ├── Catalog
   ├── Configuration
   └── SparkContext
```

---

# 10. What is SparkContext?

### 🎯 Interview Answer

> **SparkContext is the lower-level entry point that connects a Spark application with the cluster and coordinates the execution of Spark jobs. In modern PySpark applications, we normally work with SparkSession, which provides access to the underlying SparkContext.**

You can access it:

```python
spark.sparkContext
```

### SparkContext is historically associated with

* RDD operations
* Cluster communication
* Job coordination

### Important distinction

```text
SparkSession
     ↓
SparkContext
```

SparkSession is the modern higher-level entry point.

---

# 11. What is a DataFrame in PySpark?

### 🎯 Interview Answer

> **A PySpark DataFrame is a distributed collection of structured data organized into named columns. It is similar to a table in a database and provides a high-level API that Spark can optimize efficiently.**

Example:

```text
+---+------+------+
|id |name  |salary|
+---+------+------+
|1  |Amit  |5000  |
|2  |Rahul |7000  |
|3  |Neha  |9000  |
+---+------+------+
```

But internally, the data is distributed across Spark partitions.

### Why DataFrames are preferred

Spark knows:

```text
Column names
Data types
Expressions
Operations
```

Therefore it can optimize the query.

---

# 12. What is an RDD?

RDD = **Resilient Distributed Dataset**

### 🎯 Interview Answer

> **RDD is a low-level distributed data structure in Spark. It represents a collection of objects distributed across multiple partitions and provides fault tolerance through lineage.**

Example:

```python
rdd = spark.sparkContext.parallelize(
    [1, 2, 3, 4, 5]
)
```

Then:

```python
rdd.map(lambda x: x * 2)
```

### Three important words

**Resilient**

→ Fault tolerant

**Distributed**

→ Data distributed across partitions

**Dataset**

→ Collection of records

---

# 13. RDD vs DataFrame — what is the difference?

### 🎯 Interview Answer

> **RDD is a lower-level API that works with distributed objects, while DataFrame is a higher-level structured API with schema and named columns. DataFrames are generally preferred for ETL because Spark can optimize them using Catalyst and other execution optimizations.**

| RDD                                     | DataFrame         |
| --------------------------------------- | ----------------- |
| Low-level                               | High-level        |
| Objects                                 | Rows/columns      |
| No fixed schema                         | Has schema        |
| Less optimized                          | More optimized    |
| More control                            | Easier for ETL    |
| Usually slower for structured workloads | Usually preferred |

### Example

RDD:

```python
rdd.map(lambda x: ...)
```

DataFrame:

```python
df.filter(...)
```

### Interview tip

If asked:

> "Would you use RDD in a production ETL pipeline?"

Good answer:

> **For structured data processing, I would generally prefer DataFrames or Spark SQL because they allow Spark to optimize the query. I would use RDDs when I specifically need low-level control or when the processing doesn't fit naturally into the structured APIs.**

---

# 14. Why are DataFrames preferred over RDDs?

### 🎯 Interview Answer

> **DataFrames are preferred for most structured ETL workloads because they provide schema information and allow Spark's optimizer to optimize the query. They are generally easier to use and more efficient than manually working with RDDs.**

### Example

Suppose:

```text
5 TB transactions
```

You need:

```text
filter
join
aggregate
```

DataFrame:

```python
df.filter(...)
  .join(...)
  .groupBy(...)
```

Spark can analyze the complete query.

### Benefits

* Catalyst optimization
* Column pruning
* Predicate pushdown
* Efficient physical execution
* Easier syntax

---

# 15. What is schema in PySpark?

### 🎯 Interview Answer

> **Schema defines the structure of a DataFrame, including the column names and their data types. It tells Spark what kind of data each column contains.**

Example:

```text
root
 |-- customer_id: integer
 |-- name: string
 |-- salary: double
 |-- joining_date: date
```

### Why schema matters?

Without proper schema, you might have:

```text
salary = "5000"
```

instead of:

```text
salary = 5000.0
```

This can cause:

* Incorrect calculations
* Data quality problems
* Unexpected behavior

---

# 16. What are common PySpark data types?

### 🎯 Interview Answer

> **PySpark provides data types for primitive values as well as complex nested structures. Common types include StringType, IntegerType, LongType, DoubleType, BooleanType, DateType, TimestampType, ArrayType, StructType and MapType.**

### Common types

```text
StringType
IntegerType
LongType
FloatType
DoubleType
BooleanType
DateType
TimestampType
```

### Complex types

```text
ArrayType
StructType
MapType
```

Example:

```text
customer
 ├── id → Integer
 ├── name → String
 └── orders → Array
```

This is common with JSON data.

---

# 17. How do you create a DataFrame in PySpark?

There are several ways.

### From Python data

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

### From CSV

```python
df = spark.read.csv(
    "/data/employees.csv",
    header=True,
    inferSchema=True
)
```

### From JSON

```python
df = spark.read.json(
    "/data/employees.json"
)
```

### From Parquet

```python
df = spark.read.parquet(
    "/data/employees"
)
```

### From SQL

```python
df = spark.sql("""
    SELECT *
    FROM employees
""")
```

---

# 18. How do you define an explicit schema?

### 🎯 Interview Answer

> **We can define an explicit schema using StructType and StructField. In production pipelines, I prefer an explicit schema when the source structure is known because it provides predictable data types and avoids relying on schema inference.**

Example:

```python
from pyspark.sql.types import (
    StructType,
    StructField,
    IntegerType,
    StringType,
    DoubleType
)

schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("salary", DoubleType(), True)
])
```

Then:

```python
df = spark.read \
    .schema(schema) \
    .csv(
        "/data/employees.csv",
        header=True
    )
```

### Why explicit schema?

```text
Known schema
    ↓
Predictable ingestion
    ↓
Better data quality
    ↓
Fewer unexpected type problems
```

---

# 19. What is `inferSchema`?

### 🎯 Interview Answer

> **`inferSchema` tells Spark to inspect the input data and infer the data types of columns instead of treating everything as strings for formats such as CSV.**

Example:

```python
df = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \
    .csv("employees.csv")
```

Without inference, CSV data may initially be interpreted as strings.

With inference:

```text
"id"      → Integer
"salary"  → Double
"name"    → String
```

### ⚠️ Production consideration

Schema inference requires Spark to inspect the data and can be less predictable when source data changes.

For controlled production pipelines:

```text
Explicit schema
```

is often preferred.

---

# 20. Why is explicit schema preferred in production?

### 🎯 Interview Answer

> **Explicit schema is preferred in production because it makes the expected structure clear and predictable. It prevents unexpected type inference and helps detect bad or incompatible source data early.**

Suppose today the source contains:

```text
salary = 5000
```

Spark infers:

```text
Integer
```

Tomorrow source sends:

```text
salary = "unknown"
```

Inference can create unexpected behavior.

With an explicit schema:

```text
salary → Double
```

you have a clearly defined contract for the incoming data.

### Benefits

1. Predictable schema
2. Better data quality
3. Easier debugging
4. More reliable pipelines
5. Avoids unnecessary inference work

---

# 🧠 PART 1 — Quick Revision

You should be able to answer these quickly:

```text
PySpark
  ↓
Python API for Spark

Spark
  ↓
Distributed processing engine

Driver
  ↓
Coordinates

Executor
  ↓
Executes tasks

Cluster Manager
  ↓
Allocates resources

SparkSession
  ↓
Main entry point

DataFrame
  ↓
Structured distributed data

RDD
  ↓
Low-level distributed data

Schema
  ↓
Column names + data types
```

### ⭐ Most important interview distinctions

**Spark vs PySpark**

> Spark is the engine; PySpark is the Python API.

**Driver vs Executor**

> Driver coordinates; Executor executes.

**RDD vs DataFrame**

> RDD is low-level; DataFrame is structured and optimized.

**Schema vs `inferSchema`**

> Schema explicitly defines structure; `inferSchema` asks Spark to determine it from the input.

---

# 🟢 PART 2 — Questions 21–40

Next we'll cover the actual PySpark coding questions:

**21. Read CSV**
**22. Read JSON**
**23. Read Parquet**
**24. Write DataFrame**
**25. Write modes**
**26. `select()`**
**27. `filter()`**
**28. `filter()` vs `where()`**
**29. `withColumn()`**
**30. Rename/drop columns**
**31. `lit()`**
**32. `cast()`**
**33. `when()` / `otherwise()`**
**34. `distinct()`**
**35. `dropDuplicates()`**
**36. NULL handling**
**37. `dropna()` vs `fillna()`**
**38. `orderBy()` vs `sort()`**
**39. `groupBy()`**
**40. `agg()` and multiple aggregations**

These are the questions where we'll start writing **real PySpark code**, not just theory.

# 🟢 PART 2 — PySpark Coding & DataFrame Operations

## Questions 21–40

Now we move into the **hands-on PySpark questions**. These are very commonly asked in DE interviews, and you should be comfortable writing the code without looking at notes.

---

# 21. How do you read a CSV file using PySpark?

### 🎯 Interview Answer

> **We can use `spark.read.csv()` to read a CSV file. We can specify options such as whether the file has a header and whether Spark should infer the schema.**

### Basic

```python
df = spark.read.csv(
    "/data/employees.csv"
)
```

By default, Spark may treat columns as strings if schema inference isn't enabled.

### With header and schema inference

```python
df = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \
    .csv("/data/employees.csv")
```

### Better production approach

If schema is known:

```python
df = spark.read \
    .option("header", True) \
    .schema(employee_schema) \
    .csv("/data/employees.csv")
```

### Other useful options

```python
df = spark.read \
    .option("header", True) \
    .option("inferSchema", True) \
    .option("sep", ",") \
    .option("quote", '"') \
    .option("escape", '"') \
    .csv(path)
```

### Interview follow-up: CSV vs Parquet

> **CSV is a row-oriented text format and is commonly used for data exchange, while Parquet is a columnar format that is generally much more efficient for analytical processing.**

---

# 22. How do you read JSON using PySpark?

### 🎯 Interview Answer

> **We can use `spark.read.json()` to read JSON data. Spark automatically creates a schema based on the JSON structure unless we provide an explicit schema.**

```python
df = spark.read.json(
    "/data/customers.json"
)
```

For multiline JSON:

```python
df = spark.read \
    .option("multiline", True) \
    .json("/data/customers.json")
```

### Example JSON

```json
{
  "id": 101,
  "name": "Amit",
  "orders": [
    {"id": 1, "amount": 500},
    {"id": 2, "amount": 700}
  ]
}
```

Spark may create:

```text
id       → integer
name     → string
orders   → array<struct>
```

Then:

```python
df.select("id", "name")
```

and:

```python
df.select("orders")
```

---

# 23. How do you read Parquet using PySpark?

### 🎯 Interview Answer

> **We use `spark.read.parquet()` to read Parquet files. Parquet is a columnar format, so Spark can efficiently read only the required columns and can use file-level statistics for data skipping.**

```python
df = spark.read.parquet(
    "/data/transactions"
)
```

Select only required columns:

```python
df = spark.read.parquet(
    "/data/transactions"
).select(
    "customer_id",
    "amount"
)
```

### Why Parquet is popular?

Because it supports:

* Columnar storage
* Compression
* Predicate pushdown
* Column pruning
* Efficient analytical queries

### Interview answer

> **Parquet is generally preferred over CSV for large-scale analytical workloads because it is columnar, compressed and works efficiently with Spark's query optimization.**

---

# 24. How do you write a DataFrame?

### 🎯 Interview Answer

> **We use the DataFrame `write` API to write data to formats such as Parquet, JSON, CSV or Delta. We can also specify the write mode and partitioning.**

### Parquet

```python
df.write \
    .mode("overwrite") \
    .parquet("/output/employees")
```

### CSV

```python
df.write \
    .mode("overwrite") \
    .option("header", True) \
    .csv("/output/employees")
```

### JSON

```python
df.write \
    .mode("overwrite") \
    .json("/output/employees")
```

### Delta

```python
df.write \
    .format("delta") \
    .mode("append") \
    .save("/output/employees")
```

### Partitioned write

```python
df.write \
    .partitionBy("year", "month") \
    .parquet("/output/transactions")
```

---

# 25. What are the different write modes in PySpark?

There are four commonly used modes:

### 1. `append`

Adds new data.

```python
df.write \
    .mode("append") \
    .parquet(path)
```

Conceptually:

```text
Existing data
      +
New data
      ↓
Combined output
```

---

### 2. `overwrite`

Overwrites existing output according to the write semantics.

```python
df.write \
    .mode("overwrite") \
    .parquet(path)
```

---

### 3. `ignore`

If output already exists, Spark doesn't write.

```python
df.write \
    .mode("ignore") \
    .parquet(path)
```

---

### 4. `error` / `errorifexists`

Fails if the destination already exists.

```python
df.write \
    .mode("error") \
    .parquet(path)
```

### 🎯 Interview Answer

> **PySpark provides append, overwrite, ignore and error-if-exists write modes. Append adds data, overwrite replaces existing output according to the write operation, ignore skips the write if the destination exists, and error fails when the destination already exists.**

---

# 26. How do you select columns?

Use `select()`.

```python
df.select(
    "customer_id",
    "name",
    "salary"
)
```

Using expressions:

```python
from pyspark.sql.functions import col

df.select(
    col("name"),
    (col("salary") * 12).alias("annual_salary")
)
```

### Select all columns

```python
df.select("*")
```

### Select by expression

```python
df.select(
    col("customer_id"),
    col("amount"),
    (col("amount") * 0.18).alias("tax")
)
```

### 🎯 Interview Answer

> **`select()` is used to choose required columns or create column expressions. It returns a new DataFrame and is a transformation.**

---

# 27. How do you filter records?

Use `filter()`.

```python
df.filter(
    col("salary") > 5000
)
```

Multiple conditions:

```python
df.filter(
    (col("salary") > 5000) &
    (col("department") == "IT")
)
```

OR condition:

```python
df.filter(
    (col("salary") > 5000) |
    (col("department") == "IT")
)
```

### SQL-style condition

```python
df.filter(
    "salary > 5000"
)
```

### 🎯 Interview Answer

> **`filter()` is used to keep only the records that satisfy a condition. It is a transformation and does not execute immediately because Spark uses lazy evaluation.**

---

# 28. Difference between `filter()` and `where()`?

### 🎯 Interview Answer

> **There is no major functional difference between `filter()` and `where()` in the DataFrame API. Both are used to filter rows based on a condition. `where()` is essentially an alias for `filter()`.**

Both work:

```python
df.filter(col("salary") > 5000)
```

and:

```python
df.where(col("salary") > 5000)
```

### SQL-style

```python
df.filter("salary > 5000")
```

### Interview tip

Don't overthink this question.

Say:

> **They are functionally equivalent; I generally use `filter()` because it is more explicit in PySpark code.**

---

# 29. How do you add a new column?

Use `withColumn()`.

```python
df2 = df.withColumn(
    "annual_salary",
    col("salary") * 12
)
```

Input:

```text
salary
------
5000
7000
```

Output:

```text
salary | annual_salary
-------|--------------
5000   | 60000
7000   | 84000
```

### Add constant

```python
from pyspark.sql.functions import lit

df2 = df.withColumn(
    "country",
    lit("India")
)
```

### Important

DataFrames are immutable.

So:

```python
df.withColumn(...)
```

doesn't modify `df` in place.

You normally assign the result:

```python
df2 = df.withColumn(...)
```

---

# 30. How do you rename and drop columns?

## Rename

```python
df2 = df.withColumnRenamed(
    "salary",
    "monthly_salary"
)
```

### Drop

```python
df2 = df.drop("salary")
```

Multiple:

```python
df2 = df.drop(
    "salary",
    "age"
)
```

### Rename multiple columns

You can chain:

```python
df2 = df \
    .withColumnRenamed("id", "employee_id") \
    .withColumnRenamed("name", "employee_name")
```

### 🎯 Interview Answer

> **I use `withColumnRenamed()` to rename columns and `drop()` to remove columns. Both return a new DataFrame because Spark DataFrames are immutable.**

---

# 31. What is `lit()` and why is it used?

`lit()` means **literal value**.

It is used when you want to add a constant value to every row.

```python
from pyspark.sql.functions import lit

df.withColumn(
    "country",
    lit("India")
)
```

Result:

```text
id | name  | country
---|-------|--------
1  | Amit  | India
2  | Rahul | India
```

### Another example

```python
df.withColumn(
    "source_system",
    lit("CRM")
)
```

### Why use `lit()`?

Because Spark needs to know that `"India"` is a **constant value**, not a column name/expression.

### 🎯 Interview Answer

> **`lit()` is used to create a literal constant value in a DataFrame expression, for example adding a fixed source-system or country value to every row.**

---

# 32. How do you change a column's data type using `cast()`?

Use `cast()`.

Suppose:

```text
salary = "5000"
```

as a string.

Convert it:

```python
df2 = df.withColumn(
    "salary",
    col("salary").cast("double")
)
```

Other examples:

```python
col("id").cast("int")
```

```python
col("date").cast("date")
```

```python
col("amount").cast("decimal(18,2)")
```

### Why important?

Raw data often contains:

```text
"1000"
"2000"
"3000"
```

but analytical calculations need numeric types.

---

# 33. How do you implement IF/ELSE logic in PySpark?

Use:

```python
when()
otherwise()
```

Example:

```python
from pyspark.sql.functions import when, col

df.withColumn(
    "salary_category",
    when(col("salary") >= 10000, "High")
    .when(col("salary") >= 5000, "Medium")
    .otherwise("Low")
)
```

Result:

```text
salary | category
-------|---------
12000  | High
7000   | Medium
3000   | Low
```

### SQL equivalent

```sql
CASE
    WHEN salary >= 10000 THEN 'High'
    WHEN salary >= 5000 THEN 'Medium'
    ELSE 'Low'
END
```

### 🎯 Interview Answer

> **In PySpark, I use `when()` and `otherwise()` to implement conditional logic, similar to CASE WHEN in SQL.**

---

# 34. What is `distinct()`?

`distinct()` removes duplicate **complete rows**.

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
id | name
---|-----
1  | Amit
2  | Rahul
```

### Important

It considers the **entire row**.

If:

```text
1 Amit 5000
1 Amit 7000
```

these are different rows.

Therefore:

```python
df.distinct()
```

will keep both.

### Performance

`distinct()` generally requires data redistribution/shuffle because Spark has to identify duplicate records across partitions.

---

# 35. What is `dropDuplicates()`?

`dropDuplicates()` removes duplicates based on specified columns.

Example:

```python
df.dropDuplicates(
    ["customer_id"]
)
```

Suppose:

```text
customer_id | transaction_id | amount
------------|----------------|-------
101         | T1             | 500
101         | T2             | 700
102         | T3             | 300
```

After:

```python
df.dropDuplicates(["customer_id"])
```

one record for customer 101 is retained.

### Without specifying columns

```python
df.dropDuplicates()
```

is effectively duplicate removal based on the complete row.

### `distinct()` vs `dropDuplicates()`

| `distinct()`           | `dropDuplicates()`                 |
| ---------------------- | ---------------------------------- |
| Complete row           | Can specify columns                |
| Removes duplicate rows | Removes duplicates based on subset |
| No subset argument     | Supports subset                    |

### ⚠️ Important interview point

If the interviewer asks:

> "Which record will remain when there are multiple records for the same customer?"

Don't claim that `dropDuplicates()` gives you the latest record.

If you need the **latest record**, use a Window function:

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, col

window = Window \
    .partitionBy("customer_id") \
    .orderBy(col("updated_at").desc())

result = df.withColumn(
    "rn",
    row_number().over(window)
).filter(
    col("rn") == 1
).drop("rn")
```

That's the proper deterministic business logic.

---

# 36. How do you handle NULL values?

There are several approaches.

### Find NULLs

```python
df.filter(
    col("salary").isNull()
)
```

### Find non-NULLs

```python
df.filter(
    col("salary").isNotNull()
)
```

### Remove NULL rows

```python
df.dropna()
```

### Fill NULLs

```python
df.fillna({
    "salary": 0
})
```

### Conditional replacement

```python
df.withColumn(
    "salary",
    when(col("salary").isNull(), 0)
    .otherwise(col("salary"))
)
```

### Important

Don't automatically replace every NULL with zero.

For example:

```text
salary = NULL
```

could mean:

> Salary is unknown.

It does not necessarily mean:

> Salary = 0.

### 🎯 Interview Answer

> **I handle nulls based on business requirements. I can remove null records using `dropna()`, replace them using `fillna()`, or use conditional logic when different columns require different handling.**

---

# 37. Difference between `dropna()` and `fillna()`?

### `dropna()`

Removes rows containing null values.

```python
df.dropna()
```

Example:

```text
id | salary
---|-------
1  | 5000
2  | NULL
3  | 7000
```

Result:

```text
1 | 5000
3 | 7000
```

---

### `fillna()`

Replaces null values.

```python
df.fillna({
    "salary": 0
})
```

Result:

```text
1 | 5000
2 | 0
3 | 7000
```

### 🎯 Interview Answer

> **`dropna()` removes rows containing nulls, while `fillna()` replaces null values with a specified value. The choice depends on the business requirement.**

---

# 38. Difference between `orderBy()` and `sort()`?

In the DataFrame API, they are effectively aliases for sorting.

```python
df.orderBy("salary")
```

and:

```python
df.sort("salary")
```

both sort the DataFrame.

Descending:

```python
df.orderBy(
    col("salary").desc()
)
```

### Important performance point

A global sort can require a **shuffle**.

For a huge dataset:

```text
5 TB
 ↓
Global sorting
 ↓
Shuffle
 ↓
Sort
```

can be expensive.

### 🎯 Interview Answer

> **`orderBy()` and `sort()` provide the same DataFrame sorting functionality. For large datasets, sorting can be expensive because a global sort generally requires data redistribution and sorting across partitions.**

---

# 39. How does `groupBy()` work?

`groupBy()` groups records based on one or more columns.

Example:

```python
df.groupBy("department") \
  .count()
```

Suppose:

```text
dept
----
IT
HR
IT
Finance
IT
```

Result:

```text
IT       3
HR       1
Finance  1
```

### Aggregation example

```python
df.groupBy("department") \
  .sum("salary")
```

### Internally

This is very important.

Suppose data is:

```text
Partition 1
IT
HR

Partition 2
IT
Finance

Partition 3
IT
HR
```

For aggregation, Spark needs related keys together.

So it performs:

```text
Input Partitions
      ↓
    Shuffle
      ↓
Same keys together
      ↓
Aggregation
```

Therefore `groupBy()` is generally a **wide transformation**.

### 🎯 Interview Answer

> **`groupBy()` groups records based on one or more columns and is usually followed by an aggregation. Because records with the same grouping key may exist in different partitions, Spark generally performs a shuffle, making it a wide operation.**

---

# 40. How do you perform multiple aggregations using `agg()`?

Use:

```python
groupBy()
.agg()
```

Example:

```python
from pyspark.sql.functions import (
    count,
    sum,
    avg,
    min,
    max
)

result = df.groupBy("department").agg(
    count("*").alias("employee_count"),
    sum("salary").alias("total_salary"),
    avg("salary").alias("average_salary"),
    min("salary").alias("minimum_salary"),
    max("salary").alias("maximum_salary")
)
```

Result:

```text
department | employee_count | total_salary | average_salary
-----------|----------------|--------------|---------------
IT         | 10             | 80000        | 8000
HR         | 5              | 35000        | 7000
```

### Why `agg()`?

It lets us perform multiple aggregations in one operation.

### Production example

Suppose you're building a customer summary:

```text
customer_id
total_transactions
total_amount
average_amount
maximum_transaction
minimum_transaction
```

You can calculate all of them together:

```python
customer_summary = transactions \
    .groupBy("customer_id") \
    .agg(
        count("*").alias("transaction_count"),
        sum("amount").alias("total_amount"),
        avg("amount").alias("avg_amount"),
        max("amount").alias("max_amount")
    )
```

---

# 🧠 PART 2 — Most Important Concepts

After Questions 21–40, make sure these are crystal clear:

### Reading

```text
spark.read.csv()
spark.read.json()
spark.read.parquet()
```

### Writing

```text
df.write
.mode()
.partitionBy()
```

### Transformation

```text
select()
filter()
where()
withColumn()
drop()
withColumnRenamed()
groupBy()
```

### Data cleaning

```text
cast()
when()
otherwise()
distinct()
dropDuplicates()
dropna()
fillna()
```

### Aggregation

```text
groupBy()
agg()
count()
sum()
avg()
min()
max()
```

### And the critical Spark connection:

```text
groupBy()
   ↓
Wide Transformation
   ↓
Shuffle
   ↓
New Shuffle Partitions
   ↓
Aggregation
```

This connection becomes **extremely important** when we reach **joins, partitioning, data skew and Spark optimization**.

---

# 🔥 Next: Questions 41–60

We'll cover:

**41. `countDistinct()`**
**42. `collect_list()`**
**43. `collect_set()`**
**44. `explode()`**
**45. Array & Struct operations**
**46. Nested JSON**
**47. Spark SQL**
**48. Join types**
**49. Inner Join**
**50. Left/Right/Full Join**
**51. Semi Join**
**52. Anti Join**
**53. Cross Join**
**54. Multiple-column joins**
**55. Different column-name joins**
**56. Window Functions**
**57. `row_number()`**
**58. `rank()`**
**59. `dense_rank()`**
**60. `lag()` / `lead()`**

These are particularly important because **joins + window functions + aggregations** make up a huge portion of practical PySpark interview coding.

# PySpark Interview Questions — 41 to 60

## 41. What is `countDistinct()` in PySpark?

### 🎯 Interview-ready answer

`countDistinct()` is used to count the **number of unique values** in a column.

It is commonly used with `groupBy()` when we want the distinct count for each group.

### Example

```python
from pyspark.sql.functions import countDistinct

df.groupBy("dept").agg(
    countDistinct("employee_id").alias("unique_employees")
)
```

If data is:

| dept | employee_id |
| ---- | ----------: |
| IT   |         101 |
| IT   |         102 |
| IT   |         101 |
| HR   |         103 |

Output:

| dept | unique_employees |
| ---- | ---------------: |
| IT   |                2 |
| HR   |                1 |

### Important

```python
count("employee_id")
```

counts rows/non-null values.

```python
countDistinct("employee_id")
```

counts **unique** values.

---

# 42. What is `collect_list()`?

### 🎯 Interview-ready answer

`collect_list()` collects multiple values from different rows into a **single array**, and it **keeps duplicates**.

### Example

```python
from pyspark.sql.functions import collect_list

df.groupBy("dept").agg(
    collect_list("employee_name").alias("employees")
)
```

Input:

| dept | employee_name |
| ---- | ------------- |
| IT   | Rahul         |
| IT   | Amit          |
| IT   | Rahul         |
| HR   | Priya         |

Output:

| dept | employees            |
| ---- | -------------------- |
| IT   | [Rahul, Amit, Rahul] |
| HR   | [Priya]              |

Notice that `Rahul` appears twice.

### Interview point

> `collect_list()` preserves duplicate values.

---

# 43. What is `collect_set()`?

### 🎯 Interview-ready answer

`collect_set()` collects values into an array but **removes duplicates**.

### Example

```python
from pyspark.sql.functions import collect_set

df.groupBy("dept").agg(
    collect_set("employee_name").alias("employees")
)
```

Output:

| dept | employees     |
| ---- | ------------- |
| IT   | [Rahul, Amit] |
| HR   | [Priya]       |

### `collect_list()` vs `collect_set()`

|            | collect_list   | collect_set    |
| ---------- | -------------- | -------------- |
| Duplicates | Keeps          | Removes        |
| Result     | Array          | Array          |
| Order      | Not guaranteed | Not guaranteed |

### 🎯 Interview line

> `collect_list()` keeps duplicates, while `collect_set()` removes duplicates.

---

# 44. What is `explode()` in PySpark?

### 🎯 Interview-ready answer

`explode()` converts each element of an **array or map into a separate row**.

It is very useful when working with nested JSON data.

### Example

Suppose:

```text
id    skills
1     [Python, SQL, Spark]
2     [Java, Spring]
```

Use:

```python
from pyspark.sql.functions import explode

df.select(
    "id",
    explode("skills").alias("skill")
)
```

Output:

| id | skill  |
| -- | ------ |
| 1  | Python |
| 1  | SQL    |
| 1  | Spark  |
| 2  | Java   |
| 2  | Spring |

### Simple understanding

Before:

```text
1 → [Python, SQL, Spark]
```

After:

```text
1 → Python
1 → SQL
1 → Spark
```

### Production example

An API returns:

```json
{
  "customer_id": 101,
  "transactions": [
    {"amount": 500},
    {"amount": 1000}
  ]
}
```

We can use `explode()` to convert the transaction array into individual rows.

---

# 45. How do you work with Array and Struct columns?

### 🎯 Interview-ready answer

PySpark provides functions and column notation to access and manipulate nested **Array** and **Struct** columns.

### Struct example

Suppose:

```text
customer
 ├── name
 └── age
```

We can access:

```python
df.select("customer.name", "customer.age")
```

or:

```python
df.select(
    col("customer.name").alias("name")
)
```

### Array example

Suppose:

```text
skills = [Python, SQL, Spark]
```

Get the first element:

```python
df.select(col("skills")[0])
```

Explode it:

```python
df.select(explode("skills").alias("skill"))
```

### Common functions

```python
explode()
size()
array_contains()
element_at()
```

### Interview line

> Struct represents nested fields, while Array represents multiple values inside a column. PySpark provides functions to access, transform, and explode these nested structures.

---

# 46. How do you handle nested JSON in PySpark?

### 🎯 Interview-ready answer

PySpark can automatically infer nested JSON structures or we can define an explicit schema.

For example:

```json
{
  "id": 101,
  "customer": {
    "name": "Rahul",
    "city": "Chennai"
  },
  "orders": [
    {"amount": 500},
    {"amount": 1000}
  ]
}
```

Read it:

```python
df = spark.read.json("/data/orders.json")
```

Access nested fields:

```python
df.select(
    "id",
    "customer.name",
    "customer.city"
)
```

Explode orders:

```python
df.select(
    "id",
    explode("orders").alias("order")
)
```

Then:

```python
df.select(
    "id",
    "order.amount"
)
```

### Production use

API responses frequently contain nested JSON. In a data pipeline:

```text
API
 ↓
JSON
 ↓
PySpark
 ↓
Flatten nested structures
 ↓
Delta/Parquet
```

---

# 47. What is Spark SQL?

### 🎯 Interview-ready answer

Spark SQL allows us to use **SQL queries to process Spark DataFrames and tables**.

First create a temporary view:

```python
df.createOrReplaceTempView("employees")
```

Then:

```python
result = spark.sql("""
    SELECT dept, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept
""")
```

### DataFrame API vs Spark SQL

DataFrame API:

```python
df.groupBy("dept").avg("salary")
```

Spark SQL:

```sql
SELECT dept, AVG(salary)
FROM employees
GROUP BY dept
```

Both are executed by Spark's SQL engine and benefit from Spark's optimizer.

### Interview line

> Spark SQL provides a SQL interface for querying structured data in Spark.

---

# 48. What are the different types of joins in PySpark?

### 🎯 Interview-ready answer

Common PySpark joins are:

1. **Inner Join**
2. **Left Join**
3. **Right Join**
4. **Full Outer Join**
5. **Left Semi Join**
6. **Left Anti Join**
7. **Cross Join**

Example:

```python
df1.join(df2, df1.id == df2.id, "inner")
```

### Quick understanding

```text
Inner       → matching records
Left        → all left + matching right
Right       → all right + matching left
Full        → everything from both
Semi        → left records having a match
Anti        → left records having NO match
Cross       → every combination
```

---

# 49. What is an Inner Join?

### 🎯 Interview-ready answer

An **Inner Join returns only records that have matching keys in both DataFrames**.

Example:

Employees:

| id | name  |
| -: | ----- |
|  1 | Amit  |
|  2 | Rahul |
|  3 | Priya |

Departments:

| id | dept    |
| -: | ------- |
|  1 | IT      |
|  2 | HR      |
|  4 | Finance |

Code:

```python
employees.join(
    departments,
    employees.id == departments.id,
    "inner"
)
```

Result:

| id | name  | dept |
| -: | ----- | ---- |
|  1 | Amit  | IT   |
|  2 | Rahul | HR   |

ID 3 and ID 4 are removed because they don't have matches on both sides.

### Interview line

> Inner join returns only matching records from both DataFrames.

---

# 50. Explain Left, Right and Full Outer Join.

## Left Join

### 🎯 Interview-ready answer

A **Left Join returns all records from the left DataFrame and matching records from the right DataFrame**.

```python
df1.join(df2, df1.id == df2.id, "left")
```

If there is no match, right-side columns become `NULL`.

---

## Right Join

Returns:

> All records from the right DataFrame + matching records from the left.

```python
df1.join(df2, df1.id == df2.id, "right")
```

---

## Full Outer Join

Returns:

> All records from both DataFrames.

```python
df1.join(df2, df1.id == df2.id, "full")
```

Non-matching columns become `NULL`.

### Easy memory trick

```text
LEFT  → protect left table
RIGHT → protect right table
FULL  → protect both tables
```

---

# 51. What is a Left Semi Join?

### 🎯 Interview-ready answer

A **Left Semi Join returns records from the left DataFrame that have at least one matching record in the right DataFrame**.

But it returns **only columns from the left DataFrame**.

```python
df1.join(
    df2,
    df1.id == df2.id,
    "left_semi"
)
```

### Example

Customers:

| id | name  |
| -: | ----- |
|  1 | Amit  |
|  2 | Rahul |
|  3 | Priya |

Orders:

| customer_id |
| ----------: |
|           1 |
|           3 |

Result:

| id | name  |
| -: | ----- |
|  1 | Amit  |
|  3 | Priya |

### Important

Semi join answers:

> "Which records from my left table have a match?"

It does **not** return columns from the right table.

---

# 52. What is a Left Anti Join?

### 🎯 Interview-ready answer

A **Left Anti Join returns records from the left DataFrame that do NOT have a matching record in the right DataFrame**.

```python
df1.join(
    df2,
    df1.id == df2.id,
    "left_anti"
)
```

Example:

Customers:

```text
1 Amit
2 Rahul
3 Priya
```

Orders:

```text
1
3
```

Result:

```text
2 Rahul
```

### Production use

Very common in **data reconciliation**.

For example:

```text
Source customers
        ↓
Target customers
```

Find records present in source but missing in target:

```python
source.join(
    target,
    source.customer_id == target.customer_id,
    "left_anti"
)
```

### Interview line

> Left anti join is commonly used to find records that exist in the left dataset but are missing from the right dataset.

---

# 53. What is a Cross Join?

### 🎯 Interview-ready answer

A **Cross Join creates every possible combination of rows between two DataFrames**.

If:

```text
df1 = 3 rows
df2 = 4 rows
```

Result:

```text
3 × 4 = 12 rows
```

Example:

```python
df1.crossJoin(df2)
```

### Example

Products:

```text
A
B
```

Locations:

```text
Chennai
Delhi
Mumbai
```

Cross join:

```text
A Chennai
A Delhi
A Mumbai
B Chennai
B Delhi
B Mumbai
```

### ⚠️ Important

Cross joins can generate a **huge number of records**, so they should be used carefully.

---

# 54. How do you join on multiple columns?

### 🎯 Interview-ready answer

We can provide multiple join conditions using `&`.

Example:

```python
df1.join(
    df2,
    (df1.customer_id == df2.customer_id) &
    (df1.date == df2.date),
    "inner"
)
```

This means:

```text
customer_id must match
AND
date must match
```

### Alternative

If both DataFrames have the same column names:

```python
df1.join(
    df2,
    ["customer_id", "date"],
    "inner"
)
```

This is cleaner.

### Interview line

> For multiple-column joins, I either pass a list of common column names or combine multiple conditions using `&`.

---

# 55. How do you join DataFrames when column names are different?

Suppose:

```text
df1 → customer_id
df2 → cust_id
```

We can explicitly specify the condition:

```python
df1.join(
    df2,
    df1.customer_id == df2.cust_id,
    "inner"
)
```

If we don't want duplicate join columns:

```python
result = df1.join(
    df2,
    df1.customer_id == df2.cust_id,
    "inner"
).select(
    df1["*"],
    df2["customer_name"]
)
```

### Interview line

> When join-column names are different, I specify the join condition explicitly instead of passing a list of column names.

---

# 56. What is a Window Function in PySpark?

### 🎯 Interview-ready answer

A **Window Function performs calculations across related rows without collapsing those rows into a single row**.

This is the major difference between:

```text
GROUP BY
```

and:

```text
WINDOW FUNCTION
```

### Example

Suppose:

| dept | employee | salary |
| ---- | -------- | -----: |
| IT   | Amit     |   8000 |
| IT   | Rahul    |   6000 |
| HR   | Priya    |   7000 |

We want to rank employees within each department.

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import row_number

window = Window.partitionBy("dept").orderBy("salary")

df.withColumn(
    "rank",
    row_number().over(window)
)
```

Output:

| dept | employee | salary | rank |
| ---- | -------- | -----: | ---: |
| IT   | Rahul    |   6000 |    1 |
| IT   | Amit     |   8000 |    2 |
| HR   | Priya    |   7000 |    1 |

### Important

`partitionBy()` here is **window partitioning**.

It is different from Spark's physical DataFrame partitioning.

---

# 57. What is `row_number()`?

### 🎯 Interview-ready answer

`row_number()` assigns a **unique sequential number** to each row within a window partition.

Example:

```python
window = Window.partitionBy("dept").orderBy(
    col("salary").desc()
)

df.withColumn(
    "row_num",
    row_number().over(window)
)
```

Output:

| dept | employee | salary | row_num |
| ---- | -------- | -----: | ------: |
| IT   | Amit     |   8000 |       1 |
| IT   | Rahul    |   6000 |       2 |

### Most common use

Finding the **latest record per customer**.

```python
window = Window.partitionBy("customer_id") \
               .orderBy(col("updated_at").desc())

df.withColumn(
    "rn",
    row_number().over(window)
).filter("rn = 1")
```

This is extremely common in DE interviews.

---

# 58. What is `rank()`?

### 🎯 Interview-ready answer

`rank()` assigns the same rank to rows having the same ordering value, and **leaves gaps after ties**.

Example salaries:

```text
10000
10000
8000
7000
```

Using `rank()`:

```text
10000 → 1
10000 → 1
8000  → 3
7000  → 4
```

Code:

```python
from pyspark.sql.functions import rank

window = Window.orderBy(col("salary").desc())

df.withColumn(
    "rank",
    rank().over(window)
)
```

### Key point

Because two employees are ranked `1`, the next rank becomes `3`.

---

# 59. What is `dense_rank()`?

### 🎯 Interview-ready answer

`dense_rank()` is similar to `rank()`, but **does not leave gaps after ties**.

For:

```text
10000
10000
8000
7000
```

`dense_rank()` gives:

```text
10000 → 1
10000 → 1
8000  → 2
7000  → 3
```

### `rank()` vs `dense_rank()` vs `row_number()`

| Function       | Duplicate values    | Example    |
| -------------- | ------------------- | ---------- |
| `row_number()` | Unique number       | 1, 2, 3, 4 |
| `rank()`       | Same rank + gaps    | 1, 1, 3, 4 |
| `dense_rank()` | Same rank + no gaps | 1, 1, 2, 3 |

### 🎯 Easy interview memory

```text
row_number → always unique
rank       → gaps after ties
dense_rank → no gaps after ties
```

---

# 60. What are `lag()` and `lead()`?

### 🎯 Interview-ready answer

`lag()` and `lead()` allow us to access a **previous or next row's value** within a window.

### `lag()`

Gets the value from a previous row.

```python
from pyspark.sql.functions import lag

window = Window.partitionBy("customer_id") \
               .orderBy("transaction_date")

df.withColumn(
    "previous_amount",
    lag("amount").over(window)
)
```

Example:

| date  | amount | previous_amount |
| ----- | -----: | --------------: |
| Jan 1 |    500 |            NULL |
| Jan 2 |    800 |             500 |
| Jan 3 |    600 |             800 |

---

### `lead()`

Gets the value from the next row.

```python
from pyspark.sql.functions import lead

df.withColumn(
    "next_amount",
    lead("amount").over(window)
)
```

Output:

| date  | amount | next_amount |
| ----- | -----: | ----------: |
| Jan 1 |    500 |         800 |
| Jan 2 |    800 |         600 |
| Jan 3 |    600 |        NULL |

### Production examples

`lag()` is commonly used for:

* Previous transaction amount
* Previous day's sales
* Change from previous month
* Detecting changes in customer status
* SCD/CDC processing

For example:

```python
current_amount - previous_amount
```

can calculate the change between consecutive transactions.

### 🎯 Interview line

> `lag()` accesses a previous row and `lead()` accesses a following row based on the window ordering.

---

## 🔥 Most important from Q41–60

For a DE2 interview, make sure these are very strong:

**Must know:**

* `explode()`
* Nested JSON
* Join types
* Semi Join vs Anti Join
* Multiple-column joins
* Window Functions
* `row_number()`
* `rank()` vs `dense_rank()`
* `lag()` vs `lead()`

Especially remember:

```text
row_number → unique
rank       → gaps
dense_rank → no gaps

lag        → previous row
lead       → next row

semi       → matching left records
anti       → non-matching left records
```

**Next: Q61–80** will move into **aggregations, transformations/actions, lazy evaluation, narrow vs wide transformations, shuffle, DAG, stages, tasks and lineage** — these are much more important for Spark DE2 interviews.

# PySpark Interview Questions — 61 to 80

## 61. What is `groupBy()` vs Window Function?

### 🎯 Interview-ready answer

The main difference is that **`groupBy()` reduces multiple rows into fewer rows**, while a **Window Function keeps the original rows**.

### `groupBy()`

```python
df.groupBy("dept").agg(
    avg("salary").alias("avg_salary")
)
```

Input:

| dept | salary |
| ---- | -----: |
| IT   |   8000 |
| IT   |   6000 |
| HR   |   7000 |

Output:

| dept | avg_salary |
| ---- | ---------: |
| IT   |       7000 |
| HR   |       7000 |

The employee-level rows are gone.

### Window

```python
window = Window.partitionBy("dept")

df.withColumn(
    "avg_salary",
    avg("salary").over(window)
)
```

Output:

| dept | salary | avg_salary |
| ---- | -----: | ---------: |
| IT   |   8000 |       7000 |
| IT   |   6000 |       7000 |
| HR   |   7000 |       7000 |

### Easy memory

> **GROUP BY collapses rows; Window Functions calculate across rows while keeping them.**

---

# 62. What is the difference between `count()`, `countDistinct()` and `approx_count_distinct()`?

### 🎯 Interview-ready answer

* `count()` → counts records/non-null values.
* `countDistinct()` → exact count of unique values.
* `approx_count_distinct()` → approximate unique count, usually using less memory and potentially being faster for very large datasets.

```python
from pyspark.sql.functions import (
    count,
    countDistinct,
    approx_count_distinct
)

df.agg(
    count("customer_id"),
    countDistinct("customer_id"),
    approx_count_distinct("customer_id")
)
```

### Production example

If we have billions of customer events and only need an approximate number of unique customers for analytics, `approx_count_distinct()` can be useful.

### Interview line

> Use `countDistinct()` when exactness is required and `approx_count_distinct()` when an approximate result is acceptable for large-scale analytics.

---

# 63. What is the difference between `sum()`, `avg()`, `min()` and `max()`?

These are standard aggregation functions.

```python
from pyspark.sql.functions import sum, avg, min, max

df.groupBy("dept").agg(
    sum("salary").alias("total_salary"),
    avg("salary").alias("avg_salary"),
    min("salary").alias("min_salary"),
    max("salary").alias("max_salary")
)
```

Example:

| dept | total_salary | avg_salary | min_salary | max_salary |
| ---- | -----------: | ---------: | ---------: | ---------: |
| IT   |        14000 |       7000 |       6000 |       8000 |

### Interview line

> These functions are used with aggregations to calculate summary statistics over groups of records.

---

# 64. What are transformations in PySpark?

### 🎯 Interview-ready answer

A **transformation creates a new DataFrame/RDD from an existing one without immediately executing the computation**.

Examples:

```python
select()
filter()
withColumn()
drop()
groupBy()
join()
orderBy()
```

Example:

```python
df2 = df.filter(col("salary") > 5000)
```

Spark does not immediately process all data.

It builds the execution plan.

### Important

Transformations are generally **lazy**.

---

# 65. What are actions in PySpark?

### 🎯 Interview-ready answer

An **action triggers the actual execution of the Spark job** and usually returns a result or writes data.

Common actions include:

```python
count()
collect()
show()
first()
take()
write
```

Example:

```python
df2 = df.filter(col("salary") > 5000)

df2.count()
```

The `filter()` builds the transformation plan.

`count()` triggers execution.

### Easy memory

```text
Transformation → Build the plan
Action          → Execute the plan
```

---

# 66. What is Lazy Evaluation in Spark?

### 🎯 Interview-ready answer

Lazy evaluation means Spark **does not execute transformations immediately**.

Instead, Spark records the transformations and builds an execution plan. When an action is called, Spark optimizes and executes that plan.

Example:

```python
df2 = df.filter(col("salary") > 5000)
df3 = df2.select("name", "salary")

df3.show()
```

Before `show()`:

```text
filter
  ↓
select
```

Spark has mainly built the plan.

When `show()` runs:

```text
Logical Plan
     ↓
Optimization
     ↓
Physical Plan
     ↓
Execution
```

### Why is lazy evaluation useful?

Spark can optimize the entire chain instead of executing every operation separately.

### 🎯 Interview line

> Lazy evaluation allows Spark to optimize a series of transformations before actually executing them.

---

# 67. What is a DAG in Spark?

### 🎯 Interview-ready answer

DAG stands for **Directed Acyclic Graph**.

Spark represents the sequence and dependencies of transformations as a DAG before execution.

Example:

```python
df2 = df.filter(col("salary") > 5000)
df3 = df2.select("name", "salary")
df4 = df3.groupBy("name").count()

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

Spark's scheduler uses these dependencies to divide the work into stages.

### Interview line

> A DAG represents the sequence of transformations and their dependencies that Spark uses to create an execution plan.

---

# 68. What is a Job in Spark?

### 🎯 Interview-ready answer

A **Spark Job is created when an action is triggered**.

For example:

```python
df.count()
```

can trigger a Spark job.

Another action:

```python
df.show()
```

can trigger another job.

So:

```text
Transformation
Transformation
Transformation
       ↓
     Action
       ↓
     Job
```

### Important

One application can contain **multiple jobs**.

Example:

```python
df.count()   # Job 1
df.show()    # Job 2
df.write...  # Job 3
```

---

# 69. What is a Stage in Spark?

### 🎯 Interview-ready answer

A **Stage is a group of tasks that can be executed together without requiring a shuffle boundary**.

Spark divides a job into stages based mainly on shuffle boundaries.

Example:

```text
Read
 ↓
Filter
 ↓
Select
 ↓
       SHUFFLE
 ↓
GroupBy
 ↓
Write
```

Conceptually:

```text
Stage 1
Read → Filter → Select
          ↓
       Shuffle
          ↓
Stage 2
GroupBy → Write
```

### Important

A shuffle generally creates a boundary between stages.

### Interview line

> Spark divides a job into stages, with shuffle boundaries generally separating stages.

---

# 70. What is a Task in Spark?

### 🎯 Interview-ready answer

A **Task is the smallest unit of execution sent to an executor**.

Typically, a task processes **one partition of data for a particular stage**.

Example:

```text
Stage
 ├── Task 1 → Partition 1
 ├── Task 2 → Partition 2
 ├── Task 3 → Partition 3
 └── Task 4 → Partition 4
```

These tasks can execute in parallel if resources are available.

### Easy hierarchy

```text
Application
    ↓
   Job
    ↓
  Stage
    ↓
  Tasks
```

### Interview line

> A task is a unit of work that processes one partition as part of a stage.

---

# 71. Explain Job → Stage → Task with an example.

### 🎯 Interview-ready answer

Suppose we run:

```python
df.groupBy("department").count().show()
```

The `show()` action triggers a **Job**.

Because `groupBy()` requires a shuffle, Spark may create stages around that shuffle.

Conceptually:

```text
                JOB
                 │
       ┌─────────┴─────────┐
       │                   │
    STAGE 1             STAGE 2
       │                   │
   P0 P1 P2 P3         P0 P1 P2 P3
   │  │  │  │          │  │  │  │
 Tasks                  Tasks
```

### Remember

```text
Job   → triggered by action
Stage → separated by shuffle boundaries
Task  → processes a partition
```

This hierarchy is **very important for interviews**.

---

# 72. What is a narrow transformation?

### 🎯 Interview-ready answer

A **narrow transformation** is one where each output partition depends on a relatively small/local set of input partitions, typically without requiring data to be shuffled across the cluster.

Examples:

```python
filter()
select()
withColumn()
map()
```

Conceptually:

```text
P0 → P0'
P1 → P1'
P2 → P2'
P3 → P3'
```

No redistribution of records between partitions is normally required.

### Benefit

Narrow transformations are generally cheaper because they don't require a shuffle.

---

# 73. What is a wide transformation?

### 🎯 Interview-ready answer

A **wide transformation** is one where output partitions may depend on data from multiple input partitions, so Spark needs to **redistribute data**, usually through a shuffle.

Examples:

```python
groupBy()
join()
distinct()
orderBy()
repartition()
```

Conceptually:

```text
P0 ─┐
P1 ─┼──→ SHUFFLE ──→ P0'
P2 ─┼                P1'
P3 ─┘                P2'
                     P3'
```

### Why expensive?

Shuffle can involve:

* Network data transfer
* Serialization/deserialization
* Disk I/O
* Sorting
* Memory pressure

### 🎯 Interview line

> Wide transformations cause data redistribution across partitions and usually involve a shuffle.

---

# 74. Narrow vs Wide Transformation?

| Narrow                      | Wide                      |
| --------------------------- | ------------------------- |
| No shuffle normally         | Shuffle normally required |
| Data stays relatively local | Data redistributed        |
| Usually cheaper             | Usually more expensive    |
| `filter()`                  | `groupBy()`               |
| `select()`                  | `join()`                  |
| `withColumn()`              | `distinct()`              |
| `map()`                     | `orderBy()`               |

### Easy memory

```text
Narrow → No major redistribution
Wide   → Redistribution / Shuffle
```

---

# 75. What is Shuffle in Spark?

### 🎯 Interview-ready answer

**Shuffle is the process of redistributing data across partitions**, usually based on a key, so that related records are brought together.

For example:

```python
df.groupBy("customer_id").sum("amount")
```

Suppose the same customer exists in multiple partitions:

```text
P0 → C101, C102
P1 → C101, C103
P2 → C102, C101
```

Spark needs all `C101` records together.

So it performs:

```text
Input Partitions
 P0 ─┐
 P1 ─┼──→ SHUFFLE → New Partitions
 P2 ─┘
```

After shuffle, records belonging to the same grouping key are routed consistently to the same downstream partition.

### Why shuffle is expensive?

Because it can involve:

```text
CPU
Network
Memory
Disk
Serialization
Sorting
```

---

# 76. Which operations commonly cause shuffle?

Common examples:

```text
groupBy()
join()
distinct()
dropDuplicates()
orderBy()
sort()
repartition()
```

### Example

```python
df.groupBy("customer_id").count()
```

requires data to be brought together by `customer_id`.

Therefore Spark performs a shuffle.

### Important interview point

Not every DataFrame operation is automatically a shuffle.

For example:

```python
df.filter(col("salary") > 5000)
```

is normally narrow.

---

# 77. What happens internally during a `groupBy()`?

### 🎯 Interview-ready answer

When we execute:

```python
df.groupBy("customer_id").sum("amount")
```

Spark needs all records with the same `customer_id` to be processed together.

Conceptually:

```text
Input
 P0: C1 C2 C3
 P1: C1 C4
 P2: C2 C3
        ↓
     SHUFFLE
        ↓
New shuffle partitions
        ↓
Aggregation
```

The shuffle redistributes records based on the grouping key.

Then the downstream tasks perform the aggregation.

### Important clarification

The original input partitions are not simply modified in place.

The shuffle creates intermediate shuffle data that downstream tasks read according to the new partitioning layout.

---

# 78. What is partitioning in Spark?

### 🎯 Interview-ready answer

A **partition is a logical chunk of data processed by Spark**.

For example, if a DataFrame has:

```text
4 partitions
```

Spark can process them approximately as:

```text
Partition 0
Partition 1
Partition 2
Partition 3
```

Each task typically processes one partition for a stage.

### Why are partitions important?

They enable:

* Parallel processing
* Distributed computation
* Better resource utilization

### Simple example

```text
1 TB data
   ↓
100 partitions
   ↓
Multiple executors process partitions in parallel
```

### Important

A partition is **not the same thing as a file**.

One file can be split into multiple input partitions, and one output partition can result in an output file.

---

# 79. How do you check the number of partitions?

For a DataFrame:

```python
df.rdd.getNumPartitions()
```

Example:

```python
print(df.rdd.getNumPartitions())
```

Output:

```text
200
```

You can also inspect partitioning in Spark's execution information depending on the API and plan.

### Interview line

> `df.rdd.getNumPartitions()` can be used to check the current number of partitions of a DataFrame.

---

# 80. What is `repartition()`?

### 🎯 Interview-ready answer

`repartition()` changes the number of partitions by **performing a shuffle**.

Example:

```python
df2 = df.repartition(100)
```

This redistributes the data across 100 partitions.

You can also repartition based on a column:

```python
df2 = df.repartition(100, "customer_id")
```

This distributes records according to the specified partitioning expression.

### Important

`repartition()` is a **wide transformation** because it requires data redistribution.

### When do we use it?

For example, if the data is poorly distributed and we want to increase parallelism before a large operation:

```python
df = df.repartition(200, "customer_id")
```

### 🎯 Interview line

> `repartition()` reshuffles data to create a new partition layout and can increase or decrease the number of partitions.

---

## 🔥 Q61–80 Must Remember

```text
Transformation → Doesn't immediately execute

Action         → Triggers execution

Job            → Triggered by an action

Stage          → Group of tasks separated by shuffle boundaries

Task           → Processes a partition

Narrow         → No shuffle normally

Wide           → Shuffle / redistribution

Shuffle        → Redistributes data across partitions

Partition      → Unit/chunk of distributed data

repartition()  → Shuffle + new partition layout
```

### ⭐ One very common interview question

**"Why is `groupBy()` expensive?"**

Answer:

> `groupBy()` is a wide transformation. Spark has to shuffle records so that rows with the same grouping key are brought together. This can involve network transfer, serialization, sorting, disk I/O and memory usage, so shuffle can become expensive, especially with large data or data skew.

# PySpark Interview Questions — 81 to 100

Now we are entering the **Advanced + Performance** section. These are particularly important for a **DE2-level Spark interview**.

---

## 81. What is the difference between `repartition()` and `coalesce()`?

### 🎯 Interview-ready answer

Both change the number of partitions, but the main difference is **shuffle**.

### `repartition()`

* Performs a **shuffle**
* Can increase or decrease partitions
* Gives better redistribution of data

```python
df2 = df.repartition(100)
```

### `coalesce()`

* Usually avoids a full shuffle
* Mainly used to **reduce** the number of partitions
* More efficient when reducing partitions

```python
df2 = df.coalesce(10)
```

### Example

Suppose we have:

```text
100 partitions
```

and want:

```text
10 partitions
```

Use:

```python
df.coalesce(10)
```

because we don't necessarily need a full shuffle.

But if we want:

```text
10 → 100 partitions
```

use:

```python
df.repartition(100)
```

### Quick comparison

|                     | `repartition()` | `coalesce()`              |
| ------------------- | --------------- | ------------------------- |
| Shuffle             | Yes             | Usually no                |
| Increase partitions | Yes             | Not the normal use        |
| Decrease partitions | Yes             | Yes                       |
| Cost                | Higher          | Lower                     |
| Redistribution      | Better          | Less balanced potentially |

### ⭐ Interview line

> `repartition()` performs a shuffle and can increase or decrease partitions, while `coalesce()` is mainly used to reduce partitions with less data movement.

---

# 82. What is `spark.sql.shuffle.partitions`?

### 🎯 Interview-ready answer

`spark.sql.shuffle.partitions` controls the **default number of partitions created for many shuffle operations in Spark SQL/DataFrame workloads**.

For example:

```python
spark.conf.get("spark.sql.shuffle.partitions")
```

A common default in Spark is:

```text
200
```

but the actual configured value can be different.

We can change it:

```python
spark.conf.set("spark.sql.shuffle.partitions", 100)
```

### Example

Suppose:

```python
df.groupBy("customer_id").count()
```

causes a shuffle.

The shuffle stage may use the configured shuffle partition count.

Conceptually:

```text
Input
 ↓
Shuffle
 ↓
P0 P1 P2 ... P99
```

if the setting is 100.

### ⚠️ Important

Don't confuse:

```text
Input partitions
```

with:

```text
Shuffle partitions
```

They can be completely different.

### Interview line

> `spark.sql.shuffle.partitions` controls the default number of shuffle partitions for many Spark SQL operations.

---

# 83. What happens if `spark.sql.shuffle.partitions` is too high?

Suppose we have:

```text
1 GB data
```

but configure:

```text
10,000 shuffle partitions
```

We may create many very small partitions/tasks.

Problems can include:

* Too many tasks
* Scheduling overhead
* Many small shuffle blocks
* More task coordination
* Poor efficiency

Conceptually:

```text
1 GB
 ↓
10,000 partitions
 ↓
Many tiny tasks
```

### Interview answer

> Too many shuffle partitions can create excessive small tasks and scheduling overhead.

---

# 84. What happens if `spark.sql.shuffle.partitions` is too low?

Suppose:

```text
1 TB data
```

but only:

```text
10 shuffle partitions
```

Then each partition may become very large.

```text
1 TB
 ↓
10 partitions
 ↓
~100 GB each
```

Potential problems:

* Long-running tasks
* Memory pressure
* Spill to disk
* OOM risk
* Poor parallelism
* Straggler tasks

### Interview line

> Too few shuffle partitions can create large partitions, causing memory pressure, spilling and long-running tasks.

---

# 85. What is data skew?

### 🎯 Interview-ready answer

**Data skew occurs when data is distributed unevenly across partitions**, causing some partitions to contain much more data than others.

Example:

```text
Partition 1 → 10 GB
Partition 2 → 11 GB
Partition 3 → 9 GB
Partition 4 → 500 GB   ← Skew
```

One task processing Partition 4 may take much longer.

This creates a **straggler task**.

### Production example

Suppose we have:

```text
500 million transactions
```

and group by:

```text
customer_id
```

If one corporate customer has hundreds of millions of transactions, that key can become extremely hot.

### Result

```text
Most tasks → finish quickly
One task   → takes a very long time
```

### Interview line

> Data skew means some partition(s) contain significantly more data than others, causing uneven workload and slow tasks.

---

# 86. How do you identify data skew in Spark?

### 🎯 Interview-ready answer

I would first check the **Spark UI**.

Look for:

* One or a few tasks taking much longer
* Large differences in task input/shuffle size
* Large shuffle read/write for specific tasks
* Spill to memory/disk
* Uneven partition sizes

Example:

```text
Task 1 → 2 GB → 30 sec
Task 2 → 2 GB → 32 sec
Task 3 → 2 GB → 31 sec
Task 4 → 300 GB → 40 min
```

This is a strong indication of skew.

### We can also inspect the data distribution.

For example:

```python
df.groupBy("customer_id") \
  .count() \
  .orderBy(col("count").desc()) \
  .show()
```

This can help identify **hot keys**.

---

# 87. How do you handle data skew?

### 🎯 Interview-ready answer

Common techniques are:

1. **Adaptive Query Execution (AQE)**
2. **Salting**
3. Better join strategy, such as broadcasting a small table
4. Reconsidering the partitioning/key design
5. Filtering unnecessary data before the shuffle

### AQE

Spark can detect certain skew situations at runtime and adapt the execution plan.

### Salting

Add an artificial value to split a hot key.

For example:

```text
C001
```

becomes:

```text
C001_0
C001_1
C001_2
C001_3
C001_4
```

This allows records for the hot key to be distributed more evenly.

### ⭐ Interview line

> I would first identify the skew using Spark UI and data-distribution analysis. Then I would consider AQE, salting, broadcasting small tables, or redesigning the partitioning strategy depending on the workload.

---

# 88. What is Salting in Spark?

### 🎯 Interview-ready answer

**Salting is a technique used to distribute records belonging to a hot key across multiple partitions.**

Without salting:

```text
customer_id = C001
        ↓
same partition
        ↓
huge partition
```

With salting:

```text
C001 + 0
C001 + 1
C001 + 2
C001 + 3
C001 + 4
```

The records can be spread across multiple partitions.

### Example

```python
from pyspark.sql.functions import rand

df = df.withColumn(
    "salt",
    (rand() * 5).cast("int")
)
```

Then:

```python
df.repartition("customer_id", "salt")
```

### Important

Salt count and Spark partition count are **not the same thing**.

For example:

```text
100 Spark partitions
5 salt values
```

is perfectly possible.

### Interview line

> Salting is a manual technique for splitting hot keys into multiple salted keys to reduce data skew.

---

# 89. What is Adaptive Query Execution (AQE)?

### 🎯 Interview-ready answer

**AQE allows Spark to modify parts of the execution plan at runtime using actual statistics collected during execution.**

Without AQE:

```text
Estimated statistics
       ↓
Execution plan
       ↓
Execute
```

With AQE:

```text
Initial plan
     ↓
Execute stage
     ↓
Actual runtime statistics
     ↓
AQE adjusts plan
     ↓
Continue execution
```

### AQE can help with:

* Coalescing small shuffle partitions
* Handling certain skewed shuffle partitions
* Dynamically changing certain join strategies

### Example

Suppose Spark initially creates:

```text
1000 tiny shuffle partitions
```

AQE can determine that many are tiny and coalesce them into fewer partitions.

### Interview line

> AQE uses runtime statistics to dynamically optimize the physical execution plan instead of relying only on estimates made before execution.

---

# 90. AQE vs Salting?

### 🎯 Interview-ready answer

Both can help with skew, but they work differently.

| AQE                                   | Salting                     |
| ------------------------------------- | --------------------------- |
| Automatic/runtime optimization        | Manual technique            |
| Uses runtime statistics               | Changes data/key            |
| Spark handles it                      | Developer designs it        |
| No business-key modification required | Key transformation required |
| Built into Spark                      | Application-level solution  |

### Simple example

```text
AQE
Data → Spark detects problem → adapts execution

Salting
Data → Developer adds salt → Redistributes hot key
```

### ⭐ Interview line

> AQE is a runtime Spark optimization, while salting is a manual data transformation used to distribute hot keys.

---

# 91. What is Broadcast Join?

### 🎯 Interview-ready answer

A **Broadcast Join** sends a small DataFrame to the executors so that Spark can join it with a large DataFrame without shuffling the large DataFrame by the join key.

Example:

```python
from pyspark.sql.functions import broadcast

result = transactions.join(
    broadcast(customers),
    transactions.customer_id == customers.customer_id
)
```

Suppose:

```text
Transactions → 5 TB
Customers    → 50 MB
```

Broadcasting the 50 MB customer table can be much cheaper than shuffling 5 TB.

Conceptually:

```text
Small table
     ↓
Broadcast
 ↓    ↓    ↓
E1   E2   E3
 ↑    ↑    ↑
Large table partitions
```

### ⚠️ Important

Broadcasting should be used when the small side is genuinely small enough for the available executor memory.

### Interview line

> Broadcast join is useful when one side of the join is small enough to replicate to executors, avoiding a large shuffle.

---

# 92. What is `broadcast()` in PySpark?

`broadcast()` is a function that tells Spark to broadcast a DataFrame in a join.

```python
from pyspark.sql.functions import broadcast

df1.join(
    broadcast(df2),
    "customer_id"
)
```

### Without broadcast

Spark may choose a shuffle-based join depending on the plan and statistics.

### With broadcast

We explicitly provide a broadcast hint.

### Important

Spark can also automatically choose broadcast joins when the optimizer's statistics indicate that the table is small enough and the relevant configuration allows it.

---

# 93. What is a Sort-Merge Join?

### 🎯 Interview-ready answer

A **Sort-Merge Join** is a common distributed join strategy for joining large datasets.

Conceptually:

```text
Large Dataset A
      ↓
   Shuffle
      ↓
    Sort
      ↓
Large Dataset B
      ↓
   Shuffle
      ↓
    Sort
      ↓
    Merge
```

Both sides are partitioned and sorted according to the join key, then Spark merges matching records.

### When useful?

When both datasets are large and broadcasting either side isn't practical.

### Example

```text
Transactions → 5 TB
Customers    → 2 TB
```

Broadcasting either may not be practical.

A shuffle-based strategy such as Sort-Merge Join may be appropriate.

---

# 94. Broadcast Join vs Sort-Merge Join?

### 🎯 Interview-ready answer

| Broadcast Join                                | Sort-Merge Join                  |
| --------------------------------------------- | -------------------------------- |
| One side is small                             | Both sides can be large          |
| Avoids large shuffle of the big side          | Requires shuffle                 |
| Usually faster for small dimension tables     | Good for large-large joins       |
| Requires enough executor memory for broadcast | More suitable for large datasets |

### Typical DE example

```text
Fact table       → billions of rows
Dimension table  → few MB/GB
```

Use:

```text
Broadcast Join
```

when dimension is safely small enough.

For:

```text
Large Fact
     +
Large Fact
```

a shuffle-based join such as Sort-Merge Join is often more appropriate.

---

# 95. What is Predicate Pushdown?

### 🎯 Interview-ready answer

**Predicate pushdown means pushing filter conditions as close to the data source as possible so Spark reads less data.**

Example:

```python
df.filter(col("salary") > 5000)
```

If the underlying format/source supports it, Spark can push the filter down while reading the data.

Instead of:

```text
Read 1 TB
 ↓
Filter
 ↓
10 GB
```

it can effectively do:

```text
Read only relevant data
 ↓
10 GB
```

### Example with Parquet

```python
df = spark.read.parquet("/data/employees")

df.filter(col("salary") > 5000)
```

Spark can use Parquet statistics to avoid reading some irrelevant data.

### Benefit

Less:

* Disk I/O
* Network I/O
* CPU
* Memory usage

### Interview line

> Predicate pushdown reduces the amount of data read by applying filters as close to the source as possible.

---

# 96. What is Column Pruning?

### 🎯 Interview-ready answer

**Column pruning means Spark reads only the columns required by the query instead of reading every column.**

Suppose a Parquet dataset has:

```text
100 columns
```

but we query:

```python
df.select("customer_id", "amount")
```

Spark can read only the required columns if the source supports columnar access.

Conceptually:

```text
100 columns
     ↓
Need only 2
     ↓
Read 2 columns
```

### Benefit

Reduces:

* I/O
* Memory usage
* Data transfer
* Processing cost

### Predicate Pushdown vs Column Pruning

```text
Predicate Pushdown → Which ROWS should I read?
Column Pruning     → Which COLUMNS should I read?
```

This is a very common interview question.

---

# 97. What is Catalyst Optimizer?

### 🎯 Interview-ready answer

**Catalyst is Spark SQL's query optimization framework.**

It takes the query/DataFrame operations and goes through stages such as:

```text
DataFrame / SQL
      ↓
Unresolved Logical Plan
      ↓
Resolved Logical Plan
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

### Example

If we write:

```python
df.select("name", "salary") \
  .filter(col("salary") > 5000)
```

Spark's optimizer can determine an efficient way to execute this rather than blindly executing each line independently.

### Interview line

> Catalyst is Spark SQL's optimizer that analyzes logical plans and produces an optimized physical execution plan.

---

# 98. What is `explain()` in PySpark?

### 🎯 Interview-ready answer

`explain()` is used to inspect the **query execution plan** of a DataFrame.

Example:

```python
df.groupBy("dept").count().explain()
```

It helps us understand:

* Logical plan
* Optimized logical plan
* Physical plan
* Exchanges/shuffles
* Join strategies
* Scans
* Filters

For more detail:

```python
df.explain(True)
```

### Example things we may see

```text
FileScan
Exchange
Sort
HashAggregate
BroadcastHashJoin
SortMergeJoin
```

### Why is it useful?

When optimizing a production Spark job, `explain()` helps us understand **what Spark actually plans to do**.

### Interview line

> I use `explain()` to inspect the execution plan and identify expensive operations such as shuffles, sorts and inefficient join strategies.

---

# 99. What is caching in Spark and when should you use it?

### 🎯 Interview-ready answer

Caching stores a computed DataFrame/RDD so that it can be **reused without recomputing the entire lineage**.

Example:

```python
df_cached = df.filter(
    col("salary") > 5000
).cache()
```

The cache is populated when an action executes:

```python
df_cached.count()
```

Then:

```python
df_cached.show()
```

can reuse the cached data.

### When should we cache?

When the same expensive DataFrame is reused multiple times.

Example:

```text
Expensive transformation
        ↓
     Cached DF
      ↙    ↘
 count()   write()
```

Without caching, Spark may recompute the upstream lineage for separate actions.

### Important

Don't cache everything.

Caching consumes cluster resources.

### `cache()` vs `persist()`

```python
df.cache()
```

uses the default storage level.

```python
df.persist(StorageLevel.MEMORY_AND_DISK)
```

allows us to explicitly choose the storage level.

### Interview line

> I cache a DataFrame when an expensive computation is reused multiple times, but I avoid unnecessary caching because it consumes cluster resources.

---

# 100. How would you optimize a slow PySpark job in production?

### 🎯 Interview-ready answer

This is one of the **most important DE2 interview questions**.

I would not immediately increase the cluster size. First, I would identify the bottleneck.

### Step 1 — Check Spark UI

Look for:

* Long-running stages
* Straggler tasks
* Shuffle read/write
* Spill
* Uneven partition sizes
* Executor failures/OOM

### Step 2 — Check data volume

Filter unnecessary data as early as possible.

```python
df = df.filter(col("date") >= "2026-01-01")
```

### Step 3 — Select only required columns

```python
df = df.select(
    "customer_id",
    "amount",
    "transaction_date"
)
```

This helps column pruning.

### Step 4 — Check joins

If one side is small:

```python
large_df.join(
    broadcast(small_df),
    "customer_id"
)
```

If both are large, investigate shuffle-based joins.

### Step 5 — Check data skew

Find hot keys:

```python
df.groupBy("customer_id") \
  .count() \
  .orderBy(col("count").desc())
```

Possible solutions:

```text
AQE
Salting
Better partitioning
Broadcasting small side
```

### Step 6 — Check shuffle partitions

If:

```text
Too few → huge partitions
Too many → tiny partitions
```

Tune:

```python
spark.conf.set(
    "spark.sql.shuffle.partitions",
    400
)
```

The correct number depends on the workload and cluster.

### Step 7 — Avoid unnecessary operations

Be careful with:

```python
collect()
```

because it brings data to the driver.

Also avoid unnecessary:

```text
distinct()
orderBy()
repartition()
cache()
```

because they can be expensive.

### Step 8 — Use appropriate file formats

For analytical workloads, prefer:

```text
Parquet / Delta
```

over repeatedly processing raw CSV when appropriate.

### Step 9 — Check small files

Thousands/millions of tiny files can create excessive file-processing overhead.

Use appropriate file compaction/optimization strategies.

### Step 10 — Inspect the execution plan

```python
df.explain(True)
```

Look for:

```text
Exchange
Sort
BroadcastHashJoin
SortMergeJoin
FileScan
```

### ⭐ Strong DE2 interview answer

> **First, I would use Spark UI and `explain()` to identify the bottleneck rather than blindly increasing cluster size. Then I would check for excessive shuffle, data skew, inefficient joins, incorrect partition sizing, unnecessary columns or rows, small files and unnecessary caching. Depending on the issue, I would use predicate and column pruning, broadcast joins, AQE, salting, partition tuning and appropriate storage formats. Finally, I would validate the improvement using execution time and Spark UI metrics.**

---

# 🔥 Final 100-Question Revision Map

You've now covered the complete set:

```text
Q1–20
PySpark + Spark Fundamentals
        ↓
Q21–40
DataFrame Operations
        ↓
Q41–60
Aggregations + Joins + Windows
        ↓
Q61–80
Execution Model + DAG + Shuffle + Partitions
        ↓
Q81–100
Performance + Skew + AQE + Optimization
```

### ⭐ Highest-priority questions for DE2

If you have limited revision time, prioritize:

**Architecture**

* Driver vs Executor
* Job → Stage → Task
* DAG
* Lazy evaluation

**Performance**

* Narrow vs Wide
* Shuffle
* Repartition vs Coalesce
* Shuffle partitions
* Data skew
* Salting
* AQE

**Joins**

* Broadcast Join
* Sort-Merge Join
* Semi vs Anti Join
* Join optimization

**Optimization**

* Predicate Pushdown
* Column Pruning
* Catalyst
* `explain()`
* Cache/Persist

**Production**

* Slow-job troubleshooting
* Small files
* OOM
* Partition sizing
* End-to-end Spark optimization

These are the areas where interviewers can move from **basic definition → “why?” → production scenario → optimization**, so you should be able to explain each without memorizing textbook language.

</user_query>
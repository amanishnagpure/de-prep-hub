---
title: Python Notes
description: Deep Python and pandas reference for Data Engineering interviews
parent: python
hidden: true
order: 1
difficulty: basic
---

# Python Master Notes

Built for **Data Engineering** interviews — Python → pandas → ETL → PySpark → Databricks/ADF.

Each topic: **Concept → Syntax → Example → DE example → Mistake → Interview → Practice**

---

## Basic

### Easy — Python Fundamentals

### 1. Variables & Data Types

**Concept:** Names bound to objects. Core types: int, float, str, bool, None.

**Syntax:**

```python
user_id = 42
amount = 19.99
active = True
name = None
```

**Example:** Store row counts and flags from a config file.

**DE example:** Parse API payloads: `order_id` int, `total` float, `currency` str before loading to bronze.

**Common mistake:** Reusing variable names for different logical types in one function.

**Interview:** What are mutable vs immutable built-in types?

**Practice:** Practice #1


### 2. Strings

**Concept:** Immutable sequences of Unicode characters; heavily used in log parsing and schema names.

**Syntax:**

```python
s = "hello"
s.upper()
s.strip()
s.split(",")
",".join(parts)
f"{table}_{partition}"
```

**Example:** Normalize column names to snake_case.

**DE example:** Strip whitespace from CSV headers; build ADLS paths like `f"raw/{dt}/{table}.parquet"`.

**Common mistake:** Using `+` in loops instead of join/list append.

**Interview:** Why are strings immutable?

**Practice:** Practice #2


### 3. Lists

**Concept:** Ordered mutable sequences — default container for batches of records.

**Syntax:**

```python
rows = []
rows.append({"id": 1})
rows[0]
rows[-1]
rows[1:3]
```

**Example:** Accumulate API pages before writing.

**DE example:** Buffer 10k dict rows then flush to Parquet chunk.

**Common mistake:** Using lists when you need O(1) lookup — use dict/set.

**Interview:** List vs array — when is list enough?

**Practice:** Practice #3


### 4. Tuples

**Concept:** Ordered immutable sequences; good for fixed records and dict keys.

**Syntax:**

```python
point = (12.9, 77.5)
lat, lon = point  # unpacking
```

**Example:** Return (rows_loaded, errors) from a transform.

**DE example:** Use as groupby key: `df.groupby(("region", "product"))`.

**Common mistake:** Using lists for keys that should not change.

**Interview:** When use tuple over list?

**Practice:** Practice #4


### 5. Sets

**Concept:** Unordered unique elements; membership and dedupe.

**Syntax:**

```python
seen = set()
if x not in seen:
    seen.add(x)
a | b  # union
a & b  # intersection
```

**Example:** Track processed file names.

**DE example:** Dedupe customer_ids before merge to dimension table.

**Common mistake:** Expecting set to preserve order (use dict.fromkeys).

**Interview:** Set vs dict keys?

**Practice:** Practice #5


### 6. Dictionaries

**Concept:** Key-value maps; JSON-like records and lookup tables.

**Syntax:**

```python
row = {"id": 1, "name": "Ada"}
row.get("email", "")
row["status"] = "active"
```

**Example:** Map source column → target column.

**DE example:** Config-driven transforms: `FIELD_MAP = {"cust_id": "customer_id"}`.

**Common mistake:** KeyError on missing keys — use `.get()`.

**Interview:** Average time complexity of dict lookup?

**Practice:** Practice #6


### 7. if / elif / else

**Concept:** Branch on data quality rules and environment.

**Syntax:**

```python
if env == "prod":
    level = "ERROR"
elif env == "staging":
    level = "WARNING"
else:
    level = "DEBUG"
```

**Example:** Route bad rows to quarantine.

**DE example:** If null rate > threshold → fail pipeline (Great Expectations style).

**Common mistake:** Deep nesting — extract functions early.

**Interview:** Truthy values in Python?

**Practice:** Practice #7


### 8. for / while

**Concept:** Iterate files, chunks, and retry loops.

**Syntax:**

```python
for path in files:
    process(path)

while retries < 3:
    try: break
    except: retries += 1
```

**Example:** Loop over partition folders.

**DE example:** Chunk-read CSV with while + read(n).

**Common mistake:** Modifying list while iterating — iterate copy.

**Interview:** When prefer while over for?

**Practice:** Practice #8


### 9. Functions

**Concept:** Reusable transforms; keep ETL steps pure where possible.

**Syntax:**

```python
def normalize_email(row: dict) -> dict:
    row = row.copy()
    row["email"] = row["email"].strip().lower()
    return row
```

**Example:** Single-responsibility transform functions.

**DE example:** Unit-testable `parse_timestamp(val) -> datetime`.

**Common mistake:** Side effects + return value mixed in one function.

**Interview:** What makes a function pure?

**Practice:** Practice #9


### 10. Lambda

**Concept:** Anonymous one-liners for sort keys and simple maps.

**Syntax:**

```python
sorted(rows, key=lambda r: r["amount"], reverse=True)
map(lambda x: x.strip(), cols)
```

**Example:** Sort files by embedded date in name.

**DE example:** Quick key in `sorted(files, key=lambda f: f.stat().st_mtime)`.

**Common mistake:** Complex lambdas — use def for readability.

**Interview:** Lambda limitations?

**Practice:** Practice #10


### 11. Comprehensions

**Concept:** Concise list/dict/set builders — idiomatic in pipelines.

**Syntax:**

```python
evens = [n for n in nums if n % 2 == 0]
by_id = {r["id"]: r for r in rows}
tags = {t for r in rows for t in r["tags"]}
```

**Example:** Filter invalid rows before load.

**DE example:** Build column rename dict from schema YAML.

**Common mistake:** Nested comprehensions harming readability.

**Interview:** List comp vs map/filter?

**Practice:** Practice #11


### 12. enumerate()

**Concept:** Index + value while iterating.

**Syntax:**

```python
for i, row in enumerate(rows, start=1):
    row["line_no"] = i
```

**Example:** Attach row numbers for error reports.

**DE example:** Log chunk index in parallel file processing.

**Common mistake:** Manual counter variable when enumerate suffices.

**Interview:** Why start=1 in enumerate?

**Practice:** Practice #12


### 13. zip()

**Concept:** Pair iterables — align columns from parallel lists.

**Syntax:**

```python
for name, val in zip(columns, values):
    record[name] = val
```

**Example:** Transpose paired arrays to records.

**DE example:** Combine extracted keys/values from malformed CSV repair.

**Common mistake:** Unequal lengths silently truncate — use strict= (3.10+).

**Interview:** zip longest vs strict?

**Practice:** Practice #13


### 14. map / filter

**Concept:** Functional-style transforms on iterables.

**Syntax:**

```python
clean = list(map(str.strip, headers))
valid = list(filter(lambda r: r["amount"] > 0, rows))
```

**Example:** Strip all string fields.

**DE example:** Pre-filter null keys before DataFrame creation.

**Common mistake:** map in Py3 returns iterator — wrap list() if needed.

**Interview:** map vs comprehension performance?

**Practice:** Practice #14


### 15. Sorting

**Concept:** Order events, files, and ranked metrics.

**Syntax:**

```python
sorted(rows, key=lambda r: r["ts"])
rows.sort(key=lambda r: r["amount"], reverse=True)
```

**Example:** Sort events before sessionization.

**DE example:** Order files for incremental watermark processing.

**Common mistake:** Sorting huge lists in memory — use Spark/external sort.

**Interview:** sorted() vs list.sort()?

**Practice:** Practice #15


### 16. Exception Handling

**Concept:** Fail gracefully; separate retryable vs fatal errors.

**Syntax:**

```python
try:
    load(path)
except FileNotFoundError:
    log.error("missing %s", path)
    raise
except Exception as e:
    log.exception("load failed")
    raise PipelineError(str(e)) from e
```

**Example:** Wrap vendor API errors.

**DE example:** Retry only on `requests.Timeout`, not on 400.

**Common mistake:** Bare `except:` swallowing KeyboardInterrupt.

**Interview:** raise from e — why?

**Practice:** Practice #16


### 17. File Handling

**Concept:** Read/write text and binary; always close resources.

**Syntax:**

```python
with open(path, "r", encoding="utf-8") as f:
    data = f.read()
```

**Example:** Read control file with last watermark.

**DE example:** Write audit log append-only with UTF-8.

**Common mistake:** Default encoding on Windows — always specify utf-8.

**Interview:** Text vs binary mode?

**Practice:** Practice #17


### 18. CSV

**Concept:** Tabular text interchange; know csv module vs pandas.

**Syntax:**

```python
import csv
with open("t.csv", newline="") as f:
    for row in csv.DictReader(f):
        process(row)
```

**Example:** Lightweight ingestion without pandas.

**DE example:** Stream millions of rows with DictReader + batch insert.

**Common mistake:** Forgetting `newline=""` on Windows.

**Interview:** csv vs pandas.read_csv when?

**Practice:** Practice #18


### 19. JSON

**Concept:** Semi-structured API and document payloads.

**Syntax:**

```python
import json
data = json.loads(text)
json.dumps(obj, default=str)
```

**Example:** Parse REST API response.

**DE example:** Flatten nested `user.address.city` for bronze JSONL.

**Common mistake:** datetime not JSON serializable — use default=str or isoformat.

**Interview:** json.loads vs ast.literal_eval?

**Practice:** Practice #19


### 20. with statement

**Concept:** Context managers guarantee cleanup (files, DB connections).

**Syntax:**

```python
from contextlib import contextmanager

@contextmanager
def timed(step):
    start = time.perf_counter()
    yield
    log.info("%s %.2fs", step, time.perf_counter()-start)
```

**Example:** Auto-close DB cursor.

**DE example:** Wrap Synapse connection in `with engine.connect() as conn`.

**Common mistake:** Manual open/close without try/finally.

**Interview:** How does `with` work internally?

**Practice:** Practice #20


---

## Medium

### Medium — Pandas

### 1. Series

**Concept:** 1D labeled array — column or metric vector.

**Syntax:**

```python
import pandas as pd
s = pd.Series([1,2,3], index=["a","b","c"])
```

**Example:** Single metric time series.

**DE example:** Extract `df["amount"]` for aggregations.

**Common mistake:** Confusing Series index with DataFrame index.

**Interview:** Series vs list?

**Practice:** Practice #21


### 2. DataFrame

**Concept:** 2D table — primary pandas abstraction for DE.

**Syntax:**

```python
df = pd.DataFrame(rows)
df.shape
df.columns
df.dtypes
```

**Example:** Hold batch extract.

**DE example:** Bronze layer staging before Delta write.

**Common mistake:** Assuming DataFrame is always in-memory safe at TB scale.

**Interview:** DataFrame internals at high level?

**Practice:** Practice #22


### 3. read_csv()

**Concept:** Load delimited files with dtype and parse control.

**Syntax:**

```python
df = pd.read_csv("t.csv", dtype={"id": str}, parse_dates=["ts"], usecols=[...])
```

**Example:** Ingest daily export.

**DE example:** Force `customer_id` str to preserve leading zeros.

**Common mistake:** Inferring bad dtypes (IDs as float).

**Interview:** read_csv performance tips?

**Practice:** Practice #23


### 4. read_json()

**Concept:** Load JSON lines or records.

**Syntax:**

```python
df = pd.read_json("events.jsonl", lines=True)
```

**Example:** API dump to DataFrame.

**DE example:** Normalize nested JSON with `pd.json_normalize`.

**Common mistake:** Loading huge JSON in one shot.

**Interview:** json_normalize use case?

**Practice:** Practice #24


### 5. read_excel()

**Concept:** Business user exports — less common in prod pipelines.

**Syntax:**

```python
df = pd.read_excel("report.xlsx", sheet_name="Data")
```

**Example:** Ad-hoc SME file.

**DE example:** Prefer CSV/Parquet in automation; excel for manual uploads.

**Common mistake:** Excel date serial confusion.

**Interview:** Why avoid excel in production?

**Practice:** Practice #25


### 6. DataFrame creation

**Concept:** From dict, list of dicts, numpy, SQL.

**Syntax:**

```python
df = pd.DataFrame.from_records(rows)
df = pd.DataFrame(data, columns=cols)
```

**Example:** Materialize API page.

**DE example:** Create QA sample DataFrame for unit tests.

**Common mistake:** Unequal length dict values.

**Interview:** from_records vs DataFrame constructor?

**Practice:** Practice #26


### 7. head / tail / info / describe

**Concept:** Exploratory profiling in notebooks and debugging.

**Syntax:**

```python
df.head()
df.info()
df.describe(include="all")
```

**Example:** Profile new source.

**DE example:** Check null % before promoting to silver.

**Common mistake:** Only head() on skewed data — sample fairly.

**Interview:** What does info() show?

**Practice:** Practice #27


### 8. Selecting columns

**Concept:** Bracket and attribute access.

**Syntax:**

```python
df[["id","amount"]]
df["amount"]  # Series
```

**Example:** Project staging columns.

**DE example:** Select PII columns for masking step.

**Common mistake:** df.col vs df["col"] with spaces in names.

**Interview:** Chained indexing risk?

**Practice:** Practice #28


### 9. loc

**Concept:** Label-based row/column selection.

**Syntax:**

```python
df.loc[df["amount"] > 0, ["id","amount"]]
df.loc[0:5, "name"]  # inclusive end for labels
```

**Example:** Filter + project.

**DE example:** Update status for batch: `df.loc[mask, "status"] = "processed"`.

**Common mistake:** SettingWithCopyWarning via chained loc.

**Interview:** loc vs iloc?

**Practice:** Practice #29


### 10. iloc

**Concept:** Position-based selection.

**Syntax:**

```python
df.iloc[0:100, 0:3]
df.iloc[:, -1]
```

**Example:** Sample first chunk.

**DE example:** Inspect schema from first row positions.

**Common mistake:** Mixing loc/iloc semantics (inclusive vs exclusive).

**Interview:** When iloc over loc?

**Practice:** Practice #30


### 11. Filtering

**Concept:** Boolean masks on rows.

**Syntax:**

```python
df[df["country"] == "IN"]
df[df["email"].notna()]
```

**Example:** Active customers only.

**DE example:** Filter partition `dt == run_date`.

**Common mistake:** Using and/or instead of & | with parentheses.

**Interview:** Why & not and?

**Practice:** Practice #31


### 12. Multiple conditions

**Concept:** Combine masks with & | ~.

**Syntax:**

```python
(df["a"] > 0) & (df["b"].isin(["x","y"]))
```

**Example:** Complex business rules.

**DE example:** Valid orders: paid & not cancelled & amount>0.

**Common mistake:** Missing parentheses around each condition.

**Interview:** isin vs multiple ==

**Practice:** Practice #32


### 13. Sorting

**Concept:** Order for window logic and exports.

**Syntax:**

```python
df.sort_values(["customer_id","ts"], ascending=[True, True])
```

**Example:** Sort events per user.

**DE example:** Prepare for `groupby` + `shift` lag features.

**Common mistake:** Not resetting index after sort when order matters.

**Interview:** stable sort in pandas?

**Practice:** Practice #33


### 14. rename

**Concept:** Align to target schema.

**Syntax:**

```python
df.rename(columns={"cust_id": "customer_id"}, inplace=False)
```

**Example:** Standardize names.

**DE example:** Map source → medallion column names.

**Common mistake:** inplace=True hiding immutability in pipelines.

**Interview:** rename vs assign columns?

**Practice:** Practice #34


### 15. astype

**Concept:** Cast dtypes for memory and correctness.

**Syntax:**

```python
df["id"] = df["id"].astype(str)
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
```

**Example:** Fix string numbers.

**DE example:** Downcast ints for memory on wide tables.

**Common mistake:** astype on values that fail — use to_numeric.

**Interview:** category dtype when?

**Practice:** Practice #35


### 16. to_datetime

**Concept:** Parse heterogeneous date strings to datetime64.

**Syntax:**

```python
df["ts"] = pd.to_datetime(df["ts"], utc=True, errors="coerce")
```

**Example:** Unify formats.

**DE example:** Store UTC in lakehouse; convert at BI layer.

**Common mistake:** Naive vs aware datetime mix.

**Interview:** errors=coerce effect?

**Practice:** Practice #36


### 17. Missing values

**Concept:** NA semantics differ by dtype (NaN, NaT, None).

**Syntax:**

```python
df.isna().sum()
df.notna()
```

**Example:** Null rate report.

**DE example:** DQ gate: reject if key column null rate > 1%.

**Common mistake:** Comparing NaN with ==.

**Interview:** None vs NaN?

**Practice:** Practice #37


### 18. fillna

**Concept:** Impute or default missing values.

**Syntax:**

```python
df["score"].fillna(df["score"].median())
df.fillna({"country": "UNK"})
```

**Example:** Default unknown category.

**DE example:** Forward-fill time series gaps cautiously in finance.

**Common mistake:** fillna before understanding why null.

**Interview:** fillna vs replace?

**Practice:** Practice #38


### 19. dropna

**Concept:** Remove incomplete rows/columns.

**Syntax:**

```python
df.dropna(subset=["customer_id"])
df.dropna(axis=1, thresh=len(df)*0.9)
```

**Example:** Drop rows without keys.

**DE example:** Drop sparse columns from API schema drift.

**Common mistake:** Dropping too aggressively without audit.

**Interview:** how=any vs all?

**Practice:** Practice #39


### 20. duplicated

**Concept:** Detect duplicate keys.

**Syntax:**

```python
df.duplicated(subset=["order_id"], keep="first")
```

**Example:** Find dup loads.

**DE example:** CDC dedupe: keep last by `updated_at`.

**Common mistake:** Not specifying subset — full row dup only.

**Interview:** keep=last use case?

**Practice:** Practice #40


### 21. drop_duplicates

**Concept:** Dedupe for silver tables.

**Syntax:**

```python
df.drop_duplicates(subset=["id"], keep="last")
```

**Example:** Latest record per key.

**DE example:** Idempotent reload: dedupe on business key.

**Common mistake:** Dropping without sort on tie-breaker column.

**Interview:** dedupe in pandas vs Delta MERGE?

**Practice:** Practice #41


### 22. groupby

**Concept:** Split-apply-combine aggregations.

**Syntax:**

```python
df.groupby("region")["sales"].sum()
df.groupby(["region","product"]).agg(...)
```

**Example:** Daily revenue by region.

**DE example:** Same logic you'll write in SQL GROUP BY / Spark.

**Common mistake:** Forgetting groupby keys in result index.

**Interview:** groupby lazy until agg?

**Practice:** Practice #42


### 23. agg

**Concept:** Multiple metrics per group.

**Syntax:**

```python
df.groupby("cat").agg(total=("amt","sum"), n=("id","nunique"))
```

**Example:** Summary stats.

**DE example:** Pipeline metrics per source file.

**Common mistake:** Named aggregation vs dict confusion (pandas 1+).

**Interview:** agg vs apply on groupby?

**Practice:** Practice #43


### 24. transform

**Concept:** Return same shape as input — normalize within group.

**Syntax:**

```python
df["z"] = df.groupby("g")["x"].transform(lambda s: (s-s.mean())/s.std())
```

**Example:** Per-group fill.

**DE example:** Rank within department without collapsing rows.

**Common mistake:** Using agg when you need row-level output.

**Interview:** transform vs apply?

**Practice:** Practice #44


### 25. merge

**Concept:** SQL-like joins on keys.

**Syntax:**

```python
df.merge(dim, on="customer_id", how="left")
```

**Example:** Enrich fact with dimension.

**DE example:** Same as Synapse JOIN in pandas-scale data.

**Common mistake:** Many-to-many explosion without uniqueness check.

**Interview:** merge vs join method?

**Practice:** Practice #45


### 26. concat

**Concept:** Stack DataFrames vertically or horizontally.

**Syntax:**

```python
pd.concat([df1, df2], ignore_index=True)
```

**Example:** Union daily files.

**DE example:** Combine batch extracts before single Parquet write.

**Common mistake:** Column misalignment across files.

**Interview:** concat vs append (deprecated)?

**Practice:** Practice #46


### 27. join

**Concept:** Index-based join alternative to merge.

**Syntax:**

```python
a.join(b, how="left")
```

**Example:** When index is natural key.

**DE example:** Less common in ETL — prefer explicit merge on columns.

**Common mistake:** Accidental duplicate index labels.

**Interview:** When use join over merge?

**Practice:** Practice #47


### 28. pivot

**Concept:** Reshape without aggregation (duplicates raise error).

**Syntax:**

```python
df.pivot(index="dt", columns="product", values="qty")
```

**Example:** Matrix without agg.

**DE example:** Rare in pipelines — pivot_table more common.

**Common mistake:** Duplicate index/col pairs.

**Interview:** pivot vs pivot_table?

**Practice:** Practice #48


### 29. pivot_table

**Concept:** Aggregated wide reports.

**Syntax:**

```python
df.pivot_table(index="region", columns="product", values="sales", aggfunc="sum", fill_value=0)
```

**Example:** Sales matrix.

**DE example:** Excel-like report in notebook before Power BI.

**Common mistake:** Not filling NaN after pivot.

**Interview:** margins parameter?

**Practice:** Practice #49


### 30. melt

**Concept:** Wide → long (unpivot).

**Syntax:**

```python
pd.melt(df, id_vars=["id"], value_vars=["q1","q2"], var_name="quarter", value_name="rev")
```

**Example:** Normalize metrics columns.

**DE example:** Prepare for Spark tidy format.

**Common mistake:** Melting ID columns accidentally.

**Interview:** melt vs stack?

**Practice:** Practice #50


### 31. apply

**Concept:** Row/column-wise custom functions — slow but flexible.

**Syntax:**

```python
df["email"].apply(lambda x: x.lower())
```

**Example:** Custom parse.

**DE example:** Last resort — prefer vectorized/string ops.

**Common mistake:** apply(axis=1) on millions of rows.

**Interview:** apply vs vectorization?

**Practice:** Practice #51


### 32. Vectorization

**Concept:** C-level ops on whole columns — always prefer.

**Syntax:**

```python
df["total"] = df["qty"] * df["price"]
df["flag"] = df["amount"] > 100
```

**Example:** Fast derived columns.

**DE example:** Same mindset as Spark column expressions.

**Common mistake:** Python loops over rows.

**Interview:** Why vectorization faster?

**Practice:** Practice #52


### 33. String operations

**Concept:** Vectorized str accessor.

**Syntax:**

```python
df["email"].str.lower().str.contains("@")
df["code"].str.replace("-", "", regex=False)
```

**Example:** Clean text fields.

**DE example:** Regex extract from log column.

**Common mistake:** Applying regex without na=False.

**Interview:** str vs apply for strings?

**Practice:** Practice #53


### 34. Date operations

**Concept:** dt accessor for components and arithmetic.

**Syntax:**

```python
df["ts"].dt.year
df["ts"].dt.tz_convert("Asia/Kolkata")
```

**Example:** Partition key from timestamp.

**DE example:** Derive `dt=ts.dt.date` for hive partitions.

**Common mistake:** Timezone-naive comparisons.

**Interview:** dt.floor vs resample?

**Practice:** Practice #54


### 35. MultiIndex

**Concept:** Hierarchical index/columns for complex reports.

**Syntax:**

```python
df.set_index(["region","product"])
```

**Example:** Nested aggregation display.

**DE example:** Understand before reading advanced BI exports.

**Common mistake:** Accidental MultiIndex after groupby.

**Interview:** reset_index when?

**Practice:** Practice #55


### 36. Memory optimization

**Concept:** category, downcast, selective columns.

**Syntax:**

```python
df["country"] = df["country"].astype("category")
pd.to_numeric(df["x"], downcast="integer")
```

**Example:** Fit in laptop RAM.

**DE example:** When data grows → Parquet + Spark on Databricks.

**Common mistake:** read_csv everything as float64.

**Interview:** When leave pandas for Spark?

**Practice:** Practice #56


---

## Advanced

### Advanced Python

### 1. Iterators

**Concept:** Object with __iter__/__next__; consumes stream.

**Example:** File line iterator.

**DE example:** Stream JSONL without loading full file.

**Common mistake:** Exhausted iterator reused.

**Interview:** Iterator protocol?

,### 2. Iterables

**Concept:** Anything you can loop over (list, dict keys, generator).

**Example:** for x in data.

**DE example:** Any extract yielding rows.

**Common mistake:** Thinking list is only iterable.

**Interview:** Iterable vs iterator?

,### 3. Generators

**Concept:** Lazy iterator from function with yield.

**Example:** yield row batches.

**DE example:** Memory-flat ETL over large CSV.

**Common mistake:** Materializing generator to list unnecessarily.

**Interview:** Generator vs list memory?

,### 4. yield

**Concept:** Pause function preserving state.

**Example:** Paginated API fetch loop.

**DE example:** Yield chunks to downstream writer.

**Common mistake:** Mixing return and yield carelessly.

**Interview:** yield vs return?

,### 5. Generator expressions

**Concept:** (x for x in iterable) — lazy comprehension.

**Example:** Sum without building list.

**DE example:** Stream filter map in pure Python.

**Common mistake:** Using list comp when gen enough.

**Interview:** Gen exp vs list comp?

,### 6. Decorators

**Concept:** Wrap functions for logging, retry, timing.

**Example:** @retry decorator.

**DE example:** Standardize ADF/Python activity logging.

**Common mistake:** Decorators hiding signature (use functools.wraps).

**Interview:** Write a retry decorator?

,### 7. Closures

**Concept:** Inner function capturing outer variables.

**Example:** Factory functions.

**DE example:** Configurable transform closures.

**Common mistake:** Late binding in loops.

**Interview:** Closure use case?

,### 8. *args

**Concept:** Variable positional arguments tuple.

**Example:** Generic wrapper.

**DE example:** Pass through pipeline hooks.

**Common mistake:** Overusing *args hurting clarity.

**Interview:** *args vs **kwargs?

,### 9. **kwargs

**Concept:** Variable keyword arguments dict.

**Example:** Config overrides.

**DE example:** Optional Spark session builder args.

**Common mistake:** Typos in kw silently wrong if no **.

**Interview:** kwargs in production APIs?

,### 10. unpacking

**Concept:** * and ** in assignment and calls.

**Example:** merge dicts {**a,**b}.

**DE example:** Spread config layers.

**Common mistake:** Unpacking wrong order.

**Interview:** Extended unpacking?

,### 11. OOP — class

**Concept:** Bundle state + behavior.

**Example:** Pipeline class.

**DE example:** Extractor/Loader classes in OOP ETL.

**Common mistake:** God classes doing everything.

**Interview:** When OOP in ETL?

,### 12. inheritance

**Concept:** Reuse base extractor.

**Example:** BaseAPIClient subclasses.

**DE example:** Shared retry in base class.

**Common mistake:** Deep inheritance trees.

**Interview:** Composition over inheritance?

,### 13. composition

**Concept:** Has-a instead of is-a.

**Example:** Pipeline has Validator.

**DE example:** Prefer in DE for testability.

**Common mistake:** Inheritance for code reuse only.

**Interview:** Composition example?

,### 14. __init__

**Concept:** Initialize instance state.

**Example:** Store connection config.

**DE example:** SparkSession builder wrapper.

**Common mistake:** Heavy work in __init__.

**Interview:** __init__ vs __new__?

,### 15. __str__ / __repr__

**Concept:** Debug representations.

**Example:** Readable job name.

**DE example:** Log friendly object repr.

**Common mistake:** repr missing for debugging.

**Interview:** str vs repr?

,### 16. dataclasses

**Concept:** Boilerplate-free data containers.

**Example:** @dataclass Config.

**DE example:** Typed pipeline config objects.

**Common mistake:** Mutable defaults without field(default_factory).

**Interview:** dataclass vs dict?

,### 17. typing

**Concept:** Static hints for maintainability.

**Example:** def f(x: int) -> str.

**DE example:** mypy on transform modules.

**Common mistake:** Hints without enforcement.

**Interview:** typing benefits?

,### 18. Optional / List / Dict hints

**Concept:** Express nullable and collections.

**Example:** Optional[str].

**DE example:** Document DataFrame-ish dict rows.

**Common mistake:** Optional[str] = None confusion.

**Interview:** Union vs Optional?

,### 19. Callable

**Concept:** Type hint for function params.

**Example:** Callable[[dict], dict].

**DE example:** Plugin transform registry.

**Common mistake:** Overly complex Callable signatures.

**Interview:** Callable use?

,### 20. Context managers

**Concept:** __enter__/__exit__ or @contextmanager.

**Example:** DB transaction scope.

**DE example:** Unit of work around load.

**Common mistake:** Suppressing exceptions in __exit__.

**Interview:** contextlib.contextmanager?

,### 21. Custom exceptions

**Concept:** PipelineError hierarchy.

**Example:** class DQError(Exception).

**DE example:** Catch retryable vs fatal.

**Common mistake:** Catching Exception everywhere.

**Interview:** When custom exceptions?

,### 22. shallow copy

**Concept:** copy.copy — new container, shared nested objects.

**Example:** Copy list of dicts.

**DE example:** Mutating copy affects nested dict.

**Common mistake:** Thinking copy is deep.

**Interview:** Shallow copy scenario?

,### 23. deep copy

**Concept:** copy.deepcopy — recursive copy.

**Example:** Isolate template row.

**DE example:** Safe branch for what-if transform.

**Common mistake:** Performance on large structures.

**Interview:** When deepcopy?

,### 24. Mutability

**Concept:** Lists/dicts mutable; tuples/str immutable.

**Example:** In-place sort vs sorted.

**DE example:** Avoid mutating shared config dict.

**Common mistake:** Default mutable args.

**Interview:** Mutable default trap?

,### 25. Memory model

**Concept:** References, id(), interning.

**Example:** Same object multiple names.

**DE example:** Large object passed by reference.

**Common mistake:** Unexpected aliasing.

**Interview:** is compares identity?

,### 26. GIL

**Concept:** One bytecode thread at a time in CPython.

**Example:** CPU threads don't parallelize.

**DE example:** Use multiprocessing or Spark for CPU ETL.

**Common mistake:** Threading for CPU-heavy pandas.

**Interview:** GIL impact on ETL?

,### 27. multiprocessing

**Concept:** Separate processes bypass GIL.

**Example:** Parallel file conversion.

**DE example:** Pool per partition file.

**Common mistake:** Huge pickle overhead.

**Interview:** multiprocessing vs threading?

,### 28. threading

**Concept:** Threads for I/O wait.

**Example:** Parallel HTTP fetches.

**DE example:** Thread pool for API ingestion.

**Common mistake:** Threads for CPU pandas ops.

**Interview:** When threads help?

,### 29. async basics

**Concept:** async/await for concurrent I/O.

**Example:** aiohttp fetches.

**DE example:** High concurrency API harvest.

**Common mistake:** async inside CPU pandas.

**Interview:** async vs threads?


---

## Data Engineering

### Data Engineering Python

### 1. ETL architecture

**Concept:** Layers: extract → validate → transform → load → monitor.

**Example:** Medallion bronze/silver/gold.

**DE example:** Map to ADF pipelines + Databricks notebooks.

**Common mistake:** Monolithic script.

**Interview:** Describe your ETL design?

**Practice:** Practice #57

,### 2. Extract / Transform / Load

**Concept:** Separation of concerns.

**Example:** Extract raw, transform in pandas/Spark, load Delta.

**DE example:** ADF Copy → Notebook → Synapse.

**Common mistake:** Transform during extract.

**Interview:** ETL vs ELT?

,### 3. Pipeline design

**Concept:** Idempotent, observable, modular stages.

**Example:** DAG of small jobs.

**DE example:** Airflow/ADF orchestration.

**Common mistake:** No failure boundaries.

**Interview:** Restart from failure?

,### 4. Modular Python

**Concept:** Packages: extract/, transform/, load/, tests/.

**Example:** importable modules.

**DE example:** Wheel deployed to Databricks.

**Common mistake:** Copy-paste transforms.

**Interview:** Folder structure?

,### 5. Configuration management

**Concept:** YAML/env based config, not hardcoded.

**Example:** config/dev.yaml.

**DE example:** ADF parameters + Key Vault refs.

**Common mistake:** Secrets in git.

**Interview:** 12-factor config?

,### 6. Environment variables

**Concept:** os.environ for runtime config.

**Example:** DB_HOST, BATCH_DATE.

**DE example:** Databricks secrets scope → env.

**Common mistake:** Missing env in prod.

**Interview:** dotenv vs vault?

,### 7. Logging

**Concept:** structured logs with levels.

**Example:** logging.getLogger(__name__).

**DE example:** Azure Monitor / Log Analytics.

**Common mistake:** print in production.

**Interview:** logging vs print?

,### 8. Retry mechanisms

**Concept:** Retry transient failures only.

**Example:** tenacity / custom decorator.

**DE example:** ADF retry policy + Python backoff.

**Common mistake:** Retry non-idempotent writes.

**Interview:** Idempotent retry?

,### 9. Exponential backoff

**Concept:** Increase delay between retries.

**Example:** 1s,2s,4s cap 30s.

**DE example:** API rate limit handling.

**Common mistake:** Infinite retries.

**Interview:** Backoff formula?

,### 10. Idempotency

**Concept:** Same input → same output, safe rerun.

**Example:** MERGE on key.

**DE example:** Delta merge, partition overwrite.

**Common mistake:** Append-only duplicates.

**Interview:** How ensure idempotent?

**Practice:** Practice #58

,### 11. Checkpointing

**Concept:** Persist progress for resume.

**Example:** Watermark file.

**DE example:** ADF tumbling window checkpoint.

**Common mistake:** No checkpoint on long jobs.

**Interview:** Checkpoint vs watermark?

,### 12. Watermarks

**Concept:** High-water mark for incremental.

**Example:** last_modified > @wm.

**DE example:** Synapse incremental copy.

**Common mistake:** Clock skew on watermark column.

**Interview:** Late arriving data?

,### 13. Incremental processing

**Concept:** Only new/changed rows.

**Example:** CDC merge.

**DE example:** ADF incremental + Delta MERGE.

**Common mistake:** Full reload daily at scale.

**Interview:** CDC strategies?

,### 14. Batch processing

**Concept:** Scheduled bulk loads.

**Example:** Nightly ETL.

**DE example:** ADF schedule trigger.

**Common mistake:** Wrong batch size for memory.

**Interview:** Batch vs streaming?

,### 15. API ingestion

**Concept:** HTTP extract with auth and pagination.

**Example:** requests session.

**DE example:** REST → bronze JSONL.

**Common mistake:** No timeout.

**Interview:** Handle 429?

**Practice:** Practice #59

,### 16. Pagination

**Concept:** cursor/page until exhausted.

**Example:** while next_url.

**DE example:** Graph API @odata.nextLink.

**Common mistake:** Missing last page.

**Interview:** Offset vs cursor pagination?

,### 17. Rate limiting

**Concept:** Respect API quotas.

**Example:** sleep + backoff.

**DE example:** Throttle parallel workers.

**Common mistake:** Hammering API.

**Interview:** Token bucket?

,### 18. JSON processing

**Concept:** json.loads, json_normalize.

**Example:** Nested API docs.

**DE example:** Bronze semi-structured.

**Common mistake:** Huge single JSON array in memory.

**Interview:** JSON vs Parquet?

,### 19. CSV processing

**Concept:** Streaming csv module or pandas chunks.

**Example:** chunksize=50_000.

**DE example:** Land CSV → convert Parquet.

**Common mistake:** Full read 20GB file.

**Interview:** chunksize pattern?

,### 20. Parquet

**Concept:** Columnar compressed analytical format.

**Example:** df.to_parquet.

**DE example:** ADLS gold layer standard.

**Common mistake:** CSV in production lake.

**Interview:** Why Parquet?

,### 21. Database connectivity

**Concept:** Drivers: pyodbc, psycopg2, sqlalchemy.

**Example:** read_sql query.

**DE example:** Synapse/SQL DB extract.

**Common mistake:** No connection timeout.

**Interview:** Connection pooling?

,### 22. SQLAlchemy basics

**Concept:** Engine, connection, execute.

**Example:** with engine.connect().

**DE example:** Parameterized SQL extract.

**Common mistake:** SQL injection via f-strings.

**Interview:** ORM vs Core for ETL?

,### 23. Secrets management

**Concept:** Never hardcode credentials.

**Example:** Key Vault, Databricks secrets.

**DE example:** ADF Key Vault linked service.

**Common mistake:** Secrets in logs.

**Interview:** Rotate secrets how?

,### 24. Unit testing

**Concept:** pytest on pure transforms.

**Example:** assert normalize(x)==y.

**DE example:** CI gate before deploy.

**Common mistake:** No tests on business rules.

**Interview:** What to test in ETL?

,### 25. Mocking

**Concept:** unittest.mock patch external IO.

**Example:** patch requests.get.

**DE example:** Test without hitting API.

**Common mistake:** Over-mocking implementation.

**Interview:** mock vs fixture?

,### 26. Data validation

**Concept:** Rules on schema, ranges, nulls.

**Example:** assert df.shape[1]==N.

**DE example:** Great Expectations / custom.

**Common mistake:** Validate after load only.

**Interview:** Fail vs quarantine?

,### 27. Schema validation

**Concept:** Required columns and dtypes.

**Example:** pandera / custom.

**DE example:** Contract testing source vs bronze.

**Common mistake:** Silent schema drift.

**Interview:** Schema evolution?

,### 28. Packaging

**Concept:** setup.py/pyproject for deployable libs.

**Example:** internal etl_utils wheel.

**DE example:** Databricks cluster library.

**Common mistake:** Notebook-only spaghetti.

**Interview:** Package vs notebook?

,### 29. Virtual environments

**Concept:** Isolate dependencies per project.

**Example:** python -m venv .venv.

**DE example:** Match Databricks runtime versions.

**Common mistake:** Global pip breaks jobs.

**Interview:** venv vs conda?

,### 30. requirements.txt

**Concept:** Pinned dependencies.

**Example:** pandas==2.2.*.

**DE example:** Recreate cluster env.

**Common mistake:** Unpinned prod deploys.

**Interview:** Pin all versions?

,### 31. argparse

**Concept:** CLI for batch jobs.

**Example:** --date 2024-01-01.

**DE example:** ADF passes parameters to script.

**Common mistake:** No validation on CLI args.

**Interview:** argparse vs click?

,### 32. pathlib

**Concept:** Object-oriented paths.

**Example:** Path("data")/f"{dt}.csv".

**DE example:** Cross-platform ADLS local dev.

**Common mistake:** String path concat.

**Interview:** Path vs os.path?

,### 33. subprocess

**Concept:** Run external CLI tools.

**Example:** subprocess.run(["az", ...]).

**DE example:** Invoke sqlpackage/azcopy cautiously.

**Common mistake:** shell=True injection.

**Interview:** subprocess safety?

,### 34. Production folder structure

**Concept:** src/, tests/, config/, scripts/.

**Example:** Cookiecutter data project.

**DE example:** Repo per pipeline domain.

**Common mistake:** Everything in one notebook.

**Interview:** Layout you use?


---

## Patterns & Traps

### 1. GIL

**Concept:** CPU-bound Python threads don't scale.

**Example:** Slow thread pool on pandas.

**DE example:** Move to Spark on Databricks.

**Common mistake:** 16 threads on CPU transform.

**Interview:** GIL + ETL?

,### 2. Mutable vs immutable

**Concept:** Mutate shared state carefully.

**Example:** dict in default arg.

**DE example:** Copy rows before transform.

**Common mistake:** In-place surprise.

**Interview:** Examples of each?

,### 3. List vs tuple

**Concept:** Mutability and hashing.

**Example:** tuple as dict key.

**DE example:** Fixed schema record.

**Common mistake:** List as dict key.

**Interview:** When tuple?

,### 4. Set vs dict

**Concept:** Set = keys only; dict = key-value.

**Example:** membership vs lookup.

**DE example:** seen_ids set.

**Common mistake:** Using list for membership.

**Interview:** Complexity?

,### 5. is vs ==

**Concept:** Identity vs equality.

**Example:** is None.

**DE example:** Compare singletons with is.

**Common mistake:** is for value compare.

**Interview:** is vs ==?

,### 6. Shallow vs deep copy

**Concept:** Nested mutation.

**Example:** list of dicts.

**DE example:** Template row copy.

**Common mistake:** Shallow when need deep.

**Interview:** Demonstrate?

,### 7. Default mutable arguments

**Concept:** Shared default list/dict.

**Example:** def f(x=[]).

**DE example:** Bug in accumulators.

**Common mistake:** Mutable defaults.

**Interview:** Fix pattern?

,### 8. Late binding closures

**Concept:** Loop variable captured at call.

**Example:** lambda i=i.

**DE example:** Factory in dynamic tasks.

**Common mistake:** All lambdas same i.

**Interview:** Explain late binding?

,### 9. LEGB scope

**Concept:** Local, Enclosing, Global, Built-in.

**Example:** Name resolution.

**DE example:** Understand globals in notebooks.

**Common mistake:** Unintended global mutation.

**Interview:** LEGB?

,### 10. Generators vs lists

**Concept:** Memory trade-off.

**Example:** gen vs list comp.

**DE example:** Stream large files.

**Common mistake:** list(gen) too early.

**Interview:** When generator?

,### 11. map vs list comprehension

**Concept:** Readability and speed.

**Example:** prefer comp in Python.

**DE example:** Readable transforms.

**Common mistake:** Nested map.

**Interview:** Preference?

,### 12. apply vs vectorization

**Concept:** apply is slow Python loop.

**Example:** str.lower vectorized.

**DE example:** Spark column expr mindset.

**Common mistake:** apply axis=1 everywhere.

**Interview:** Speed difference?

,### 13. pandas memory

**Concept:** object dtype, copies.

**Example:** category, downcast.

**DE example:** Spark when RAM exceeded.

**Common mistake:** read all columns.

**Interview:** 20GB CSV?

,### 14. SettingWithCopyWarning

**Concept:** Chained indexing ambiguous copy.

**Example:** use .loc on copy.

**DE example:** df = df.copy() before mutate.

**Common mistake:** Chained brackets.

**Interview:** Fix warning?

,### 15. merge duplication

**Concept:** Many-to-many row explosion.

**Example:** validate unique keys.

**DE example:** Pre-dedupe dimensions.

**Common mistake:** Blind merge.

**Interview:** Detect m:m?

,### 16. NULL handling

**Concept:** NaN propagation.

**Example:** fillna, dropna consciously.

**DE example:** SQL NULL semantics in pandas.

**Common mistake:** == None on NaN.

**Interview:** None vs NaN?

,### 17. dtype problems

**Concept:** Silent coercion.

**Example:** to_numeric errors=coerce.

**DE example:** ID columns as str.

**Common mistake:** float IDs.

**Interview:** Prevent coercion?

,### 18. Timezone problems

**Concept:** Naive vs aware.

**Example:** utc=True.

**DE example:** Store UTC in lake.

**Common mistake:** Mixed tz compare.

**Interview:** Best practice?

,### 19. pandas vs PySpark

**Concept:** Single-node vs distributed.

**Example:** pandas laptop; Spark cluster.

**DE example:** Databricks PySpark for TB.

**Common mistake:** pandas on 50GB.

**Interview:** When switch?

,### 20. Python vs Spark execution

**Concept:** Driver collects vs distributed.

**Example:** toPandas() danger.

**DE example:** Keep transforms in Spark.

**Common mistake:** Collect huge RDD.

**Interview:** Lazy evaluation?


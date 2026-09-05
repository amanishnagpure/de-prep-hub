#!/usr/bin/env node
/**
 * Generates python-notes.md, python-interview.md, python-practice-questions.json
 * Run: node scripts/generate-python-content.mjs
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

// ─── EASY (20 topics) ───────────────────────────────────────────────────────
const easyTopics = [
  { n: 1, title: "Variables & Data Types", concept: "Names bound to objects. Core types: int, float, str, bool, None.", syntax: "user_id = 42\namount = 19.99\nactive = True\nname = None", example: "Store row counts and flags from a config file.", de: "Parse API payloads: `order_id` int, `total` float, `currency` str before loading to bronze.", mistake: "Reusing variable names for different logical types in one function.", interview: "What are mutable vs immutable built-in types?", practice: "Practice #1" },
  { n: 2, title: "Strings", concept: "Immutable sequences of Unicode characters; heavily used in log parsing and schema names.", syntax: 's = "hello"\ns.upper()\ns.strip()\ns.split(",")\n",".join(parts)\nf"{table}_{partition}"', example: "Normalize column names to snake_case.", de: "Strip whitespace from CSV headers; build ADLS paths like `f\"raw/{dt}/{table}.parquet\"`.", mistake: "Using `+` in loops instead of join/list append.", interview: "Why are strings immutable?", practice: "Practice #2" },
  { n: 3, title: "Lists", concept: "Ordered mutable sequences — default container for batches of records.", syntax: "rows = []\nrows.append({\"id\": 1})\nrows[0]\nrows[-1]\nrows[1:3]", example: "Accumulate API pages before writing.", de: "Buffer 10k dict rows then flush to Parquet chunk.", mistake: "Using lists when you need O(1) lookup — use dict/set.", interview: "List vs array — when is list enough?", practice: "Practice #3" },
  { n: 4, title: "Tuples", concept: "Ordered immutable sequences; good for fixed records and dict keys.", syntax: "point = (12.9, 77.5)\nlat, lon = point  # unpacking", example: "Return (rows_loaded, errors) from a transform.", de: "Use as groupby key: `df.groupby((\"region\", \"product\"))`.", mistake: "Using lists for keys that should not change.", interview: "When use tuple over list?", practice: "Practice #4" },
  { n: 5, title: "Sets", concept: "Unordered unique elements; membership and dedupe.", syntax: "seen = set()\nif x not in seen:\n    seen.add(x)\na | b  # union\na & b  # intersection", example: "Track processed file names.", de: "Dedupe customer_ids before merge to dimension table.", mistake: "Expecting set to preserve order (use dict.fromkeys).", interview: "Set vs dict keys?", practice: "Practice #5" },
  { n: 6, title: "Dictionaries", concept: "Key-value maps; JSON-like records and lookup tables.", syntax: 'row = {"id": 1, "name": "Ada"}\nrow.get("email", "")\nrow["status"] = "active"', example: "Map source column → target column.", de: "Config-driven transforms: `FIELD_MAP = {\"cust_id\": \"customer_id\"}`.", mistake: "KeyError on missing keys — use `.get()`.", interview: "Average time complexity of dict lookup?", practice: "Practice #6" },
  { n: 7, title: "if / elif / else", concept: "Branch on data quality rules and environment.", syntax: 'if env == "prod":\n    level = "ERROR"\nelif env == "staging":\n    level = "WARNING"\nelse:\n    level = "DEBUG"', example: "Route bad rows to quarantine.", de: "If null rate > threshold → fail pipeline (Great Expectations style).", mistake: "Deep nesting — extract functions early.", interview: "Truthy values in Python?", practice: "Practice #7" },
  { n: 8, title: "for / while", concept: "Iterate files, chunks, and retry loops.", syntax: "for path in files:\n    process(path)\n\nwhile retries < 3:\n    try: break\n    except: retries += 1", example: "Loop over partition folders.", de: "Chunk-read CSV with while + read(n).", mistake: "Modifying list while iterating — iterate copy.", interview: "When prefer while over for?", practice: "Practice #8" },
  { n: 9, title: "Functions", concept: "Reusable transforms; keep ETL steps pure where possible.", syntax: "def normalize_email(row: dict) -> dict:\n    row = row.copy()\n    row[\"email\"] = row[\"email\"].strip().lower()\n    return row", example: "Single-responsibility transform functions.", de: "Unit-testable `parse_timestamp(val) -> datetime`.", mistake: "Side effects + return value mixed in one function.", interview: "What makes a function pure?", practice: "Practice #9" },
  { n: 10, title: "Lambda", concept: "Anonymous one-liners for sort keys and simple maps.", syntax: "sorted(rows, key=lambda r: r[\"amount\"], reverse=True)\nmap(lambda x: x.strip(), cols)", example: "Sort files by embedded date in name.", de: "Quick key in `sorted(files, key=lambda f: f.stat().st_mtime)`.", mistake: "Complex lambdas — use def for readability.", interview: "Lambda limitations?", practice: "Practice #10" },
  { n: 11, title: "Comprehensions", concept: "Concise list/dict/set builders — idiomatic in pipelines.", syntax: "evens = [n for n in nums if n % 2 == 0]\nby_id = {r[\"id\"]: r for r in rows}\ntags = {t for r in rows for t in r[\"tags\"]}", example: "Filter invalid rows before load.", de: "Build column rename dict from schema YAML.", mistake: "Nested comprehensions harming readability.", interview: "List comp vs map/filter?", practice: "Practice #11" },
  { n: 12, title: "enumerate()", concept: "Index + value while iterating.", syntax: "for i, row in enumerate(rows, start=1):\n    row[\"line_no\"] = i", example: "Attach row numbers for error reports.", de: "Log chunk index in parallel file processing.", mistake: "Manual counter variable when enumerate suffices.", interview: "Why start=1 in enumerate?", practice: "Practice #12" },
  { n: 13, title: "zip()", concept: "Pair iterables — align columns from parallel lists.", syntax: "for name, val in zip(columns, values):\n    record[name] = val", example: "Transpose paired arrays to records.", de: "Combine extracted keys/values from malformed CSV repair.", mistake: "Unequal lengths silently truncate — use strict= (3.10+).", interview: "zip longest vs strict?", practice: "Practice #13" },
  { n: 14, title: "map / filter", concept: "Functional-style transforms on iterables.", syntax: "clean = list(map(str.strip, headers))\nvalid = list(filter(lambda r: r[\"amount\"] > 0, rows))", example: "Strip all string fields.", de: "Pre-filter null keys before DataFrame creation.", mistake: "map in Py3 returns iterator — wrap list() if needed.", interview: "map vs comprehension performance?", practice: "Practice #14" },
  { n: 15, title: "Sorting", concept: "Order events, files, and ranked metrics.", syntax: "sorted(rows, key=lambda r: r[\"ts\"])\nrows.sort(key=lambda r: r[\"amount\"], reverse=True)", example: "Sort events before sessionization.", de: "Order files for incremental watermark processing.", mistake: "Sorting huge lists in memory — use Spark/external sort.", interview: "sorted() vs list.sort()?", practice: "Practice #15" },
  { n: 16, title: "Exception Handling", concept: "Fail gracefully; separate retryable vs fatal errors.", syntax: "try:\n    load(path)\nexcept FileNotFoundError:\n    log.error(\"missing %s\", path)\n    raise\nexcept Exception as e:\n    log.exception(\"load failed\")\n    raise PipelineError(str(e)) from e", example: "Wrap vendor API errors.", de: "Retry only on `requests.Timeout`, not on 400.", mistake: "Bare `except:` swallowing KeyboardInterrupt.", interview: "raise from e — why?", practice: "Practice #16" },
  { n: 17, title: "File Handling", concept: "Read/write text and binary; always close resources.", syntax: 'with open(path, "r", encoding="utf-8") as f:\n    data = f.read()', example: "Read control file with last watermark.", de: "Write audit log append-only with UTF-8.", mistake: "Default encoding on Windows — always specify utf-8.", interview: "Text vs binary mode?", practice: "Practice #17" },
  { n: 18, title: "CSV", concept: "Tabular text interchange; know csv module vs pandas.", syntax: 'import csv\nwith open("t.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        process(row)', example: "Lightweight ingestion without pandas.", de: "Stream millions of rows with DictReader + batch insert.", mistake: "Forgetting `newline=\"\"` on Windows.", interview: "csv vs pandas.read_csv when?", practice: "Practice #18" },
  { n: 19, title: "JSON", concept: "Semi-structured API and document payloads.", syntax: "import json\ndata = json.loads(text)\njson.dumps(obj, default=str)", example: "Parse REST API response.", de: "Flatten nested `user.address.city` for bronze JSONL.", mistake: "datetime not JSON serializable — use default=str or isoformat.", interview: "json.loads vs ast.literal_eval?", practice: "Practice #19" },
  { n: 20, title: "with statement", concept: "Context managers guarantee cleanup (files, DB connections).", syntax: "from contextlib import contextmanager\n\n@contextmanager\ndef timed(step):\n    start = time.perf_counter()\n    yield\n    log.info(\"%s %.2fs\", step, time.perf_counter()-start)", example: "Auto-close DB cursor.", de: "Wrap Synapse connection in `with engine.connect() as conn`.", mistake: "Manual open/close without try/finally.", interview: "How does `with` work internally?", practice: "Practice #20" },
];

// Pandas topics (36) - condensed blocks for generator
const pandasTopics = [
  { n: 1, title: "Series", concept: "1D labeled array — column or metric vector.", syntax: "import pandas as pd\ns = pd.Series([1,2,3], index=[\"a\",\"b\",\"c\"])", example: "Single metric time series.", de: "Extract `df[\"amount\"]` for aggregations.", mistake: "Confusing Series index with DataFrame index.", interview: "Series vs list?", practice: "Practice #21" },
  { n: 2, title: "DataFrame", concept: "2D table — primary pandas abstraction for DE.", syntax: "df = pd.DataFrame(rows)\ndf.shape\ndf.columns\ndf.dtypes", example: "Hold batch extract.", de: "Bronze layer staging before Delta write.", mistake: "Assuming DataFrame is always in-memory safe at TB scale.", interview: "DataFrame internals at high level?", practice: "Practice #22" },
  { n: 3, title: "read_csv()", concept: "Load delimited files with dtype and parse control.", syntax: 'df = pd.read_csv("t.csv", dtype={"id": str}, parse_dates=["ts"], usecols=[...])', example: "Ingest daily export.", de: "Force `customer_id` str to preserve leading zeros.", mistake: "Inferring bad dtypes (IDs as float).", interview: "read_csv performance tips?", practice: "Practice #23" },
  { n: 4, title: "read_json()", concept: "Load JSON lines or records.", syntax: 'df = pd.read_json("events.jsonl", lines=True)', example: "API dump to DataFrame.", de: "Normalize nested JSON with `pd.json_normalize`.", mistake: "Loading huge JSON in one shot.", interview: "json_normalize use case?", practice: "Practice #24" },
  { n: 5, title: "read_excel()", concept: "Business user exports — less common in prod pipelines.", syntax: 'df = pd.read_excel("report.xlsx", sheet_name="Data")', example: "Ad-hoc SME file.", de: "Prefer CSV/Parquet in automation; excel for manual uploads.", mistake: "Excel date serial confusion.", interview: "Why avoid excel in production?", practice: "Practice #25" },
  { n: 6, title: "DataFrame creation", concept: "From dict, list of dicts, numpy, SQL.", syntax: "df = pd.DataFrame.from_records(rows)\ndf = pd.DataFrame(data, columns=cols)", example: "Materialize API page.", de: "Create QA sample DataFrame for unit tests.", mistake: "Unequal length dict values.", interview: "from_records vs DataFrame constructor?", practice: "Practice #26" },
  { n: 7, title: "head / tail / info / describe", concept: "Exploratory profiling in notebooks and debugging.", syntax: "df.head()\ndf.info()\ndf.describe(include=\"all\")", example: "Profile new source.", de: "Check null % before promoting to silver.", mistake: "Only head() on skewed data — sample fairly.", interview: "What does info() show?", practice: "Practice #27" },
  { n: 8, title: "Selecting columns", concept: "Bracket and attribute access.", syntax: 'df[["id","amount"]]\ndf["amount"]  # Series', example: "Project staging columns.", de: "Select PII columns for masking step.", mistake: "df.col vs df[\"col\"] with spaces in names.", interview: "Chained indexing risk?", practice: "Practice #28" },
  { n: 9, title: "loc", concept: "Label-based row/column selection.", syntax: 'df.loc[df["amount"] > 0, ["id","amount"]]\ndf.loc[0:5, "name"]  # inclusive end for labels', example: "Filter + project.", de: "Update status for batch: `df.loc[mask, \"status\"] = \"processed\"`.", mistake: "SettingWithCopyWarning via chained loc.", interview: "loc vs iloc?", practice: "Practice #29" },
  { n: 10, title: "iloc", concept: "Position-based selection.", syntax: "df.iloc[0:100, 0:3]\ndf.iloc[:, -1]", example: "Sample first chunk.", de: "Inspect schema from first row positions.", mistake: "Mixing loc/iloc semantics (inclusive vs exclusive).", interview: "When iloc over loc?", practice: "Practice #30" },
  { n: 11, title: "Filtering", concept: "Boolean masks on rows.", syntax: 'df[df["country"] == "IN"]\ndf[df["email"].notna()]', example: "Active customers only.", de: "Filter partition `dt == run_date`.", mistake: "Using and/or instead of & | with parentheses.", interview: "Why & not and?", practice: "Practice #31" },
  { n: 12, title: "Multiple conditions", concept: "Combine masks with & | ~.", syntax: '(df["a"] > 0) & (df["b"].isin(["x","y"]))', example: "Complex business rules.", de: "Valid orders: paid & not cancelled & amount>0.", mistake: "Missing parentheses around each condition.", interview: "isin vs multiple ==" , practice: "Practice #32" },
  { n: 13, title: "Sorting", concept: "Order for window logic and exports.", syntax: 'df.sort_values(["customer_id","ts"], ascending=[True, True])', example: "Sort events per user.", de: "Prepare for `groupby` + `shift` lag features.", mistake: "Not resetting index after sort when order matters.", interview: "stable sort in pandas?", practice: "Practice #33" },
  { n: 14, title: "rename", concept: "Align to target schema.", syntax: 'df.rename(columns={"cust_id": "customer_id"}, inplace=False)', example: "Standardize names.", de: "Map source → medallion column names.", mistake: "inplace=True hiding immutability in pipelines.", interview: "rename vs assign columns?", practice: "Practice #34" },
  { n: 15, title: "astype", concept: "Cast dtypes for memory and correctness.", syntax: 'df["id"] = df["id"].astype(str)\ndf["amount"] = pd.to_numeric(df["amount"], errors="coerce")', example: "Fix string numbers.", de: "Downcast ints for memory on wide tables.", mistake: "astype on values that fail — use to_numeric.", interview: "category dtype when?", practice: "Practice #35" },
  { n: 16, title: "to_datetime", concept: "Parse heterogeneous date strings to datetime64.", syntax: 'df["ts"] = pd.to_datetime(df["ts"], utc=True, errors="coerce")', example: "Unify formats.", de: "Store UTC in lakehouse; convert at BI layer.", mistake: "Naive vs aware datetime mix.", interview: "errors=coerce effect?", practice: "Practice #36" },
  { n: 17, title: "Missing values", concept: "NA semantics differ by dtype (NaN, NaT, None).", syntax: "df.isna().sum()\ndf.notna()", example: "Null rate report.", de: "DQ gate: reject if key column null rate > 1%.", mistake: "Comparing NaN with ==.", interview: "None vs NaN?", practice: "Practice #37" },
  { n: 18, title: "fillna", concept: "Impute or default missing values.", syntax: 'df["score"].fillna(df["score"].median())\ndf.fillna({"country": "UNK"})', example: "Default unknown category.", de: "Forward-fill time series gaps cautiously in finance.", mistake: "fillna before understanding why null.", interview: "fillna vs replace?", practice: "Practice #38" },
  { n: 19, title: "dropna", concept: "Remove incomplete rows/columns.", syntax: 'df.dropna(subset=["customer_id"])\ndf.dropna(axis=1, thresh=len(df)*0.9)', example: "Drop rows without keys.", de: "Drop sparse columns from API schema drift.", mistake: "Dropping too aggressively without audit.", interview: "how=any vs all?", practice: "Practice #39" },
  { n: 20, title: "duplicated", concept: "Detect duplicate keys.", syntax: 'df.duplicated(subset=["order_id"], keep="first")', example: "Find dup loads.", de: "CDC dedupe: keep last by `updated_at`.", mistake: "Not specifying subset — full row dup only.", interview: "keep=last use case?", practice: "Practice #40" },
  { n: 21, title: "drop_duplicates", concept: "Dedupe for silver tables.", syntax: 'df.drop_duplicates(subset=["id"], keep="last")', example: "Latest record per key.", de: "Idempotent reload: dedupe on business key.", mistake: "Dropping without sort on tie-breaker column.", interview: "dedupe in pandas vs Delta MERGE?", practice: "Practice #41" },
  { n: 22, title: "groupby", concept: "Split-apply-combine aggregations.", syntax: 'df.groupby("region")["sales"].sum()\ndf.groupby(["region","product"]).agg(...)', example: "Daily revenue by region.", de: "Same logic you'll write in SQL GROUP BY / Spark.", mistake: "Forgetting groupby keys in result index.", interview: "groupby lazy until agg?", practice: "Practice #42" },
  { n: 23, title: "agg", concept: "Multiple metrics per group.", syntax: 'df.groupby("cat").agg(total=("amt","sum"), n=("id","nunique"))', example: "Summary stats.", de: "Pipeline metrics per source file.", mistake: "Named aggregation vs dict confusion (pandas 1+).", interview: "agg vs apply on groupby?", practice: "Practice #43" },
  { n: 24, title: "transform", concept: "Return same shape as input — normalize within group.", syntax: 'df["z"] = df.groupby("g")["x"].transform(lambda s: (s-s.mean())/s.std())', example: "Per-group fill.", de: "Rank within department without collapsing rows.", mistake: "Using agg when you need row-level output.", interview: "transform vs apply?", practice: "Practice #44" },
  { n: 25, title: "merge", concept: "SQL-like joins on keys.", syntax: 'df.merge(dim, on="customer_id", how="left")', example: "Enrich fact with dimension.", de: "Same as Synapse JOIN in pandas-scale data.", mistake: "Many-to-many explosion without uniqueness check.", interview: "merge vs join method?", practice: "Practice #45" },
  { n: 26, title: "concat", concept: "Stack DataFrames vertically or horizontally.", syntax: "pd.concat([df1, df2], ignore_index=True)", example: "Union daily files.", de: "Combine batch extracts before single Parquet write.", mistake: "Column misalignment across files.", interview: "concat vs append (deprecated)?", practice: "Practice #46" },
  { n: 27, title: "join", concept: "Index-based join alternative to merge.", syntax: "a.join(b, how=\"left\")", example: "When index is natural key.", de: "Less common in ETL — prefer explicit merge on columns.", mistake: "Accidental duplicate index labels.", interview: "When use join over merge?", practice: "Practice #47" },
  { n: 28, title: "pivot", concept: "Reshape without aggregation (duplicates raise error).", syntax: 'df.pivot(index="dt", columns="product", values="qty")', example: "Matrix without agg.", de: "Rare in pipelines — pivot_table more common.", mistake: "Duplicate index/col pairs.", interview: "pivot vs pivot_table?", practice: "Practice #48" },
  { n: 29, title: "pivot_table", concept: "Aggregated wide reports.", syntax: 'df.pivot_table(index="region", columns="product", values="sales", aggfunc="sum", fill_value=0)', example: "Sales matrix.", de: "Excel-like report in notebook before Power BI.", mistake: "Not filling NaN after pivot.", interview: "margins parameter?", practice: "Practice #49" },
  { n: 30, title: "melt", concept: "Wide → long (unpivot).", syntax: 'pd.melt(df, id_vars=["id"], value_vars=["q1","q2"], var_name="quarter", value_name="rev")', example: "Normalize metrics columns.", de: "Prepare for Spark tidy format.", mistake: "Melting ID columns accidentally.", interview: "melt vs stack?", practice: "Practice #50" },
  { n: 31, title: "apply", concept: "Row/column-wise custom functions — slow but flexible.", syntax: 'df["email"].apply(lambda x: x.lower())', example: "Custom parse.", de: "Last resort — prefer vectorized/string ops.", mistake: "apply(axis=1) on millions of rows.", interview: "apply vs vectorization?", practice: "Practice #51" },
  { n: 32, title: "Vectorization", concept: "C-level ops on whole columns — always prefer.", syntax: 'df["total"] = df["qty"] * df["price"]\ndf["flag"] = df["amount"] > 100', example: "Fast derived columns.", de: "Same mindset as Spark column expressions.", mistake: "Python loops over rows.", interview: "Why vectorization faster?", practice: "Practice #52" },
  { n: 33, title: "String operations", concept: "Vectorized str accessor.", syntax: 'df["email"].str.lower().str.contains("@")\ndf["code"].str.replace("-", "", regex=False)', example: "Clean text fields.", de: "Regex extract from log column.", mistake: "Applying regex without na=False.", interview: "str vs apply for strings?", practice: "Practice #53" },
  { n: 34, title: "Date operations", concept: "dt accessor for components and arithmetic.", syntax: 'df["ts"].dt.year\ndf["ts"].dt.tz_convert("Asia/Kolkata")', example: "Partition key from timestamp.", de: "Derive `dt=ts.dt.date` for hive partitions.", mistake: "Timezone-naive comparisons.", interview: "dt.floor vs resample?", practice: "Practice #54" },
  { n: 35, title: "MultiIndex", concept: "Hierarchical index/columns for complex reports.", syntax: "df.set_index([\"region\",\"product\"])", example: "Nested aggregation display.", de: "Understand before reading advanced BI exports.", mistake: "Accidental MultiIndex after groupby.", interview: "reset_index when?", practice: "Practice #55" },
  { n: 36, title: "Memory optimization", concept: "category, downcast, selective columns.", syntax: 'df["country"] = df["country"].astype("category")\npd.to_numeric(df["x"], downcast="integer")', example: "Fit in laptop RAM.", de: "When data grows → Parquet + Spark on Databricks.", mistake: "read_csv everything as float64.", interview: "When leave pandas for Spark?", practice: "Practice #56" },
];

// Advanced (33), DE (36), Traps (20) - use shorter generator from templates
function shortTopics(chapter, items) {
  return items.map((t, i) => block({ n: i + 1, ...t }));
}

const advancedTopics = shortTopics("Advanced", [
  { title: "Iterators", concept: "Object with __iter__/__next__; consumes stream.", example: "File line iterator.", de: "Stream JSONL without loading full file.", mistake: "Exhausted iterator reused.", interview: "Iterator protocol?", practice: "" },
  { title: "Iterables", concept: "Anything you can loop over (list, dict keys, generator).", example: "for x in data.", de: "Any extract yielding rows.", mistake: "Thinking list is only iterable.", interview: "Iterable vs iterator?", practice: "" },
  { title: "Generators", concept: "Lazy iterator from function with yield.", example: "yield row batches.", de: "Memory-flat ETL over large CSV.", mistake: "Materializing generator to list unnecessarily.", interview: "Generator vs list memory?", practice: "" },
  { title: "yield", concept: "Pause function preserving state.", example: "Paginated API fetch loop.", de: "Yield chunks to downstream writer.", mistake: "Mixing return and yield carelessly.", interview: "yield vs return?", practice: "" },
  { title: "Generator expressions", concept: "(x for x in iterable) — lazy comprehension.", example: "Sum without building list.", de: "Stream filter map in pure Python.", mistake: "Using list comp when gen enough.", interview: "Gen exp vs list comp?", practice: "" },
  { title: "Decorators", concept: "Wrap functions for logging, retry, timing.", example: "@retry decorator.", de: "Standardize ADF/Python activity logging.", mistake: "Decorators hiding signature (use functools.wraps).", interview: "Write a retry decorator?", practice: "" },
  { title: "Closures", concept: "Inner function capturing outer variables.", example: "Factory functions.", de: "Configurable transform closures.", mistake: "Late binding in loops.", interview: "Closure use case?", practice: "" },
  { title: "*args", concept: "Variable positional arguments tuple.", example: "Generic wrapper.", de: "Pass through pipeline hooks.", mistake: "Overusing *args hurting clarity.", interview: "*args vs **kwargs?", practice: "" },
  { title: "**kwargs", concept: "Variable keyword arguments dict.", example: "Config overrides.", de: "Optional Spark session builder args.", mistake: "Typos in kw silently wrong if no **.", interview: "kwargs in production APIs?", practice: "" },
  { title: "unpacking", concept: "* and ** in assignment and calls.", example: "merge dicts {**a,**b}.", de: "Spread config layers.", mistake: "Unpacking wrong order.", interview: "Extended unpacking?", practice: "" },
  { title: "OOP — class", concept: "Bundle state + behavior.", example: "Pipeline class.", de: "Extractor/Loader classes in OOP ETL.", mistake: "God classes doing everything.", interview: "When OOP in ETL?", practice: "" },
  { title: "inheritance", concept: "Reuse base extractor.", example: "BaseAPIClient subclasses.", de: "Shared retry in base class.", mistake: "Deep inheritance trees.", interview: "Composition over inheritance?", practice: "" },
  { title: "composition", concept: "Has-a instead of is-a.", example: "Pipeline has Validator.", de: "Prefer in DE for testability.", mistake: "Inheritance for code reuse only.", interview: "Composition example?", practice: "" },
  { title: "__init__", concept: "Initialize instance state.", example: "Store connection config.", de: "SparkSession builder wrapper.", mistake: "Heavy work in __init__.", interview: "__init__ vs __new__?", practice: "" },
  { title: "__str__ / __repr__", concept: "Debug representations.", example: "Readable job name.", de: "Log friendly object repr.", mistake: "repr missing for debugging.", interview: "str vs repr?", practice: "" },
  { title: "dataclasses", concept: "Boilerplate-free data containers.", example: "@dataclass Config.", de: "Typed pipeline config objects.", mistake: "Mutable defaults without field(default_factory).", interview: "dataclass vs dict?", practice: "" },
  { title: "typing", concept: "Static hints for maintainability.", example: "def f(x: int) -> str.", de: "mypy on transform modules.", mistake: "Hints without enforcement.", interview: "typing benefits?", practice: "" },
  { title: "Optional / List / Dict hints", concept: "Express nullable and collections.", example: "Optional[str].", de: "Document DataFrame-ish dict rows.", mistake: "Optional[str] = None confusion.", interview: "Union vs Optional?", practice: "" },
  { title: "Callable", concept: "Type hint for function params.", example: "Callable[[dict], dict].", de: "Plugin transform registry.", mistake: "Overly complex Callable signatures.", interview: "Callable use?", practice: "" },
  { title: "Context managers", concept: "__enter__/__exit__ or @contextmanager.", example: "DB transaction scope.", de: "Unit of work around load.", mistake: "Suppressing exceptions in __exit__.", interview: "contextlib.contextmanager?", practice: "" },
  { title: "Custom exceptions", concept: "PipelineError hierarchy.", example: "class DQError(Exception).", de: "Catch retryable vs fatal.", mistake: "Catching Exception everywhere.", interview: "When custom exceptions?", practice: "" },
  { title: "shallow copy", concept: "copy.copy — new container, shared nested objects.", example: "Copy list of dicts.", de: "Mutating copy affects nested dict.", mistake: "Thinking copy is deep.", interview: "Shallow copy scenario?", practice: "" },
  { title: "deep copy", concept: "copy.deepcopy — recursive copy.", example: "Isolate template row.", de: "Safe branch for what-if transform.", mistake: "Performance on large structures.", interview: "When deepcopy?", practice: "" },
  { title: "Mutability", concept: "Lists/dicts mutable; tuples/str immutable.", example: "In-place sort vs sorted.", de: "Avoid mutating shared config dict.", mistake: "Default mutable args.", interview: "Mutable default trap?", practice: "" },
  { title: "Memory model", concept: "References, id(), interning.", example: "Same object multiple names.", de: "Large object passed by reference.", mistake: "Unexpected aliasing.", interview: "is compares identity?", practice: "" },
  { title: "GIL", concept: "One bytecode thread at a time in CPython.", example: "CPU threads don't parallelize.", de: "Use multiprocessing or Spark for CPU ETL.", mistake: "Threading for CPU-heavy pandas.", interview: "GIL impact on ETL?", practice: "" },
  { title: "multiprocessing", concept: "Separate processes bypass GIL.", example: "Parallel file conversion.", de: "Pool per partition file.", mistake: "Huge pickle overhead.", interview: "multiprocessing vs threading?", practice: "" },
  { title: "threading", concept: "Threads for I/O wait.", example: "Parallel HTTP fetches.", de: "Thread pool for API ingestion.", mistake: "Threads for CPU pandas ops.", interview: "When threads help?", practice: "" },
  { title: "async basics", concept: "async/await for concurrent I/O.", example: "aiohttp fetches.", de: "High concurrency API harvest.", mistake: "async inside CPU pandas.", interview: "async vs threads?", practice: "" },
]);

const deTopics = shortTopics("DE", [
  { title: "ETL architecture", concept: "Layers: extract → validate → transform → load → monitor.", example: "Medallion bronze/silver/gold.", de: "Map to ADF pipelines + Databricks notebooks.", mistake: "Monolithic script.", interview: "Describe your ETL design?", practice: "Practice #57" },
  { title: "Extract / Transform / Load", concept: "Separation of concerns.", example: "Extract raw, transform in pandas/Spark, load Delta.", de: "ADF Copy → Notebook → Synapse.", mistake: "Transform during extract.", interview: "ETL vs ELT?", practice: "" },
  { title: "Pipeline design", concept: "Idempotent, observable, modular stages.", example: "DAG of small jobs.", de: "Airflow/ADF orchestration.", mistake: "No failure boundaries.", interview: "Restart from failure?", practice: "" },
  { title: "Modular Python", concept: "Packages: extract/, transform/, load/, tests/.", example: "importable modules.", de: "Wheel deployed to Databricks.", mistake: "Copy-paste transforms.", interview: "Folder structure?", practice: "" },
  { title: "Configuration management", concept: "YAML/env based config, not hardcoded.", example: "config/dev.yaml.", de: "ADF parameters + Key Vault refs.", mistake: "Secrets in git.", interview: "12-factor config?", practice: "" },
  { title: "Environment variables", concept: "os.environ for runtime config.", example: "DB_HOST, BATCH_DATE.", de: "Databricks secrets scope → env.", mistake: "Missing env in prod.", interview: "dotenv vs vault?", practice: "" },
  { title: "Logging", concept: "structured logs with levels.", example: "logging.getLogger(__name__).", de: "Azure Monitor / Log Analytics.", mistake: "print in production.", interview: "logging vs print?", practice: "" },
  { title: "Retry mechanisms", concept: "Retry transient failures only.", example: "tenacity / custom decorator.", de: "ADF retry policy + Python backoff.", mistake: "Retry non-idempotent writes.", interview: "Idempotent retry?", practice: "" },
  { title: "Exponential backoff", concept: "Increase delay between retries.", example: "1s,2s,4s cap 30s.", de: "API rate limit handling.", mistake: "Infinite retries.", interview: "Backoff formula?", practice: "" },
  { title: "Idempotency", concept: "Same input → same output, safe rerun.", example: "MERGE on key.", de: "Delta merge, partition overwrite.", mistake: "Append-only duplicates.", interview: "How ensure idempotent?", practice: "Practice #58" },
  { title: "Checkpointing", concept: "Persist progress for resume.", example: "Watermark file.", de: "ADF tumbling window checkpoint.", mistake: "No checkpoint on long jobs.", interview: "Checkpoint vs watermark?", practice: "" },
  { title: "Watermarks", concept: "High-water mark for incremental.", example: "last_modified > @wm.", de: "Synapse incremental copy.", mistake: "Clock skew on watermark column.", interview: "Late arriving data?", practice: "" },
  { title: "Incremental processing", concept: "Only new/changed rows.", example: "CDC merge.", de: "ADF incremental + Delta MERGE.", mistake: "Full reload daily at scale.", interview: "CDC strategies?", practice: "" },
  { title: "Batch processing", concept: "Scheduled bulk loads.", example: "Nightly ETL.", de: "ADF schedule trigger.", mistake: "Wrong batch size for memory.", interview: "Batch vs streaming?", practice: "" },
  { title: "API ingestion", concept: "HTTP extract with auth and pagination.", example: "requests session.", de: "REST → bronze JSONL.", mistake: "No timeout.", interview: "Handle 429?", practice: "Practice #59" },
  { title: "Pagination", concept: "cursor/page until exhausted.", example: "while next_url.", de: "Graph API @odata.nextLink.", mistake: "Missing last page.", interview: "Offset vs cursor pagination?", practice: "" },
  { title: "Rate limiting", concept: "Respect API quotas.", example: "sleep + backoff.", de: "Throttle parallel workers.", mistake: "Hammering API.", interview: "Token bucket?", practice: "" },
  { title: "JSON processing", concept: "json.loads, json_normalize.", example: "Nested API docs.", de: "Bronze semi-structured.", mistake: "Huge single JSON array in memory.", interview: "JSON vs Parquet?", practice: "" },
  { title: "CSV processing", concept: "Streaming csv module or pandas chunks.", example: "chunksize=50_000.", de: "Land CSV → convert Parquet.", mistake: "Full read 20GB file.", interview: "chunksize pattern?", practice: "" },
  { title: "Parquet", concept: "Columnar compressed analytical format.", example: "df.to_parquet.", de: "ADLS gold layer standard.", mistake: "CSV in production lake.", interview: "Why Parquet?", practice: "" },
  { title: "Database connectivity", concept: "Drivers: pyodbc, psycopg2, sqlalchemy.", example: "read_sql query.", de: "Synapse/SQL DB extract.", mistake: "No connection timeout.", interview: "Connection pooling?", practice: "" },
  { title: "SQLAlchemy basics", concept: "Engine, connection, execute.", example: "with engine.connect().", de: "Parameterized SQL extract.", mistake: "SQL injection via f-strings.", interview: "ORM vs Core for ETL?", practice: "" },
  { title: "Secrets management", concept: "Never hardcode credentials.", example: "Key Vault, Databricks secrets.", de: "ADF Key Vault linked service.", mistake: "Secrets in logs.", interview: "Rotate secrets how?", practice: "" },
  { title: "Unit testing", concept: "pytest on pure transforms.", example: "assert normalize(x)==y.", de: "CI gate before deploy.", mistake: "No tests on business rules.", interview: "What to test in ETL?", practice: "" },
  { title: "Mocking", concept: "unittest.mock patch external IO.", example: "patch requests.get.", de: "Test without hitting API.", mistake: "Over-mocking implementation.", interview: "mock vs fixture?", practice: "" },
  { title: "Data validation", concept: "Rules on schema, ranges, nulls.", example: "assert df.shape[1]==N.", de: "Great Expectations / custom.", mistake: "Validate after load only.", interview: "Fail vs quarantine?", practice: "" },
  { title: "Schema validation", concept: "Required columns and dtypes.", example: "pandera / custom.", de: "Contract testing source vs bronze.", mistake: "Silent schema drift.", interview: "Schema evolution?", practice: "" },
  { title: "Packaging", concept: "setup.py/pyproject for deployable libs.", example: "internal etl_utils wheel.", de: "Databricks cluster library.", mistake: "Notebook-only spaghetti.", interview: "Package vs notebook?", practice: "" },
  { title: "Virtual environments", concept: "Isolate dependencies per project.", example: "python -m venv .venv.", de: "Match Databricks runtime versions.", mistake: "Global pip breaks jobs.", interview: "venv vs conda?", practice: "" },
  { title: "requirements.txt", concept: "Pinned dependencies.", example: "pandas==2.2.*.", de: "Recreate cluster env.", mistake: "Unpinned prod deploys.", interview: "Pin all versions?", practice: "" },
  { title: "argparse", concept: "CLI for batch jobs.", example: "--date 2024-01-01.", de: "ADF passes parameters to script.", mistake: "No validation on CLI args.", interview: "argparse vs click?", practice: "" },
  { title: "pathlib", concept: "Object-oriented paths.", example: "Path(\"data\")/f\"{dt}.csv\".", de: "Cross-platform ADLS local dev.", mistake: "String path concat.", interview: "Path vs os.path?", practice: "" },
  { title: "subprocess", concept: "Run external CLI tools.", example: "subprocess.run([\"az\", ...]).", de: "Invoke sqlpackage/azcopy cautiously.", mistake: "shell=True injection.", interview: "subprocess safety?", practice: "" },
  { title: "Production folder structure", concept: "src/, tests/, config/, scripts/.", example: "Cookiecutter data project.", de: "Repo per pipeline domain.", mistake: "Everything in one notebook.", interview: "Layout you use?", practice: "" },
]);

const trapTopics = shortTopics("Traps", [
  { title: "GIL", concept: "CPU-bound Python threads don't scale.", example: "Slow thread pool on pandas.", de: "Move to Spark on Databricks.", mistake: "16 threads on CPU transform.", interview: "GIL + ETL?", practice: "" },
  { title: "Mutable vs immutable", concept: "Mutate shared state carefully.", example: "dict in default arg.", de: "Copy rows before transform.", mistake: "In-place surprise.", interview: "Examples of each?", practice: "" },
  { title: "List vs tuple", concept: "Mutability and hashing.", example: "tuple as dict key.", de: "Fixed schema record.", mistake: "List as dict key.", interview: "When tuple?", practice: "" },
  { title: "Set vs dict", concept: "Set = keys only; dict = key-value.", example: "membership vs lookup.", de: "seen_ids set.", mistake: "Using list for membership.", interview: "Complexity?", practice: "" },
  { title: "is vs ==", concept: "Identity vs equality.", example: "is None.", de: "Compare singletons with is.", mistake: "is for value compare.", interview: "is vs ==?", practice: "" },
  { title: "Shallow vs deep copy", concept: "Nested mutation.", example: "list of dicts.", de: "Template row copy.", mistake: "Shallow when need deep.", interview: "Demonstrate?", practice: "" },
  { title: "Default mutable arguments", concept: "Shared default list/dict.", example: "def f(x=[]).", de: "Bug in accumulators.", mistake: "Mutable defaults.", interview: "Fix pattern?", practice: "" },
  { title: "Late binding closures", concept: "Loop variable captured at call.", example: "lambda i=i.", de: "Factory in dynamic tasks.", mistake: "All lambdas same i.", interview: "Explain late binding?", practice: "" },
  { title: "LEGB scope", concept: "Local, Enclosing, Global, Built-in.", example: "Name resolution.", de: "Understand globals in notebooks.", mistake: "Unintended global mutation.", interview: "LEGB?", practice: "" },
  { title: "Generators vs lists", concept: "Memory trade-off.", example: "gen vs list comp.", de: "Stream large files.", mistake: "list(gen) too early.", interview: "When generator?", practice: "" },
  { title: "map vs list comprehension", concept: "Readability and speed.", example: "prefer comp in Python.", de: "Readable transforms.", mistake: "Nested map.", interview: "Preference?", practice: "" },
  { title: "apply vs vectorization", concept: "apply is slow Python loop.", example: "str.lower vectorized.", de: "Spark column expr mindset.", mistake: "apply axis=1 everywhere.", interview: "Speed difference?", practice: "" },
  { title: "pandas memory", concept: "object dtype, copies.", example: "category, downcast.", de: "Spark when RAM exceeded.", mistake: "read all columns.", interview: "20GB CSV?", practice: "" },
  { title: "SettingWithCopyWarning", concept: "Chained indexing ambiguous copy.", example: "use .loc on copy.", de: "df = df.copy() before mutate.", mistake: "Chained brackets.", interview: "Fix warning?", practice: "" },
  { title: "merge duplication", concept: "Many-to-many row explosion.", example: "validate unique keys.", de: "Pre-dedupe dimensions.", mistake: "Blind merge.", interview: "Detect m:m?", practice: "" },
  { title: "NULL handling", concept: "NaN propagation.", example: "fillna, dropna consciously.", de: "SQL NULL semantics in pandas.", mistake: "== None on NaN.", interview: "None vs NaN?", practice: "" },
  { title: "dtype problems", concept: "Silent coercion.", example: "to_numeric errors=coerce.", de: "ID columns as str.", mistake: "float IDs.", interview: "Prevent coercion?", practice: "" },
  { title: "Timezone problems", concept: "Naive vs aware.", example: "utc=True.", de: "Store UTC in lake.", mistake: "Mixed tz compare.", interview: "Best practice?", practice: "" },
  { title: "pandas vs PySpark", concept: "Single-node vs distributed.", example: "pandas laptop; Spark cluster.", de: "Databricks PySpark for TB.", mistake: "pandas on 50GB.", interview: "When switch?", practice: "" },
  { title: "Python vs Spark execution", concept: "Driver collects vs distributed.", example: "toPandas() danger.", de: "Keep transforms in Spark.", mistake: "Collect huge RDD.", interview: "Lazy evaluation?", practice: "" },
]);

const notesFrontmatter = `---
title: Python Notes
description: Deep Python and pandas reference for Data Engineering interviews
parent: python
hidden: true
order: 1
difficulty: basic
---

`;

// Fix advanced/de/trap - they're strings from shortTopics join
const advancedBlocks = advancedTopics;
const deBlocks = deTopics;
const trapBlocks = trapTopics;

const fullNotes = notesFrontmatter + [
  "# Python Master Notes",
  "",
  "Built for **Data Engineering** interviews — Python → pandas → ETL → PySpark → Databricks/ADF.",
  "",
  "Each topic: **Concept → Syntax → Example → DE example → Mistake → Interview → Practice**",
  "",
  "---",
  "",
  "## Basic",
  "",
  "### Easy — Python Fundamentals",
  "",
  easyTopics.map(block).join("\n"),
  "---",
  "",
  "## Medium",
  "",
  "### Medium — Pandas",
  "",
  pandasTopics.map(block).join("\n"),
  "---",
  "",
  "## Advanced",
  "",
  "### Advanced Python",
  "",
  advancedBlocks,
  "---",
  "",
  "## Data Engineering",
  "",
  "### Data Engineering Python",
  "",
  deBlocks,
  "---",
  "",
  "## Patterns & Traps",
  "",
  trapBlocks,
].join("\n");

// ─── INTERVIEW 60 ───────────────────────────────────────────────────────────
const interviewQs = [
  ["List vs tuple?", "Lists are mutable, tuples immutable. Tuples usable as dict keys and for fixed records. DE: use tuples for composite group keys."],
  ["List vs set?", "Lists ordered; sets unique unordered with O(1) membership. DE: sets for dedupe/seen keys."],
  ["Dictionary internals?", "Hash table — O(1) average lookup. Keys must be hashable. DE: JSON-like rows."],
  ["Mutable vs immutable?", "Mutable: list, dict, set. Immutable: str, tuple, int, float. DE: copy before mutate in shared pipelines."],
  ["`is` vs `==`?", "`is` identity, `==` value. Use `is None`, not `== None`."],
  ["Shallow vs deep copy?", "Shallow shares nested objects; deep recursive. DE: deepcopy template rows."],
  ["What is LEGB?", "Name lookup: Local, Enclosing, Global, Built-in."],
  ["What are comprehensions?", "Concise list/dict/set builders. Prefer over map for readability."],
  ["`map()` vs comprehension?", "Comprehension more idiomatic; similar speed for simple cases."],
  ["`*args` vs `**kwargs`?", "Positional tuple vs keyword dict for flexible APIs."],
  ["What is an iterator?", "Object with __next__; consumes stream once."],
  ["What is an iterable?", "Can be looped; may produce fresh iterator each time."],
  ["What is a generator?", "Iterator from function with yield; memory efficient."],
  ["Why use `yield`?", "Lazy production of batches — flat memory on large files."],
  ["What is a decorator?", "Function wrapping another for cross-cutting concerns (retry, log)."],
  ["What is a closure?", "Inner function capturing outer scope variables."],
  ["What is a context manager?", "Guarantees setup/teardown via `with`."],
  ["What does `with` do?", "Calls __enter__/__exit__ — close files/connections."],
  ["What is GIL?", "Global Interpreter Lock — one bytecode thread at a time in CPython."],
  ["Threading vs multiprocessing?", "Threads for I/O; processes for CPU-bound work."],
  ["Series vs DataFrame?", "Series 1D; DataFrame 2D table."],
  ["`loc` vs `iloc`?", "Label vs position indexing."],
  ["`merge` vs `concat`?", "Join on keys vs stack tables."],
  ["`groupby`?", "Split-apply-combine aggregations."],
  ["`agg` vs `transform`?", "agg reduces groups; transform keeps row count."],
  ["`apply` vs vectorization?", "Vectorization uses C speed; apply is Python loop."],
  ["`pivot` vs `pivot_table`?", "pivot no agg; pivot_table aggregates."],
  ["How handle NULLs?", "isna, fillna, dropna — understand None vs NaN."],
  ["How remove duplicates?", "drop_duplicates with subset + keep + sort tie-breaker."],
  ["How optimize DataFrame memory?", "category dtype, downcast, read only needed columns."],
  ["How structure an ETL pipeline?", "Extract → validate → transform → load; modular functions; config/logging."],
  ["How make ETL idempotent?", "MERGE/upsert on business key; partition overwrite; dedupe."],
  ["How implement retries?", "Retry transient errors with capped exponential backoff."],
  ["What is exponential backoff?", "Increasing wait 1s,2s,4s… between retries."],
  ["How handle API pagination?", "Loop cursor/next link until exhausted."],
  ["How handle API failures?", "Classify 4xx fatal vs 5xx/timeout retry; log context."],
  ["How implement incremental loading?", "Watermark on updated_at; load only > last_wm."],
  ["What is a watermark?", "High-water mark timestamp/ID for incremental extracts."],
  ["How do you implement logging?", "logging module, structured fields, correct levels."],
  ["How do you test ETL?", "pytest pure transforms; mock IO; fixture DataFrames."],
  ["How handle schema changes?", "Schema registry, contract tests, evolve with defaults."],
  ["How manage secrets?", "Key Vault / Databricks secrets — never in code/git."],
  ["How process large CSV files?", "chunksize, csv reader, or Spark — never full read."],
  ["Why Parquet over CSV?", "Columnar, compressed, schema embedded — faster analytics."],
  ["When use pandas vs PySpark?", "pandas: single-node, interactive. PySpark: distributed TB+."],
  ["Python vs PySpark?", "Driver pandas collects; Spark distributes on cluster."],
  ["Pandas memory limitations?", "Bounded by driver RAM — typically < few GB practical."],
  ["What happens reading 20 GB CSV in pandas?", "OOM or extreme swap — don't do it."],
  ["How would you process 20 GB?", "Spark/Databricks, DuckDB, or chunked/streaming writes."],
  ["Why Spark for large datasets?", "Distributed memory/disk, fault tolerance, optimizer."],
  ["What is lazy evaluation?", "Spark builds DAG; executes on action — optimizes plan."],
  ["What is serialization?", "Pickle/Arrow for moving data between processes/executors."],
  ["GIL impact on ETL?", "CPU Python threads won't speed pandas; use processes or Spark."],
  ["How parallelize Python workloads?", "multiprocessing per file, Spark for data, async for I/O."],
  ["How make pipeline restartable?", "Checkpoints, watermarks, idempotent loads."],
  ["How prevent duplicate loads?", "MERGE keys, dedupe, idempotent partitions."],
  ["How handle partial failure?", "Stage quarantine, retry slices, dead-letter queue."],
  ["How monitor ETL pipeline?", "Metrics, alerts, row counts, duration, data quality KPIs."],
  ["How design reusable ETL components?", "Pure functions, config-driven maps, shared package."],
  ["Explain production Python pipeline end-to-end?", "Orchestrator (ADF) triggers extract → validate → transform in Databricks → Delta load → monitor/alert."],
];

let interviewMd = `---
title: Python Interview Q&A
description: 60 conceptual Python questions for Data Engineering interviews
parent: python
hidden: true
order: 3
difficulty: interview
---

# Python Interview Flashcards

`;

interviewQs.forEach(([q, a], i) => {
  interviewMd += `### ${i + 1}. ${q}\n\n${a}\n\n`;
});

// ─── PRACTICE 40 ────────────────────────────────────────────────────────────
const practice = [
  { id: 1, tier: "basic", category: "pure-python", title: "Count word frequency", body: "Given list `words`, return dict of word → count.", solution: "from collections import Counter\n\ndef word_freq(words):\n    return dict(Counter(words))", anchor: "q-1" },
  { id: 2, tier: "basic", category: "pure-python", title: "Filter even numbers", body: "Return even integers from `nums`.", solution: "def even_nums(nums):\n    return [n for n in nums if n % 2 == 0]", anchor: "q-2" },
  { id: 3, tier: "basic", category: "pure-python", title: "Dedupe preserving order", body: "Remove duplicates, keep first occurrence.", solution: "def dedupe(items):\n    seen = set()\n    out = []\n    for x in items:\n        if x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out", anchor: "q-3" },
  { id: 4, tier: "basic", category: "pure-python", title: "Group list of dicts by key", body: "Group `records` by `dept` → list of names.", solution: "from collections import defaultdict\n\ndef group_names(records):\n    out = defaultdict(list)\n    for r in records:\n        out[r['dept']].append(r['name'])\n    return dict(out)", anchor: "q-4" },
  { id: 5, tier: "basic", category: "pure-python", title: "Safe nested get", body: "Return `data['user']['id']` or None.", solution: "def safe_user_id(data):\n    return (data.get('user') or {}).get('id')", anchor: "q-5" },
  { id: 6, tier: "basic", category: "pure-python", title: "Merge dicts", body: "Merge `a` and `b`; b wins on collision.", solution: "def merge_dicts(a, b):\n    return {**a, **b}", anchor: "q-6" },
  { id: 7, tier: "basic", category: "pure-python", title: "Parse log line regex", body: 'Parse `"2024-01-01 ERROR user=42 msg=timeout"` to dict.', solution: "import re\n\ndef parse_log(line):\n    m = re.match(r'(\\S+) (\\S+) user=(\\S+) msg=(.+)', line)\n    if not m: return None\n    return {'ts': m[1], 'level': m[2], 'user': m[3], 'msg': m[4]}", anchor: "q-7" },
  { id: 8, tier: "basic", category: "pure-python", title: "Sort records by key", body: "Sort list of dicts by `amount` descending.", solution: "def sort_by_amount(rows):\n    return sorted(rows, key=lambda r: r['amount'], reverse=True)", anchor: "q-8" },
  { id: 9, tier: "basic", category: "pure-python", title: "Flatten one-level list", body: "Flatten `[[1,2],[3]]` → `[1,2,3]`.", solution: "def flatten(lst):\n    return [x for sub in lst for x in sub]", anchor: "q-9" },
  { id: 10, tier: "basic", category: "pure-python", title: "Count by key", body: "Count occurrences of each `status` in records.", solution: "from collections import Counter\n\ndef count_status(records):\n    return dict(Counter(r['status'] for r in records))", anchor: "q-10" },
  { id: 11, tier: "medium", category: "pandas", title: "Filter high salary", body: "Return rows where `salary` > 80000.", solution: 'def high_salary(df):\n    return df[df["salary"] > 80000]', anchor: "q-11" },
  { id: 12, tier: "medium", category: "pandas", title: "Groupby mean", body: "Average `amount` per `category`.", solution: 'def avg_by_category(df):\n    return df.groupby("category", as_index=False)["amount"].mean()', anchor: "q-12" },
  { id: 13, tier: "medium", category: "pandas", title: "Fill nulls with median", body: "Fill null `score` with column median.", solution: 'def fill_score_median(df):\n    out = df.copy()\n    out["score"] = out["score"].fillna(out["score"].median())\n    return out', anchor: "q-13" },
  { id: 14, tier: "medium", category: "pandas", title: "Inner merge", body: "Inner merge `left` and `right` on `id`.", solution: 'def merge_on_id(left, right):\n    return left.merge(right, on="id", how="inner")', anchor: "q-14" },
  { id: 15, tier: "medium", category: "pandas", title: "Pivot sales", body: "Pivot: index `region`, columns `product`, values `sales`, sum.", solution: 'def sales_pivot(df):\n    return df.pivot_table(index="region", columns="product", values="sales", aggfunc="sum", fill_value=0)', anchor: "q-15" },
  { id: 16, tier: "medium", category: "pandas", title: "Parse dates", body: "Convert `order_date` to datetime.", solution: 'import pandas as pd\n\ndef parse_dates(df):\n    out = df.copy()\n    out["order_date"] = pd.to_datetime(out["order_date"])\n    return out', anchor: "q-16" },
  { id: 17, tier: "medium", category: "pandas", title: "Drop dup customers", body: "Keep first row per `customer_id`.", solution: 'def dedupe_customers(df):\n    return df.drop_duplicates(subset=["customer_id"], keep="first")', anchor: "q-17" },
  { id: 18, tier: "medium", category: "pandas", title: "Running total", body: "Add `running_qty` = cumulative `qty` by `date`.", solution: 'def running_total(df):\n    out = df.sort_values("date").copy()\n    out["running_qty"] = out["qty"].cumsum()\n    return out', anchor: "q-18" },
  { id: 19, tier: "medium", category: "pandas", title: "Rank within group", body: "Dense rank `revenue` per `region` desc.", solution: 'def rank_revenue(df):\n    out = df.copy()\n    out["rank"] = out.groupby("region")["revenue"].rank(method="dense", ascending=False)\n    return out', anchor: "q-19" },
  { id: 20, tier: "medium", category: "pandas", title: "Valid emails filter", body: "Rows where email not null and not empty.", solution: 'def valid_emails(df):\n    return df[df["email"].notna() & (df["email"].str.strip() != "")]', anchor: "q-20" },
  { id: 21, tier: "medium", category: "pandas", title: "Window lag", body: "Previous `amount` per `account_id` by `ts`.", solution: 'def prev_amount(df):\n    out = df.sort_values(["account_id", "ts"]).copy()\n    out["prev_amount"] = out.groupby("account_id")["amount"].shift(1)\n    return out', anchor: "q-21" },
  { id: 22, tier: "medium", category: "pandas", title: "Anti-join", body: "Customers in `all_c` not in `active_c` on `id`.", solution: 'def inactive(all_c, active_c):\n    return all_c.merge(active_c[["id"]], on="id", how="left", indicator=True).query(\'_merge == "left_only"\').drop(columns="_merge")', anchor: "q-22" },
  { id: 23, tier: "medium", category: "pandas", title: "Explode tags", body: "Explode list column `tags`.", solution: 'def explode_tags(df):\n    return df.explode("tags")', anchor: "q-23" },
  { id: 24, tier: "medium", category: "pandas", title: "Cast types", body: "Cast `user_id` str, `amount` float.", solution: 'def cast_types(df):\n    out = df.copy()\n    out["user_id"] = out["user_id"].astype(str)\n    out["amount"] = out["amount"].astype(float)\n    return out', anchor: "q-24" },
  { id: 25, tier: "medium", category: "pandas", title: "Melt wide to long", body: "Melt `q1`,`q2` into quarter/revenue.", solution: 'import pandas as pd\n\ndef melt_quarters(df):\n    return pd.melt(df, id_vars=["id"], value_vars=["q1","q2"], var_name="quarter", value_name="revenue")', anchor: "q-25" },
  { id: 26, tier: "basic", category: "json-csv", title: "Read CSV to dicts", body: "Read CSV with header to list of dicts.", solution: 'import csv\n\ndef read_csv(path):\n    with open(path, newline="", encoding="utf-8") as f:\n        return list(csv.DictReader(f))', anchor: "q-26" },
  { id: 27, tier: "basic", category: "json-csv", title: "Write JSON lines", body: "Write list of dicts to JSONL file.", solution: 'import json\n\ndef write_jsonl(path, rows):\n    with open(path, "w", encoding="utf-8") as f:\n        for row in rows:\n            f.write(json.dumps(row) + "\\n")', anchor: "q-27" },
  { id: 28, tier: "medium", category: "json-csv", title: "Flatten nested JSON", body: "Normalize list with nested `address.city`.", solution: "import pandas as pd\n\ndef flatten_city(rows):\n    df = pd.json_normalize(rows)\n    return df.rename(columns={'address.city': 'city'})", anchor: "q-28" },
  { id: 29, tier: "medium", category: "json-csv", title: "Load JSON file", body: "Load JSON file to Python object.", solution: 'import json\n\ndef load_json(path):\n    with open(path, encoding="utf-8") as f:\n        return json.load(f)', anchor: "q-29" },
  { id: 30, tier: "hard", category: "json-csv", title: "CSV chunks", body: "Yield 1000-row pandas chunks from CSV.", solution: "import pandas as pd\n\ndef read_chunks(path, size=1000):\n    for chunk in pd.read_csv(path, chunksize=size):\n        yield chunk", anchor: "q-30" },
  { id: 31, tier: "medium", category: "data-cleaning", title: "Trim and lower emails", body: "Normalize email column.", solution: 'def norm_email(df):\n    out = df.copy()\n    out["email"] = out["email"].str.strip().str.lower()\n    return out', anchor: "q-31" },
  { id: 32, tier: "medium", category: "data-cleaning", title: "Coerce numeric", body: "Coerce `amount` to numeric, invalid → NaN.", solution: 'import pandas as pd\n\ndef coerce_amount(df):\n    out = df.copy()\n    out["amount"] = pd.to_numeric(out["amount"], errors="coerce")\n    return out', anchor: "q-32" },
  { id: 33, tier: "medium", category: "data-cleaning", title: "Remove outliers IQR", body: "Filter rows where `value` within 1.5×IQR.", solution: 'def iqr_filter(df):\n    q1, q3 = df["value"].quantile([0.25, 0.75])\n    iqr = q3 - q1\n    return df[(df["value"] >= q1 - 1.5*iqr) & (df["value"] <= q3 + 1.5*iqr)]', anchor: "q-33" },
  { id: 34, tier: "hard", category: "data-cleaning", title: "Standardize phone", body: "Remove non-digits from `phone` column.", solution: 'def clean_phone(df):\n    out = df.copy()\n    out["phone"] = out["phone"].astype(str).str.replace(r"\\D", "", regex=True)\n    return out', anchor: "q-34" },
  { id: 35, tier: "hard", category: "data-cleaning", title: "Fill category unknown", body: "Replace null/empty `country` with 'UNK'.", solution: 'def fill_country(df):\n    out = df.copy()\n    out["country"] = out["country"].fillna("UNK").replace("", "UNK")\n    return out', anchor: "q-35" },
  { id: 36, tier: "medium", category: "etl", title: "Validate schema", body: "Return missing required columns.", solution: 'def missing_columns(df, required):\n    return [c for c in required if c not in df.columns]', anchor: "q-36" },
  { id: 37, tier: "medium", category: "etl", title: "SCD Type 1 upsert", body: "Update name/email from `updates` into `existing` on `id`.", solution: 'def scd1(existing, updates):\n    idx = existing.set_index("id")\n    idx.update(updates.set_index("id"))\n    return idx.reset_index()', anchor: "q-37" },
  { id: 38, tier: "hard", category: "etl", title: "Add ingest metadata", body: "Add `_ingested_at` (now UTC) and `_source_file`.", solution: 'from datetime import datetime, timezone\n\ndef add_metadata(df, source_file):\n    out = df.copy()\n    out["_ingested_at"] = datetime.now(timezone.utc)\n    out["_source_file"] = source_file\n    return out', anchor: "q-38" },
  { id: 39, tier: "hard", category: "etl", title: "Filter incremental", body: "Rows where `updated_at` > watermark string.", solution: 'import pandas as pd\n\ndef incremental(df, watermark):\n    ts = pd.to_datetime(df["updated_at"], utc=True)\n    return df[ts > pd.to_datetime(watermark, utc=True)]', anchor: "q-39" },
  { id: 40, tier: "hard", category: "etl", title: "Row count audit", body: "Return dict with input_count, output_count, dropped.", solution: 'def audit_counts(input_df, output_df):\n    return {"input_count": len(input_df), "output_count": len(output_df), "dropped": len(input_df) - len(output_df)}', anchor: "q-40" },
];

fs.writeFileSync(path.join(root, "content/topics/python-notes.md"), fullNotes);
fs.writeFileSync(path.join(root, "content/topics/python-interview.md"), interviewMd);
fs.writeFileSync(path.join(root, "src/data/python-practice-questions.json"), JSON.stringify(practice, null, 2));

console.log("Generated:");
console.log("  notes:", fullNotes.split("\n").length, "lines");
console.log("  interview:", interviewQs.length, "questions");
console.log("  practice:", practice.length, "problems");

#!/usr/bin/env node
/**
 * Generates 150 PySpark coding problems from note topic titles + hand-crafted core set.
 * Run: node scripts/generate-spark-practice-150.mjs
 */
import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..");
const notesSource = path.join(root, "content/sources/pyspark-notes-100.md");
const outPath = path.join(root, "src/data/spark-practice-questions.json");

const CORE = [
  { id: 1, tier: "basic", category: "transformations", title: "Filter high amounts", body: "Return rows where `amount` > 1000.", solution: 'from pyspark.sql import functions as F\n\ndef high_amounts(df):\n    return df.filter(F.col("amount") > 1000)', anchor: "q-1" },
  { id: 2, tier: "basic", category: "transformations", title: "Select and rename", body: "Select `id`, `name` and rename `name` to `customer_name`.", solution: 'from pyspark.sql import functions as F\n\ndef select_rename(df):\n    return df.select("id", F.col("name").alias("customer_name"))', anchor: "q-2" },
  { id: 3, tier: "basic", category: "transformations", title: "Add total column", body: "Add column `total` = `qty` * `price`.", solution: 'from pyspark.sql import functions as F\n\ndef add_total(df):\n    return df.withColumn("total", F.col("qty") * F.col("price"))', anchor: "q-3" },
  { id: 4, tier: "basic", category: "transformations", title: "Drop null keys", body: "Remove rows where `order_id` is null.", solution: 'from pyspark.sql import functions as F\n\ndef drop_null_keys(df):\n    return df.filter(F.col("order_id").isNotNull())', anchor: "q-4" },
  { id: 5, tier: "basic", category: "transformations", title: "Cast id to string", body: "Cast `customer_id` to string type.", solution: 'from pyspark.sql import functions as F\n\ndef cast_id(df):\n    return df.withColumn("customer_id", F.col("customer_id").cast("string"))', anchor: "q-5" },
  { id: 6, tier: "basic", category: "transformations", title: "Group sum by region", body: "Total `sales` per `region`.", solution: 'from pyspark.sql import functions as F\n\ndef sales_by_region(df):\n    return df.groupBy("region").agg(F.sum("sales").alias("total_sales"))', anchor: "q-6" },
  { id: 7, tier: "basic", category: "transformations", title: "Distinct countries", body: "Return distinct `country` values.", solution: 'from pyspark.sql import functions as F\n\ndef distinct_countries(df):\n    return df.select("country").distinct()', anchor: "q-7" },
  { id: 8, tier: "basic", category: "transformations", title: "Fill null country", body: "Replace null `country` with 'UNK'.", solution: 'def fill_country(df):\n    return df.fillna({"country": "UNK"})', anchor: "q-8" },
  { id: 9, tier: "medium", category: "transformations", title: "Conditional flag", body: "Add `is_premium` = 1 if `amount` >= 500 else 0.", solution: 'from pyspark.sql import functions as F\n\ndef premium_flag(df):\n    return df.withColumn(\n        "is_premium",\n        F.when(F.col("amount") >= 500, 1).otherwise(0)\n    )', anchor: "q-9" },
  { id: 10, tier: "medium", category: "nested", title: "Explode tags", body: "Explode array column `tags` into rows.", solution: 'from pyspark.sql import functions as F\n\ndef explode_tags(df):\n    return df.select("id", F.explode("tags").alias("tag"))', anchor: "q-10" },
  { id: 11, tier: "basic", category: "joins", title: "Inner join orders customers", body: "Inner join `orders` and `customers` on `customer_id`.", solution: 'def join_orders_customers(orders, customers):\n    return orders.join(customers, on="customer_id", how="inner")', anchor: "q-11" },
  { id: 12, tier: "basic", category: "joins", title: "Left join enrich", body: "Left join `facts` with `dim` on `id`, keep all facts.", solution: 'def left_enrich(facts, dim):\n    return facts.join(dim, facts.id == dim.id, "left")', anchor: "q-12" },
  { id: 13, tier: "medium", category: "joins", title: "Broadcast join", body: "Join large `facts` to small `lookup` using broadcast.", solution: 'from pyspark.sql.functions import broadcast\n\ndef broadcast_join(facts, lookup):\n    return facts.join(broadcast(lookup), "key")', anchor: "q-13" },
  { id: 14, tier: "medium", category: "joins", title: "Anti join", body: "Rows in `all_customers` not in `active` on `id`.", solution: 'def inactive_customers(all_customers, active):\n    return all_customers.join(active.select("id"), "id", "left_anti")', anchor: "q-14" },
  { id: 15, tier: "medium", category: "joins", title: "Multi-key join", body: "Join on `region` and `product_id`.", solution: 'def multi_join(a, b):\n    return a.join(b, ["region", "product_id"], "inner")', anchor: "q-15" },
  { id: 16, tier: "hard", category: "joins", title: "Semi join active customers", body: "Return customers who have at least one order (left semi join).", solution: 'def active_customers(customers, orders):\n    return customers.join(orders, "customer_id", "left_semi")', anchor: "q-16" },
  { id: 17, tier: "basic", category: "window", title: "Row number dedupe", body: "Keep one row per `user_id` — latest by `ts` (row_number = 1).", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef dedupe_latest(df):\n    w = Window.partitionBy("user_id").orderBy(F.col("ts").desc())\n    return df.withColumn("rn", F.row_number().over(w)).filter(F.col("rn") == 1).drop("rn")', anchor: "q-17" },
  { id: 18, tier: "medium", category: "window", title: "Running sum", body: "Running sum of `amount` per `account_id` ordered by `dt`.", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef running_sum(df):\n    w = Window.partitionBy("account_id").orderBy("dt").rowsBetween(Window.unboundedPreceding, 0)\n    return df.withColumn("running_total", F.sum("amount").over(w))', anchor: "q-18" },
  { id: 19, tier: "medium", category: "window", title: "Lag previous amount", body: "Previous `amount` per `user_id` ordered by `event_time`.", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef lag_amount(df):\n    w = Window.partitionBy("user_id").orderBy("event_time")\n    return df.withColumn("prev_amount", F.lag("amount", 1).over(w))', anchor: "q-19" },
  { id: 20, tier: "medium", category: "window", title: "Rank by revenue", body: "Dense rank `revenue` per `region` descending.", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef rank_revenue(df):\n    w = Window.partitionBy("region").orderBy(F.col("revenue").desc())\n    return df.withColumn("rev_rank", F.dense_rank().over(w))', anchor: "q-20" },
  { id: 21, tier: "hard", category: "window", title: "7-day moving avg", body: "Moving average of `value` over last 7 rows per `sensor_id`.", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef moving_avg_7(df):\n    w = Window.partitionBy("sensor_id").orderBy("ts").rowsBetween(-6, 0)\n    return df.withColumn("ma7", F.avg("value").over(w))', anchor: "q-21" },
  { id: 22, tier: "hard", category: "window", title: "Lead next status", body: "Add `next_status` using `lead()` per `customer_id` ordered by `updated_at`.", solution: 'from pyspark.sql import functions as F\nfrom pyspark.sql.window import Window\n\ndef lead_status(df):\n    w = Window.partitionBy("customer_id").orderBy("updated_at")\n    return df.withColumn("next_status", F.lead("status").over(w))', anchor: "q-22" },
  { id: 23, tier: "basic", category: "optimization", title: "Repartition before write", body: "Repartition to 10 files before write.", solution: 'def repartition_write(df, path):\n    df.repartition(10).write.mode("overwrite").parquet(path)', anchor: "q-23" },
  { id: 24, tier: "basic", category: "optimization", title: "Cache and use", body: "Cache `dim` and join twice to same fact.", solution: 'def cache_dim_join(fact, dim):\n    dim_cached = dim.cache()\n    a = fact.join(dim_cached, "id")\n    b = fact.join(dim_cached, "id")\n    dim_cached.unpersist()\n    return a, b', anchor: "q-24" },
  { id: 25, tier: "medium", category: "optimization", title: "Partition prune filter", body: "Read only `dt = '2024-01-01'` partition from orders.", solution: 'from pyspark.sql import functions as F\n\ndef read_partition(spark, base_path):\n    return spark.read.parquet(base_path).filter(F.col("dt") == "2024-01-01")', anchor: "q-25" },
  { id: 26, tier: "medium", category: "optimization", title: "Coalesce output files", body: "Write with coalesce(4) to limit output files.", solution: 'def write_coalesced(df, path):\n    df.coalesce(4).write.mode("overwrite").parquet(path)', anchor: "q-26" },
  { id: 27, tier: "medium", category: "optimization", title: "Select columns early", body: "Project only needed columns before join.", solution: 'def project_before_join(fact, dim):\n    return fact.select("id", "amount").join(dim.select("id", "name"), "id")', anchor: "q-27" },
  { id: 28, tier: "hard", category: "optimization", title: "Salt skewed key", body: "Add random salt column 0–9 for skewed join prep.", solution: 'from pyspark.sql import functions as F\n\ndef salt_key(df):\n    return df.withColumn("salt", (F.rand() * 10).cast("int"))', anchor: "q-28" },
  { id: 29, tier: "hard", category: "optimization", title: "Enable AQE", body: "Set Spark conf to enable AQE and skew join.", solution: 'def enable_aqe(spark):\n    spark.conf.set("spark.sql.adaptive.enabled", "true")\n    spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")', anchor: "q-29" },
  { id: 30, tier: "hard", category: "optimization", title: "Dynamic partition overwrite", body: "Configure dynamic partition overwrite mode.", solution: 'def enable_dynamic_overwrite(spark):\n    spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")', anchor: "q-30" },
];

const CATEGORY_RULES = [
  { re: /join|semi|anti|cross|broadcast|merge/i, category: "joins" },
  { re: /window|row_number|rank|lag|lead|running/i, category: "window" },
  { re: /partition|shuffle|repartition|coalesce|cache|persist|skew|salt|aqe|catalyst|explain|optimize|broadcast|oom|spill/i, category: "optimization" },
  { re: /json|array|struct|explode|nested/i, category: "nested" },
  { re: /read|write|csv|json|parquet|delta/i, category: "io" },
];

function inferCategory(title) {
  for (const rule of CATEGORY_RULES) {
    if (rule.re.test(title)) return rule.category;
  }
  return "transformations";
}

function inferTier(id) {
  if (id <= 35) return "basic";
  if (id <= 70) return "medium";
  return "hard";
}

function parseTopics(markdown) {
  const parts = markdown.split(/^#{1,2} (\d+)\.\s+/m);
  const topics = [];
  for (let i = 1; i < parts.length; i += 2) {
    const id = Number(parts[i]);
    const rest = parts[i + 1] ?? "";
    const newline = rest.indexOf("\n");
    const title = (newline >= 0 ? rest.slice(0, newline) : rest).trim();
    if (id && title) topics.push({ id, title });
  }
  return topics;
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

function buildFromTopic(topic, problemId) {
  const category = inferCategory(topic.title);
  const tier = inferTier(topic.id);
  const slug = slugify(topic.title);

  return {
    id: problemId,
    tier,
    category,
    title: `Apply: ${topic.title}`,
    body: `Given a PySpark DataFrame, implement a transformation related to **${topic.title}** (Notes topic #${topic.id}). Write clean PySpark code using DataFrame API.`,
    solution: `from pyspark.sql import functions as F\n\n# Topic ${topic.id}: ${topic.title}\ndef solve_${slug}(df):\n    # TODO: implement based on notes topic ${topic.id}\n    return df`,
    anchor: `q-${problemId}`,
    noteTopic: topic.id,
  };
}

function main() {
  const notesMd = fs.readFileSync(notesSource, "utf8");
  const topics = parseTopics(notesMd);
  const problems = [...CORE];
  let nextId = CORE.length + 1;

  for (const topic of topics) {
    if (nextId > 150) break;
    if (CORE.some((p) => p.noteTopic === topic.id)) continue;
    problems.push(buildFromTopic(topic, nextId));
    nextId++;
  }

  // Pad to 150 if needed with variations
  while (problems.length < 150 && topics.length > 0) {
    const topic = topics[(problems.length - CORE.length) % topics.length];
    problems.push({
      ...buildFromTopic(topic, problems.length + 1),
      id: problems.length + 1,
      title: `Practice variant: ${topic.title}`,
      body: `Extended coding drill for **${topic.title}** — implement with tests in mind.`,
    });
  }

  const cleaned = problems.slice(0, 150).map(({ noteTopic, ...rest }) => rest);
  fs.writeFileSync(outPath, JSON.stringify(cleaned, null, 2));
  console.log("Generated", cleaned.length, "practice problems →", outPath);
}

main();

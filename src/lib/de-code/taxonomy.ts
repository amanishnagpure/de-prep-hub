import type { CodeTrackId } from "@/lib/de-code/types";

export type DeRelevance = "high" | "medium" | "low";

export type TopicMeta = {
  id: string;
  label: string;
  description: string;
  /** Concept tags shown on topic pages (learning checklist) */
  concepts: string[];
};

export type SubtopicMeta = {
  id: string;
  label: string;
};

/** Track → Topic → subtopics */
export const TRACK_TAXONOMY: Record<
  CodeTrackId,
  { topics: TopicMeta[]; subtopicsByTopic: Record<string, SubtopicMeta[]> }
> = {
  sql: {
    topics: [
      { id: "fundamentals", label: "Fundamentals", description: "SELECT, basic filtering, core SQL literacy", concepts: ["SELECT", "WHERE", "ORDER BY"] },
      { id: "filtering-case", label: "Filtering & CASE", description: "Conditional logic and predicate filters", concepts: ["CASE WHEN", "WHERE", "HAVING"] },
      { id: "aggregations", label: "Aggregations", description: "GROUP BY, SUM, COUNT, AVG", concepts: ["GROUP BY", "SUM", "COUNT", "AVG"] },
      { id: "joins", label: "Joins", description: "Inner, left, self, and anti-join patterns", concepts: ["INNER JOIN", "LEFT JOIN", "SELF JOIN"] },
      { id: "subqueries", label: "Subqueries", description: "Scalar and nested subqueries", concepts: ["Scalar subquery", "IN", "EXISTS"] },
      { id: "window-functions", label: "Window Functions", description: "Analytical SQL over partitions", concepts: ["ROW_NUMBER", "RANK", "LAG", "LEAD", "Running Total", "Rolling Average"] },
      { id: "date-time", label: "Date & Time", description: "Date bucketing, extraction, relative windows", concepts: ["strftime", "DATE arithmetic", "Monthly rollup"] },
      { id: "string-operations", label: "String Operations", description: "Parsing and transforming text columns", concepts: ["SUBSTR", "INSTR", "CONCAT"] },
      { id: "null-handling", label: "NULL Handling", description: "COALESCE, IS NULL, null-safe reporting", concepts: ["COALESCE", "IS NULL", "IFNULL"] },
      { id: "set-operations", label: "Set Operations", description: "UNION, UNION ALL, combining sources", concepts: ["UNION ALL", "UNION"] },
      { id: "deduplication", label: "Deduplication", description: "ROW_NUMBER and keep-first/last patterns", concepts: ["ROW_NUMBER", "PARTITION BY", "Dedupe keys"] },
      { id: "data-quality", label: "Data Quality", description: "Duplicates, freshness, referential checks", concepts: ["Duplicate detection", "Freshness", "Orphan rows"] },
      { id: "advanced-analytics", label: "Advanced Analytics", description: "Top-N, share-of-total, analytical rollups", concepts: ["Top-N", "Percent of total", "LIMIT"] },
      { id: "scd", label: "SCD", description: "Slowly changing dimensions in the warehouse", concepts: ["SCD Type 2", "is_current", "Point-in-time"] },
      { id: "incremental-loading", label: "Incremental Loading", description: "Daily slices and max-partition extracts", concepts: ["MAX partition", "Incremental filter"] },
    ],
    subtopicsByTopic: {
      fundamentals: [{ id: "select-basics", label: "SELECT basics" }, { id: "multi-filter", label: "Multi-condition filters" }],
      "filtering-case": [{ id: "where-filters", label: "WHERE filters" }, { id: "case-when", label: "CASE WHEN" }],
      aggregations: [{ id: "group-by", label: "GROUP BY" }, { id: "count-distinct", label: "COUNT DISTINCT" }, { id: "sum-avg", label: "SUM / AVG" }, { id: "min-max", label: "MIN / MAX" }, { id: "conditional-aggregate", label: "Conditional aggregates" }],
      joins: [{ id: "inner-join", label: "Inner join" }, { id: "left-join", label: "Left join" }, { id: "self-join", label: "Self join" }, { id: "anti-join", label: "Anti join" }],
      subqueries: [{ id: "scalar-subquery", label: "Scalar subquery" }, { id: "nested-aggregate", label: "Nested aggregates" }],
      "window-functions": [{ id: "row-number", label: "ROW_NUMBER" }, { id: "rank", label: "RANK / DENSE_RANK" }, { id: "lag-lead", label: "LAG / LEAD" }, { id: "running-total", label: "Running totals" }, { id: "rolling-average", label: "Rolling average" }, { id: "percent-of-total", label: "Percent of total" }],
      "date-time": [{ id: "date-truncation", label: "Date truncation" }, { id: "relative-dates", label: "Relative date windows" }, { id: "extract", label: "Extract year/month" }, { id: "month-filter", label: "Month filters" }],
      "string-operations": [{ id: "substring", label: "Substring / domain extract" }],
      "null-handling": [{ id: "coalesce", label: "COALESCE" }, { id: "is-null", label: "IS NULL" }, { id: "count-nulls", label: "Count NULLs" }],
      "set-operations": [{ id: "union-all", label: "UNION ALL" }],
      deduplication: [{ id: "row-number", label: "ROW_NUMBER dedupe" }],
      "data-quality": [{ id: "duplicate-detection", label: "Duplicate detection" }, { id: "freshness", label: "Freshness checks" }],
      "advanced-analytics": [{ id: "top-n", label: "Top-N queries" }],
      scd: [{ id: "scd-type-2", label: "SCD Type 2" }],
      "incremental-loading": [{ id: "max-partition", label: "Max partition slice" }],
    },
  },
  python: {
    topics: [
      { id: "python-fundamentals", label: "Python Fundamentals", description: "Core syntax and list operations", concepts: ["Lists", "Loops", "Slicing"] },
      { id: "collections", label: "Collections", description: "Nested structures and flattening", concepts: ["Nested lists", "Dicts", "Sets"] },
      { id: "csv-json", label: "CSV & JSON", description: "Parsing pipeline payloads", concepts: ["CSV parsing", "json.loads", "Field extraction"] },
      { id: "data-processing", label: "Data Processing", description: "Transform rows and compute windows", concepts: ["Filter rows", "Dedupe", "Moving average"] },
      { id: "etl", label: "ETL", description: "Paths, batches, and ingestion helpers", concepts: ["Partition paths", "Chunking", "Log parsing"] },
      { id: "regular-expressions", label: "Regular Expressions", description: "String normalization and parsing", concepts: ["re.sub", "Slugify", "Tokenize"] },
    ],
    subtopicsByTopic: {
      "python-fundamentals": [{ id: "lists", label: "Lists & chunking" }],
      collections: [{ id: "nested-lists", label: "Flatten nested lists" }],
      "csv-json": [{ id: "csv-parsing", label: "CSV parsing" }, { id: "json-parsing", label: "JSON parsing" }],
      "data-processing": [{ id: "deduplication", label: "Deduplication" }, { id: "filtering", label: "Row filtering" }, { id: "window-computation", label: "Window computation" }],
      etl: [{ id: "partitioning", label: "Partition paths" }, { id: "log-parsing", label: "Log parsing" }],
      "regular-expressions": [{ id: "string-normalization", label: "String normalization" }],
    },
  },
  pyspark: {
    topics: [
      { id: "dataframe-fundamentals", label: "DataFrame Fundamentals", description: "Core DataFrame API patterns", concepts: ["select", "filter", "sort"] },
      { id: "select-filter", label: "Select & Filter", description: "Projection and row filtering", concepts: ["select", "filter", "where"] },
      { id: "withcolumn", label: "withColumn", description: "Derived and transformed columns", concepts: ["withColumn", "expressions"] },
      { id: "aggregations", label: "Aggregations", description: "groupBy and aggregate metrics", concepts: ["groupBy", "sum", "count"] },
      { id: "joins", label: "Joins", description: "Combining datasets on keys", concepts: ["inner join", "broadcast join"] },
      { id: "window-functions", label: "Window Functions", description: "Partitioned analytics in Spark", concepts: ["Window", "row_number"] },
      { id: "deduplication", label: "Deduplication", description: "dropDuplicates and window dedupe", concepts: ["dropDuplicates", "row_number"] },
      { id: "repartition-coalesce", label: "Repartition & Coalesce", description: "Partition layout before writes", concepts: ["repartition", "coalesce"] },
      { id: "caching", label: "Caching", description: "Reuse materialized DataFrames", concepts: ["cache", "persist"] },
    ],
    subtopicsByTopic: {
      "dataframe-fundamentals": [{ id: "sort", label: "Sort / orderBy" }],
      "select-filter": [{ id: "filter", label: "Filter rows" }, { id: "projection", label: "Column projection" }],
      withcolumn: [{ id: "derived-columns", label: "Derived columns" }],
      aggregations: [{ id: "group-by", label: "Single-key groupBy" }, { id: "multi-key-groupby", label: "Multi-key groupBy" }],
      joins: [{ id: "inner-join", label: "Inner join" }],
      "window-functions": [{ id: "window-dedupe", label: "Window dedupe" }],
      deduplication: [{ id: "drop-duplicates", label: "dropDuplicates" }],
      "repartition-coalesce": [{ id: "repartition", label: "repartition" }],
      caching: [{ id: "cache", label: "cache()" }],
    },
  },
  dsa: {
    topics: [
      { id: "hashing", label: "Hashing", description: "Hash maps and sets for O(n) lookups", concepts: ["HashMap", "HashSet", "Frequency count"] },
      { id: "strings", label: "Strings", description: "Token and character manipulation", concepts: ["Split", "Reverse", "Parse"] },
      { id: "sorting", label: "Sorting", description: "Sort-based interval and merge patterns", concepts: ["Sort", "Merge intervals"] },
      { id: "binary-search", label: "Binary Search", description: "Logarithmic search on sorted data", concepts: ["Binary search", "Two pointers"] },
      { id: "stack", label: "Stack", description: "LIFO structures for matching problems", concepts: ["Stack", "Bracket matching"] },
      { id: "heap", label: "Heap", description: "Priority queue top-K patterns", concepts: ["Heap", "Top-K"] },
      { id: "dynamic-programming", label: "Dynamic Programming", description: "Optimal substructure problems", concepts: ["Kadane", "LIS", "DP table"] },
    ],
    subtopicsByTopic: {
      hashing: [{ id: "two-sum", label: "Two sum pattern" }, { id: "contains-duplicate", label: "Contains duplicate" }],
      strings: [{ id: "reverse", label: "Reverse words" }],
      sorting: [{ id: "merge-intervals", label: "Merge intervals" }],
      "binary-search": [{ id: "classic", label: "Classic binary search" }],
      stack: [{ id: "bracket-matching", label: "Valid parentheses" }],
      heap: [{ id: "top-k", label: "Top-K frequent" }],
      "dynamic-programming": [{ id: "kadane", label: "Maximum subarray" }, { id: "lis", label: "LIS length" }],
    },
  },
};

export function getTopicsForTrack(track: CodeTrackId): TopicMeta[] {
  return TRACK_TAXONOMY[track].topics;
}

export function getTopicMeta(track: CodeTrackId, topicId: string): TopicMeta | undefined {
  return TRACK_TAXONOMY[track].topics.find((t) => t.id === topicId);
}

export function getSubtopicsForTopic(track: CodeTrackId, topicId: string): SubtopicMeta[] {
  return TRACK_TAXONOMY[track].subtopicsByTopic[topicId] ?? [];
}

export function isValidTopic(track: CodeTrackId, topicId: string): boolean {
  return Boolean(getTopicMeta(track, topicId));
}

export function codeTopicPath(track: CodeTrackId, topicId: string): string {
  return `/code/${track}/${topicId}`;
}

/** Maps every problem slug → topic, subtopic, concepts, deRelevance, learningOrder */

import { BATCH4_TAXONOMY } from "./de-code-batch4-generated.mjs";

const BASE_TAXONOMY = {
  // ── SQL (50) ──
  "filter-active-employees": { topic: "fundamentals", subtopic: "multi-filter", concepts: ["WHERE", "AND"], deRelevance: "high", learningOrder: 1 },
  "department-headcount": { topic: "aggregations", subtopic: "group-by", concepts: ["GROUP BY", "COUNT"], deRelevance: "high", learningOrder: 1 },
  "customer-order-total": { topic: "aggregations", subtopic: "sum-avg", concepts: ["SUM", "GROUP BY"], deRelevance: "high", learningOrder: 2 },
  "distinct-active-users": { topic: "aggregations", subtopic: "count-distinct", concepts: ["COUNT DISTINCT"], deRelevance: "high", learningOrder: 3 },
  "total-revenue": { topic: "aggregations", subtopic: "sum-avg", concepts: ["SUM"], deRelevance: "high", learningOrder: 4 },
  "average-order-value": { topic: "aggregations", subtopic: "sum-avg", concepts: ["AVG", "GROUP BY"], deRelevance: "high", learningOrder: 5 },
  "first-order-per-customer": { topic: "aggregations", subtopic: "min-max", concepts: ["MIN", "GROUP BY"], deRelevance: "high", learningOrder: 6 },
  "funnel-step-counts": { topic: "aggregations", subtopic: "count-distinct", concepts: ["COUNT DISTINCT", "GROUP BY"], deRelevance: "high", learningOrder: 7 },
  "active-pct-headcount": { topic: "aggregations", subtopic: "conditional-aggregate", concepts: ["CASE WHEN", "COUNT"], deRelevance: "medium", learningOrder: 8 },
  "order-count-by-status": { topic: "aggregations", subtopic: "group-by", concepts: ["GROUP BY", "COUNT"], deRelevance: "high", learningOrder: 9 },

  "order-tier-label": { topic: "filtering-case", subtopic: "case-when", concepts: ["CASE WHEN"], deRelevance: "high", learningOrder: 1 },
  "salary-band-count": { topic: "filtering-case", subtopic: "case-when", concepts: ["CASE WHEN", "GROUP BY"], deRelevance: "high", learningOrder: 2 },
  "hire-date-filter": { topic: "filtering-case", subtopic: "where-filters", concepts: ["WHERE", "date filter"], deRelevance: "high", learningOrder: 3 },
  "exclude-cancelled-orders": { topic: "filtering-case", subtopic: "where-filters", concepts: ["WHERE", "NOT"], deRelevance: "high", learningOrder: 4 },
  "warehouse-low-stock": { topic: "filtering-case", subtopic: "where-filters", concepts: ["WHERE", "comparison"], deRelevance: "medium", learningOrder: 5 },

  "customers-with-orders": { topic: "joins", subtopic: "inner-join", concepts: ["INNER JOIN", "DISTINCT"], deRelevance: "high", learningOrder: 1 },
  "revenue-by-region": { topic: "joins", subtopic: "inner-join", concepts: ["INNER JOIN", "SUM"], deRelevance: "high", learningOrder: 2 },
  "manager-direct-reports": { topic: "joins", subtopic: "self-join", concepts: ["SELF JOIN"], deRelevance: "high", learningOrder: 3 },
  "unmatched-orders": { topic: "joins", subtopic: "left-join", concepts: ["LEFT JOIN", "IS NULL"], deRelevance: "high", learningOrder: 4 },
  "products-never-ordered": { topic: "joins", subtopic: "anti-join", concepts: ["LEFT JOIN", "anti-join"], deRelevance: "high", learningOrder: 5 },

  "second-highest-salary": { topic: "subqueries", subtopic: "nested-aggregate", concepts: ["subquery", "MAX"], deRelevance: "medium", learningOrder: 1 },
  "orders-above-average": { topic: "subqueries", subtopic: "scalar-subquery", concepts: ["AVG", "scalar subquery"], deRelevance: "high", learningOrder: 2 },

  "top-salary-per-department": { topic: "window-functions", subtopic: "rank", concepts: ["RANK", "PARTITION BY"], deRelevance: "high", learningOrder: 1 },
  "product-revenue-rank": { topic: "window-functions", subtopic: "rank", concepts: ["RANK", "GROUP BY"], deRelevance: "high", learningOrder: 2 },
  "rank-orders-per-customer": { topic: "window-functions", subtopic: "row-number", concepts: ["ROW_NUMBER"], deRelevance: "high", learningOrder: 3 },
  "dedupe-click-events": { topic: "deduplication", subtopic: "row-number", concepts: ["ROW_NUMBER", "dedupe"], deRelevance: "high", learningOrder: 1 },
  "dedupe-staging-rows": { topic: "deduplication", subtopic: "row-number", concepts: ["ROW_NUMBER", "PARTITION BY"], deRelevance: "high", learningOrder: 2 },
  "session-first-event": { topic: "window-functions", subtopic: "row-number", concepts: ["ROW_NUMBER", "MIN time"], deRelevance: "high", learningOrder: 4 },
  "running-revenue-total": { topic: "window-functions", subtopic: "running-total", concepts: ["SUM OVER", "running total"], deRelevance: "high", learningOrder: 5 },
  "day-over-day-revenue": { topic: "window-functions", subtopic: "lag-lead", concepts: ["LAG", "delta"], deRelevance: "high", learningOrder: 6 },
  "percent-of-total-revenue": { topic: "window-functions", subtopic: "percent-of-total", concepts: ["SUM OVER", "share of total"], deRelevance: "high", learningOrder: 7 },
  "rolling-3-day-average": { topic: "window-functions", subtopic: "rolling-average", concepts: ["AVG OVER", "rolling window"], deRelevance: "high", learningOrder: 8 },
  "running-order-count": { topic: "window-functions", subtopic: "running-total", concepts: ["SUM OVER", "running count"], deRelevance: "medium", learningOrder: 9 },

  "monthly-revenue-trend": { topic: "date-time", subtopic: "date-truncation", concepts: ["strftime", "month bucket"], deRelevance: "high", learningOrder: 1 },
  "extract-order-year": { topic: "date-time", subtopic: "extract", concepts: ["strftime", "year extract"], deRelevance: "high", learningOrder: 2 },
  "january-revenue": { topic: "date-time", subtopic: "month-filter", concepts: ["month filter"], deRelevance: "medium", learningOrder: 3 },
  "recent-active-users": { topic: "date-time", subtopic: "relative-dates", concepts: ["relative window", "MAX date"], deRelevance: "high", learningOrder: 4 },

  "email-domain-extract": { topic: "string-operations", subtopic: "substring", concepts: ["SUBSTR", "INSTR"], deRelevance: "medium", learningOrder: 1 },

  "null-safe-product-name": { topic: "null-handling", subtopic: "coalesce", concepts: ["COALESCE"], deRelevance: "high", learningOrder: 1 },
  "null-email-default": { topic: "null-handling", subtopic: "coalesce", concepts: ["COALESCE"], deRelevance: "high", learningOrder: 2 },
  "customers-missing-email": { topic: "null-handling", subtopic: "is-null", concepts: ["IS NULL"], deRelevance: "high", learningOrder: 3 },
  "employees-without-manager": { topic: "null-handling", subtopic: "is-null", concepts: ["IS NULL"], deRelevance: "medium", learningOrder: 4 },
  "count-null-emails": { topic: "null-handling", subtopic: "count-nulls", concepts: ["SUM CASE", "NULL count"], deRelevance: "high", learningOrder: 5 },

  "union-event-sources": { topic: "set-operations", subtopic: "union-all", concepts: ["UNION ALL"], deRelevance: "high", learningOrder: 1 },
  "union-daily-snapshots": { topic: "set-operations", subtopic: "union-all", concepts: ["UNION ALL", "snapshots"], deRelevance: "high", learningOrder: 2 },

  "duplicate-email-addresses": { topic: "data-quality", subtopic: "duplicate-detection", concepts: ["HAVING", "duplicate"], deRelevance: "high", learningOrder: 1 },
  "data-freshness-timestamp": { topic: "data-quality", subtopic: "freshness", concepts: ["MAX", "SLA"], deRelevance: "high", learningOrder: 2 },

  "top-3-revenue-days": { topic: "advanced-analytics", subtopic: "top-n", concepts: ["ORDER BY", "LIMIT"], deRelevance: "high", learningOrder: 1 },

  "scd2-current-version": { topic: "scd", subtopic: "scd-type-2", concepts: ["SCD2", "is_current"], deRelevance: "high", learningOrder: 1 },

  "incremental-daily-load": { topic: "incremental-loading", subtopic: "max-partition", concepts: ["MAX partition", "incremental"], deRelevance: "high", learningOrder: 1 },

  // ── Python (11) ──
  "chunk-list": { topic: "python-fundamentals", subtopic: "lists", concepts: ["list slicing", "batching"], deRelevance: "high", learningOrder: 1 },
  "flatten-one-level": { topic: "collections", subtopic: "nested-lists", concepts: ["nested lists", "flatten"], deRelevance: "high", learningOrder: 1 },
  "sum-csv-amount-column": { topic: "csv-json", subtopic: "csv-parsing", concepts: ["CSV", "parsing"], deRelevance: "high", learningOrder: 1 },
  "parse-event-json": { topic: "csv-json", subtopic: "json-parsing", concepts: ["JSON", "json.loads"], deRelevance: "high", learningOrder: 2 },
  "parse-json-array-length": { topic: "csv-json", subtopic: "json-parsing", concepts: ["JSON array", "len"], deRelevance: "high", learningOrder: 3 },
  "dedupe-records-by-id": { topic: "data-processing", subtopic: "deduplication", concepts: ["dict", "last-wins"], deRelevance: "high", learningOrder: 1 },
  "rows-above-threshold": { topic: "data-processing", subtopic: "filtering", concepts: ["filter", "threshold"], deRelevance: "high", learningOrder: 2 },
  "moving-average-window": { topic: "data-processing", subtopic: "window-computation", concepts: ["moving average", "window"], deRelevance: "high", learningOrder: 3 },
  "partition-files-by-date": { topic: "etl", subtopic: "partitioning", concepts: ["Hive paths", "partition"], deRelevance: "high", learningOrder: 1 },
  "parse-log-level": { topic: "etl", subtopic: "log-parsing", concepts: ["log parse", "split"], deRelevance: "medium", learningOrder: 2 },
  "slugify-column-name": { topic: "regular-expressions", subtopic: "string-normalization", concepts: ["re.sub", "slugify"], deRelevance: "medium", learningOrder: 1 },

  // ── PySpark (12) ──
  "filter-active-users": { topic: "select-filter", subtopic: "filter", concepts: ["filter", "where"], deRelevance: "high", learningOrder: 1 },
  "select-column-projection": { topic: "select-filter", subtopic: "projection", concepts: ["select", "projection"], deRelevance: "high", learningOrder: 2 },
  "sort-events-desc": { topic: "dataframe-fundamentals", subtopic: "sort", concepts: ["orderBy", "desc"], deRelevance: "high", learningOrder: 1 },
  "withcolumn-derived": { topic: "withcolumn", subtopic: "derived-columns", concepts: ["withColumn", "expression"], deRelevance: "high", learningOrder: 1 },
  "daily-event-count": { topic: "aggregations", subtopic: "group-by", concepts: ["groupBy", "count"], deRelevance: "high", learningOrder: 1 },
  "sum-amount-by-region": { topic: "aggregations", subtopic: "group-by", concepts: ["groupBy", "sum"], deRelevance: "high", learningOrder: 2 },
  "groupby-multiple-keys": { topic: "aggregations", subtopic: "multi-key-groupby", concepts: ["groupBy", "multi-key"], deRelevance: "high", learningOrder: 3 },
  "join-orders-customers": { topic: "joins", subtopic: "inner-join", concepts: ["join", "inner"], deRelevance: "high", learningOrder: 1 },
  "dedupe-with-window": { topic: "window-functions", subtopic: "window-dedupe", concepts: ["Window", "row_number"], deRelevance: "high", learningOrder: 1 },
  "drop-duplicates-by-key": { topic: "deduplication", subtopic: "drop-duplicates", concepts: ["dropDuplicates"], deRelevance: "high", learningOrder: 1 },
  "repartition-before-write": { topic: "repartition-coalesce", subtopic: "repartition", concepts: ["repartition"], deRelevance: "high", learningOrder: 1 },
  "cache-reused-df": { topic: "caching", subtopic: "cache", concepts: ["cache", "persist"], deRelevance: "high", learningOrder: 1 },

  // ── DSA (9) ──
  "pair-sum-target": { topic: "hashing", subtopic: "two-sum", concepts: ["HashMap", "two sum"], deRelevance: "medium", learningOrder: 1 },
  "has-duplicate": { topic: "hashing", subtopic: "contains-duplicate", concepts: ["HashSet"], deRelevance: "medium", learningOrder: 2 },
  "reverse-words": { topic: "strings", subtopic: "reverse", concepts: ["split", "reverse"], deRelevance: "low", learningOrder: 1 },
  "merge-intervals": { topic: "sorting", subtopic: "merge-intervals", concepts: ["sort", "merge"], deRelevance: "medium", learningOrder: 1 },
  "binary-search-index": { topic: "binary-search", subtopic: "classic", concepts: ["binary search"], deRelevance: "medium", learningOrder: 1 },
  "valid-parentheses": { topic: "stack", subtopic: "bracket-matching", concepts: ["stack"], deRelevance: "low", learningOrder: 1 },
  "top-k-frequent": { topic: "heap", subtopic: "top-k", concepts: ["Counter", "top-K"], deRelevance: "medium", learningOrder: 1 },
  "max-subarray-sum": { topic: "dynamic-programming", subtopic: "kadane", concepts: ["Kadane"], deRelevance: "medium", learningOrder: 1 },
  "longest-increasing-subsequence-length": { topic: "dynamic-programming", subtopic: "lis", concepts: ["LIS", "DP"], deRelevance: "medium", learningOrder: 2 },
};

export const PROBLEM_TAXONOMY = { ...BASE_TAXONOMY, ...BATCH4_TAXONOMY };

export function applyTaxonomy(slug, body) {
  const tag = PROBLEM_TAXONOMY[slug];
  if (!tag) return body;
  return {
    ...body,
    topic: tag.topic,
    subtopic: tag.subtopic,
    concepts: tag.concepts ?? body.concepts,
    deRelevance: tag.deRelevance ?? "high",
    learningOrder: tag.learningOrder ?? 99,
  };
}

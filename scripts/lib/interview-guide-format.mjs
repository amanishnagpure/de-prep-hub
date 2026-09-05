/**
 * Rich formatting for DE Interview Guide Q&A blocks in notes.
 */

export function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'");
}

export function stripSpanNoise(code) {
  return code
    .replace(/<span[^>]*>/gi, "")
    .replace(/<\/span>/gi, "")
    .replace(/<a[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .trim();
}

export function htmlToMarkdown(html) {
  if (!html) return "";

  let text = html;

  text = text.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, raw) => {
    const code = decodeHtml(stripSpanNoise(raw));
    const lang = detectLang(code);
    return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  });

  text = text
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, item) => `- ${decodeHtml(item.replace(/<[^>]+>/g, "").trim())}\n`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  return decodeHtml(text).replace(/\n{3,}/g, "\n\n").trim();
}

export function detectLang(code) {
  if (/^(MERGE|SELECT|VACUUM|OPTIMIZE|CREATE|DESCRIBE|ALTER|INSERT|RESTORE|GRANT|UPDATE|WITH)\b/im.test(code)) {
    return "sql";
  }
  if (/^(FROM|@|parameters|pipeline|trigger)/im.test(code)) return "json";
  return "python";
}

export function extractCodeBlocks(markdown) {
  const blocks = [];
  const re = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = re.exec(markdown)) !== null) {
    blocks.push({ lang: match[1] || detectLang(match[2]), code: match[2].trim() });
  }
  return blocks;
}

export function proseWithoutCode(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sentencesFromText(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
}

export function shortTitle(q, max = 72) {
  return q.length > max ? `${q.slice(0, max - 1)}…` : q;
}

export function tableMd(rows) {
  if (!rows?.length) return "";
  const [header, ...body] = rows;
  const sep = header.map(() => "---");
  return [
    `| ${header.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

export function enrichmentKey(section, id) {
  return `${section}:${id}`;
}

export function isDifferenceQuestion(q) {
  return /difference between|vs\.?|versus|compare/i.test(q);
}

export function inferComparisonTable(q, answer) {
  if (!isDifferenceQuestion(q)) return null;

  const match = q.match(/difference between\s+(.+?)\s+and\s+(.+?)[\?\.]?$/i);
  if (!match) return null;

  const left = match[1].trim();
  const right = match[2].trim();
  const sentences = sentencesFromText(answer);

  return [
    ["Aspect", left, right],
    ["Summary", sentences[0] ?? answer.slice(0, 120), sentences[1] ?? "See answer above"],
    ["Interview tip", `Explain when to choose ${left}`, `Explain when to choose ${right}`],
  ];
}

export function inferKeyPoints(question, markdown, enrichment) {
  if (enrichment?.points?.length) return enrichment.points;

  const bullets = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());

  if (bullets.length >= 2) return bullets.slice(0, 8);

  const prose = proseWithoutCode(markdown);
  const sentences = sentencesFromText(prose);
  if (sentences.length >= 2) return sentences.slice(0, 6);

  return null;
}

export function inferInterviewTip(question, section) {
  const q = question.toLowerCase();

  if (section === "sql") {
    if (q.includes("window")) return "State the PARTITION BY grain and why ORDER BY matters for tie-breaking.";
    if (q.includes("join")) return "Draw tables on whiteboard, label join key cardinality, mention NULL behavior.";
    if (q.includes("index")) return "Connect to selective predicates and covering indexes for fact-table scans.";
    return "Start with definition, give a concrete table example, then mention performance or correctness edge case.";
  }

  if (section === "adf") {
    if (q.includes("trigger")) return "Mention schedule vs tumbling window vs event trigger and idempotent reruns.";
    if (q.includes("copy")) return "Discuss DIU, partitioning source query, and sink file size — not just activity names.";
    return "Name the ADF object, when you use it in medallion pipelines, and one monitoring or cost pitfall.";
  }

  if (section === "spark" || section === "dbx") {
    if (q.includes("skew")) return "Describe straggler task in Spark UI Stages tab and your salting or broadcast fix.";
    if (q.includes("delta") || q.includes("merge")) return "Explain ACID via transaction log and idempotent MERGE keys.";
    return "Separate driver vs executor concerns; mention lazy evaluation and when an action triggers work.";
  }

  return "Lead with a one-line definition, then a production example, then a tradeoff or failure mode.";
}

export function inferDeExample(question, section, enrichment) {
  if (enrichment?.de) return enrichment.de;

  const q = question.toLowerCase();

  if (section === "sql") {
    if (q.includes("primary key")) {
      return "In `silver.orders`, `order_id` is the PK — duplicate CDC replays are rejected before gold aggregation.";
    }
    if (q.includes("foreign key")) {
      return "Enforce `orders.customer_id → dim_customer.customer_id` in warehouse; in lakes use DQ checks + silver MERGE.";
    }
    if (q.includes("window") || q.includes("rank") || q.includes("row_number")) {
      return "Deduplicate bronze events: `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_ts DESC) = 1` before silver.";
    }
    if (q.includes("scd")) {
      return "Customer dimension: Type 1 for typo fixes on email; Type 2 when address history matters for compliance.";
    }
    if (q.includes("join")) {
      return "Reconcile `fct_orders` to `dim_customer` — flag orphan `customer_id` rows in bronze quarantine.";
    }
    return "Nightly Synapse/Databricks SQL job validates row counts and null rates on business keys before gold publish.";
  }

  if (section === "adf") {
    if (q.includes("lookup")) {
      return "Lookup reads `etl.watermark` (single row) → passes `max_ts` into Copy source SQL for incremental ADLS landing.";
    }
    if (q.includes("metadata")) {
      return "Get Metadata on `bronze/incoming/` checks `childItems` + `lastModified` before ForEach copies new files.";
    }
    if (q.includes("foreach")) {
      return "ForEach `@activity('ListDates').output.value` — each iteration triggers child pipeline for one `dt=` partition.";
    }
    if (q.includes("key vault")) {
      return "Linked service connection strings reference `@Microsoft.KeyVault(SecretUri=...)` — no secrets in Git ARM.";
    }
    return "Medallion pipeline: trigger at 02:00 UTC → Copy bronze → Databricks notebook silver → stored proc gold watermark update.";
  }

  if (section === "spark") {
    if (q.includes("broadcast")) {
      return "Broadcast 2K-row `dim_country` when joining to 400M `fct_clicks` — avoids shuffle on dimension.";
    }
    if (q.includes("partition")) {
      return "Write `orders` with `partitionBy('order_date')` matching BI filter `WHERE order_date = yesterday`.";
    }
    return "Bronze JSON → `filter` bad rows → `groupBy` region metrics → `write` Delta silver with `replaceWhere` on `dt`.";
  }

  if (section === "dbx") {
    if (q.includes("delta") || q.includes("merge")) {
      return "`MERGE INTO silver.customers` on `customer_id` — upsert CDC from bronze, soft-delete when `op='D'`.";
    }
    if (q.includes("mount") || q.includes("adls")) {
      return "Prefer UC external location + MSI over legacy mounts; path `abfss://datalake@acct.dfs.core.windows.net/silver/`.";
    }
    if (q.includes("cluster")) {
      return "Prod Workflow uses **job cluster** per run; all-purpose only for interactive debugging of failed stage.";
    }
    return "Auto Loader bronze → expectations on null PK → MERGE silver → OPTIMIZE + ZORDER on filter columns.";
  }

  return "Tie the concept to a bronze → silver → gold pipeline step you have run in production.";
}

export function inferMistake(question, section, enrichment) {
  if (enrichment?.mistake) return enrichment.mistake;

  const q = question.toLowerCase();

  if (section === "sql") {
    if (q.includes("left join") && q.includes("where")) {
      return "Filtering the right table in `WHERE` turns a LEFT JOIN into an INNER JOIN — filter in `ON` instead.";
    }
    if (q.includes("union")) return "Using UNION when UNION ALL suffices — pays dedup sort cost unnecessarily.";
    if (q.includes("null")) return "Forgetting `COUNT(col)` vs `COUNT(*)` — NULLs excluded from column count.";
    return "Writing SQL without stating grain, NULL assumptions, or expected row-count change.";
  }

  if (section === "adf") {
    if (q.includes("lookup")) return "Using Lookup for thousands of keys — hits 5K row / 4 MB cap; use Copy or join in Spark.";
    if (q.includes("foreach")) return "Nested ForEach without concurrency cap — throttles source or overwhelms IR.";
    return "Hard-coding connection strings in pipeline JSON instead of Key Vault + parameterized environments.";
  }

  if (section === "spark" || section === "dbx") {
    if (q.includes("collect")) return "`collect()` on large DataFrame — OOM driver in interview and in prod.";
    if (q.includes("cache")) return "Caching every intermediate DF without unpersist — memory pressure across stages.";
    return "Naming transformations without explaining shuffle, skew, or driver vs executor boundaries.";
  }

  return "Reciting definitions without a concrete pipeline example or failure story.";
}

export function expandShortAnswer(question, prose, section) {
  if (prose.length >= 180) return prose;

  const intro = prose || "This is a core data engineering interview topic.";
  const tip = inferInterviewTip(question, section);

  return `${intro} In a DE interview, connect this to data quality, pipeline SLAs, and how you would implement or debug it in a medallion architecture. ${tip}`;
}

export function explainCodeOnlyQuestion(question, code, section) {
  const q = question.toLowerCase();
  let intro = "The solution uses the pattern below.";

  if (q.includes("scd")) {
    intro =
      "**Type 1** overwrites the current dimension row in place (no history). **Type 2** closes the old version and inserts a new current row with `start_date` / `end_date` / `is_current` — standard for audit and compliance.";
  } else if (q.includes("dedup") || q.includes("duplicate") || q.includes("row_number")) {
    intro =
      "Use a window function to rank rows per business key and keep one survivor — typically the latest by timestamp. This is the SQL equivalent of `dropDuplicates` with ordering in Spark.";
  } else if (q.includes("join")) {
    intro =
      "Join dimension and fact tables on the grain you need for the metric. Watch NULL join keys and whether filters belong in `ON` vs `WHERE` for outer joins.";
  } else if (q.includes("group")) {
    intro =
      "Aggregate to the reporting grain with `GROUP BY`, using conditional aggregates (`SUM(CASE...)`) when you need multiple metrics in one pass.";
  } else if (q.includes("delta") || q.includes("merge")) {
    intro =
      "Delta MERGE applies inserts/updates/deletes atomically via the transaction log — idempotent when keyed on business natural keys.";
  } else if (q.includes("filter") || q.includes("null")) {
    intro = "Filter or drop invalid rows early in the pipeline to prevent bad data propagating to silver and gold.";
  } else if (section === "adf") {
    intro = "In ADF, compose activities with explicit dependencies, parameters, and failure paths — modular child pipelines improve reuse.";
  }

  return intro;
}

export function buildRichBlock({
  item,
  localNum,
  section,
  enrichment = {},
}) {
  const markdown = htmlToMarkdown(item.a_html);
  const codeBlocks = enrichment.syntax
    ? [{ lang: detectLang(enrichment.syntax), code: enrichment.syntax.trim() }]
    : extractCodeBlocks(markdown);

  let prose = enrichment.answer ?? proseWithoutCode(markdown);
  if (!prose && codeBlocks.length) {
    prose = explainCodeOnlyQuestion(item.q, codeBlocks[0].code, section);
  }
  prose = expandShortAnswer(item.q, prose, section);

  const lines = [
    `### ${localNum}. ${shortTitle(item.q)}`,
    "",
    `**Interview question:** ${item.q}`,
    "",
    `**Answer:** ${prose}`,
    "",
  ];

  const points = inferKeyPoints(item.q, markdown, enrichment);
  if (points?.length) {
    lines.push("**Key points:**", "", ...points.map((p) => `- ${p}`), "");
  }

  if (enrichment.walkthrough) {
    lines.push("**Walkthrough:**", "", enrichment.walkthrough, "");
  }

  const table = enrichment.table ?? inferComparisonTable(item.q, prose);
  if (table) {
    lines.push("**Comparison:**", "", tableMd(table), "");
  }

  if (enrichment.diagram) {
    lines.push("**Architecture / flow:**", "", "```text", enrichment.diagram, "```", "");
  }

  if (codeBlocks.length) {
    for (const block of codeBlocks) {
      lines.push("**Syntax / example:**", "", `\`\`\`${block.lang}`, block.code, "```", "");
    }
  }

  lines.push(
    `**How to explain in interview:** ${enrichment.interviewTip ?? inferInterviewTip(item.q, section)}`,
    "",
    `**DE example:** ${inferDeExample(item.q, section, enrichment)}`,
    "",
    `**Common mistake:** ${inferMistake(item.q, section, enrichment)}`,
    "",
    `**Source:** DE Interview Guide — ${item.source ?? section} Q${item.id}`,
    ""
  );

  return lines.join("\n");
}

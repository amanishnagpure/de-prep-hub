#!/usr/bin/env node
/**
 * Builds src/data/practice-platform/problems.json from curated sources.
 * Run: node scripts/seed-practice-platform.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.join(__dirname, "..");
const outFile = path.join(root, "src/data/practice-platform/problems.json");

const pythonCoding = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/python-coding-track.json"), "utf8")
);
const leetcodeSql = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/leetcode-sql-top50.json"), "utf8")
);

const DSA_TESTS = {
  "two-sum": {
    cases: [
      { id: "1", input: "nums = [2,7,11,15], target = 9", args: [[2, 7, 11, 15], 9], expected: [0, 1], expectedOutput: "[0,1]", isHidden: false },
      { id: "2", input: "nums = [3,2,4], target = 6", args: [[3, 2, 4], 6], expected: [1, 2], expectedOutput: "[1,2]", isHidden: true },
    ],
  },
  "contains-duplicate": {
    cases: [
      { id: "1", input: "[1,2,3,1]", args: [[1, 2, 3, 1]], expected: true, expectedOutput: "true", isHidden: false },
      { id: "2", input: "[1,2,3,4]", args: [[1, 2, 3, 4]], expected: false, expectedOutput: "false", isHidden: true },
    ],
  },
  "valid-anagram": {
    cases: [
      { id: "1", input: 's = "anagram", t = "nagaram"', args: ["anagram", "nagaram"], expected: true, expectedOutput: "true", isHidden: false },
      { id: "2", input: 's = "rat", t = "car"', args: ["rat", "car"], expected: false, expectedOutput: "false", isHidden: true },
    ],
  },
  "group-anagrams": {
    cases: [
      {
        id: "1",
        input: '["eat","tea","tan","ate","nat","bat"]',
        args: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
        expectedOutput: "grouped anagram lists",
        compare: "sorted",
        isHidden: false,
      },
    ],
  },
  "top-k-frequent-elements": {
    cases: [
      { id: "1", input: "nums=[1,1,1,2,2,3], k=2", args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], expectedOutput: "[1,2]", compare: "set", isHidden: false },
    ],
  },
  "product-of-array-except-self": {
    cases: [
      { id: "1", input: "[1,2,3,4]", args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], expectedOutput: "[24,12,8,6]", isHidden: false },
    ],
  },
  "longest-substring-without-repeating-characters": {
    cases: [
      { id: "1", input: '"abcabcbb"', args: ["abcabcbb"], expected: 3, expectedOutput: "3", isHidden: false },
      { id: "2", input: '"bbbbb"', args: ["bbbbb"], expected: 1, expectedOutput: "1", isHidden: true },
    ],
  },
  "longest-repeating-character-replacement": {
    cases: [
      { id: "1", input: 's="AABABBA", k=1', args: ["AABABBA", 1], expected: 4, expectedOutput: "4", isHidden: false },
    ],
  },
  "permutation-in-string": {
    cases: [
      { id: "1", input: 's1="ab", s2="eidbaooo"', args: ["ab", "eidbaooo"], expected: true, expectedOutput: "true", isHidden: false },
    ],
  },
  "valid-parentheses": {
    cases: [
      { id: "1", input: '"()[]{}"', args: ["()[]{}"], expected: true, expectedOutput: "true", isHidden: false },
      { id: "2", input: '"(]"', args: ["(]"], expected: false, expectedOutput: "false", isHidden: true },
    ],
  },
  "valid-palindrome": {
    cases: [
      { id: "1", input: '"A man, a plan, a canal: Panama"', args: ["A man, a plan, a canal: Panama"], expected: true, expectedOutput: "true", isHidden: false },
    ],
  },
  "binary-search": {
    cases: [
      { id: "1", input: "nums=[-1,0,3,5,9,12], target=9", args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, expectedOutput: "4", isHidden: false },
      { id: "2", input: "target=2", args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, expectedOutput: "-1", isHidden: true },
    ],
  },
  "climbing-stairs": {
    cases: [
      { id: "1", input: "n=3", args: [3], expected: 3, expectedOutput: "3", isHidden: false },
      { id: "2", input: "n=5", args: [5], expected: 8, expectedOutput: "8", isHidden: true },
    ],
  },
};

function extractFn(solution) {
  const m = solution.match(/def\s+([A-Za-z_]\w*)\s*\(/);
  return m?.[1];
}

function titleCase(slug) {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function base(problem) {
  return {
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    hints: problem.hints ?? [],
    editorial: problem.editorial ?? problem.solution,
    starterCode: problem.starterCode ?? "",
    ...problem,
  };
}

function buildDsa() {
  return pythonCoding.map((p) => {
    const meta = DSA_TESTS[p.slug];
    const fn = extractFn(p.solution);
    const cases = meta?.cases ?? [];
    return base({
      id: `dsa/${p.slug}`,
      slug: p.slug,
      track: "dsa",
      title: p.title,
      description: `${p.summary}\n\nImplement \`${fn}\` efficiently.`,
      difficulty: p.difficulty,
      topics: [p.pattern],
      constraints: ["Follow the starter function signature", `${p.timeLimitMs ?? 2000}ms time limit per case`],
      examples: cases.filter((c) => !c.isHidden).map((c) => ({ input: c.input, output: c.expectedOutput })),
      solution: p.solution,
      judge: cases.length ? "pyodide" : "compare",
      functionName: fn,
      testCases: cases.length ? cases : [{ id: "1", input: "code", expectedOutput: "reference", isHidden: true }],
      externalUrl: p.leetcodeUrl,
      hints: [p.approach],
    });
  });
}

function buildSql(limit = 25) {
  return leetcodeSql.slice(0, limit).map((p) =>
    base({
      id: `sql/${p.slug}`,
      slug: p.slug,
      track: "sql",
      title: p.title,
      description: `${p.summary}\n\n**Approach:** ${p.approach}${p.dialectNote ? `\n\n*Dialect note:* ${p.dialectNote}` : ""}`,
      difficulty: p.difficulty,
      topics: [p.pattern],
      constraints: ["SELECT / WITH only", "Match expected result shape"],
      examples: [{ input: `Tables: ${p.tables.join(", ")}`, output: "Query returns expected columns and rows" }],
      solution: p.solution,
      judge: "sql",
      tables: p.tables,
      testCases: [{ id: "submit", input: "SQL query", expectedOutput: "Reference result", isHidden: true }],
      externalUrl: p.leetcodeUrl,
      hints: [p.approach],
    })
  );
}

const PYTHON_DE = [
  {
    slug: "csv-sum",
    title: "Sum CSV Column",
    fn: "csv_sum",
    topics: ["csv"],
    description: "Sum integer values in the `amount` column of CSV text (header row included).",
    solution: `def csv_sum(text):\n    lines = text.strip().splitlines()\n    idx = lines[0].split(',').index('amount')\n    return sum(int(r.split(',')[idx]) for r in lines[1:])`,
    cases: [
      { id: "1", input: "id,amount\\n1,10\\n2,5", args: ["id,amount\n1,10\n2,5"], expected: 15, expectedOutput: "15", isHidden: false },
      { id: "2", input: "three rows", args: ["id,amount\n1,4\n2,6\n3,0"], expected: 10, expectedOutput: "10", isHidden: true },
    ],
  },
  {
    slug: "word-count",
    title: "Word Frequency",
    fn: "word_count",
    topics: ["hashmap"],
    description: "Return a dict mapping each lowercase word to its frequency.",
    solution: `def word_count(text):\n    counts = {}\n    for word in text.lower().split():\n        counts[word] = counts.get(word, 0) + 1\n    return counts`,
    cases: [
      { id: "1", input: "data data eng", args: ["data data eng"], expected: { data: 2, eng: 1 }, expectedOutput: "{data:2,eng:1}", isHidden: false },
    ],
  },
  {
    slug: "dedupe-by-id",
    title: "Deduplicate Records",
    fn: "dedupe_by_id",
    topics: ["etl"],
    description: "Given list of dicts with `id`, keep the last occurrence of each id.",
    solution: `def dedupe_by_id(rows):\n    seen = {}\n    for row in rows:\n        seen[row['id']] = row\n    return list(seen.values())`,
    cases: [
      {
        id: "1",
        input: "three rows, duplicate id",
        args: [[{ id: 1, v: "a" }, { id: 2, v: "b" }, { id: 1, v: "c" }]],
        expected: [{ id: 1, v: "c" }, { id: 2, v: "b" }],
        expectedOutput: "last wins",
        isHidden: false,
      },
    ],
  },
  {
    slug: "moving-average",
    title: "Moving Average",
    fn: "moving_average",
    topics: ["window"],
    description: "Return moving averages of window size k for numeric list nums.",
    solution: `def moving_average(nums, k):\n    out, window = [], 0\n    for i, n in enumerate(nums):\n        window += n\n        if i >= k:\n            window -= nums[i-k]\n        if i >= k-1:\n            out.append(window/k)\n    return out`,
    cases: [
      { id: "1", input: "[1,2,3,4], k=2", args: [[1, 2, 3, 4], 2], expected: [1.5, 2.5, 3.5], expectedOutput: "[1.5,2.5,3.5]", isHidden: false },
    ],
  },
  {
    slug: "parse-json-field",
    title: "Parse JSON Field",
    fn: "parse_user_id",
    topics: ["json"],
    description: "Parse JSON string and return integer user_id.",
    solution: `import json\n\ndef parse_user_id(payload):\n    return int(json.loads(payload)['user_id'])`,
    cases: [
      { id: "1", input: '{"user_id":42}', args: ['{"user_id":42}'], expected: 42, expectedOutput: "42", isHidden: false },
    ],
  },
];

function buildPython() {
  return PYTHON_DE.map((p) =>
    base({
      id: `python/${p.slug}`,
      slug: p.slug,
      track: "python",
      title: p.title,
      description: p.description,
      difficulty: "easy",
      topics: p.topics,
      constraints: ["Standard library only"],
      examples: p.cases.filter((c) => !c.isHidden).map((c) => ({ input: c.input, output: c.expectedOutput })),
      solution: p.solution,
      judge: "pyodide",
      functionName: p.fn,
      testCases: p.cases,
      hints: ["Think about edge cases with empty input"],
    })
  );
}

const SPARK = [
  { slug: "read-parquet", title: "Read Parquet", topics: ["io"], description: "Read parquet path into df.", solution: "df = spark.read.parquet(path)" },
  { slug: "filter-active", title: "Filter Active", topics: ["transform"], description: "Filter df where status is active.", solution: "active = df.filter(df.status == 'active')" },
  { slug: "select-columns", title: "Select Columns", topics: ["transform"], description: "Select user_id, event_time from df.", solution: "out = df.select('user_id', 'event_time')" },
  { slug: "group-count", title: "Group Count", topics: ["aggregation"], description: "Count rows per country.", solution: "counts = df.groupBy('country').count()" },
  { slug: "inner-join", title: "Inner Join", topics: ["joins"], description: "Inner join orders and customers on customer_id.", solution: "joined = orders.join(customers, on='customer_id', how='inner')" },
  { slug: "drop-duplicates", title: "Drop Duplicates", topics: ["transform"], description: "Drop duplicates on user_id and event_date.", solution: "deduped = df.dropDuplicates(['user_id', 'event_date'])" },
  { slug: "with-column", title: "With Column", topics: ["transform"], description: "Add amount_usd = amount * rate.", solution: "with_usd = df.withColumn('amount_usd', df.amount * df.rate)" },
  { slug: "order-by", title: "Order By", topics: ["transform"], description: "Sort df by event_time descending.", solution: "sorted_df = df.orderBy(df.event_time.desc())" },
  { slug: "spark-sql-daily", title: "Spark SQL Daily Count", topics: ["sql"], description: "Register temp view and count events per day.", solution: "df.createOrReplaceTempView('events')\nresult = spark.sql(\"SELECT event_date, COUNT(*) cnt FROM events GROUP BY event_date\")" },
  { slug: "cache-df", title: "Cache DataFrame", topics: ["optimization"], description: "Cache df for reuse.", solution: "cached = df.cache()" },
  { slug: "coalesce-files", title: "Coalesce Partitions", topics: ["optimization"], description: "Coalesce df to 4 partitions before write.", solution: "compact = df.coalesce(4)" },
  { slug: "union-dataframes", title: "Union DataFrames", topics: ["transform"], description: "Union df1 and df2 by name.", solution: "combined = df1.unionByName(df2)" },
];

function buildSpark() {
  return SPARK.map((p, i) =>
    base({
      id: `spark/${p.slug}`,
      slug: p.slug,
      track: "spark",
      title: p.title,
      description: p.description,
      difficulty: i < 4 ? "easy" : i < 9 ? "medium" : "hard",
      topics: p.topics,
      constraints: ["Use PySpark DataFrame API"],
      examples: [{ input: "Sample dataframe(s)", output: "Transformed result" }],
      starterCode: "# PySpark\n",
      solution: p.solution,
      judge: "compare",
      testCases: [{ id: "1", input: "code", expectedOutput: "reference", isHidden: true }],
      hints: ["Match column names and API methods from the prompt"],
    })
  );
}

const all = [...buildDsa(), ...buildSql(50), ...buildPython(), ...buildSpark()];
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(all, null, 2));

const counts = all.reduce((acc, p) => {
  acc[p.track] = (acc[p.track] || 0) + 1;
  return acc;
}, {});
console.log("Seeded", all.length, "problems", counts);

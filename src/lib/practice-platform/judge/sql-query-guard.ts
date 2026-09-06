/** Strip SQL comments and string literals before static safety checks. */

export function stripSqlComments(sql: string): string {
  return sql
    .replace(/--[^\n\r]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
}

export function stripSqlStringLiterals(sql: string): string {
  return sql
    .replace(/'(?:''|[^'])*'/g, "''")
    .replace(/"(?:""|[^"])*"/g, '""');
}

/** First statement only — ignores trailing semicolons and later statements. */
export function firstSqlStatement(sql: string): string {
  const stripped = stripSqlComments(sql.trim());
  const withoutTrailing = stripped.replace(/;\s*$/, "");
  return (withoutTrailing.split(";")[0] ?? "").trim();
}

const READONLY_START =
  /^\(?\s*(SELECT|WITH|EXPLAIN|PRAGMA)\b/i;
const MUTABLE_START =
  /^\(?\s*(SELECT|WITH|DELETE|INSERT|UPDATE|EXPLAIN|PRAGMA)\b/i;

const FORBIDDEN_MUTATIONS =
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|TRUNCATE)\b/i;

type SqlGuardContext = "practice" | "playground" | "judge";

const READONLY_ERROR: Record<SqlGuardContext, string> = {
  practice:
    "Only read-only queries are allowed (SELECT, WITH, EXPLAIN). Submit DELETE problems with the required statement.",
  playground: "Only read-only queries are allowed (SELECT, WITH, EXPLAIN, PRAGMA).",
  judge: "Only read-only queries are allowed (SELECT, WITH, EXPLAIN).",
};

const MUTATION_ERROR: Record<SqlGuardContext, string> = {
  practice:
    "Data modification is disabled for this problem — use SELECT unless the problem requires DELETE.",
  playground: "Data modification statements are disabled in the playground.",
  judge:
    "Data modification is disabled for this problem — use SELECT unless the problem requires DELETE.",
};

export function validateSqlQuery(
  query: string,
  allowMutations: boolean,
  context: SqlGuardContext = "practice"
): string | null {
  const trimmed = query.trim();
  if (!trimmed) return "Write a SQL query first.";

  const statement = firstSqlStatement(trimmed);
  if (!statement) return "Write a SQL query first.";

  if (allowMutations) {
    if (!MUTABLE_START.test(statement)) {
      return "Only SQL statements are allowed (SELECT, WITH, DELETE, INSERT, UPDATE).";
    }
    return null;
  }

  if (!READONLY_START.test(statement)) {
    return READONLY_ERROR[context];
  }

  const withoutLiterals = stripSqlStringLiterals(stripSqlComments(trimmed));
  if (FORBIDDEN_MUTATIONS.test(withoutLiterals)) {
    return MUTATION_ERROR[context];
  }

  return null;
}

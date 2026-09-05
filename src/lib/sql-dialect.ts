export type SqlDialect = "mssql" | "mysql";

export const SQL_DIALECT_KEY = "de-prep-hub-sql-dialect";
export const SQL_DIALECT_MANUAL_KEY = "de-prep-hub-sql-dialect-manual";

export const SQL_DIALECT_LABELS: Record<SqlDialect, string> = {
  mssql: "SQL Server",
  mysql: "MySQL (LeetCode)",
};

/** Canonical storage format for all solutions in the repo. */
export const CANONICAL_DIALECT: SqlDialect = "mssql";

export function getSqlDialect(): SqlDialect {
  if (typeof window === "undefined") return CANONICAL_DIALECT;
  const stored = localStorage.getItem(SQL_DIALECT_KEY);
  return stored === "mysql" ? "mysql" : "mssql";
}

export function setSqlDialect(dialect: SqlDialect, manual = true): void {
  localStorage.setItem(SQL_DIALECT_KEY, dialect);
  if (manual) {
    localStorage.setItem(SQL_DIALECT_MANUAL_KEY, "1");
  }
  window.dispatchEvent(new CustomEvent("sql-dialect-updated"));
}

export function isDialectManual(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SQL_DIALECT_MANUAL_KEY) === "1";
}

/** Best dialect per section — LeetCode uses MySQL; practice uses SQL Server. */
export function getRecommendedDialect(pathname: string): SqlDialect {
  if (pathname.startsWith("/sql/leetcode")) return "mysql";
  if (pathname.startsWith("/sql/practice")) return "mssql";
  return CANONICAL_DIALECT;
}

export function applyRouteDialect(pathname: string): void {
  if (typeof window === "undefined" || isDialectManual()) return;
  const recommended = getRecommendedDialect(pathname);
  if (getSqlDialect() !== recommended) {
    localStorage.setItem(SQL_DIALECT_KEY, recommended);
    window.dispatchEvent(new CustomEvent("sql-dialect-updated"));
  }
}

export function formatSqlForDialect(sql: string, dialect: SqlDialect): string {
  return dialect === "mysql" ? mssqlToMysql(sql) : sql;
}

export function mssqlToMysql(sql: string): string {
  let result = sql;

  // STRING_AGG(...) WITHIN GROUP (ORDER BY x) -> GROUP_CONCAT(... ORDER BY x SEPARATOR ',')
  result = result.replace(
    /STRING_AGG\s*\(\s*([^,]+?)\s*,\s*'([^']*)'\s*\)\s*WITHIN GROUP\s*\(\s*ORDER BY\s+([^)]+)\)/gi,
    "GROUP_CONCAT($1 ORDER BY $3 SEPARATOR '$2')"
  );
  result = result.replace(
    /STRING_AGG\s*\(\s*([^,]+?)\s*,\s*'([^']*)'\s*\)/gi,
    "GROUP_CONCAT($1 SEPARATOR '$2')"
  );

  // SELECT TOP n -> track for LIMIT append (simple queries)
  const topMatch = result.match(/SELECT\s+TOP\s+(\d+)\s+/i);
  if (topMatch && !/\bLIMIT\b/i.test(result)) {
    result = result.replace(/SELECT\s+TOP\s+\d+\s+/i, "SELECT ");
    result = result.replace(/;\s*$/, "");
    result = `${result.trim()}\nLIMIT ${topMatch[1]};`;
  }

  // OFFSET/FETCH
  result = result.replace(
    /ORDER BY\s+([^\n;]+)\s+OFFSET\s+0\s+ROWS\s+FETCH\s+NEXT\s+(\d+)\s+ROW(?:S)?\s+ONLY/gi,
    "ORDER BY $1\nLIMIT $2"
  );

  // DATEADD
  result = result.replace(
    /DATEADD\s*\(\s*day\s*,\s*(-?\d+)\s*,\s*([^)]+)\)/gi,
    (_, amount, dateExpr) => {
      const n = Number(amount);
      if (n >= 0) return `DATE_ADD(${dateExpr.trim()}, INTERVAL ${n} DAY)`;
      return `DATE_SUB(${dateExpr.trim()}, INTERVAL ${Math.abs(n)} DAY)`;
    }
  );

  // DATEDIFF(day, start, end) -> DATEDIFF(end, start) — MySQL uses (later, earlier)
  result = result.replace(
    /DATEDIFF\s*\(\s*day\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    (_, start, end) => `DATEDIFF(${end.trim()}, ${start.trim()})`
  );

  // DATEDIFF(second, ...) -> TIMESTAMPDIFF(SECOND, ...)
  result = result.replace(
    /DATEDIFF\s*\(\s*second\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    (_, start, end) => `TIMESTAMPDIFF(SECOND, ${start.trim()}, ${end.trim()})`
  );

  // DATEDIFF(minute, ...) -> TIMESTAMPDIFF(MINUTE, ...)
  result = result.replace(
    /DATEDIFF\s*\(\s*minute\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    (_, start, end) => `TIMESTAMPDIFF(MINUTE, ${start.trim()}, ${end.trim()})`
  );

  result = result.replace(/\bISNULL\s*\(/gi, "IFNULL(");
  result = result.replace(/\bGETDATE\s*\(\s*\)/gi, "CURDATE()");
  result = result.replace(/\bLEN\s*\(/gi, "CHAR_LENGTH(");
  result = result.replace(
    /DATEFROMPARTS\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    "DATE(CONCAT($1, '-', $2, '-', $3))"
  );
  result = result.replace(/\bFORMAT\s*\(\s*([^,]+)\s*,\s*'yyyy-MM'\s*\)/gi, "DATE_FORMAT($1, '%Y-%m')");
  result = result.replace(/(\w+)\s*%\s*(\d+)/g, "MOD($1, $2)");

  return result;
}

export function mysqlToMssql(sql: string): string {
  let result = sql;

  result = result.replace(
    /GROUP_CONCAT\s*\(\s*([^)]+?)\s+ORDER BY\s+([^)]+?)\s+SEPARATOR\s+'([^']*)'\s*\)/gi,
    "STRING_AGG($1, '$3') WITHIN GROUP (ORDER BY $2)"
  );
  result = result.replace(
    /GROUP_CONCAT\s*\(\s*([^)]+?)\s+SEPARATOR\s+'([^']*)'\s*\)/gi,
    "STRING_AGG($1, '$2')"
  );

  const limitMatch = result.match(/\nLIMIT\s+(\d+)\s*;?\s*$/i);
  if (limitMatch && !/\bTOP\b/i.test(result)) {
    result = result.replace(/\nLIMIT\s+\d+\s*;?\s*$/i, ";");
    result = result.replace(/^(\s*SELECT)\s+/i, `$1 TOP ${limitMatch[1]} `);
  }

  result = result.replace(
    /DATE_ADD\s*\(\s*([^,]+)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
    "DATEADD(day, $2, $1)"
  );
  result = result.replace(
    /DATE_SUB\s*\(\s*([^,]+)\s*,\s*INTERVAL\s+(\d+)\s+DAY\s*\)/gi,
    "DATEADD(day, -$2, $1)"
  );

  result = result.replace(
    /DATEDIFF\s*\(\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    (_, end, start) => `DATEDIFF(day, ${start.trim()}, ${end.trim()})`
  );

  result = result.replace(
    /TIMESTAMPDIFF\s*\(\s*SECOND\s*,\s*([^,]+)\s*,\s*([^)]+)\)/gi,
    (_, start, end) => `DATEDIFF(second, ${start.trim()}, ${end.trim()})`
  );

  result = result.replace(/\bIFNULL\s*\(/gi, "ISNULL(");
  result = result.replace(/\bCURDATE\s*\(\s*\)/gi, "CAST(GETDATE() AS date)");
  result = result.replace(/\bNOW\s*\(\s*\)/gi, "GETDATE()");
  result = result.replace(/\bCHAR_LENGTH\s*\(/gi, "LEN(");
  result = result.replace(/\bMOD\s*\(\s*([^,]+)\s*,\s*([^)]+)\)/gi, "($1 % $2)");

  return result;
}

export const SQL_DIALECT_CHEATSHEET: { topic: string; mssql: string; mysql: string }[] = [
  { topic: "Top N rows", mssql: "SELECT TOP 5 * FROM t", mysql: "SELECT * FROM t LIMIT 5" },
  { topic: "Null fallback", mssql: "ISNULL(col, 0)", mysql: "IFNULL(col, 0)" },
  { topic: "String length", mssql: "LEN(col)", mysql: "CHAR_LENGTH(col)" },
  { topic: "Today", mssql: "GETDATE()", mysql: "CURDATE() / NOW()" },
  { topic: "Add days", mssql: "DATEADD(day, 7, d)", mysql: "DATE_ADD(d, INTERVAL 7 DAY)" },
  {
    topic: "Day difference",
    mssql: "DATEDIFF(day, start, end)",
    mysql: "DATEDIFF(end, start)",
  },
  {
    topic: "String concat agg",
    mssql: "STRING_AGG(name, ',')",
    mysql: "GROUP_CONCAT(name SEPARATOR ',')",
  },
  { topic: "Modulo", mssql: "id % 2", mysql: "MOD(id, 2)" },
];

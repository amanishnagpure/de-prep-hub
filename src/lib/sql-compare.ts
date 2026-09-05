export function normalizeSql(sql: string): string {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .replace(/;$/, "");
}

import {
  formatSqlForDialect,
  mssqlToMysql,
  mysqlToMssql,
  type SqlDialect,
} from "@/lib/sql-dialect";

function canonicalizeForCompare(sql: string, dialect: SqlDialect): string {
  const mssql =
    dialect === "mysql" ? mysqlToMssql(sql) : sql;
  return normalizeSql(mssql);
}

export function compareSql(
  user: string,
  solution: string,
  dialect: SqlDialect = "mssql"
): { match: boolean; similarity: number; feedback: string } {
  const reference = formatSqlForDialect(solution, dialect);
  const a = canonicalizeForCompare(user, dialect);
  const b = canonicalizeForCompare(reference, dialect);

  if (!a) {
    return { match: false, similarity: 0, feedback: "Write a query before comparing." };
  }

  if (a === b) {
    return { match: true, similarity: 100, feedback: "Exact match" };
  }

  const aTokens = new Set(a.split(" ").filter(Boolean));
  const bTokens = new Set(b.split(" ").filter(Boolean));
  const intersection = [...aTokens].filter((token) => bTokens.has(token));
  const union = new Set([...aTokens, ...bTokens]);
  const similarity = union.size > 0 ? Math.round((intersection.length / union.size) * 100) : 0;

  if (similarity >= 85) {
    return {
      match: false,
      similarity,
      feedback: "Very close — check aliases, column order, or filters.",
    };
  }

  if (similarity >= 55) {
    return {
      match: false,
      similarity,
      feedback: "Partially aligned — compare JOINs, GROUP BY, and WHERE clauses.",
    };
  }

  return {
    match: false,
    similarity,
    feedback: "Different approach — study the solution and retry.",
  };
}

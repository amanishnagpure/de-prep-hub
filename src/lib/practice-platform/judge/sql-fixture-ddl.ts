import type { JudgeFixture } from "@/lib/judge/types";
import type { SqlFixture } from "@/lib/de-code/sql-seed-types";
import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function schemaForTable(
  tableName: string,
  schemas: SqlPracticeSeed["tables"]
): { name: string; type: string }[] {
  const match = schemas.find(
    (t) => t.label.toLowerCase() === tableName.toLowerCase()
  );
  if (match?.columns?.length) {
    return match.columns.map((c) => ({ name: c.name, type: c.type }));
  }
  return [];
}

function inferColumnsFromRows(rows: Record<string, unknown>[]): { name: string; type: string }[] {
  if (rows.length === 0) return [];
  const sample = rows[0];
  return Object.keys(sample).map((name) => {
    const val = sample[name];
    let type = "TEXT";
    if (typeof val === "number" && Number.isFinite(val)) type = Number.isInteger(val) ? "INT" : "REAL";
    return { name, type };
  });
}

function buildCreateTable(tableName: string, columns: { name: string; type: string }[]): string {
  if (columns.length === 0) {
    return `CREATE TABLE ${tableName} (placeholder TEXT);`;
  }
  const cols = columns.map((c) => `${c.name} ${c.type}`).join(", ");
  return `CREATE TABLE ${tableName} (${cols});`;
}

function buildInsert(tableName: string, columns: string[], rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const colList = columns.join(", ");
  const values = rows
    .map((row) => `(${columns.map((col) => sqlLiteral(row[col])).join(", ")})`)
    .join(", ");
  return `INSERT INTO ${tableName} (${colList}) VALUES ${values};`;
}

/** Convert generic JudgeFixture table rows into SQLite init DDL for one fixture */
export function fixtureToInitSql(
  fixture: SqlFixture | JudgeFixture,
  tableSchemas: SqlPracticeSeed["tables"]
): string {
  const withInit = fixture as SqlFixture;
  if (withInit.initSql?.trim()) return withInit.initSql.trim();

  const statements: string[] = [];
  const tables = fixture.tables ?? {};

  for (const [tableName, rows] of Object.entries(tables)) {
    const schemaCols = schemaForTable(tableName, tableSchemas);
    const columns =
      schemaCols.length > 0 ? schemaCols : inferColumnsFromRows(rows);
    statements.push(buildCreateTable(tableName, columns));
    if (rows.length > 0) {
      const colNames = columns.map((c) => c.name);
      statements.push(buildInsert(tableName, colNames, rows));
    }
  }

  return statements.join("\n");
}

export function countFixtureInputRows(fixture: SqlFixture | JudgeFixture): number {
  const withInit = fixture as SqlFixture;
  if (withInit.initSql?.trim() && !fixture.tables) {
    return 0;
  }
  const tables = fixture.tables ?? {};
  return Object.values(tables).reduce((sum, rows) => sum + rows.length, 0);
}

import schemas from "@/data/sql-schemas.json";
import type { SqlPracticeQuestion } from "@/lib/sql-practice";

export interface SqlTableSchema {
  label: string;
  description: string;
  columns: { name: string; type: string; key?: string }[];
}

const TABLE_MAP = schemas as Record<string, SqlTableSchema>;

export function getAllSchemas(): SqlTableSchema[] {
  return Object.values(TABLE_MAP);
}

export function getSchemaForTable(name: string): SqlTableSchema | null {
  return TABLE_MAP[name.toLowerCase()] ?? null;
}

export function inferTablesFromQuestion(question: SqlPracticeQuestion): SqlTableSchema[] {
  const text = `${question.title} ${question.body} ${question.solution}`.toLowerCase();
  const tables = Object.keys(TABLE_MAP).filter((table) => text.includes(table));

  if (tables.length === 0) {
    return [TABLE_MAP.employees, TABLE_MAP.departments].filter(Boolean);
  }

  return tables.map((table) => TABLE_MAP[table]);
}

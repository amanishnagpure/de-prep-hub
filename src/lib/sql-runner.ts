import type { Database, SqlValue } from "sql.js";

export interface SqlRunResult {
  columns: string[];
  rows: SqlValue[][];
  rowCount: number;
  truncated: boolean;
}

export interface SqlRunError {
  error: string;
}

const MAX_ROWS = 100;

let dbPromise: Promise<Database> | null = null;

async function getDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const initSqlJs = (await import("sql.js")).default;
      const { SQL_PLAYGROUND_INIT } = await import("@/data/sql-playground-seed");

      const SQL = await initSqlJs({
        locateFile: (file) => `/wasm/${file}`,
      });

      const db = new SQL.Database();
      db.run(SQL_PLAYGROUND_INIT);
      return db;
    })();
  }
  return dbPromise;
}

export async function runPlaygroundQuery(
  query: string
): Promise<SqlRunResult | SqlRunError> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { error: "Write a SELECT query to run." };
  }

  if (!/^\s*(SELECT|WITH|PRAGMA|EXPLAIN)\b/i.test(trimmed)) {
    return {
      error: "Only read-only queries are allowed (SELECT, WITH, EXPLAIN, PRAGMA).",
    };
  }

  if (/(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|REPLACE|TRUNCATE)\b/i.test(trimmed)) {
    return { error: "Data modification statements are disabled in the playground." };
  }

  try {
    const db = await getDatabase();
    const results = db.exec(trimmed);

    if (results.length === 0) {
      return { columns: [], rows: [], rowCount: 0, truncated: false };
    }

    const first = results[0];
    const rows = first.values.slice(0, MAX_ROWS);

    return {
      columns: first.columns,
      rows,
      rowCount: first.values.length,
      truncated: first.values.length > MAX_ROWS,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Query failed.",
    };
  }
}

export function resetPlaygroundDatabase(): void {
  dbPromise = null;
}

import type { SqlRunResult } from "@/lib/sql-runner";

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  return String(value);
}

function rowKey(columns: string[], row: unknown[]): string {
  return columns.map((col, i) => `${col}:${normalizeCell(row[i])}`).join("|");
}

function sortRows(columns: string[], rows: unknown[][]): unknown[][] {
  return [...rows].sort((a, b) => rowKey(columns, a).localeCompare(rowKey(columns, b)));
}

export function compareSqlResults(
  expected: SqlRunResult,
  actual: SqlRunResult
): { pass: boolean; feedback: string; expectedPreview?: string; actualPreview?: string } {
  const expCols = expected.columns.map((c) => c.toLowerCase());
  const actCols = actual.columns.map((c) => c.toLowerCase());

  if (expCols.join(",") !== actCols.join(",")) {
    return {
      pass: false,
      feedback: `Column mismatch — expected (${expected.columns.join(", ")}), got (${actual.columns.join(", ")}).`,
      expectedPreview: expected.columns.join(", "),
      actualPreview: actual.columns.join(", "),
    };
  }

  const expSorted = sortRows(expected.columns, expected.rows);
  const actSorted = sortRows(actual.columns, actual.rows);

  if (expSorted.length !== actSorted.length) {
    return {
      pass: false,
      feedback: `Row count mismatch — expected ${expSorted.length}, got ${actSorted.length}.`,
      expectedPreview: `${expSorted.length} row(s)`,
      actualPreview: `${actSorted.length} row(s)`,
    };
  }

  for (let i = 0; i < expSorted.length; i += 1) {
    const expKey = rowKey(expected.columns, expSorted[i]);
    const actKey = rowKey(actual.columns, actSorted[i]);
    if (expKey !== actKey) {
      return {
        pass: false,
        feedback: `Row ${i + 1} differs from the reference result.`,
        expectedPreview: JSON.stringify(expSorted[i]),
        actualPreview: JSON.stringify(actSorted[i]),
      };
    }
  }

  return { pass: true, feedback: "Correct result." };
}

export function previewResult(result: SqlRunResult, maxRows = 3): string {
  if (result.rowCount === 0) return "0 rows";
  const sample = result.rows.slice(0, maxRows).map((row) => JSON.stringify(row));
  const suffix = result.rowCount > maxRows ? ` (+${result.rowCount - maxRows} more)` : "";
  return `${result.rowCount} row(s): ${sample.join(", ")}${suffix}`;
}

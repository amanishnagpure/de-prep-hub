import type { SqlValue } from "sql.js";
import type { JudgeComparisonConfig } from "@/lib/judge/types";
import { DEFAULT_COMPARISON } from "@/lib/judge/types";
import type { SqlRunResult } from "@/lib/sql-runner";

function normalizeCell(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  return String(value);
}

function normalizeColumns(columns: string[], ignoreCase: boolean): string[] {
  return ignoreCase ? columns.map((c) => c.toLowerCase()) : columns;
}

function rowKey(columns: string[], row: unknown[]): string {
  return columns.map((col, i) => `${col}:${normalizeCell(row[i])}`).join("|");
}

function sortRows(columns: string[], rows: unknown[][]): unknown[][] {
  return [...rows].sort((a, b) => rowKey(columns, a).localeCompare(rowKey(columns, b)));
}

function reorderColumns(
  sourceCols: string[],
  rows: unknown[][],
  targetCols: string[],
  ignoreCase: boolean
): unknown[][] {
  const indexMap = targetCols.map((target) => {
    const idx = sourceCols.findIndex((c) =>
      ignoreCase ? c.toLowerCase() === target.toLowerCase() : c === target
    );
    return idx;
  });
  if (indexMap.some((i) => i < 0)) return rows;
  return rows.map((row) => indexMap.map((i) => row[i]));
}

export function compareSqlResults(
  expected: SqlRunResult,
  actual: SqlRunResult,
  comparison?: JudgeComparisonConfig
): { pass: boolean; feedback: string; expectedPreview?: string; actualPreview?: string } {
  const cfg = { ...DEFAULT_COMPARISON, ...comparison };
  const ignoreCase = cfg.ignoreColumnCase ?? true;

  const expCols = [...expected.columns];
  let actCols = [...actual.columns];
  const expRows: SqlValue[][] = expected.rows.map((r) => [...r]);
  let actRows: SqlValue[][] = actual.rows.map((r) => [...r]);

  const expNorm = normalizeColumns(expCols, ignoreCase);
  const actNorm = normalizeColumns(actCols, ignoreCase);

  if (cfg.allowExtraColumns) {
    const allowed = new Set(expNorm);
    const extra = actNorm.filter((c) => !allowed.has(c));
    if (extra.length > 0) {
      return {
        pass: false,
        feedback: `Unexpected column(s): ${extra.join(", ")}.`,
        expectedPreview: expCols.join(", "),
        actualPreview: actCols.join(", "),
      };
    }
    actRows = reorderColumns(actCols, actRows, expCols, ignoreCase) as SqlValue[][];
    actCols = [...expCols];
  } else if (cfg.columnOrder) {
    if (expNorm.join(",") !== actNorm.join(",")) {
      return {
        pass: false,
        feedback: `Column mismatch — expected (${expCols.join(", ")}), got (${actCols.join(", ")}).`,
        expectedPreview: expCols.join(", "),
        actualPreview: actCols.join(", "),
      };
    }
  } else {
    const expSorted = [...expNorm].sort();
    const actSorted = [...actNorm].sort();
    if (expSorted.join(",") !== actSorted.join(",")) {
      return {
        pass: false,
        feedback: `Column mismatch — expected (${expCols.join(", ")}), got (${actCols.join(", ")}).`,
        expectedPreview: expCols.join(", "),
        actualPreview: actCols.join(", "),
      };
    }
    actRows = reorderColumns(actCols, actRows, expCols, ignoreCase) as SqlValue[][];
    actCols = [...expCols];
  }

  if (cfg.schema === false) {
    return { pass: true, feedback: "Schema check skipped." };
  }

  const expCompare = cfg.rowOrder ? expRows : sortRows(expCols, expRows);
  const actCompare = cfg.rowOrder ? actRows : sortRows(actCols, actRows);

  if (expCompare.length !== actCompare.length) {
    return {
      pass: false,
      feedback: `Row count mismatch — expected ${expCompare.length}, got ${actCompare.length}.`,
      expectedPreview: `${expCompare.length} row(s)`,
      actualPreview: `${actCompare.length} row(s)`,
    };
  }

  for (let i = 0; i < expCompare.length; i += 1) {
    const expKey = rowKey(expCols, expCompare[i]);
    const actKey = rowKey(actCols, actCompare[i]);
    if (expKey !== actKey) {
      return {
        pass: false,
        feedback: cfg.rowOrder
          ? `Row ${i + 1} differs from the reference result.`
          : `Result set differs from the reference (row ${i + 1} after sorting).`,
        expectedPreview: JSON.stringify(expCompare[i]),
        actualPreview: JSON.stringify(actCompare[i]),
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

"use client";

import * as React from "react";
import { Loader2, Play, RotateCcw } from "lucide-react";
import { runPlaygroundQuery, type SqlRunResult } from "@/lib/sql-runner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

interface SqlQueryRunnerProps {
  query: string;
  className?: string;
}

export function SqlQueryRunner({ query, className }: SqlQueryRunnerProps) {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<SqlRunResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const output = await runPlaygroundQuery(query);
    if ("error" in output) {
      setError(output.error);
    } else {
      setResult(output);
    }
    setLoading(false);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={loading || !query.trim()}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          Run
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-mono text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-border">
          {result.rows.length === 0 ? (
            <p className="bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
              Query returned 0 rows.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    {result.columns.map((col) => (
                      <th key={col} className="px-3 py-2 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border/40 last:border-0">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 font-mono text-xs">
                          {cell === null ? (
                            <span className="text-muted-foreground italic">NULL</span>
                          ) : (
                            String(cell)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="border-t border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            {result.rowCount} row{result.rowCount === 1 ? "" : "s"}
            {result.truncated ? ` (showing first ${result.rows.length})` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

interface SqlPlaygroundPanelProps {
  className?: string;
}

export function SqlPlaygroundPanel({ className }: SqlPlaygroundPanelProps) {
  const [query, setQuery] = React.useState("SELECT * FROM employees LIMIT 5;");

  return (
    <div className={cn("panel p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-cyan-500">
            SQL playground
          </p>
          <h3 className="text-lg font-semibold">Run queries on sample data</h3>
        </div>
        <button
          type="button"
          onClick={() => setQuery("SELECT * FROM employees LIMIT 5;")}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </button>
      </div>
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        spellCheck={false}
        className="mb-3 min-h-[100px] w-full resize-y rounded-xl border border-border bg-[oklch(0.12_0.02_250)] p-3 font-mono text-sm text-foreground outline-none ring-cyan-500/30 focus:ring-2"
      />
      <SqlQueryRunner query={query} />
    </div>
  );
}

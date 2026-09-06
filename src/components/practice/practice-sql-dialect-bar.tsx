"use client";

import * as React from "react";
import {
  getSqlDialect,
  setSqlDialect,
  SQL_DIALECT_CHEATSHEET,
  SQL_DIALECT_LABELS,
  type SqlDialect,
} from "@/lib/sql-dialect";
import { cn } from "cn";

function SqlDialectToggle({
  dialect,
  onChange,
  className,
}: {
  dialect: SqlDialect;
  onChange: (dialect: SqlDialect) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted/30 p-1",
        className
      )}
      role="group"
      aria-label="SQL dialect"
    >
      {(["mssql", "mysql"] as SqlDialect[]).map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            dialect === key
              ? key === "mysql"
                ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                : "bg-muted font-medium text-foreground ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {SQL_DIALECT_LABELS[key]}
        </button>
      ))}
    </div>
  );
}

export function PracticeSqlDialectBar() {
  const [dialect, setDialectState] = React.useState<SqlDialect>("mssql");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setDialectState(getSqlDialect());
    const handler = () => setDialectState(getSqlDialect());
    window.addEventListener("sql-dialect-updated", handler);
    return () => window.removeEventListener("sql-dialect-updated", handler);
  }, []);

  const setDialect = React.useCallback((next: SqlDialect) => {
    setSqlDialect(next);
    setDialectState(next);
  }, []);

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
        <SqlDialectToggle dialect={dialect} onChange={setDialect} />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {open ? "Hide" : "Cheat sheet"}
        </button>
      </div>
      {open && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                <th className="px-3 py-2 font-semibold">Pattern</th>
                <th className="px-3 py-2 font-semibold">SQL Server</th>
                <th className="px-3 py-2 font-semibold">MySQL</th>
              </tr>
            </thead>
            <tbody>
              {SQL_DIALECT_CHEATSHEET.map((row) => (
                <tr key={row.topic} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium">{row.topic}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.mssql}</td>
                  <td className="px-3 py-2 font-mono text-primary">{row.mysql}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

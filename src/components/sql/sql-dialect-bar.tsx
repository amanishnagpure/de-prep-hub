"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  applyRouteDialect,
  getSqlDialect,
  setSqlDialect,
  SQL_DIALECT_CHEATSHEET,
  SQL_DIALECT_LABELS,
  type SqlDialect,
} from "@/lib/sql-dialect";
import { cn } from "cn";

export function useSqlDialect() {
  const [dialect, setDialectState] = React.useState<SqlDialect>("mssql");

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

  return { dialect, setDialect };
}

interface SqlDialectToggleProps {
  dialect: SqlDialect;
  onChange: (dialect: SqlDialect) => void;
  className?: string;
}

export function SqlDialectToggle({ dialect, onChange, className }: SqlDialectToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-border bg-muted/30 p-1",
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
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            dialect === key
              ? key === "mysql"
                ? "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25"
                : "bg-cyan-500/15 text-cyan-500 ring-1 ring-cyan-500/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {SQL_DIALECT_LABELS[key]}
        </button>
      ))}
    </div>
  );
}

export function SqlDialectBar() {
  const pathname = usePathname();
  const { dialect, setDialect } = useSqlDialect();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    applyRouteDialect(pathname);
  }, [pathname]);

  const show =
    pathname.startsWith("/sql/practice") ||
    pathname.startsWith("/sql/leetcode");

  if (!show) return null;

  return (
    <div className="mb-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
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
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                <th className="px-3 py-2 font-semibold">Pattern</th>
                <th className="px-3 py-2 font-semibold">SQL Server</th>
                <th className="px-3 py-2 font-semibold">MySQL</th>
              </tr>
            </thead>
            <tbody>
              {SQL_DIALECT_CHEATSHEET.map((row) => (
                <tr key={row.topic} className="border-b border-border/40 last:border-0">
                  <td className="px-3 py-2 font-medium">{row.topic}</td>
                  <td className="px-3 py-2 font-mono text-cyan-600 dark:text-cyan-400">{row.mssql}</td>
                  <td className="px-3 py-2 font-mono text-orange-500">{row.mysql}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

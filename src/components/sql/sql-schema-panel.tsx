"use client";

import { Table2 } from "lucide-react";
import type { SqlTableSchema } from "@/lib/sql-schemas";
import { cn } from "cn";

interface SqlSchemaPanelProps {
  tables: SqlTableSchema[];
  className?: string;
}

export function SqlSchemaPanel({ tables, className }: SqlSchemaPanelProps) {
  return (
    <aside className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Table2 className="size-3.5 text-cyan-500" />
        Schema
      </div>

      {tables.map((table) => (
        <div
          key={table.label}
          className="overflow-hidden rounded-xl border border-border/70 bg-card/60"
        >
          <div className="border-b border-border/60 bg-muted/30 px-4 py-3">
            <p className="font-mono text-sm font-semibold text-cyan-500">{table.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{table.description}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Column</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((column) => (
                  <tr key={column.name} className="border-b border-border/40 last:border-0">
                    <td className="px-3 py-2 font-mono">{column.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {column.type}
                      {column.key ? (
                        <span className="ml-1 rounded bg-cyan-500/10 px-1 py-0.5 text-[10px] text-cyan-500">
                          {column.key}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </aside>
  );
}

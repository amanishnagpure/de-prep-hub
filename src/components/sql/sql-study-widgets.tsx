"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Download, Upload } from "lucide-react";
import { getStudyChecklist, getTodaysPlan } from "@/lib/sql-study-plan";
import { exportSqlProgress, importSqlProgress } from "@/lib/sql-progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function SqlStudyChecklist() {
  const [items, setItems] = React.useState(getStudyChecklist());

  React.useEffect(() => {
    const refresh = () => setItems(getStudyChecklist());
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    return () => window.removeEventListener("sql-progress-updated", refresh);
  }, []);

  const doneCount = items.filter((item) => item.done).length;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-bold">Checklist</h2>
          <p className="text-xs text-muted-foreground">Small wins stack.</p>
        </div>
        <span className="text-sm text-muted-foreground">{doneCount}/{items.length}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-colors hover:bg-muted/40",
                item.done ? "border-emerald-500/25 bg-emerald-500/5" : "border-border/60"
              )}
            >
              {item.done ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1 font-medium">{item.label}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{item.progress}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SqlTodaysPlan() {
  const [plan, setPlan] = React.useState(getTodaysPlan());

  React.useEffect(() => {
    const refresh = () => setPlan(getTodaysPlan());
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    return () => window.removeEventListener("sql-progress-updated", refresh);
  }, []);

  if (plan.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border/70 bg-card/50 p-6">
      <h2 className="mb-4 font-bold">Today</h2>
      <ul className="space-y-2">
        {plan.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="block rounded-xl border border-border/60 px-4 py-2.5 transition-colors hover:bg-muted/40"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SqlProgressExport() {
  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          const blob = new Blob([exportSqlProgress()], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `sql-progress-${new Date().toISOString().slice(0, 10)}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }}
        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
      >
        <Download className="size-3.5" />
        Export
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1")}
      >
        <Upload className="size-3.5" />
        Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => importSqlProgress(String(reader.result));
          reader.readAsText(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

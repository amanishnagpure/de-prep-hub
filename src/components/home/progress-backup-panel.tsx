"use client";

import * as React from "react";
import { CloudUpload, Download, HardDrive, Upload } from "lucide-react";
import { exportAllProgress, importAllProgress } from "@/lib/progress-backup";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function ProgressBackupPanel({ className }: { className?: string }) {
  const [message, setMessage] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportAllProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `de-prep-hub-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded — keep this file safe.");
    window.setTimeout(() => setMessage(null), 4000);
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importAllProgress(text);
    setMessage(result.message);
    window.setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="icon-tile bg-primary/10 text-primary ring-primary/20">
          <HardDrive className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold tracking-tight">Your progress</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Saves automatically in this browser when you solve problems or mark notes read. Use the
            same site (
            <span className="font-medium text-foreground">de-prep-hub.vercel.app</span>) each time.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
        >
          <Download className="size-3.5" />
          Download backup
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
        >
          <Upload className="size-3.5" />
          Restore backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleImport(file);
            event.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
        <CloudUpload className="mt-0.5 size-3 shrink-0" />
        Tip: download a backup weekly or before clearing browser data. Restore works on any device
        after you open the site there.
      </p>

      {message ? (
        <p
          className={cn(
            "mt-3 rounded-lg border px-3 py-2 text-xs",
            message.includes("restored") || message.includes("downloaded")
              ? "border-primary/25 bg-primary/5 text-primary"
              : "border-destructive/25 bg-destructive/5 text-destructive"
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

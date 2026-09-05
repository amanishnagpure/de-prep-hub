"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-border/70 bg-[oklch(0.12_0.02_250)]">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface SparkEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  readOnly?: boolean;
  language?: "python" | "sql";
}

export function SparkEditor({
  value,
  onChange,
  height = 220,
  readOnly = false,
  language = "python",
}: SparkEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 ring-1 ring-orange-500/10">
      <Monaco
        height={height}
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          tabSize: 4,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

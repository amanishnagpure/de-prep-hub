"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "cn";

interface AirflowCodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function AirflowCodeBlock({
  code,
  language = "python",
  showLineNumbers = true,
}: AirflowCodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-2xl border border-border/80 bg-[oklch(0.12_0.02_250)] shadow-inner">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-6 text-foreground">
          <code>
            {showLineNumbers
              ? lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell select-none pr-4 text-right text-muted-foreground/50">
                      {index + 1}
                    </span>
                    <span className={cn("table-cell whitespace-pre", line === "" && "h-6")}>
                      {line || " "}
                    </span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}

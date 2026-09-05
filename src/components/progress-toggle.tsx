"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { isTopicCompleted, setTopicCompleted } from "@/lib/progress";
import { cn } from "cn";

interface ProgressToggleProps {
  slug: string;
  label?: string;
}

export function ProgressToggle({
  slug,
  label = "Mark topic as complete",
}: ProgressToggleProps) {
  const [completed, setCompleted] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setCompleted(isTopicCompleted(slug));
  }, [slug]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-3 panel px-4 py-3">
        <Circle className="size-5 text-muted-foreground/40" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        const next = !completed;
        setTopicCompleted(slug, next);
        setCompleted(next);
      }}
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
        completed
          ? "border-primary/30 bg-primary/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-card hover:text-foreground"
      )}
    >
      {completed ? (
        <CheckCircle2 className="size-5 shrink-0 text-primary" />
      ) : (
        <Circle className="size-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{completed ? "Completed" : label}</span>
    </button>
  );
}

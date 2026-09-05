"use client";

import * as React from "react";
import Link from "next/link";
import {
  Database,
  Code2,
  Zap,
  Workflow,
  Cloud,
  Layers,
  Network,
  MessageSquare,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { isTopicCompleted } from "@/lib/progress";
import type { TopicMeta } from "@/lib/content";
import { getTopicLabHref, isTopicLabSlug } from "@/lib/topic-labs";
import { cn } from "cn";

const iconMap: Record<string, LucideIcon> = {
  sql: Database,
  python: Code2,
  spark: Zap,
  databricks: Layers,
  airflow: Workflow,
  cloud: Cloud,
  "system-design": Network,
  interview: MessageSquare,
};

const tintMap: Record<string, string> = {
  sql: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300",
  python: "bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-300",
  spark: "bg-orange-500/10 text-orange-800 ring-orange-500/20 dark:text-orange-300",
  databricks: "bg-rose-500/10 text-rose-800 ring-rose-500/20 dark:text-rose-300",
  airflow: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-300",
  cloud: "bg-cyan-500/10 text-cyan-800 ring-cyan-500/20 dark:text-cyan-300",
  "system-design": "bg-violet-500/10 text-violet-800 ring-violet-500/20 dark:text-violet-300",
  interview: "bg-fuchsia-500/10 text-fuchsia-800 ring-fuchsia-500/20 dark:text-fuchsia-300",
};

interface TopicCardProps {
  topic: TopicMeta;
  compact?: boolean;
  featured?: boolean;
}

export function TopicCard({ topic, compact = false, featured = false }: TopicCardProps) {
  const [completed, setCompleted] = React.useState(false);
  const Icon = iconMap[topic.slug] ?? Database;
  const tint = tintMap[topic.slug] ?? "bg-primary/10 text-primary ring-primary/20";

  React.useEffect(() => {
    setCompleted(isTopicCompleted(topic.slug));

    const handleUpdate = () => setCompleted(isTopicCompleted(topic.slug));
    window.addEventListener("progress-updated", handleUpdate);
    return () => window.removeEventListener("progress-updated", handleUpdate);
  }, [topic.slug]);

  const href = getTopicLabHref(topic.slug) ?? `/topics/${topic.slug}`;
  const isLive = isTopicLabSlug(topic.slug);

  return (
    <Link
      href={href}
      className={cn(
        "panel-interactive group block h-full",
        featured ? "p-6" : compact ? "p-4" : "p-5",
        completed && "ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className={cn("icon-tile shrink-0", tint, compact ? "!size-9" : "")}>
          <Icon className={compact ? "size-4" : "size-5"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold tracking-tight transition-colors group-hover:text-primary",
                featured ? "text-lg" : compact ? "text-sm" : "text-base"
              )}
            >
              {topic.title}
            </h3>
            {completed && <CheckCircle2 className="size-4 shrink-0 text-primary" />}
          </div>
          {!compact && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {topic.description}
            </p>
          )}
          {isLive && (
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Live lab
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

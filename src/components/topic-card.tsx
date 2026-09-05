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
  ArrowUpRight,
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

const taglineMap: Record<string, string> = {
  sql: "Query",
  python: "Script",
  spark: "Shuffle",
  databricks: "Delta",
  airflow: "DAGs",
  cloud: "Azure",
  "system-design": "Scale",
  interview: "Explain",
};

const accentMap: Record<string, string> = {
  sql: "from-sky-500/20 to-blue-500/5 text-sky-400 ring-sky-500/20",
  python: "from-amber-500/20 to-yellow-500/5 text-amber-400 ring-amber-500/20",
  spark: "from-orange-500/20 to-red-500/5 text-orange-400 ring-orange-500/20",
  databricks: "from-red-500/20 to-rose-500/5 text-rose-400 ring-rose-500/20",
  airflow: "from-emerald-500/20 to-green-500/5 text-emerald-400 ring-emerald-500/20",
  cloud: "from-cyan-500/20 to-teal-500/5 text-cyan-400 ring-cyan-500/20",
  "system-design": "from-violet-500/20 to-purple-500/5 text-violet-400 ring-violet-500/20",
  interview: "from-fuchsia-500/20 to-pink-500/5 text-fuchsia-400 ring-fuchsia-500/20",
};

const featuredMeta: Record<string, { accent: string; subtitle: string; hover: string }> = {
  sql: {
    accent: "cyan",
    subtitle: "Notes · 150 practice · LeetCode 50 · Mock",
    hover: "group-hover:text-cyan-500",
  },
  python: {
    accent: "amber",
    subtitle: "Notes · 40 practice · Coding 15 · Flashcards 60",
    hover: "group-hover:text-amber-500",
  },
  spark: {
    accent: "orange",
    subtitle: "Notes · 150 coding · 100 flashcards · Mock",
    hover: "group-hover:text-orange-500",
  },
  databricks: {
    accent: "rose",
    subtitle: "Notes · 25 practice · Flashcards 45",
    hover: "group-hover:text-rose-500",
  },
  airflow: {
    accent: "emerald",
    subtitle: "Notes · 25 practice · Flashcards 40",
    hover: "group-hover:text-emerald-500",
  },
  cloud: {
    accent: "cyan",
    subtitle: "Notes · 25 practice · Flashcards 50",
    hover: "group-hover:text-cyan-500",
  },
  "system-design": {
    accent: "violet",
    subtitle: "Notes · 20 scenarios · Flashcards 40",
    hover: "group-hover:text-violet-500",
  },
  interview: {
    accent: "fuchsia",
    subtitle: "Notes · 20 STAR prompts · Flashcards 60",
    hover: "group-hover:text-fuchsia-500",
  },
};

const accentFeaturedStyles: Record<string, string> = {
  cyan: "border-cyan-500/30 bg-gradient-to-br from-cyan-500/8 via-card/80 to-card/60 hover:border-cyan-500/40 hover:shadow-cyan-500/10",
  amber: "border-amber-500/30 bg-gradient-to-br from-amber-500/8 via-card/80 to-card/60 hover:border-amber-500/40 hover:shadow-amber-500/10",
  orange: "border-orange-500/30 bg-gradient-to-br from-orange-500/8 via-card/80 to-card/60 hover:border-orange-500/40 hover:shadow-orange-500/10",
  rose: "border-rose-500/30 bg-gradient-to-br from-rose-500/8 via-card/80 to-card/60 hover:border-rose-500/40 hover:shadow-rose-500/10",
  emerald: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/8 via-card/80 to-card/60 hover:border-emerald-500/40 hover:shadow-emerald-500/10",
  violet: "border-violet-500/30 bg-gradient-to-br from-violet-500/8 via-card/80 to-card/60 hover:border-violet-500/40 hover:shadow-violet-500/10",
  fuchsia: "border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/8 via-card/80 to-card/60 hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/10",
};

const badgeFeaturedStyles: Record<string, string> = {
  cyan: "bg-cyan-500/15 text-cyan-500",
  amber: "bg-amber-500/15 text-amber-500",
  orange: "bg-orange-500/15 text-orange-500",
  rose: "bg-rose-500/15 text-rose-500",
  emerald: "bg-emerald-500/15 text-emerald-500",
  violet: "bg-violet-500/15 text-violet-500",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-500",
};

const arrowFeaturedStyles: Record<string, string> = {
  cyan: "group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:text-cyan-500",
  amber: "group-hover:border-amber-500/30 group-hover:bg-amber-500/10 group-hover:text-amber-500",
  orange: "group-hover:border-orange-500/30 group-hover:bg-orange-500/10 group-hover:text-orange-500",
  rose: "group-hover:border-rose-500/30 group-hover:bg-rose-500/10 group-hover:text-rose-500",
  emerald: "group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-500",
  violet: "group-hover:border-violet-500/30 group-hover:bg-violet-500/10 group-hover:text-violet-500",
  fuchsia: "group-hover:border-fuchsia-500/30 group-hover:bg-fuchsia-500/10 group-hover:text-fuchsia-500",
};

interface TopicCardProps {
  topic: TopicMeta;
  compact?: boolean;
  featured?: boolean;
}

export function TopicCard({ topic, compact = false, featured = false }: TopicCardProps) {
  const [completed, setCompleted] = React.useState(false);
  const Icon = iconMap[topic.slug] ?? Database;
  const accent = accentMap[topic.slug] ?? "from-primary/20 to-primary/5 text-primary ring-primary/20";
  const featuredInfo = featured ? featuredMeta[topic.slug] : null;
  const accentKey = featuredInfo?.accent ?? "cyan";

  React.useEffect(() => {
    setCompleted(isTopicCompleted(topic.slug));

    const handleUpdate = () => setCompleted(isTopicCompleted(topic.slug));
    window.addEventListener("progress-updated", handleUpdate);
    return () => window.removeEventListener("progress-updated", handleUpdate);
  }, [topic.slug]);

  const href = getTopicLabHref(topic.slug) ?? `/topics/${topic.slug}`;
  const isLive = isTopicLabSlug(topic.slug);

  return (
    <Link href={href} className="group block h-full">
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/70 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:shadow-black/20",
          featured
            ? cn("p-6 sm:flex-row sm:items-center sm:gap-6", accentFeaturedStyles[accentKey])
            : "border-border/70 p-4 hover:border-primary/25 hover:shadow-primary/5",
          !featured && !compact && "p-5",
          completed && "border-primary/30 ring-1 ring-primary/10"
        )}
      >
        <div className="card-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {featured ? (
          <>
            <div className="flex flex-1 items-start gap-4">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 size-14",
                  accent
                )}
              >
                <Icon className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                      badgeFeaturedStyles[accentKey]
                    )}
                  >
                    Live
                  </span>
                  {completed && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      Done
                    </span>
                  )}
                </div>
                <h3
                  className={cn(
                    "mt-2 text-xl font-bold tracking-tight transition-colors",
                    featuredInfo?.hover ?? "group-hover:text-primary"
                  )}
                >
                  {topic.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {featuredInfo?.subtitle ?? topic.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex shrink-0 items-center gap-2 sm:mt-0">
              {completed && (
                <CheckCircle2 className="size-5 text-primary" aria-label="Completed" />
              )}
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground transition-all",
                  arrowFeaturedStyles[accentKey]
                )}
              >
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex items-start justify-between gap-3">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1",
                  compact ? "size-10" : "size-12",
                  accent
                )}
              >
                <Icon className={compact ? "size-4" : "size-5"} />
              </div>

              <div className="flex items-center gap-2">
                {completed && (
                  <CheckCircle2 className="size-5 text-primary" aria-label="Completed" />
                )}
                <div className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>

            <div className={cn("relative flex flex-1 flex-col", compact ? "mt-3" : "mt-5")}>
              {!compact && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-muted/80 px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                    {String(topic.order).padStart(2, "0")}
                  </span>
                  {isLive && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Live
                    </span>
                  )}
                  {completed && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      Done
                    </span>
                  )}
                </div>
              )}

              <h3
                className={cn(
                  "font-semibold tracking-tight transition-colors group-hover:text-primary",
                  compact ? "text-base" : "text-lg"
                )}
              >
                {topic.title}
              </h3>
              {taglineMap[topic.slug] && (
                <p className="mt-1 text-sm text-muted-foreground">{taglineMap[topic.slug]}</p>
              )}
            </div>
          </>
        )}
      </article>
    </Link>
  );
}

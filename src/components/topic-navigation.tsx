import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TopicMeta } from "@/lib/content";
import { cn } from "cn";

interface TopicNavigationProps {
  prev: TopicMeta | null;
  next: TopicMeta | null;
}

export function TopicNavigation({ prev, next }: TopicNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-12 grid gap-4 border-t border-border/60 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/topics/${prev.slug}`}
          className="group panel p-5 transition-all hover:border-primary/25 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
        >
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="mt-2 block font-semibold transition-colors group-hover:text-primary">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/topics/${next.slug}`}
          className={cn(
            "group panel p-5 transition-all hover:border-primary/25 hover:bg-card hover:shadow-lg hover:shadow-primary/5",
            !prev && "sm:col-start-2"
          )}
        >
          <span className="flex items-center justify-end gap-2 text-xs font-medium text-muted-foreground">
            Next
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 block text-right font-semibold transition-colors group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

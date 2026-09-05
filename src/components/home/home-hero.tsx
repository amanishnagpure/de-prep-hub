"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Map, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SQL_ROUTES } from "@/lib/sql";
import { getSqlProgress, getSqlStreak } from "@/lib/sql-progress";
import { cn } from "cn";

export function HomeHero() {
  const [streak, setStreak] = React.useState(0);
  const [lastVisited, setLastVisited] = React.useState<{ path: string; label: string } | null>(null);

  React.useEffect(() => {
    const refresh = () => {
      setStreak(getSqlStreak());
      setLastVisited(getSqlProgress().lastVisited ?? null);
    };
    refresh();
    window.addEventListener("sql-progress-updated", refresh);
    window.addEventListener("spark-progress-updated", refresh);
    window.addEventListener("python-progress-updated", refresh);
    return () => {
      window.removeEventListener("sql-progress-updated", refresh);
      window.removeEventListener("spark-progress-updated", refresh);
      window.removeEventListener("python-progress-updated", refresh);
    };
  }, []);

  return (
    <section className="border-b border-border/60 bg-gradient-to-b from-muted/30 to-transparent">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Data Engineering
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              DE Prep Hub
            </h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              Notes, practice, and interview prep — all in one place.
            </p>

            {streak > 0 && (
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium">
                <Flame className="size-3.5 text-amber-500" />
                {streak} day streak
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {lastVisited ? (
              <Link
                href={lastVisited.path}
                className={cn(
                  buttonVariants({ size: "default" }),
                  "gap-2 rounded-xl shadow-md shadow-primary/10"
                )}
              >
                <PlayCircle className="size-4" />
                Continue: {lastVisited.label}
              </Link>
            ) : (
              <Link
                href={SQL_ROUTES.notes}
                className={cn(
                  buttonVariants({ size: "default" }),
                  "gap-2 rounded-xl shadow-md shadow-primary/10"
                )}
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
            )}
            <Link
              href="/roadmap"
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "gap-2 rounded-xl")}
            >
              <Map className="size-4" />
              Roadmap
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

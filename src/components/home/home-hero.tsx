"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Flame, Map, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SQL_ROUTES } from "@/lib/sql";
import { getSqlProgress, getSqlStreak } from "@/lib/sql-progress";
import { cn } from "cn";
import { SiteContainer } from "@/components/site-container";

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
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent"
      />
      <SiteContainer className="relative py-12 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-primary">Data engineering prep</p>
            <h1 className="hero-title mt-2 text-4xl font-semibold sm:text-5xl">DE Prep Hub</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Notes, practice problems, and interview drills — built for the long grind, not a
              weekend cram.
            </p>

            {streak > 0 && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-sm shadow-sm backdrop-blur-sm">
                <Flame className="size-4 text-amber-500" />
                <span className="font-medium">{streak} day streak</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {lastVisited ? (
              <Link
                href={lastVisited.path}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 shadow-md shadow-primary/15"
                )}
              >
                <PlayCircle className="size-4" />
                Continue: {lastVisited.label}
              </Link>
            ) : (
              <Link
                href={SQL_ROUTES.notes}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 shadow-md shadow-primary/15"
                )}
              >
                Start with SQL
                <ArrowRight className="size-4" />
              </Link>
            )}
            <Link
              href="/roadmap"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2 bg-card/60")}
            >
              <Map className="size-4" />
              Roadmap
            </Link>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

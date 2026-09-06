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
    <section className="border-b border-border bg-card/50">
      <SiteContainer className="py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Data engineering prep
            </p>
            <h1 className="hero-title mt-1 text-3xl font-semibold sm:text-4xl">DE Prep Hub</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Notes, practice problems, and interview drills — structured like a coding platform,
              built for data engineers.
            </p>

            {streak > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm">
                <Flame className="size-4 text-primary" />
                <span className="font-medium">{streak} day streak</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {lastVisited ? (
              <Link
                href={lastVisited.path}
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                <PlayCircle className="size-4" />
                Continue: {lastVisited.label}
              </Link>
            ) : (
              <Link href={SQL_ROUTES.notes} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
                Start with SQL
                <ArrowRight className="size-4" />
              </Link>
            )}
            <Link
              href="/roadmap"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
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

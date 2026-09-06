"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { platformIdentity } from "@/design";
import { CHALLENGE_SECTION } from "@/lib/de-code/constants";
import { SiteContainer } from "@/components/site-container";
import { cn } from "cn";

export function PlatformHomeHero() {
  return (
    <section>
      <SiteContainer className="py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground">Data Engineering</p>
          <h1 className="type-display mt-4">
            <span className="district-gradient-text">{platformIdentity.tagline}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Build real skills in SQL, Python, PySpark, and production-grade data engineering.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/learn" className={cn(buttonVariants({ size: "lg" }), "gap-2 px-6")}>
              Start learning
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={CHALLENGE_SECTION.home}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}
            >
              Explore challenges
            </Link>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

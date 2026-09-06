"use client";

import * as React from "react";
import Link from "next/link";
import { categoryColors } from "@/design/colors";
import { PracticeTrackProgress } from "@/components/platform/practice-track-progress";
import { SiteContainer } from "@/components/site-container";
import { CODE_SECTION } from "@/lib/de-code/constants";
import { getContinueActivity } from "@/lib/de-code/activity";

export function PlatformHomeDashboard() {
  const [mounted, setMounted] = React.useState(false);
  const [continueItem, setContinueItem] = React.useState<ReturnType<typeof getContinueActivity>>(null);

  React.useEffect(() => {
    setMounted(true);
    const refresh = () => setContinueItem(getContinueActivity());
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, []);

  return (
    <SiteContainer className="pb-24 pt-4">
      <div className="grid gap-16 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div className="space-y-16">
          {mounted && continueItem && (
            <section>
              <p className="text-sm text-muted-foreground">Continue</p>
              <Link href={continueItem.href} className="platform-continue-card group mt-4 block">
                <p className="text-sm text-muted-foreground">{continueItem.subtitle}</p>
                <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                  {continueItem.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{continueItem.detail}</p>
              </Link>
            </section>
          )}

          <section className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link
              href={CODE_SECTION.home}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              style={{ color: categoryColors.sql.hue }}
            >
              Practice
            </Link>
            <Link
              href="/learn"
              className="text-muted-foreground underline-offset-4 hover:underline"
              style={{ ["--hover" as string]: categoryColors.learn.hue }}
            >
              Learn
            </Link>
            <Link href="/progress" className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Progress
            </Link>
          </section>
        </div>

        <aside className="district-glass p-6">
          <p className="text-sm text-muted-foreground">Your progress</p>
          <div className="mt-6">
            <PracticeTrackProgress />
          </div>
        </aside>
      </div>
    </SiteContainer>
  );
}

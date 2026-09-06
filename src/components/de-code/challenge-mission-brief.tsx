import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DEChallengeProblem } from "@/lib/de-code/challenge-types";
import {
  getChallengeGroupLabel,
  getChallengeTopicLabel,
} from "@/lib/de-code/challenge-taxonomy";
import { challengePath } from "@/lib/de-code/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function ChallengeMissionBrief({
  challenge,
  compact = false,
  showCta = false,
  className,
}: {
  challenge: DEChallengeProblem;
  compact?: boolean;
  showCta?: boolean;
  className?: string;
}) {
  const groupLabel = getChallengeGroupLabel(challenge.taxonomyGroup);
  const topicLabel = getChallengeTopicLabel(challenge.taxonomyTopic);
  const languages = challenge.executionLanguages.join(" · ");

  return (
    <article className={cn("panel p-6 sm:p-8", className)}>
      <p className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
        {groupLabel}
      </p>
      <h2 className={cn("mt-3 font-semibold tracking-tight text-foreground", compact ? "type-section" : "type-page-title")}>
        {challenge.title}
      </h2>
      <p className="type-meta mt-2 text-muted-foreground">
        {topicLabel} · {languages}
      </p>

      <div className="platform-divider mt-6" />

      <section className="mt-6">
        <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
          Mission
        </h3>
        <p className="type-body mt-3 text-foreground">{challenge.objective}</p>
      </section>

      {!compact && (
        <>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section>
              <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                Inputs
              </h3>
              <ul className="mt-3 space-y-2">
                {challenge.inputTables.map((table) => (
                  <li key={table.label} className="type-code text-foreground">
                    {table.label}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
                Output
              </h3>
              <p className="type-code mt-3 text-foreground">{challenge.outputTable}</p>
            </section>
          </div>

          <section className="mt-8">
            <h3 className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
              Requirements
            </h3>
            <ol className="mt-4 space-y-3">
              {challenge.requirements.slice(0, 4).map((req, index) => (
                <li key={req} className="flex gap-3 type-body text-muted-foreground">
                  <span className="type-meta shrink-0 tabular-nums text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
              {challenge.requirements.length > 4 && (
                <li className="type-meta text-muted-foreground">
                  + {challenge.requirements.length - 4} more in workspace
                </li>
              )}
            </ol>
          </section>
        </>
      )}

      {showCta && (
        <Link
          href={challengePath(challenge.slug)}
          className={cn(buttonVariants(), "mt-8 gap-2")}
        >
          Start challenge
          <ArrowRight className="size-4" />
        </Link>
      )}
    </article>
  );
}

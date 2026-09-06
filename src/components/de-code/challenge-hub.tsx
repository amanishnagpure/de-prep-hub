"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { challengeCardTints } from "@/design/colors";
import type { ChallengeTaxonomyGroup } from "@/lib/de-code/challenge-taxonomy";
import { SiteContainer } from "@/components/site-container";
import { getAllChallenges } from "@/lib/de-code/challenge-bank";
import type { DEChallengeProblem } from "@/lib/de-code/challenge-types";
import {
  CHALLENGE_TAXONOMY_GROUPS,
  getChallengeGroupLabel,
  getChallengeTopicLabel,
} from "@/lib/de-code/challenge-taxonomy";
import { challengePath, EXPERIENCE_LEVELS } from "@/lib/de-code/constants";
import { isProblemSolved } from "@/lib/de-code/progress";
import { cn } from "cn";
import * as React from "react";

function ChallengeCard({
  challenge,
  done,
}: {
  challenge: DEChallengeProblem;
  done: boolean;
}) {
  const exp = EXPERIENCE_LEVELS.find((e) => e.id === challenge.experienceLevel);
  const groupLabel = getChallengeGroupLabel(challenge.taxonomyGroup);
  const topicLabel = getChallengeTopicLabel(challenge.taxonomyTopic);
  const languages = challenge.executionLanguages.join(" · ");
  const tint = challengeCardTints[challenge.taxonomyGroup as ChallengeTaxonomyGroup];

  return (
    <Link
      href={challengePath(challenge.slug)}
      className={cn(
        "hub-card panel-interactive group flex h-full flex-col overflow-hidden p-0",
        done && "ring-1 ring-[var(--platform-success)]/20"
      )}
      style={{ ["--hub-bar" as string]: tint.bar, ["--card-accent" as string]: tint.accent }}
    >
      <span className="hub-card-accent-bar" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: tint.soft, color: tint.accent }}
          >
            <Layers className="size-5 opacity-75" />
          </div>
          <div className="flex items-center gap-2">
            {done ? <CheckCircle2 className="size-4 text-[var(--platform-success)]/80" /> : null}
            <ArrowUpRight className="size-4 text-muted-foreground/70 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground/90">
          {groupLabel}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {challenge.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {challenge.objective}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {exp ? (
            <span className="rounded-md border border-border/80 bg-muted/20 px-2 py-1 text-muted-foreground">
              {exp.label}
            </span>
          ) : null}
          <span className="rounded-md border border-border/80 bg-muted/20 px-2 py-1 text-muted-foreground">
            {topicLabel}
          </span>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {languages}
          {done ? " · Completed" : ""}
        </p>
      </div>
    </Link>
  );
}

export function ChallengeHub() {
  const challenges = getAllChallenges();
  const [solved, setSolved] = React.useState<string[]>([]);
  const [groupFilter, setGroupFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const refresh = () => {
      setSolved(challenges.filter((c) => isProblemSolved(c.id)).map((c) => c.id));
    };
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, [challenges]);

  const filtered =
    groupFilter === "all"
      ? challenges
      : challenges.filter((c) => c.taxonomyGroup === groupFilter);

  return (
    <SiteContainer className="hub-page py-16 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="type-page-title text-foreground">Challenges</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Production-style data engineering scenarios — pick a challenge and build a real pipeline
          solution.
        </p>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGroupFilter("all")}
          className={cn("hub-filter-pill", groupFilter === "all" && "hub-filter-pill-active")}
        >
          All
        </button>
        {CHALLENGE_TAXONOMY_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setGroupFilter(group.id)}
            className={cn(
              "hub-filter-pill",
              groupFilter === group.id && "hub-filter-pill-active"
            )}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            done={solved.includes(challenge.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-sm text-muted-foreground">No challenges in this category yet.</p>
      )}
    </SiteContainer>
  );
}

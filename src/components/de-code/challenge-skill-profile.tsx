"use client";

import * as React from "react";
import {
  getChallengeCompletionSummary,
  getChallengeSkillProfile,
  getWeakestSkills,
} from "@/lib/de-code/challenge-skills";
import { cn } from "cn";

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          percent === 100 ? "bg-lc-easy" : "bg-primary"
        )}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function ChallengeSkillProfile() {
  const [profile, setProfile] = React.useState(() => getChallengeSkillProfile());
  const [weakest, setWeakest] = React.useState(() => getWeakestSkills());
  const [summary, setSummary] = React.useState(() => getChallengeCompletionSummary());

  React.useEffect(() => {
    const refresh = () => {
      setProfile(getChallengeSkillProfile());
      setWeakest(getWeakestSkills());
      setSummary(getChallengeCompletionSummary());
    };
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, []);

  if (profile.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">DE Skill Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Challenge completion by competency area · {summary.solved}/{summary.total} solved
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {profile.map((skill) => (
          <div key={skill.group} className="rounded-md border border-border/70 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{skill.label}</span>
              <span className="text-muted-foreground">
                {skill.solved}/{skill.total} · {skill.percent}%
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar percent={skill.percent} />
            </div>
          </div>
        ))}
      </div>

      {weakest.length > 0 && summary.solved < summary.total && (
        <div className="mt-4 rounded-md border border-dashed border-border bg-muted/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Weakest skills
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {weakest.map((skill) => (
              <li key={skill.group}>
                {skill.label} · {skill.percent}% complete
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

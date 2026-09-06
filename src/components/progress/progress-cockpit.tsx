"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { SiteContainer } from "@/components/site-container";
import { buttonVariants } from "@/components/ui/button";
import { categoryColors } from "@/design/colors";
import { ProgressSkillMap } from "@/components/progress/progress-skill-map";
import {
  depthDots,
  getProgressCockpitSnapshot,
  type ProgressCockpitSnapshot,
  type SkillMapNodeId,
} from "@/lib/de-code/progress-cockpit";
import { cn } from "cn";
import "./progress-cockpit.css";

const LABEL_CATEGORY: Record<string, keyof typeof categoryColors> = {
  SQL: "sql",
  Analytics: "sql",
  Joins: "sql",
  ETL: "python",
  PySpark: "pyspark",
  CDC: "learn",
  Warehousing: "dsa",
  "Data Quality": "challenges",
};

function categoryHue(label: string): string {
  const key = LABEL_CATEGORY[label];
  return key ? categoryColors[key].hue : "var(--foreground)";
}

function PlatformGradients() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
      <defs>
        <linearGradient id="progress-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="progress-spark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="8" className="pc-ring-track" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="pc-ring-fill"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums text-foreground">{percent}%</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Overall</span>
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const max = Math.max(1, ...points);
  const w = 120;
  const h = 36;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-28">
      <polyline points={coords.join(" ")} className="pc-sparkline" />
    </svg>
  );
}

function ProfileHero({
  profile,
  monthly,
}: {
  profile: ProgressCockpitSnapshot["profile"];
  monthly: ProgressCockpitSnapshot["monthlyActivity"];
}) {
  return (
    <section className="pc-card p-6 sm:p-8">
      <p className="pc-label">Your engineering profile</p>
      <p className="mt-3 text-lg font-medium text-foreground">{profile.goalLabel}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(12rem,16rem)] lg:items-start xl:grid-cols-[1fr_minmax(14rem,18rem)]">
        <div className="grid gap-8 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_1fr] lg:items-center">
          <ProgressRing percent={profile.overallPercent} />

          <div>
            <p className="text-sm font-medium text-foreground">Overall progress</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {profile.skillsExplored} skills explored
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.challengesCompleted} challenges completed
            </p>
            <p className="text-sm text-muted-foreground">
              {profile.practiceCompleted} practice problems solved
            </p>
          </div>

          <div className="grid gap-6 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Strongest
              </p>
              <ul className="mt-2 space-y-1">
                {profile.strongest.length ? (
                  profile.strongest.map((s) => (
                    <li
                      key={s.label}
                      className="pc-strength-item text-sm font-medium"
                      style={{ color: categoryHue(s.label) }}
                    >
                      {s.label}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--platform-ink-muted)]">
                    Start practicing to discover strengths
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Needs focus
              </p>
              <ul className="mt-2 space-y-1">
                {profile.focusAreas.length ? (
                  profile.focusAreas.map((s) => (
                    <li
                      key={s.label}
                      className="pc-focus-item text-sm font-medium"
                      style={{ color: categoryHue(s.label) }}
                    >
                      {s.label}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-[var(--platform-ink-muted)]">
                    Complete more to identify gaps
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:border-l lg:border-border lg:pl-8">
          <MonthlyActivityChart monthly={monthly} compact />
        </div>
      </div>
    </section>
  );
}

function NextMoveSection({ nextMove }: { nextMove: ProgressCockpitSnapshot["nextMove"] }) {
  if (!nextMove) {
    return (
      <section className="pc-card p-6">
        <p className="pc-label">Your next move</p>
        <p className="mt-3 text-sm text-muted-foreground">
          You&apos;re caught up — explore a new challenge or track.
        </p>
      </section>
    );
  }

  return (
    <section className="pc-card pc-next-move p-6 sm:p-8">
      <p className="pc-label">Your next move</p>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h3 className="text-lg font-medium text-foreground">{nextMove.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{nextMove.subtitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{nextMove.detail}</p>
          <p className="mt-3 text-xs text-[var(--platform-ink-muted)]">
            {nextMove.conceptsRemaining} concept{nextMove.conceptsRemaining === 1 ? "" : "s"}{" "}
            remaining
          </p>
        </div>
        <Link
          href={nextMove.href}
          className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2 px-6")}
        >
          Continue
          <ArrowRight className="size-4" />
        </Link>
      </div>
      {nextMove.reasons.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recommended because
          </p>
          <ul className="mt-2 space-y-1">
            {nextMove.reasons.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-3.5 text-[var(--platform-brand-violet)]" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function WeeklyMomentum({ activity }: { activity: ProgressCockpitSnapshot["weeklyActivity"] }) {
  return (
    <section>
      <p className="pc-label">This week</p>
      <div className="pc-card mt-4 p-6">
        <div className="flex items-center justify-center gap-3">
          {activity.days.map((day, i) => (
            <div key={`${day.label}-${i}`} className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  day.active
                    ? "bg-[image:var(--gradient-brand)] shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                    : "bg-[var(--platform-border)]"
                )}
              />
              <span className="text-[10px] text-[var(--platform-ink-muted)]">{day.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">This week</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {activity.problemsThisWeek} problems
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.challengesThisWeek} challenges
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Practice time</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              ~{activity.practiceHoursEstimate} hrs
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Momentum</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {activity.weekOverWeekPercent === null
                ? "—"
                : `${activity.weekOverWeekPercent >= 0 ? "↑" : "↓"} ${Math.abs(activity.weekOverWeekPercent)}% vs last week`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const CAL_HEADERS = ["S", "M", "T", "W", "T", "F", "S"] as const;

function MonthlyActivityChart({
  monthly,
  compact = false,
}: {
  monthly: ProgressCockpitSnapshot["monthlyActivity"];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "pc-monthly-sidebar" : undefined}>
      <p className="pc-label">Monthly active</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {monthly.monthLabel} · {monthly.activeDays} day{monthly.activeDays === 1 ? "" : "s"}
      </p>

      <div className="mt-3">
        <div className="grid grid-cols-7 gap-1">
          {CAL_HEADERS.map((h, i) => (
            <span
              key={`${h}-${i}`}
              className="text-center text-[9px] font-medium text-[var(--platform-ink-muted)]"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="mt-1 space-y-1">
          {monthly.weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((cell, ci) => {
                if (!cell.inMonth) {
                  return <span key={ci} className="pc-cal pc-cal-out" aria-hidden />;
                }

                const dateLabel = new Date(`${cell.date}T12:00:00`).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                const title =
                  cell.count > 0
                    ? `${dateLabel}: ${cell.count} submission${cell.count === 1 ? "" : "s"}`
                    : `${dateLabel}: no activity`;

                return (
                  <span
                    key={ci}
                    title={title}
                    className={cn(
                      "pc-cal",
                      compact && "pc-cal-compact",
                      `pc-cal-${cell.level}`,
                      cell.isToday && "pc-cal-today ring-1 ring-[var(--platform-brand-pink)]"
                    )}
                    aria-label={title}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {!compact && monthly.activeDates.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active dates
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {monthly.activeDates.slice(0, 8).map((d) => (
              <li key={d.date} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{d.label}</span>
                <span className="text-[var(--platform-ink-muted)]"> · {d.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && monthly.activeDates.length === 0 && (
        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          No submissions this month yet.
        </p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-[9px] text-[var(--platform-ink-muted)]">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={cn(
              "pc-cal pc-cal-compact !max-w-2.5",
              `pc-cal-${level as 0 | 1 | 2 | 3 | 4}`
            )}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function SkillMomentumSection({ rows }: { rows: ProgressCockpitSnapshot["skillMomentum"] }) {
  const trackColor: Record<string, string> = {
    SQL: categoryColors.sql.hue,
    PySpark: categoryColors.pyspark.hue,
    "Data Quality": categoryColors.challenges.hue,
  };

  return (
    <section>
      <p className="pc-label">Skill momentum</p>
      <div className="pc-card mt-4 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 p-4 sm:px-6">
            <div>
              <p className="text-sm font-medium" style={{ color: trackColor[row.label] ?? undefined }}>
                {row.label}
              </p>
              <p className="text-xs capitalize text-[var(--platform-ink-muted)]">{row.trend}</p>
            </div>
            <Sparkline points={row.sparkline} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ChallengePerformanceSection({
  perf,
}: {
  perf: ProgressCockpitSnapshot["challengePerformance"];
}) {
  return (
    <section style={{ ["--depth-accent" as string]: categoryColors.challenges.hue }}>
      <p className="pc-label">Real-world challenges</p>
      <div className="pc-card mt-4 p-6">
        <p className="text-sm text-muted-foreground">{perf.attempted} challenges attempted</p>

        <div className="mt-6 space-y-3">
          {perf.byGroup.map((g) => (
            <div key={g.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground">{g.label}</span>
              <div className="flex gap-1">
                {depthDots(g.depth).map((filled, i) => (
                  <span
                    key={i}
                    className={cn("pc-depth-dot", filled && "pc-depth-dot-filled")}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pc-divider mt-6 grid gap-3 pt-6 sm:grid-cols-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{perf.accepted}</span> accepted ·{" "}
            <span className="font-medium text-foreground">{perf.needsImprovement}</span> needs
            improvement
          </p>
          <p className="text-sm text-muted-foreground">
            Avg attempts {perf.averageAttempts} · First-pass {perf.firstPassRate}%
          </p>
        </div>
      </div>
    </section>
  );
}

function EngineeringDnaSection({ dna }: { dna: ProgressCockpitSnapshot["engineeringDna"] }) {
  return (
    <section>
      <p className="pc-label">Your engineering DNA</p>
      <div className="pc-card mt-4 p-6 sm:p-8">
        <p className="text-xs text-muted-foreground">You tend toward</p>
        <p className="district-gradient-text mt-3 inline-block rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium">
          {dna.archetype}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Strong in
            </p>
            <ul className="mt-2 space-y-1">
              {dna.strongIn.map((s) => (
                <li key={s} className="text-sm text-foreground">
                  · {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Developing
            </p>
            <ul className="mt-2 space-y-1">
              {dna.developing.map((s) => (
                <li key={s} className="text-sm text-foreground">
                  · {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Practice style: <span className="text-foreground">{dna.practiceStyle}</span>
        </p>
      </div>
    </section>
  );
}

function RecentActivitySection({
  items,
}: {
  items: ProgressCockpitSnapshot["recentActivity"];
}) {
  let lastDay = "";

  return (
    <section>
      <p className="pc-label">Recent</p>
      <div className="pc-card mt-4 divide-y divide-border">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No submissions yet — start practicing.</p>
        ) : (
          items.map((item) => {
            const day = new Date(item.when).toDateString();
            const showDay = day !== lastDay;
            lastDay = day;
            const dayLabel =
              showDay &&
              (() => {
                const diff = Date.now() - new Date(item.when).setHours(0, 0, 0, 0);
                if (diff < 86400000) return "Today";
                if (diff < 172800000) return "Yesterday";
                return new Date(item.when).toLocaleDateString(undefined, {
                  weekday: "long",
                });
              })();

            return (
              <div key={item.id}>
                {showDay && dayLabel ? (
                  <p className="px-6 pt-4 text-xs font-medium uppercase tracking-wide text-[var(--platform-ink-muted)]">
                    {dayLabel}
                  </p>
                ) : null}
                <Link
                  href={item.href}
                  className="flex items-start gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  {item.status === "accepted" ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--platform-success)]" />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0 text-[var(--platform-ink-muted)]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--platform-ink-muted)]">
                    {item.whenLabel}
                  </span>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function MilestonesSection({ milestones }: { milestones: ProgressCockpitSnapshot["milestones"] }) {
  return (
    <section>
      <p className="pc-label">Milestones</p>
      <div className="pc-card mt-4 p-6">
        <ul className="space-y-3">
          {milestones.map((m) => (
            <li
              key={m.id}
              className={cn(
                "flex items-start gap-3 pc-milestone",
                m.achieved && "pc-milestone-done"
              )}
            >
              <span className="pc-milestone-index">{String(m.index).padStart(2, "0")}</span>
              <span className={cn(!m.achieved && "opacity-60")}>{m.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProgressCockpit() {
  const [snapshot, setSnapshot] = React.useState<ProgressCockpitSnapshot | null>(null);
  const [selectedSkill, setSelectedSkill] = React.useState<SkillMapNodeId>("pyspark");

  React.useEffect(() => {
    const refresh = () => setSnapshot(getProgressCockpitSnapshot());
    refresh();
    window.addEventListener("de-code-updated", refresh);
    return () => window.removeEventListener("de-code-updated", refresh);
  }, []);

  if (!snapshot) {
    return (
      <div className="progress-cockpit">
        <PlatformGradients />
        <SiteContainer className="py-16">
          <div className="district-glass h-64 animate-pulse" />
        </SiteContainer>
      </div>
    );
  }

  return (
    <div className="progress-cockpit">
      <PlatformGradients />
      <SiteContainer className="py-12 sm:py-16">
        <header className="max-w-2xl">
          <p className="pc-label">Progress</p>
          <h1 className="type-page-title mt-3">
            <span className="district-gradient-text">Your Data Engineering journey</span>
          </h1>
          <p className="pc-subheading mt-4">
            Where you are, what you&apos;re good at, what needs focus, and what to do next — from
            your local practice history.
          </p>
        </header>

        <div className="mt-10 space-y-12">
          <ProfileHero profile={snapshot.profile} monthly={snapshot.monthlyActivity} />

          <ProgressSkillMap
            nodes={snapshot.skillMap}
            selectedId={selectedSkill}
            onSelect={setSelectedSkill}
          />

          <NextMoveSection nextMove={snapshot.nextMove} />

          <div className="grid gap-12 lg:grid-cols-2">
            <WeeklyMomentum activity={snapshot.weeklyActivity} />
            <SkillMomentumSection rows={snapshot.skillMomentum} />
          </div>

          <ChallengePerformanceSection perf={snapshot.challengePerformance} />

          <div className="grid gap-12 lg:grid-cols-2">
            <EngineeringDnaSection dna={snapshot.engineeringDna} />
            <RecentActivitySection items={snapshot.recentActivity} />
          </div>

          <MilestonesSection milestones={snapshot.milestones} />
        </div>
      </SiteContainer>
    </div>
  );
}

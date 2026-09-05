"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Sparkles, Trash2 } from "lucide-react";
import { STUDY_GOALS_BY_LAB } from "@/lib/study-schedule-catalog";
import {
  clearStudyScheduleConfig,
  generateSchedule,
  getDefaultScheduleDates,
  getStudyScheduleConfig,
  saveStudyScheduleConfig,
  summarizeSchedule,
  type ScheduleDay,
  type StudyDayMode,
  type StudyScheduleConfig,
} from "@/lib/study-schedule";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const PROGRESS_EVENTS = [
  "sql-progress-updated",
  "python-progress-updated",
  "spark-progress-updated",
  "databricks-progress-updated",
  "airflow-progress-updated",
  "cloud-progress-updated",
  "system-design-progress-updated",
  "interview-prep-progress-updated",
];

export function StudySchedulePlanner() {
  const defaults = getDefaultScheduleDates();
  const [goalIds, setGoalIds] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState(defaults.startDate);
  const [endDate, setEndDate] = React.useState(defaults.endDate);
  const [studyDays, setStudyDays] = React.useState<StudyDayMode>("weekdays");
  const [schedule, setSchedule] = React.useState<ScheduleDay[]>([]);
  const [hasPlan, setHasPlan] = React.useState(false);

  const loadConfig = React.useCallback(() => {
    const saved = getStudyScheduleConfig();
    if (!saved) {
      setHasPlan(false);
      setSchedule([]);
      return;
    }

    setGoalIds(saved.goalIds);
    setStartDate(saved.startDate);
    setEndDate(saved.endDate);
    setStudyDays(saved.studyDays);
    setSchedule(generateSchedule(saved));
    setHasPlan(true);
  }, []);

  React.useEffect(() => {
    loadConfig();
    const refresh = () => loadConfig();
    PROGRESS_EVENTS.forEach((event) => window.addEventListener(event, refresh));
    window.addEventListener("study-schedule-updated", refresh);
    return () => {
      PROGRESS_EVENTS.forEach((event) => window.removeEventListener(event, refresh));
      window.removeEventListener("study-schedule-updated", refresh);
    };
  }, [loadConfig]);

  const toggleGoal = (id: string) => {
    setGoalIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleLab = (labKey: string, select: boolean) => {
    const ids = STUDY_GOALS_BY_LAB[labKey]?.goals.map((goal) => goal.id) ?? [];
    setGoalIds((current) => {
      if (select) {
        return Array.from(new Set([...current, ...ids]));
      }
      return current.filter((id) => !ids.includes(id));
    });
  };

  const buildConfig = (): StudyScheduleConfig => ({
    goalIds,
    startDate,
    endDate,
    studyDays,
    updatedAt: new Date().toISOString(),
  });

  const handleGenerate = () => {
    if (goalIds.length === 0 || !startDate || !endDate) return;
    const config = buildConfig();
    saveStudyScheduleConfig(config);
    setSchedule(generateSchedule(config));
    setHasPlan(true);
  };

  const handleClear = () => {
    clearStudyScheduleConfig();
    setSchedule([]);
    setHasPlan(false);
  };

  const preview = summarizeSchedule(buildConfig());
  const todayTasks = schedule.find((day) => day.isToday)?.tasks ?? [];

  return (
    <div className="space-y-8">
      <section className="panel p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="icon-tile bg-primary/10 text-primary ring-primary/20">
            <CalendarDays className="size-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Build your schedule</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick topics, set a date range, and get a day-by-day plan based on what you have left
              to finish.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </label>
          <label className="space-y-1.5 text-sm sm:col-span-2">
            <span className="font-medium">Study days</span>
            <select
              value={studyDays}
              onChange={(event) => setStudyDays(event.target.value as StudyDayMode)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            >
              <option value="weekdays">Weekdays only (Mon–Fri)</option>
              <option value="all">Every day</option>
            </select>
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {Object.entries(STUDY_GOALS_BY_LAB).map(([labKey, group]) => {
            const labGoalIds = group.goals.map((goal) => goal.id);
            const allSelected = labGoalIds.every((id) => goalIds.includes(id));
            const someSelected = labGoalIds.some((id) => goalIds.includes(id));

            return (
              <div key={labKey} className="rounded-xl border border-border/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{group.labLabel}</p>
                  <button
                    type="button"
                    onClick={() => toggleLab(labKey, !allSelected)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {allSelected ? "Clear lab" : someSelected ? "Select all in lab" : "Select all"}
                  </button>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {group.goals.map((goal) => {
                    const completed = goal.getCompleted();
                    const remaining = Math.max(0, goal.totalUnits - completed);
                    const checked = goalIds.includes(goal.id);

                    return (
                      <label
                        key={goal.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                          checked
                            ? "border-primary/30 bg-primary/5"
                            : "border-border/60 hover:bg-muted/40"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleGoal(goal.id)}
                          className="mt-1"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{goal.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {remaining > 0
                              ? `${remaining} ${goal.unitLabel} left`
                              : "Complete ✓"}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={goalIds.length === 0}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Sparkles className="size-3.5" />
            Generate schedule
          </button>
          {hasPlan ? (
            <button
              type="button"
              onClick={handleClear}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
            >
              <Trash2 className="size-3.5" />
              Clear plan
            </button>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {preview.studyDays} study days · {preview.totalTasks} tasks across {preview.goalsWithWork}{" "}
            topics
          </p>
        </div>
      </section>

      {todayTasks.length > 0 ? (
        <section className="panel border-primary/25 bg-primary/[0.03] p-5 sm:p-6">
          <h2 className="font-semibold tracking-tight">Today&apos;s focus</h2>
          <ul className="mt-4 space-y-2">
            {todayTasks.map((task, index) => (
              <li key={`${task.goalId}-${index}`}>
                <Link
                  href={task.href}
                  className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-background/80 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="font-medium">{task.label}</span>
                  <span className="text-xs text-muted-foreground">{task.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasPlan && schedule.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Your calendar</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {schedule.map((day) => (
              <article
                key={day.date}
                className={cn(
                  "panel p-4",
                  day.isToday && "ring-2 ring-primary/30",
                  day.isPast && day.tasks.length > 0 && "opacity-80"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {day.weekday}, {day.dateLabel}
                    </p>
                    {day.isToday ? (
                      <p className="text-xs font-medium text-primary">Today</p>
                    ) : null}
                  </div>
                  {day.tasks.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Rest / buffer</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{day.tasks.length} tasks</span>
                  )}
                </div>

                {day.tasks.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {day.tasks.map((task, index) => (
                      <li key={`${day.date}-${task.goalId}-${index}`}>
                        <Link
                          href={task.href}
                          className="flex items-start gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                        >
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                          <span>
                            <span className="font-medium">{task.label}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {task.detail}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

import { getStudyGoalById, type StudyGoalTemplate } from "@/lib/study-schedule-catalog";

export const SCHEDULE_STORAGE_KEY = "de-prep-hub-study-schedule";

export type StudyDayMode = "all" | "weekdays";

export interface StudyScheduleConfig {
  goalIds: string[];
  startDate: string;
  endDate: string;
  studyDays: StudyDayMode;
  updatedAt: string;
}

export interface ScheduleTask {
  goalId: string;
  label: string;
  href: string;
  detail: string;
}

export interface ScheduleDay {
  date: string;
  dateLabel: string;
  weekday: string;
  tasks: ScheduleTask[];
  isToday: boolean;
  isPast: boolean;
}

export function getStudyScheduleConfig(): StudyScheduleConfig | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudyScheduleConfig;
    if (!parsed.goalIds?.length || !parsed.startDate || !parsed.endDate) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStudyScheduleConfig(config: Omit<StudyScheduleConfig, "updatedAt">): void {
  const payload: StudyScheduleConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("study-schedule-updated"));
}

export function clearStudyScheduleConfig(): void {
  localStorage.removeItem(SCHEDULE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("study-schedule-updated"));
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function getEligibleDates(config: StudyScheduleConfig): string[] {
  const start = parseDateKey(config.startDate);
  const end = parseDateKey(config.endDate);
  if (end < start) return [];

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    if (config.studyDays === "all" || isWeekday(cursor)) {
      dates.push(toDateKey(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function buildTasksForGoal(goal: StudyGoalTemplate): ScheduleTask[] {
  const completed = goal.getCompleted();
  const remaining = Math.max(0, goal.totalUnits - completed);
  if (remaining === 0) return [];

  const tasks: ScheduleTask[] = [];
  for (let unit = completed; unit < goal.totalUnits; unit += goal.chunkSize) {
    const end = Math.min(unit + goal.chunkSize, goal.totalUnits);
    const startUnit = unit + 1;
    tasks.push({
      goalId: goal.id,
      label: goal.title,
      href: goal.practiceHref ? goal.practiceHref(startUnit) : goal.href,
      detail: `${goal.unitLabel} ${startUnit}–${end}`,
    });
  }
  return tasks;
}

export function generateSchedule(config: StudyScheduleConfig): ScheduleDay[] {
  const dates = getEligibleDates(config);
  if (dates.length === 0) return [];

  const allTasks: ScheduleTask[] = [];
  for (const goalId of config.goalIds) {
    const goal = getStudyGoalById(goalId);
    if (!goal) continue;
    allTasks.push(...buildTasksForGoal(goal));
  }

  const todayKey = toDateKey(new Date());
  const days: ScheduleDay[] = dates.map((date) => {
    const parsed = parseDateKey(date);
    return {
      date,
      dateLabel: parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      weekday: parsed.toLocaleDateString(undefined, { weekday: "short" }),
      tasks: [],
      isToday: date === todayKey,
      isPast: date < todayKey,
    };
  });

  if (allTasks.length === 0) {
    return days;
  }

  allTasks.forEach((task, index) => {
    days[index % days.length].tasks.push(task);
  });

  return days;
}

export function getDefaultScheduleDates(): { startDate: string; endDate: string } {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 27);
  return { startDate: toDateKey(start), endDate: toDateKey(end) };
}

export function summarizeSchedule(config: StudyScheduleConfig): {
  studyDays: number;
  totalTasks: number;
  goalsWithWork: number;
} {
  const days = getEligibleDates(config);
  const tasks = config.goalIds.flatMap((id) => {
    const goal = getStudyGoalById(id);
    return goal ? buildTasksForGoal(goal) : [];
  });

  return {
    studyDays: days.length,
    totalTasks: tasks.length,
    goalsWithWork: new Set(tasks.map((task) => task.goalId)).size,
  };
}

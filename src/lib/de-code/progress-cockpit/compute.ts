import { getAllChallenges, getChallengeBySlug } from "@/lib/de-code/challenge-bank";
import { CHALLENGE_TAXONOMY_GROUPS } from "@/lib/de-code/challenge-taxonomy";
import { codeTrackPath, challengePath, CODE_TRACKS } from "@/lib/de-code/constants";
import {
  getActiveTopics,
  getCodeProblemById,
  getCodeProblems,
  getTopicLabel,
} from "@/lib/de-code/problem-bank";
import {
  getAllSubmissions,
  getSolvedProblemIds,
} from "@/lib/de-code/progress";
import type { CodeDifficulty, CodeSubmission, CodeTrackId } from "@/lib/de-code/types";
import {
  SKILL_MAP_NODES,
  type SkillMapNode,
  type SkillMapNodeId,
} from "@/lib/de-code/progress-cockpit/skill-taxonomy";

export type DepthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type SkillDepthRow = {
  label: string;
  depth: DepthLevel;
  percent: number;
  track: CodeTrackId;
  topicId: string;
};

export type SkillMapNodeState = {
  id: SkillMapNodeId;
  label: string;
  x: number;
  y: number;
  percent: number;
  level: "unexplored" | "developing" | "strong";
  detailTopics?: SkillDepthRow[];
};

export type EngineeringProfile = {
  overallPercent: number;
  skillsExplored: number;
  challengesCompleted: number;
  practiceCompleted: number;
  strongest: { label: string; percent: number }[];
  focusAreas: { label: string; percent: number }[];
  goalLabel: string;
};

export type NextMove = {
  title: string;
  subtitle: string;
  detail: string;
  href: string;
  conceptsRemaining: number;
  reasons: string[];
};

export type WeeklyActivity = {
  days: { label: string; active: boolean }[];
  problemsThisWeek: number;
  challengesThisWeek: number;
  practiceHoursEstimate: number;
  weekOverWeekPercent: number | null;
};

export type MonthlyActivityCell = {
  date: string;
  day: number;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  inMonth: boolean;
  isToday: boolean;
};

export type MonthlyActiveDate = {
  date: string;
  label: string;
  count: number;
};

export type MonthlyActivity = {
  monthLabel: string;
  activeDays: number;
  totalSubmissions: number;
  weeks: MonthlyActivityCell[][];
  activeDates: MonthlyActiveDate[];
};

export type SkillMomentumRow = {
  label: string;
  sparkline: number[];
  trend: "up" | "flat" | "down";
};

export type ChallengePerformance = {
  attempted: number;
  accepted: number;
  needsImprovement: number;
  averageAttempts: number;
  firstPassRate: number;
  byGroup: { label: string; depth: DepthLevel; percent: number }[];
};

export type EngineeringDna = {
  archetype: string;
  strongIn: string[];
  developing: string[];
  practiceStyle: string;
};

export type RecentActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  status: "accepted" | "needs-work";
  href: string;
  when: string;
  whenLabel: string;
};

export type Milestone = {
  id: string;
  index: number;
  label: string;
  achieved: boolean;
  achievedAt?: string;
};

export type ProgressCockpitSnapshot = {
  profile: EngineeringProfile;
  skillMap: SkillMapNodeState[];
  nextMove: NextMove | null;
  weeklyActivity: WeeklyActivity;
  monthlyActivity: MonthlyActivity;
  skillMomentum: SkillMomentumRow[];
  challengePerformance: ChallengePerformance;
  engineeringDna: EngineeringDna;
  recentActivity: RecentActivityItem[];
  milestones: Milestone[];
};

const DIFFICULTY_WEIGHT: Record<CodeDifficulty, number> = {
  easy: 1,
  medium: 1.6,
  hard: 2.4,
  expert: 3.2,
};

const HIGH_IMPACT_TOPICS = new Set([
  "window-functions",
  "scd",
  "data-quality",
  "deduplication",
  "joins",
  "incremental-loading",
]);

function emptySnapshot(): ProgressCockpitSnapshot {
  return {
    profile: {
      overallPercent: 0,
      skillsExplored: 0,
      challengesCompleted: 0,
      practiceCompleted: 0,
      strongest: [],
      focusAreas: [],
      goalLabel: "Building toward Senior Data Engineer",
    },
    skillMap: SKILL_MAP_NODES.map((n) => ({
      id: n.id,
      label: n.label,
      x: n.x,
      y: n.y,
      percent: 0,
      level: "unexplored" as const,
    })),
    nextMove: null,
    weeklyActivity: {
      days: ["M", "T", "W", "T", "F", "S", "S"].map((label) => ({ label, active: false })),
      problemsThisWeek: 0,
      challengesThisWeek: 0,
      practiceHoursEstimate: 0,
      weekOverWeekPercent: null,
    },
    monthlyActivity: {
      monthLabel: "",
      activeDays: 0,
      totalSubmissions: 0,
      weeks: [],
      activeDates: [],
    },
    skillMomentum: [],
    challengePerformance: {
      attempted: 0,
      accepted: 0,
      needsImprovement: 0,
      averageAttempts: 0,
      firstPassRate: 0,
      byGroup: [],
    },
    engineeringDna: {
      archetype: "Getting started",
      strongIn: [],
      developing: ["SQL fundamentals", "Pipeline design"],
      practiceStyle: "Explore tracks to build your profile",
    },
    recentActivity: [],
    milestones: [],
  };
}

function problemHref(track: CodeTrackId, slug: string, topic?: string): string {
  const base = topic ? `${codeTrackPath(track)}/${topic}` : codeTrackPath(track);
  return `${base}?slug=${encodeURIComponent(slug)}`;
}

function computeTopicDepth(
  track: CodeTrackId,
  topicId: string,
  solvedSet: Set<string>
): { depth: DepthLevel; percent: number } {
  const problems = getCodeProblems(track, topicId);
  if (problems.length === 0) return { depth: 0, percent: 0 };

  let maxScore = 0;
  let earned = 0;
  for (const p of problems) {
    const w = DIFFICULTY_WEIGHT[p.difficulty] ?? 1;
    maxScore += w;
    if (solvedSet.has(p.id)) earned += w;
  }

  const ratio = maxScore ? earned / maxScore : 0;
  const depth = Math.min(5, Math.round(ratio * 5)) as DepthLevel;
  return { depth, percent: Math.round(ratio * 100) };
}

function computeChallengeGroupPercent(
  groupId: string,
  solvedSet: Set<string>
): number {
  const inGroup = getAllChallenges().filter((c) => c.taxonomyGroup === groupId);
  if (inGroup.length === 0) return 0;
  const solved = inGroup.filter((c) => solvedSet.has(c.id)).length;
  return Math.round((solved / inGroup.length) * 100);
}

function computeNodePercent(node: SkillMapNode, solvedSet: Set<string>): number {
  const parts: number[] = [];

  for (const ref of node.practiceTopics ?? []) {
    parts.push(computeTopicDepth(ref.track, ref.topicId, solvedSet).percent);
  }
  for (const ref of node.detailTopics ?? []) {
    parts.push(computeTopicDepth(ref.track, ref.topicId, solvedSet).percent);
  }
  for (const group of node.challengeGroups ?? []) {
    parts.push(computeChallengeGroupPercent(group, solvedSet));
  }

  if (parts.length === 0) return 0;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}

function nodeLevel(percent: number): "unexplored" | "developing" | "strong" {
  if (percent >= 60) return "strong";
  if (percent >= 15) return "developing";
  return "unexplored";
}

function buildSkillMap(solvedSet: Set<string>): SkillMapNodeState[] {
  return SKILL_MAP_NODES.map((node) => {
    const percent = computeNodePercent(node, solvedSet);
    return {
      id: node.id,
      label: node.label,
      x: node.x,
      y: node.y,
      percent,
      level: nodeLevel(percent),
      detailTopics: node.detailTopics?.map((t) => {
        const { depth, percent: topicPercent } = computeTopicDepth(
          t.track,
          t.topicId,
          solvedSet
        );
        return {
          label: t.label,
          depth,
          percent: topicPercent,
          track: t.track,
          topicId: t.topicId,
        };
      }),
    };
  });
}

function buildProfile(solvedSet: Set<string>): EngineeringProfile {
  const practiceProblems = CODE_TRACKS.flatMap((t) => getCodeProblems(t.id));
  const practiceTotal = practiceProblems.length;
  const practiceCompleted = practiceProblems.filter((p) => solvedSet.has(p.id)).length;

  const challenges = getAllChallenges();
  const challengesCompleted = challenges.filter((c) => solvedSet.has(c.id)).length;

  const practicePercent = practiceTotal
    ? Math.round((practiceCompleted / practiceTotal) * 100)
    : 0;
  const challengePercent = challenges.length
    ? Math.round((challengesCompleted / challenges.length) * 100)
    : 0;
  const overallPercent = Math.round(practicePercent * 0.55 + challengePercent * 0.45);

  const exploredTopics = new Set<string>();
  for (const track of CODE_TRACKS) {
    for (const topic of getActiveTopics(track.id)) {
      const stats = getCodeProblems(track.id, topic.id).some((p) => solvedSet.has(p.id));
      if (stats) exploredTopics.add(`${track.id}:${topic.id}`);
    }
  }
  for (const c of challenges) {
    if (solvedSet.has(c.id)) exploredTopics.add(`challenge:${c.taxonomyGroup}`);
  }

  const nodeScores = buildSkillMap(solvedSet)
    .filter((n) => !["analytics", "joins"].includes(n.id))
    .map((n) => ({ label: n.label, percent: n.percent }));

  const sorted = [...nodeScores].sort((a, b) => b.percent - a.percent);
  const strongest = sorted.filter((s) => s.percent > 0).slice(0, 3);
  const focusAreas = [...sorted]
    .reverse()
    .filter((s) => s.percent < 100)
    .slice(0, 3);

  return {
    overallPercent,
    skillsExplored: exploredTopics.size,
    challengesCompleted,
    practiceCompleted,
    strongest,
    focusAreas,
    goalLabel: "Building toward Senior Data Engineer",
  };
}

function buildNextMove(solvedSet: Set<string>): NextMove | null {
  type Candidate = {
    score: number;
    title: string;
    subtitle: string;
    detail: string;
    href: string;
    conceptsRemaining: number;
    reasons: string[];
  };

  const candidates: Candidate[] = [];

  for (const track of CODE_TRACKS) {
    for (const topic of getActiveTopics(track.id)) {
      const problems = getCodeProblems(track.id, topic.id);
      if (problems.length === 0) continue;

      const { depth, percent } = computeTopicDepth(track.id, topic.id, solvedSet);
      if (depth === 0 || depth >= 5) continue;

      const solved = problems.filter((p) => solvedSet.has(p.id)).length;
      const remaining = problems.length - solved;
      const next = problems.find((p) => !solvedSet.has(p.id));
      if (!next) continue;

      const gap = 5 - depth;
      let score = gap * 10 + (100 - percent);
      if (HIGH_IMPACT_TOPICS.has(topic.id)) score += 25;
      if (track.id === "pyspark") score += 15;

      const reasons: string[] = [];
      if (HIGH_IMPACT_TOPICS.has(topic.id)) reasons.push("high-impact DE skill");
      if (solved > 0) reasons.push("partially completed");
      if (percent < 40) reasons.push("largest current gap in this area");

      candidates.push({
        score,
        title: next.title,
        subtitle: `${track.label} · ${getTopicLabel(track.id, topic.id)}`,
        detail: `You understand ${getTopicLabel(track.id, topic.id).toLowerCase()} at ${percent}% depth — ${remaining} problem${remaining === 1 ? "" : "s"} remaining.`,
        href: problemHref(track.id, next.slug, topic.id),
        conceptsRemaining: remaining,
        reasons: reasons.length ? reasons : ["continues your current learning path"],
      });
    }
  }

  if (candidates.length === 0) {
    const challenge = getAllChallenges().find((c) => !solvedSet.has(c.id));
    if (!challenge) return null;
    return {
      title: challenge.title,
      subtitle: "DE Challenge",
      detail: "Try a production-style scenario to round out your profile.",
      href: challengePath(challenge.slug),
      conceptsRemaining: 1,
      reasons: ["expands real-world DE competency"],
    };
  }

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0];
  return {
    title: top.title,
    subtitle: top.subtitle,
    detail: top.detail,
    href: top.href,
    conceptsRemaining: top.conceptsRemaining,
    reasons: top.reasons,
  };
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildWeeklyActivity(submissions: CodeSubmission[]): WeeklyActivity {
  const now = new Date();
  const today = startOfDay(now);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  const days: { label: string; active: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStart = startOfDay(d).getTime();
    const dayEnd = dayStart + 86400000;
    const active = submissions.some((s) => {
      const t = new Date(s.createdAt).getTime();
      return t >= dayStart && t < dayEnd;
    });
    const dow = d.getDay();
    const labelIndex = dow === 0 ? 6 : dow - 1;
    days.push({ label: dayLabels[labelIndex], active });
  }

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);

  const thisWeek = submissions.filter((s) => new Date(s.createdAt) >= weekStart);
  const lastWeek = submissions.filter((s) => {
    const t = new Date(s.createdAt);
    return t >= prevWeekStart && t < weekStart;
  });

  const problemsThisWeek = thisWeek.filter((s) => s.problemKind !== "de_challenge").length;
  const challengesThisWeek = thisWeek.filter((s) => s.problemKind === "de_challenge").length;
  const practiceHoursEstimate = Math.round((thisWeek.length * 18) / 60 * 10) / 10;

  const thisCount = thisWeek.length;
  const lastCount = lastWeek.length;
  const weekOverWeekPercent =
    lastCount === 0 ? (thisCount > 0 ? 100 : null) : Math.round(((thisCount - lastCount) / lastCount) * 100);

  return {
    days,
    problemsThisWeek,
    challengesThisWeek,
    practiceHoursEstimate,
    weekOverWeekPercent,
  };
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function activityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function buildMonthlyActivity(submissions: CodeSubmission[]): MonthlyActivity {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayKey = dateKey(now);
  const monthStart = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = monthStart.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const counts = new Map<string, number>();
  for (const s of submissions) {
    const d = new Date(s.createdAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const key = dateKey(d);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const cells: MonthlyActivityCell[] = [];
  const startPad = monthStart.getDay();

  for (let i = 0; i < startPad; i++) {
    cells.push({
      date: "",
      day: 0,
      count: 0,
      level: 0,
      inMonth: false,
      isToday: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const key = dateKey(d);
    const count = counts.get(key) ?? 0;
    cells.push({
      date: key,
      day,
      count,
      level: activityLevel(count),
      inMonth: true,
      isToday: key === todayKey,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      date: "",
      day: 0,
      count: 0,
      level: 0,
      inMonth: false,
      isToday: false,
    });
  }

  const weeks: MonthlyActivityCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const activeDates: MonthlyActiveDate[] = [...counts.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, count]) => ({
      date,
      label: new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      count,
    }));

  const totalSubmissions = [...counts.values()].reduce((a, b) => a + b, 0);

  return {
    monthLabel,
    activeDays: counts.size,
    totalSubmissions,
    weeks,
    activeDates,
  };
}

function buildSkillMomentum(submissions: CodeSubmission[]): SkillMomentumRow[] {
  const tracks: { id: CodeTrackId; label: string }[] = [
    { id: "sql", label: "SQL" },
    { id: "pyspark", label: "PySpark" },
  ];
  const groups = [{ id: "data-quality" as const, label: "Data Quality" }];

  const weeks = 8;
  const now = startOfDay(new Date());
  const challengeById = new Map(getAllChallenges().map((c) => [c.id, c]));

  function sparklineFor(filter: (s: CodeSubmission) => boolean): number[] {
    const points: number[] = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const end = new Date(now);
      end.setDate(end.getDate() - w * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      const count = submissions.filter((s) => {
        if (!filter(s)) return false;
        const t = new Date(s.createdAt);
        return t >= start && t < end && s.status === "accepted";
      }).length;
      points.push(count);
    }
    return points;
  }

  function trend(points: number[]): "up" | "flat" | "down" {
    if (points.length < 2) return "flat";
    const recent = points.slice(-3).reduce((a, b) => a + b, 0);
    const prior = points.slice(0, 3).reduce((a, b) => a + b, 0);
    if (recent > prior) return "up";
    if (recent < prior) return "down";
    return "flat";
  }

  const rows: SkillMomentumRow[] = tracks.map((t) => {
    const sparkline = sparklineFor((s) => s.track === t.id && s.problemKind !== "de_challenge");
    return { label: t.label, sparkline, trend: trend(sparkline) };
  });

  for (const g of groups) {
    const sparkline = sparklineFor((s) => {
      if (s.problemKind !== "de_challenge") return false;
      const ch = challengeById.get(s.problemId);
      return ch?.taxonomyGroup === g.id;
    });
    rows.push({ label: g.label, sparkline, trend: trend(sparkline) });
  }

  return rows;
}

function buildChallengePerformance(
  submissions: CodeSubmission[],
  solvedSet: Set<string>
): ChallengePerformance {
  const challenges = getAllChallenges();
  const challengeSubs = submissions.filter((s) => s.problemKind === "de_challenge");
  const attemptedIds = new Set(challengeSubs.map((s) => s.problemId));
  const accepted = challenges.filter((c) => solvedSet.has(c.id)).length;

  let firstPass = 0;
  let firstAttempts = 0;
  for (const id of attemptedIds) {
    const subs = challengeSubs.filter((s) => s.problemId === id).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    if (subs.length === 0) continue;
    firstAttempts++;
    if (subs[0].status === "accepted") firstPass++;
  }

  const byGroup = CHALLENGE_TAXONOMY_GROUPS.map((group) => {
    const inGroup = challenges.filter((c) => c.taxonomyGroup === group.id);
    if (inGroup.length === 0) return null;
    const percent = computeChallengeGroupPercent(group.id, solvedSet);
    const depth = Math.min(5, Math.round((percent / 100) * 5)) as DepthLevel;
    return { label: group.label, depth, percent };
  }).filter(Boolean) as ChallengePerformance["byGroup"];

  return {
    attempted: attemptedIds.size,
    accepted,
    needsImprovement: Math.max(0, attemptedIds.size - accepted),
    averageAttempts:
      attemptedIds.size === 0
        ? 0
        : Math.round((challengeSubs.length / attemptedIds.size) * 10) / 10,
    firstPassRate:
      firstAttempts === 0 ? 0 : Math.round((firstPass / firstAttempts) * 100),
    byGroup,
  };
}

function buildEngineeringDna(
  profile: EngineeringProfile,
  skillMap: SkillMapNodeState[]
): EngineeringDna {
  const byId = Object.fromEntries(skillMap.map((n) => [n.id, n.percent]));
  const sql = byId.sql ?? 0;
  const pyspark = byId.pyspark ?? 0;
  const dq = byId["data-quality"] ?? 0;
  const etl = byId.etl ?? 0;

  let archetype = "Balanced Builder";
  if (sql >= pyspark + 20 && dq >= 40) archetype = "Analytical Builder";
  else if (pyspark >= sql + 15) archetype = "Distributed Engineer";
  else if (profile.challengesCompleted > profile.practiceCompleted * 0.3 && profile.challengesCompleted >= 2)
    archetype = "Pipeline Engineer";
  else if (profile.overallPercent < 10) archetype = "Getting started";

  const strongIn: string[] = [];
  if (sql >= 40) strongIn.push("SQL reasoning");
  if (dq >= 35) strongIn.push("Data validation");
  if (etl >= 35) strongIn.push("Incremental pipelines");

  const developing: string[] = [];
  if (pyspark < 40) developing.push("Spark optimization");
  if ((byId.cdc ?? 0) < 35) developing.push("Event-time processing");
  if (developing.length === 0) developing.push("Advanced performance tuning");

  const submissions = getAllSubmissions();
  const accepted = submissions.filter((s) => s.status === "accepted").length;
  const rate = submissions.length ? accepted / submissions.length : 0;
  const practiceStyle =
    rate >= 0.75
      ? "Deep sessions · High correctness"
      : rate >= 0.5
        ? "Steady practice · Iterative improvement"
        : "Exploratory · Learning through retries";

  return {
    archetype,
    strongIn: strongIn.length ? strongIn : ["Core SQL literacy"],
    developing,
    practiceStyle,
  };
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildRecentActivity(submissions: CodeSubmission[]): RecentActivityItem[] {
  return submissions.slice(0, 8).map((s) => {
    if (s.problemKind === "de_challenge") {
      const challenge = getChallengeBySlug(s.slug);
      return {
        id: s.id,
        title: challenge?.title ?? s.slug,
        subtitle: "DE Challenge · SQL",
        status: s.status === "accepted" ? "accepted" : "needs-work",
        href: challengePath(s.slug),
        when: s.createdAt,
        whenLabel: formatRelativeTime(s.createdAt),
      };
    }

    const problem = getCodeProblemById(s.problemId);
    const trackLabel = CODE_TRACKS.find((t) => t.id === s.track)?.label ?? s.track;
    return {
      id: s.id,
      title: problem?.title ?? s.slug,
      subtitle: `${trackLabel} · ${problem ? getTopicLabel(s.track, problem.topic) : "Practice"}`,
      status: s.status === "accepted" ? "accepted" : "needs-work",
      href: problem
        ? problemHref(s.track, s.slug, problem.topic)
        : codeTrackPath(s.track),
      when: s.createdAt,
      whenLabel: formatRelativeTime(s.createdAt),
    };
  });
}

function buildMilestones(
  solvedSet: Set<string>,
  submissions: CodeSubmission[]
): Milestone[] {
  const sqlSolved = getCodeProblems("sql").filter((p) => solvedSet.has(p.id)).length;
  const pysparkSolved = getCodeProblems("pyspark").filter((p) => solvedSet.has(p.id)).length;
  const challenges = getAllChallenges();
  const challengeSolved = challenges.filter((c) => solvedSet.has(c.id)).length;

  const scdComplete =
    getCodeProblems("sql", "scd").length > 0 &&
    getCodeProblems("sql", "scd").every((p) => solvedSet.has(p.id));

  const groupsComplete = CHALLENGE_TAXONOMY_GROUPS.filter((g) => {
    const inGroup = challenges.filter((c) => c.taxonomyGroup === g.id);
    return inGroup.length > 0 && inGroup.every((c) => solvedSet.has(c.id));
  }).length;

  const defs: { id: string; label: string; check: () => boolean }[] = [
    {
      id: "first-challenge",
      label: "First DE Challenge completed",
      check: () => challengeSolved >= 1,
    },
    {
      id: "10-problems",
      label: "10 practice problems solved",
      check: () => solvedSet.size >= 10,
    },
    {
      id: "25-sql",
      label: "25 SQL problems solved",
      check: () => sqlSolved >= 25,
    },
    {
      id: "pyspark-start",
      label: "First PySpark problems accepted",
      check: () => pysparkSolved >= 1,
    },
    {
      id: "scd-covered",
      label: "Covered all SCD concepts",
      check: () => scdComplete,
    },
    {
      id: "three-areas",
      label: "Completed 3 competency areas",
      check: () => groupsComplete >= 3,
    },
  ];

  return defs.map((d, i) => {
    const achieved = d.check();
    const firstAccept = achieved
      ? submissions.find((s) => s.status === "accepted")?.createdAt
      : undefined;
    return {
      id: d.id,
      index: i + 1,
      label: d.label,
      achieved,
      achievedAt: achieved ? firstAccept : undefined,
    };
  });
}

export function getProgressCockpitSnapshot(): ProgressCockpitSnapshot {
  if (typeof window === "undefined") return emptySnapshot();

  const solvedIds = getSolvedProblemIds();
  const solvedSet = new Set(solvedIds);
  const submissions = getAllSubmissions();

  const skillMap = buildSkillMap(solvedSet);
  const profile = buildProfile(solvedSet);

  return {
    profile,
    skillMap,
    nextMove: buildNextMove(solvedSet),
    weeklyActivity: buildWeeklyActivity(submissions),
    monthlyActivity: buildMonthlyActivity(submissions),
    skillMomentum: buildSkillMomentum(submissions),
    challengePerformance: buildChallengePerformance(submissions, solvedSet),
    engineeringDna: buildEngineeringDna(profile, skillMap),
    recentActivity: buildRecentActivity(submissions),
    milestones: buildMilestones(solvedSet, submissions),
  };
}

export function depthDots(depth: DepthLevel): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < depth);
}

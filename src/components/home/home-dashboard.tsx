"use client";

import * as React from "react";
import { SQL_ROUTES, SQL_STATS } from "@/lib/sql";
import { PYTHON_ROUTES, PYTHON_STATS } from "@/lib/python";
import { SPARK_ROUTES, SPARK_STATS } from "@/lib/spark";
import { DATABRICKS_ROUTES, DATABRICKS_STATS } from "@/lib/databricks";
import { AIRFLOW_ROUTES, AIRFLOW_STATS } from "@/lib/airflow";
import { CLOUD_ROUTES, CLOUD_STATS } from "@/lib/cloud";
import { SYSTEM_DESIGN_ROUTES, SYSTEM_DESIGN_STATS } from "@/lib/system-design";
import { INTERVIEW_PREP_ROUTES, INTERVIEW_PREP_STATS } from "@/lib/interview-prep";
import {
  getInterviewStats as getSqlInterviewStats,
  getLeetCodeStats,
  getNotesStats as getSqlNotesStats,
  getPracticeStats as getSqlPracticeStats,
} from "@/lib/sql-progress";
import {
  getCodingStats,
  getInterviewStats as getPythonInterviewStats,
  getNotesStats as getPythonNotesStats,
  getPracticeStats as getPythonPracticeStats,
} from "@/lib/python-progress";
import {
  getInterviewStats as getSparkInterviewStats,
  getNotesStats as getSparkNotesStats,
  getPracticeStats as getSparkPracticeStats,
} from "@/lib/spark-progress";
import {
  getInterviewStats as getDatabricksInterviewStats,
  getNotesStats as getDatabricksNotesStats,
  getPracticeStats as getDatabricksPracticeStats,
} from "@/lib/databricks-progress";
import {
  getInterviewStats as getAirflowInterviewStats,
  getNotesStats as getAirflowNotesStats,
  getPracticeStats as getAirflowPracticeStats,
} from "@/lib/airflow-progress";
import {
  getInterviewStats as getCloudInterviewStats,
  getNotesStats as getCloudNotesStats,
  getPracticeStats as getCloudPracticeStats,
} from "@/lib/cloud-progress";
import {
  getInterviewStats as getSystemDesignInterviewStats,
  getNotesStats as getSystemDesignNotesStats,
  getPracticeStats as getSystemDesignPracticeStats,
} from "@/lib/system-design-progress";
import {
  getInterviewStats as getInterviewPrepInterviewStats,
  getNotesStats as getInterviewPrepNotesStats,
  getPracticeStats as getInterviewPrepPracticeStats,
} from "@/lib/interview-prep-progress";
import { HomeSectionHeader } from "@/components/home/home-section-header";
import { HomeLabNav } from "@/components/home/home-lab-nav";
import { HomeProgressPanel, type LabProgressEntry } from "@/components/home/home-progress-panel";
import { LabSummaryCard } from "@/components/home/lab-summary-card";
import { SiteContainer } from "@/components/site-container";

type TrackStat = { current: number; total: number; percent: number };

const SQL_TRACKS = [
  { key: "notes", label: "Notes" },
  { key: "practice", label: "Practice" },
  { key: "leetcode", label: "LeetCode" },
  { key: "interview", label: "Interview" },
] as const;

const PYTHON_TRACKS = [
  { key: "notes", label: "Notes" },
  { key: "practice", label: "Practice" },
  { key: "coding", label: "Coding" },
  { key: "interview", label: "Interview" },
] as const;

const STANDARD_TRACKS = [
  { key: "notes", label: "Notes" },
  { key: "practice", label: "Practice" },
  { key: "interview", label: "Interview" },
] as const;

const ALL_LABS = [
  {
    key: "sql",
    title: "SQL Lab",
    description: "Notes, 150 practice, LeetCode, mock interviews",
    href: SQL_ROUTES.home,
    event: "sql-progress-updated",
    tracks: SQL_TRACKS,
    buildStats: () => {
      const notes = getSqlNotesStats(SQL_STATS.noteChapters);
      const practice = getSqlPracticeStats(SQL_STATS.practiceTotal);
      const leetcode = getLeetCodeStats(SQL_STATS.leetcodeTotal);
      const interview = getSqlInterviewStats(SQL_STATS.interviewTotal);
      return {
        notes: { current: notes.read, total: notes.total, percent: notes.percent },
        practice: { current: practice.solved, total: practice.total, percent: practice.percent },
        leetcode: { current: leetcode.solved, total: leetcode.total, percent: leetcode.percent },
        interview: { current: interview.know, total: interview.total, percent: interview.percent },
      };
    },
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "python",
    title: "Python Lab",
    description: "pandas, pipelines, coding track, flashcards",
    href: PYTHON_ROUTES.home,
    event: "python-progress-updated",
    tracks: PYTHON_TRACKS,
    buildStats: () => {
      const notes = getPythonNotesStats(PYTHON_STATS.noteChapters);
      const practice = getPythonPracticeStats(PYTHON_STATS.practiceTotal);
      const coding = getCodingStats(PYTHON_STATS.codingTotal);
      const interview = getPythonInterviewStats(PYTHON_STATS.interviewTotal);
      return {
        notes: { current: notes.read, total: notes.total, percent: notes.percent },
        practice: { current: practice.solved, total: practice.total, percent: practice.percent },
        coding: { current: coding.solved, total: coding.total, percent: coding.percent },
        interview: { current: interview.know, total: interview.total, percent: interview.percent },
      };
    },
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "spark",
    title: "PySpark Lab",
    description: "100 notes, 150 coding, 100 interview Q&A, mock",
    href: SPARK_ROUTES.home,
    event: "spark-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () => buildStandardStats(SPARK_STATS, getSparkNotesStats, getSparkPracticeStats, getSparkInterviewStats),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Coding ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "databricks",
    title: "Databricks Lab",
    description: "Delta Lake, Unity Catalog, workflows",
    href: DATABRICKS_ROUTES.home,
    event: "databricks-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () =>
      buildStandardStats(
        DATABRICKS_STATS,
        getDatabricksNotesStats,
        getDatabricksPracticeStats,
        getDatabricksInterviewStats
      ),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "airflow",
    title: "Airflow Lab",
    description: "DAGs, operators, scheduling patterns",
    href: AIRFLOW_ROUTES.home,
    event: "airflow-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () =>
      buildStandardStats(AIRFLOW_STATS, getAirflowNotesStats, getAirflowPracticeStats, getAirflowInterviewStats),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "cloud",
    title: "Cloud Lab",
    description: "Azure ADF, ADLS, Synapse patterns",
    href: CLOUD_ROUTES.home,
    event: "cloud-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () =>
      buildStandardStats(CLOUD_STATS, getCloudNotesStats, getCloudPracticeStats, getCloudInterviewStats),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "system-design",
    title: "System Design Lab",
    description: "Batch vs streaming, lakehouse, case studies",
    href: SYSTEM_DESIGN_ROUTES.home,
    event: "system-design-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () =>
      buildStandardStats(
        SYSTEM_DESIGN_STATS,
        getSystemDesignNotesStats,
        getSystemDesignPracticeStats,
        getSystemDesignInterviewStats
      ),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
  {
    key: "interview-prep",
    title: "Interview Prep Lab",
    description: "STAR prompts, behavioral, negotiation",
    href: INTERVIEW_PREP_ROUTES.home,
    event: "interview-prep-progress-updated",
    tracks: STANDARD_TRACKS,
    buildStats: () =>
      buildStandardStats(
        INTERVIEW_PREP_STATS,
        getInterviewPrepNotesStats,
        getInterviewPrepPracticeStats,
        getInterviewPrepInterviewStats
      ),
    formatDetail: (stats: Record<string, TrackStat>) =>
      `Notes ${stats.notes?.current ?? 0}/${stats.notes?.total ?? 0} · Practice ${stats.practice?.current ?? 0}/${stats.practice?.total ?? 0}`,
  },
] as const;

function zeroStat(total: number): TrackStat {
  return { current: 0, total, percent: 0 };
}

function standardPlaceholder(stats: {
  noteChapters: number;
  practiceTotal: number;
  interviewTotal: number;
}): Record<string, TrackStat> {
  return {
    notes: zeroStat(stats.noteChapters),
    practice: zeroStat(stats.practiceTotal),
    interview: zeroStat(stats.interviewTotal),
  };
}

const EMPTY_LAB_STATS: Record<string, Record<string, TrackStat>> = {
  sql: {
    notes: zeroStat(SQL_STATS.noteChapters),
    practice: zeroStat(SQL_STATS.practiceTotal),
    leetcode: zeroStat(SQL_STATS.leetcodeTotal),
    interview: zeroStat(SQL_STATS.interviewTotal),
  },
  python: {
    notes: zeroStat(PYTHON_STATS.noteChapters),
    practice: zeroStat(PYTHON_STATS.practiceTotal),
    coding: zeroStat(PYTHON_STATS.codingTotal),
    interview: zeroStat(PYTHON_STATS.interviewTotal),
  },
  spark: standardPlaceholder(SPARK_STATS),
  databricks: standardPlaceholder(DATABRICKS_STATS),
  airflow: standardPlaceholder(AIRFLOW_STATS),
  cloud: standardPlaceholder(CLOUD_STATS),
  "system-design": standardPlaceholder(SYSTEM_DESIGN_STATS),
  "interview-prep": standardPlaceholder(INTERVIEW_PREP_STATS),
};

function buildStandardStats(
  stats: { noteChapters: number; practiceTotal: number; interviewTotal: number },
  getNotes: (total: number) => { read: number; total: number; percent: number },
  getPractice: (total: number) => { solved: number; total: number; percent: number },
  getInterview: (total: number) => { know: number; total: number; percent: number }
): Record<string, TrackStat> {
  const notes = getNotes(stats.noteChapters);
  const practice = getPractice(stats.practiceTotal);
  const interview = getInterview(stats.interviewTotal);

  return {
    notes: { current: notes.read, total: notes.total, percent: notes.percent },
    practice: { current: practice.solved, total: practice.total, percent: practice.percent },
    interview: { current: interview.know, total: interview.total, percent: interview.percent },
  };
}

function labPercent(stats: Record<string, TrackStat>, tracks: readonly { key: string }[]): number {
  if (tracks.length === 0) return 0;
  const sum = tracks.reduce((acc, track) => acc + (stats[track.key]?.percent ?? 0), 0);
  return Math.round(sum / tracks.length);
}

export function HomeDashboard() {
  const [labStats, setLabStats] = React.useState(EMPTY_LAB_STATS);

  const refresh = React.useCallback(() => {
    setLabStats(Object.fromEntries(ALL_LABS.map((lab) => [lab.key, lab.buildStats()])));
  }, []);

  React.useEffect(() => {
    refresh();
    const events = ALL_LABS.map((lab) => lab.event);
    events.forEach((event) => window.addEventListener(event, refresh));
    return () => {
      events.forEach((event) => window.removeEventListener(event, refresh));
    };
  }, [refresh]);

  const progressEntries: LabProgressEntry[] = ALL_LABS.map((lab) => {
    const stats = labStats[lab.key] ?? {};
    const percent = labPercent(stats, lab.tracks);
    return {
      key: lab.key,
      title: lab.title,
      href: lab.href,
      percent,
      detail: lab.formatDetail(stats),
    };
  });

  return (
    <SiteContainer as="section" className="space-y-12 py-10 sm:py-12">
      <div>
        <HomeSectionHeader title="Sections" description="Eight tracks — pick one and go deep." />
        <HomeLabNav className="mt-6" />
      </div>

      <div>
        <HomeSectionHeader
          title="All labs"
          description="Progress across notes, practice, and interview prep."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {ALL_LABS.map((lab) => (
              <div key={lab.key} id={`lab-${lab.key}`}>
                <LabSummaryCard
                  title={lab.title}
                  description={lab.description}
                  href={lab.href}
                  tracks={lab.tracks}
                  stats={labStats[lab.key] ?? {}}
                />
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <HomeProgressPanel labs={progressEntries} />
          </aside>
        </div>
      </div>
    </SiteContainer>
  );
}

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
  getNotesStats as getSqlNotesStats,
  getPracticeStats as getSqlPracticeStats,
} from "@/lib/sql-progress";
import {
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

export interface StudyGoalTemplate {
  id: string;
  labKey: string;
  labLabel: string;
  title: string;
  href: string;
  totalUnits: number;
  unitLabel: string;
  chunkSize: number;
  getCompleted: () => number;
  practiceHref?: (startUnit: number) => string;
}

export const STUDY_GOAL_TEMPLATES: StudyGoalTemplate[] = [
  {
    id: "sql-notes",
    labKey: "sql",
    labLabel: "SQL",
    title: "SQL Notes",
    href: SQL_ROUTES.notes,
    totalUnits: SQL_STATS.noteChapters,
    unitLabel: "chapters",
    chunkSize: 1,
    getCompleted: () => getSqlNotesStats(SQL_STATS.noteChapters).read,
  },
  {
    id: "sql-practice",
    labKey: "sql",
    labLabel: "SQL",
    title: "SQL Practice",
    href: SQL_ROUTES.practice,
    totalUnits: SQL_STATS.practiceTotal,
    unitLabel: "problems",
    chunkSize: 5,
    getCompleted: () => getSqlPracticeStats(SQL_STATS.practiceTotal).solved,
    practiceHref: (n) => `${SQL_ROUTES.practice}?id=${n}`,
  },
  {
    id: "sql-interview",
    labKey: "sql",
    labLabel: "SQL",
    title: "SQL Interview Q&A",
    href: SQL_ROUTES.interview,
    totalUnits: SQL_STATS.interviewTotal,
    unitLabel: "cards",
    chunkSize: 5,
    getCompleted: () => getSqlInterviewStats(SQL_STATS.interviewTotal).know,
  },
  {
    id: "python-notes",
    labKey: "python",
    labLabel: "Python",
    title: "Python Notes",
    href: PYTHON_ROUTES.notes,
    totalUnits: PYTHON_STATS.noteChapters,
    unitLabel: "chapters",
    chunkSize: 1,
    getCompleted: () => getPythonNotesStats(PYTHON_STATS.noteChapters).read,
  },
  {
    id: "python-practice",
    labKey: "python",
    labLabel: "Python",
    title: "Python Practice",
    href: PYTHON_ROUTES.practice,
    totalUnits: PYTHON_STATS.practiceTotal,
    unitLabel: "problems",
    chunkSize: 5,
    getCompleted: () => getPythonPracticeStats(PYTHON_STATS.practiceTotal).solved,
    practiceHref: (n) => `${PYTHON_ROUTES.practice}?id=${n}`,
  },
  {
    id: "python-interview",
    labKey: "python",
    labLabel: "Python",
    title: "Python Interview",
    href: PYTHON_ROUTES.interview,
    totalUnits: PYTHON_STATS.interviewTotal,
    unitLabel: "cards",
    chunkSize: 5,
    getCompleted: () => getPythonInterviewStats(PYTHON_STATS.interviewTotal).know,
  },
  {
    id: "spark-notes",
    labKey: "spark",
    labLabel: "PySpark",
    title: "PySpark Notes",
    href: SPARK_ROUTES.notes,
    totalUnits: SPARK_STATS.noteChapters,
    unitLabel: "chapters",
    chunkSize: 1,
    getCompleted: () => getSparkNotesStats(SPARK_STATS.noteChapters).read,
  },
  {
    id: "spark-practice",
    labKey: "spark",
    labLabel: "PySpark",
    title: "PySpark Coding",
    href: SPARK_ROUTES.practice,
    totalUnits: SPARK_STATS.practiceTotal,
    unitLabel: "problems",
    chunkSize: 5,
    getCompleted: () => getSparkPracticeStats(SPARK_STATS.practiceTotal).solved,
    practiceHref: (n) => `${SPARK_ROUTES.practice}?id=${n}`,
  },
  {
    id: "spark-interview",
    labKey: "spark",
    labLabel: "PySpark",
    title: "PySpark Interview",
    href: SPARK_ROUTES.interview,
    totalUnits: SPARK_STATS.interviewTotal,
    unitLabel: "cards",
    chunkSize: 5,
    getCompleted: () => getSparkInterviewStats(SPARK_STATS.interviewTotal).know,
  },
  ...buildStandardLabGoals("databricks", "Databricks", DATABRICKS_ROUTES, DATABRICKS_STATS, {
    notes: getDatabricksNotesStats,
    practice: getDatabricksPracticeStats,
    interview: getDatabricksInterviewStats,
  }),
  ...buildStandardLabGoals("airflow", "Airflow", AIRFLOW_ROUTES, AIRFLOW_STATS, {
    notes: getAirflowNotesStats,
    practice: getAirflowPracticeStats,
    interview: getAirflowInterviewStats,
  }),
  ...buildStandardLabGoals("cloud", "Cloud", CLOUD_ROUTES, CLOUD_STATS, {
    notes: getCloudNotesStats,
    practice: getCloudPracticeStats,
    interview: getCloudInterviewStats,
  }),
  ...buildStandardLabGoals("system-design", "System Design", SYSTEM_DESIGN_ROUTES, SYSTEM_DESIGN_STATS, {
    notes: getSystemDesignNotesStats,
    practice: getSystemDesignPracticeStats,
    interview: getSystemDesignInterviewStats,
  }),
  ...buildStandardLabGoals("interview-prep", "Interview Prep", INTERVIEW_PREP_ROUTES, INTERVIEW_PREP_STATS, {
    notes: getInterviewPrepNotesStats,
    practice: getInterviewPrepPracticeStats,
    interview: getInterviewPrepInterviewStats,
  }),
];

function buildStandardLabGoals(
  labKey: string,
  labLabel: string,
  routes: { notes: string; practice: string; interview: string },
  stats: { noteChapters: number; practiceTotal: number; interviewTotal: number },
  getters: {
    notes: (n: number) => { read: number };
    practice: (n: number) => { solved: number };
    interview: (n: number) => { know: number };
  }
): StudyGoalTemplate[] {
  return [
    {
      id: `${labKey}-notes`,
      labKey,
      labLabel,
      title: `${labLabel} Notes`,
      href: routes.notes,
      totalUnits: stats.noteChapters,
      unitLabel: "chapters",
      chunkSize: 1,
      getCompleted: () => getters.notes(stats.noteChapters).read,
    },
    {
      id: `${labKey}-practice`,
      labKey,
      labLabel,
      title: `${labLabel} Practice`,
      href: routes.practice,
      totalUnits: stats.practiceTotal,
      unitLabel: "problems",
      chunkSize: 5,
      getCompleted: () => getters.practice(stats.practiceTotal).solved,
      practiceHref: (n) => `${routes.practice}?id=${n}`,
    },
    {
      id: `${labKey}-interview`,
      labKey,
      labLabel,
      title: `${labLabel} Interview`,
      href: routes.interview,
      totalUnits: stats.interviewTotal,
      unitLabel: "cards",
      chunkSize: 5,
      getCompleted: () => getters.interview(stats.interviewTotal).know,
    },
  ];
}

export function getStudyGoalById(id: string): StudyGoalTemplate | undefined {
  return STUDY_GOAL_TEMPLATES.find((goal) => goal.id === id);
}

export const STUDY_GOALS_BY_LAB = STUDY_GOAL_TEMPLATES.reduce<
  Record<string, { labLabel: string; goals: StudyGoalTemplate[] }>
>((acc, goal) => {
  if (!acc[goal.labKey]) {
    acc[goal.labKey] = { labLabel: goal.labLabel, goals: [] };
  }
  acc[goal.labKey].goals.push(goal);
  return acc;
}, {});

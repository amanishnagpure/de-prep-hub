import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { AIRFLOW_ROUTES } from "@/lib/airflow";
import { CLOUD_ROUTES } from "@/lib/cloud";
import { DATABRICKS_ROUTES } from "@/lib/databricks";
import { INTERVIEW_PREP_ROUTES } from "@/lib/interview-prep";
import { PYTHON_ROUTES } from "@/lib/python";
import { SPARK_ROUTES } from "@/lib/spark";
import { SQL_ROUTES } from "@/lib/sql";
import { SYSTEM_DESIGN_ROUTES } from "@/lib/system-design";
import type { PracticeLinkConfig, PracticeLinkTarget } from "@/lib/linkify-practice-refs";
import { parseInterviewQuestions } from "@/lib/sql-interview";

import airflowPractice from "@/data/airflow-practice-questions.json";
import cloudPractice from "@/data/cloud-practice-questions.json";
import databricksPractice from "@/data/databricks-practice-questions.json";
import interviewPrepPractice from "@/data/interview-prep-practice-questions.json";
import pythonPractice from "@/data/python-practice-questions.json";
import sparkPractice from "@/data/spark-practice-questions.json";
import sqlPractice from "@/data/sql-practice-questions.json";
import systemDesignPractice from "@/data/system-design-practice-questions.json";

export type PracticeLabId =
  | "sql"
  | "python"
  | "spark"
  | "databricks"
  | "airflow"
  | "cloud"
  | "system-design"
  | "interview-prep";

type PracticeRow = { id: number; title: string };

function titlesFromPractice(rows: PracticeRow[]): Record<number, string> {
  return Object.fromEntries(rows.map((row) => [row.id, row.title]));
}

function loadInterviewTitles(slug: string): Record<number, string> {
  const filePath = path.join(process.cwd(), "content/topics", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContents);
  return Object.fromEntries(
    parseInterviewQuestions(content).map((question) => [question.id, question.question])
  );
}

function makeTarget(
  practicePath: string,
  practiceRows: PracticeRow[],
  interviewPath?: string,
  interviewTitles?: Record<number, string>
): PracticeLinkTarget {
  return {
    practicePath,
    practiceTitles: titlesFromPractice(practiceRows),
    interviewPath,
    interviewTitles,
  };
}

const LAB_TARGETS: Record<string, PracticeLinkTarget> = {
  sql: makeTarget(SQL_ROUTES.practice, sqlPractice as PracticeRow[]),
  python: makeTarget(PYTHON_ROUTES.practice, pythonPractice as PracticeRow[]),
  spark: makeTarget(SPARK_ROUTES.practice, sparkPractice as PracticeRow[]),
  databricks: makeTarget(DATABRICKS_ROUTES.practice, databricksPractice as PracticeRow[]),
  airflow: makeTarget(AIRFLOW_ROUTES.practice, airflowPractice as PracticeRow[]),
  cloud: makeTarget(CLOUD_ROUTES.practice, cloudPractice as PracticeRow[]),
  "system-design": makeTarget(
    SYSTEM_DESIGN_ROUTES.practice,
    systemDesignPractice as PracticeRow[],
    SYSTEM_DESIGN_ROUTES.interview,
    loadInterviewTitles("system-design-interview")
  ),
  "interview-prep": makeTarget(
    INTERVIEW_PREP_ROUTES.practice,
    interviewPrepPractice as PracticeRow[]
  ),
};

const CROSS_LAB_TARGETS: Record<string, PracticeLinkTarget> = {
  sql: LAB_TARGETS.sql,
  python: LAB_TARGETS.python,
  spark: LAB_TARGETS.spark,
  databricks: LAB_TARGETS.databricks,
  airflow: LAB_TARGETS.airflow,
  cloud: LAB_TARGETS.cloud,
  "system-design": LAB_TARGETS["system-design"],
};

export function getPracticeLinkConfig(labId: PracticeLabId): PracticeLinkConfig {
  const base = LAB_TARGETS[labId];

  if (labId === "interview-prep") {
    return {
      ...base,
      labs: CROSS_LAB_TARGETS,
      starDrillPath: INTERVIEW_PREP_ROUTES.practice,
      starDrillTitles: titlesFromPractice(interviewPrepPractice as PracticeRow[]),
    };
  }

  return {
    ...base,
    labs: labId === "system-design" ? undefined : CROSS_LAB_TARGETS,
  };
}

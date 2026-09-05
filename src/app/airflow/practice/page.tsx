import type { Metadata } from "next";
import { Suspense } from "react";
import { getAirflowPracticeQuestions } from "@/lib/airflow-practice";
import { AirflowPracticeWorkspace } from "@/components/airflow/airflow-practice-workspace";
import { AirflowVisitTracker } from "@/components/airflow/airflow-visit-tracker";

export const metadata: Metadata = {
  title: "Airflow Practice",
  description: "25 Airflow DAG and orchestration practice problems",
};

export default function AirflowPracticePage() {
  const questions = getAirflowPracticeQuestions();

  return (
    <>
      <AirflowVisitTracker label="Airflow Practice" />
      <h1 className="sr-only">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <AirflowPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

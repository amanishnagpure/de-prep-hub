import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/airflow-interview";
import { AirflowInterviewFlashcards } from "@/components/airflow/airflow-interview-flashcards";
import { AirflowVisitTracker } from "@/components/airflow/airflow-visit-tracker";

export const metadata: Metadata = {
  title: "Airflow Interview",
  description: "40 Airflow flashcards for Data Engineering interviews",
};

export default function AirflowInterviewPage() {
  const topic = getTopicBySlug("airflow-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <AirflowVisitTracker label="Airflow Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <AirflowInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

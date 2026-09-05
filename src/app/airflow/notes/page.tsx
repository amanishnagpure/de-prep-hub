import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/airflow-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { AirflowNotesView } from "@/components/airflow/airflow-notes-view";
import { AirflowVisitTracker } from "@/components/airflow/airflow-visit-tracker";

export const metadata: Metadata = {
  title: "Airflow Notes",
  description: "Airflow 2.x reference for Data Engineering interviews",
};

export default function AirflowNotesPage() {
  const topic = getTopicBySlug("airflow-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("airflow")
  );

  return (
    <>
      <AirflowVisitTracker label="Airflow Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <AirflowNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

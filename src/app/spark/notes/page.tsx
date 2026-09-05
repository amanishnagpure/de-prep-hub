import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitSparkNotesChapters } from "@/lib/spark-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { SparkNotesView } from "@/components/spark/spark-notes-view";
import { SparkVisitTracker } from "@/components/spark/spark-visit-tracker";

export const metadata: Metadata = {
  title: "Spark Notes",
  description: "PySpark reference for Data Engineering interviews",
};

export default function SparkNotesPage() {
  const topic = getTopicBySlug("spark-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitSparkNotesChapters(topic.content),
    getPracticeLinkConfig("spark")
  );

  return (
    <>
      <SparkVisitTracker label="Spark Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SparkNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/databricks-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { DatabricksNotesView } from "@/components/databricks/databricks-notes-view";
import { DatabricksVisitTracker } from "@/components/databricks/databricks-visit-tracker";

export const metadata: Metadata = {
  title: "Databricks Notes",
  description: "Delta Lake, Unity Catalog, and lakehouse patterns for Data Engineering interviews",
};

export default function DatabricksNotesPage() {
  const topic = getTopicBySlug("databricks-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("databricks")
  );

  return (
    <>
      <DatabricksVisitTracker label="Databricks Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <DatabricksNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

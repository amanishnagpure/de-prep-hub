import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/cloud-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { CloudNotesView } from "@/components/cloud/cloud-notes-view";
import { CloudVisitTracker } from "@/components/cloud/cloud-visit-tracker";

export const metadata: Metadata = {
  title: "Cloud Notes",
  description: "Azure Data Factory, ADLS Gen2, and Synapse reference for Data Engineering interviews",
};

export default function CloudNotesPage() {
  const topic = getTopicBySlug("cloud-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("cloud")
  );

  return (
    <>
      <CloudVisitTracker label="Cloud Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <CloudNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

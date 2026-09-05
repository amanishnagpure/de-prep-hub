import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/sql-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { SqlNotesView } from "@/components/sql/sql-notes-view";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Notes",
  description: "SQL reference for Data Engineering interviews",
};

export default function SqlNotesPage() {
  const topic = getTopicBySlug("sql-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("sql")
  );

  return (
    <>
      <SqlVisitTracker label="SQL Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SqlNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/python-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { PythonNotesView } from "@/components/python/python-notes-view";
import { PythonVisitTracker } from "@/components/python/python-visit-tracker";

export const metadata: Metadata = {
  title: "Python Notes",
  description: "Python and pandas reference for Data Engineering interviews",
};

export default function PythonNotesPage() {
  const topic = getTopicBySlug("python-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("python")
  );

  return (
    <>
      <PythonVisitTracker label="Python Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PythonNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

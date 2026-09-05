import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/system-design-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { SystemDesignNotesView } from "@/components/system-design/system-design-notes-view";
import { SystemDesignVisitTracker } from "@/components/system-design/system-design-visit-tracker";

export const metadata: Metadata = {
  title: "System Design Notes",
  description: "Data engineering architecture reference — batch, streaming, CDC, lakehouse, medallion.",
};

export default function SystemDesignNotesPage() {
  const topic = getTopicBySlug("system-design-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("system-design")
  );

  return (
    <>
      <SystemDesignVisitTracker label="System Design Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SystemDesignNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

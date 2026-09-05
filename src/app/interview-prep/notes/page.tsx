import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { splitNotesChapters } from "@/lib/interview-prep-notes";
import { withPracticeLinks } from "@/lib/linkify-practice-refs";
import { getPracticeLinkConfig } from "@/lib/practice-link-config";
import { InterviewPrepNotesView } from "@/components/interview-prep/interview-prep-notes-view";
import { InterviewPrepVisitTracker } from "@/components/interview-prep/interview-prep-visit-tracker";

export const metadata: Metadata = {
  title: "Interview Notes",
  description: "Behavioral, technical roundup, resume, negotiation, and traps for DE interviews",
};

export default function InterviewPrepNotesPage() {
  const topic = getTopicBySlug("interview-notes");
  if (!topic) notFound();

  const chapters = withPracticeLinks(
    splitNotesChapters(topic.content),
    getPracticeLinkConfig("interview-prep")
  );

  return (
    <>
      <InterviewPrepVisitTracker label="Interview Notes" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Notes</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <InterviewPrepNotesView chapters={chapters} />
      </Suspense>
    </>
  );
}

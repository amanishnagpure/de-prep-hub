import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/cloud-interview";
import { CloudInterviewFlashcards } from "@/components/cloud/cloud-interview-flashcards";
import { CloudVisitTracker } from "@/components/cloud/cloud-visit-tracker";

export const metadata: Metadata = {
  title: "Cloud Interview",
  description: "50 Azure Data Engineering flashcards for interviews",
};

export default function CloudInterviewPage() {
  const topic = getTopicBySlug("cloud-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <CloudVisitTracker label="Cloud Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <CloudInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

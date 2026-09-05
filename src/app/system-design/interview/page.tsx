import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/system-design-interview";
import { SystemDesignInterviewFlashcards } from "@/components/system-design/system-design-interview-flashcards";
import { SystemDesignVisitTracker } from "@/components/system-design/system-design-visit-tracker";

export const metadata: Metadata = {
  title: "System Design Interview",
  description: "40 data engineering system design interview cases with sample answers.",
};

export default function SystemDesignInterviewPage() {
  const topic = getTopicBySlug("system-design-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <SystemDesignVisitTracker label="System Design Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SystemDesignInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

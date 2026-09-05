import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/interview-prep-interview";
import { InterviewPrepInterviewFlashcards } from "@/components/interview-prep/interview-prep-interview-flashcards";
import { InterviewPrepVisitTracker } from "@/components/interview-prep/interview-prep-visit-tracker";

export const metadata: Metadata = {
  title: "Interview Flashcards",
  description: "60 flashcards for behavioral, technical, and DE role interviews",
};

export default function InterviewPrepInterviewPage() {
  const topic = getTopicBySlug("interview-flashcards");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <InterviewPrepVisitTracker label="Interview Flashcards" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Flashcards</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <InterviewPrepInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

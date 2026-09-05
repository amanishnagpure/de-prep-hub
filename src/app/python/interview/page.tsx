import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/python-interview";
import { PythonInterviewFlashcards } from "@/components/python/python-interview-flashcards";
import { PythonVisitTracker } from "@/components/python/python-visit-tracker";

export const metadata: Metadata = {
  title: "Python Interview",
  description: "60 Python flashcards for Data Engineering interviews",
};

export default function PythonInterviewPage() {
  const topic = getTopicBySlug("python-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <PythonVisitTracker label="Python Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PythonInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

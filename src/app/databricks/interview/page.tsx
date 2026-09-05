import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/databricks-interview";
import { DatabricksInterviewFlashcards } from "@/components/databricks/databricks-interview-flashcards";
import { DatabricksVisitTracker } from "@/components/databricks/databricks-visit-tracker";

export const metadata: Metadata = {
  title: "Databricks Interview",
  description: "45 Databricks and Delta Lake flashcards for Data Engineering interviews",
};

export default function DatabricksInterviewPage() {
  const topic = getTopicBySlug("databricks-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <DatabricksVisitTracker label="Databricks Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <DatabricksInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

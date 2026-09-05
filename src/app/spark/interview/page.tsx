import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/spark-interview";
import { SparkInterviewFlashcards } from "@/components/spark/spark-interview-flashcards";
import { SparkVisitTracker } from "@/components/spark/spark-visit-tracker";

export const metadata: Metadata = {
  title: "PySpark Interview Questions",
  description: "100 interview-ready PySpark answers for Data Engineering interviews",
};

export default function SparkInterviewPage() {
  const topic = getTopicBySlug("spark-interview");
  if (!topic) notFound();

  const questions = parseInterviewQuestions(topic.content);

  return (
    <>
      <SparkVisitTracker label="Spark Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview Questions</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SparkInterviewFlashcards questions={questions} />
      </Suspense>
    </>
  );
}

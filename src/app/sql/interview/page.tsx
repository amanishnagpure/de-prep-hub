import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/sql-interview";
import { SqlInterviewFlashcards } from "@/components/sql/sql-interview-flashcards";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Interview Q&A",
  description: "69 SQL interview flashcards",
};

export default function SqlInterviewPage() {
  const topic = getTopicBySlug("sql-interview");
  if (!topic) notFound();

  const interviewQuestions = parseInterviewQuestions(topic.content);

  return (
    <>
      <SqlVisitTracker label="SQL Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Interview</h1>
      <SqlInterviewFlashcards questions={interviewQuestions} />
    </>
  );
}

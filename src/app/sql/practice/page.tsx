import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTopicBySlug } from "@/lib/content";
import { getSqlPracticeQuestions } from "@/lib/sql-practice";
import { SqlPracticeTabs } from "@/components/sql/sql-practice-tabs";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Practice",
  description: "150 SQL coding problems with editor, schema panel, and playground",
};

export default function SqlPracticePage() {
  const topic = getTopicBySlug("sql-practice");
  if (!topic) notFound();

  const questions = getSqlPracticeQuestions();

  return (
    <>
      <SqlVisitTracker label="SQL Practice" />
      <h1 className="sr-only">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SqlPracticeTabs questions={questions} />
      </Suspense>
    </>
  );
}

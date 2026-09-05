import type { Metadata } from "next";
import { Suspense } from "react";
import { getDatabricksPracticeQuestions } from "@/lib/databricks-practice";
import { DatabricksPracticeWorkspace } from "@/components/databricks/databricks-practice-workspace";
import { DatabricksVisitTracker } from "@/components/databricks/databricks-visit-tracker";

export const metadata: Metadata = {
  title: "Databricks Practice",
  description: "25 Delta Lake and lakehouse practice problems",
};

export default function DatabricksPracticePage() {
  const questions = getDatabricksPracticeQuestions();

  return (
    <>
      <DatabricksVisitTracker label="Databricks Practice" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <DatabricksPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { getSparkPracticeQuestions } from "@/lib/spark-practice";
import { SparkPracticeWorkspace } from "@/components/spark/spark-practice-workspace";
import { SparkVisitTracker } from "@/components/spark/spark-visit-tracker";

export const metadata: Metadata = {
  title: "PySpark Coding Practice",
  description: "150 PySpark coding problems for Data Engineering interviews",
};

export default function SparkPracticePage() {
  const questions = getSparkPracticeQuestions();

  return (
    <>
      <SparkVisitTracker label="Spark Practice" />
      <h1 className="sr-only">Coding Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SparkPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

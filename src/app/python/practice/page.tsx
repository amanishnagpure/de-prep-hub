import type { Metadata } from "next";
import { Suspense } from "react";
import { getPythonPracticeQuestions } from "@/lib/python-practice";
import { PythonPracticeWorkspace } from "@/components/python/python-practice-workspace";
import { PythonVisitTracker } from "@/components/python/python-visit-tracker";

export const metadata: Metadata = {
  title: "Python Practice",
  description: "40 Python and pandas practice problems",
};

export default function PythonPracticePage() {
  const questions = getPythonPracticeQuestions();

  return (
    <>
      <PythonVisitTracker label="Python Practice" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <PythonPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

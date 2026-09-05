import type { Metadata } from "next";
import { Suspense } from "react";
import { getSystemDesignPracticeQuestions } from "@/lib/system-design-practice";
import { SystemDesignPracticeWorkspace } from "@/components/system-design/system-design-practice-workspace";
import { SystemDesignVisitTracker } from "@/components/system-design/system-design-visit-tracker";

export const metadata: Metadata = {
  title: "System Design Practice",
  description: "20 data engineering architecture design scenarios with sample solutions.",
};

export default function SystemDesignPracticePage() {
  const questions = getSystemDesignPracticeQuestions();

  return (
    <>
      <SystemDesignVisitTracker label="System Design Practice" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <SystemDesignPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

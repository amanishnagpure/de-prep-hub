import type { Metadata } from "next";
import { Suspense } from "react";
import { getCloudPracticeQuestions } from "@/lib/cloud-practice";
import { CloudPracticeWorkspace } from "@/components/cloud/cloud-practice-workspace";
import { CloudVisitTracker } from "@/components/cloud/cloud-visit-tracker";

export const metadata: Metadata = {
  title: "Cloud Practice",
  description: "25 Azure Data Engineering scenario problems",
};

export default function CloudPracticePage() {
  const questions = getCloudPracticeQuestions();

  return (
    <>
      <CloudVisitTracker label="Cloud Practice" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Practice</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <CloudPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

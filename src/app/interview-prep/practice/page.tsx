import type { Metadata } from "next";
import { Suspense } from "react";
import { getInterviewPrepPracticeQuestions } from "@/lib/interview-prep-practice";
import { InterviewPrepPracticeWorkspace } from "@/components/interview-prep/interview-prep-practice-workspace";
import { InterviewPrepVisitTracker } from "@/components/interview-prep/interview-prep-visit-tracker";

export const metadata: Metadata = {
  title: "STAR Drills",
  description: "20 behavioral STAR practice prompts for Data Engineering interviews",
};

export default function InterviewPrepPracticePage() {
  const questions = getInterviewPrepPracticeQuestions();

  return (
    <>
      <InterviewPrepVisitTracker label="STAR Drills" />
      <h1 className="sr-only">STAR Drills</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <InterviewPrepPracticeWorkspace questions={questions} />
      </Suspense>
    </>
  );
}

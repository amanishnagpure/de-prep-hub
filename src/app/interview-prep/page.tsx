import type { Metadata } from "next";
import { InterviewPrepDashboard } from "@/components/interview-prep/interview-prep-dashboard";
import { InterviewPrepVisitTracker } from "@/components/interview-prep/interview-prep-visit-tracker";

export const metadata: Metadata = {
  title: "Interview Hub",
  description: "Behavioral prep, STAR drills, and DE interview flashcards.",
};

export default function InterviewPrepHomePage() {
  return (
    <>
      <InterviewPrepVisitTracker label="Interview Hub Overview" />
      <InterviewPrepDashboard />
    </>
  );
}

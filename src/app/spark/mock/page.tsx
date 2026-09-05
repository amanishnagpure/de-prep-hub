import type { Metadata } from "next";
import { getTopicBySlug } from "@/lib/content";
import { parseInterviewQuestions } from "@/lib/spark-interview";
import { getSparkPracticeQuestions } from "@/lib/spark-practice";
import { SparkMockInterview } from "@/components/spark/spark-mock-interview";
import { SparkVisitTracker } from "@/components/spark/spark-visit-tracker";

export const metadata: Metadata = {
  title: "PySpark Mock Interview",
  description: "45-minute timed PySpark mock interview — conceptual and coding problems",
};

export default function SparkMockPage() {
  const interviewTopic = getTopicBySlug("spark-interview");
  const pools = {
    interview: interviewTopic ? parseInterviewQuestions(interviewTopic.content) : [],
    practice: getSparkPracticeQuestions(),
  };

  return (
    <>
      <SparkVisitTracker label="PySpark Mock Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Mock Interview</h1>
      <SparkMockInterview pools={pools} />
    </>
  );
}

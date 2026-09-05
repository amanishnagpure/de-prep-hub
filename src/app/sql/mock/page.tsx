import type { Metadata } from "next";
import { getTopicBySlug } from "@/lib/content";
import { getLeetCodeSqlProblems } from "@/lib/leetcode-sql";
import { parseInterviewQuestions } from "@/lib/sql-interview";
import { getSqlPracticeQuestions } from "@/lib/sql-practice";
import { SqlMockInterview } from "@/components/sql/sql-mock-interview";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Mock Interview",
  description: "45-minute timed SQL mock interview — conceptual, LeetCode, and coding problems",
};

export default function SqlMockPage() {
  const interviewTopic = getTopicBySlug("sql-interview");
  const pools = {
    interview: interviewTopic ? parseInterviewQuestions(interviewTopic.content) : [],
    leetcode: getLeetCodeSqlProblems(),
    practice: getSqlPracticeQuestions(),
  };

  return (
    <>
      <SqlVisitTracker label="SQL Mock Interview" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Mock</h1>
      <SqlMockInterview pools={pools} />
    </>
  );
}

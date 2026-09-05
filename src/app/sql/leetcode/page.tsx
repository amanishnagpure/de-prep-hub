import type { Metadata } from "next";
import { Suspense } from "react";
import { getLeetCodeSqlProblems } from "@/lib/leetcode-sql";
import { SqlLeetCodeTrack } from "@/components/sql/sql-leetcode-track";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "LeetCode SQL Top 50",
  description: "Curated top 50 LeetCode SQL problems",
};

interface SqlLeetCodePageProps {
  searchParams: Promise<{ pattern?: string; review?: string }>;
}

function LeetCodeTrackLoader({
  initialPattern,
  initialReview,
}: {
  initialPattern?: string;
  initialReview?: boolean;
}) {
  const problems = getLeetCodeSqlProblems();
  return (
    <SqlLeetCodeTrack
      problems={problems}
      initialPattern={initialPattern}
      initialReview={initialReview}
    />
  );
}

export default async function SqlLeetCodePage({ searchParams }: SqlLeetCodePageProps) {
  const params = await searchParams;

  return (
    <>
      <SqlVisitTracker label="LeetCode SQL" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">LeetCode</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <LeetCodeTrackLoader
          initialPattern={params.pattern}
          initialReview={params.review === "1"}
        />
      </Suspense>
    </>
  );
}

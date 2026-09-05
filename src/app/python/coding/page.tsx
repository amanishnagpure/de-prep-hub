import type { Metadata } from "next";
import { Suspense } from "react";
import { getPythonCodingProblems } from "@/lib/python-coding";
import { PythonCodingTrack } from "@/components/python/python-coding-track";
import { PythonVisitTracker } from "@/components/python/python-visit-tracker";

export const metadata: Metadata = {
  title: "Python Coding Track",
  description: "15 curated LeetCode-style Python problems for DE interviews",
};

interface PythonCodingPageProps {
  searchParams: Promise<{ pattern?: string; review?: string }>;
}

function CodingTrackLoader({
  initialPattern,
  initialReview,
}: {
  initialPattern?: string;
  initialReview?: boolean;
}) {
  const problems = getPythonCodingProblems();
  return (
    <PythonCodingTrack
      problems={problems}
      initialPattern={initialPattern}
      initialReview={initialReview}
    />
  );
}

export default async function PythonCodingPage({ searchParams }: PythonCodingPageProps) {
  const params = await searchParams;

  return (
    <>
      <PythonVisitTracker label="Python Coding" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Coding</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <CodingTrackLoader
          initialPattern={params.pattern}
          initialReview={params.review === "1"}
        />
      </Suspense>
    </>
  );
}

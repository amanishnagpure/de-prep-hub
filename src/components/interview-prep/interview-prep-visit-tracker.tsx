"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordInterviewPrepVisit } from "@/lib/interview-prep-progress";

interface InterviewPrepVisitTrackerProps {
  label: string;
}

export function InterviewPrepVisitTracker({ label }: InterviewPrepVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordInterviewPrepVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

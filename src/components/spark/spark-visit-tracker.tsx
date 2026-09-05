"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordSparkVisit } from "@/lib/spark-progress";

interface SparkVisitTrackerProps {
  label: string;
}

export function SparkVisitTracker({ label }: SparkVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordSparkVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

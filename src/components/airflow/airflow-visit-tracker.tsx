"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordAirflowVisit } from "@/lib/airflow-progress";

interface AirflowVisitTrackerProps {
  label: string;
}

export function AirflowVisitTracker({ label }: AirflowVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordAirflowVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

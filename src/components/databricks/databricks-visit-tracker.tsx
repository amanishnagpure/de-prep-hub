"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordDatabricksVisit } from "@/lib/databricks-progress";

interface DatabricksVisitTrackerProps {
  label: string;
}

export function DatabricksVisitTracker({ label }: DatabricksVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordDatabricksVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

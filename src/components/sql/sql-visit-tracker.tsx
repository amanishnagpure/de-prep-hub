"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordSqlVisit } from "@/lib/sql-progress";

interface SqlVisitTrackerProps {
  label: string;
}

export function SqlVisitTracker({ label }: SqlVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordSqlVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

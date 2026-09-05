"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordPythonVisit } from "@/lib/python-progress";

interface PythonVisitTrackerProps {
  label: string;
}

export function PythonVisitTracker({ label }: PythonVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordPythonVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

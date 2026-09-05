"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordCloudVisit } from "@/lib/cloud-progress";

interface CloudVisitTrackerProps {
  label: string;
}

export function CloudVisitTracker({ label }: CloudVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordCloudVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

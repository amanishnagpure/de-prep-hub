"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { recordSystemDesignVisit } from "@/lib/system-design-progress";

interface SystemDesignVisitTrackerProps {
  label: string;
}

export function SystemDesignVisitTracker({ label }: SystemDesignVisitTrackerProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    recordSystemDesignVisit(pathname, label);
  }, [pathname, label]);

  return null;
}

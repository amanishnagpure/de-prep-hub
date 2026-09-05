import type { Metadata } from "next";
import { SqlDashboard } from "@/components/sql/sql-dashboard";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Lab",
  description: "Muscle memory for JOINs.",
};

export default function SqlHomePage() {
  return (
    <>
      <SqlVisitTracker label="SQL Overview" />
      <SqlDashboard />
    </>
  );
}

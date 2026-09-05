import type { Metadata } from "next";
import { DatabricksDashboard } from "@/components/databricks/databricks-dashboard";
import { DatabricksVisitTracker } from "@/components/databricks/databricks-visit-tracker";

export const metadata: Metadata = {
  title: "Databricks Lab",
  description: "Delta Lake, Unity Catalog, and Databricks workflows for DE interviews.",
};

export default function DatabricksHomePage() {
  return (
    <>
      <DatabricksVisitTracker label="Databricks Overview" />
      <DatabricksDashboard />
    </>
  );
}

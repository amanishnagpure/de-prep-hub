import type { Metadata } from "next";
import { CloudDashboard } from "@/components/cloud/cloud-dashboard";
import { CloudVisitTracker } from "@/components/cloud/cloud-visit-tracker";

export const metadata: Metadata = {
  title: "Cloud Lab",
  description: "Azure Data Factory, ADLS Gen2, Synapse — pipelines and patterns.",
};

export default function CloudHomePage() {
  return (
    <>
      <CloudVisitTracker label="Cloud Overview" />
      <CloudDashboard />
    </>
  );
}

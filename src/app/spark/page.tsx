import type { Metadata } from "next";
import { SparkDashboard } from "@/components/spark/spark-dashboard";
import { SparkVisitTracker } from "@/components/spark/spark-visit-tracker";

export const metadata: Metadata = {
  title: "Spark Lab",
  description: "PySpark, partitions, optimization.",
};

export default function SparkHomePage() {
  return (
    <>
      <SparkVisitTracker label="Spark Overview" />
      <SparkDashboard />
    </>
  );
}

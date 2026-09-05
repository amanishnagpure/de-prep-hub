import type { Metadata } from "next";
import { AirflowDashboard } from "@/components/airflow/airflow-dashboard";
import { AirflowVisitTracker } from "@/components/airflow/airflow-visit-tracker";

export const metadata: Metadata = {
  title: "Airflow Lab",
  description: "DAGs, operators, scheduling, and production patterns for Airflow 2.x.",
};

export default function AirflowHomePage() {
  return (
    <>
      <AirflowVisitTracker label="Airflow Overview" />
      <AirflowDashboard />
    </>
  );
}

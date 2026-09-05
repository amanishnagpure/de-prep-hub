import type { Metadata } from "next";
import { PythonDashboard } from "@/components/python/python-dashboard";
import { PythonVisitTracker } from "@/components/python/python-visit-tracker";

export const metadata: Metadata = {
  title: "Python Lab",
  description: "pandas, pipelines, patterns.",
};

export default function PythonHomePage() {
  return (
    <>
      <PythonVisitTracker label="Python Overview" />
      <PythonDashboard />
    </>
  );
}

import type { Metadata } from "next";
import { SqlPlaygroundPanel } from "@/components/sql/sql-query-runner";
import { SqlVisitTracker } from "@/components/sql/sql-visit-tracker";

export const metadata: Metadata = {
  title: "SQL Playground",
  description: "Run SELECT queries on sample employees, orders, and customers data in-browser",
};

export default function SqlPlaygroundPage() {
  return (
    <>
      <SqlVisitTracker label="SQL Playground" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Playground</h1>
      <SqlPlaygroundPanel />
    </>
  );
}

import type { Metadata } from "next";
import { SystemDesignDashboard } from "@/components/system-design/system-design-dashboard";
import { SystemDesignVisitTracker } from "@/components/system-design/system-design-visit-tracker";

export const metadata: Metadata = {
  title: "System Design Lab",
  description: "Batch, streaming, Kafka, CDC, lakehouse, and medallion architecture for DE interviews.",
};

export default function SystemDesignHomePage() {
  return (
    <>
      <SystemDesignVisitTracker label="System Design Overview" />
      <SystemDesignDashboard />
    </>
  );
}

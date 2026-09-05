import { PageHeader } from "@/components/page-header";
import { StudySchedulePlanner } from "@/components/schedule/study-schedule-planner";
import { SiteContainer } from "@/components/site-container";

export const metadata = {
  title: "Study Schedule",
  description: "Plan selected topics across a date range and track daily goals.",
};

export default function SchedulePage() {
  return (
    <SiteContainer className="py-10 sm:py-14">
      <PageHeader
        title="Study schedule"
        description="Select topics, pick a start and end date, and spread the work across your calendar."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Schedule" },
        ]}
      />
      <div className="mt-10">
        <StudySchedulePlanner />
      </div>
    </SiteContainer>
  );
}

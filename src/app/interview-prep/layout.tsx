import { InterviewPrepSidebar } from "@/components/interview-prep/interview-prep-sidebar";
import { Suspense } from "react";

export default function InterviewPrepLayout({ children }: LayoutProps<"/interview-prep">) {
  return (
    <div className="interview-prep-section">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Suspense fallback={null}>
          <InterviewPrepSidebar />
        </Suspense>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

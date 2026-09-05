import { SystemDesignSidebar } from "@/components/system-design/system-design-sidebar";
import { Suspense } from "react";

export default function SystemDesignLayout({ children }: LayoutProps<"/system-design">) {
  return (
    <div className="system-design-section">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Suspense fallback={null}>
          <SystemDesignSidebar />
        </Suspense>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

import { CloudSidebar } from "@/components/cloud/cloud-sidebar";
import { Suspense } from "react";

export default function CloudLayout({ children }: LayoutProps<"/cloud">) {
  return (
    <div className="cloud-section">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Suspense fallback={null}>
          <CloudSidebar />
        </Suspense>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

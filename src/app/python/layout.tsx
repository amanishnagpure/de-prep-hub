import { PythonSidebar } from "@/components/python/python-sidebar";
import { SiteContainer } from "@/components/site-container";
import { Suspense } from "react";

export default function PythonLayout({ children }: LayoutProps<"/python">) {
  return (
    <div className="python-section">
      <SiteContainer wide className="flex flex-col lg:flex-row lg:gap-0">
        <Suspense fallback={null}>
          <PythonSidebar />
        </Suspense>
        <main className="min-w-0 flex-1 py-6 sm:py-8 lg:py-10 lg:pl-6">{children}</main>
      </SiteContainer>
    </div>
  );
}

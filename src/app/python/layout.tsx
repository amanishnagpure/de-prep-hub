import { PythonSidebar } from "@/components/python/python-sidebar";
import { Suspense } from "react";

export default function PythonLayout({ children }: LayoutProps<"/python">) {
  return (
    <div className="python-section">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Suspense fallback={null}>
          <PythonSidebar />
        </Suspense>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

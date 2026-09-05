import { SqlSidebar } from "@/components/sql/sql-sidebar";
import { SqlDialectBar } from "@/components/sql/sql-dialect-bar";
import { SiteContainer } from "@/components/site-container";
import { Suspense } from "react";

export default function SqlLayout({ children }: LayoutProps<"/sql">) {
  return (
    <div className="sql-section">
      <SiteContainer wide className="flex flex-col lg:flex-row lg:gap-0">
        <Suspense fallback={null}>
          <SqlSidebar />
        </Suspense>
        <main className="min-w-0 flex-1 py-6 sm:py-8 lg:py-10 lg:pl-6">
          <SqlDialectBar />
          {children}
        </main>
      </SiteContainer>
    </div>
  );
}

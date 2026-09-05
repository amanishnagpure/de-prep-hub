import { SqlSidebar } from "@/components/sql/sql-sidebar";
import { SqlDialectBar } from "@/components/sql/sql-dialect-bar";
import { Suspense } from "react";

export default function SqlLayout({ children }: LayoutProps<"/sql">) {
  return (
    <div className="sql-section">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <Suspense fallback={null}>
          <SqlSidebar />
        </Suspense>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <SqlDialectBar />
          {children}
        </div>
      </div>
    </div>
  );
}

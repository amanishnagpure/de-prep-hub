import { HomeLabNav, LAB_NAV_ITEMS } from "@/components/home/home-lab-nav";
import { SiteContainer } from "@/components/site-container";

export default function LabsPage() {
  return (
    <SiteContainer className="py-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Section 2</p>
        <h1 className="mt-1 text-3xl font-semibold">Labs</h1>
        <p className="mt-3 text-muted-foreground">
          Structured notes, drills, and interview prep per technology — SQL, Python, Spark,
          Databricks, Airflow, Cloud, System Design, and more.
        </p>
      </div>
      <HomeLabNav className="mt-8 max-w-xl" />
      <p className="mt-6 text-sm text-muted-foreground">
        {LAB_NAV_ITEMS.length} lab modules · progress syncs via export/import on the home page
      </p>
    </SiteContainer>
  );
}

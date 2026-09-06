import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Database,
  Layers,
  MessageSquare,
  Network,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import { SiteContainer } from "@/components/site-container";
import { buttonVariants } from "@/components/ui/button";
import { platformIdentity } from "@/design";
import { cn } from "cn";

const TRACKS = [
  { href: "/sql", label: "SQL", icon: Database, description: "Queries, modeling, analytics" },
  { href: "/python", label: "Python", icon: Terminal, description: "Data processing fundamentals" },
  { href: "/spark", label: "PySpark", icon: Sparkles, description: "Distributed data engineering" },
  { href: "/code/dsa", label: "DSA", icon: BookOpen, description: "Core structures for interviews" },
  { href: "/databricks", label: "Databricks", icon: Layers, description: "Delta Lake, Unity Catalog, lakehouse" },
  { href: "/airflow", label: "Airflow", icon: Workflow, description: "DAGs, scheduling, orchestration" },
  { href: "/cloud", label: "Cloud", icon: Cloud, description: "Azure pipelines and cloud patterns" },
  {
    href: "/system-design",
    label: "System design",
    icon: Network,
    description: "Architecture for batch, streaming, and lakehouse",
  },
  {
    href: "/interview-prep",
    label: "Interview prep",
    icon: MessageSquare,
    description: "Behavioral prep, STAR drills, flashcards",
  },
] as const;

export default function LearnPage() {
  return (
    <SiteContainer className="py-[var(--space-page)]">
      <div className="max-w-2xl">
        <p className="type-meta font-medium uppercase tracking-widest text-muted-foreground">
          Learn
        </p>
        <h1 className="type-page-title mt-3 text-foreground">Structured progression</h1>
        <p className="type-body mt-4 text-muted-foreground">
          Notes, concepts, and guided paths — separate from hands-on practice problems and
          production-style challenges.
        </p>
      </div>

      <div className="platform-divider mt-[var(--space-section)]" />

      <section className="mt-[var(--space-section)]">
        <h2 className="type-section text-foreground">Tracks</h2>
        <ul className="mt-6 divide-y divide-border">
          {TRACKS.map(({ href, label, icon: Icon, description }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 py-5 transition-colors duration-[var(--motion-fast)] hover:bg-muted/30"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="type-meta mt-0.5 block text-muted-foreground">{description}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-[var(--space-section)]">
        <Link
          href="/labs"
          className={cn(buttonVariants({ variant: "outline" }), "type-body")}
        >
          Browse all labs
        </Link>
        <Link href="/roadmap" className={cn(buttonVariants({ variant: "ghost" }), "ml-2 type-body")}>
          View roadmap
        </Link>
      </section>

      <p className="type-meta mt-12 text-muted-foreground">
        {platformIdentity.description}
      </p>
    </SiteContainer>
  );
}

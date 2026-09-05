import Link from "next/link";
import {
  Cloud,
  Code2,
  Database,
  Layers,
  MessageSquare,
  Network,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

export type LabNavItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  ring: string;
};

export const LAB_NAV_ITEMS: LabNavItem[] = [
  {
    key: "sql",
    label: "SQL",
    href: "/sql",
    icon: Database,
    accent: "from-sky-500/20 to-blue-500/5 text-sky-400",
    ring: "ring-sky-500/20 group-hover:border-sky-500/40",
  },
  {
    key: "python",
    label: "Python",
    href: "/python",
    icon: Code2,
    accent: "from-amber-500/20 to-yellow-500/5 text-amber-400",
    ring: "ring-amber-500/20 group-hover:border-amber-500/40",
  },
  {
    key: "spark",
    label: "Spark",
    href: "/spark",
    icon: Zap,
    accent: "from-orange-500/20 to-red-500/5 text-orange-400",
    ring: "ring-orange-500/20 group-hover:border-orange-500/40",
  },
  {
    key: "databricks",
    label: "Databricks",
    href: "/databricks",
    icon: Layers,
    accent: "from-rose-500/20 to-red-500/5 text-rose-400",
    ring: "ring-rose-500/20 group-hover:border-rose-500/40",
  },
  {
    key: "airflow",
    label: "Airflow",
    href: "/airflow",
    icon: Workflow,
    accent: "from-emerald-500/20 to-green-500/5 text-emerald-400",
    ring: "ring-emerald-500/20 group-hover:border-emerald-500/40",
  },
  {
    key: "cloud",
    label: "Cloud",
    href: "/cloud",
    icon: Cloud,
    accent: "from-cyan-500/20 to-teal-500/5 text-cyan-400",
    ring: "ring-cyan-500/20 group-hover:border-cyan-500/40",
  },
  {
    key: "system-design",
    label: "System Design",
    href: "/system-design",
    icon: Network,
    accent: "from-violet-500/20 to-purple-500/5 text-violet-400",
    ring: "ring-violet-500/20 group-hover:border-violet-500/40",
  },
  {
    key: "interview",
    label: "Interview",
    href: "/interview-prep",
    icon: MessageSquare,
    accent: "from-fuchsia-500/20 to-pink-500/5 text-fuchsia-400",
    ring: "ring-fuchsia-500/20 group-hover:border-fuchsia-500/40",
  },
];

interface HomeLabNavProps {
  className?: string;
}

export function HomeLabNav({ className }: HomeLabNavProps) {
  return (
    <nav className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)} aria-label="Lab sections">
      {LAB_NAV_ITEMS.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-md",
              item.ring
            )}
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1",
                item.accent
              )}
            >
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="truncate text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                {item.label}
              </p>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

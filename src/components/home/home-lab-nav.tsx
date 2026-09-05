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
  tint: string;
};

export const LAB_NAV_ITEMS: LabNavItem[] = [
  {
    key: "sql",
    label: "SQL",
    href: "/sql",
    icon: Database,
    tint: "bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300",
  },
  {
    key: "python",
    label: "Python",
    href: "/python",
    icon: Code2,
    tint: "bg-amber-500/10 text-amber-800 ring-amber-500/20 dark:text-amber-300",
  },
  {
    key: "spark",
    label: "Spark",
    href: "/spark",
    icon: Zap,
    tint: "bg-orange-500/10 text-orange-800 ring-orange-500/20 dark:text-orange-300",
  },
  {
    key: "databricks",
    label: "Databricks",
    href: "/databricks",
    icon: Layers,
    tint: "bg-rose-500/10 text-rose-800 ring-rose-500/20 dark:text-rose-300",
  },
  {
    key: "airflow",
    label: "Airflow",
    href: "/airflow",
    icon: Workflow,
    tint: "bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-300",
  },
  {
    key: "cloud",
    label: "Cloud",
    href: "/cloud",
    icon: Cloud,
    tint: "bg-cyan-500/10 text-cyan-800 ring-cyan-500/20 dark:text-cyan-300",
  },
  {
    key: "system-design",
    label: "System design",
    href: "/system-design",
    icon: Network,
    tint: "bg-violet-500/10 text-violet-800 ring-violet-500/20 dark:text-violet-300",
  },
  {
    key: "interview",
    label: "Interview",
    href: "/interview-prep",
    icon: MessageSquare,
    tint: "bg-fuchsia-500/10 text-fuchsia-800 ring-fuchsia-500/20 dark:text-fuchsia-300",
  },
];

interface HomeLabNavProps {
  className?: string;
}

export function HomeLabNav({ className }: HomeLabNavProps) {
  return (
    <nav
      className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}
      aria-label="Lab sections"
    >
      {LAB_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="panel-interactive group flex items-center gap-3 p-4"
          >
            <div className={cn("icon-tile", item.tint)}>
              <Icon className="size-5" />
            </div>
            <span className="text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

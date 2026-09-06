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
};

export const LAB_NAV_ITEMS: LabNavItem[] = [
  { key: "sql", label: "SQL", href: "/sql", icon: Database },
  { key: "python", label: "Python", href: "/python", icon: Code2 },
  { key: "spark", label: "Spark", href: "/spark", icon: Zap },
  { key: "databricks", label: "Databricks", href: "/databricks", icon: Layers },
  { key: "airflow", label: "Airflow", href: "/airflow", icon: Workflow },
  { key: "cloud", label: "Cloud", href: "/cloud", icon: Cloud },
  { key: "system-design", label: "System design", href: "/system-design", icon: Network },
  { key: "interview", label: "Interview", href: "/interview-prep", icon: MessageSquare },
];

interface HomeLabNavProps {
  className?: string;
}

export function HomeLabNav({ className }: HomeLabNavProps) {
  return (
    <nav className={cn("panel overflow-hidden", className)} aria-label="Lab sections">
      {LAB_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href} className="lc-table-row group">
            <div className="icon-tile size-9">
              <Icon className="size-4" />
            </div>
            <span className="font-medium transition-colors group-hover:text-primary">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

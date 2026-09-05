"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Terminal,
  Workflow,
} from "lucide-react";
import { AIRFLOW_NOTES_SECTIONS, AIRFLOW_ROUTES } from "@/lib/airflow";
import { LabSidebarLink, LabMobileTab } from "@/components/lab/nav";
import { LabSidebarShell, useLabSidebarCollapse } from "@/components/lab/sidebar-shell";
import { cn } from "cn";

type NavIcon = React.ComponentType<{ className?: string }>;

interface NavChild {
  label: string;
  href: string;
  match?: (pathname: string, chapter: string | null) => boolean;
}

interface NavGroup {
  id: string;
  label: string;
  icon: NavIcon;
  href?: string;
  children?: NavChild[];
  match?: (pathname: string) => boolean;
}

const NAV: NavGroup[] = [
  {
    id: "notes",
    label: "Airflow Notes",
    icon: BookOpen,
    href: AIRFLOW_ROUTES.notes,
    match: (pathname) => pathname.startsWith(AIRFLOW_ROUTES.notes),
    children: AIRFLOW_NOTES_SECTIONS.map((section) => ({
      label: section.label,
      href: `${AIRFLOW_ROUTES.notes}?chapter=${section.id}`,
      match: (pathname, chapter) =>
        pathname.startsWith(AIRFLOW_ROUTES.notes) &&
        (chapter === section.id || (!chapter && section.id === "dags")),
    })),
  },
  {
    id: "practice",
    label: "Practice",
    icon: Terminal,
    href: AIRFLOW_ROUTES.practice,
    match: (pathname) => pathname.startsWith(AIRFLOW_ROUTES.practice),
  },
  {
    id: "interview",
    label: "Interview",
    icon: Brain,
    href: AIRFLOW_ROUTES.interview,
    match: (pathname) => pathname.startsWith(AIRFLOW_ROUTES.interview),
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: AIRFLOW_ROUTES.home,
    match: (pathname) => pathname === AIRFLOW_ROUTES.home,
  },
];

export function AirflowSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chapter = searchParams.get("chapter");
  const { collapsed, toggle } = useLabSidebarCollapse();

  const isChildActive = (child: NavChild) =>
    child.match ? child.match(pathname, chapter) : pathname === child.href;

  const mobileNav = (
    <>
      <LabMobileTab href={AIRFLOW_ROUTES.home} active={pathname === AIRFLOW_ROUTES.home}>
                Overview
              </LabMobileTab>
              {AIRFLOW_NOTES_SECTIONS.map((section) => (
                <Link
                  key={section.id}
                  href={`${AIRFLOW_ROUTES.notes}?chapter=${section.id}`}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(AIRFLOW_ROUTES.notes) && chapter === section.id
                      ? "bg-emerald-500/10 text-primary"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {section.label}
                </Link>
              ))}
              <LabMobileTab href={AIRFLOW_ROUTES.practice} active={pathname.startsWith(AIRFLOW_ROUTES.practice)}>
                Practice
              </LabMobileTab>
              <LabMobileTab href={AIRFLOW_ROUTES.interview} active={pathname.startsWith(AIRFLOW_ROUTES.interview)}>
                Interview
              </LabMobileTab>
    </>
  );

  return (
    <LabSidebarShell
      collapsed={collapsed}
      onToggleCollapse={toggle}
      mobileNav={mobileNav}
      header={<p className="text-xs font-medium text-muted-foreground">Airflow</p>}
    >
      {NAV.map((group) => {
              const groupActive = group.match?.(pathname) ?? false;
              const Icon = group.icon;

              return (
                <div key={group.id} className="space-y-0.5">
                  {group.href ? (
                    <LabSidebarLink
                      href={group.href}
                      active={groupActive && !(group.children?.some(isChildActive) ?? false)}
                      collapsed={collapsed}
                      icon={Icon}
                      label={group.label}
                    />
                  ) : null}

                  {!collapsed &&
                    group.children?.map((child) => (
                      <LabSidebarLink
                        key={child.href}
                        href={child.href}
                        active={isChildActive(child)}
                        collapsed={collapsed}
                        label={child.label}
                        nested
                      />
                    ))}
                </div>
              );
            })}
    </LabSidebarShell>
  );
}

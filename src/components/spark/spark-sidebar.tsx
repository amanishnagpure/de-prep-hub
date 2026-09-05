"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Terminal,
  Timer,
  Zap,
} from "lucide-react";
import { SPARK_NOTES_SECTIONS, SPARK_ROUTES } from "@/lib/spark";
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
    label: "PySpark Notes",
    icon: BookOpen,
    href: SPARK_ROUTES.notes,
    match: (pathname) => pathname.startsWith(SPARK_ROUTES.notes),
    children: SPARK_NOTES_SECTIONS.map((section) => ({
      label: section.label,
      href: `${SPARK_ROUTES.notes}?chapter=${section.id}`,
      match: (pathname, chapter) =>
        pathname.startsWith(SPARK_ROUTES.notes) &&
        (chapter === section.id || (!chapter && section.id === "basic")),
    })),
  },
  {
    id: "interview",
    label: "Interview Q&A",
    icon: Brain,
    href: SPARK_ROUTES.interview,
    match: (pathname) => pathname.startsWith(SPARK_ROUTES.interview),
  },
  {
    id: "practice",
    label: "Coding (150)",
    icon: Terminal,
    href: SPARK_ROUTES.practice,
    match: (pathname) => pathname.startsWith(SPARK_ROUTES.practice),
  },
  {
    id: "mock",
    label: "Mock",
    icon: Timer,
    href: SPARK_ROUTES.mock,
    match: (pathname) => pathname.startsWith(SPARK_ROUTES.mock),
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: SPARK_ROUTES.home,
    match: (pathname) => pathname === SPARK_ROUTES.home,
  },
];

export function SparkSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chapter = searchParams.get("chapter");
  const { collapsed, toggle } = useLabSidebarCollapse();

  const isChildActive = (child: NavChild) =>
    child.match ? child.match(pathname, chapter) : pathname === child.href;

  const mobileNav = (
    <>
      <LabMobileTab href={SPARK_ROUTES.home} active={pathname === SPARK_ROUTES.home}>
        Overview
      </LabMobileTab>
      {SPARK_NOTES_SECTIONS.map((section) => (
        <Link
          key={section.id}
          href={`${SPARK_ROUTES.notes}?chapter=${section.id}`}
          className={cn(
            "shrink-0 rounded-lg px-3 py-2 text-sm transition-all",
            pathname.startsWith(SPARK_ROUTES.notes) && chapter === section.id
              ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/20"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          {section.label}
        </Link>
      ))}
      <LabMobileTab href={SPARK_ROUTES.interview} active={pathname.startsWith(SPARK_ROUTES.interview)}>
        Interview
      </LabMobileTab>
      <LabMobileTab href={SPARK_ROUTES.practice} active={pathname.startsWith(SPARK_ROUTES.practice)}>
        Coding
      </LabMobileTab>
      <LabMobileTab href={SPARK_ROUTES.mock} active={pathname.startsWith(SPARK_ROUTES.mock)}>
        Mock
      </LabMobileTab>
    </>
  );

  return (
    <LabSidebarShell
      collapsed={collapsed}
      onToggleCollapse={toggle}
      mobileNav={mobileNav}
      header={
        <div className="flex items-center gap-2.5 px-1">
          <div className="icon-tile bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-300">
            <Zap className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Spark</span>
        </div>
      }
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

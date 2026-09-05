"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Timer,
  Zap,
} from "lucide-react";
import { SPARK_NOTES_SECTIONS, SPARK_ROUTES } from "@/lib/spark";
import { LabSidebarLink, LabMobileTab } from "@/components/lab/nav";
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
  const [collapsed, setCollapsed] = React.useState(false);

  const isChildActive = (child: NavChild) =>
    child.match ? child.match(pathname, chapter) : pathname === child.href;

  return (
    <>
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-card transition-all duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col p-4">
          {!collapsed && (
            <div className="mb-6 flex items-center gap-2.5">
              <div className="icon-tile bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-300">
                <Zap className="size-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Spark</span>
            </div>
          )}

          <nav className="space-y-1 overflow-y-auto">
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
          </nav>

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <nav className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3 lg:hidden">
        <LabMobileTab href={SPARK_ROUTES.home} active={pathname === SPARK_ROUTES.home}>
          Overview
        </LabMobileTab>
        {SPARK_NOTES_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`${SPARK_ROUTES.notes}?chapter=${section.id}`}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
              pathname.startsWith(SPARK_ROUTES.notes) && chapter === section.id
                ? "bg-muted font-medium text-foreground"
                : "bg-muted/50 text-muted-foreground"
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
      </nav>
    </>
  );
}

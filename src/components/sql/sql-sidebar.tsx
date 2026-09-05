"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
} from "lucide-react";
import { SQL_NOTES_SECTIONS, SQL_ROUTES } from "@/lib/sql";
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
    label: "SQL Notes",
    icon: BookOpen,
    href: SQL_ROUTES.notes,
    match: (pathname) => pathname.startsWith(SQL_ROUTES.notes),
    children: SQL_NOTES_SECTIONS.map((section) => ({
      label: section.label,
      href: `${SQL_ROUTES.notes}?chapter=${section.id}`,
      match: (pathname, chapter) =>
        pathname.startsWith(SQL_ROUTES.notes) &&
        (chapter === section.id || (!chapter && section.id === "basic")),
    })),
  },
  {
    id: "practice",
    label: "Practice",
    icon: Database,
    href: SQL_ROUTES.practice,
    match: (pathname) => pathname.startsWith(SQL_ROUTES.practice),
  },
  {
    id: "leetcode",
    label: "LeetCode",
    icon: Trophy,
    href: SQL_ROUTES.leetcode,
    match: (pathname) => pathname.startsWith(SQL_ROUTES.leetcode),
  },
  {
    id: "interview",
    label: "Interview",
    icon: Brain,
    href: SQL_ROUTES.interview,
    match: (pathname) =>
      pathname.startsWith(SQL_ROUTES.interview) || pathname.startsWith(SQL_ROUTES.mock),
    children: [
      {
        label: "Q&A",
        href: SQL_ROUTES.interview,
        match: (pathname) => pathname.startsWith(SQL_ROUTES.interview),
      },
      {
        label: "Mock",
        href: SQL_ROUTES.mock,
        match: (pathname) => pathname.startsWith(SQL_ROUTES.mock),
      },
    ],
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: SQL_ROUTES.home,
    match: (pathname) => pathname === SQL_ROUTES.home,
  },
];

export function SqlSidebar() {
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
            <p className="mb-6 text-xs font-medium text-muted-foreground">SQL</p>
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
        <LabMobileTab href={SQL_ROUTES.home} active={pathname === SQL_ROUTES.home}>
          Overview
        </LabMobileTab>
        {SQL_NOTES_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`${SQL_ROUTES.notes}?chapter=${section.id}`}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
              pathname.startsWith(SQL_ROUTES.notes) && chapter === section.id
                ? "bg-muted font-medium text-foreground"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {section.label}
          </Link>
        ))}
        <LabMobileTab href={SQL_ROUTES.practice} active={pathname.startsWith(SQL_ROUTES.practice)}>
          Practice
        </LabMobileTab>
        <LabMobileTab href={SQL_ROUTES.leetcode} active={pathname.startsWith(SQL_ROUTES.leetcode)}>
          LeetCode
        </LabMobileTab>
        <LabMobileTab href={SQL_ROUTES.interview} active={pathname.startsWith(SQL_ROUTES.interview)}>
          Interview
        </LabMobileTab>
        <LabMobileTab href={SQL_ROUTES.mock} active={pathname.startsWith(SQL_ROUTES.mock)}>
          Mock
        </LabMobileTab>
      </nav>
    </>
  );
}

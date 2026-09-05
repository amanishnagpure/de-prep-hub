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

function NavLink({
  href,
  active,
  collapsed,
  icon: Icon,
  label,
  nested,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon?: NavIcon;
  label: string;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors",
        nested ? "px-3 py-2" : "px-3 py-2.5",
        nested && "ml-6 border-l border-border/60 pl-4",
        active
          ? nested
            ? "text-cyan-500"
            : "bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/20"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        collapsed && !nested && "justify-center px-2"
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {!collapsed && label}
    </Link>
  );
}

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
          "hidden shrink-0 border-r border-border/70 bg-card/30 transition-all duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="sticky top-24 flex h-[calc(100vh-6rem)] flex-col p-4">
          <div className={cn("mb-6 flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
              <Database className="size-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-xs text-cyan-500">Drill daily.</p>
              </div>
            )}
          </div>

          <nav className="space-y-1 overflow-y-auto">
            {NAV.map((group) => {
              const groupActive = group.match?.(pathname) ?? false;
              const Icon = group.icon;

              return (
                <div key={group.id} className="space-y-0.5">
                  {group.href ? (
                    <NavLink
                      href={group.href}
                      active={groupActive && !(group.children?.some(isChildActive) ?? false)}
                      collapsed={collapsed}
                      icon={Icon}
                      label={group.label}
                    />
                  ) : null}

                  {!collapsed &&
                    group.children?.map((child) => (
                      <NavLink
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
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <nav className="flex gap-2 overflow-x-auto border-b border-border/70 px-4 py-3 lg:hidden">
        <Link
          href={SQL_ROUTES.home}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname === SQL_ROUTES.home
              ? "bg-cyan-500/10 text-cyan-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Overview
        </Link>
        {SQL_NOTES_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`${SQL_ROUTES.notes}?chapter=${section.id}`}
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
              pathname.startsWith(SQL_ROUTES.notes) && chapter === section.id
                ? "bg-cyan-500/10 text-cyan-500"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {section.label}
          </Link>
        ))}
        <Link
          href={SQL_ROUTES.practice}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SQL_ROUTES.practice)
              ? "bg-cyan-500/10 text-cyan-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Practice
        </Link>
        <Link
          href={SQL_ROUTES.leetcode}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SQL_ROUTES.leetcode)
              ? "bg-cyan-500/10 text-cyan-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          LeetCode
        </Link>
        <Link
          href={SQL_ROUTES.interview}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SQL_ROUTES.interview)
              ? "bg-cyan-500/10 text-cyan-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Interview
        </Link>
        <Link
          href={SQL_ROUTES.mock}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SQL_ROUTES.mock)
              ? "bg-cyan-500/10 text-cyan-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Mock
        </Link>
      </nav>
    </>
  );
}

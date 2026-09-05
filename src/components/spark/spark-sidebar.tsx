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
            ? "text-orange-500"
            : "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        collapsed && !nested && "justify-center px-2"
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {!collapsed && label}
    </Link>
  );
}

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
          "hidden shrink-0 border-r border-border/70 bg-card/30 transition-all duration-300 lg:block",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="sticky top-24 flex h-[calc(100vh-6rem)] flex-col p-4">
          <div className={cn("mb-6 flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-orange-400 ring-1 ring-orange-500/20">
              <Zap className="size-5" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-xs text-orange-500">PySpark DE2 prep</p>
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
          href={SPARK_ROUTES.home}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname === SPARK_ROUTES.home
              ? "bg-orange-500/10 text-orange-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Overview
        </Link>
        {SPARK_NOTES_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`${SPARK_ROUTES.notes}?chapter=${section.id}`}
            className={cn(
              "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
              pathname.startsWith(SPARK_ROUTES.notes) && chapter === section.id
                ? "bg-orange-500/10 text-orange-500"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {section.label}
          </Link>
        ))}
        <Link
          href={SPARK_ROUTES.interview}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SPARK_ROUTES.interview)
              ? "bg-orange-500/10 text-orange-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Interview
        </Link>
        <Link
          href={SPARK_ROUTES.practice}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SPARK_ROUTES.practice)
              ? "bg-orange-500/10 text-orange-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Coding
        </Link>
        <Link
          href={SPARK_ROUTES.mock}
          className={cn(
            "shrink-0 rounded-full px-3 py-2 text-sm font-medium",
            pathname.startsWith(SPARK_ROUTES.mock)
              ? "bg-orange-500/10 text-orange-500"
              : "bg-muted/50 text-muted-foreground"
          )}
        >
          Mock
        </Link>
      </nav>
    </>
  );
}

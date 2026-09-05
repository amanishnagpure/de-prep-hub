"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Cloud,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
} from "lucide-react";
import { CLOUD_NOTES_SECTIONS, CLOUD_ROUTES } from "@/lib/cloud";
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
    label: "Cloud Notes",
    icon: BookOpen,
    href: CLOUD_ROUTES.notes,
    match: (pathname) => pathname.startsWith(CLOUD_ROUTES.notes),
    children: CLOUD_NOTES_SECTIONS.map((section) => ({
      label: section.label,
      href: `${CLOUD_ROUTES.notes}?chapter=${section.id}`,
      match: (pathname, chapter) =>
        pathname.startsWith(CLOUD_ROUTES.notes) &&
        (chapter === section.id || (!chapter && section.id === "azure-data-factory")),
    })),
  },
  {
    id: "practice",
    label: "Practice",
    icon: Terminal,
    href: CLOUD_ROUTES.practice,
    match: (pathname) => pathname.startsWith(CLOUD_ROUTES.practice),
  },
  {
    id: "interview",
    label: "Interview",
    icon: Brain,
    href: CLOUD_ROUTES.interview,
    match: (pathname) => pathname.startsWith(CLOUD_ROUTES.interview),
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: CLOUD_ROUTES.home,
    match: (pathname) => pathname === CLOUD_ROUTES.home,
  },
];

export function CloudSidebar() {
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
            <p className="mb-6 text-xs font-medium text-muted-foreground">Cloud</p>
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
        <LabMobileTab href={CLOUD_ROUTES.home} active={pathname === CLOUD_ROUTES.home}>
          Overview
        </LabMobileTab>
        {CLOUD_NOTES_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`${CLOUD_ROUTES.notes}?chapter=${section.id}`}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
              pathname.startsWith(CLOUD_ROUTES.notes) && chapter === section.id
                ? "bg-muted font-medium text-foreground"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            {section.label}
          </Link>
        ))}
        <LabMobileTab href={CLOUD_ROUTES.practice} active={pathname.startsWith(CLOUD_ROUTES.practice)}>
          Practice
        </LabMobileTab>
        <LabMobileTab href={CLOUD_ROUTES.interview} active={pathname.startsWith(CLOUD_ROUTES.interview)}>
          Interview
        </LabMobileTab>
      </nav>
    </>
  );
}

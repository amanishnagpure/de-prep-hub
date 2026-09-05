"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  Network,
  PenLine,
} from "lucide-react";
import { SYSTEM_DESIGN_NOTES_SECTIONS, SYSTEM_DESIGN_ROUTES } from "@/lib/system-design";
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
    label: "Notes",
    icon: BookOpen,
    href: SYSTEM_DESIGN_ROUTES.notes,
    match: (pathname) => pathname.startsWith(SYSTEM_DESIGN_ROUTES.notes),
    children: SYSTEM_DESIGN_NOTES_SECTIONS.map((section) => ({
      label: section.label,
      href: `${SYSTEM_DESIGN_ROUTES.notes}?chapter=${section.id}`,
      match: (pathname, chapter) =>
        pathname.startsWith(SYSTEM_DESIGN_ROUTES.notes) &&
        (chapter === section.id || (!chapter && section.id === "batch-vs-streaming")),
    })),
  },
  {
    id: "practice",
    label: "Practice",
    icon: PenLine,
    href: SYSTEM_DESIGN_ROUTES.practice,
    match: (pathname) => pathname.startsWith(SYSTEM_DESIGN_ROUTES.practice),
  },
  {
    id: "interview",
    label: "Interview",
    icon: Brain,
    href: SYSTEM_DESIGN_ROUTES.interview,
    match: (pathname) => pathname.startsWith(SYSTEM_DESIGN_ROUTES.interview),
  },
  {
    id: "overview",
    label: "Overview",
    icon: BarChart3,
    href: SYSTEM_DESIGN_ROUTES.home,
    match: (pathname) => pathname === SYSTEM_DESIGN_ROUTES.home,
  },
];

export function SystemDesignSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chapter = searchParams.get("chapter");
  const { collapsed, toggle } = useLabSidebarCollapse();

  const isChildActive = (child: NavChild) =>
    child.match ? child.match(pathname, chapter) : pathname === child.href;

  const mobileNav = (
    <>
      <LabMobileTab href={SYSTEM_DESIGN_ROUTES.home} active={pathname === SYSTEM_DESIGN_ROUTES.home}>
                Overview
              </LabMobileTab>
              {SYSTEM_DESIGN_NOTES_SECTIONS.map((section) => (
                <Link
                  key={section.id}
                  href={`${SYSTEM_DESIGN_ROUTES.notes}?chapter=${section.id}`}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname.startsWith(SYSTEM_DESIGN_ROUTES.notes) && chapter === section.id
                      ? "bg-muted font-medium text-foreground"
                      : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {section.label}
                </Link>
              ))}
              <LabMobileTab href={SYSTEM_DESIGN_ROUTES.practice} active={pathname.startsWith(SYSTEM_DESIGN_ROUTES.practice)}>
                Practice
              </LabMobileTab>
              <LabMobileTab href={SYSTEM_DESIGN_ROUTES.interview} active={pathname.startsWith(SYSTEM_DESIGN_ROUTES.interview)}>
                Interview
              </LabMobileTab>
    </>
  );

  return (
    <LabSidebarShell
      collapsed={collapsed}
      onToggleCollapse={toggle}
      mobileNav={mobileNav}
      header={<p className="text-xs font-medium text-muted-foreground">System design</p>}
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

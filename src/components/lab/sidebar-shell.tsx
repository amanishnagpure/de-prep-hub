"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "cn";

/** Viewports between lg and this width start with a collapsed sidebar to avoid overlap. */
const AUTO_COLLAPSE_BELOW_PX = 1280;

export function useLabSidebarCollapse() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [userToggled, setUserToggled] = React.useState(false);

  React.useEffect(() => {
    const apply = () => {
      const w = window.innerWidth;
      if (w < 1024) return;
      if (!userToggled) {
        setCollapsed(w < AUTO_COLLAPSE_BELOW_PX);
      }
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [userToggled]);

  const toggle = React.useCallback(() => {
    setUserToggled(true);
    setCollapsed((value) => !value);
  }, []);

  return { collapsed, toggle };
}

interface LabSidebarShellProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
  mobileNav: React.ReactNode;
}

export function LabSidebarShell({
  collapsed,
  onToggleCollapse,
  header,
  children,
  mobileNav,
}: LabSidebarShellProps) {
  return (
    <div className="w-full shrink-0 lg:w-auto lg:self-stretch">
      <nav
        className="flex gap-2 overflow-x-auto border-b border-border bg-card/90 py-2.5 backdrop-blur-sm lg:hidden"
        aria-label="Lab sections"
      >
        {mobileNav}
      </nav>

      <aside
        className={cn(
          "hidden shrink-0 border-border bg-card/80 lg:sticky lg:top-14 lg:z-20 lg:block lg:border-r",
          "lg:max-h-[calc(100dvh-3.5rem)]",
          "transition-[width] duration-200 ease-out",
          collapsed ? "lg:w-[4.5rem]" : "lg:w-56 xl:w-60"
        )}
      >
        <div className="flex h-full max-h-[calc(100dvh-3.5rem)] flex-col p-3">
          {header ? (
            <div className={cn("mb-2 shrink-0", collapsed && "mb-0 flex justify-center")}>
              {!collapsed ? header : null}
            </div>
          ) : null}

          <nav className="min-h-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            {children}
          </nav>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={cn(
              "mt-3 inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border py-2 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
              collapsed ? "w-full px-0" : "w-full px-3"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="size-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { cn } from "cn";

export function PlatformTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "platform-tab",
            active === tab.id && "platform-tab-active"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

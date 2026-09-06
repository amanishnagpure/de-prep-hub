import Link from "next/link";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "cn";

type NavIcon = ComponentType<{ className?: string }>;

export function LabSidebarLink({
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
        "lc-sidebar-link",
        nested && !collapsed && "ml-3 pl-3",
        active && "lc-sidebar-link-active",
        collapsed && !nested && "justify-center px-2"
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" />}
      {!collapsed && label}
    </Link>
  );
}

export function LabMobileTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-muted font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function LabChapterLink({
  href,
  title,
  estimate,
  isRead,
}: {
  href: string;
  title: string;
  estimate: string;
  isRead: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-muted/50",
        isRead && "border-primary/30 bg-primary/[0.04]"
      )}
    >
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{estimate}</p>
      </div>
      {isRead ? (
        <CheckCircle2 className="size-4 text-primary" />
      ) : (
        <span className="size-2 rounded-full bg-muted-foreground/30" />
      )}
    </Link>
  );
}

export function LabModuleLink({
  href,
  title,
  icon: Icon,
}: {
  href: string;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="panel group flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
    >
      <div className="icon-tile size-9">
        <Icon className="size-4" />
      </div>
      <span className="text-sm font-semibold tracking-tight group-hover:text-primary">
        {title}
      </span>
    </Link>
  );
}

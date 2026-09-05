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
        "flex items-center gap-3 rounded-lg text-sm transition-all duration-150",
        nested ? "px-3 py-2" : "px-3 py-2.5",
        nested && "ml-5 border-l-2 border-border pl-4",
        active
          ? nested
            ? "border-l-primary font-medium text-primary"
            : "bg-primary/10 font-medium text-primary shadow-sm ring-1 ring-primary/15"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
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
        "shrink-0 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/20"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
        "flex items-center justify-between rounded-lg border border-border/70 bg-card/50 px-4 py-3 transition-all duration-150 hover:border-primary/25 hover:bg-muted/40 hover:shadow-sm",
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
      className="panel-interactive group flex items-center gap-3.5 p-4"
    >
      <div className="icon-tile bg-primary/10 text-primary ring-primary/20">
        <Icon className="size-4" />
      </div>
      <span className="text-sm font-semibold tracking-tight group-hover:text-primary">
        {title}
      </span>
    </Link>
  );
}

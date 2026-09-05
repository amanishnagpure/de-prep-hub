import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("relative", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3.5 opacity-50" />}
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {eyebrow ? (
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </div>
      ) : null}

      <h1 className={cn("max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl", eyebrow ? "mt-5" : "")}>
        {title}
      </h1>

      {description ? (
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}

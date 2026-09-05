import { cn } from "cn";

interface HomeSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  className,
  children,
}: HomeSectionHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className={cn("font-bold tracking-tight", eyebrow ? "mt-1 text-2xl" : "text-2xl")}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

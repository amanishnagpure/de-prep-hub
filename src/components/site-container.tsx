import { cn } from "cn";

type SiteContainerElement = "div" | "section" | "header" | "footer" | "nav";

interface SiteContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: SiteContainerElement;
  /** Use for lab layouts with a sidebar — allows a wider max width on large screens. */
  wide?: boolean;
}

export function SiteContainer({
  children,
  className,
  as: Tag = "div",
  wide = false,
}: SiteContainerProps) {
  return (
    <Tag className={cn("site-container", wide && "site-container-wide", className)}>
      {children}
    </Tag>
  );
}

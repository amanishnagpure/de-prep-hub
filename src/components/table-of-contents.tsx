import Link from "next/link";
import { ListTree } from "lucide-react";
import { cn } from "cn";

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-dashed border-border/70 bg-card/40 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <ListTree className="size-3.5" />
            On this page
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Headings will appear here once you add content to this page.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-28 rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm shadow-black/5 dark:shadow-black/20">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <ListTree className="size-3.5 text-primary" />
          On this page
        </div>
        <ul className="mt-4 space-y-1 border-l border-border/80 pl-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block rounded-md py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary",
                  heading.level === 2 && "-ml-px border-l-2 border-transparent pl-3 hover:border-primary/50",
                  heading.level === 3 && "pl-6 text-xs"
                )}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

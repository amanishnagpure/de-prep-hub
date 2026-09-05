"use client";

import * as React from "react";
import Link from "next/link";
import { ListTree } from "lucide-react";
import { cn } from "cn";

interface SparkScrollTocProps {
  headings: { id: string; text: string; level: number }[];
}

export function SparkScrollToc({ headings }: SparkScrollTocProps) {
  const [activeId, setActiveId] = React.useState(headings[0]?.id ?? "");

  React.useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <nav className="sticky top-28 panel p-5 ">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <ListTree className="size-3.5 text-orange-500" />
          On this page
        </div>
        <ul className="mt-4 max-h-[70vh] space-y-1 overflow-y-auto border-l border-border/80 pl-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                onClick={() => setActiveId(heading.id)}
                className={cn(
                  "block rounded-md py-1.5 text-sm transition-colors",
                  heading.level === 2 && "-ml-px border-l-2 pl-3",
                  heading.level === 3 && "pl-6 text-xs",
                  activeId === heading.id
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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

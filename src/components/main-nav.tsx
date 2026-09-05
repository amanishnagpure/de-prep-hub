"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ChevronDown, Home, Map, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/search-dialog";
import { getTopicLabHref, isTopicLabActive, isTopicLabPath } from "@/lib/topic-labs";
import type { TopicMeta } from "@/lib/content";
import { cn } from "cn";

function getTopicHref(slug: string): string {
  return getTopicLabHref(slug) ?? `/topics/${slug}`;
}

const primaryNav = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/schedule", label: "Schedule", icon: CalendarDays, exact: false },
  { href: "/roadmap", label: "Roadmap", icon: Map, exact: false },
];

interface MainNavProps {
  topics: TopicMeta[];
}

export function MainNav({ topics }: MainNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [topicsOpen, setTopicsOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
    setTopicsOpen(false);
  }, [pathname]);

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-150",
      active
        ? "bg-primary/10 font-medium text-primary ring-1 ring-primary/15"
        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
    );

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Logo size={28} />
          <span className="text-sm font-semibold tracking-tight">DE Prep Hub</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(isActive(item.href, item.exact))}>
              <item.icon className="size-4 opacity-70" />
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setTopicsOpen((open) => !open)}
              className={linkClass(pathname.startsWith("/topics") || isTopicLabPath(pathname))}
            >
              Topics
              <ChevronDown className={cn("size-4 opacity-70", topicsOpen && "rotate-180")} />
            </button>

            {topicsOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40"
                  aria-label="Close topics menu"
                  onClick={() => setTopicsOpen(false)}
                />
                <div className="absolute left-0 top-[calc(100%+0.25rem)] z-50 w-64 rounded-lg border border-border bg-popover p-1 shadow-md">
                  <div className="max-h-80 space-y-0.5 overflow-y-auto">
                    {topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        href={getTopicHref(topic.slug)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors",
                          isTopicLabActive(topic.slug, pathname)
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {topic.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <SearchTrigger />
          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-4 top-[calc(100%+0.25rem)] z-50 rounded-lg border border-border bg-popover p-3 shadow-md lg:hidden">
          <div className="space-y-0.5">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(linkClass(isActive(item.href, item.exact)), "w-full")}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="my-2 h-px bg-border" />

          <p className="px-3 py-1 text-xs text-muted-foreground">Topics</p>
          <div className="max-h-64 space-y-0.5 overflow-y-auto">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={getTopicHref(topic.slug)}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  isTopicLabActive(topic.slug, pathname)
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

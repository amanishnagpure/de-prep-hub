"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Home, Map, Menu, X } from "lucide-react";
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

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
        <div className="relative transition-transform duration-300 group-hover:scale-105">
          <Logo size={36} />
          <div className="absolute inset-0 rounded-[10px] bg-primary/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
        </div>
        <div className="leading-none">
          <span className="block text-sm font-bold tracking-tight">DE Prep Hub</span>
          <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
            Pipeline mode
          </span>
        </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
              isActive(item.href, item.exact)
                ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <item.icon className="size-4 opacity-80" />
            {item.label}
          </Link>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setTopicsOpen((open) => !open)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
              pathname.startsWith("/topics") || isTopicLabPath(pathname)
                ? "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            Topics
            <ChevronDown
              className={cn("size-4 transition-transform", topicsOpen && "rotate-180")}
            />
          </button>

          {topicsOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close topics menu"
                onClick={() => setTopicsOpen(false)}
              />
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl border border-border/70 bg-popover/95 p-2 shadow-xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30">
                <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  All topics
                </p>
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {topics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={getTopicHref(topic.slug)}
                      className={cn(
                        "block rounded-xl px-3 py-2.5 transition-colors",
                        isTopicLabActive(topic.slug, pathname)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/80"
                      )}
                    >
                      <span className="block text-sm font-medium">{topic.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

        <div className="flex items-center gap-1.5">
        <SearchTrigger />
        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
        <ThemeToggle />
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-4 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-border/70 bg-popover/95 p-4 shadow-xl shadow-black/10 backdrop-blur-xl lg:hidden dark:shadow-black/30">
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="my-3 h-px bg-border/70" />

          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Topics
          </p>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={getTopicHref(topic.slug)}
                className={cn(
                  "block rounded-xl px-3 py-2.5 transition-colors",
                  isTopicLabActive(topic.slug, pathname)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/80"
                )}
              >
                <span className="text-sm font-medium">{topic.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/search-dialog";
import { PLATFORM_NAV, platformIdentity } from "@/design";
import { cn } from "cn";

export function PlatformNav() {
  const pathname = usePathname();

  return (
    <div className="flex w-full items-center gap-6">
      <Link
        href="/"
        className="group flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity duration-[var(--motion-fast)] hover:opacity-80"
      >
        <Logo size={24} />
        <span className="hidden text-sm font-medium tracking-tight text-foreground sm:inline">
          {platformIdentity.name}
        </span>
      </Link>

      <nav className="flex flex-1 items-center gap-0.5" aria-label="Platform">
        {PLATFORM_NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn("platform-nav-link", active && "platform-nav-link-active")}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <SearchTrigger />
        <div className="mx-1 hidden h-4 w-px bg-border/80 sm:block" aria-hidden />
        <ThemeToggle />
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTrigger } from "@/components/search-dialog";
import { isCodeSectionRoute } from "@/lib/de-code/constants";
import { cn } from "cn";

const NAV = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/labs", label: "Labs", match: (p: string) => p === "/labs" || /^\/(sql|python|spark|databricks|airflow|cloud|system-design|interview-prep)/.test(p) },
  { href: "/code", label: "Code", match: (p: string) => isCodeSectionRoute(p) },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex w-full items-center gap-4">
      <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
        <Logo size={26} />
        <span className="text-sm font-semibold tracking-tight">
          DE Prep <span className="text-primary">Hub</span>
        </span>
      </Link>

      <nav className="flex flex-1 items-center gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("lc-nav-link", item.match(pathname) && "lc-nav-link-active")}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <SearchTrigger />
        <div className="mx-1 hidden h-4 w-px bg-border sm:block" />
        <ThemeToggle />
      </div>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteContainer } from "@/components/site-container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-gradient-to-b from-transparent to-muted/30">
      <SiteContainer className="flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Logo size={24} />
          <span>DE Prep Hub — personal study notes</span>
        </div>

        <nav className="flex flex-wrap gap-4 text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/roadmap" className="transition-colors hover:text-foreground">
            Roadmap
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
      </SiteContainer>
    </footer>
  );
}

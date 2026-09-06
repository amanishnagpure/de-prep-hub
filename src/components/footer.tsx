import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteContainer } from "@/components/site-container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <SiteContainer className="flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Logo size={20} />
          <span>DE Prep Hub</span>
        </div>

        <nav className="flex flex-wrap gap-4 text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/schedule" className="transition-colors hover:text-primary">
            Schedule
          </Link>
          <Link href="/roadmap" className="transition-colors hover:text-primary">
            Roadmap
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
      </SiteContainer>
    </footer>
  );
}

import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteContainer } from "@/components/site-container";
import { platformIdentity } from "@/design";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <SiteContainer className="flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Logo size={18} />
          <span>{platformIdentity.name}</span>
        </div>

        <nav className="flex flex-wrap gap-6 text-muted-foreground">
          <Link href="/code" className="transition-colors hover:text-foreground">
            Practice
          </Link>
          <Link href="/code/challenges" className="transition-colors hover:text-foreground">
            Challenges
          </Link>
          <Link href="/progress" className="transition-colors hover:text-foreground">
            Progress
          </Link>
        </nav>
      </SiteContainer>
    </footer>
  );
}

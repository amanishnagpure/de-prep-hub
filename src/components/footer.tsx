import Link from "next/link";
import { Map } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <div>
            <span className="text-sm font-semibold">DE Prep Hub</span>
            <p className="text-xs text-muted-foreground">Keep building.</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/roadmap" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Map className="size-3.5" />
            Roadmap
          </Link>
        </nav>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

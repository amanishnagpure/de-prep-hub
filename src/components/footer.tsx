import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/80 bg-gradient-to-b from-transparent to-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
      </div>
    </footer>
  );
}

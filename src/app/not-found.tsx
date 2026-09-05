import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SiteContainer } from "@/components/site-container";
import { cn } from "cn";

export default function NotFound() {
  return (
    <SiteContainer className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-semibold tracking-tight text-muted-foreground/40 sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Try
        searching or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl px-5")}>
          <Home className="size-4" />
          Back to Home
        </Link>
        <Link
          href="/roadmap"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-border/80 bg-card/50 px-5"
          )}
        >
          <ArrowLeft className="size-4" />
          View Roadmap
        </Link>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="size-4" />
        Press <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> to search topics
      </p>
    </SiteContainer>
  );
}

import { MainNav } from "@/components/main-nav";
import { SiteContainer } from "@/components/site-container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <SiteContainer className="relative flex h-12 items-center">
        <MainNav />
      </SiteContainer>
    </header>
  );
}

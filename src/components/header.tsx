import { PlatformNav } from "@/components/platform/platform-nav";
import { SiteContainer } from "@/components/site-container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45">
      <SiteContainer className="relative flex h-16 items-center">
        <PlatformNav />
      </SiteContainer>
    </header>
  );
}

import { getAllTopics } from "@/lib/content";
import { MainNav } from "@/components/main-nav";
import { SiteContainer } from "@/components/site-container";

export function Header() {
  const topics = getAllTopics();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 shadow-sm shadow-black/[0.03] backdrop-blur-md dark:shadow-black/20">
      <SiteContainer className="relative flex h-14 items-center">
        <MainNav topics={topics} />
      </SiteContainer>
    </header>
  );
}

import { getAllTopics } from "@/lib/content";
import { MainNav } from "@/components/main-nav";

export function Header() {
  const topics = getAllTopics();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 shadow-sm shadow-black/[0.03] backdrop-blur-md dark:shadow-black/20">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        <MainNav topics={topics} />
      </div>
    </header>
  );
}

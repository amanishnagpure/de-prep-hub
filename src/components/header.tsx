import { getAllTopics } from "@/lib/content";
import { MainNav } from "@/components/main-nav";

export function Header() {
  const topics = getAllTopics();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="glass-panel relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-border/70 px-4 shadow-sm shadow-black/5 sm:px-5 dark:shadow-black/20">
        <MainNav topics={topics} />
      </div>
    </header>
  );
}

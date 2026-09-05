import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { TopicMeta } from "@/lib/content";
import { getTopicModuleHref } from "@/lib/topic-labs";
import { cn } from "cn";

const moduleStyles: Record<
  NonNullable<TopicMeta["difficulty"]>,
  { badge: string; accent: string; label: string }
> = {
  basic: {
    label: "Basic",
    badge: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    accent: "from-emerald-500/20 to-green-500/5 text-emerald-400 ring-emerald-500/20",
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    accent: "from-amber-500/20 to-orange-500/5 text-amber-400 ring-amber-500/20",
  },
  advance: {
    label: "Advance",
    badge: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
    accent: "from-rose-500/20 to-red-500/5 text-rose-400 ring-rose-500/20",
  },
  interview: {
    label: "Interview",
    badge: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
    accent: "from-violet-500/20 to-purple-500/5 text-violet-400 ring-violet-500/20",
  },
  patterns: {
    label: "Patterns",
    badge: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
    accent: "from-cyan-500/20 to-teal-500/5 text-cyan-400 ring-cyan-500/20",
  },
  engineering: {
    label: "DE Topics",
    badge: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    accent: "from-blue-500/20 to-indigo-500/5 text-blue-400 ring-blue-500/20",
  },
  traps: {
    label: "Traps",
    badge: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
    accent: "from-orange-500/20 to-amber-500/5 text-orange-400 ring-amber-500/20",
  },
  practice: {
    label: "Practice",
    badge: "bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-500/20",
    accent: "from-fuchsia-500/20 to-pink-500/5 text-fuchsia-400 ring-fuchsia-500/20",
  },
};

interface TopicModulesProps {
  modules: TopicMeta[];
  parentTitle: string;
  parentSlug?: string;
}

export function TopicModules({ modules, parentTitle, parentSlug }: TopicModulesProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight">{parentTitle} modules</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module, index) => {
          const style = module.difficulty
            ? (moduleStyles[module.difficulty] ?? moduleStyles.basic)
            : moduleStyles.basic;

          return (
            <Link
              key={module.slug}
              href={getTopicModuleHref(module.slug, parentSlug)}
              className="group block h-full"
            >
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ring-1",
                      style.accent
                    )}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1",
                      style.badge
                    )}
                  >
                    {style.label}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {module.title}
                </h3>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

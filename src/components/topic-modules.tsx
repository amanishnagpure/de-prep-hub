import Link from "next/link";
import type { TopicMeta } from "@/lib/content";
import { getTopicModuleHref } from "@/lib/topic-labs";

const difficultyLabel: Record<NonNullable<TopicMeta["difficulty"]>, string> = {
  basic: "Basic",
  medium: "Medium",
  advance: "Advance",
  interview: "Interview",
  patterns: "Patterns",
  engineering: "DE Topics",
  traps: "Traps",
  practice: "Practice",
};

interface TopicModulesProps {
  modules: TopicMeta[];
  parentTitle: string;
  parentSlug?: string;
}

export function TopicModules({ modules, parentTitle, parentSlug }: TopicModulesProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold tracking-tight">{parentTitle} modules</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module, index) => (
          <Link
            key={module.slug}
            href={getTopicModuleHref(module.slug, parentSlug)}
            className="panel-interactive block p-4"
          >
            <p className="text-xs font-medium text-primary">
              {String(index + 1).padStart(2, "0")}
              {module.difficulty ? ` · ${difficultyLabel[module.difficulty]}` : ""}
            </p>
            <h3 className="mt-1.5 font-semibold tracking-tight">{module.title}</h3>
            {module.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {module.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

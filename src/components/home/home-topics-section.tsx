import type { TopicMeta } from "@/lib/content";
import { TOPIC_LAB_SLUGS } from "@/lib/topic-labs";
import { TopicCard } from "@/components/topic-card";
import { ProgressCounter } from "@/components/progress-counter";
import { HomeSectionHeader } from "@/components/home/home-section-header";

interface HomeTopicsSectionProps {
  topics: TopicMeta[];
}

const FEATURED_SLUGS = new Set(["sql", "python"]);

export function HomeTopicsSection({ topics }: HomeTopicsSectionProps) {
  const featuredTopics = topics.filter((t) => FEATURED_SLUGS.has(t.slug));
  const otherTopics = topics.filter((t) => !FEATURED_SLUGS.has(t.slug));

  return (
    <section className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <HomeSectionHeader
          eyebrow="Curriculum"
          title="Study topics"
          description={`${TOPIC_LAB_SLUGS.length} live labs — SQL and Python featured below, plus Spark, Databricks, Airflow, Cloud, System Design, and Interview Prep.`}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredTopics.map((topic) => (
              <div key={topic.slug} className="sm:col-span-2">
                <TopicCard topic={topic} featured />
              </div>
            ))}
            {otherTopics.map((topic) => (
              <TopicCard key={topic.slug} topic={topic} compact />
            ))}
          </div>

          <ProgressCounter totalTopics={topics.length} />
        </div>
      </div>
    </section>
  );
}

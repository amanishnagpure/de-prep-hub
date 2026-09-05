import { notFound } from "next/navigation";
import {
  getAllTopicSlugs,
  getTopicBySlug,
  getSubtopics,
  getTopicNavigation,
} from "@/lib/content";
import { extractHeadings } from "@/lib/markdown-utils";
import { PageHeader } from "@/components/page-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";
import { ProgressToggle } from "@/components/progress-toggle";
import { TopicNavigation } from "@/components/topic-navigation";
import { TopicModules } from "@/components/topic-modules";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) return { title: "Topic not found" };

  return {
    title: topic.title,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) notFound();

  const subtopics = getSubtopics(slug);
  const headings = extractHeadings(topic.content);
  const { prev, next } = getTopicNavigation(slug);
  const parent = topic.parent ? getTopicBySlug(topic.parent) : null;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Topics", href: "/" },
    ...(parent
      ? [
          { label: parent.title, href: `/topics/${parent.slug}` },
          { label: topic.title },
        ]
      : [{ label: topic.title }]),
  ];

  const metaLabel = topic.difficulty
    ? {
        basic: "Basic · SQL",
        medium: "Medium · SQL",
        advance: "Advance · SQL",
        interview: "Interview · SQL",
        patterns: "Patterns · SQL",
        engineering: "Data Engineering · SQL",
        traps: "Traps · SQL",
        practice: "Practice · SQL",
      }[topic.difficulty]
    : `Topic ${String(topic.order).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title={topic.title}
        description={metaLabel}
        breadcrumbs={breadcrumbs}
      >
        <ProgressToggle slug={topic.slug} />
      </PageHeader>

      {slug === "sql" ? (
        <TopicModules modules={subtopics} parentTitle={topic.title} parentSlug={slug} />
      ) : subtopics.length > 0 ? (
        <TopicModules modules={subtopics} parentTitle={topic.title} parentSlug={slug} />
      ) : null}

      {topic.content.trim() ? (
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
          <div className="panel p-6 sm:p-8">
            <MarkdownRenderer content={topic.content} />
          </div>
          <TableOfContents headings={headings} />
        </div>
      ) : null}

      <TopicNavigation prev={prev} next={next} />
    </div>
  );
}

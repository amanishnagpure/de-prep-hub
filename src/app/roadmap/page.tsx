import { getRoadmap } from "@/lib/content";
import { extractHeadings } from "@/lib/markdown-utils";
import { PageHeader } from "@/components/page-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";

export const metadata = {
  title: "Learning Roadmap",
};

export default function RoadmapPage() {
  const roadmap = getRoadmap();
  const headings = extractHeadings(roadmap.content);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader
        title={roadmap.title}
        description="From zero to production-ready."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Roadmap" },
        ]}
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <div className="panel p-6 sm:p-8">
          <MarkdownRenderer content={roadmap.content} />
        </div>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}

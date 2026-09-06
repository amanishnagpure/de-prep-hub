import catalog from "@/data/de-code/catalog.json";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { TopicOverviewHeader } from "@/components/de-code/code-track-hub";
import { CodeWorkspace } from "@/components/de-code/code-workspace";
import { TopicLearningPath } from "@/components/de-code/topic-learning-path";
import { CODE_TRACKS, isCodeTrackId } from "@/lib/de-code/constants";
import { isValidTopic } from "@/lib/de-code/taxonomy";
import type { CodeProblem } from "@/lib/de-code/types";

const ALL = catalog as CodeProblem[];

export function generateStaticParams() {
  const pairs = new Set<string>();
  for (const p of ALL) {
    pairs.add(`${p.track}:${p.topic}`);
  }
  return [...pairs].map((key) => {
    const [track, topic] = key.split(":");
    return { track, topic };
  });
}

export default async function CodeTopicPage({ params }: PageProps<"/code/[track]/[topic]">) {
  const { track, topic } = await params;
  if (!isCodeTrackId(track) || !isValidTopic(track, topic)) notFound();

  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-4 pb-4">
        <div className="shrink-0">
          <TopicOverviewHeader track={track} topicId={topic} />
        </div>
        <div className="shrink-0">
          <TopicLearningPath track={track} topicId={topic} />
        </div>
        <CodeWorkspace track={track} topicId={topic} />
      </div>
    </Suspense>
  );
}

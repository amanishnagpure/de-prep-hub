import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPracticeTrack, isPracticeTrackId, PRACTICE_TRACKS } from "@/lib/practice-tracks";
import { PracticeSectionShell } from "@/components/practice/practice-section-shell";
import { PracticeSectionWorkspace } from "@/components/practice/practice-section-workspace";

export function generateStaticParams() {
  return PRACTICE_TRACKS.map((track) => ({ track: track.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/practice/[track]">): Promise<Metadata> {
  const { track: trackId } = await params;
  const track = getPracticeTrack(trackId);
  if (!track) return { title: "Practice" };
  return {
    title: `${track.label} Practice`,
    description: track.description,
  };
}

export default async function PracticeTrackPage({ params }: PageProps<"/practice/[track]">) {
  const { track: trackId } = await params;
  if (!isPracticeTrackId(trackId)) notFound();

  return (
    <PracticeSectionShell>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <PracticeSectionWorkspace track={trackId} />
      </Suspense>
    </PracticeSectionShell>
  );
}

import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CodeTrackHub } from "@/components/de-code/code-track-hub";
import { CODE_TRACKS, isCodeTrackId } from "@/lib/de-code/constants";

export function generateStaticParams() {
  return CODE_TRACKS.map((track) => ({ track: track.id }));
}

export default async function CodeTrackPage({ params }: PageProps<"/code/[track]">) {
  const { track } = await params;
  if (!isCodeTrackId(track)) notFound();
  return <CodeTrackHub track={track} />;
}

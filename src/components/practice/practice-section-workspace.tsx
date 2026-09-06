"use client";

import { PlatformWorkspace } from "@/components/practice-platform/platform-workspace";
import type { PracticeTrackId } from "@/lib/practice-tracks";

export function PracticeSectionWorkspace({ track }: { track: PracticeTrackId }) {
  return <PlatformWorkspace track={track} />;
}

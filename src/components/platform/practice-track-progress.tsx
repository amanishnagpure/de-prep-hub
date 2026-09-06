"use client";

import { categoryColors } from "@/design/colors";
import { PlatformProgress } from "@/components/ui/platform-progress";
import { CODE_TRACKS } from "@/lib/de-code/constants";
import { getTrackStats } from "@/lib/de-code/progress";
import { getCodeProblems } from "@/lib/de-code/problem-bank";
import type { CodeTrackId } from "@/lib/de-code/types";
import * as React from "react";

const TRACK_HUE: Record<CodeTrackId, string> = {
  sql: categoryColors.sql.hue,
  python: categoryColors.python.hue,
  pyspark: categoryColors.pyspark.hue,
  dsa: categoryColors.dsa.hue,
};

export function PracticeTrackProgress() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <ul className="space-y-5">
        {CODE_TRACKS.map((track) => (
          <li key={track.id}>
            <PlatformProgress value={0} label={track.label} accent={TRACK_HUE[track.id]} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-5">
      {CODE_TRACKS.map((track) => {
        const total = getCodeProblems(track.id).length;
        const { percent } = getTrackStats(track.id, total);
        return (
          <li key={track.id}>
            <PlatformProgress value={percent} label={track.label} accent={TRACK_HUE[track.id]} />
          </li>
        );
      })}
    </ul>
  );
}

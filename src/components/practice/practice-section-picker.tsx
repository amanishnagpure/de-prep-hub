import Link from "next/link";
import { ArrowUpRight, Code2, Database, Terminal, Zap } from "lucide-react";
import { PRACTICE_TRACKS } from "@/lib/practice-tracks";
import { HomeSectionHeader } from "@/components/home/home-section-header";

const ICONS = { sql: Database, spark: Zap, python: Code2, dsa: Terminal } as const;

export function PracticeSectionPicker() {
  return (
    <>
      <HomeSectionHeader
        title="Practice"
        description="LeetCode-style platform — problem bank, editor, test cases, submissions. Judge layer supports Pyodide now; plug in DMOJ via DMOJ_JUDGE_URL."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PRACTICE_TRACKS.map((track) => {
          const Icon = ICONS[track.id];
          return (
            <Link key={track.id} href={track.href} className="panel group flex flex-col p-5 transition-colors hover:bg-muted/40">
              <div className="flex items-start justify-between">
                <div className="icon-tile size-11"><Icon className="size-5" /></div>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">{track.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">{track.problemCount} problems</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}

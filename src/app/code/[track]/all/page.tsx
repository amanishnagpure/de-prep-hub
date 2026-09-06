import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CodeWorkspace } from "@/components/de-code/code-workspace";
import { isCodeTrackId } from "@/lib/de-code/constants";

export default async function CodeTrackAllPage({ params }: PageProps<"/code/[track]/all">) {
  const { track } = await params;
  if (!isCodeTrackId(track)) notFound();
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading workspace…</div>}>
      <CodeWorkspace track={track} />
    </Suspense>
  );
}

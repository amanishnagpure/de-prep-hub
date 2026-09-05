export interface InterviewGuideTile {
  number: number;
  title: string;
  body: string;
}

export function isInterviewGuideChapter(title: string): boolean {
  return title.startsWith("Interview Guide") || title.startsWith("DE2 Interview");
}

/** PySpark notes chapters use ### N. tiles (Basic / Medium / Advance). */
export function isQuestionTileChapter(title: string): boolean {
  return title === "Basic" || title === "Medium" || title === "Advance" || isInterviewGuideChapter(title);
}

export function parseInterviewGuideTiles(content: string): {
  intro: string;
  tiles: InterviewGuideTile[];
} {
  const firstHeading = content.search(/^### \d+\./m);

  const intro =
    firstHeading > 0 ? content.slice(0, firstHeading).trim() : firstHeading === 0 ? "" : content.trim();

  if (firstHeading < 0) {
    return { intro, tiles: [] };
  }

  const body = content.slice(firstHeading);
  const parts = body.split(/^### (\d+)\.\s+(.+)$/gm);

  const tiles: InterviewGuideTile[] = [];
  for (let i = 1; i < parts.length; i += 3) {
    const number = Number(parts[i]);
    const title = parts[i + 1]?.trim() ?? "";
    let tileBody = parts[i + 2]?.trim() ?? "";
    // Drop redundant interview-question line — title is on the card
    tileBody = tileBody.replace(/^\*\*Interview question:\*\*[^\n]*\n+/i, "");
    if (number && title) {
      tiles.push({ number, title, body: tileBody });
    }
  }

  return { intro, tiles };
}

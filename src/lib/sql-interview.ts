export interface SqlInterviewQuestion {
  id: number;
  question: string;
  answer: string;
}

export function parseInterviewQuestions(content: string): SqlInterviewQuestion[] {
  const lines = content.split("\n");
  const questions: SqlInterviewQuestion[] = [];
  let current: SqlInterviewQuestion | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (!current) return;
    questions.push({ ...current, answer: answerLines.join("\n").trim() });
    current = null;
    answerLines = [];
  };

  for (const line of lines) {
    const heading = line.match(/^### (\d+)\.\s*(.+)$/);
    if (heading) {
      flush();
      current = { id: Number(heading[1]), question: heading[2].trim(), answer: "" };
      continue;
    }

    if (current) {
      if (line.trim() === "" && answerLines.length === 0) continue;
      answerLines.push(line);
    }
  }

  flush();
  return questions;
}

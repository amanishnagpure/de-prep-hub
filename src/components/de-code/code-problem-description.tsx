import type { CodeProblem } from "@/lib/de-code/types";
import { cn } from "cn";

function renderInline(text: string) {
  const segments = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return segments.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-medium text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function DeCodeRichText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{renderInline(text)}</span>;
}

function ExampleBlock({
  index,
  example,
}: {
  index: number;
  example: CodeProblem["examples"][number];
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">Example {index + 1}:</p>
      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed">
        <div>
          <span className="font-semibold text-muted-foreground">Input: </span>
          <pre className="mt-1 whitespace-pre-wrap">{example.input}</pre>
        </div>
        <div className="mt-3">
          <span className="font-semibold text-muted-foreground">Output: </span>
          <pre className="mt-1 whitespace-pre-wrap">{example.output}</pre>
        </div>
        {example.explanation && (
          <div className="mt-3 border-t border-border/60 pt-3 text-muted-foreground">
            <span className="font-semibold text-foreground">Explanation: </span>
            {renderInline(example.explanation)}
          </div>
        )}
      </div>
    </div>
  );
}

function isTableBlock(text: string) {
  const lines = text.trim().split("\n");
  return lines.length >= 2 && lines.every((line) => line.includes("|"));
}

function isBulletList(text: string) {
  const lines = text.trim().split("\n");
  return lines.length >= 1 && lines.every((line) => line.trim().startsWith("- "));
}

function DescriptionBlock({ text }: { text: string }) {
  if (isTableBlock(text)) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
        {text.trim()}
      </pre>
    );
  }
  if (isBulletList(text)) {
    return (
      <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
        {text
          .trim()
          .split("\n")
          .map((line) => line.replace(/^\s*-\s*/, ""))
          .map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
      </ul>
    );
  }
  return (
    <p className="leading-relaxed text-muted-foreground">
      {renderInline(text)}
    </p>
  );
}

export function CodeProblemDescription({ problem }: { problem: CodeProblem }) {
  const paragraphs = problem.description.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => (
        <DescriptionBlock key={i} text={para} />
      ))}

      {problem.functionSignature && (
        <div>
          <p className="mb-2 text-sm font-semibold">Function signature</p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs">
            {problem.functionSignature}
          </pre>
        </div>
      )}

      {problem.examples.length > 0 && (
        <div className="space-y-4">
          {problem.examples.map((ex, i) => (
            <ExampleBlock key={i} index={i} example={ex} />
          ))}
        </div>
      )}

      {problem.constraints.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Constraints</p>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {problem.constraints.map((c) => (
              <li key={c}>{renderInline(c)}</li>
            ))}
          </ul>
        </div>
      )}

      {problem.followUp && (
        <div className={cn("rounded-lg border border-dashed border-border bg-muted/10 p-3")}>
          <p className="text-sm font-semibold">Follow-up</p>
          <p className="mt-1 text-sm text-muted-foreground">{renderInline(problem.followUp)}</p>
        </div>
      )}
    </div>
  );
}

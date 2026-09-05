"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { FileText } from "lucide-react";
import { slugifyHeading } from "@/lib/markdown-utils";
import { cn } from "cn";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content.trim()) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <FileText className="size-6" />
        </div>
        <p className="mt-5 text-base font-medium">No notes yet</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Add your study material to the markdown file for this topic. Your notes will
          render here with headings, code blocks, and tables.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ children }) => {
            const text = String(children);
            return (
              <h1
                id={slugifyHeading(text)}
                className="scroll-mt-28 text-3xl font-bold tracking-tight"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = String(children);
            return (
              <h2
                id={slugifyHeading(text)}
                className="scroll-mt-28 border-b border-border/60 pb-3 text-2xl font-semibold tracking-tight"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            return (
              <h3
                id={slugifyHeading(text)}
                className="scroll-mt-28 text-xl font-semibold tracking-tight"
              >
                {children}
              </h3>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-primary underline-offset-4 hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isBlock = codeClassName?.includes("language-");

            if (isBlock) {
              return (
                <code className={cn("font-mono text-sm", codeClassName)} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="rounded-md border border-border/60 bg-muted/80 px-1.5 py-0.5 font-mono text-sm text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-border/80 bg-[oklch(0.12_0.02_250)] p-4 text-sm shadow-inner">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-border/80">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-muted/50 px-4 py-3 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-4 py-3">{children}</td>
          ),
          ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-xl border-l-4 border-primary/40 bg-primary/5 py-1 pl-4 not-italic text-muted-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

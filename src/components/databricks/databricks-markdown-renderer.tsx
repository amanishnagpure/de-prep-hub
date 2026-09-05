"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { slugifyHeading } from "@/lib/markdown-utils";
import { DatabricksCodeBlock } from "@/components/databricks/databricks-code-block";
import { cn } from "cn";

interface DatabricksMarkdownRendererProps {
  content: string;
  className?: string;
}

function extractCode(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractCode).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return extractCode(children.props.children);
  }
  return "";
}

export function DatabricksMarkdownRenderer({ content, className }: DatabricksMarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-p:leading-7 prose-li:leading-7",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            return (
              <h2
                id={slugifyHeading(text)}
                className="scroll-mt-32 border-b border-border/60 pb-3 text-2xl font-semibold tracking-tight"
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
                className="scroll-mt-32 text-xl font-semibold tracking-tight"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="scroll-mt-32 text-lg font-semibold tracking-tight">{children}</h4>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-rose-500 underline-offset-4 hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          pre: ({ children }) => {
            const code = extractCode(children);
            const child = React.Children.toArray(children)[0];
            let language = "sql";
            if (React.isValidElement<{ className?: string }>(child) && child.props.className) {
              const match = child.props.className.match(/language-(\w+)/);
              if (match?.[1]) language = match[1];
            }

            return <DatabricksCodeBlock code={code.replace(/\n$/, "")} language={language} />;
          },
          code: ({ className: codeClassName, children }) => {
            const isBlock = codeClassName?.includes("language-");
            if (isBlock) return <code className={codeClassName}>{children}</code>;

            return (
              <code className="rounded-md border border-border/60 bg-muted/80 px-1.5 py-0.5 font-mono text-sm text-rose-500">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="rounded-r-xl border-l-4 border-rose-500/40 bg-rose-500/5 py-1 pl-4 not-italic text-muted-foreground">
              {children}
            </blockquote>
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
          details: ({ children }) => (
            <details className="my-4 rounded-xl border border-border/70 bg-muted/20 p-4">
              {children}
            </details>
          ),
          summary: ({ children }) => (
            <summary className="cursor-pointer font-medium text-rose-500 select-none">
              {children}
            </summary>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

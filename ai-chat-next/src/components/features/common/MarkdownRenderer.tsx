// ai-chat-next/src/components/features/common/MarkdownRenderer.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

type CodeComponentProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function keepLineBreaks(content: string) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((part, index) => (index % 2 === 1 ? part : part.replace(/\n/g, "  \n")))
    .join("");
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [remarkGfm, setRemarkGfm] = useState<typeof import("remark-gfm")["default"] | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      import("remark-gfm").then(mod => {
        setRemarkGfm(() => mod.default);
      });
    }
  }, []);

  return (
    <ReactMarkdown
      {...(remarkGfm && { remarkPlugins: [remarkGfm] })}
      components={{
        ul: props => <ul className="list-disc pl-5" {...props} />,
        ol: props => <ol className="list-decimal pl-5" {...props} />,
        li: props => <li className="my-1" {...props} />,
        code: ({ inline, className, children, ...props }: CodeComponentProps) => {
          if (inline) {
            return (
              <code
                className={`${className} rounded bg-surface px-1 py-0.5 text-xs text-ink sm:text-sm break-anywhere`}
                {...props}
              >
                {children}
              </code>
            );
          }

          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            return (
              <div className="w-full overflow-x-auto rounded-xl border border-line">
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines={true}
                  wrapLines={true}
                  customStyle={{
                    fontSize: "0.85rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                    background: "#f6f7f9",
                  }}
                  codeTagProps={{
                    style: {
                      fontSize: "inherit",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <pre
              className="whitespace-pre-wrap break-anywhere rounded-xl border border-line bg-surface p-3 text-xs text-ink sm:text-sm md:text-base"
              {...props}
            >
              <code>{children}</code>
            </pre>
          );
        },
        p: p => <div {...p}>{p.children}</div>,
      }}
    >
      {keepLineBreaks(content)}
    </ReactMarkdown>
  );
};

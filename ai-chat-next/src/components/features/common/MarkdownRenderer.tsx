// src/components/features/common/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

type CodeProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean;
  className?: string;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        ul: props => <ul className="list-disc pl-5 space-y-1" {...props} />,
        ol: props => <ol className="list-decimal pl-5 space-y-1" {...props} />,
        li: props => <li className="my-1" {...props} />,
        code: ({ inline, className, children, ...props }: CodeProps) => {
          const match = /language-(\w+)/.exec(className || "");

          if (!inline && match) {
            return (
              <div className="my-4 rounded-md overflow-hidden">
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                    backgroundColor: "#1d1f21",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "monospace",
                    },
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code
              className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono break-words"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

// src/components/features/chat/ChatWindowViews/ChatMessages.tsx

import { useEffect, useRef, useState } from "react";
import { ImageOutput } from "@ui/chat/ImageOutput";
import dynamic from "next/dynamic";
import { localizationService } from "@/services/localizationService";

const MarkdownRenderer = dynamic(
  () => import("@features/common/MarkdownRenderer").then(mod => mod.MarkdownRenderer),
  { ssr: false }
);

interface ChatMessagesProps {
  messages: Message[];
  speakingId: string | null;
  speakText: (id: string, text: string) => void;
  topRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export const ChatMessages = ({
  messages,
  speakingId,
  speakText,
  topRef,
  bottomRef,
  scrollToTop,
  scrollToBottom,
}: ChatMessagesProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const content = contentRef.current;
    if (!scroller || !content) return;

    const update = () => {
      setCanScroll(scroller.scrollHeight > scroller.clientHeight + 8);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    observer.observe(content);
    return () => observer.disconnect();
  }, [messages]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {canScroll && (
        <button
          onClick={scrollToBottom}
          className="absolute right-3 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm hover:bg-surface"
          title={localizationService.get("GoToLatest")}
          aria-label={localizationService.get("GoToLatest")}
        >
          <Chevron direction="down" />
        </button>
      )}

      <div
        ref={scrollerRef}
        className={`flex h-full flex-col overflow-y-auto py-2 ${
          canScroll ? "pl-4 pr-14 md:pl-8 md:pr-16" : "px-4 md:px-8"
        }`}
      >
        <div ref={contentRef} className="flex flex-col space-y-4">
          <div ref={topRef} />
          {messages.map(msg => (
            <div key={msg.id} className="flex flex-col gap-2">
              <div className="flex justify-end">
                <div className="max-w-[85%] break-words rounded-2xl bg-[#e8f0ff] px-4 py-2 text-ink">
                  {msg.prompt}
                </div>
              </div>
              {msg.answers.map(ans =>
                /\.(png|jpe?g|gif)$/i.test(ans.content) ? (
                  <div key={ans.id} className="flex justify-start">
                    <ImageOutput url={ans.content} />
                  </div>
                ) : (
                  <div key={ans.id} className="flex justify-start">
                    <div className="flex min-w-0 max-w-[85%] items-start break-words rounded-2xl border border-line bg-white p-3 text-ink shadow-sm">
                      <div className="min-w-0 flex-1 overflow-x-auto">
                        {typeof ans.content === "string" ? (
                          <MarkdownRenderer content={ans.content} />
                        ) : (
                          <div className="text-sm text-red-500">
                            {localizationService.get("InvalidResponseContent")}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => speakText(ans.id, ans.content)}
                        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:bg-surface"
                        title={
                          speakingId === ans.id
                            ? localizationService.get("Stop")
                            : localizationService.get("Play")
                        }
                        aria-label={
                          speakingId === ans.id
                            ? localizationService.get("Stop")
                            : localizationService.get("Play")
                        }
                      >
                        {speakingId === ans.id ? <PauseIcon /> : <SpeakerIcon />}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {canScroll && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-2 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm hover:bg-surface"
          title={localizationService.get("GoToFirst")}
          aria-label={localizationService.get("GoToFirst")}
        >
          <Chevron direction="up" />
        </button>
      )}
    </div>
  );
};

function Chevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={direction === "up" ? "rotate-180" : undefined}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3.2L12 18V6L7.2 10H4z" fill="currentColor" />
      <path
        d="M16 9.2a4 4 0 0 1 0 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

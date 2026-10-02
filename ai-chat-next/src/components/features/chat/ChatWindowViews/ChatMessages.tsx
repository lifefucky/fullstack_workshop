// src/components/features/chat/ChatWindowViews/ChatMessages.tsx

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
}: ChatMessagesProps) => (
  <div className="relative min-h-0 flex-1 overflow-hidden">
    <button
      onClick={scrollToBottom}
      className="absolute right-4 top-2 z-10 rounded-full border border-line bg-white p-1 text-ink shadow-sm hover:bg-surface"
      title={localizationService.get("GoToLatest")}
    >
      ▼
    </button>

    <div className="flex h-full flex-col space-y-4 overflow-y-auto px-4 py-2 md:px-8">
      <div ref={topRef} />
      {messages.map(msg => (
        <div key={msg.id} className="space-y-2">
          <div className="ml-auto w-fit max-w-[85%] break-words rounded-2xl bg-[#e8f0ff] px-4 py-2 text-ink">
            {msg.prompt}
          </div>
          {msg.answers.map(ans =>
            /\.(png|jpe?g|gif)$/i.test(ans.content) ? (
              <ImageOutput key={ans.id} url={ans.content} />
            ) : (
              <div
                key={ans.id}
                className="mr-auto flex w-fit min-w-0 max-w-[85%] items-start break-words rounded-2xl border border-line bg-white p-3 text-ink shadow-sm"
              >
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
                  className="ml-2 shrink-0 text-lg"
                  title={
                    speakingId === ans.id
                      ? localizationService.get("Stop")
                      : localizationService.get("Play")
                  }
                >
                  {speakingId === ans.id ? "⏸️" : "🔊"}
                </button>
              </div>
            )
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>

    <button
      onClick={scrollToTop}
      className="absolute bottom-2 right-4 z-10 rounded-full border border-line bg-white p-1 text-ink shadow-sm hover:bg-surface"
      title={localizationService.get("GoToFirst")}
    >
      ▲
    </button>
  </div>
);

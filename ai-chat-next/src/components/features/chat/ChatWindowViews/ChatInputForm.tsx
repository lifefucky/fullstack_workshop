// src/components/features/chat/ChatWindowViews/ChatInputForm.tsx
import { useRef } from "react";
import { localizationService } from "@/services/localizationService";

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  send: (e: React.FormEvent) => void;
  isSending: boolean;
  startListening: () => void;
  sendButtonRef: React.RefObject<HTMLButtonElement | null>;
  locked?: boolean;
}

export const ChatInputForm = ({
  input,
  setInput,
  send,
  isSending,
  startListening,
  sendButtonRef,
  locked = false,
}: ChatInputFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const cannotSend = locked || isSending || !input.trim();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!locked) formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={event => {
        if (locked) {
          event.preventDefault();
          return;
        }
        send(event);
      }}
      className="px-4 pb-4 pt-2 md:px-6"
    >
      <div className="mx-auto w-full max-w-3xl rounded-[24px] border border-line bg-white p-3 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            locked
              ? localizationService.get("ChooseChat")
              : localizationService.get("Your question...")
          }
          className="w-full bg-transparent px-2 py-2 text-ink outline-none placeholder:text-mute"
          disabled={isSending || locked}
        />
        <div className="mt-1 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={startListening}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:bg-surface disabled:opacity-40"
            title="Voice input"
            disabled={isSending || locked}
            aria-label="Voice input"
          >
            <MicIcon />
          </button>
          <button
            ref={sendButtonRef}
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-40"
            disabled={cannotSend}
          >
            {isSending ? "…" : localizationService.get("Send")}
          </button>
        </div>
      </div>
    </form>
  );
};

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 11a6 6 0 0 0 12 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

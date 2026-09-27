// src/components/features/chat/ChatWindowContainer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { demoMessages } from "@/data/demoChat";
import { ChatWindowView } from "@features/chat/ChatWindowViews/ChatWindowView";

type Props = {
  categoryId: string;
  categoryName: string;
};

export default function ChatWindowContainer({ categoryId, categoryName }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messages = demoMessages[categoryId] || [];
  const [audioModalOpen, setAudioModalOpen] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [categoryId]);

  return (
    <ChatWindowView
      categoryName={categoryName}
      messages={messages}
      bottomRef={bottomRef}
      audioModalOpen={audioModalOpen}
      setAudioModalOpen={setAudioModalOpen}
    />
  );
}

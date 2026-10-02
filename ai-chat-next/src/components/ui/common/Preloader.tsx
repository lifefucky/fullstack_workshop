// ai-chat-next/src/components/ui/common/Preloader.tsx
import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="flex-1 p-4 space-y-4 animate-pulse">
      {/* Имитация трех строк чата */}
      <div className="h-4 w-3/4 rounded bg-line"></div>
      <div className="h-4 w-1/2 rounded bg-line"></div>
      <div className="h-4 w-5/6 rounded bg-line"></div>

      <div className="mt-6 h-4 w-2/3 rounded bg-line"></div>
      <div className="h-4 w-1/3 rounded bg-line"></div>
      <div className="h-4 w-4/5 rounded bg-line"></div>
    </div>
  );
};

export default ChatSkeleton;

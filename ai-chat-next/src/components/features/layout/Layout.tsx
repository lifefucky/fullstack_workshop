// src/components/features/layout/Layout.tsx
import { FC, ReactNode, useEffect } from "react";
import { audioService } from "@/services/audioService";
import { MobileHeader } from "@features/layout/MobileHeader";
import { DesktopHeader } from "@features/layout/DesktopHeader";

export type LayoutProps = {
  children: ReactNode;
  onNewChat: () => void;
};

export const Layout: FC<LayoutProps> = ({ children, onNewChat }) => {
  useEffect(() => {
    audioService.playMusic("/music/track.mp3");
    return () => audioService.stopMusic();
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-card">
      <MobileHeader onNewChat={onNewChat} />
      <DesktopHeader onNewChat={onNewChat} />
      <main className="flex min-h-0 flex-1 flex-col bg-surface">{children}</main>
    </div>
  );
};

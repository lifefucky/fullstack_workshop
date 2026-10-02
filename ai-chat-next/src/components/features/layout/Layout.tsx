// src/components/features/layout/Layout.tsx
import { FC, ReactNode } from "react";
import { MobileHeader } from "@features/layout/MobileHeader";
import { DesktopHeader } from "@features/layout/DesktopHeader";

export type LayoutProps = {
  children: ReactNode;
  onNewChat: () => void;
  showNewChat: boolean;
};

export const Layout: FC<LayoutProps> = ({ children, onNewChat, showNewChat }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white shadow-card">
      <MobileHeader onNewChat={onNewChat} showNewChat={showNewChat} />
      <DesktopHeader onNewChat={onNewChat} showNewChat={showNewChat} />
      <main className="flex min-h-0 flex-1 flex-col bg-surface">{children}</main>
    </div>
  );
};

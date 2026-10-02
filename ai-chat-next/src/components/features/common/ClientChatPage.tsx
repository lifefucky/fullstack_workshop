// src/components/features/common/ClientChatPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { Layout } from "@features/layout/Layout";
import ChatWindowContainer from "@features/chat/ChatWindowContainer";
import HomeScreen from "@features/chat/HomeScreen";
import { RootState } from "@/store/store";
import Notification from "@features/common/Notification";
import useBackendWakeUp from "@/hooks/useBackendWakeUp";
import { useModels } from "@/hooks/useModels";
import ChatSkeleton from "@ui/common/Preloader";
import { ErrorBoundary } from "@ui/common/ErrorBoundary";

export default function ClientChatPage({ session }: { session: Session | null }) {
  const [selected, setSelected] = useState<null | { id: string; name: string }>(null);
  useSelector((state: RootState) => state.language.current);

  const isWakingUp = useBackendWakeUp();
  const { isLoadingModels } = useModels(); // 💡 Модели подгружаются сразу

  useEffect(() => {
    setSelected(null);
  }, [session]);

  useEffect(() => {
    if (!session) {
      localStorage.removeItem("auto-guest-login");
    }
  }, [session]);

  useEffect(() => {
    const alreadyAutoLoggedIn = localStorage.getItem("auto-guest-login");
    const justSignedOutAt = parseInt(sessionStorage.getItem("justSignedOutAt") || "0", 10);
    const recentlySignedOut = Date.now() - justSignedOutAt < 5000;

    if (!session && !alreadyAutoLoggedIn && !recentlySignedOut) {
      const email = process.env.NEXT_PUBLIC_GUEST_EMAIL;
      const password = process.env.NEXT_PUBLIC_GUEST_PASSWORD;

      if (!email || !password) {
        console.error("Guest auto-login credentials are not configured");
        return;
      }

      signIn("credentials", { email, password, redirect: false }).then(() => {
        localStorage.setItem("auto-guest-login", "true");
      });
    }
  }, [session]);

  if (isWakingUp) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-canvas">
        <ChatSkeleton />
        <span className="ml-2 text-mute">Пробуждаем сервер, ждем…</span>
      </div>
    );
  }

  if (isLoadingModels) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center bg-canvas">
        <ChatSkeleton />
        <span className="ml-2 text-mute">Загружаем модели..</span>
      </div>
    );
  }

  return (
    <div className="h-screen bg-canvas p-3 sm:p-4 md:p-6">
      <Notification />
      <Layout onNewChat={() => setSelected(null)}>
        {selected ? (
          <ErrorBoundary>
            <ChatWindowContainer
              key={selected.id}
              categoryId={selected.id}
              categoryName={selected.name}
              onBack={() => setSelected(null)}
            />
          </ErrorBoundary>
        ) : (
          <HomeScreen onSelect={(id, name) => setSelected({ id, name })} />
        )}
      </Layout>
    </div>
  );
}

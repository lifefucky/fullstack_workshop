// src/components/features/common/ClientChatPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { localizationService } from "@/services/localizationService";
import { Layout } from "@features/layout/Layout";
import ChatWindowContainer from "@features/chat/ChatWindowContainer";
import { AppDispatch, RootState } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import Notification from "@features/common/Notification";

export default function ClientChatPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState<null | { id: string; name: string }>(null);
  useSelector((state: RootState) => state.language.current);

  useEffect(() => {
    dispatch(showNotification(localizationService.get("WelcomeMessage"), "info", 3));
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-black">
      <Notification />
      <Layout onCategorySelect={(id, name) => setSelected({ id, name })}>
        {selected ? (
          <ChatWindowContainer
            key={selected.id}
            categoryId={selected.id}
            categoryName={selected.name}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            {localizationService.get("SelectCategory")}
          </div>
        )}
      </Layout>
    </div>
  );
}

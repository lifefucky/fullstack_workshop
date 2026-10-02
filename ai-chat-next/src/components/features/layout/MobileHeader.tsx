// src/components/features/layout/MobileHeader.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch, RootState } from "@/store/store";
import { languageActions } from "@/reducers/languageReducer";
import { localizationService } from "@/services/localizationService";
import { useUserSession } from "@/hooks/useUserSession";
import { MobileHeaderView } from "./Views/MobileHeaderView";
import { useModelControls } from "./useModelControls";

export interface MobileHeaderProps {
  onNewChat: () => void;
}

export const MobileHeader: FC<MobileHeaderProps> = ({ onNewChat }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentLanguage = useSelector((state: RootState) => state.language.current);
  const { session, status, isLoading, userName } = useUserSession();
  const model = useModelControls();
  const [, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (session) return;
    if (window.innerWidth < 768) {
      dispatch(showNotification(localizationService.get("MobileLoginOnly"), "info", 5));
    }
  }, [session, dispatch]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  if (isLoading || status === "loading") {
    return (
      <header className="flex items-center px-4 py-3 text-sm text-mute md:hidden">
        {localizationService.get("LoadingCategories")}
      </header>
    );
  }

  return (
    <MobileHeaderView
      onNewChat={onNewChat}
      currentLanguage={currentLanguage}
      onLanguageChange={lang => dispatch(languageActions.setLanguage(lang))}
      session={session}
      userName={userName}
      status={status}
      handleRefresh={handleRefresh}
      modelType={model.modelType}
      selectedModel={model.selectedModel}
      availableModels={model.availableModels}
      onModelTypeChange={model.onModelTypeChange}
      onModelChange={model.onModelChange}
    />
  );
};

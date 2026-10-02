// src/components/features/layout/DesktopHeader.tsx
"use client";

import { FC, useRef } from "react";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { languageActions } from "@/reducers/languageReducer";
import { useUserSession } from "@/hooks/useUserSession";
import { DesktopHeaderView } from "./Views/DesktopHeaderView";
import { useModelControls } from "./useModelControls";

export interface DesktopHeaderProps {
  onNewChat: () => void;
}

export const DesktopHeader: FC<DesktopHeaderProps> = ({ onNewChat }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentLanguage = useSelector((state: RootState) => state.language.current);
  const { session, userName } = useUserSession();
  const model = useModelControls();
  const loginRef = useRef<{ toggleVisibility(): void } | null>(null);
  const registerRef = useRef<{ toggleVisibility(): void } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("auto-guest-login");
    sessionStorage.setItem("justSignedOutAt", Date.now().toString());
    signOut();
  };

  return (
    <DesktopHeaderView
      session={session}
      userName={userName}
      currentLanguage={currentLanguage}
      onLanguageChange={lang => dispatch(languageActions.setLanguage(lang))}
      loginRef={loginRef}
      registerRef={registerRef}
      onLogout={handleLogout}
      onNewChat={onNewChat}
      modelType={model.modelType}
      selectedModel={model.selectedModel}
      availableModels={model.availableModels}
      onModelTypeChange={model.onModelTypeChange}
      onModelChange={model.onModelChange}
    />
  );
};

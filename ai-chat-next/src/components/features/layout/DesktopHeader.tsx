// src/components/features/layout/DesktopHeader.tsx
"use client";

import { FC, useRef } from "react";
import { signOut } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { modelActions } from "@/reducers/modelReducer";
import { languageActions } from "@/reducers/languageReducer";
import { useUserSession } from "@/hooks/useUserSession";
import { DesktopHeaderView } from "./Views/DesktopHeaderView";

export interface DesktopHeaderProps {
  modelType: ModelType;
  selectedModel: string;
}

export const DesktopHeader: FC<DesktopHeaderProps> = ({
  modelType,
  selectedModel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const availableModels = useSelector((state: RootState) => state.availableModels);
  const { session, userName } = useUserSession();
  const loginRef = useRef<{ toggleVisibility(): void } | null>(null);
  const registerRef = useRef<{ toggleVisibility(): void } | null>(null);

  const handleLanguageChange = (lang: "ru" | "en") => {
    dispatch(languageActions.setLanguage(lang));
  };

  const handleLogout = () => {
    localStorage.removeItem("auto-guest-login");
    sessionStorage.setItem("justSignedOutAt", Date.now().toString());
    signOut();
  };

  return (
    <DesktopHeaderView
      modelType={modelType}
      selectedModel={selectedModel}
      session={session}
      userName={userName}
      onLanguageChange={handleLanguageChange}
      onModelTypeChange={type => dispatch(modelActions.setModelType(type))}
      onModelChange={id => dispatch(modelActions.setModel(id))}
      loginRef={loginRef}
      registerRef={registerRef}
      onLogout={handleLogout}
      availableModels={availableModels}
    />
  );
};

// src/components/features/layout/Views/MobileHeaderView.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { localizationService } from "@/services/localizationService";
import { UserAvatar } from "./UserAvatar";
import { ModelPicker } from "./ModelPicker";

interface MobileHeaderViewProps {
  onNewChat: () => void;
  currentLanguage: "ru" | "en";
  onLanguageChange(lang: "ru" | "en"): void;
  session: Session | null;
  userName: string;
  status: "authenticated" | "unauthenticated" | "loading";
  handleRefresh: () => void;
  modelType: ModelType;
  selectedModel: string;
  availableModels: ModelOptions;
  onModelTypeChange: (type: ModelType) => void;
  onModelChange: (id: string) => void;
}

export const MobileHeaderView: FC<MobileHeaderViewProps> = ({
  onNewChat,
  currentLanguage,
  onLanguageChange,
  session,
  userName,
  status,
  handleRefresh,
  modelType,
  selectedModel,
  availableModels,
  onModelTypeChange,
  onModelChange,
}) => {
  return (
    <header className="flex shrink-0 flex-col gap-2 border-b border-line bg-white px-3 py-2.5 md:hidden">
      <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-sm text-ink">
        ✦
      </span>

      <button
        type="button"
        onClick={onNewChat}
        className="rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-white"
      >
        {localizationService.get("NewChat")}
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => onLanguageChange("en")}
          className={`px-1.5 text-xs ${currentLanguage === "en" ? "font-semibold text-ink" : "text-mute"}`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange("ru")}
          className={`px-1.5 text-xs ${currentLanguage === "ru" ? "font-semibold text-ink" : "text-mute"}`}
        >
          RU
        </button>

        {status === "loading" ? (
          <span className="px-2 text-mute">⟳</span>
        ) : session ? (
          <>
            <Link href="/user" aria-label={localizationService.get("profile")}>
              <UserAvatar name={userName} size="sm" />
            </Link>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("auto-guest-login");
                sessionStorage.setItem("justSignedOutAt", Date.now().toString());
                signOut();
              }}
              className="px-1 text-xs text-mute"
              aria-label={localizationService.get("Logout")}
            >
              {localizationService.get("Logout")}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleRefresh}
            className="px-2 text-ink"
            aria-label="Refresh"
          >
            ⟳
          </button>
        )}
        </div>
      </div>
      <ModelPicker
        modelType={modelType}
        selectedModel={selectedModel}
        availableModels={availableModels}
        onModelTypeChange={onModelTypeChange}
        onModelChange={onModelChange}
      />
    </header>
  );
};

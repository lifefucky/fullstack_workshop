// src/components/features/layout/Views/DesktopHeaderView.tsx
"use client";

import { FC, RefObject } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { localizationService } from "@/services/localizationService";
import Modal from "@ui/common/Modal";
import ModalTogglable from "@features/common/ModalTogglable";
import BaseForm from "@features/users/BaseForm";
import { UserAvatar } from "./UserAvatar";
import { ModelPicker } from "./ModelPicker";

interface Props {
  session: Session | null;
  userName: string;
  currentLanguage: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
  loginRef: RefObject<{ toggleVisibility(): void } | null>;
  registerRef: RefObject<{ toggleVisibility(): void } | null>;
  onLogout: () => void;
  onNewChat: () => void;
  modelType: ModelType;
  selectedModel: string;
  availableModels: ModelOptions;
  onModelTypeChange: (type: ModelType) => void;
  onModelChange: (id: string) => void;
}

const langClass = (active: boolean) =>
  `px-2 py-1 text-sm ${active ? "font-semibold text-ink" : "text-mute hover:text-ink"}`;

export const DesktopHeaderView: FC<Props> = ({
  session,
  userName,
  currentLanguage,
  onLanguageChange,
  loginRef,
  registerRef,
  onLogout,
  onNewChat,
  modelType,
  selectedModel,
  availableModels,
  onModelTypeChange,
  onModelChange,
}) => {
  return (
    <header className="hidden shrink-0 items-center gap-3 border-b border-line bg-white px-4 py-3 md:flex">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-sm text-ink">
          ✦
        </span>
        <span className="hidden shrink-0 font-semibold text-ink lg:inline">
          {localizationService.get("Brand")}
        </span>
        <ModelPicker
          modelType={modelType}
          selectedModel={selectedModel}
          availableModels={availableModels}
          onModelTypeChange={onModelTypeChange}
          onModelChange={onModelChange}
        />
      </div>

      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={onNewChat}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          {localizationService.get("NewChat")}
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        <div className="flex items-center">
          <button type="button" onClick={() => onLanguageChange("en")} className={langClass(currentLanguage === "en")}>
            EN
          </button>
          <button type="button" onClick={() => onLanguageChange("ru")} className={langClass(currentLanguage === "ru")}>
            RU
          </button>
        </div>

        {session ? (
          <>
            <Link href="/user" title={userName} aria-label={localizationService.get("profile")}>
              <UserAvatar name={userName} />
            </Link>
            <button type="button" onClick={onLogout} className="text-sm text-mute hover:text-ink">
              {localizationService.get("Logout")}
            </button>
          </>
        ) : (
          <>
            <ModalTogglable buttonLabel={localizationService.get("LogIn")} ref={loginRef}>
              <Modal onClose={() => loginRef.current?.toggleVisibility()}>
                <BaseForm type="login" onClose={() => loginRef.current?.toggleVisibility()} />
              </Modal>
            </ModalTogglable>
            <ModalTogglable buttonLabel={localizationService.get("Register")} ref={registerRef}>
              <Modal onClose={() => registerRef.current?.toggleVisibility()}>
                <BaseForm type="register" onClose={() => registerRef.current?.toggleVisibility()} />
              </Modal>
            </ModalTogglable>
          </>
        )}
      </div>
    </header>
  );
};

// src/components/features/layout/DesktopHeader.tsx
"use client";

import { FC } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { modelActions } from "@/reducers/modelReducer";
import { languageActions } from "@/reducers/languageReducer";
import { ModelType } from "@/data/ModelOptions";
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

  const handleLanguageChange = (lang: "ru" | "en") => {
    dispatch(languageActions.setLanguage(lang));
  };

  return (
    <DesktopHeaderView
      modelType={modelType}
      selectedModel={selectedModel}
      onChangeLanguage={handleLanguageChange}
      onChangeModelType={type => dispatch(modelActions.setModelType(type))}
      onChangeModel={id => dispatch(modelActions.setModel(id))}
    />
  );
};

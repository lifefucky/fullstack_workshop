// src/components/features/layout/MobileHeader.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { languageActions } from "@/reducers/languageReducer";
import { localizationService } from "@/services/localizationService";
import { modelActions } from "@/reducers/modelReducer";
import { MODEL_OPTIONS, ModelType } from "@/data/ModelOptions";

export interface MobileHeaderProps {
  modelType: ModelType;
  selectedModel: string;
  onMenuToggle: () => void;
}

export const MobileHeader: FC<MobileHeaderProps> = ({ modelType, selectedModel, onMenuToggle }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLanguageChange = (lang: "ru" | "en") => {
    dispatch(languageActions.setLanguage(lang));
  };

  return (
    <header className="md:hidden flex items-center justify-between bg-gray-800 px-3 py-2 shadow">
      {/* Кнопка меню */}
      <button
        onClick={onMenuToggle}
        className="p-2 text-white hover:bg-gray-700 rounded"
        aria-label="Открыть меню"
      >
        ☰
      </button>

      {/* Языковые кнопки */}
      <div className="flex-1 mx-2 space-y-1">
        <div className="flex justify-center space-x-1">
          <button
            onClick={() => handleLanguageChange("en")}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            EN
          </button>
          <button
            onClick={() => handleLanguageChange("ru")}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
          >
            RU
          </button>
        </div>

        {/* Селекторы модели (упрощенная версия для мобилки) */}
        <div className="flex justify-center space-x-1">
          <select
            value={modelType}
            onChange={e => {
              const newType = e.target.value as ModelType;
              dispatch(modelActions.setModelType(newType));
            }}
            className="bg-gray-700 text-white text-xs rounded px-1 py-0.5"
          >
            <option value="text">{localizationService.get("model_type_text")}</option>
            <option value="code">{localizationService.get("model_type_code")}</option>
            <option value="image">{localizationService.get("model_type_image")}</option>
          </select>

          <select
            value={selectedModel}
            onChange={e => {
              const newModel = e.target.value;
              dispatch(modelActions.setModel(newModel));
            }}
            className="bg-gray-700 text-white text-xs rounded px-1 py-0.5"
          >
            {MODEL_OPTIONS[modelType].map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Link href="#" className="text-white text-lg">
        🧑
      </Link>
    </header>
  );
};

// src/components/features/layout/Views/MobileHeaderView.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { MODEL_OPTIONS, ModelType } from "@/data/ModelOptions";
import { localizationService } from "@/services/localizationService";

export interface MobileHeaderViewProps {
  modelType: ModelType;
  selectedModel: string;
  onMenuToggle: () => void;
  onChangeLanguage: (lang: "ru" | "en") => void;
  onChangeModelType: (type: ModelType) => void;
  onChangeModel: (id: string) => void;
}

export const MobileHeaderView: FC<MobileHeaderViewProps> = ({
  modelType,
  selectedModel,
  onMenuToggle,
  onChangeLanguage,
  onChangeModelType,
  onChangeModel,
}) => (
  <header className="md:hidden flex items-center justify-between bg-gray-800 px-3 py-2 shadow">
    <button
      onClick={onMenuToggle}
      className="p-2 text-white hover:bg-gray-700 rounded"
      aria-label="Открыть меню"
    >
      ☰
    </button>

    <div className="flex-1 mx-2 space-y-1">
      <div className="flex justify-center space-x-1">
        <button
          onClick={() => onChangeLanguage("en")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          EN
        </button>
        <button
          onClick={() => onChangeLanguage("ru")}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
        >
          RU
        </button>
      </div>

      <div className="flex justify-center space-x-1">
        <select
          value={modelType}
          onChange={e => onChangeModelType(e.target.value as ModelType)}
          className="bg-gray-700 text-white text-xs rounded px-1 py-0.5"
        >
          <option value="text">{localizationService.get("model_type_text")}</option>
          <option value="code">{localizationService.get("model_type_code")}</option>
          <option value="image">{localizationService.get("model_type_image")}</option>
        </select>

        <select
          value={selectedModel}
          onChange={e => onChangeModel(e.target.value)}
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

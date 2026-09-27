// src/components/features/layout/Views/DesktopHeaderView.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { MODEL_OPTIONS, ModelType } from "@/data/ModelOptions";
import { localizationService } from "@/services/localizationService";

export interface DesktopHeaderViewProps {
  modelType: ModelType;
  selectedModel: string;
  onChangeLanguage: (lang: "ru" | "en") => void;
  onChangeModelType: (type: ModelType) => void;
  onChangeModel: (id: string) => void;
}

export const DesktopHeaderView: FC<DesktopHeaderViewProps> = ({
  modelType,
  selectedModel,
  onChangeLanguage,
  onChangeModelType,
  onChangeModel,
}) => (
  <header className="hidden md:flex sticky top-0 z-40 bg-gray-800 px-4 py-3 items-center justify-between">
    <div className="flex gap-2">
      <button onClick={() => onChangeLanguage("ru")} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">RU</button>
      <button onClick={() => onChangeLanguage("en")} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">EN</button>
    </div>

    <div className="flex items-center space-x-4">
      <select
        value={modelType}
        onChange={e => onChangeModelType(e.target.value as ModelType)}
        className="border px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
      >
        <option value="text">{localizationService.get("model_type_text")}</option>
        <option value="code">{localizationService.get("model_type_code")}</option>
        <option value="image">{localizationService.get("model_type_image")}</option>
      </select>

      <select
        value={selectedModel}
        onChange={e => onChangeModel(e.target.value)}
        className="border px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
      >
        {MODEL_OPTIONS[modelType].map(m => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>

    <Link href="#" className="underline text-gray-300 hover:text-blue-400">
      {localizationService.get("profile")}
    </Link>
  </header>
);

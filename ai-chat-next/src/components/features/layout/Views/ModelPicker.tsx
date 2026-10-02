"use client";

import { FC } from "react";
import { localizationService } from "@/services/localizationService";

interface ModelPickerProps {
  modelType: ModelType;
  selectedModel: string;
  availableModels: ModelOptions;
  onModelTypeChange: (type: ModelType) => void;
  onModelChange: (id: string) => void;
}

const typeClass =
  "w-[6.5rem] shrink-0 appearance-none truncate bg-transparent py-1.5 pl-3 pr-7 text-sm text-ink outline-none";
const modelClass =
  "w-full max-w-[11rem] appearance-none truncate bg-transparent py-1.5 pl-3 pr-7 text-sm text-ink outline-none sm:max-w-[22rem]";

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-mute"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const ModelPicker: FC<ModelPickerProps> = ({
  modelType,
  selectedModel,
  availableModels,
  onModelTypeChange,
  onModelChange,
}) => {
  const models = availableModels[modelType] ?? [];

  return (
    <div className="inline-flex max-w-full items-center rounded-full border border-line bg-white shadow-sm">
      <div className="relative">
        <select
          value={modelType}
          onChange={e => onModelTypeChange(e.target.value as ModelType)}
          className={typeClass}
          aria-label={localizationService.get("Texts")}
        >
          <option value="text">{localizationService.get("Texts")}</option>
          <option value="code">{localizationService.get("Codes")}</option>
          <option value="image">{localizationService.get("Images")}</option>
        </select>
        <Chevron />
      </div>
      <span className="h-4 w-px bg-line" />
      <div className="relative min-w-0">
        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          className={modelClass}
          title={models.find(model => model.id === selectedModel)?.name}
          aria-label={localizationService.get(
            modelType === "code" ? "Codes" : modelType === "image" ? "Images" : "Texts"
          )}
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <Chevron />
      </div>
    </div>
  );
};

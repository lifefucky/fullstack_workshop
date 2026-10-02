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
  "w-[5.75rem] shrink-0 appearance-none bg-transparent py-1.5 pl-3 pr-6 text-sm text-ink outline-none";
const modelClass =
  "max-w-[11rem] appearance-none bg-transparent py-1.5 pl-3 pr-7 text-sm text-ink outline-none sm:max-w-[22rem]";

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
      <span className="h-4 w-px bg-line" />
      <select
        value={selectedModel}
        onChange={e => onModelChange(e.target.value)}
        className={modelClass}
        aria-label={localizationService.get("model_type_text")}
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

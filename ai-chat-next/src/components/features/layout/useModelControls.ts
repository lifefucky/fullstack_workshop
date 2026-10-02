"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { modelActions } from "@/reducers/modelReducer";

export function useModelControls() {
  const dispatch = useDispatch<AppDispatch>();
  const availableModels = useSelector((state: RootState) => state.availableModels);
  const modelType = useSelector((state: RootState) => state.model.modelType);
  const selectedModel = useSelector((state: RootState) => state.model.selectedModel);

  const onModelTypeChange = (type: ModelType) => {
    dispatch(modelActions.setModelType(type));
    const options = availableModels[type] ?? [];
    if (options.length > 0 && !options.some(model => model.id === selectedModel)) {
      dispatch(modelActions.setModel(options[0].id));
    }
  };

  return {
    modelType,
    selectedModel,
    availableModels,
    onModelTypeChange,
    onModelChange: (id: string) => dispatch(modelActions.setModel(id)),
  };
}

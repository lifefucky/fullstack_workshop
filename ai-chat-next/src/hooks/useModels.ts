// src/hooks/useModels.ts
import { useGetModelsQuery } from "@/services/chatApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setAvailableModels } from "@/reducers/availableModelsReducer";
import { modelActions } from "@/reducers/modelReducer";

export const useModels = () => {
  const { data, isLoading, refetch } = useGetModelsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 3600000, // обновление раз в час
  });

  const dispatch = useDispatch<AppDispatch>();
  const modelType = useSelector((state: RootState) => state.model.modelType);
  const selectedModel = useSelector((state: RootState) => state.model.selectedModel);

  useEffect(() => {
    if (!data || isLoading) return;

    dispatch(setAvailableModels(data));

    const source =
      modelType === "image"
        ? data.image_models
        : modelType === "code"
          ? data.code_models
          : data.text_models;
    const ids = (source ?? []).map(model => model.model_id);
    if (ids.length > 0 && !ids.includes(selectedModel)) {
      dispatch(modelActions.setModel(ids[0]));
    }
  }, [data, isLoading, dispatch, modelType, selectedModel]);

  return {
    isLoadingModels: isLoading,
    refetchModels: refetch,
  };
};

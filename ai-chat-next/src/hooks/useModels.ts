// src/hooks/useModels.ts
import { useGetModelsQuery } from "@/services/chatApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setAvailableModels } from "@/reducers/availableModelsReducer";
import { modelActions } from "@/reducers/modelReducer";

export const useModels = () => {
  const { data, isLoading, refetch } = useGetModelsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 3600000, // обновление раз в час
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data && !isLoading) {
      // 1. Сохраняем доступные модели в store
      dispatch(setAvailableModels(data));

      // 2. Устанавливаем первую текстовую модель по умолчанию
      if (data.text_models?.length > 0) {
        dispatch(modelActions.setModel(data.text_models[0].model_id));
      }
    }
  }, [data, isLoading, dispatch]);

  return {
    isLoadingModels: isLoading,
    refetchModels: refetch,
  };
};

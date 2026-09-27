import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModelType = "text" | "code" | "image";

interface ModelState {
  modelType: ModelType;
  selectedModel: string;
}

const initialState: ModelState = {
  modelType: "text",
  selectedModel: "deepseek_qwen3",
};

function getDefaultModelForType(type: ModelType): string {
  const models = {
    text: "deepseek_qwen3",
    code: "openai/o4-mini",
    image: "flux_schnell_free",
  };
  return models[type];
}

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setModelType: (state, action: PayloadAction<ModelType>) => {
      state.modelType = action.payload;
      state.selectedModel = getDefaultModelForType(action.payload);
    },
    setModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
  },
});

export const modelActions = modelSlice.actions;
export default modelSlice.reducer;

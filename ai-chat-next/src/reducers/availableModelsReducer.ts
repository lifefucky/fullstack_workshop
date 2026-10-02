import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvailableModelsState {
  text: Array<{ id: string; name: string }>;
  code: Array<{ id: string; name: string }>;
  image: Array<{ id: string; name: string }>;
}

const initialState: AvailableModelsState = {
  text: [],
  code: [],
  image: [],
};

export const availableModelsSlice = createSlice({
  name: "availableModels",
  initialState,
  reducers: {
    setAvailableModels: (state, action: PayloadAction<{
      text_models: Array<{ brand: string; model_id: string; name?: string }>;
      code_models: Array<{ brand: string; model_id: string; name?: string }>;
      image_models?: Array<{ brand: string; model_id: string; name?: string }>;
    }>) => {
      const label = (model: { brand: string; name?: string }) =>
        model.name || model.brand.charAt(0).toUpperCase() + model.brand.slice(1);
      state.text = action.payload.text_models.map(m => ({
        id: m.model_id,
        name: label(m),
      }));
      state.code = action.payload.code_models.map(m => ({
        id: m.model_id,
        name: label(m),
      }));
      state.image = (action.payload.image_models ?? []).map(m => ({
        id: m.model_id,
        name: label(m),
      }));
    },
  },
});

export const { setAvailableModels } = availableModelsSlice.actions;
export default availableModelsSlice.reducer;

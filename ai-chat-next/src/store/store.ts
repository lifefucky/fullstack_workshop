import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "@/reducers/notificationReducer";
import modelReducer from "@/reducers/modelReducer";
import languageReducer from "@/reducers/languageReducer";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    model: modelReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

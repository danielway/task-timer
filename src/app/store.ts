import { configureStore } from "@reduxjs/toolkit";
import task from "./slice";

const persistedStateJson = localStorage.getItem("state");
const persistedState = persistedStateJson
  ? JSON.parse(persistedStateJson)
  : null;

export const store = configureStore({
  preloadedState: persistedState,
  reducer: {
    tasks: task,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    (store) => (next) => (action) => {
      next(action);

      const state = store.getState();
      localStorage.setItem("state", JSON.stringify(state));
    },
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

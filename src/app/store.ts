import { configureStore } from "@reduxjs/toolkit";
import app from "./appSlice";
import edit from "./editSlice";
import date from "./dateSlice";
import task from "./taskSlice";
import time from "./timeSlice";

const loadState = () => {
  const persistedStateJson = localStorage.getItem("state");
  const persistedState = persistedStateJson
    ? JSON.parse(persistedStateJson)
    : undefined;

  // Future migrations go here

  return persistedState;
};

const saveState = (state: RootState) => {
  localStorage.setItem("state", JSON.stringify(state));
};

export const store = configureStore({
  preloadedState: loadState(),
  reducer: { app, edit, date, task, time },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    (store) => (next) => (action) => {
      next(action);

      const state = store.getState();
      saveState(state);
    },
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

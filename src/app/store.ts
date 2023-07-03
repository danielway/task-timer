import { configureStore } from "@reduxjs/toolkit";
import task from "./slice";

export const store = configureStore({
  reducer: {
    tasks: task,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

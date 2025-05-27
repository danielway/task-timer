import { configureStore, combineReducers } from '@reduxjs/toolkit';
import app from './slices/appSlice';
import edit from './slices/editSlice';
import date from './slices/dateSlice';
import task from './slices/taskSlice';
import time from './slices/timeSlice';

const rootReducer = combineReducers({
  app,
  edit,
  date,
  task,
  time,
});

export type RootState = ReturnType<typeof rootReducer>;

const loadState = () => {
  const persistedStateJson = localStorage.getItem('state');
  const persistedState = persistedStateJson
    ? JSON.parse(persistedStateJson)
    : undefined;

  // Stored state migrations can be added here

  return persistedState;
};

const saveState = (state: RootState) => {
  localStorage.setItem('state', JSON.stringify(state));
};

import type { Middleware } from '@reduxjs/toolkit';

const persistenceMiddleware: Middleware<object, RootState> = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);
      saveState(store.getState());
      return result;
    };
  };
};

export const store = configureStore({
  preloadedState: loadState(),
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export type AppDispatch = typeof store.dispatch;

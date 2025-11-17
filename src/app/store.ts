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
  try {
    const persistedStateJson = localStorage.getItem('state');
    if (!persistedStateJson) {
      return undefined;
    }

    const persistedState = JSON.parse(persistedStateJson);

    // Stored state migrations can be added here

    return persistedState;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    // Clear corrupted state
    try {
      localStorage.removeItem('state');
    } catch {
      // Ignore errors when clearing
    }
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    // Could be quota exceeded or localStorage disabled
  }
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

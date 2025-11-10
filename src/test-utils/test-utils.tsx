import { configureStore } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';
import app from '../app/slices/appSlice';
import edit from '../app/slices/editSlice';
import date from '../app/slices/dateSlice';
import task from '../app/slices/taskSlice';
import time from '../app/slices/timeSlice';
import type { RootState } from '../app/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { app, edit, date, task, time },
      preloadedState: preloadedState as RootState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function createMockDate(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

// Common test dates
export const mockToday = createMockDate(new Date('2024-01-15').getTime());
export const mockYesterday = createMockDate(new Date('2024-01-14').getTime());
export const mockTomorrow = createMockDate(new Date('2024-01-16').getTime());

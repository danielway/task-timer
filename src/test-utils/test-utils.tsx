import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { useAppStore } from '../store/appStore';
import { useTaskStore } from '../store/taskStore';
import { useEditStore } from '../store/editStore';
import { useDateStore } from '../store/dateStore';
import { useTimeStore } from '../store/timeStore';
import type { AppState } from '../store/appStore';
import type { TaskState } from '../store/taskStore';
import type { EditState } from '../store/editStore';
import type { DateState } from '../store/dateStore';
import type { TimeState } from '../store/timeStore';

// Combined state type for compatibility with existing tests
export interface TestState {
  app: AppState;
  task: TaskState;
  edit: EditState;
  date: DateState;
  time: TimeState;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<TestState>;
}

// Reset all stores to initial state
export function resetStores() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  useAppStore.setState({
    version: 'REPLACE_WITH_RELEASE',
    selectedDate: todayTime,
  });
  useTaskStore.setState({
    nextTaskId: 1,
    tasks: [],
  });
  useEditStore.setState({
    selection: undefined,
    activeEditTaskId: undefined,
  });
  useDateStore.setState({
    dateTasks: [{ date: todayTime, tasks: [] }],
  });
  useTimeStore.setState({
    dateTimes: [{ date: todayTime, taskTimes: [] }],
  });
}

// Set up stores with preloaded state
export function setupStores(preloadedState: Partial<TestState> = {}) {
  resetStores();

  if (preloadedState.app) {
    useAppStore.setState(preloadedState.app);
  }
  if (preloadedState.task) {
    useTaskStore.setState(preloadedState.task);
  }
  if (preloadedState.edit) {
    useEditStore.setState(preloadedState.edit);
  }
  if (preloadedState.date) {
    useDateStore.setState(preloadedState.date);
  }
  if (preloadedState.time) {
    useTimeStore.setState(preloadedState.time);
  }
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState = {}, ...renderOptions }: ExtendedRenderOptions = {}
) {
  setupStores(preloadedState);

  return {
    ...render(ui, renderOptions),
    // Provide access to stores for test assertions
    stores: {
      app: useAppStore,
      task: useTaskStore,
      edit: useEditStore,
      date: useDateStore,
      time: useTimeStore,
    },
  };
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

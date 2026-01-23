const STORAGE_KEY = 'state';

// Combined state structure matching the existing Redux state
export interface PersistedState {
  app: {
    version: string;
    selectedDate: number;
  };
  task: {
    nextTaskId: number;
    tasks: Array<{ id: number; description: string; type: string }>;
  };
  date: {
    dateTasks: Array<{ date: number; tasks: number[] }>;
  };
  time: {
    dateTimes: Array<{
      date: number;
      taskTimes: Array<{ task: number; start: number; end?: number }>;
    }>;
  };
  edit: {
    selection?: {
      taskId: number;
      description: boolean;
      timeSegment?: number;
    };
    activeEditTaskId?: number;
  };
}

// Load the entire persisted state from localStorage
export const loadPersistedState = (): PersistedState | undefined => {
  try {
    const persistedStateJson = localStorage.getItem(STORAGE_KEY);
    if (!persistedStateJson) {
      return undefined;
    }

    const persistedState = JSON.parse(persistedStateJson);

    // State migrations can be added here in the future

    return persistedState;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    // Clear corrupted state
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors when clearing
    }
    return undefined;
  }
};

// Save the combined state to localStorage
export const savePersistedState = (state: Partial<PersistedState>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
    // Could be quota exceeded or localStorage disabled
  }
};

// Get a specific slice from persisted state
export const getPersistedSlice = <K extends keyof PersistedState>(
  key: K
): PersistedState[K] | undefined => {
  const state = loadPersistedState();
  return state?.[key];
};

// Registry for store state getters - avoids circular dependencies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StateGetter = () => any;
const storeGetters: Record<string, StateGetter> = {};

export const registerStoreGetter = (key: string, getter: StateGetter): void => {
  storeGetters[key] = getter;
};

// Persist all stores to localStorage
const persistCombinedState = (): void => {
  const appState = storeGetters['app']?.() || {};
  const taskState = storeGetters['task']?.() || {};
  const dateState = storeGetters['date']?.() || {};
  const timeState = storeGetters['time']?.() || {};

  const combinedState: Partial<PersistedState> = {
    app: {
      version: (appState.version as string) || 'REPLACE_WITH_RELEASE',
      selectedDate: appState.selectedDate as number,
    },
    task: {
      nextTaskId: taskState.nextTaskId as number,
      tasks: taskState.tasks as PersistedState['task']['tasks'],
    },
    date: {
      dateTasks: dateState.dateTasks as PersistedState['date']['dateTasks'],
    },
    time: {
      dateTimes: timeState.dateTimes as PersistedState['time']['dateTimes'],
    },
    // Edit state is now part of appStore, but persisted separately for backwards compatibility
    edit: {
      selection: appState.selection as PersistedState['edit']['selection'],
      activeEditTaskId: appState.activeEditTaskId as number | undefined,
    },
  };

  savePersistedState(combinedState);
};

// Allow external triggering of persist
export const triggerPersist = persistCombinedState;

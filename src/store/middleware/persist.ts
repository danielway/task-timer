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

// Registry for all stores - allows us to save the combined state
type StoreGetter = () => unknown;
const storeRegistry = new Map<keyof PersistedState, StoreGetter>();

export const registerStore = (
  key: keyof PersistedState,
  getState: StoreGetter
): void => {
  storeRegistry.set(key, getState);
};

// Persist all stores to localStorage
const persistCombinedState = (): void => {
  const combinedState: Partial<PersistedState> = {};

  storeRegistry.forEach((getState, key) => {
    (combinedState as Record<string, unknown>)[key] = getState();
  });

  savePersistedState(combinedState);
};

// Allow external triggering of persist (for initial setup)
export const triggerPersist = persistCombinedState;

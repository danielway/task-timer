const STORAGE_KEY = 'state';
const CURRENT_VERSION = '2.0.0';

export type TaskStatus = 'new' | 'in_progress' | 'done';

// Combined state structure matching the existing Redux state
export interface PersistedState {
  app: {
    version: string;
    selectedDate: number;
    backlogOpen: boolean;
    backlogExpanded: boolean;
    projectFilter?: number;
    showCompleted: boolean;
  };
  task: {
    nextTaskId: number;
    tasks: Array<{
      id: number;
      description: string;
      type: string;
      status: TaskStatus;
      projectId?: number;
      createdAt: number;
      completedAt?: number;
    }>;
  };
  date: {
    dateTasks: Array<{
      date: number;
      tasks: number[];
      taskFirstWorkTime: Record<number, number>;
    }>;
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
  project: {
    nextProjectId: number;
    projects: Array<{
      id: number;
      name: string;
      color: string;
      description?: string;
      createdAt: number;
      archived: boolean;
    }>;
  };
}

// Migration function for v1 -> v2
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateToV2 = (state: any): PersistedState => {
  const now = Date.now();

  return {
    app: {
      version: CURRENT_VERSION,
      selectedDate: state.app?.selectedDate ?? now,
      backlogOpen: false,
      backlogExpanded: false,
      projectFilter: undefined,
      showCompleted: true,
    },
    task: {
      nextTaskId: state.task?.nextTaskId ?? 1,
      tasks: (state.task?.tasks || []).map(
        (task: { id: number; description: string; type: string }) => ({
          ...task,
          status: 'new' as TaskStatus,
          projectId: undefined,
          createdAt: now,
          completedAt: undefined,
        })
      ),
    },
    date: {
      dateTasks: (state.date?.dateTasks || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dt: any) => ({
          date: dt.date,
          tasks: dt.tasks,
          taskFirstWorkTime: dt.taskFirstWorkTime ?? {},
        })
      ),
    },
    time: state.time ?? { dateTimes: [] },
    edit: state.edit ?? {},
    project: {
      nextProjectId: 2,
      projects: [
        {
          id: 1,
          name: 'Inbox',
          color: '#757575',
          createdAt: now,
          archived: false,
        },
      ],
    },
  };
};

// Check if state needs migration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const needsMigration = (state: any): boolean => {
  // No project store means v1
  if (!state.project) return true;

  // Tasks missing status field means v1
  if (
    state.task?.tasks?.length > 0 &&
    state.task.tasks[0].status === undefined
  ) {
    return true;
  }

  // Date tasks missing taskFirstWorkTime means v1
  if (
    state.date?.dateTasks?.length > 0 &&
    state.date.dateTasks[0].taskFirstWorkTime === undefined
  ) {
    return true;
  }

  return false;
};

// Load the entire persisted state from localStorage
export const loadPersistedState = (): PersistedState | undefined => {
  try {
    const persistedStateJson = localStorage.getItem(STORAGE_KEY);
    if (!persistedStateJson) {
      return undefined;
    }

    let persistedState = JSON.parse(persistedStateJson);

    // Apply migrations if needed
    if (needsMigration(persistedState)) {
      persistedState = migrateToV2(persistedState);
      // Save migrated state
      savePersistedState(persistedState);
    }

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
  const projectState = storeGetters['project']?.() || {};

  const combinedState: Partial<PersistedState> = {
    app: {
      version: (appState.version as string) || CURRENT_VERSION,
      selectedDate: appState.selectedDate as number,
      backlogOpen: (appState.backlogOpen as boolean) ?? false,
      backlogExpanded: (appState.backlogExpanded as boolean) ?? false,
      projectFilter: appState.projectFilter as number | undefined,
      showCompleted: (appState.showCompleted as boolean) ?? true,
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
    project: {
      nextProjectId: projectState.nextProjectId as number,
      projects: projectState.projects as PersistedState['project']['projects'],
    },
  };

  savePersistedState(combinedState);
};

// Allow external triggering of persist
export const triggerPersist = persistCombinedState;

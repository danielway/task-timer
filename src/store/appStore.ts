import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';

export interface KeyboardSelection {
  // The task selected
  taskId: number;
  // Whether the task's description is selected
  description: boolean;
  // Which time segment is selected for the task, if any
  timeSegment?: number;
}

export interface AppState {
  // The version of the app which last saved state
  version: string;
  // The date currently being viewed/edited
  selectedDate: number;
  // A keyboard-driven UI selection
  selection?: KeyboardSelection;
  // If a task's description is being edited, the task's ID
  activeEditTaskId?: number;
  // Backlog drawer state
  backlogOpen: boolean;
  backlogExpanded: boolean;
  // Filter tasks by project
  projectFilter?: number;
  // Show/hide completed tasks
  showCompleted: boolean;
}

interface AppActions {
  selectDate: (date: number) => void;
  selectTaskDescription: (payload: { taskId: number }) => void;
  selectTaskTimeSegment: (payload: {
    taskId: number;
    timeSegment: number;
  }) => void;
  beginTaskEdit: (payload: { taskId: number }) => void;
  endTaskEdit: () => void;
  clearSelection: () => void;
  toggleBacklog: () => void;
  setBacklogExpanded: (expanded: boolean) => void;
  setProjectFilter: (projectId?: number) => void;
  setShowCompleted: (show: boolean) => void;
}

export type AppStore = AppState & AppActions;

const getInitialState = (): AppState => {
  const persistedApp = getPersistedSlice('app');
  const persistedEdit = getPersistedSlice('edit');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    version: persistedApp?.version ?? 'REPLACE_WITH_RELEASE',
    selectedDate: persistedApp?.selectedDate ?? today.getTime(),
    selection: persistedEdit?.selection,
    activeEditTaskId: persistedEdit?.activeEditTaskId,
    backlogOpen: persistedApp?.backlogOpen ?? false,
    backlogExpanded: persistedApp?.backlogExpanded ?? false,
    projectFilter: persistedApp?.projectFilter,
    showCompleted: persistedApp?.showCompleted ?? true,
  };
};

export const useAppStore = create<AppStore>()((set, get) => {
  // Register this store's getter for persistence
  registerStoreGetter('app', () => get());

  return {
    ...getInitialState(),

    selectDate: (date: number) => {
      set({ selectedDate: date });
      triggerPersist();
    },

    selectTaskDescription: (payload) => {
      set({
        selection: {
          taskId: payload.taskId,
          description: true,
        },
      });
      triggerPersist();
    },

    selectTaskTimeSegment: (payload) => {
      set({
        selection: {
          taskId: payload.taskId,
          description: false,
          timeSegment: payload.timeSegment,
        },
      });
      triggerPersist();
    },

    beginTaskEdit: (payload) => {
      set({ activeEditTaskId: payload.taskId });
      triggerPersist();
    },

    endTaskEdit: () => {
      set({ activeEditTaskId: undefined });
      triggerPersist();
    },

    clearSelection: () => {
      set({ selection: undefined });
      triggerPersist();
    },

    toggleBacklog: () => {
      set((state) => ({ backlogOpen: !state.backlogOpen }));
      triggerPersist();
    },

    setBacklogExpanded: (expanded: boolean) => {
      set({ backlogExpanded: expanded });
      triggerPersist();
    },

    setProjectFilter: (projectId?: number) => {
      set({ projectFilter: projectId });
      triggerPersist();
    },

    setShowCompleted: (show: boolean) => {
      set({ showCompleted: show });
      triggerPersist();
    },
  };
});

// Selectors
export const getSelectedDate = (state: AppStore) => state.selectedDate;
export const getSelection = (state: AppStore) => state.selection;
export const getActiveEditTaskId = (state: AppStore) => state.activeEditTaskId;

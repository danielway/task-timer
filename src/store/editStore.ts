import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStore,
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

export interface EditState {
  // A keyboard-driven UI selection
  selection?: KeyboardSelection;
  // If a task's description is being edited, the task's ID
  activeEditTaskId?: number;
}

interface EditActions {
  selectTaskDescription: (payload: { taskId: number }) => void;
  selectTaskTimeSegment: (payload: {
    taskId: number;
    timeSegment: number;
  }) => void;
  beginTaskEdit: (payload: { taskId: number }) => void;
  endTaskEdit: () => void;
  clearSelection: () => void;
}

export type EditStore = EditState & EditActions;

const getInitialState = (): EditState => {
  const persisted = getPersistedSlice('edit');
  if (persisted) {
    return persisted;
  }

  return {};
};

export const useEditStore = create<EditStore>()((set, get) => {
  // Register this store for combined persistence
  registerStore('edit', () => {
    const state = get();
    return {
      selection: state.selection,
      activeEditTaskId: state.activeEditTaskId,
    };
  });

  return {
    ...getInitialState(),

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
  };
});

// Selectors
export const getSelection = (state: EditStore) => state.selection;
export const getActiveEditTaskId = (state: EditStore) => state.activeEditTaskId;

import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStore,
  triggerPersist,
} from './middleware/persist';

export interface Task {
  id: number;
  description: string;
  type: string; // Task type ID (e.g., 'task', 'meeting', 'review')
}

export interface TaskState {
  nextTaskId: number;
  tasks: Task[];
}

interface TaskActions {
  createTask: (payload: {
    id: number;
    description: string;
    type?: string;
  }) => void;
  updateTask: (payload: {
    id: number;
    description: string;
    type?: string;
  }) => void;
  deleteTask: (payload: { id: number }) => void;
}

export type TaskStore = TaskState & TaskActions;

const getInitialState = (): TaskState => {
  const persisted = getPersistedSlice('task');
  if (persisted) {
    return persisted;
  }

  return {
    nextTaskId: 1,
    tasks: [],
  };
};

export const useTaskStore = create<TaskStore>()((set, get) => {
  // Register this store for combined persistence
  registerStore('task', () => {
    const state = get();
    return {
      nextTaskId: state.nextTaskId,
      tasks: state.tasks,
    };
  });

  return {
    ...getInitialState(),

    createTask: (payload) => {
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: payload.id,
            description: payload.description,
            type: payload.type || 'task',
          },
        ],
        nextTaskId: payload.id + 1,
      }));
      triggerPersist();
    },

    updateTask: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === payload.id
            ? {
                ...task,
                description: payload.description,
                ...(payload.type !== undefined ? { type: payload.type } : {}),
              }
            : task
        ),
      }));
      triggerPersist();
    },

    deleteTask: (payload) => {
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== payload.id),
      }));
      triggerPersist();
    },
  };
});

// Selectors
export const getTask = (state: TaskStore, id: number) =>
  state.tasks.find((task) => task.id === id);

export const getNextTaskId = (state: TaskStore) => state.nextTaskId;

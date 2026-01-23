import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';

export type TaskStatus = 'new' | 'in_progress' | 'done';

export interface Task {
  id: number;
  description: string;
  type: string; // Task type ID (e.g., 'task', 'meeting', 'review')
  status: TaskStatus;
  projectId?: number;
  createdAt: number;
  completedAt?: number;
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
    projectId?: number;
  }) => void;
  updateTask: (payload: {
    id: number;
    description?: string;
    type?: string;
    projectId?: number;
  }) => void;
  deleteTask: (payload: { id: number }) => void;
  setTaskStatus: (payload: { id: number; status: TaskStatus }) => void;
  assignProject: (payload: { taskId: number; projectId?: number }) => void;
  completeTask: (payload: { id: number }) => void;
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
  // Register this store's getter for persistence
  registerStoreGetter('task', () => get());

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
            status: 'new' as TaskStatus,
            projectId: payload.projectId,
            createdAt: Date.now(),
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
                ...(payload.description !== undefined
                  ? { description: payload.description }
                  : {}),
                ...(payload.type !== undefined ? { type: payload.type } : {}),
                ...(payload.projectId !== undefined
                  ? { projectId: payload.projectId }
                  : {}),
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

    setTaskStatus: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === payload.id
            ? {
                ...task,
                status: payload.status,
                ...(payload.status === 'done'
                  ? { completedAt: Date.now() }
                  : { completedAt: undefined }),
              }
            : task
        ),
      }));
      triggerPersist();
    },

    assignProject: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === payload.taskId
            ? { ...task, projectId: payload.projectId }
            : task
        ),
      }));
      triggerPersist();
    },

    completeTask: (payload) => {
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === payload.id
            ? { ...task, status: 'done' as TaskStatus, completedAt: Date.now() }
            : task
        ),
      }));
      triggerPersist();
    },
  };
});

// Selectors
export const getTask = (state: TaskStore, id: number) =>
  state.tasks.find((task) => task.id === id);

export const getNextTaskId = (state: TaskStore) => state.nextTaskId;

export const getTasksByStatus = (state: TaskStore, status: TaskStatus) =>
  state.tasks.filter((task) => task.status === status);

export const getTasksByProject = (state: TaskStore, projectId: number) =>
  state.tasks.filter((task) => task.projectId === projectId);

export const getIncompleteTasks = (state: TaskStore) =>
  state.tasks.filter((task) => task.status !== 'done');

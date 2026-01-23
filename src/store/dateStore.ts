import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';

export interface DateTasks {
  date: number;
  tasks: number[];
}

export interface DateState {
  dateTasks: DateTasks[];
}

interface DateActions {
  createDate: (payload: { date: number }) => void;
  addTaskToDate: (payload: { date: number; taskId: number }) => void;
  removeTaskFromDate: (payload: { date: number; taskId: number }) => void;
  reorderTasksForDate: (payload: {
    date: number;
    newTaskOrder: number[];
  }) => void;
}

export type DateStore = DateState & DateActions;

const getInitialState = (): DateState => {
  const persisted = getPersistedSlice('date');
  if (persisted) {
    return persisted;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    dateTasks: [
      {
        date: today.getTime(),
        tasks: [],
      },
    ],
  };
};

export const useDateStore = create<DateStore>()((set, get) => {
  // Register this store's getter for persistence
  registerStoreGetter('date', () => get());

  return {
    ...getInitialState(),

    createDate: (payload) => {
      set((state) => {
        if (state.dateTasks.find((date) => date.date === payload.date)) {
          return state; // Date already exists
        }

        return {
          dateTasks: [
            ...state.dateTasks,
            {
              date: payload.date,
              tasks: [],
            },
          ],
        };
      });
      triggerPersist();
    },

    addTaskToDate: (payload) => {
      set((state) => {
        const dateExists = state.dateTasks.some(
          (dateObj) => dateObj.date === payload.date
        );

        if (dateExists) {
          return {
            dateTasks: state.dateTasks.map((dateObj) =>
              dateObj.date === payload.date
                ? { ...dateObj, tasks: [...dateObj.tasks, payload.taskId] }
                : dateObj
            ),
          };
        }

        // Create the date entry if it doesn't exist
        return {
          dateTasks: [
            ...state.dateTasks,
            { date: payload.date, tasks: [payload.taskId] },
          ],
        };
      });
      triggerPersist();
    },

    removeTaskFromDate: (payload) => {
      set((state) => ({
        dateTasks: state.dateTasks.map((dateObj) =>
          dateObj.date === payload.date
            ? {
                ...dateObj,
                tasks: dateObj.tasks.filter(
                  (taskId) => taskId !== payload.taskId
                ),
              }
            : dateObj
        ),
      }));
      triggerPersist();
    },

    reorderTasksForDate: (payload) => {
      set((state) => ({
        dateTasks: state.dateTasks.map((dateObj) =>
          dateObj.date === payload.date
            ? { ...dateObj, tasks: [...payload.newTaskOrder] }
            : dateObj
        ),
      }));
      triggerPersist();
    },
  };
});

// Selectors
export const getTasksForDate = (state: DateStore, date: number) =>
  state.dateTasks.find((dateObj) => dateObj.date === date)?.tasks || [];

export const getDatesWithTasks = (state: DateStore) =>
  state.dateTasks.filter((dateObj) => dateObj.tasks.length > 0);

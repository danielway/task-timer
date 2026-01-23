import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';

export interface DateTasks {
  date: number;
  tasks: number[];
  taskFirstWorkTime: Record<number, number>; // taskId -> first work timestamp
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
  recordFirstWorkTime: (payload: {
    date: number;
    taskId: number;
    time: number;
  }) => void;
  carryForwardTasks: (payload: {
    fromDate: number;
    toDate: number;
    taskIds: number[];
  }) => void;
  sortTasksByFirstWork: (payload: { date: number }) => void;
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
        taskFirstWorkTime: {},
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
              taskFirstWorkTime: {},
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
            { date: payload.date, tasks: [payload.taskId], taskFirstWorkTime: {} },
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

    recordFirstWorkTime: (payload) => {
      set((state) => ({
        dateTasks: state.dateTasks.map((dateObj) => {
          if (dateObj.date !== payload.date) return dateObj;

          // Only record if not already set
          if (dateObj.taskFirstWorkTime[payload.taskId]) return dateObj;

          return {
            ...dateObj,
            taskFirstWorkTime: {
              ...dateObj.taskFirstWorkTime,
              [payload.taskId]: payload.time,
            },
          };
        }),
      }));
      triggerPersist();
    },

    carryForwardTasks: (payload) => {
      set((state) => {
        const toDateObj = state.dateTasks.find(
          (dateObj) => dateObj.date === payload.toDate
        );

        // Filter out tasks that already exist on the target date
        const existingTaskIds = new Set(toDateObj?.tasks || []);
        const newTaskIds = payload.taskIds.filter(
          (id) => !existingTaskIds.has(id)
        );

        if (newTaskIds.length === 0) return state;

        if (toDateObj) {
          return {
            dateTasks: state.dateTasks.map((dateObj) =>
              dateObj.date === payload.toDate
                ? { ...dateObj, tasks: [...newTaskIds, ...dateObj.tasks] }
                : dateObj
            ),
          };
        }

        // Create the date entry if it doesn't exist
        return {
          dateTasks: [
            ...state.dateTasks,
            {
              date: payload.toDate,
              tasks: newTaskIds,
              taskFirstWorkTime: {},
            },
          ],
        };
      });
      triggerPersist();
    },

    sortTasksByFirstWork: (payload) => {
      set((state) => ({
        dateTasks: state.dateTasks.map((dateObj) => {
          if (dateObj.date !== payload.date) return dateObj;

          const sortedTasks = [...dateObj.tasks].sort((a, b) => {
            const timeA = dateObj.taskFirstWorkTime[a];
            const timeB = dateObj.taskFirstWorkTime[b];

            // Tasks without work time go to the end
            if (!timeA && !timeB) return 0;
            if (!timeA) return 1;
            if (!timeB) return -1;

            return timeA - timeB;
          });

          return { ...dateObj, tasks: sortedTasks };
        }),
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

export const getDateTasksEntry = (state: DateStore, date: number) =>
  state.dateTasks.find((dateObj) => dateObj.date === date);

export const getTaskFirstWorkTime = (
  state: DateStore,
  date: number,
  taskId: number
) => state.dateTasks.find((d) => d.date === date)?.taskFirstWorkTime[taskId];

export const getMostRecentDateWithTasks = (
  state: DateStore,
  beforeDate: number
) => {
  const datesWithTasks = state.dateTasks
    .filter((dateObj) => dateObj.date < beforeDate && dateObj.tasks.length > 0)
    .sort((a, b) => b.date - a.date);
  return datesWithTasks[0];
};

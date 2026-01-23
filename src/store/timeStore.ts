import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';
import { START_HOUR } from '../app/constants';

export interface TaskTime {
  task: number;
  start: number;
  end?: number;
}

export interface DateTimes {
  date: number;
  taskTimes: TaskTime[];
}

export interface TimeState {
  dateTimes: DateTimes[];
}

interface TimeActions {
  createDate: (payload: { date: number }) => void;
  startTime: (payload: { date: number; taskId: number }) => void;
  stopTime: (payload: { date: number; taskId: number; start: number }) => void;
  recordTime: (payload: {
    date: number;
    taskId: number;
    start: number;
    end: number;
  }) => void;
  removeTime: (payload: {
    date: number;
    taskId: number;
    start: number;
  }) => void;
  toggleSegment: (payload: {
    date: number;
    taskId: number;
    segment: number;
  }) => void;
}

export type TimeStore = TimeState & TimeActions;

const getInitialState = (): TimeState => {
  const persisted = getPersistedSlice('time');
  if (persisted) {
    return persisted;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    dateTimes: [
      {
        date: today.getTime(),
        taskTimes: [],
      },
    ],
  };
};

// Helper to calculate segment times
const calculateSegmentTimes = (date: number, segment: number) => {
  const dateObj = new Date(date);

  const start = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + Math.floor(segment / 4),
    (segment % 4) * 15
  ).getTime();

  const end = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + Math.floor((segment + 1) / 4),
    ((segment + 1) % 4) * 15
  ).getTime();

  return { start, end };
};

export const useTimeStore = create<TimeStore>()((set, get) => {
  // Register this store's getter for persistence
  registerStoreGetter('time', () => get());

  return {
    ...getInitialState(),

    createDate: (payload) => {
      set((state) => {
        if (state.dateTimes.find((dt) => dt.date === payload.date)) {
          return state; // Date already exists
        }

        return {
          dateTimes: [
            ...state.dateTimes,
            {
              date: payload.date,
              taskTimes: [],
            },
          ],
        };
      });
      triggerPersist();
    },

    startTime: (payload) => {
      set((state) => {
        const dateExists = state.dateTimes.some(
          (dt) => dt.date === payload.date
        );

        if (dateExists) {
          return {
            dateTimes: state.dateTimes.map((dt) =>
              dt.date === payload.date
                ? {
                    ...dt,
                    taskTimes: [
                      ...dt.taskTimes,
                      { task: payload.taskId, start: Date.now() },
                    ],
                  }
                : dt
            ),
          };
        }

        return {
          dateTimes: [
            ...state.dateTimes,
            {
              date: payload.date,
              taskTimes: [{ task: payload.taskId, start: Date.now() }],
            },
          ],
        };
      });
      triggerPersist();
    },

    stopTime: (payload) => {
      set((state) => ({
        dateTimes: state.dateTimes.map((dt) =>
          dt.date === payload.date
            ? {
                ...dt,
                taskTimes: dt.taskTimes.map((tt) =>
                  tt.task === payload.taskId && tt.start === payload.start
                    ? { ...tt, end: Date.now() }
                    : tt
                ),
              }
            : dt
        ),
      }));
      triggerPersist();
    },

    recordTime: (payload) => {
      set((state) => {
        const dateExists = state.dateTimes.some(
          (dt) => dt.date === payload.date
        );

        if (dateExists) {
          return {
            dateTimes: state.dateTimes.map((dt) =>
              dt.date === payload.date
                ? {
                    ...dt,
                    taskTimes: [
                      ...dt.taskTimes,
                      {
                        task: payload.taskId,
                        start: payload.start,
                        end: payload.end,
                      },
                    ],
                  }
                : dt
            ),
          };
        }

        return {
          dateTimes: [
            ...state.dateTimes,
            {
              date: payload.date,
              taskTimes: [
                {
                  task: payload.taskId,
                  start: payload.start,
                  end: payload.end,
                },
              ],
            },
          ],
        };
      });
      triggerPersist();
    },

    removeTime: (payload) => {
      set((state) => ({
        dateTimes: state.dateTimes.map((dt) =>
          dt.date === payload.date
            ? {
                ...dt,
                taskTimes: dt.taskTimes.filter(
                  (tt) =>
                    !(tt.task === payload.taskId && tt.start === payload.start)
                ),
              }
            : dt
        ),
      }));
      triggerPersist();
    },

    toggleSegment: (payload) => {
      const state = get();
      const { start, end } = calculateSegmentTimes(
        payload.date,
        payload.segment
      );
      const dateTime = state.dateTimes.find((dt) => dt.date === payload.date);

      if (!dateTime) {
        // Create the date entry with the new time segment
        set((state) => ({
          dateTimes: [
            ...state.dateTimes,
            {
              date: payload.date,
              taskTimes: [{ task: payload.taskId, start, end }],
            },
          ],
        }));
        triggerPersist();
        return;
      }

      const matchingTimes = dateTime.taskTimes.filter(
        (time) =>
          time.task === payload.taskId &&
          time.start < end &&
          (!time.end || time.end > start)
      );

      const isLogged = matchingTimes.length > 0;

      if (!isLogged) {
        // Add new time segment
        set((state) => ({
          dateTimes: state.dateTimes.map((dt) =>
            dt.date === payload.date
              ? {
                  ...dt,
                  taskTimes: [
                    ...dt.taskTimes,
                    { task: payload.taskId, start, end },
                  ],
                }
              : dt
          ),
        }));
      } else {
        // Remove matching time segments
        set((state) => ({
          dateTimes: state.dateTimes.map((dt) =>
            dt.date === payload.date
              ? {
                  ...dt,
                  taskTimes: dt.taskTimes.filter(
                    (tt) =>
                      !(
                        tt.task === payload.taskId &&
                        tt.start < end &&
                        (!tt.end || tt.end > start)
                      )
                  ),
                }
              : dt
          ),
        }));
      }
      triggerPersist();
    },
  };
});

// Selectors
export const getSegment = (
  state: TimeStore,
  date: number,
  taskId: number,
  segment: number
) => {
  const { start, end } = calculateSegmentTimes(date, segment);
  const dateTime = state.dateTimes.find((dt) => dt.date === date);

  if (!dateTime) return { start, end, logged: false };

  const matchingTimes = dateTime.taskTimes.filter(
    (time) =>
      time.task === taskId &&
      time.start < end &&
      (!time.end || time.end > start)
  );

  return { start, end, logged: matchingTimes.length > 0 };
};

export const getTimesForDate = (state: TimeStore, date: number): TaskTime[] => {
  const dateEntry = state.dateTimes.find((dt) => dt.date === date);
  return dateEntry ? dateEntry.taskTimes : [];
};

export const getTimesForTask = (
  state: TimeStore,
  date: number,
  taskId: number
): TaskTime[] => {
  const dateEntry = state.dateTimes.find((dt) => dt.date === date);
  return dateEntry
    ? dateEntry.taskTimes.filter((taskTime) => taskTime.task === taskId)
    : [];
};

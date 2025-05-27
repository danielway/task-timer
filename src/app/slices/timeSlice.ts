import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { START_HOUR } from '../constants';

export interface TimeState {
  dateTimes: DateTimes[];
}

export interface DateTimes {
  date: number;
  taskTimes: TaskTime[];
}

export interface TaskTime {
  task: number;
  start: number;
  end?: number;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const initialState: TimeState = {
  dateTimes: [
    {
      date: today.getTime(),
      taskTimes: [],
    },
  ],
};

export const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    createDate: (
      state,
      action: PayloadAction<{
        date: number;
      }>
    ) => {
      if (state.dateTimes.find((date) => date.date === action.payload.date)) {
        return;
      }

      state.dateTimes.push({
        date: action.payload.date,
        taskTimes: [],
      });
    },
    startTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
      }>
    ) => {
      const dateTimes = state.dateTimes.find(
        (dateTimes) => dateTimes.date === action.payload.date
      );
      if (dateTimes) {
        dateTimes.taskTimes.push({
          task: action.payload.taskId,
          start: Date.now(),
        });
      }
    },
    stopTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        start: number;
      }>
    ) => {
      const dateTimes = state.dateTimes.find(
        (dateTimes) => dateTimes.date === action.payload.date
      );
      if (dateTimes) {
        const taskTime = dateTimes.taskTimes.find(
          (taskTime) =>
            taskTime.task === action.payload.taskId &&
            taskTime.start === action.payload.start
        );
        if (taskTime) {
          taskTime.end = Date.now();
        }
      }
    },
    recordTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        start: number;
        end: number;
      }>
    ) => {
      const dateTimes = state.dateTimes.find(
        (dateTimes) => dateTimes.date === action.payload.date
      );
      if (dateTimes) {
        dateTimes.taskTimes.push({
          task: action.payload.taskId,
          start: action.payload.start,
          end: action.payload.end,
        });
      }
    },
    removeTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        start: number;
      }>
    ) => {
      const dateTimes = state.dateTimes.find(
        (dateTimes) => dateTimes.date === action.payload.date
      );
      if (dateTimes) {
        const taskTimeIndex = dateTimes.taskTimes.findIndex(
          (taskTime) =>
            taskTime.task === action.payload.taskId &&
            taskTime.start === action.payload.start
        );
        if (taskTimeIndex !== -1) {
          dateTimes.taskTimes.splice(taskTimeIndex, 1);
        }
      }
    },
    toggleSegment: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        segment: number;
      }>
    ) => {
      const { start, end, logged } = getSegment(
        state,
        action.payload.date,
        action.payload.taskId,
        action.payload.segment
      );

      const dateTimes = state.dateTimes.find(
        (dateTimes) => dateTimes.date === action.payload.date
      )!;

      const matchingTimes = dateTimes.taskTimes.filter(
        (time) => time.start < end && (!time.end || time.end > start)
      );

      if (!logged) {
        dateTimes.taskTimes.push({
          task: action.payload.taskId,
          start,
          end,
        });
      } else {
        dateTimes.taskTimes = dateTimes.taskTimes.filter(
          (time) => !matchingTimes.includes(time)
        );
      }
    },
  },
});

export const {
  createDate,
  startTime,
  stopTime,
  recordTime,
  removeTime,
  toggleSegment,
} = timeSlice.actions;

export const getSegment = (
  state: TimeState,
  date: number,
  taskId: number,
  segment: number
) => {
  const dateObj = new Date(date);

  const start = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + segment / 4,
    (segment % 4) * 15
  ).getTime();

  const end = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + (segment + 1) / 4,
    ((segment + 1) % 4) * 15
  ).getTime();

  const dateTimes = state.dateTimes.find(
    (dateTimes) => dateTimes.date === date
  )!;

  const matchingTimes = dateTimes.taskTimes.filter(
    (time) =>
      time.task === taskId &&
      time.start < end &&
      (!time.end || time.end > start)
  );

  return { start, end, logged: matchingTimes.length > 0 };
};

export const getTimesForDate = (state: TimeState, date: number): TaskTime[] =>
  state.dateTimes.find((dateTimes) => dateTimes.date === date)!.taskTimes;

export const getTimesForTask = (
  state: TimeState,
  date: number,
  taskId: number
): TaskTime[] =>
  state.dateTimes
    .find((dateTimes) => dateTimes.date === date)!
    .taskTimes.filter((taskTime) => taskTime.task === taskId);

export default timeSlice.reducer;

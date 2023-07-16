import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface TimeState {
  // Map of dates to recorded times for that date
  timesByDate: Map<number, DateTimes>;
}

export interface DateTimes {
  date: number;

  // Map of task ID to recorded times
  taskTimes: Map<number, Time[]>;
}

export interface Time {
  start: number;
  end?: number;
}

const initialState: TimeState = {
  timesByDate: new Map(),
};

export const timeSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    startTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
      }>
    ) => {
      const dateTimes = state.timesByDate.get(action.payload.date);
      if (dateTimes) {
        const taskTimes = dateTimes.taskTimes.get(action.payload.taskId);
        if (taskTimes) {
          taskTimes.push({
            start: Date.now(),
          });
        }
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
      const dateTimes = state.timesByDate.get(action.payload.date);
      if (dateTimes) {
        const taskTimes = dateTimes.taskTimes.get(action.payload.taskId);
        if (taskTimes) {
          const time = taskTimes.find(
            (time) => time.start === action.payload.start
          );
          if (time) {
            time.end = Date.now();
          }
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
      const dateTimes = state.timesByDate.get(action.payload.date);
      if (dateTimes) {
        const taskTimes = dateTimes.taskTimes.get(action.payload.taskId);
        if (taskTimes) {
          taskTimes.push({
            start: action.payload.start,
            end: action.payload.end,
          });
        }
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
      const dateTimes = state.timesByDate.get(action.payload.date);
      if (dateTimes) {
        const taskTimes = dateTimes.taskTimes.get(action.payload.taskId);
        if (taskTimes) {
          const timeIndex = taskTimes.findIndex(
            (time) => time.start === action.payload.start
          );
          if (timeIndex !== -1) {
            taskTimes.splice(timeIndex, 1);
          }
        }
      }
    },
  },
});

export const { startTime, stopTime, recordTime, removeTime } =
  timeSlice.actions;

// todo: time selectors

export default timeSlice.reducer;

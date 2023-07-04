import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface Task {
  id: number;
  name: string;
}

export interface Time {
  taskId: number;
  timeSegment: number; // 11 hours * 4 segments, 0 indexed
}

export interface Day {
  date: number;
  tasks: Task[];
  times: Time[];
}

interface TaskState {
  currentDate: number;
  days: Day[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState: TaskState = {
  currentDate: today.getTime(),
  days: [{ date: today.getTime(), tasks: [], times: [] }],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    selectDay: (state, action: PayloadAction<number>) => {
      if (!state.days.find((day) => day.date === action.payload)) {
        state.days.push({
          date: action.payload,
          tasks: [],
          times: [],
        });
      }

      state.currentDate = action.payload;
    },
    createTask: (
      state,
      action: PayloadAction<{ date: number; name: string }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        day.tasks.push({
          id: day.tasks.length,
          name: action.payload.name,
        });
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ date: number; id: number; name: string }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        const task = day.tasks.find((task) => task.id === action.payload.id);
        if (task) {
          task.name = action.payload.name;
        }
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{ date: number; task: number }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        const task = day.tasks.find((task) => task.id === action.payload.task);
        if (task) {
          day.times = day.times.filter((time) => time.taskId !== task.id);
          day.tasks = day.tasks.filter(
            (task) => task.id !== action.payload.task
          );
        }
      }
    },
    logTime: (
      state,
      action: PayloadAction<{
        date: Number;
        taskId: number;
        timeSegment: number;
      }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        day.times.push({
          taskId: action.payload.taskId,
          timeSegment: action.payload.timeSegment,
        });
      }
    },
    removeTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        timeSegment: number;
      }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        day.times = day.times.filter(
          (time) =>
            time.taskId !== action.payload.taskId ||
            time.timeSegment !== action.payload.timeSegment
        );
      }
    },
  },
});

export const {
  selectDay,
  createTask,
  updateTask,
  deleteTask,
  logTime,
  removeTime,
} = taskSlice.actions;

export const selectDates = (state: RootState) => {
  const currentDate = new Date(state.tasks.currentDate);
  currentDate.setHours(0, 0, 0, 0);

  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);

  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return [previousDate.getTime(), currentDate.getTime(), nextDate.getTime()];
};

export const selectTasks = (state: RootState, date: number) =>
  state.tasks.days.find((day) => day.date === date)!.tasks;
export const selectTimes = (state: RootState, date: number) =>
  state.tasks.days.find((day) => day.date === date)!.times;

export default taskSlice.reducer;

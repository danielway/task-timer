import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./appSlice";

export interface DateState {
  dateTasks: DateTasks[];
}

export interface DateTasks {
  date: number;
  tasks: number[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const initialState: DateState = {
  dateTasks: [
    {
      date: today.getTime(),
      tasks: [],
    },
  ],
};

export const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    createDate: (
      state,
      action: PayloadAction<{
        date: number;
      }>
    ) => {
      if (state.dateTasks.find((date) => date.date === action.payload.date)) {
        return;
      }

      state.dateTasks.push({
        date: action.payload.date,
        tasks: [],
      });
    },
    addTaskToDate: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
      }>
    ) => {
      const date = state.dateTasks.find(
        (date) => date.date === action.payload.date
      );
      if (date) {
        date.tasks.push(action.payload.taskId);
      }
    },
    removeTaskFromDate: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
      }>
    ) => {
      const date = state.dateTasks.find(
        (date) => date.date === action.payload.date
      );
      if (date) {
        date.tasks = date.tasks.filter(
          (taskId) => taskId !== action.payload.taskId
        );
      }
    },
  },
});

export const { createDate, addTaskToDate, removeTaskFromDate } =
  dateSlice.actions;

export const getTasksForDate = (
  state: { app: AppState; date: DateState },
  date: number
) => state.date.dateTasks.find((dateObj) => dateObj.date === date)!.tasks;

export const getDatesWithTasks = (state: { date: DateState }) =>
  state.date.dateTasks.filter((dateObj) => dateObj.tasks.length > 0);

export default dateSlice.reducer;

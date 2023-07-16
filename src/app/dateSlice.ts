import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface DateState {
  dates: Map<number, Date>;
}

export interface Date {
  date: number;
  tasks: number[];
}

const initialState: DateState = {
  dates: new Map(),
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
      state.dates.set(action.payload.date, {
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
      const date = state.dates.get(action.payload.date);
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
      const date = state.dates.get(action.payload.date);
      if (date) {
        date.tasks = date.tasks.filter(
          (taskId) => taskId !== action.payload.taskId
        );
      }
    },
  },
});

export const { createDate } = dateSlice.actions;

// todo: date selectors

export default dateSlice.reducer;
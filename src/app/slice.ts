import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { HOUR_COUNT } from "./constants";

export interface Task {
  id: number;
  name: string;
}

export interface Time {
  taskId: number;
  timeSegment: number; // 11 hours * 4 segments, 0 indexed
}

export interface CursorSelection {
  row: number;
  column: number; // 0 is description
}

export interface Day {
  date: number;
  tasks: Task[];
  times: Time[];
}

interface TaskState {
  version: string;
  cursor?: CursorSelection;
  rowBeingEdited?: number;
  currentDate: number;
  days: Day[];
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState: TaskState = {
  version: "REPLACE_WITH_RELEASE",
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
    toggleTime: (
      state,
      action: PayloadAction<{
        date: number;
        taskId: number;
        timeSegment: number;
      }>
    ) => {
      const day = state.days.find((day) => day.date === action.payload.date);
      if (day) {
        const time = day.times.find(
          (time) =>
            time.taskId === action.payload.taskId &&
            time.timeSegment === action.payload.timeSegment
        );
        if (time) {
          day.times = day.times.filter(
            (time) =>
              time.taskId !== action.payload.taskId ||
              time.timeSegment !== action.payload.timeSegment
          );
        } else {
          day.times.push({
            taskId: action.payload.taskId,
            timeSegment: action.payload.timeSegment,
          });
        }
      }
    },
    updateCursor: (
      state,
      action: PayloadAction<{
        row?: number;
        rowDelta?: number;
        column?: number;
        columnDelta?: number;
      }>
    ) => {
      const day = state.days.find((day) => day.date === state.currentDate);
      if (!day) {
        return;
      }

      const cursor = state.cursor ?? { row: 0, column: 0 };

      var newRow = cursor.row;
      var newColumn = cursor.column;

      if (action.payload.row) {
        newRow = action.payload.row;
      }

      if (action.payload.column) {
        newColumn = action.payload.column;
      }

      if (action.payload.rowDelta) {
        newRow += action.payload.rowDelta;
      }

      if (action.payload.columnDelta) {
        newColumn += action.payload.columnDelta;
      }

      if (newRow < 0) return;
      if (newRow >= day.tasks.length) return;
      cursor.row = newRow;

      if (newColumn < 0) return;
      if (newColumn >= HOUR_COUNT * 4 + 1) return;
      cursor.column = newColumn;

      state.cursor = cursor;
    },
    updateRowBeingEdited: (
      state,
      action: PayloadAction<number | undefined>
    ) => {
      state.rowBeingEdited = action.payload;
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
  toggleTime,
  updateCursor,
  updateRowBeingEdited,
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

export const selectDatesWithTasks = (state: RootState) => {
  const dates: number[] = [];
  state.tasks.days.forEach((day) => {
    if (day.tasks.length > 0) {
      dates.push(day.date);
    }
  });
  return dates;
};

export const selectCursor = (state: RootState) => {
  const cursor = state.tasks.cursor;
  if (!cursor) {
    return null;
  }

  return [cursor.row, cursor.column];
};

export const selectRowBeingEdited = (state: RootState) => {
  return state.tasks.rowBeingEdited;
};

export default taskSlice.reducer;

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

interface TaskState {
  tasks: Task[];
  time: Time[];
}

const initialState: TaskState = {
  tasks: [],
  time: [],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<string>) => {
      state.tasks.push({
        id: state.tasks.length + 1,
        name: action.payload,
      });
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.name = action.payload.name;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.time = state.time.filter((time) => time.taskId !== action.payload);
    },
    logTime: (
      state,
      action: PayloadAction<{ taskId: number; timeSegment: number }>
    ) => {
      state.time.push({
        taskId: action.payload.taskId,
        timeSegment: action.payload.timeSegment,
      });
    },
    removeTime: (
      state,
      action: PayloadAction<{ taskId: number; timeSegment: number }>
    ) => {
      state.time = state.time.filter((time) => {
        return !(
          time.taskId === action.payload.taskId &&
          time.timeSegment === action.payload.timeSegment
        );
      });
    },
  },
});

export const { createTask, updateTask, deleteTask, logTime, removeTime } =
  taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTime = (state: RootState) => state.tasks.time;

export default taskSlice.reducer;

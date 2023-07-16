import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TaskState {
  tasks: Map<string, Task>;
}

export interface Task {
  id: string;
  description: string;
}

const initialState: TaskState = {
  tasks: new Map(),
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    createTask: (
      state,
      action: PayloadAction<{
        id: string;
        description: string;
      }>
    ) => {
      state.tasks.set(action.payload.id, {
        id: action.payload.id,
        description: action.payload.description,
      });
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: string;
        description: string;
      }>
    ) => {
      const task = state.tasks.get(action.payload.id);
      if (task) {
        task.description = action.payload.description;
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      state.tasks.delete(action.payload.id);
    },
  },
});

export const { createTask, updateTask, deleteTask } = taskSlice.actions;

// todo: task selectors

export default taskSlice.reducer;

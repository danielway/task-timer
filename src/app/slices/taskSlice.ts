import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskState {
  nextTaskId: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  description: string;
}

const initialState: TaskState = {
  nextTaskId: 1,
  tasks: [],
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    createTask: (
      state,
      action: PayloadAction<{
        id: number;
        description: string;
      }>
    ) => {
      state.tasks.push({
        id: action.payload.id,
        description: action.payload.description,
      });
      state.nextTaskId = action.payload.id + 1;
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: number;
        description: string;
      }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.description = action.payload.description;
      }
    },
    deleteTask: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks.splice(index, 1);
      }
    },
  },
});

export const { createTask, updateTask, deleteTask } = taskSlice.actions;

export const getTask = (state: TaskState, id: number) =>
  state.tasks.find((task) => task.id === id)!;

export const getNextTaskId = (state: TaskState) => state.nextTaskId;

export default taskSlice.reducer;

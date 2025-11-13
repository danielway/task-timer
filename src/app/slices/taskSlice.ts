import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TaskState {
  nextTaskId: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  description: string;
  type: string; // Task type ID (e.g., 'task', 'meeting', 'review')
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
        type?: string;
      }>
    ) => {
      state.tasks.push({
        id: action.payload.id,
        description: action.payload.description,
        type: action.payload.type || 'task', // Default to 'task' type
      });
      state.nextTaskId = action.payload.id + 1;
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: number;
        description: string;
        type?: string;
      }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.description = action.payload.description;
        if (action.payload.type !== undefined) {
          task.type = action.payload.type;
        }
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
  state.tasks.find((task) => task.id === id);

export const getNextTaskId = (state: TaskState) => state.nextTaskId;

export default taskSlice.reducer;

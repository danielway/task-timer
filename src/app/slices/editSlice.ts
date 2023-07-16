import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface KeyboardSelection {
  // The task selected
  taskId: number;

  // Whether the task's description is selected
  description: boolean;

  // Which time segment is selected for the task, if any
  timeSegment?: number;
}

export interface EditState {
  // A keyboard-driven UI selection
  selection?: KeyboardSelection;

  // If a task's description is being edited, the task's ID
  activeEditTaskId?: number;
}

const initialState: EditState = {};

export const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    selectTaskDescription: (
      state,
      action: PayloadAction<{
        taskId: number;
      }>
    ) => {
      state.activeEditTaskId = action.payload.taskId;
      state.selection = {
        taskId: action.payload.taskId,
        description: true,
      };
    },
    selectTaskTimeSegment: (
      state,
      action: PayloadAction<{
        taskId: number;
        timeSegment: number;
      }>
    ) => {
      state.activeEditTaskId = undefined;
      state.selection = {
        taskId: action.payload.taskId,
        description: false,
        timeSegment: action.payload.timeSegment,
      };
    },
  },
});

export const { selectTaskDescription, selectTaskTimeSegment } =
  editSlice.actions;

// todo: edit selectors

export default editSlice.reducer;

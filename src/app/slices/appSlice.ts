import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface AppState {
  // The version of the app which last saved state
  version: string;

  // The date currently being viewed/edited
  selectedDate: number;
}

const initialState: AppState = {
  version: 'REPLACE_WITH_RELEASE',
  selectedDate: (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  })(),
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    selectDate: (state, action: PayloadAction<number>) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { selectDate } = appSlice.actions;

export const getSelectedDate = (state: { app: AppState }) =>
  state.app.selectedDate;

export default appSlice.reducer;

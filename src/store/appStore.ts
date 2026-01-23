import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStore,
  triggerPersist,
} from './middleware/persist';

export interface AppState {
  // The version of the app which last saved state
  version: string;
  // The date currently being viewed/edited
  selectedDate: number;
}

interface AppActions {
  selectDate: (date: number) => void;
}

export type AppStore = AppState & AppActions;

const getInitialState = (): AppState => {
  const persisted = getPersistedSlice('app');
  if (persisted) {
    return persisted;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    version: 'REPLACE_WITH_RELEASE',
    selectedDate: today.getTime(),
  };
};

export const useAppStore = create<AppStore>()((set, get) => {
  // Register this store for combined persistence
  registerStore('app', () => {
    const state = get();
    return {
      version: state.version,
      selectedDate: state.selectedDate,
    };
  });

  return {
    ...getInitialState(),

    selectDate: (date: number) => {
      set({ selectedDate: date });
      triggerPersist();
    },
  };
});

// Selectors
export const getSelectedDate = (state: AppStore) => state.selectedDate;

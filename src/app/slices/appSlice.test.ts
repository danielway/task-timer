import { describe, it, expect } from 'vitest';
import appReducer, {
  selectDate,
  getSelectedDate,
  type AppState,
} from './appSlice';
import { mockToday, mockYesterday, mockTomorrow } from '../../test-utils/test-utils';

describe('appSlice', () => {
  const initialState: AppState = {
    version: '1.0.0',
    selectedDate: mockToday,
  };

  describe('selectDate', () => {
    it('should update selectedDate', () => {
      const action = selectDate(mockYesterday);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(mockYesterday);
    });

    it('should replace existing selectedDate', () => {
      const stateWithDate: AppState = {
        version: '1.0.0',
        selectedDate: mockToday,
      };

      const action = selectDate(mockTomorrow);
      const newState = appReducer(stateWithDate, action);

      expect(newState.selectedDate).toBe(mockTomorrow);
    });

    it('should not modify version', () => {
      const action = selectDate(mockYesterday);
      const newState = appReducer(initialState, action);

      expect(newState.version).toBe('1.0.0');
    });

    it('should handle timestamp 0', () => {
      const action = selectDate(0);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(0);
    });

    it('should handle future dates', () => {
      const futureDate = new Date('2030-12-31').getTime();
      const action = selectDate(futureDate);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(futureDate);
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2000-01-01').getTime();
      const action = selectDate(pastDate);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(pastDate);
    });
  });

  describe('getSelectedDate', () => {
    it('should return the selected date', () => {
      const mockState = {
        app: {
          version: '1.0.0',
          selectedDate: mockToday,
        },
      };

      const selectedDate = getSelectedDate(mockState);

      expect(selectedDate).toBe(mockToday);
    });

    it('should return correct date after update', () => {
      let state = initialState;
      state = appReducer(state, selectDate(mockYesterday));

      const mockState = {
        app: state,
      };

      const selectedDate = getSelectedDate(mockState);

      expect(selectedDate).toBe(mockYesterday);
    });

    it('should work with timestamp 0', () => {
      const mockState = {
        app: {
          version: '1.0.0',
          selectedDate: 0,
        },
      };

      const selectedDate = getSelectedDate(mockState);

      expect(selectedDate).toBe(0);
    });
  });

  describe('integration tests', () => {
    it('should handle multiple date changes', () => {
      let state = initialState;

      state = appReducer(state, selectDate(mockYesterday));
      expect(state.selectedDate).toBe(mockYesterday);

      state = appReducer(state, selectDate(mockToday));
      expect(state.selectedDate).toBe(mockToday);

      state = appReducer(state, selectDate(mockTomorrow));
      expect(state.selectedDate).toBe(mockTomorrow);

      state = appReducer(state, selectDate(mockToday));
      expect(state.selectedDate).toBe(mockToday);
    });

    it('should preserve version through date changes', () => {
      const stateWithVersion: AppState = {
        version: '2.5.1',
        selectedDate: mockToday,
      };

      let state = stateWithVersion;

      state = appReducer(state, selectDate(mockYesterday));
      expect(state.version).toBe('2.5.1');

      state = appReducer(state, selectDate(mockTomorrow));
      expect(state.version).toBe('2.5.1');
    });

    it('should handle rapid date changes', () => {
      let state = initialState;

      for (let i = 0; i < 100; i++) {
        const date = new Date(2024, 0, i + 1).getTime();
        state = appReducer(state, selectDate(date));
      }

      const expectedDate = new Date(2024, 0, 100).getTime();
      expect(state.selectedDate).toBe(expectedDate);
    });
  });

  describe('edge cases', () => {
    it('should handle selecting same date multiple times', () => {
      let state = initialState;

      state = appReducer(state, selectDate(mockToday));
      state = appReducer(state, selectDate(mockToday));
      state = appReducer(state, selectDate(mockToday));

      expect(state.selectedDate).toBe(mockToday);
    });

    it('should handle very large timestamps', () => {
      const largeTimestamp = Number.MAX_SAFE_INTEGER;
      const action = selectDate(largeTimestamp);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(largeTimestamp);
    });

    it('should handle negative timestamps', () => {
      const negativeTimestamp = -1000000000;
      const action = selectDate(negativeTimestamp);
      const newState = appReducer(initialState, action);

      expect(newState.selectedDate).toBe(negativeTimestamp);
    });
  });
});

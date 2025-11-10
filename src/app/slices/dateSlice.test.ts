import { describe, it, expect } from 'vitest';
import dateReducer, {
  createDate,
  addTaskToDate,
  removeTaskFromDate,
  reorderTasksForDate,
  getTasksForDate,
  getDatesWithTasks,
  type DateState,
} from './dateSlice';
import { mockToday, mockYesterday } from '../../test-utils/test-utils';
import type { RootState } from '../store';

describe('dateSlice', () => {
  const initialState: DateState = {
    dateTasks: [],
  };

  describe('createDate', () => {
    it('should create a new date entry with empty tasks array', () => {
      const action = createDate({ date: mockToday });
      const newState = dateReducer(initialState, action);

      expect(newState.dateTasks).toHaveLength(1);
      expect(newState.dateTasks[0]).toEqual({
        date: mockToday,
        tasks: [],
      });
    });

    it('should not create duplicate date entries', () => {
      const stateWithDate: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2] }],
      };

      const action = createDate({ date: mockToday });
      const newState = dateReducer(stateWithDate, action);

      expect(newState.dateTasks).toHaveLength(1);
      expect(newState.dateTasks[0].tasks).toEqual([1, 2]);
    });

    it('should allow multiple different dates', () => {
      let state = initialState;

      state = dateReducer(state, createDate({ date: mockToday }));
      state = dateReducer(state, createDate({ date: mockYesterday }));

      expect(state.dateTasks).toHaveLength(2);
      expect(state.dateTasks[0].date).toBe(mockToday);
      expect(state.dateTasks[1].date).toBe(mockYesterday);
    });
  });

  describe('addTaskToDate', () => {
    it('should add task id to date tasks array', () => {
      const stateWithDate: DateState = {
        dateTasks: [{ date: mockToday, tasks: [] }],
      };

      const action = addTaskToDate({ date: mockToday, taskId: 1 });
      const newState = dateReducer(stateWithDate, action);

      expect(newState.dateTasks[0].tasks).toEqual([1]);
    });

    it('should add multiple tasks to same date', () => {
      let state: DateState = {
        dateTasks: [{ date: mockToday, tasks: [] }],
      };

      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 1 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 2 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 3 }));

      expect(state.dateTasks[0].tasks).toEqual([1, 2, 3]);
    });

    it('should not modify state if date does not exist', () => {
      const action = addTaskToDate({ date: mockToday, taskId: 1 });
      const newState = dateReducer(initialState, action);

      expect(newState.dateTasks).toHaveLength(0);
    });

    it('should add task to correct date when multiple dates exist', () => {
      const stateWithMultipleDates: DateState = {
        dateTasks: [
          { date: mockToday, tasks: [1] },
          { date: mockYesterday, tasks: [2] },
        ],
      };

      const action = addTaskToDate({ date: mockYesterday, taskId: 3 });
      const newState = dateReducer(stateWithMultipleDates, action);

      expect(newState.dateTasks[0].tasks).toEqual([1]);
      expect(newState.dateTasks[1].tasks).toEqual([2, 3]);
    });

    it('should allow adding same task id multiple times', () => {
      let state: DateState = {
        dateTasks: [{ date: mockToday, tasks: [] }],
      };

      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 1 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 1 }));

      expect(state.dateTasks[0].tasks).toEqual([1, 1]);
    });
  });

  describe('removeTaskFromDate', () => {
    it('should remove task id from date tasks array', () => {
      const stateWithTask: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
      };

      const action = removeTaskFromDate({ date: mockToday, taskId: 2 });
      const newState = dateReducer(stateWithTask, action);

      expect(newState.dateTasks[0].tasks).toEqual([1, 3]);
    });

    it('should remove all instances of task id', () => {
      const stateWithDuplicates: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 1, 3, 1] }],
      };

      const action = removeTaskFromDate({ date: mockToday, taskId: 1 });
      const newState = dateReducer(stateWithDuplicates, action);

      expect(newState.dateTasks[0].tasks).toEqual([2, 3]);
    });

    it('should not modify state if date does not exist', () => {
      const action = removeTaskFromDate({ date: mockToday, taskId: 1 });
      const newState = dateReducer(initialState, action);

      expect(newState.dateTasks).toHaveLength(0);
    });

    it('should not modify state if task id does not exist in date', () => {
      const stateWithTasks: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
      };

      const action = removeTaskFromDate({ date: mockToday, taskId: 999 });
      const newState = dateReducer(stateWithTasks, action);

      expect(newState.dateTasks[0].tasks).toEqual([1, 2, 3]);
    });

    it('should remove from correct date when multiple dates exist', () => {
      const stateWithMultipleDates: DateState = {
        dateTasks: [
          { date: mockToday, tasks: [1, 2, 3] },
          { date: mockYesterday, tasks: [1, 4, 5] },
        ],
      };

      const action = removeTaskFromDate({ date: mockYesterday, taskId: 1 });
      const newState = dateReducer(stateWithMultipleDates, action);

      expect(newState.dateTasks[0].tasks).toEqual([1, 2, 3]);
      expect(newState.dateTasks[1].tasks).toEqual([4, 5]);
    });

    it('should handle removing last task from date', () => {
      const stateWithOneTask: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1] }],
      };

      const action = removeTaskFromDate({ date: mockToday, taskId: 1 });
      const newState = dateReducer(stateWithOneTask, action);

      expect(newState.dateTasks[0].tasks).toEqual([]);
    });
  });

  describe('reorderTasksForDate', () => {
    it('should replace tasks array with new order', () => {
      const stateWithTasks: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
      };

      const action = reorderTasksForDate({
        date: mockToday,
        newTaskOrder: [3, 1, 2],
      });
      const newState = dateReducer(stateWithTasks, action);

      expect(newState.dateTasks[0].tasks).toEqual([3, 1, 2]);
    });

    it('should not modify state if date does not exist', () => {
      const action = reorderTasksForDate({
        date: mockToday,
        newTaskOrder: [1, 2, 3],
      });
      const newState = dateReducer(initialState, action);

      expect(newState.dateTasks).toHaveLength(0);
    });

    it('should handle empty new task order', () => {
      const stateWithTasks: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
      };

      const action = reorderTasksForDate({
        date: mockToday,
        newTaskOrder: [],
      });
      const newState = dateReducer(stateWithTasks, action);

      expect(newState.dateTasks[0].tasks).toEqual([]);
    });

    it('should reorder correct date when multiple dates exist', () => {
      const stateWithMultipleDates: DateState = {
        dateTasks: [
          { date: mockToday, tasks: [1, 2, 3] },
          { date: mockYesterday, tasks: [4, 5, 6] },
        ],
      };

      const action = reorderTasksForDate({
        date: mockYesterday,
        newTaskOrder: [6, 4, 5],
      });
      const newState = dateReducer(stateWithMultipleDates, action);

      expect(newState.dateTasks[0].tasks).toEqual([1, 2, 3]);
      expect(newState.dateTasks[1].tasks).toEqual([6, 4, 5]);
    });

    it('should handle reordering with different task count', () => {
      const stateWithTasks: DateState = {
        dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
      };

      const action = reorderTasksForDate({
        date: mockToday,
        newTaskOrder: [2, 1],
      });
      const newState = dateReducer(stateWithTasks, action);

      expect(newState.dateTasks[0].tasks).toEqual([2, 1]);
    });
  });

  describe('getTasksForDate', () => {
    it('should return tasks array for existing date', () => {
      const mockState = {
        app: { version: '1.0', selectedDate: mockToday },
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1, 2, 3] },
            { date: mockYesterday, tasks: [4, 5] },
          ],
        },
      };

      const tasks = getTasksForDate(mockState, mockToday);

      expect(tasks).toEqual([1, 2, 3]);
    });

    it('should return empty array for non-existent date', () => {
      const mockState = {
        app: { version: '1.0', selectedDate: mockToday },
        date: {
          dateTasks: [{ date: mockToday, tasks: [1, 2, 3] }],
        },
      };

      const tasks = getTasksForDate(mockState, mockYesterday);

      expect(tasks).toEqual([]);
    });

    it('should return empty array when dateTasks is empty', () => {
      const mockState = {
        app: { version: '1.0', selectedDate: mockToday },
        date: {
          dateTasks: [],
        },
      };

      const tasks = getTasksForDate(mockState, mockToday);

      expect(tasks).toEqual([]);
    });

    it('should return correct tasks for different dates', () => {
      const mockState = {
        app: { version: '1.0', selectedDate: mockToday },
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1, 2] },
            { date: mockYesterday, tasks: [3, 4] },
          ],
        },
      };

      const todayTasks = getTasksForDate(mockState, mockToday);
      const yesterdayTasks = getTasksForDate(mockState, mockYesterday);

      expect(todayTasks).toEqual([1, 2]);
      expect(yesterdayTasks).toEqual([3, 4]);
    });
  });

  describe('getDatesWithTasks', () => {
    it('should return only dates that have tasks', () => {
      const mockState = {
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1, 2] },
            { date: mockYesterday, tasks: [] },
          ],
        },
      } as RootState;

      const datesWithTasks = getDatesWithTasks(mockState);

      expect(datesWithTasks).toHaveLength(1);
      expect(datesWithTasks[0].date).toBe(mockToday);
    });

    it('should return empty array if no dates have tasks', () => {
      const mockState = {
        date: {
          dateTasks: [
            { date: mockToday, tasks: [] },
            { date: mockYesterday, tasks: [] },
          ],
        },
      } as unknown as RootState;

      const datesWithTasks = getDatesWithTasks(mockState);

      expect(datesWithTasks).toEqual([]);
    });

    it('should return all dates if all have tasks', () => {
      const mockState = {
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1] },
            { date: mockYesterday, tasks: [2] },
          ],
        },
      } as RootState;

      const datesWithTasks = getDatesWithTasks(mockState);

      expect(datesWithTasks).toHaveLength(2);
    });

    it('should handle empty dateTasks array', () => {
      const mockState = {
        date: {
          dateTasks: [],
        },
      } as unknown as RootState;

      const datesWithTasks = getDatesWithTasks(mockState);

      expect(datesWithTasks).toEqual([]);
    });
  });

  describe('integration tests', () => {
    it('should handle complete workflow for a date', () => {
      let state = initialState;

      // Create date
      state = dateReducer(state, createDate({ date: mockToday }));
      expect(state.dateTasks).toHaveLength(1);

      // Add tasks
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 1 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 2 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 3 }));
      expect(state.dateTasks[0].tasks).toEqual([1, 2, 3]);

      // Reorder tasks
      state = dateReducer(
        state,
        reorderTasksForDate({ date: mockToday, newTaskOrder: [3, 1, 2] })
      );
      expect(state.dateTasks[0].tasks).toEqual([3, 1, 2]);

      // Remove task
      state = dateReducer(
        state,
        removeTaskFromDate({ date: mockToday, taskId: 1 })
      );
      expect(state.dateTasks[0].tasks).toEqual([3, 2]);
    });

    it('should handle multiple dates independently', () => {
      let state = initialState;

      // Create two dates
      state = dateReducer(state, createDate({ date: mockToday }));
      state = dateReducer(state, createDate({ date: mockYesterday }));

      // Add tasks to both dates
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 1 }));
      state = dateReducer(state, addTaskToDate({ date: mockToday, taskId: 2 }));
      state = dateReducer(
        state,
        addTaskToDate({ date: mockYesterday, taskId: 3 })
      );

      expect(state.dateTasks[0].tasks).toEqual([1, 2]);
      expect(state.dateTasks[1].tasks).toEqual([3]);

      // Modify only one date
      state = dateReducer(
        state,
        removeTaskFromDate({ date: mockToday, taskId: 1 })
      );

      expect(state.dateTasks[0].tasks).toEqual([2]);
      expect(state.dateTasks[1].tasks).toEqual([3]);
    });
  });
});

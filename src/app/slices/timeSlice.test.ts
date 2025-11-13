import { describe, it, expect } from 'vitest';
import timeReducer, {
  createDate,
  startTime,
  stopTime,
  recordTime,
  removeTime,
  toggleSegment,
  getSegment,
  getTimesForDate,
  getTimesForTask,
  type TimeState,
  type TaskTime,
} from './timeSlice';
import { mockToday } from '../../test-utils/test-utils';
import { START_HOUR } from '../constants';
import type { RootState } from '../store';

describe('timeSlice', () => {
  const initialState: TimeState = {
    dateTimes: [],
  };

  describe('createDate', () => {
    it('should create a new date entry with empty task times', () => {
      const action = createDate({ date: mockToday });
      const newState = timeReducer(initialState, action);

      expect(newState.dateTimes).toHaveLength(1);
      expect(newState.dateTimes[0]).toEqual({
        date: mockToday,
        taskTimes: [],
      });
    });

    it('should not create duplicate date entries', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = createDate({ date: mockToday });
      const newState = timeReducer(stateWithDate, action);

      expect(newState.dateTimes).toHaveLength(1);
    });
  });

  describe('startTime', () => {
    it('should add a time entry without an end time', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = startTime({ date: mockToday, taskId: 1 });
      const newState = timeReducer(stateWithDate, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(1);
      expect(newState.dateTimes[0].taskTimes[0]).toMatchObject({
        task: 1,
        start: expect.any(Number),
      });
      expect(newState.dateTimes[0].taskTimes[0].end).toBeUndefined();
    });

    it('should not add time if date does not exist', () => {
      const action = startTime({ date: mockToday, taskId: 1 });
      const newState = timeReducer(initialState, action);

      expect(newState.dateTimes).toHaveLength(0);
    });
  });

  describe('stopTime', () => {
    it('should add end time to an existing time entry', () => {
      const startTimestamp = new Date('2024-01-15T10:00:00').getTime();
      const stateWithStartedTime: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start: startTimestamp }],
          },
        ],
      };

      const action = stopTime({
        date: mockToday,
        taskId: 1,
        start: startTimestamp,
      });
      const newState = timeReducer(stateWithStartedTime, action);

      expect(newState.dateTimes[0].taskTimes[0].end).toBeDefined();
      expect(newState.dateTimes[0].taskTimes[0].end).toBeGreaterThan(
        startTimestamp
      );
    });

    it('should not modify state if date does not exist', () => {
      const action = stopTime({
        date: mockToday,
        taskId: 1,
        start: Date.now(),
      });
      const newState = timeReducer(initialState, action);

      expect(newState.dateTimes).toHaveLength(0);
    });

    it('should not modify state if task time does not exist', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = stopTime({
        date: mockToday,
        taskId: 1,
        start: Date.now(),
      });
      const newState = timeReducer(stateWithDate, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(0);
    });
  });

  describe('recordTime', () => {
    it('should add a complete time entry with start and end', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const start = new Date('2024-01-15T10:00:00').getTime();
      const end = new Date('2024-01-15T10:15:00').getTime();

      const action = recordTime({ date: mockToday, taskId: 1, start, end });
      const newState = timeReducer(stateWithDate, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(1);
      expect(newState.dateTimes[0].taskTimes[0]).toEqual({
        task: 1,
        start,
        end,
      });
    });

    it('should not add time if date does not exist', () => {
      const start = new Date('2024-01-15T10:00:00').getTime();
      const end = new Date('2024-01-15T10:15:00').getTime();

      const action = recordTime({ date: mockToday, taskId: 1, start, end });
      const newState = timeReducer(initialState, action);

      expect(newState.dateTimes).toHaveLength(0);
    });
  });

  describe('removeTime', () => {
    it('should remove a time entry by task id and start time', () => {
      const start = new Date('2024-01-15T10:00:00').getTime();
      const end = new Date('2024-01-15T10:15:00').getTime();

      const stateWithTime: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      };

      const action = removeTime({ date: mockToday, taskId: 1, start });
      const newState = timeReducer(stateWithTime, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(0);
    });

    it('should only remove the matching time entry', () => {
      const start1 = new Date('2024-01-15T10:00:00').getTime();
      const end1 = new Date('2024-01-15T10:15:00').getTime();
      const start2 = new Date('2024-01-15T11:00:00').getTime();
      const end2 = new Date('2024-01-15T11:15:00').getTime();

      const stateWithMultipleTimes: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [
              { task: 1, start: start1, end: end1 },
              { task: 1, start: start2, end: end2 },
            ],
          },
        ],
      };

      const action = removeTime({ date: mockToday, taskId: 1, start: start1 });
      const newState = timeReducer(stateWithMultipleTimes, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(1);
      expect(newState.dateTimes[0].taskTimes[0].start).toBe(start2);
    });

    it('should not modify state if date does not exist', () => {
      const action = removeTime({
        date: mockToday,
        taskId: 1,
        start: Date.now(),
      });
      const newState = timeReducer(initialState, action);

      expect(newState.dateTimes).toHaveLength(0);
    });
  });

  describe('toggleSegment', () => {
    it('should add time entry when toggling unlogged segment', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 0,
      });
      const newState = timeReducer(stateWithDate, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(1);
      expect(newState.dateTimes[0].taskTimes[0]).toMatchObject({
        task: 1,
        start: expect.any(Number),
        end: expect.any(Number),
      });

      // Verify the time range is correct (segment 0 = 7:00-7:15)
      const taskTime = newState.dateTimes[0].taskTimes[0];
      const startDate = new Date(taskTime.start);
      const endDate = new Date(taskTime.end!);

      expect(startDate.getHours()).toBe(START_HOUR);
      expect(startDate.getMinutes()).toBe(0);
      expect(endDate.getHours()).toBe(START_HOUR);
      expect(endDate.getMinutes()).toBe(15);
    });

    it('should remove time entry when toggling logged segment', () => {
      const dateObj = new Date(mockToday);
      const start = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        0
      ).getTime();
      const end = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        15
      ).getTime();

      const stateWithLoggedSegment: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      };

      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 0,
      });
      const newState = timeReducer(stateWithLoggedSegment, action);

      expect(newState.dateTimes[0].taskTimes).toHaveLength(0);
    });

    it('should handle mid-day segments correctly (segment 20 = 12:00-12:15)', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 20, // 20/4 = 5 hours after START_HOUR = 12:00pm
      });
      const newState = timeReducer(stateWithDate, action);

      const taskTime = newState.dateTimes[0].taskTimes[0];
      const startDate = new Date(taskTime.start);
      const endDate = new Date(taskTime.end!);

      expect(startDate.getHours()).toBe(12);
      expect(startDate.getMinutes()).toBe(0);
      expect(endDate.getHours()).toBe(12);
      expect(endDate.getMinutes()).toBe(15);
    });

    it('should handle last segment correctly (segment 43 = 5:45-6:00)', () => {
      const stateWithDate: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 43, // Last 15-min segment before 6pm
      });
      const newState = timeReducer(stateWithDate, action);

      const taskTime = newState.dateTimes[0].taskTimes[0];
      const startDate = new Date(taskTime.start);
      const endDate = new Date(taskTime.end!);

      expect(startDate.getHours()).toBe(17);
      expect(startDate.getMinutes()).toBe(45);
      expect(endDate.getHours()).toBe(18);
      expect(endDate.getMinutes()).toBe(0);
    });

    it('should remove all overlapping time entries when toggling', () => {
      const dateObj = new Date(mockToday);
      const start1 = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        0
      ).getTime();
      const end1 = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        30
      ).getTime();

      const stateWithOverlappingTime: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start: start1, end: end1 }],
          },
        ],
      };

      // Toggle segment 0 (7:00-7:15), which overlaps with the existing entry
      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 0,
      });
      const newState = timeReducer(stateWithOverlappingTime, action);

      // Should remove the overlapping entry
      expect(newState.dateTimes[0].taskTimes).toHaveLength(0);
    });

    it('should not modify state if date does not exist', () => {
      const state: TimeState = {
        dateTimes: [],
      };

      const action = toggleSegment({
        date: mockToday,
        taskId: 1,
        segment: 0,
      });
      const newState = timeReducer(state, action);

      expect(newState.dateTimes).toHaveLength(0);
    });
  });

  describe('getSegment', () => {
    it('should return logged: false for unlogged segment', () => {
      const state: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const result = getSegment(state, mockToday, 1, 0);

      expect(result.logged).toBe(false);
      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
    });

    it('should return logged: true for logged segment', () => {
      const dateObj = new Date(mockToday);
      const start = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        0
      ).getTime();
      const end = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        15
      ).getTime();

      const state: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      };

      const result = getSegment(state, mockToday, 1, 0);

      expect(result.logged).toBe(true);
    });

    it('should return correct time boundaries for segment', () => {
      const state: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes: [] }],
      };

      const result = getSegment(state, mockToday, 1, 0);

      const startDate = new Date(result.start);
      const endDate = new Date(result.end);

      expect(startDate.getHours()).toBe(START_HOUR);
      expect(startDate.getMinutes()).toBe(0);
      expect(endDate.getHours()).toBe(START_HOUR);
      expect(endDate.getMinutes()).toBe(15);
    });

    it('should handle date without entry', () => {
      const state: TimeState = {
        dateTimes: [],
      };

      const result = getSegment(state, mockToday, 1, 0);

      expect(result.logged).toBe(false);
      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
    });

    it('should detect partial overlaps as logged', () => {
      const dateObj = new Date(mockToday);
      const start = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        10
      ).getTime();
      const end = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        START_HOUR,
        20
      ).getTime();

      const state: TimeState = {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      };

      const result = getSegment(state, mockToday, 1, 0);

      expect(result.logged).toBe(true);
    });
  });

  describe('getTimesForDate', () => {
    it('should return all task times for a date', () => {
      const taskTimes: TaskTime[] = [
        {
          task: 1,
          start: new Date('2024-01-15T10:00:00').getTime(),
          end: new Date('2024-01-15T10:15:00').getTime(),
        },
        {
          task: 2,
          start: new Date('2024-01-15T11:00:00').getTime(),
          end: new Date('2024-01-15T11:15:00').getTime(),
        },
      ];

      const state: TimeState = {
        dateTimes: [{ date: mockToday, taskTimes }],
      };

      const result = getTimesForDate(state, mockToday);

      expect(result).toHaveLength(2);
      expect(result).toEqual(taskTimes);
    });

    it('should return empty array if date does not exist', () => {
      const state: TimeState = {
        dateTimes: [],
      };

      const result = getTimesForDate(state, mockToday);

      expect(result).toEqual([]);
    });
  });

  describe('getTimesForTask', () => {
    it('should return only times for specific task', () => {
      const taskTimes: TaskTime[] = [
        {
          task: 1,
          start: new Date('2024-01-15T10:00:00').getTime(),
          end: new Date('2024-01-15T10:15:00').getTime(),
        },
        {
          task: 2,
          start: new Date('2024-01-15T11:00:00').getTime(),
          end: new Date('2024-01-15T11:15:00').getTime(),
        },
        {
          task: 1,
          start: new Date('2024-01-15T12:00:00').getTime(),
          end: new Date('2024-01-15T12:15:00').getTime(),
        },
      ];

      const state: RootState = {
        time: {
          dateTimes: [{ date: mockToday, taskTimes }],
        },
      } as RootState;

      const result = getTimesForTask(state, mockToday, 1);

      expect(result).toHaveLength(2);
      expect(result[0].task).toBe(1);
      expect(result[1].task).toBe(1);
    });

    it('should return empty array if date does not exist', () => {
      const state: RootState = {
        time: {
          dateTimes: [],
        },
      } as unknown as RootState;

      const result = getTimesForTask(state, mockToday, 1);

      expect(result).toEqual([]);
    });

    it('should return empty array if no times match task', () => {
      const taskTimes: TaskTime[] = [
        {
          task: 2,
          start: new Date('2024-01-15T11:00:00').getTime(),
          end: new Date('2024-01-15T11:15:00').getTime(),
        },
      ];

      const state: RootState = {
        time: {
          dateTimes: [{ date: mockToday, taskTimes }],
        },
      } as RootState;

      const result = getTimesForTask(state, mockToday, 1);

      expect(result).toEqual([]);
    });
  });
});

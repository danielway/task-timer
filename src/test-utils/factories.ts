import type { Task } from '../app/slices/taskSlice';
import type { TaskTime } from '../app/slices/timeSlice';
import type { RootState } from '../app/store';
import { mockToday } from './test-utils';

export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: 1,
  description: 'Test Task',
  type: 'task',
  ...overrides,
});

export const createMockTaskTime = (
  overrides: Partial<TaskTime> = {}
): TaskTime => ({
  task: 1,
  start: new Date('2024-01-15T10:00:00').getTime(),
  end: new Date('2024-01-15T10:15:00').getTime(),
  ...overrides,
});

export const createMockDateTask = (date: number, tasks: number[]) => ({
  date,
  tasks,
});

export const createMockDateTimes = (
  date: number,
  taskTimes: TaskTime[] = []
) => ({
  date,
  taskTimes,
});

export const createMockState = (
  overrides: Partial<RootState> = {}
): RootState => ({
  app: {
    version: '1.0.0',
    selectedDate: mockToday,
  },
  task: {
    nextTaskId: 1,
    tasks: [],
  },
  date: {
    dateTasks: [],
  },
  time: {
    dateTimes: [],
  },
  edit: {},
  ...overrides,
});

export const createMockStateWithTask = (
  taskId: number = 1,
  description: string = 'Test Task',
  date: number = mockToday
): RootState => ({
  app: {
    version: '1.0.0',
    selectedDate: date,
  },
  task: {
    nextTaskId: taskId + 1,
    tasks: [{ id: taskId, description, type: 'task' }],
  },
  date: {
    dateTasks: [{ date, tasks: [taskId] }],
  },
  time: {
    dateTimes: [{ date, taskTimes: [] }],
  },
  edit: {},
});

export const createMockStateWithTaskAndTime = (
  taskId: number = 1,
  description: string = 'Test Task',
  date: number = mockToday,
  segment: number = 0
): RootState => {
  // Calculate segment start and end times
  const dateObj = new Date(date);
  const START_HOUR = 7;
  const start = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + Math.floor(segment / 4),
    (segment % 4) * 15
  ).getTime();

  const end = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    START_HOUR + Math.floor((segment + 1) / 4),
    ((segment + 1) % 4) * 15
  ).getTime();

  return {
    app: {
      version: '1.0.0',
      selectedDate: date,
    },
    task: {
      nextTaskId: taskId + 1,
      tasks: [{ id: taskId, description, type: 'task' }],
    },
    date: {
      dateTasks: [{ date, tasks: [taskId] }],
    },
    time: {
      dateTimes: [
        {
          date,
          taskTimes: [{ task: taskId, start, end }],
        },
      ],
    },
    edit: {},
  };
};

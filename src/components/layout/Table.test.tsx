import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import {
  renderWithProviders,
  mockToday,
  type TestState,
} from '../../test-utils/test-utils';
import { Table } from './Table';

describe('Table', () => {
  const defaultState: Partial<TestState> = {
    app: {
      version: '1.0',
      selectedDate: mockToday,
      backlogOpen: false,
      backlogExpanded: false,
      showCompleted: true,
    },
    task: { nextTaskId: 1, tasks: [] },
    date: {
      dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
    },
    time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
  };

  it('should render the table header with Task column', () => {
    renderWithProviders(<Table />, {
      preloadedState: defaultState,
    });

    // Find the header cell specifically
    const headers = screen.getAllByRole('columnheader');
    const taskHeader = headers.find((h) => h.textContent === 'Task');
    expect(taskHeader).toBeTruthy();
  });

  it('should render the table header with Total column', () => {
    renderWithProviders(<Table />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('Total')).toBeTruthy();
  });

  it('should render time headers', () => {
    renderWithProviders(<Table />, {
      preloadedState: defaultState,
    });

    // Should have hour headers like "7:00", "8:00", etc.
    expect(screen.getByText('7:00')).toBeTruthy();
    expect(screen.getByText('12:00')).toBeTruthy();
  });

  it('should render the task creation row', () => {
    renderWithProviders(<Table />, {
      preloadedState: defaultState,
    });

    expect(screen.getByPlaceholderText('Task name/description')).toBeTruthy();
  });

  it('should render tasks when they exist', () => {
    const stateWithTask: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: false,
        backlogExpanded: false,
        showCompleted: true,
      },
      task: {
        nextTaskId: 2,
        tasks: [
          {
            id: 1,
            description: 'Test Task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [1], taskFirstWorkTime: {} }],
      },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
    };

    renderWithProviders(<Table />, {
      preloadedState: stateWithTask,
    });

    expect(screen.getByText('Test Task')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderWithProviders,
  mockToday,
  type TestState,
} from '../../test-utils/test-utils';
import { BacklogDrawer } from './BacklogDrawer';

describe('BacklogDrawer', () => {
  const defaultState: Partial<TestState> = {
    app: {
      version: '1.0',
      selectedDate: mockToday,
      backlogOpen: true,
      backlogExpanded: false,
      showCompleted: true,
    },
    task: { nextTaskId: 1, tasks: [] },
    date: {
      dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
    },
  };

  it('should render when backlog is open', () => {
    renderWithProviders(<BacklogDrawer />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('Backlog')).toBeTruthy();
  });

  it('should show empty state when no tasks in backlog', () => {
    renderWithProviders(<BacklogDrawer />, {
      preloadedState: defaultState,
    });

    expect(screen.getByText('No tasks in backlog')).toBeTruthy();
  });

  it('should display backlog tasks that are not assigned to any date', () => {
    const stateWithBacklogTask: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: true,
        backlogExpanded: false,
        showCompleted: true,
      },
      task: {
        nextTaskId: 3,
        tasks: [
          {
            id: 1,
            description: 'Backlog Task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
          {
            id: 2,
            description: 'Assigned Task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [2], taskFirstWorkTime: {} }],
      },
    };

    renderWithProviders(<BacklogDrawer />, {
      preloadedState: stateWithBacklogTask,
    });

    // Backlog task should be visible
    expect(screen.getByText('Backlog Task')).toBeTruthy();
    // Assigned task should not be in backlog
    expect(screen.queryByText('Assigned Task')).toBeNull();
  });

  it('should filter tasks by search query', async () => {
    const user = userEvent.setup();

    const stateWithTasks: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: true,
        backlogExpanded: false,
        showCompleted: true,
      },
      task: {
        nextTaskId: 3,
        tasks: [
          {
            id: 1,
            description: 'First backlog task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
          {
            id: 2,
            description: 'Second backlog task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
      },
    };

    renderWithProviders(<BacklogDrawer />, {
      preloadedState: stateWithTasks,
    });

    // Both tasks should be visible initially
    expect(screen.getByText('First backlog task')).toBeTruthy();
    expect(screen.getByText('Second backlog task')).toBeTruthy();

    // Search for "First"
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'First');

    // Only first task should be visible
    expect(screen.getByText('First backlog task')).toBeTruthy();
    expect(screen.queryByText('Second backlog task')).toBeNull();
  });

  it('should filter tasks by project', () => {
    const stateWithProjectFilter: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: true,
        backlogExpanded: false,
        showCompleted: true,
        projectFilter: 1,
      },
      task: {
        nextTaskId: 3,
        tasks: [
          {
            id: 1,
            description: 'Task with project',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
            projectId: 1,
          },
          {
            id: 2,
            description: 'Task without project',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
      },
    };

    renderWithProviders(<BacklogDrawer />, {
      preloadedState: stateWithProjectFilter,
    });

    // Only task with matching project should be visible
    expect(screen.getByText('Task with project')).toBeTruthy();
    expect(screen.queryByText('Task without project')).toBeNull();
  });

  it('should show "no tasks match" message when filters hide all tasks', async () => {
    const user = userEvent.setup();

    const stateWithTasks: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: true,
        backlogExpanded: false,
        showCompleted: true,
      },
      task: {
        nextTaskId: 2,
        tasks: [
          {
            id: 1,
            description: 'Some task',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
      },
    };

    renderWithProviders(<BacklogDrawer />, {
      preloadedState: stateWithTasks,
    });

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No tasks match your filters')).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  renderWithProviders,
  mockToday,
  type TestState,
} from '../../test-utils/test-utils';
import { TaskCreationRow } from './TaskCreationRow';

describe('TaskCreationRow', () => {
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

  it('should render input field and add task button', () => {
    renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    expect(screen.getByPlaceholderText('Task name/description')).toBeTruthy();
    expect(screen.getByRole('button', { name: /add task/i })).toBeTruthy();
  });

  it('should update input value when typing', async () => {
    const user = userEvent.setup();

    renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText(
      'Task name/description'
    ) as HTMLInputElement;

    await user.type(input, 'New Task');

    expect(input.value).toBe('New Task');
  });

  it('should create task when clicking Add Task button', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'My New Task');
    await user.click(button);

    const taskState = stores.task.getState();
    expect(taskState.tasks).toHaveLength(1);
    expect(taskState.tasks[0].description).toBe('My New Task');
    expect(taskState.tasks[0].id).toBe(1);
  });

  it('should add task to current date when created', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'My New Task');
    await user.click(button);

    const dateState = stores.date.getState();
    expect(dateState.dateTasks[0].tasks).toContain(1);
  });

  it('should clear input after creating task', async () => {
    const user = userEvent.setup();

    renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText(
      'Task name/description'
    ) as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'My New Task');
    await user.click(button);

    expect(input.value).toBe('');
  });

  it('should increment nextTaskId after creating task', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Task 1');
    await user.click(button);

    let taskState = stores.task.getState();
    expect(taskState.nextTaskId).toBe(2);

    await user.type(input, 'Task 2');
    await user.click(button);

    taskState = stores.task.getState();
    expect(taskState.nextTaskId).toBe(3);
  });

  it('should create task when pressing Enter key', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');

    await user.type(input, 'Task via Enter{Enter}');

    const taskState = stores.task.getState();
    expect(taskState.tasks).toHaveLength(1);
    expect(taskState.tasks[0].description).toBe('Task via Enter');
  });

  it('should clear input when pressing Escape key', async () => {
    const user = userEvent.setup();

    renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText(
      'Task name/description'
    ) as HTMLInputElement;

    await user.type(input, 'Some text');
    expect(input.value).toBe('Some text');

    await user.keyboard('{Escape}');
    expect(input.value).toBe('');
  });

  it('should allow creating multiple tasks', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Task 1');
    await user.click(button);

    await user.type(input, 'Task 2');
    await user.click(button);

    await user.type(input, 'Task 3');
    await user.click(button);

    const taskState = stores.task.getState();
    expect(taskState.tasks).toHaveLength(3);
    expect(taskState.tasks[0].description).toBe('Task 1');
    expect(taskState.tasks[1].description).toBe('Task 2');
    expect(taskState.tasks[2].description).toBe('Task 3');
  });

  it('should not create task with empty description', async () => {
    const user = userEvent.setup();

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const button = screen.getByRole('button', { name: /add task/i });

    await user.click(button);

    const taskState = stores.task.getState();
    // Should not create a task with empty description due to validation
    expect(taskState.tasks).toHaveLength(0);
  });

  it('should use correct task id based on nextTaskId', async () => {
    const user = userEvent.setup();

    const stateWithExistingTasks: Partial<TestState> = {
      app: {
        version: '1.0',
        selectedDate: mockToday,
        backlogOpen: false,
        backlogExpanded: false,
        showCompleted: true,
      },
      task: {
        nextTaskId: 5,
        tasks: [
          {
            id: 1,
            description: 'Task 1',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
          {
            id: 2,
            description: 'Task 2',
            type: 'task',
            status: 'new',
            createdAt: Date.now(),
          },
        ],
      },
      date: {
        dateTasks: [{ date: mockToday, tasks: [1, 2], taskFirstWorkTime: {} }],
      },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
    };

    const { stores } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: stateWithExistingTasks,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'New Task');
    await user.click(button);

    const taskState = stores.task.getState();
    expect(taskState.tasks).toHaveLength(3);
    expect(taskState.tasks[2].id).toBe(5);
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { TaskCreationRow } from './TaskCreationRow';
import type { RootState } from '../../app/store';

describe('TaskCreationRow', () => {
  const defaultState: Partial<RootState> = {
    app: { version: '1.0', selectedDate: mockToday },
    task: { nextTaskId: 1, tasks: [] },
    date: { dateTasks: [{ date: mockToday, tasks: [] }] },
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

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'My New Task');
    await user.click(button);

    const state = store.getState() as RootState;
    expect(state.task.tasks).toHaveLength(1);
    expect(state.task.tasks[0].description).toBe('My New Task');
    expect(state.task.tasks[0].id).toBe(1);
  });

  it('should add task to current date when created', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'My New Task');
    await user.click(button);

    const state = store.getState() as RootState;
    expect(state.date.dateTasks[0].tasks).toContain(1);
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

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'Task 1');
    await user.click(button);

    let state = store.getState() as RootState;
    expect(state.task.nextTaskId).toBe(2);

    await user.type(input, 'Task 2');
    await user.click(button);

    state = store.getState() as RootState;
    expect(state.task.nextTaskId).toBe(3);
  });

  it('should create task when pressing Enter key', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const input = screen.getByPlaceholderText('Task name/description');

    await user.type(input, 'Task via Enter{Enter}');

    const state = store.getState() as RootState;
    expect(state.task.tasks).toHaveLength(1);
    expect(state.task.tasks[0].description).toBe('Task via Enter');
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

    const { store } = renderWithProviders(<TaskCreationRow />, {
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

    const state = store.getState() as RootState;
    expect(state.task.tasks).toHaveLength(3);
    expect(state.task.tasks[0].description).toBe('Task 1');
    expect(state.task.tasks[1].description).toBe('Task 2');
    expect(state.task.tasks[2].description).toBe('Task 3');
  });

  it('should handle empty description', async () => {
    const user = userEvent.setup();

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: defaultState,
    });

    const button = screen.getByRole('button', { name: /add task/i });

    await user.click(button);

    const state = store.getState() as RootState;
    expect(state.task.tasks).toHaveLength(1);
    expect(state.task.tasks[0].description).toBe('');
  });

  it('should display total time for date', () => {
    const start1 = new Date(mockToday).setHours(7, 0, 0, 0);
    const end1 = new Date(mockToday).setHours(7, 30, 0, 0);
    const start2 = new Date(mockToday).setHours(8, 0, 0, 0);
    const end2 = new Date(mockToday).setHours(8, 15, 0, 0);

    const stateWithTime: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      task: { nextTaskId: 3, tasks: [] },
      date: { dateTasks: [{ date: mockToday, tasks: [] }] },
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [
              { task: 1, start: start1, end: end1 },
              { task: 2, start: start2, end: end2 },
            ],
          },
        ],
      },
    };

    const { container } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: stateWithTime,
    });

    // Total should be 30 + 15 = 45 minutes = 0:45
    // Text might be split across elements, so check container text
    expect(container.textContent).toContain('0');
    expect(container.textContent).toContain('45');
  });

  it('should use correct task id based on nextTaskId', async () => {
    const user = userEvent.setup();

    const stateWithExistingTasks: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      task: {
        nextTaskId: 5,
        tasks: [
          { id: 1, description: 'Task 1', type: 'task' },
          { id: 2, description: 'Task 2', type: 'task' },
        ],
      },
      date: { dateTasks: [{ date: mockToday, tasks: [1, 2] }] },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
    };

    const { store } = renderWithProviders(<TaskCreationRow />, {
      preloadedState: stateWithExistingTasks,
    });

    const input = screen.getByPlaceholderText('Task name/description');
    const button = screen.getByRole('button', { name: /add task/i });

    await user.type(input, 'New Task');
    await user.click(button);

    const state = store.getState() as RootState;
    expect(state.task.tasks).toHaveLength(3);
    expect(state.task.tasks[2].id).toBe(5);
  });
});

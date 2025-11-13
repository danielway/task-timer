import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TimerButton } from './TimerButton';
import {
  renderWithProviders,
  mockToday,
} from '../../test-utils/test-utils';
import type { RootState } from '../../app/store';

describe('TimerButton', () => {
  const createPreloadedState = (override: Partial<RootState> = {}): Partial<RootState> => ({
    app: {
      version: '1.0',
      selectedDate: mockToday,
    },
    time: {
      dateTimes: [{ date: mockToday, taskTimes: [] }],
      activeTimer: undefined,
    },
    task: {
      nextTaskId: 2,
      tasks: [{ id: 1, description: 'Test Task' }],
    },
    edit: {},
    ...override,
  });

  it('should render "Start Timer" button when no timer is active', () => {
    const { container } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState: createPreloadedState() }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toContain('Start Timer');
  });

  it('should start a timer when "Start Timer" is clicked', async () => {
    const user = userEvent.setup();
    const { container, store } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState: createPreloadedState() }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();

    await user.click(button!);

    const state = store.getState();
    expect(state.time.activeTimer).toBeDefined();
    expect(state.time.activeTimer?.taskId).toBe(1);
    expect(state.time.activeTimer?.date).toBe(mockToday);
  });

  it('should show elapsed time display when timer is active', () => {
    const startTimestamp = Date.now();
    const preloadedState = createPreloadedState({
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start: startTimestamp }],
          },
        ],
        activeTimer: {
          taskId: 1,
          startTime: startTimestamp,
          date: mockToday,
        },
      },
    });

    const { container } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    // Should show time in format HH:MM:SS
    expect(button?.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('should stop the timer when clicked while active', async () => {
    const user = userEvent.setup();
    const startTimestamp = Date.now() - 5000;
    const preloadedState = createPreloadedState({
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start: startTimestamp }],
          },
        ],
        activeTimer: {
          taskId: 1,
          startTime: startTimestamp,
          date: mockToday,
        },
      },
    });

    const { container, store } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();

    await user.click(button!);

    const state = store.getState();
    expect(state.time.activeTimer).toBeUndefined();
    expect(state.time.dateTimes[0].taskTimes[0].end).toBeDefined();
  });

  it('should disable the button when another task has an active timer', () => {
    const startTimestamp = Date.now();
    const preloadedState = createPreloadedState({
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 2, start: startTimestamp }],
          },
        ],
        activeTimer: {
          taskId: 2,
          startTime: startTimestamp,
          date: mockToday,
        },
      },
      task: {
        nextTaskId: 3,
        tasks: [
          { id: 1, description: 'Test Task 1' },
          { id: 2, description: 'Test Task 2' },
        ],
      },
    });

    const { container } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState }
    );

    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.disabled).toBe(true);
  });

  it('should show contained error style when timer is active for this task', () => {
    const startTimestamp = Date.now();
    const preloadedState = createPreloadedState({
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start: startTimestamp }],
          },
        ],
        activeTimer: {
          taskId: 1,
          startTime: startTimestamp,
          date: mockToday,
        },
      },
    });

    const { container } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.classList.contains('MuiButton-contained')).toBe(true);
    expect(button?.classList.contains('MuiButton-containedError')).toBe(true);
  });

  it('should show outlined primary style when no timer is active', () => {
    const { container } = renderWithProviders(
      <TimerButton taskId={1} date={mockToday} />,
      { preloadedState: createPreloadedState() }
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.classList.contains('MuiButton-outlined')).toBe(true);
    expect(button?.classList.contains('MuiButton-outlinedPrimary')).toBe(true);
  });
});

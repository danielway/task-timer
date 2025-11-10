import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { TimeIncrement } from './TimeIncrement';
import type { RootState } from '../../app/store';

describe('TimeIncrement', () => {
  it('should render with unlogged class when segment is not logged', () => {
    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {},
    };

    const { container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment');
    expect(increment).toBeTruthy();
    expect(increment?.classList.contains('logged')).toBe(false);
  });

  it('should render with logged class when segment is logged', () => {
    const dateObj = new Date(mockToday);
    const start = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      7,
      0
    ).getTime();
    const end = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      7,
      15
    ).getTime();

    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      },
      edit: {},
    };

    const { container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment.logged');
    expect(increment).toBeTruthy();
  });

  it('should dispatch toggleSegment when clicked', async () => {
    const user = userEvent.setup();

    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {},
      date: { dateTasks: [{ date: mockToday, tasks: [1] }] },
      task: { nextTaskId: 2, tasks: [{ id: 1, description: 'Task 1' }] },
    };

    const { store, container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment');
    expect(increment).toBeTruthy();

    await user.click(increment!);

    const state = store.getState() as RootState;
    expect(state.time.dateTimes[0].taskTimes).toHaveLength(1);
    expect(state.time.dateTimes[0].taskTimes[0].task).toBe(1);
  });

  it('should toggle from logged to unlogged when clicked', async () => {
    const user = userEvent.setup();

    const dateObj = new Date(mockToday);
    const start = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      7,
      0
    ).getTime();
    const end = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      7,
      15
    ).getTime();

    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: {
        dateTimes: [
          {
            date: mockToday,
            taskTimes: [{ task: 1, start, end }],
          },
        ],
      },
      edit: {},
      date: { dateTasks: [{ date: mockToday, tasks: [1] }] },
      task: { nextTaskId: 2, tasks: [{ id: 1, description: 'Task 1' }] },
    };

    const { store, container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment');
    await user.click(increment!);

    const state = store.getState() as RootState;
    expect(state.time.dateTimes[0].taskTimes).toHaveLength(0);
  });

  it('should show selected border when segment is keyboard selected', () => {
    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {
        selection: {
          taskId: 1,
          description: false,
          timeSegment: 0,
        },
      },
    };

    const { container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment') as HTMLDivElement;
    expect(increment).toBeTruthy();
    expect(increment.style.border).toBe('2px dashed rgb(23, 48, 64)');
  });

  it('should not show selected border when different segment is selected', () => {
    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {
        selection: {
          taskId: 1,
          description: false,
          timeSegment: 5,
        },
      },
    };

    const { container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment') as HTMLDivElement;
    expect(increment).toBeTruthy();
    expect(increment.style.border).toBe('');
  });

  it('should not show selected border when different task is selected', () => {
    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {
        selection: {
          taskId: 2,
          description: false,
          timeSegment: 0,
        },
      },
    };

    const { container } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    const increment = container.querySelector('.increment') as HTMLDivElement;
    expect(increment).toBeTruthy();
    expect(increment.style.border).toBe('');
  });

  it('should handle multiple segments for same task', async () => {
    const user = userEvent.setup();

    const preloadedState: Partial<RootState> = {
      app: { version: '1.0', selectedDate: mockToday },
      time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
      edit: {},
      date: { dateTasks: [{ date: mockToday, tasks: [1] }] },
      task: { nextTaskId: 2, tasks: [{ id: 1, description: 'Task 1' }] },
    };

    const { store, container, rerender } = renderWithProviders(
      <TimeIncrement taskId={1} segment={0} />,
      { preloadedState }
    );

    // Click first segment
    const increment1 = container.querySelector('.increment');
    await user.click(increment1!);

    let state = store.getState() as RootState;
    expect(state.time.dateTimes[0].taskTimes).toHaveLength(1);

    // Render and click second segment
    rerender(<TimeIncrement taskId={1} segment={1} />);
    const increment2 = container.querySelector('.increment');
    await user.click(increment2!);

    state = store.getState() as RootState;
    expect(state.time.dateTimes[0].taskTimes).toHaveLength(2);
  });
});

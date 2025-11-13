import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { TableBody } from './TableBody';
import type { RootState } from '../../app/store';
import { createTask } from '../../app/slices/taskSlice';
import { addTaskToDate } from '../../app/slices/dateSlice';

describe('TableBody', () => {
  const createDefaultState = (): Partial<RootState> => ({
    app: { version: '1.0', selectedDate: mockToday },
    task: {
      nextTaskId: 3,
      tasks: [
        { id: 1, description: 'Task 1', type: 'task' },
        { id: 2, description: 'Task 2', type: 'meeting' },
      ],
    },
    date: { dateTasks: [{ date: mockToday, tasks: [1, 2] }] },
    time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
    edit: {},
  });

  describe('rendering tasks', () => {
    it('should render all tasks for the selected date', () => {
      renderWithProviders(<TableBody />, {
        preloadedState: createDefaultState(),
      });

      expect(screen.getByText('Task 1')).toBeTruthy();
      expect(screen.getByText('Task 2')).toBeTruthy();
    });

    it('should render task creation row', () => {
      const { container } = renderWithProviders(<TableBody />, {
        preloadedState: createDefaultState(),
      });

      // TaskCreationRow has a distinct input for new tasks
      const inputs = container.querySelectorAll('input');
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should render empty table body with only creation row when no tasks', () => {
      const stateWithNoTasks: Partial<RootState> = {
        app: { version: '1.0', selectedDate: mockToday },
        task: {
          nextTaskId: 1,
          tasks: [],
        },
        date: { dateTasks: [{ date: mockToday, tasks: [] }] },
        time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
        edit: {},
      };

      renderWithProviders(<TableBody />, {
        preloadedState: stateWithNoTasks,
      });

      // Should still render the task creation row
      const { container } = renderWithProviders(<TableBody />, {
        preloadedState: stateWithNoTasks,
      });
      expect(container.querySelector('tbody')).toBeTruthy();
    });

    it('should display a task after it is added via Redux actions', () => {
      // REAL-WORLD SCENARIO TEST:
      // This simulates the exact user workflow - starting with no tasks,
      // then adding a task through Redux actions (like the UI does),
      // and verifying the task appears in the rendered table.

      // Start with empty state
      const initialState: Partial<RootState> = {
        app: { version: '1.0', selectedDate: mockToday },
        task: {
          nextTaskId: 1,
          tasks: [],
        },
        date: { dateTasks: [{ date: mockToday, tasks: [] }] },
        time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
        edit: {},
      };

      const { store, rerender } = renderWithProviders(<TableBody />, {
        preloadedState: initialState,
      });

      // Verify no tasks are displayed initially
      expect(screen.queryByText('New Task')).toBeFalsy();

      // Add a task using Redux actions (simulating what TaskCreationRow does)
      store.dispatch(
        createTask({ id: 1, description: 'New Task', type: 'task' })
      );
      store.dispatch(addTaskToDate({ date: mockToday, taskId: 1 }));

      // Re-render to reflect the state change
      rerender(<TableBody />);

      // Verify the task now appears in the table
      expect(screen.getByText('New Task')).toBeTruthy();
    });

    it('should display multiple tasks added sequentially', () => {
      // Test adding multiple tasks one by one (real user scenario)
      const initialState: Partial<RootState> = {
        app: { version: '1.0', selectedDate: mockToday },
        task: {
          nextTaskId: 1,
          tasks: [],
        },
        date: { dateTasks: [{ date: mockToday, tasks: [] }] },
        time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
        edit: {},
      };

      const { store, rerender } = renderWithProviders(<TableBody />, {
        preloadedState: initialState,
      });

      // Add first task
      store.dispatch(
        createTask({ id: 1, description: 'First Task', type: 'task' })
      );
      store.dispatch(addTaskToDate({ date: mockToday, taskId: 1 }));
      rerender(<TableBody />);
      expect(screen.getByText('First Task')).toBeTruthy();

      // Add second task
      store.dispatch(
        createTask({ id: 2, description: 'Second Task', type: 'meeting' })
      );
      store.dispatch(addTaskToDate({ date: mockToday, taskId: 2 }));
      rerender(<TableBody />);

      // Both tasks should be visible
      expect(screen.getByText('First Task')).toBeTruthy();
      expect(screen.getByText('Second Task')).toBeTruthy();
    });
  });

  describe('graceful handling of missing task data', () => {
    it('should gracefully handle when task IDs exist in date slice but tasks are missing from task slice', () => {
      // BUG FIX VERIFICATION:
      // Previously, if localStorage had task IDs in the date slice but tasks were
      // missing from the task slice, the app would crash with:
      // "Cannot read properties of undefined (reading 'type')"
      //
      // Fix: getTask() now properly returns undefined, and TaskRow checks for
      // undefined tasks and renders nothing instead of crashing.
      const stateWithMismatch: Partial<RootState> = {
        app: { version: '1.0', selectedDate: mockToday },
        task: {
          nextTaskId: 3,
          tasks: [], // Tasks array is empty!
        },
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1, 2] }, // But task IDs still exist here
          ],
        },
        time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
        edit: {},
      };

      // Should render without throwing an error
      const { container } = renderWithProviders(<TableBody />, {
        preloadedState: stateWithMismatch,
      });

      // Verify it rendered successfully (tbody exists)
      expect(container.querySelector('tbody')).toBeTruthy();

      // Missing tasks should not appear in the table
      expect(screen.queryByText('Task 1')).toBeFalsy();
      expect(screen.queryByText('Task 2')).toBeFalsy();
    });

    it('should render existing tasks and skip missing ones (partial mismatch)', () => {
      // Partial mismatch: task ID 1 exists, but task ID 2 is missing
      // This simulates what happens if the task slice and date slice get out of sync
      const stateWithPartialMismatch: Partial<RootState> = {
        app: { version: '1.0', selectedDate: mockToday },
        task: {
          nextTaskId: 3,
          tasks: [{ id: 1, description: 'Task 1', type: 'task' }], // Only task 1 exists
        },
        date: {
          dateTasks: [
            { date: mockToday, tasks: [1, 2] }, // But both 1 and 2 are referenced
          ],
        },
        time: { dateTimes: [{ date: mockToday, taskTimes: [] }] },
        edit: {},
      };

      renderWithProviders(<TableBody />, {
        preloadedState: stateWithPartialMismatch,
      });

      // Task 1 should render (it exists)
      expect(screen.getByText('Task 1')).toBeTruthy();

      // Task 2 should NOT render (it's missing)
      expect(screen.queryByText('Task 2')).toBeFalsy();
    });
  });
});

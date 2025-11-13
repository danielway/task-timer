import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockToday } from '../../test-utils/test-utils';
import { TableBody } from './TableBody';
import type { RootState } from '../../app/store';

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
  });

  describe('bug reproduction: missing task data', () => {
    it('reproduces bug where task IDs exist in date slice but tasks are missing from task slice', () => {
      // BUG REPRODUCTION:
      // After merging task types feature, tasks stopped showing in the table.
      // The issue: localStorage has task IDs in the date slice (state.date.dateTasks)
      // but the actual task objects are missing from the task slice (state.task.tasks).
      //
      // Root cause: getTask() in taskSlice.ts uses non-null assertion (!)
      // which returns undefined instead of throwing, then TaskRow tries to
      // access properties on undefined (e.g., task.type, task.description).
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

      // Expected behavior: Should throw an error when trying to render
      let didThrow = false;
      let errorMessage = '';

      try {
        renderWithProviders(<TableBody />, {
          preloadedState: stateWithMismatch,
        });
      } catch (error) {
        didThrow = true;
        errorMessage = error instanceof Error ? error.message : String(error);
      }

      // Verify the bug is reproduced
      expect(didThrow).toBe(true);
      expect(errorMessage).toContain("Cannot read properties of undefined");
      expect(errorMessage).toContain("'type'");
    });

    it('reproduces bug with partial data mismatch (some tasks missing)', () => {
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

      let didThrow = false;
      let errorMessage = '';

      try {
        renderWithProviders(<TableBody />, {
          preloadedState: stateWithPartialMismatch,
        });
      } catch (error) {
        didThrow = true;
        errorMessage = error instanceof Error ? error.message : String(error);
      }

      // Should throw when trying to render the missing task (ID 2)
      expect(didThrow).toBe(true);
      expect(errorMessage).toContain("Cannot read properties of undefined");
    });
  });
});

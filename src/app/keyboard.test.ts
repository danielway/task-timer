import { describe, it, expect, vi } from 'vitest';
import { handleKeyboardInput } from './keyboard';
import type { KeyboardSelection } from './slices/editSlice';
import { mockToday } from '../test-utils/test-utils';
import { HOUR_COUNT } from './constants';

describe('keyboard navigation', () => {
  const createEvent = (key: string): KeyboardEvent =>
    new KeyboardEvent('keydown', { key });

  const tasksForDate = [1, 2, 3];

  describe('with no selection', () => {
    it('should select first task first segment on ArrowDown', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 0,
      });
    });

    it('should select first task first segment on ArrowUp', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('ArrowUp'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 0,
      });
    });

    it('should select first task first segment on ArrowLeft', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('ArrowLeft'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 0,
      });
    });

    it('should select first task first segment on ArrowRight', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('ArrowRight'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 0,
      });
    });

    it('should not do anything on non-arrow keys', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('a'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).not.toHaveBeenCalled();
      expect(selectTaskDescription).not.toHaveBeenCalled();
    });
  });

  describe('Escape key', () => {
    it('should clear selection regardless of current state', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: true,
      };

      handleKeyboardInput(
        createEvent('Escape'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(clearSelection).toHaveBeenCalled();
    });

    it('should clear selection even when no selection exists', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('Escape'),
        mockToday,
        undefined,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(clearSelection).toHaveBeenCalled();
    });
  });

  describe('ArrowUp navigation', () => {
    it('should move to previous task from description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 2,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowUp'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).toHaveBeenCalledWith({ taskId: 1 });
    });

    it('should move to previous task from time segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 2,
        description: false,
        timeSegment: 5,
      };

      handleKeyboardInput(
        createEvent('ArrowUp'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 5,
      });
    });

    it('should not move up from first task', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowUp'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).not.toHaveBeenCalled();
      expect(selectTaskTimeSegment).not.toHaveBeenCalled();
    });
  });

  describe('ArrowDown navigation', () => {
    it('should move to next task from description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 2,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).toHaveBeenCalledWith({ taskId: 3 });
    });

    it('should move to next task from time segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 10,
      };

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 2,
        timeSegment: 10,
      });
    });

    it('should not move down from last task', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 3,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).not.toHaveBeenCalled();
      expect(selectTaskTimeSegment).not.toHaveBeenCalled();
    });
  });

  describe('ArrowLeft navigation', () => {
    it('should move to description from segment 0', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 0,
      };

      handleKeyboardInput(
        createEvent('ArrowLeft'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).toHaveBeenCalledWith({ taskId: 1 });
    });

    it('should move to previous segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 5,
      };

      handleKeyboardInput(
        createEvent('ArrowLeft'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 4,
      });
    });

    it('should not move left from description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowLeft'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).not.toHaveBeenCalled();
      expect(selectTaskTimeSegment).not.toHaveBeenCalled();
    });
  });

  describe('ArrowRight navigation', () => {
    it('should move to segment 0 from description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowRight'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 0,
      });
    });

    it('should move to next segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 5,
      };

      handleKeyboardInput(
        createEvent('ArrowRight'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: 6,
      });
    });

    it('should not move right from last segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const maxSegment = HOUR_COUNT * 4; // 11 hours * 4 segments = 44

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: maxSegment,
      };

      handleKeyboardInput(
        createEvent('ArrowRight'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).not.toHaveBeenCalled();
    });

    it('should allow moving to exactly max segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const maxSegment = HOUR_COUNT * 4;

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: maxSegment - 1,
      };

      handleKeyboardInput(
        createEvent('ArrowRight'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: 1,
        timeSegment: maxSegment,
      });
    });
  });

  describe('Space key', () => {
    it('should begin task edit when on description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: true,
      };

      handleKeyboardInput(
        createEvent(' '),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(beginTaskEdit).toHaveBeenCalledWith({ taskId: 1 });
      expect(clearSelection).toHaveBeenCalled();
    });

    it('should toggle segment when on time segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 5,
      };

      handleKeyboardInput(
        createEvent(' '),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(toggleSegment).toHaveBeenCalledWith({
        date: mockToday,
        taskId: 1,
        segment: 5,
      });
      expect(clearSelection).not.toHaveBeenCalled();
    });
  });

  describe('Enter key', () => {
    it('should begin task edit when on description', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 2,
        description: true,
      };

      handleKeyboardInput(
        createEvent('Enter'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(beginTaskEdit).toHaveBeenCalledWith({ taskId: 2 });
      expect(clearSelection).toHaveBeenCalled();
    });

    it('should toggle segment when on time segment', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 2,
        description: false,
        timeSegment: 10,
      };

      handleKeyboardInput(
        createEvent('Enter'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(toggleSegment).toHaveBeenCalledWith({
        date: mockToday,
        taskId: 2,
        segment: 10,
      });
      expect(clearSelection).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty tasks array', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        undefined,
        [],
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      // Should still try to select first task (which is undefined)
      expect(selectTaskTimeSegment).toHaveBeenCalledWith({
        taskId: undefined,
        timeSegment: 0,
      });
    });

    it('should handle single task', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const singleTask = [42];

      const selection: KeyboardSelection = {
        taskId: 42,
        description: true,
      };

      // Try to move up (should do nothing)
      handleKeyboardInput(
        createEvent('ArrowUp'),
        mockToday,
        selection,
        singleTask,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).not.toHaveBeenCalled();

      // Try to move down (should do nothing)
      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        selection,
        singleTask,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(selectTaskDescription).not.toHaveBeenCalled();
    });

    it('should handle task not in tasksForDate', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 999, // Not in tasksForDate
        description: true,
      };

      handleKeyboardInput(
        createEvent('ArrowDown'),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      // When task is not found (taskIndex = -1), ArrowDown will select first task as recovery
      expect(selectTaskDescription).toHaveBeenCalledWith({ taskId: 1 });
    });

    it('should handle segment 0 correctly', () => {
      const selectTaskDescription = vi.fn();
      const selectTaskTimeSegment = vi.fn();
      const clearSelection = vi.fn();
      const beginTaskEdit = vi.fn();
      const toggleSegment = vi.fn();

      const selection: KeyboardSelection = {
        taskId: 1,
        description: false,
        timeSegment: 0,
      };

      handleKeyboardInput(
        createEvent(' '),
        mockToday,
        selection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );

      expect(toggleSegment).toHaveBeenCalledWith({
        date: mockToday,
        taskId: 1,
        segment: 0,
      });
    });
  });
});

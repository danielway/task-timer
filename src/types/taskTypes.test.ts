import { describe, it, expect } from 'vitest';
import { DEFAULT_TASK_TYPES, getTaskType, type TaskType } from './taskTypes';

describe('taskTypes', () => {
  describe('DEFAULT_TASK_TYPES', () => {
    it('should have three default task types', () => {
      expect(DEFAULT_TASK_TYPES).toHaveLength(3);
    });

    it('should include task type', () => {
      const taskType = DEFAULT_TASK_TYPES.find((t) => t.id === 'task');
      expect(taskType).toBeDefined();
      expect(taskType?.name).toBe('Task');
      expect(taskType?.color).toBe('#1976d2');
      expect(taskType?.backgroundColor).toBe('#e3f2fd');
    });

    it('should include meeting type', () => {
      const meetingType = DEFAULT_TASK_TYPES.find((t) => t.id === 'meeting');
      expect(meetingType).toBeDefined();
      expect(meetingType?.name).toBe('Meeting');
      expect(meetingType?.color).toBe('#ed6c02');
      expect(meetingType?.backgroundColor).toBe('#fff4e5');
    });

    it('should include review type', () => {
      const reviewType = DEFAULT_TASK_TYPES.find((t) => t.id === 'review');
      expect(reviewType).toBeDefined();
      expect(reviewType?.name).toBe('Review');
      expect(reviewType?.color).toBe('#9c27b0');
      expect(reviewType?.backgroundColor).toBe('#f3e5f5');
    });

    it('should have unique IDs', () => {
      const ids = DEFAULT_TASK_TYPES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required fields', () => {
      DEFAULT_TASK_TYPES.forEach((type) => {
        expect(type).toHaveProperty('id');
        expect(type).toHaveProperty('name');
        expect(type).toHaveProperty('color');
        expect(type).toHaveProperty('backgroundColor');
        expect(typeof type.id).toBe('string');
        expect(typeof type.name).toBe('string');
        expect(typeof type.color).toBe('string');
        expect(typeof type.backgroundColor).toBe('string');
      });
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#[0-9a-f]{6}$/i;
      DEFAULT_TASK_TYPES.forEach((type) => {
        expect(type.color).toMatch(hexColorRegex);
        expect(type.backgroundColor).toMatch(hexColorRegex);
      });
    });
  });

  describe('getTaskType', () => {
    it('should return task type by id', () => {
      const taskType = getTaskType('task');
      expect(taskType.id).toBe('task');
      expect(taskType.name).toBe('Task');
    });

    it('should return meeting type by id', () => {
      const meetingType = getTaskType('meeting');
      expect(meetingType.id).toBe('meeting');
      expect(meetingType.name).toBe('Meeting');
    });

    it('should return review type by id', () => {
      const reviewType = getTaskType('review');
      expect(reviewType.id).toBe('review');
      expect(reviewType.name).toBe('Review');
    });

    it('should return default task type for non-existent id', () => {
      const defaultType = getTaskType('non-existent');
      expect(defaultType.id).toBe('task');
      expect(defaultType.name).toBe('Task');
    });

    it('should return default task type for empty string', () => {
      const defaultType = getTaskType('');
      expect(defaultType.id).toBe('task');
      expect(defaultType.name).toBe('Task');
    });

    it('should return the complete TaskType object', () => {
      const taskType = getTaskType('meeting');
      expect(taskType).toHaveProperty('id');
      expect(taskType).toHaveProperty('name');
      expect(taskType).toHaveProperty('color');
      expect(taskType).toHaveProperty('backgroundColor');
    });

    it('should be case-sensitive', () => {
      const defaultType = getTaskType('TASK');
      expect(defaultType.id).toBe('task');
    });
  });

  describe('TaskType interface', () => {
    it('should allow creating valid TaskType objects', () => {
      const customType: TaskType = {
        id: 'custom',
        name: 'Custom',
        color: '#000000',
        backgroundColor: '#ffffff',
      };

      expect(customType.id).toBe('custom');
      expect(customType.name).toBe('Custom');
      expect(customType.color).toBe('#000000');
      expect(customType.backgroundColor).toBe('#ffffff');
    });
  });

  describe('visual distinction', () => {
    it('should have distinct colors for each type', () => {
      const colors = DEFAULT_TASK_TYPES.map((t) => t.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('should have distinct background colors for each type', () => {
      const backgroundColors = DEFAULT_TASK_TYPES.map((t) => t.backgroundColor);
      const uniqueBackgroundColors = new Set(backgroundColors);
      expect(uniqueBackgroundColors.size).toBe(backgroundColors.length);
    });

    it('should have lighter background colors than primary colors', () => {
      DEFAULT_TASK_TYPES.forEach((type) => {
        // Extract RGB values from hex
        const getHexValue = (hex: string) => parseInt(hex.replace('#', ''), 16);
        const colorValue = getHexValue(type.color);
        const bgColorValue = getHexValue(type.backgroundColor);

        // Background should generally be lighter (higher hex value in most cases for lighter colors)
        // This is a rough check - could be more sophisticated
        expect(bgColorValue).toBeGreaterThan(colorValue);
      });
    });
  });
});

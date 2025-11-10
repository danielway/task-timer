import { describe, it, expect } from 'vitest';
import editReducer, {
  selectTaskDescription,
  selectTaskTimeSegment,
  beginTaskEdit,
  endTaskEdit,
  clearSelection,
  getSelection,
  getActiveEditTaskId,
  type EditState,
} from './editSlice';

describe('editSlice', () => {
  const initialState: EditState = {};

  describe('selectTaskDescription', () => {
    it('should set selection to task description', () => {
      const action = selectTaskDescription({ taskId: 1 });
      const newState = editReducer(initialState, action);

      expect(newState.selection).toEqual({
        taskId: 1,
        description: true,
      });
    });

    it('should replace existing selection', () => {
      const stateWithSelection: EditState = {
        selection: {
          taskId: 1,
          description: false,
          timeSegment: 5,
        },
      };

      const action = selectTaskDescription({ taskId: 2 });
      const newState = editReducer(stateWithSelection, action);

      expect(newState.selection).toEqual({
        taskId: 2,
        description: true,
      });
    });

    it('should not include timeSegment in selection', () => {
      const action = selectTaskDescription({ taskId: 1 });
      const newState = editReducer(initialState, action);

      expect(newState.selection?.timeSegment).toBeUndefined();
    });
  });

  describe('selectTaskTimeSegment', () => {
    it('should set selection to time segment', () => {
      const action = selectTaskTimeSegment({ taskId: 1, timeSegment: 10 });
      const newState = editReducer(initialState, action);

      expect(newState.selection).toEqual({
        taskId: 1,
        description: false,
        timeSegment: 10,
      });
    });

    it('should replace existing selection', () => {
      const stateWithSelection: EditState = {
        selection: {
          taskId: 1,
          description: true,
        },
      };

      const action = selectTaskTimeSegment({ taskId: 2, timeSegment: 5 });
      const newState = editReducer(stateWithSelection, action);

      expect(newState.selection).toEqual({
        taskId: 2,
        description: false,
        timeSegment: 5,
      });
    });

    it('should handle segment 0', () => {
      const action = selectTaskTimeSegment({ taskId: 1, timeSegment: 0 });
      const newState = editReducer(initialState, action);

      expect(newState.selection?.timeSegment).toBe(0);
    });

    it('should handle large segment numbers', () => {
      const action = selectTaskTimeSegment({ taskId: 1, timeSegment: 43 });
      const newState = editReducer(initialState, action);

      expect(newState.selection?.timeSegment).toBe(43);
    });
  });

  describe('beginTaskEdit', () => {
    it('should set activeEditTaskId', () => {
      const action = beginTaskEdit({ taskId: 1 });
      const newState = editReducer(initialState, action);

      expect(newState.activeEditTaskId).toBe(1);
    });

    it('should replace existing activeEditTaskId', () => {
      const stateWithEdit: EditState = {
        activeEditTaskId: 1,
      };

      const action = beginTaskEdit({ taskId: 2 });
      const newState = editReducer(stateWithEdit, action);

      expect(newState.activeEditTaskId).toBe(2);
    });

    it('should not affect selection', () => {
      const stateWithSelection: EditState = {
        selection: {
          taskId: 1,
          description: true,
        },
      };

      const action = beginTaskEdit({ taskId: 1 });
      const newState = editReducer(stateWithSelection, action);

      expect(newState.selection).toEqual({
        taskId: 1,
        description: true,
      });
      expect(newState.activeEditTaskId).toBe(1);
    });
  });

  describe('endTaskEdit', () => {
    it('should clear activeEditTaskId', () => {
      const stateWithEdit: EditState = {
        activeEditTaskId: 1,
      };

      const action = endTaskEdit();
      const newState = editReducer(stateWithEdit, action);

      expect(newState.activeEditTaskId).toBeUndefined();
    });

    it('should not affect selection', () => {
      const stateWithEditAndSelection: EditState = {
        selection: {
          taskId: 1,
          description: true,
        },
        activeEditTaskId: 1,
      };

      const action = endTaskEdit();
      const newState = editReducer(stateWithEditAndSelection, action);

      expect(newState.selection).toEqual({
        taskId: 1,
        description: true,
      });
      expect(newState.activeEditTaskId).toBeUndefined();
    });

    it('should work when no activeEditTaskId is set', () => {
      const action = endTaskEdit();
      const newState = editReducer(initialState, action);

      expect(newState.activeEditTaskId).toBeUndefined();
    });
  });

  describe('clearSelection', () => {
    it('should clear selection', () => {
      const stateWithSelection: EditState = {
        selection: {
          taskId: 1,
          description: true,
        },
      };

      const action = clearSelection();
      const newState = editReducer(stateWithSelection, action);

      expect(newState.selection).toBeUndefined();
    });

    it('should not affect activeEditTaskId', () => {
      const stateWithEditAndSelection: EditState = {
        selection: {
          taskId: 1,
          description: true,
        },
        activeEditTaskId: 1,
      };

      const action = clearSelection();
      const newState = editReducer(stateWithEditAndSelection, action);

      expect(newState.selection).toBeUndefined();
      expect(newState.activeEditTaskId).toBe(1);
    });

    it('should work when no selection is set', () => {
      const action = clearSelection();
      const newState = editReducer(initialState, action);

      expect(newState.selection).toBeUndefined();
    });
  });

  describe('getSelection', () => {
    it('should return selection', () => {
      const mockState = {
        edit: {
          selection: {
            taskId: 1,
            description: true,
          },
        },
      };

      const selection = getSelection(mockState);

      expect(selection).toEqual({
        taskId: 1,
        description: true,
      });
    });

    it('should return undefined when no selection', () => {
      const mockState = {
        edit: {},
      };

      const selection = getSelection(mockState);

      expect(selection).toBeUndefined();
    });
  });

  describe('getActiveEditTaskId', () => {
    it('should return activeEditTaskId', () => {
      const mockState = {
        edit: {
          activeEditTaskId: 5,
        },
      };

      const taskId = getActiveEditTaskId(mockState);

      expect(taskId).toBe(5);
    });

    it('should return undefined when no activeEditTaskId', () => {
      const mockState = {
        edit: {},
      };

      const taskId = getActiveEditTaskId(mockState);

      expect(taskId).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    it('should handle complete selection workflow', () => {
      let state = initialState;

      // Select description
      state = editReducer(state, selectTaskDescription({ taskId: 1 }));
      expect(state.selection?.description).toBe(true);

      // Switch to time segment
      state = editReducer(
        state,
        selectTaskTimeSegment({ taskId: 1, timeSegment: 5 })
      );
      expect(state.selection?.description).toBe(false);
      expect(state.selection?.timeSegment).toBe(5);

      // Move to different segment
      state = editReducer(
        state,
        selectTaskTimeSegment({ taskId: 1, timeSegment: 10 })
      );
      expect(state.selection?.timeSegment).toBe(10);

      // Clear selection
      state = editReducer(state, clearSelection());
      expect(state.selection).toBeUndefined();
    });

    it('should handle edit workflow', () => {
      let state = initialState;

      // Begin edit
      state = editReducer(state, beginTaskEdit({ taskId: 1 }));
      expect(state.activeEditTaskId).toBe(1);

      // End edit
      state = editReducer(state, endTaskEdit());
      expect(state.activeEditTaskId).toBeUndefined();
    });

    it('should allow selection and editing simultaneously', () => {
      let state = initialState;

      // Select task description
      state = editReducer(state, selectTaskDescription({ taskId: 1 }));

      // Begin edit on different task
      state = editReducer(state, beginTaskEdit({ taskId: 2 }));

      expect(state.selection?.taskId).toBe(1);
      expect(state.activeEditTaskId).toBe(2);

      // Clear selection but keep edit active
      state = editReducer(state, clearSelection());

      expect(state.selection).toBeUndefined();
      expect(state.activeEditTaskId).toBe(2);
    });

    it('should handle rapid selection changes', () => {
      let state = initialState;

      state = editReducer(state, selectTaskDescription({ taskId: 1 }));
      state = editReducer(
        state,
        selectTaskTimeSegment({ taskId: 2, timeSegment: 5 })
      );
      state = editReducer(state, selectTaskDescription({ taskId: 3 }));
      state = editReducer(
        state,
        selectTaskTimeSegment({ taskId: 4, timeSegment: 10 })
      );

      expect(state.selection).toEqual({
        taskId: 4,
        description: false,
        timeSegment: 10,
      });
    });
  });
});

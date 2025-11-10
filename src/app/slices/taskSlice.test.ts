import { describe, it, expect } from 'vitest';
import taskReducer, {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getNextTaskId,
  type TaskState,
} from './taskSlice';

describe('taskSlice', () => {
  const initialState: TaskState = {
    nextTaskId: 1,
    tasks: [],
  };

  describe('createTask', () => {
    it('should add a new task to the tasks array', () => {
      const action = createTask({ id: 1, description: 'New Task' });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0]).toEqual({
        id: 1,
        description: 'New Task',
        type: 'task',
      });
    });

    it('should increment nextTaskId after creating a task', () => {
      const action = createTask({ id: 1, description: 'New Task' });
      const newState = taskReducer(initialState, action);

      expect(newState.nextTaskId).toBe(2);
    });

    it('should create multiple tasks correctly', () => {
      let state = initialState;

      state = taskReducer(state, createTask({ id: 1, description: 'Task 1' }));
      state = taskReducer(state, createTask({ id: 2, description: 'Task 2' }));
      state = taskReducer(state, createTask({ id: 3, description: 'Task 3' }));

      expect(state.tasks).toHaveLength(3);
      expect(state.nextTaskId).toBe(4);
      expect(state.tasks[0].description).toBe('Task 1');
      expect(state.tasks[1].description).toBe('Task 2');
      expect(state.tasks[2].description).toBe('Task 3');
    });

    it('should handle empty description', () => {
      const action = createTask({ id: 1, description: '' });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0].description).toBe('');
    });

    it('should handle long description', () => {
      const longDescription = 'A'.repeat(1000);
      const action = createTask({ id: 1, description: longDescription });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks[0].description).toBe(longDescription);
      expect(newState.tasks[0].description).toHaveLength(1000);
    });

    it('should create task with default type when type not provided', () => {
      const action = createTask({ id: 1, description: 'New Task' });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks[0].type).toBe('task');
    });

    it('should create task with specified type', () => {
      const action = createTask({
        id: 1,
        description: 'New Meeting',
        type: 'meeting',
      });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks[0].type).toBe('meeting');
    });

    it('should create task with review type', () => {
      const action = createTask({
        id: 1,
        description: 'Code Review',
        type: 'review',
      });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks[0]).toEqual({
        id: 1,
        description: 'Code Review',
        type: 'review',
      });
    });

    it('should create multiple tasks with different types', () => {
      let state = initialState;

      state = taskReducer(
        state,
        createTask({ id: 1, description: 'Task 1', type: 'task' })
      );
      state = taskReducer(
        state,
        createTask({ id: 2, description: 'Meeting 1', type: 'meeting' })
      );
      state = taskReducer(
        state,
        createTask({ id: 3, description: 'Review 1', type: 'review' })
      );

      expect(state.tasks).toHaveLength(3);
      expect(state.tasks[0].type).toBe('task');
      expect(state.tasks[1].type).toBe('meeting');
      expect(state.tasks[2].type).toBe('review');
    });
  });

  describe('updateTask', () => {
    it('should update task description by id', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description', type: 'task' }],
      };

      const action = updateTask({ id: 1, description: 'Updated Description' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].description).toBe('Updated Description');
    });

    it('should not modify other tasks when updating', () => {
      const stateWithMultipleTasks: TaskState = {
        nextTaskId: 3,
        tasks: [
          { id: 1, description: 'Task 1', type: 'task' },
          { id: 2, description: 'Task 2', type: 'task' },
        ],
      };

      const action = updateTask({ id: 1, description: 'Updated Task 1' });
      const newState = taskReducer(stateWithMultipleTasks, action);

      expect(newState.tasks[0].description).toBe('Updated Task 1');
      expect(newState.tasks[1].description).toBe('Task 2');
    });

    it('should not modify state if task does not exist', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task 1', type: 'task' }],
      };

      const action = updateTask({ id: 999, description: 'Non-existent Task' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0].description).toBe('Task 1');
    });

    it('should handle updating to empty description', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description', type: 'task' }],
      };

      const action = updateTask({ id: 1, description: '' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].description).toBe('');
    });

    it('should preserve task id when updating', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description', type: 'task' }],
      };

      const action = updateTask({ id: 1, description: 'Updated Description' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].id).toBe(1);
    });

    it('should update task type', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Test Task', type: 'task' }],
      };

      const action = updateTask({
        id: 1,
        description: 'Test Task',
        type: 'meeting',
      });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].type).toBe('meeting');
    });

    it('should update both description and type', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original', type: 'task' }],
      };

      const action = updateTask({
        id: 1,
        description: 'Updated Meeting',
        type: 'meeting',
      });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].description).toBe('Updated Meeting');
      expect(newState.tasks[0].type).toBe('meeting');
    });

    it('should not update type if not provided', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Test Task', type: 'meeting' }],
      };

      const action = updateTask({
        id: 1,
        description: 'Updated Task',
      });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].type).toBe('meeting');
    });

    it('should preserve task type when only updating description', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original', type: 'review' }],
      };

      const action = updateTask({ id: 1, description: 'Updated' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].type).toBe('review');
      expect(newState.tasks[0].description).toBe('Updated');
    });
  });

  describe('deleteTask', () => {
    it('should remove task by id', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task to Delete', type: 'task' }],
      };

      const action = deleteTask({ id: 1 });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(0);
    });

    it('should only remove the specified task', () => {
      const stateWithMultipleTasks: TaskState = {
        nextTaskId: 4,
        tasks: [
          { id: 1, description: 'Task 1', type: 'task' },
          { id: 2, description: 'Task 2', type: 'meeting' },
          { id: 3, description: 'Task 3', type: 'review' },
        ],
      };

      const action = deleteTask({ id: 2 });
      const newState = taskReducer(stateWithMultipleTasks, action);

      expect(newState.tasks).toHaveLength(2);
      expect(newState.tasks[0].id).toBe(1);
      expect(newState.tasks[1].id).toBe(3);
    });

    it('should not modify state if task does not exist', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task 1', type: 'task' }],
      };

      const action = deleteTask({ id: 999 });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0]).toEqual({
        id: 1,
        description: 'Task 1',
        type: 'task',
      });
    });

    it('should not affect nextTaskId', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 5,
        tasks: [{ id: 1, description: 'Task 1', type: 'task' }],
      };

      const action = deleteTask({ id: 1 });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.nextTaskId).toBe(5);
    });

    it('should handle deleting from empty task list', () => {
      const action = deleteTask({ id: 1 });
      const newState = taskReducer(initialState, action);

      expect(newState.tasks).toHaveLength(0);
    });
  });

  describe('getTask', () => {
    it('should return task by id', () => {
      const state: TaskState = {
        nextTaskId: 3,
        tasks: [
          { id: 1, description: 'Task 1', type: 'task' },
          { id: 2, description: 'Task 2', type: 'meeting' },
        ],
      };

      const task = getTask(state, 2);

      expect(task).toEqual({ id: 2, description: 'Task 2', type: 'meeting' });
    });

    it('should return undefined for non-existent id', () => {
      const state: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task 1', type: 'task' }],
      };

      const task = getTask(state, 999);

      expect(task).toBeUndefined();
    });

    it('should work with empty tasks array', () => {
      const task = getTask(initialState, 1);

      expect(task).toBeUndefined();
    });
  });

  describe('getNextTaskId', () => {
    it('should return the next task id', () => {
      const state: TaskState = {
        nextTaskId: 5,
        tasks: [],
      };

      const nextId = getNextTaskId(state);

      expect(nextId).toBe(5);
    });

    it('should return 1 for initial state', () => {
      const nextId = getNextTaskId(initialState);

      expect(nextId).toBe(1);
    });

    it('should reflect incremented value after task creation', () => {
      const state = taskReducer(
        initialState,
        createTask({ id: 1, description: 'Task 1' })
      );

      const nextId = getNextTaskId(state);

      expect(nextId).toBe(2);
    });
  });

  describe('integration tests', () => {
    it('should handle complete CRUD workflow', () => {
      let state = initialState;

      // Create
      state = taskReducer(state, createTask({ id: 1, description: 'Task 1' }));
      expect(state.tasks).toHaveLength(1);

      state = taskReducer(state, createTask({ id: 2, description: 'Task 2' }));
      expect(state.tasks).toHaveLength(2);

      // Update
      state = taskReducer(
        state,
        updateTask({ id: 1, description: 'Updated Task 1' })
      );
      expect(getTask(state, 1)?.description).toBe('Updated Task 1');

      // Delete
      state = taskReducer(state, deleteTask({ id: 1 }));
      expect(state.tasks).toHaveLength(1);
      expect(getTask(state, 1)).toBeUndefined();
      expect(getTask(state, 2)?.description).toBe('Task 2');
    });

    it('should handle complete CRUD workflow with task types', () => {
      let state = initialState;

      // Create tasks with different types
      state = taskReducer(
        state,
        createTask({ id: 1, description: 'Task 1', type: 'task' })
      );
      state = taskReducer(
        state,
        createTask({ id: 2, description: 'Meeting 1', type: 'meeting' })
      );
      state = taskReducer(
        state,
        createTask({ id: 3, description: 'Review 1', type: 'review' })
      );
      expect(state.tasks).toHaveLength(3);

      // Update task type
      state = taskReducer(
        state,
        updateTask({ id: 1, description: 'Task 1', type: 'review' })
      );
      expect(getTask(state, 1)?.type).toBe('review');

      // Verify other tasks are unchanged
      expect(getTask(state, 2)?.type).toBe('meeting');
      expect(getTask(state, 3)?.type).toBe('review');

      // Delete a task
      state = taskReducer(state, deleteTask({ id: 2 }));
      expect(state.tasks).toHaveLength(2);
      expect(getTask(state, 2)).toBeUndefined();
    });

    it('should maintain task order after operations', () => {
      let state = initialState;

      state = taskReducer(state, createTask({ id: 1, description: 'First' }));
      state = taskReducer(state, createTask({ id: 2, description: 'Second' }));
      state = taskReducer(state, createTask({ id: 3, description: 'Third' }));

      state = taskReducer(state, deleteTask({ id: 2 }));

      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].description).toBe('First');
      expect(state.tasks[1].description).toBe('Third');
    });
  });

  describe('task types', () => {
    it('should support all default task types', () => {
      let state = initialState;

      const types = ['task', 'meeting', 'review'];
      types.forEach((type, index) => {
        state = taskReducer(
          state,
          createTask({ id: index + 1, description: `${type} task`, type })
        );
      });

      expect(state.tasks).toHaveLength(3);
      expect(state.tasks[0].type).toBe('task');
      expect(state.tasks[1].type).toBe('meeting');
      expect(state.tasks[2].type).toBe('review');
    });

    it('should allow changing task types', () => {
      let state = taskReducer(
        initialState,
        createTask({ id: 1, description: 'Test', type: 'task' })
      );

      state = taskReducer(
        state,
        updateTask({ id: 1, description: 'Test', type: 'meeting' })
      );
      expect(getTask(state, 1)?.type).toBe('meeting');

      state = taskReducer(
        state,
        updateTask({ id: 1, description: 'Test', type: 'review' })
      );
      expect(getTask(state, 1)?.type).toBe('review');
    });

    it('should allow custom task type values', () => {
      const state = taskReducer(
        initialState,
        createTask({ id: 1, description: 'Custom', type: 'custom-type' })
      );

      expect(getTask(state, 1)?.type).toBe('custom-type');
    });
  });
});

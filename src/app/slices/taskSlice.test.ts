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
  });

  describe('updateTask', () => {
    it('should update task description by id', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description' }],
      };

      const action = updateTask({ id: 1, description: 'Updated Description' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].description).toBe('Updated Description');
    });

    it('should not modify other tasks when updating', () => {
      const stateWithMultipleTasks: TaskState = {
        nextTaskId: 3,
        tasks: [
          { id: 1, description: 'Task 1' },
          { id: 2, description: 'Task 2' },
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
        tasks: [{ id: 1, description: 'Task 1' }],
      };

      const action = updateTask({ id: 999, description: 'Non-existent Task' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0].description).toBe('Task 1');
    });

    it('should handle updating to empty description', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description' }],
      };

      const action = updateTask({ id: 1, description: '' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].description).toBe('');
    });

    it('should preserve task id when updating', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Original Description' }],
      };

      const action = updateTask({ id: 1, description: 'Updated Description' });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks[0].id).toBe(1);
    });
  });

  describe('deleteTask', () => {
    it('should remove task by id', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task to Delete' }],
      };

      const action = deleteTask({ id: 1 });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(0);
    });

    it('should only remove the specified task', () => {
      const stateWithMultipleTasks: TaskState = {
        nextTaskId: 4,
        tasks: [
          { id: 1, description: 'Task 1' },
          { id: 2, description: 'Task 2' },
          { id: 3, description: 'Task 3' },
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
        tasks: [{ id: 1, description: 'Task 1' }],
      };

      const action = deleteTask({ id: 999 });
      const newState = taskReducer(stateWithTask, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0]).toEqual({ id: 1, description: 'Task 1' });
    });

    it('should not affect nextTaskId', () => {
      const stateWithTask: TaskState = {
        nextTaskId: 5,
        tasks: [{ id: 1, description: 'Task 1' }],
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
          { id: 1, description: 'Task 1' },
          { id: 2, description: 'Task 2' },
        ],
      };

      const task = getTask(state, 2);

      expect(task).toEqual({ id: 2, description: 'Task 2' });
    });

    it('should return undefined for non-existent id', () => {
      const state: TaskState = {
        nextTaskId: 2,
        tasks: [{ id: 1, description: 'Task 1' }],
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
});

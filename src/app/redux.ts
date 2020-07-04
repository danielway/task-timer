import { configureStore } from '@reduxjs/toolkit';

// Action IDs

export const CREATE_TASK = 'CREATE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

// Action types

interface CreateTaskAction {
  type: typeof CREATE_TASK;
  id: number;
  name: string;
}

interface UpdateTaskAction {
  type: typeof UPDATE_TASK;
  id: number;
  name: string;
}

interface DeleteTaskAction {
  type: typeof DELETE_TASK;
  id: number;
}

export type TaskActionType =
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction;

// Actions

let largestId = 5;
export function createTask(name: string): TaskActionType {
  return { type: CREATE_TASK, id: ++largestId, name };
}

export function updateTask(id: number, name: string): TaskActionType {
  return { type: UPDATE_TASK, id, name };
}

export function deleteTask(id: number): TaskActionType {
  return { type: DELETE_TASK, id };
}

// State schema

export interface Task {
  id: number;
  name: string;
}

export interface AppState {
  tasks: Task[];
}

// Reducer

const initialState: AppState = {
  tasks: [1, 2, 3, 4, 5].map((i) => ({ id: i, name: `Example task ${i}` })),
};

export function taskReducer(
  state = initialState,
  action: TaskActionType
): AppState {
  switch (action.type) {
    case CREATE_TASK:
      // Clone tasks array, add new task
      const tasks = state.tasks.slice();
      tasks.push({ id: action.id, name: action.name });
      return { tasks };
    case UPDATE_TASK:
      // Clone tasks array, only updating the updated task
      return {
        tasks: state.tasks.map((task: Task) => {
          // Skip unchanged tasks (keep same object/reference)
          if (task.id !== action.id) {
            return task;
          }

          // Overlay the updated name on the existing task
          return {
            ...task,
            name: action.name,
          };
        }),
      };
    case DELETE_TASK:
      return {
        tasks: state.tasks.filter((task: Task) => task.id !== action.id),
      };
    default:
      return state;
  }
}

// Store

const persistedState: AppState = localStorage['state']
  ? JSON.parse(localStorage['state'])
  : undefined;
if (persistedState) {
  largestId = persistedState.tasks[persistedState.tasks.length - 1].id;
}

export const store = configureStore({
  reducer: taskReducer,
  preloadedState: persistedState,
});

store.subscribe(
  () => (localStorage['state'] = JSON.stringify(store.getState()))
);

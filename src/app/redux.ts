import { configureStore } from '@reduxjs/toolkit';

// Action IDs

export const CREATE_TASK = 'CREATE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

// Action types

interface CreateTaskAction {
  type: typeof CREATE_TASK;
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

export function createTask(name: string): TaskActionType {
  return { type: CREATE_TASK, name };
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

export function taskReducer(
  state: AppState = { tasks: [] },
  action: TaskActionType
): AppState {
  // TODO task actions
  return state;
}

// Store

const persistedState = localStorage['state'];

export const store = configureStore({
  reducer: taskReducer,
  preloadedState: persistedState ? JSON.parse(persistedState) : undefined,
});

store.subscribe(
  () => (localStorage['state'] = JSON.stringify(store.getState()))
);

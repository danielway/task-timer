import { configureStore } from '@reduxjs/toolkit';

// Action IDs

export const CREATE_TASK = 'CREATE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

export const LOG_TIME = 'LOG_TIME';
export const REMOVE_TIME = 'REMOVE_TIME';

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

interface LogTimeAction {
  type: typeof LOG_TIME;
  taskId: number;
  timeSegment: number;
}

interface RemoveTimeAction {
  type: typeof REMOVE_TIME;
  taskId: number;
  timeSegment: number;
}

export type TimeActionType = LogTimeAction | RemoveTimeAction;

export type ActionType = TaskActionType | TimeActionType;

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

export function logTime(taskId: number, timeSegment: number): TimeActionType {
  return { type: LOG_TIME, taskId, timeSegment };
}

export function removeTime(
  taskId: number,
  timeSegment: number
): TimeActionType {
  return { type: REMOVE_TIME, taskId, timeSegment };
}

// State schema

export interface Task {
  id: number;
  name: string;
}

export interface Time {
  taskId: number;
  timeSegment: number; // 11 hours * 4 segments, 0 indexed
}

export interface AppState {
  tasks: Task[];
  time: Time[];
}

// Reducer

const initialState: AppState = { tasks: [], time: [] };

export function taskReducer(
  state = initialState,
  action: ActionType
): AppState {
  switch (action.type) {
    case CREATE_TASK:
      // Clone tasks array, add new task
      const tasks = state.tasks.slice();
      tasks.push({ id: action.id, name: action.name });
      return { ...state, tasks };
    case UPDATE_TASK:
      // Clone tasks array, only updating the updated task
      return {
        ...state,
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
        ...state,
        tasks: state.tasks.filter((task: Task) => task.id !== action.id),
      };
    case LOG_TIME:
      // Clone time array, add new entry
      const time = state.time.slice();
      time.push({ taskId: action.taskId, timeSegment: action.timeSegment });
      return { ...state, time };
    case REMOVE_TIME:
      return {
        ...state,
        time: state.time.filter(
          (time: Time) =>
            !(
              time.taskId === action.taskId &&
              time.timeSegment === action.timeSegment
            )
        ),
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

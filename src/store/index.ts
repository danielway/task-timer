// Zustand stores
export {
  useAppStore,
  getSelectedDate,
  getSelection,
  getActiveEditTaskId,
} from './appStore';
export type { KeyboardSelection, AppState, AppStore } from './appStore';

export { useTaskStore, getTask, getNextTaskId } from './taskStore';
export type { Task, TaskState, TaskStore } from './taskStore';

export { useDateStore, getTasksForDate, getDatesWithTasks } from './dateStore';
export type { DateTasks, DateState, DateStore } from './dateStore';

export {
  useTimeStore,
  getSegment,
  getTimesForDate,
  getTimesForTask,
} from './timeStore';
export type { TaskTime, DateTimes, TimeState, TimeStore } from './timeStore';

// Persistence utilities
export { triggerPersist, loadPersistedState } from './middleware/persist';

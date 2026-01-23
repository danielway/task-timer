// Zustand stores - import all stores to ensure they register with persistence
export { useAppStore, getSelectedDate } from './appStore';
export type { AppState, AppStore } from './appStore';

export { useTaskStore, getTask, getNextTaskId } from './taskStore';
export type { Task, TaskState, TaskStore } from './taskStore';

export { useEditStore, getSelection, getActiveEditTaskId } from './editStore';
export type { KeyboardSelection, EditState, EditStore } from './editStore';

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

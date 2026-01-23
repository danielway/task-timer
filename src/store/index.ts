// Zustand stores
export {
  useAppStore,
  getSelectedDate,
  getSelection,
  getActiveEditTaskId,
} from './appStore';
export type { KeyboardSelection, AppState, AppStore } from './appStore';

export {
  useTaskStore,
  getTask,
  getNextTaskId,
  getTasksByStatus,
  getTasksByProject,
  getIncompleteTasks,
} from './taskStore';
export type { Task, TaskState, TaskStore, TaskStatus } from './taskStore';

export {
  useDateStore,
  getTasksForDate,
  getDatesWithTasks,
  getDateTasksEntry,
  getTaskFirstWorkTime,
  getMostRecentDateWithTasks,
} from './dateStore';
export type { DateTasks, DateState, DateStore } from './dateStore';

export {
  useTimeStore,
  getSegment,
  getTimesForDate,
  getTimesForTask,
} from './timeStore';
export type { TaskTime, DateTimes, TimeState, TimeStore } from './timeStore';

export {
  useProjectStore,
  getProject,
  getActiveProjects,
  getArchivedProjects,
} from './projectStore';
export type { Project, ProjectState, ProjectStore } from './projectStore';

// Persistence utilities
export { triggerPersist, loadPersistedState } from './middleware/persist';

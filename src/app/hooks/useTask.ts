import { useCallback } from 'react';
import {
  useAppStore,
  useTaskStore,
  useEditStore,
  useDateStore,
  useTimeStore,
  getTask,
  getTimesForTask,
  type Task,
  type TaskTime,
} from '../../store';

interface UseTaskReturn {
  // Task data
  task: Task | undefined;
  times: TaskTime[];
  selectedDate: number;

  // Edit state
  isEditing: boolean;
  isDescriptionSelected: boolean;

  // Actions
  updateTask: (description: string, type: string) => void;
  deleteTask: () => void;
  beginEdit: () => void;
  endEdit: () => void;
}

/**
 * Facade hook that combines task, time, date, and edit store operations
 * for a single task. Simplifies component code by providing a unified API.
 */
export const useTask = (taskId: number): UseTaskReturn => {
  // Get state from stores
  const selectedDate = useAppStore((state) => state.selectedDate);
  const taskState = useTaskStore();
  const task = getTask(taskState, taskId);
  const timeState = useTimeStore();
  const times = getTimesForTask(timeState, selectedDate, taskId);

  // Edit state
  const activeEditTaskId = useEditStore((state) => state.activeEditTaskId);
  const isEditing = activeEditTaskId === taskId;
  const uiSelection = useEditStore((state) => state.selection);
  const isDescriptionSelected =
    uiSelection?.taskId === taskId && uiSelection?.description === true;

  // Get actions
  const updateTaskAction = useTaskStore((state) => state.updateTask);
  const deleteTaskAction = useTaskStore((state) => state.deleteTask);
  const beginTaskEdit = useEditStore((state) => state.beginTaskEdit);
  const endTaskEdit = useEditStore((state) => state.endTaskEdit);
  const removeTaskFromDate = useDateStore((state) => state.removeTaskFromDate);
  const removeTime = useTimeStore((state) => state.removeTime);

  // Combined update action
  const updateTask = useCallback(
    (description: string, type: string) => {
      updateTaskAction({ id: taskId, description, type });
      endTaskEdit();
    },
    [taskId, updateTaskAction, endTaskEdit]
  );

  // Combined delete action that removes task from all stores
  const deleteTask = useCallback(() => {
    removeTaskFromDate({ date: selectedDate, taskId });
    deleteTaskAction({ id: taskId });
    times.forEach((time) =>
      removeTime({
        date: selectedDate,
        taskId,
        start: time.start,
      })
    );
  }, [
    selectedDate,
    taskId,
    times,
    removeTaskFromDate,
    deleteTaskAction,
    removeTime,
  ]);

  const beginEdit = useCallback(() => {
    beginTaskEdit({ taskId });
  }, [taskId, beginTaskEdit]);

  return {
    task,
    times,
    selectedDate,
    isEditing,
    isDescriptionSelected,
    updateTask,
    deleteTask,
    beginEdit,
    endEdit: endTaskEdit,
  };
};

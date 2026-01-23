import { useCallback } from 'react';
import {
  useDateStore,
  useTaskStore,
  getMostRecentDateWithTasks,
  getTask,
} from '../../store';

export function useTaskContinuation() {
  const dateState = useDateStore();
  const taskState = useTaskStore();
  const carryForwardTasks = useDateStore((state) => state.carryForwardTasks);

  const carryForwardIncompleteTasks = useCallback(
    (toDate: number) => {
      // Find the most recent date with tasks before the target date
      const previousDate = getMostRecentDateWithTasks(dateState, toDate);

      if (!previousDate) {
        return; // No previous date with tasks
      }

      // Find incomplete tasks from the previous date
      const incompleteTaskIds = previousDate.tasks.filter((taskId) => {
        const task = getTask(taskState, taskId);
        return task && task.status !== 'done';
      });

      if (incompleteTaskIds.length === 0) {
        return; // No incomplete tasks to carry forward
      }

      // Carry forward the incomplete tasks
      carryForwardTasks({
        fromDate: previousDate.date,
        toDate,
        taskIds: incompleteTaskIds,
      });
    },
    [dateState, taskState, carryForwardTasks]
  );

  return { carryForwardIncompleteTasks };
}

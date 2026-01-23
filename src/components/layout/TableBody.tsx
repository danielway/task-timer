import { TableBody as MuiTableBody } from '@mui/material';
import { TaskCreationRow } from '../task/TaskCreationRow';
import { TaskRow } from '../task/TaskRow';
import {
  useAppStore,
  useDateStore,
  useTaskStore,
  getTasksForDate,
  getTask,
} from '../../store';
import { useDragDrop } from '../../app/hooks/useDragDrop';
import { useCallback, useMemo } from 'react';

export const TableBody = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const projectFilter = useAppStore((state) => state.projectFilter);
  const dateState = useDateStore();
  const taskState = useTaskStore();
  const allTaskIds = getTasksForDate(dateState, selectedDate);
  const reorderTasksForDate = useDateStore(
    (state) => state.reorderTasksForDate
  );

  // Filter tasks by project
  const taskIds = useMemo(() => {
    return allTaskIds.filter((taskId) => {
      const task = getTask(taskState, taskId);
      if (!task) return false;

      // Filter by project
      if (projectFilter !== undefined && task.projectId !== projectFilter)
        return false;

      return true;
    });
  }, [allTaskIds, taskState, projectFilter]);

  // Track which tasks are continued from a previous date
  const continuedTaskIds = useMemo(() => {
    const continued = new Set<number>();

    // A task is "continued" if it appears on an earlier date
    dateState.dateTasks.forEach((dt) => {
      if (dt.date < selectedDate) {
        dt.tasks.forEach((taskId) => {
          if (allTaskIds.includes(taskId)) {
            continued.add(taskId);
          }
        });
      }
    });

    return continued;
  }, [dateState.dateTasks, selectedDate, allTaskIds]);

  const handleReorder = useCallback(
    (newTaskOrder: number[]) => {
      reorderTasksForDate({ date: selectedDate, newTaskOrder });
    },
    [selectedDate, reorderTasksForDate]
  );

  const {
    displayItems: displayTaskIds,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useDragDrop({
    items: taskIds,
    onReorder: handleReorder,
  });

  return (
    <MuiTableBody>
      {displayTaskIds.map((taskId, idx) => (
        <TaskRow
          key={taskId}
          taskId={taskId}
          continued={continuedTaskIds.has(taskId)}
          dragging={isDragging(taskId)}
          onDragStart={() => handleDragStart(taskId)}
          onDragEnd={handleDragEnd}
          onDragOver={() => handleDragOver(idx)}
          onDrop={handleDrop}
        />
      ))}
      <TaskCreationRow />
    </MuiTableBody>
  );
};

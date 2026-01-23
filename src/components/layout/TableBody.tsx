import { TableBody as MuiTableBody } from '@mui/material';
import { TaskCreationRow } from '../task/TaskCreationRow';
import { TaskRow } from '../task/TaskRow';
import { useAppStore, useDateStore, getTasksForDate } from '../../store';
import { useDragDrop } from '../../app/hooks/useDragDrop';
import { useCallback } from 'react';

export const TableBody = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const dateState = useDateStore();
  const taskIds = getTasksForDate(dateState, selectedDate);
  const reorderTasksForDate = useDateStore(
    (state) => state.reorderTasksForDate
  );

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

import { TableBody as MuiTableBody } from '@mui/material';
import { TaskCreationRow } from '../task/TaskCreationRow';
import { TaskRow } from '../task/TaskRow';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getSelectedDate } from '../../app/slices/appSlice';
import {
  getTasksForDate,
  reorderTasksForDate,
} from '../../app/slices/dateSlice';
import { useState, useCallback } from 'react';

// Helper function to reorder tasks array
const reorderTasks = (
  taskIds: number[],
  draggedId: number,
  targetIndex: number
): number[] => {
  const fromIndex = taskIds.indexOf(draggedId);
  if (fromIndex === -1) return taskIds;

  const temp = [...taskIds];
  temp.splice(fromIndex, 1);
  temp.splice(targetIndex, 0, draggedId);
  return temp;
};

export const TableBody = () => {
  const selectedDate = useAppSelector(getSelectedDate);
  const taskIds = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );
  const dispatch = useAppDispatch();

  // Drag-and-drop state
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute reordered list if dragging
  let displayTaskIds = taskIds;
  if (draggedTaskId !== null && hoveredIndex !== null) {
    displayTaskIds = reorderTasks(taskIds, draggedTaskId, hoveredIndex);
  }

  // Handlers to pass to TaskRow
  const handleDragStart = useCallback((taskId: number) => {
    setDraggedTaskId(taskId);
  }, []);
  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
    setHoveredIndex(null);
  }, []);
  const handleDragOver = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);
  const handleDrop = useCallback(() => {
    if (draggedTaskId !== null && hoveredIndex !== null) {
      const reordered = reorderTasks(taskIds, draggedTaskId, hoveredIndex);
      dispatch(
        reorderTasksForDate({ date: selectedDate, newTaskOrder: reordered })
      );
    }
    setDraggedTaskId(null);
    setHoveredIndex(null);
  }, [draggedTaskId, hoveredIndex, taskIds, selectedDate, dispatch]);

  return (
    <MuiTableBody>
      {displayTaskIds.map((taskId, idx) => (
        <TaskRow
          key={taskId}
          taskId={taskId}
          dragging={draggedTaskId === taskId}
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

import { TableBody as MuiTableBody } from '@mui/material';
import { TaskCreationRow } from '../task/TaskCreationRow';
import { TaskRow } from '../task/TaskRow';
import { useAppSelector } from '../../app/hooks';
import { getSelectedDate } from '../../app/slices/appSlice';
import { getTasksForDate } from '../../app/slices/dateSlice';
import { useState, useCallback } from 'react';

export const TableBody = () => {
  const selectedDate = useAppSelector(getSelectedDate);
  const taskIds = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );

  // Drag-and-drop state
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute reordered list if dragging
  let displayTaskIds = taskIds;
  if (draggedTaskId !== null && hoveredIndex !== null) {
    const fromIndex = taskIds.indexOf(draggedTaskId);
    if (fromIndex !== -1) {
      const temp = [...taskIds];
      temp.splice(fromIndex, 1);
      temp.splice(hoveredIndex, 0, draggedTaskId);
      displayTaskIds = temp;
    }
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
    setDraggedTaskId(null);
    setHoveredIndex(null);
  }, []);

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

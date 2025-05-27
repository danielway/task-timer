import { TableBody as MuiTableBody } from '@mui/material';
import { TaskCreationRow } from '../task/TaskCreationRow';
import { TaskRow } from '../task/TaskRow';
import { useAppSelector } from '../../app/hooks';
import { getSelectedDate } from '../../app/slices/appSlice';
import { getTasksForDate } from '../../app/slices/dateSlice';

export const TableBody = () => {
  const selectedDate = useAppSelector(getSelectedDate);
  const taskIds = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );

  return (
    <MuiTableBody>
      {taskIds.map((taskId) => (
        <TaskRow key={taskId} taskId={taskId} />
      ))}
      <TaskCreationRow />
    </MuiTableBody>
  );
};

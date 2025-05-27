import './TimeRow.css';
import { TimeIncrement } from './TimeIncrement';
import { TableCell } from '@mui/material';
import { HOUR_COUNT } from '../../app/constants';
import { useCallback } from 'react';

interface TimeRowProps {
  taskId: number;
}

export const TimeRowCell = (props: TimeRowProps) => {
  const renderSegment = useCallback(
    (segment: number) => (
      <TimeIncrement key={segment} taskId={props.taskId} segment={segment} />
    ),
    [props.taskId]
  );

  const renderHour = (index: number) => (
    <TableCell key={index} className="cell increment-cell">
      <div className="incrementContainer">
        {[0, 1, 2, 3].map((segment) => renderSegment(index * 4 + segment))}
      </div>
    </TableCell>
  );

  const hours = [];
  for (let i = 0; i < HOUR_COUNT; i++) {
    hours.push(renderHour(i));
  }

  return <>{hours}</>;
};

import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from '@mui/material';
import { TimeHeaderCells } from '../time/TimeHeaderCells';
import { useAppStore, useDateStore, getTasksForDate } from '../../store';
import { TimeCursor } from '../time/TimeCursor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TableBody } from './TableBody';

export const Table = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const dateState = useDateStore();
  const tasks = getTasksForDate(dateState, selectedDate);

  const tableRef = useRef<HTMLTableElement>(null);

  const [timeHeight, setTimeHeight] = useState<number>(0);

  useEffect(
    () => setTimeHeight(tableRef.current?.getBoundingClientRect().height ?? 0),
    [tableRef, tasks]
  );

  const [hoursPosition, setHoursPosition] = useState<{
    hoursLeftPosition: number;
    hoursRightPosition: number;
  } | null>(null);

  const handleNewHoursPosition = useCallback(
    (hoursLeft: number, hoursRight: number) => {
      if (tableRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        setHoursPosition({
          hoursLeftPosition: hoursLeft - tableRect.left,
          hoursRightPosition: hoursRight - tableRect.left,
        });
      }
    },
    [tableRef]
  );

  return (
    <TableContainer
      component={Paper}
      ref={tableRef}
      sx={{
        mb: { xs: 1, sm: 1.25 },
        position: 'relative',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <TimeCursor
        hoursPositionLeft={hoursPosition?.hoursLeftPosition}
        hoursPositionRight={hoursPosition?.hoursRightPosition}
        hoursHeight={timeHeight}
      />
      <MuiTable size="small" sx={{ minWidth: { xs: 800, sm: 'auto' } }}>
        <TableHead>
          <TableRow>
            <TableCell component="th" className="icon" />
            <TableCell component="th" className="header">
              Task
            </TableCell>
            <TimeHeaderCells onNewPosition={handleNewHoursPosition} />
            <TableCell component="th" className="time">
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </MuiTable>
    </TableContainer>
  );
};

import {
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from "@mui/material";
import { TimeHeaderCells } from "../time/TimeHeaderCells";
import { useAppSelector } from "../../app/hooks";
import { selectDates, selectTasks } from "../../app/slice";
import { TimeCursor } from "../time/TimeCursor";
import { useCallback, useEffect, useRef, useState } from "react";
import { TableBody } from "./TableBody";

export const Table = () => {
  const dates = useAppSelector(selectDates);
  const selectedDate = dates[1];

  const tasks = useAppSelector((state) => selectTasks(state, selectedDate));
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
      style={{ marginBottom: "10px", position: "relative" }}
    >
      <TimeCursor
        hoursPositionLeft={hoursPosition?.hoursLeftPosition}
        hoursPositionRight={hoursPosition?.hoursRightPosition}
        hoursHeight={timeHeight}
      />
      <MuiTable size="small">
        <TableHead>
          <TableRow>
            <TableCell className="icon" />
            <TableCell className="header">Task</TableCell>
            <TimeHeaderCells onNewPosition={handleNewHoursPosition} />
            <TableCell className="header">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody />
      </MuiTable>
    </TableContainer>
  );
};

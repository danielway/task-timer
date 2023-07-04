import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableCell,
} from "@mui/material";
import { Layout } from "./layout/Layout";
import { TaskCreationRow } from "./task/TaskCreationRow";
import { TaskRow } from "./task/TaskRow";
import { TimeHeaderCells } from "./time/TimeHeaderCells";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createTask,
  deleteTask,
  logTime,
  removeTime,
  selectDates,
  selectTasks,
  selectTimes,
  updateTask,
} from "../app/slice";
import { TimeCursor } from "./time/TimeCursor";
import { useCallback, useEffect, useRef, useState } from "react";

export const App = () => {
  const dispatch = useAppDispatch();

  const dates = useAppSelector(selectDates);
  const selectedDate = dates[1];

  const tasks = useAppSelector((state) => selectTasks(state, selectedDate));
  const times = useAppSelector((state) => selectTimes(state, selectedDate));

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
    <Layout>
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
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="icon" />
              <TableCell className="header">Task</TableCell>
              <TimeHeaderCells onNewPosition={handleNewHoursPosition} />
              <TableCell className="header">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TaskRow
                task={task}
                time={times.filter((time) => time.taskId === task.id)}
                key={task.id}
                updateTask={(id, name) =>
                  dispatch(updateTask({ date: selectedDate, id, name }))
                }
                deleteTask={(task) =>
                  dispatch(deleteTask({ date: selectedDate, task }))
                }
                logTime={(taskId, timeSegment) =>
                  dispatch(logTime({ date: selectedDate, taskId, timeSegment }))
                }
                removeTime={(taskId, timeSegment) =>
                  dispatch(
                    removeTime({ date: selectedDate, taskId, timeSegment })
                  )
                }
              />
            ))}
            <TaskCreationRow
              timeCount={times.length}
              createTask={(name) =>
                dispatch(createTask({ date: selectedDate, name }))
              }
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

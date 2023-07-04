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

  const [[left, right], setTimeDims] = useState<[number, number]>([0, 0]);
  const [timeHeight, setTimeHeight] = useState<number>(0);

  const tableRef = useRef<HTMLTableElement>(null);

  const dates = useAppSelector(selectDates);
  const date = dates[1];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStamp = today.getTime();

  const tasks = useAppSelector((state) => selectTasks(state, date));
  const times = useAppSelector((state) => selectTimes(state, date));

  useEffect(
    () => setTimeHeight(tableRef.current?.getBoundingClientRect().height ?? 0),
    [tableRef, tasks]
  );

  const timeCursor = useCallback(() => {
    if (date !== todayStamp) {
      return null;
    }

    return <TimeCursor left={left} right={right} height={timeHeight} />;
  }, [left, right, timeHeight, date, todayStamp]);

  const onNewDimensions = useCallback(
    (dimensions: number[]) => {
      const [headerLeft, headerRight] = dimensions;
      if (tableRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        setTimeDims([
          headerLeft - tableRect.left,
          headerRight - tableRect.left,
        ]);
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
        {timeCursor()}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="icon" />
              <TableCell className="header">Task</TableCell>
              <TimeHeaderCells onNewDimensions={onNewDimensions} />
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
                  dispatch(updateTask({ date, id, name }))
                }
                deleteTask={(task) => dispatch(deleteTask({ date, task }))}
                logTime={(taskId, timeSegment) =>
                  dispatch(logTime({ date, taskId, timeSegment }))
                }
                removeTime={(taskId, timeSegment) =>
                  dispatch(removeTime({ date, taskId, timeSegment }))
                }
              />
            ))}
            <TaskCreationRow
              timeCount={times.length}
              createTask={(name) => dispatch(createTask({ date, name }))}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

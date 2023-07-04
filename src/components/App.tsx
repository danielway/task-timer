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
import { TimeHeaderCells } from "./time/TimeHeaderCell";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createDay,
  createTask,
  deleteTask,
  logTime,
  removeTime,
  selectTasks,
  selectTimes,
  updateTask,
} from "../app/slice";
import { useState } from "react";

export const App = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [date, setDate] = useState(today.getTime());

  const dispatch = useAppDispatch();
  dispatch(createDay(date));

  const tasks = useAppSelector((state) => selectTasks(state, date));
  const times = useAppSelector((state) => selectTimes(state, date));

  return (
    <Layout>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell className="icon" />
              <TableCell className="header">Task</TableCell>
              <TimeHeaderCells></TimeHeaderCells>
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

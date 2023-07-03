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
import TaskCreationRow from "./task/TaskCreationRow";
import TaskRow from "./task/TaskRow";
import { TimeHeaderCells } from "./time/TimeHeaderCell";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  createTask,
  deleteTask,
  logTime,
  removeTime,
  selectTasks,
  selectTime,
  updateTask,
} from "../app/slice";

export const App = () => {
  const tasks = useSelector(selectTasks);
  const time = useSelector(selectTime);

  const dispatch = useAppDispatch();

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
                time={time.filter((time) => time.taskId === task.id)}
                key={task.id}
                updateTask={(id, name) => dispatch(updateTask({ id, name }))}
                deleteTask={(id) => dispatch(deleteTask(id))}
                logTime={(taskId, timeSegment) =>
                  dispatch(logTime({ taskId, timeSegment }))
                }
                removeTime={(taskId, timeSegment) =>
                  dispatch(removeTime({ taskId, timeSegment }))
                }
              />
            ))}
            <TaskCreationRow
              timeCount={time.length}
              createTask={(name) => dispatch(createTask(name))}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

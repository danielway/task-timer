import { TableBody as MuiTableBody } from "@mui/material";
import { TaskCreationRow } from "../task/TaskCreationRow";
import { TaskRow } from "../task/TaskRow";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createTask,
  deleteTask,
  logTime,
  removeTime,
  selectDates,
  selectTasks,
  selectTimes,
  updateTask,
} from "../../app/slice";

export const TableBody = () => {
  const dispatch = useAppDispatch();

  const dates = useAppSelector(selectDates);
  const selectedDate = dates[1];

  const tasks = useAppSelector((state) => selectTasks(state, selectedDate));
  const times = useAppSelector((state) => selectTimes(state, selectedDate));

  return (
    <MuiTableBody>
      {tasks.map((task, row) => (
        <TaskRow
          row={row}
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
            dispatch(removeTime({ date: selectedDate, taskId, timeSegment }))
          }
        />
      ))}
      <TaskCreationRow
        timeCount={times.length}
        createTask={(name) =>
          dispatch(createTask({ date: selectedDate, name }))
        }
      />
    </MuiTableBody>
  );
};

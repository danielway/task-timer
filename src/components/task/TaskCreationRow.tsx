import { useRef, useState } from "react";
import { TableRow, Input, Button, TableCell } from "@mui/material";
import { TimeSummaryCell } from "../time/TimeSummaryCell";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createTask, getNextTaskId } from "../../app/slices/taskSlice";
import { TaskTime, getTimesForDate } from "../../app/slices/timeSlice";
import { getSelectedDate } from "../../app/slices/appSlice";
import { addTaskToDate } from "../../app/slices/dateSlice";

export const TaskCreationRow = () => {
  const dispatch = useAppDispatch();

  const [description, setDescription] = useState("");

  const selectedDate = useAppSelector(getSelectedDate);
  const timesForDate = useAppSelector((state) =>
    getTimesForDate(state.time, selectedDate)
  );

  const nextId = useAppSelector((state) => getNextTaskId(state.task));

  const addTask = () => {
    dispatch(createTask({ id: nextId, description }));
    dispatch(addTaskToDate({ date: selectedDate, taskId: nextId }));
    setDescription("");
  };

  const totalMinutes = timesForDate.reduce(
    (acc, cur) => acc + getDurationMinutes(cur),
    0
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TableRow>
      <TableCell className="icon" />
      <TableCell>
        <Input
          inputRef={inputRef}
          style={{ fontSize: 13 }}
          placeholder="Task name/description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            } else if (event.key === "Escape") {
              setDescription("");
              inputRef.current?.blur();
            }
          }}
        />
        <Button
          color="secondary"
          size="small"
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={addTask}
        >
          Add Task
        </Button>
      </TableCell>
      <TableCell colSpan={11}></TableCell>
      <TimeSummaryCell totalMinutes={totalMinutes} />
    </TableRow>
  );
};

const getDurationMinutes = (time: TaskTime) => {
  const end = time.end ?? new Date().getTime();
  return end / 1000 / 60 - time.start / 1000 / 60;
};

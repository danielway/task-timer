import { useEffect, useRef, useState } from "react";
import "./TaskRow.css";
import { TableRow, Input, Button, TableCell } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TimeRowCell } from "../time/TimeRow";
import { TimeSummaryCell } from "../time/TimeSummaryCell";
import {
  Task,
  Time,
  selectCursor,
  selectRowBeingEdited,
  updateRowBeingEdited,
  updateCursor,
} from "../../app/slice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface TaskRowProps {
  row: number;
  task: Task;
  time: Time[];
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
  logTime: (taskId: number, timeSegment: number) => any;
  removeTime: (taskId: number, timeSegment: number) => any;
}

export const TaskRow = (props: TaskRowProps) => {
  const dispatch = useAppDispatch();

  const [taskName, setTaskName] = useState("");
  useEffect(() => setTaskName(props.task.name), [props.task.name]);

  const rowBeingEdited = useAppSelector(selectRowBeingEdited);
  const editing = rowBeingEdited === props.row;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), [inputRef, editing]);

  const cursor = useAppSelector(selectCursor);
  const descriptionSelected =
    cursor && cursor[0] === props.row && cursor[1] === 0;

  const selectDescription = () =>
    dispatch(updateCursor({ row: props.row, column: 0 }));

  const selectSegment = (segment: number) =>
    dispatch(updateCursor({ row: props.row, column: segment + 1 }));

  const updateTask = () => {
    props.updateTask(props.task.id, taskName);
    dispatch(updateRowBeingEdited(undefined));
    setTaskName("");
  };

  const taskRowTime = () => (
    <>
      <TimeRowCell
        row={props.row}
        task={props.task}
        time={props.time}
        logTime={(taskId, timeSeg) => {
          props.logTime(taskId, timeSeg);
          selectSegment(timeSeg);
        }}
        removeTime={(taskId, timeSeg) => {
          props.removeTime(taskId, timeSeg);
          selectSegment(timeSeg);
        }}
      />
      <TimeSummaryCell timeCount={props.time.length} />
    </>
  );

  const renderViewRow = () => (
    <TableRow className="taskRow cell">
      <TableCell className="icon">
        <HighlightOffIcon
          onClick={() => props.deleteTask(props.task.id)}
          className="taskDelete"
          fontSize="small"
        />
      </TableCell>
      <TableCell
        sx={{
          fontWeight: descriptionSelected ? "bold" : undefined,
          textDecoration: descriptionSelected ? "underline" : undefined,
        }}
        onClick={() => {
          dispatch(updateRowBeingEdited(props.row));
          selectDescription();
        }}
        component="th"
        scope="row"
        className="taskName"
      >
        {props.task.name}
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  const renderEditRow = () => (
    <TableRow>
      <TableCell className="icon" />
      <TableCell component="th" scope="row" className="cell">
        <Input
          ref={inputRef}
          style={{ fontSize: 13 }}
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              updateTask();
            }
          }}
        />
        <Button
          color="secondary"
          size="small"
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={updateTask}
        >
          Update Task
        </Button>
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  return editing ? renderEditRow() : renderViewRow();
};

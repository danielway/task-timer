import { useState } from "react";
import "./TaskRow.css";
import { TableRow, Input, Button, TableCell } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TimeRowCell } from "../time/TimeRow";
import { TimeSummaryCell } from "../time/TimeSummaryCell";
import { Task, Time } from "../../app/slice";

interface TaskRowProps {
  task: Task;
  time: Time[];
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
  logTime: (taskId: number, timeSegment: number) => any;
  removeTime: (taskId: number, timeSegment: number) => any;
}

export const TaskRow = (props: TaskRowProps) => {
  const [editing, setEditing] = useState(false);
  const [taskName, setTaskName] = useState("");

  const updateTask = () => {
    props.updateTask(props.task.id, taskName);
    setEditing(false);
    setTaskName("");
  };

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
        onClick={() => {
          setEditing(true);
          setTaskName(props.task.name);
        }}
        component="th"
        scope="row"
        className="taskName"
      >
        {props.task.name}
      </TableCell>
      <TimeRowCell
        task={props.task}
        time={props.time}
        logTime={props.logTime}
        removeTime={props.removeTime}
      />
      <TimeSummaryCell timeCount={props.time.length} />
    </TableRow>
  );

  const renderEditRow = () => (
    <TableRow>
      <TableCell className="icon" />
      <TableCell component="th" scope="row" className="cell">
        <Input
          style={{ fontSize: 13 }}
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          onKeyUp={(event) => {
            if (event.keyCode === 13) {
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
      <TimeRowCell
        task={props.task}
        time={props.time}
        logTime={props.logTime}
        removeTime={props.removeTime}
      />
      <TimeSummaryCell timeCount={props.time.length} />
    </TableRow>
  );

  return editing ? renderEditRow() : renderViewRow();
};

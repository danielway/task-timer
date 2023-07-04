import { ChangeEvent, KeyboardEvent, useState } from "react";
import { TableRow, Input, Button, TableCell } from "@mui/material";
import TimeSummaryCell from "../time/TimeSummaryCell";

interface TaskCreationRowProps {
  timeCount: number;
  createTask: (name: string) => any;
}

export const TaskCreationRow = (props: TaskCreationRowProps) => {
  const [taskName, setTaskName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    setTaskName(event.target.value);

  const handleNameKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      addTask();
    }
  };

  const addTask = () => {
    props.createTask(taskName);
    setTaskName("");
  };

  return (
    <TableRow>
      <TableCell className="icon" />
      <TableCell>
        <Input
          style={{ fontSize: 13 }}
          placeholder="Task name/description"
          value={taskName}
          onChange={handleNameChange}
          onKeyUp={handleNameKey}
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
      <TimeSummaryCell timeCount={props.timeCount} />
    </TableRow>
  );
};

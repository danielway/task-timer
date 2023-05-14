import React, { ChangeEvent, KeyboardEvent } from 'react';
import { TableRow, Input, Button, TableCell } from '@mui/material';
import TimeSummaryCell from '../time/TimeSummaryCell';

interface CreateTaskProps {
  timeCount: number;
  createTask: (name: string) => any;
}

interface CreateTaskState {
  taskName: string;
}

class TaskCreationRow extends React.Component<
  CreateTaskProps,
  CreateTaskState
> {
  constructor(props: CreateTaskProps) {
    super(props);
    this.state = { taskName: '' };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameKey = this.handleNameKey.bind(this);
  }

  handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ taskName: event.target.value });

  handleNameKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      this.addTask();
    }
  };

  addTask = () => {
    this.props.createTask(this.state.taskName);
    this.setState({ taskName: '' });
  };

  render() {
    return (
      <TableRow>
        <TableCell className='icon' />
        <TableCell>
          <Input
            style={{ fontSize: 13 }}
            placeholder="Task name/description"
            value={this.state.taskName}
            onChange={this.handleNameChange}
            onKeyUp={this.handleNameKey}
          />
          <Button
            color="secondary"
            size="small"
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={this.addTask}
          >
            Add Task
          </Button>
        </TableCell>
        <TableCell colSpan={11}></TableCell>
        <TimeSummaryCell timeCount={this.props.timeCount} />
      </TableRow>
    );
  }
}

export default TaskCreationRow;

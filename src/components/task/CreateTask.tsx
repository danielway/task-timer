import React, { ChangeEvent } from 'react';
import { TableRow, Input, Button } from '@material-ui/core';
import IconTableCell from '../IconTableCell';
import StyledTableCell from '../StyledTableCell';

interface CreateTaskProps {
  createTask: (name: string) => any;
}

interface CreateTaskState {
  taskName: string;
}

class CreateTask extends React.Component<CreateTaskProps, CreateTaskState> {
  constructor(props: CreateTaskProps) {
    super(props);
    this.state = { taskName: '' };

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ taskName: event.target.value });

  addTask = () => {
    this.props.createTask(this.state.taskName);
    this.setState({ taskName: '' });
  };

  render() {
    return (
      <TableRow>
        <IconTableCell />
        <StyledTableCell>
          <Input
            style={{ fontSize: 13 }}
            placeholder="Task name/description"
            value={this.state.taskName}
            onChange={this.handleNameChange}
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
        </StyledTableCell>
        <StyledTableCell colSpan={11}></StyledTableCell>
      </TableRow>
    );
  }
}

export default CreateTask;

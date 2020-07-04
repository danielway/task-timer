import React, { ChangeEvent } from 'react';
import './TaskRow.css';
import { Task } from '../app/redux';
import { TableRow, Input, Button } from '@material-ui/core';
import IconTableCell from './IconTableCell';
import StyledTableCell from './StyledTableCell';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

interface TaskRowProps {
  task: Task;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
}

interface TaskRowState {
  editing: boolean;
  taskName: string;
}

class TaskRow extends React.Component<TaskRowProps, TaskRowState> {
  constructor(props: TaskRowProps) {
    super(props);
    this.state = { editing: false, taskName: '' };

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ ...this.state, taskName: event.target.value });

  startEditing = () =>
    this.setState({ editing: true, taskName: this.props.task.name });

  updateTask = () => {
    this.props.updateTask(this.props.task.id, this.state.taskName);
    this.setState({ editing: false, taskName: '' });
  };

  deleteTask = () => this.props.deleteTask(this.props.task.id);

  render() {
    const task = this.props.task;
    return this.state.editing ? this.renderEditRow() : this.renderViewRow(task);
  }

  renderViewRow(task: Task) {
    return (
      <TableRow className="taskRow">
        <IconTableCell>
          <HighlightOffIcon
            onClick={this.deleteTask}
            className="taskDelete"
            fontSize="small"
          />
        </IconTableCell>
        <StyledTableCell
          onClick={this.startEditing}
          component="th"
          scope="row"
          className="taskName"
        >
          {task.name}
        </StyledTableCell>
      </TableRow>
    );
  }

  renderEditRow() {
    return (
      <TableRow>
        <IconTableCell />
        <StyledTableCell component="th" scope="row">
          <Input
            style={{ fontSize: 13 }}
            value={this.state.taskName}
            onChange={this.handleNameChange}
          />
          <Button
            color="secondary"
            size="small"
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={this.updateTask}
          >
            Update Task
          </Button>
        </StyledTableCell>
      </TableRow>
    );
  }
}

export default TaskRow;

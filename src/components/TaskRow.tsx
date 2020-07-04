import React from 'react';
import { Task } from '../app/redux';
import { TableRow } from '@material-ui/core';
import IconTableCell from './IconTableCell';
import StyledTableCell from './StyledTableCell';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

interface TaskRowProps {
  task: Task;
}

class TaskRow extends React.Component<TaskRowProps> {
  render() {
    const task = this.props.task;
    return (
      <TableRow>
        <IconTableCell>
          <HighlightOffIcon fontSize="small" />
        </IconTableCell>
        <StyledTableCell component="th" scope="row">
          {task.name}
        </StyledTableCell>
      </TableRow>
    );
  }
}

export default TaskRow;

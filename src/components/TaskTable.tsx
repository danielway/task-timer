import React from 'react';
import { Task } from '../app/redux';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from '@material-ui/core';
import IconTableCell from './IconTableCell';
import StyledTableCell from './StyledTableCell';
import CreateTask from './CreateTask';
import TaskRow from './TaskRow';

interface TaskTableProps {
  tasks: Task[];
  createTask: (name: string) => any;
}

class TaskTable extends React.Component<TaskTableProps> {
  render() {
    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <IconTableCell />
              <StyledTableCell>Task</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.tasks.map((task) => (
              <TaskRow task={task} key={task.id} />
            ))}
            <CreateTask createTask={this.props.createTask} />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default TaskTable;

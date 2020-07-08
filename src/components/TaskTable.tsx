import React from 'react';
import { Task, Time } from '../app/redux';
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
import CreateTask from './task/CreateTask';
import TaskRow from './task/TaskRow';
import { TimeHeaderCells } from './time/TimeCells';

interface TaskTableProps {
  tasks: Task[];
  time: Time[];
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
  logTime: (taskId: number, timeSegment: number) => any;
  removeTime: (taskId: number, timeSegment: number) => any;
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
              <TimeHeaderCells />
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.tasks.map((task) => (
              <TaskRow
                task={task}
                time={this.props.time.filter((time) => time.taskId === task.id)}
                key={task.id}
                updateTask={this.props.updateTask}
                deleteTask={this.props.deleteTask}
                logTime={this.props.logTime}
                removeTime={this.props.removeTime}
              />
            ))}
            <CreateTask createTask={this.props.createTask} />
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default TaskTable;

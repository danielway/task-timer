// Core
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

// Redux
import {
  AppState,
  createTask,
  updateTask,
  deleteTask,
  logTime,
  removeTime,
} from '../app/redux';

// Mat-UI
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from '@material-ui/core';

// Layout
import Layout from './layout/Layout';
import IconTableCell from './IconTableCell';
import StyledTableCell from './StyledTableCell';

// Children
import CreateTask from './task/CreateTask';
import TaskRow from './task/TaskRow';
import { TimeHeaderCells } from './time/TimeHeaderCell';

interface AppActions {
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
  logTime: (taskId: number, timeSeg: number) => any;
  removeTime: (taskId: number, timeSeg: number) => any;
}

type AppProps = AppActions & AppState;

class App extends React.Component<AppProps> {
  render() {
    const tasks = this.props.tasks;
    const time = this.props.time;

    return (
      <Layout>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <IconTableCell />
                <StyledTableCell>Task</StyledTableCell>
                <TimeHeaderCells />
                <StyledTableCell>Total</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TaskRow
                  task={task}
                  time={time.filter((time) => time.taskId === task.id)}
                  key={task.id}
                  updateTask={this.props.updateTask}
                  deleteTask={this.props.deleteTask}
                  logTime={this.props.logTime}
                  removeTime={this.props.removeTime}
                />
              ))}
              <CreateTask
                timeCount={this.props.time.length}
                createTask={this.props.createTask}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Layout>
    );
  }
}

export default connect(
  (state: AppState) => state,
  (dispatch: Dispatch<any>): AppActions => ({
    createTask: (name) => dispatch(createTask(name)),
    updateTask: (id, name) => dispatch(updateTask(id, name)),
    deleteTask: (id) => dispatch(deleteTask(id)),
    logTime: (taskId, timeSeg) => dispatch(logTime(taskId, timeSeg)),
    removeTime: (taskId, timeSeg) => dispatch(removeTime(taskId, timeSeg)),
  })
)(App);

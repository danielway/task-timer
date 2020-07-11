import React, { Dispatch } from 'react';
import Layout from './layout/Layout';
import { connect } from 'react-redux';
import {
  AppState,
  createTask,
  updateTask,
  deleteTask,
  logTime,
  removeTime,
} from '../app/redux';
import TaskTable from './TaskTable';

const mapStateToProps = (state: AppState): AppState => ({
  tasks: state.tasks,
  time: state.time,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): AppActions => ({
  createTask: (name: string) => dispatch(createTask(name)),
  updateTask: (id: number, name: string) => dispatch(updateTask(id, name)),
  deleteTask: (id: number) => dispatch(deleteTask(id)),
  logTime: (taskId: number, timeSegment: number) =>
    dispatch(logTime(taskId, timeSegment)),
  removeTime: (taskId: number, timeSegment: number) =>
    dispatch(removeTime(taskId, timeSegment)),
});

interface AppActions {
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
  logTime: (taskId: number, timeSegment: number) => any;
  removeTime: (taskId: number, timeSegment: number) => any;
}

type AppProps = AppActions & AppState;

class App extends React.Component<AppProps> {
  render() {
    return (
      <Layout>
        <TaskTable
          tasks={this.props.tasks}
          time={this.props.time}
          createTask={this.props.createTask}
          updateTask={this.props.updateTask}
          deleteTask={this.props.deleteTask}
          logTime={this.props.logTime}
          removeTime={this.props.removeTime}
        />
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { Dispatch } from 'react';
import Layout from './Layout';
import { connect } from 'react-redux';
import { AppState, createTask, updateTask, deleteTask } from '../app/redux';
import TaskTable from './TaskTable';

const mapStateToProps = (state: AppState): AppState => ({
  tasks: state.tasks,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): AppActions => ({
  createTask: (name: string) => dispatch(createTask(name)),
  updateTask: (id: number, name: string) => dispatch(updateTask(id, name)),
  deleteTask: (id: number) => dispatch(deleteTask(id)),
});

interface AppActions {
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
}

type AppProps = AppActions & AppState;

class App extends React.Component<AppProps> {
  render() {
    return (
      <Layout>
        <TaskTable
          tasks={this.props.tasks}
          createTask={this.props.createTask}
        />
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

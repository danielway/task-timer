import React, { Dispatch } from 'react';
import Layout from './Layout';
import { connect } from 'react-redux';
import { AppState, createTask, updateTask, deleteTask } from '../app/redux';

interface AppActions {
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
}

type AppProps = AppActions & AppState;

const mapStateToProps = (state: AppState): AppState => ({
  tasks: state.tasks,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): AppActions => ({
  createTask: (name: string) => dispatch(createTask(name)),
  updateTask: (id: number, name: string) => dispatch(updateTask(id, name)),
  deleteTask: (id: number) => dispatch(deleteTask(id)),
});

class App extends React.Component<AppProps> {
  addTask = () =>
    this.props.createTask(`New task created at ${new Date().toString()}`);

  render() {
    const renderedTasks = this.props.tasks.map((task) => (
      <li key={task.id}>{task.name}</li>
    ));
    return (
      <Layout>
        <button onClick={this.addTask}>Add Task</button>
        <ul>{renderedTasks}</ul>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

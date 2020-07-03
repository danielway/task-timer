import React, { Dispatch } from 'react';
import Layout from './Layout';
import { connect } from 'react-redux';
import { AppState, createTask, updateTask, deleteTask } from '../app/redux';

const mapStateToProps = (state: AppState) => ({
  tasks: state.tasks,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  actions: {
    createTask: (name: string) => dispatch(createTask(name)),
    updateTask: (id: number, name: string) => dispatch(updateTask(id, name)),
    deleteTask: (id: number) => dispatch(deleteTask(id)),
  },
});

const App = () => <Layout>Hello world!</Layout>;

export default connect(mapStateToProps, mapDispatchToProps)(App);

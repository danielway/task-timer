import React, { Dispatch, ChangeEvent } from 'react';
import Layout from './Layout';
import { connect } from 'react-redux';
import { AppState, createTask, updateTask, deleteTask } from '../app/redux';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  withStyles,
  Theme,
  createStyles,
  Input,
  Button,
  Box,
} from '@material-ui/core';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

interface AppActions {
  createTask: (name: string) => any;
  updateTask: (id: number, name: string) => any;
  deleteTask: (id: number) => any;
}

interface AppComponentState {
  taskName: string;
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

class App extends React.Component<AppProps, AppComponentState> {
  constructor(props: AppProps) {
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
      <Layout>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Task</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.tasks.map((task) => (
                <TableRow key={task.id}>
                  <StyledTableCell component="th" scope="row">
                    {task.name}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box padding="20px">
          <Button
            color="secondary"
            size="small"
            variant="contained"
            onClick={this.addTask}
          >
            Add Task
          </Button>
          <Input
            placeholder="Placeholder"
            style={{ marginLeft: '10px' }}
            value={this.state.taskName}
            onChange={this.handleNameChange}
          />
        </Box>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

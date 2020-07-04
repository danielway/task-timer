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
} from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const IconTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      paddingRight: 0,
      width: 10,
      fontSize: 14,
    },
    body: {
      color: theme.palette.primary.light,
      paddingTop: 10,
      paddingRight: 0,
      width: 10,
      fontSize: 14,
    },
  })
)(TableCell);

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
                <IconTableCell />
                <StyledTableCell align="left">Task</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.tasks.map((task) => (
                <TableRow key={task.id}>
                  <IconTableCell>
                    <HighlightOffIcon fontSize="small" />
                  </IconTableCell>
                  <StyledTableCell align="left" component="th" scope="row">
                    {task.name}
                  </StyledTableCell>
                </TableRow>
              ))}
              <TableRow>
                <IconTableCell />
                <StyledTableCell>
                  <Input
                    style={{ fontSize: 13 }}
                    placeholder="Add task"
                    value={this.state.taskName}
                    onChange={this.handleNameChange}
                  />
                  <Button
                    color="secondary"
                    size="small"
                    variant="contained"
                    style={{ marginLeft: 10 }}
                    onClick={this.addTask}
                  >
                    Add Task
                  </Button>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

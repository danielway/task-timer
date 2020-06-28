import React from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.css';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { CssBaseline, Box, Divider, Link } from '@material-ui/core';

function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'light',
      primary: { main: '#173040' },
      secondary: { main: '#bf3111' }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Task Timer
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography>
            Saturday, June 27th, 2020
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box padding="20px">
          Hello world!
        </Box>
        <Divider variant="middle" />
        <Box marginTop="15px" textAlign="center">
          Created by <Link href="https://www.danieldway.com" color="secondary">Daniel Way</Link> under the MIT License.
          <Link style={{ marginLeft: '10px' }} href="https://github.com/danielway/task-timer" color="secondary">Contribute or fork on GitHub.</Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

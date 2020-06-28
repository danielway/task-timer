import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5">Task Timer</Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography>{new Date().toDateString()}</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

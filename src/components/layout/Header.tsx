import { AppBar, Toolbar, Typography } from "@mui/material";

export const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5" sx={{ flexGrow: 1 }}>
        Task Timer
      </Typography>
      <Typography>{new Date().toDateString()}</Typography>
    </Toolbar>
  </AppBar>
);

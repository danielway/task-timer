import { AppBar, Toolbar, Typography } from "@mui/material";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h5" sx={{ flexGrow: 1 }}>
        Task Timer
      </Typography>
      <Typography>
        {new Date().toLocaleDateString("en-US", dateOptions)}
      </Typography>
    </Toolbar>
  </AppBar>
);

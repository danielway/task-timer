import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { DatePicker } from "./DatePicker";

export const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Task Timer
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <DatePicker />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectDates } from "../../app/slice";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const otherDateOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
};

export const Header = () => {
  const dates = useAppSelector(selectDates);
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Task Timer
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {dates.map((date, index) => (
            <Button
              key={date}
              sx={{
                marginLeft: "10px",
                color: "#fff",
                fontWeight: index === 1 ? "bold" : "normal",
              }}
            >
              {new Date(date).toLocaleDateString(
                "en-US",
                index === 1 ? dateOptions : otherDateOptions
              )}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

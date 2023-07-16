import {
  AppBar,
  Box,
  Button,
  Icon,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectDates, selectDay } from "../../app/slice";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

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
  const dispatch = useAppDispatch();

  const dates = useAppSelector(selectDates);
  const previousDate = dates[0];
  const nextDate = dates[2];

  const formatDate = (date: number, other = false) =>
    new Date(date).toLocaleDateString(
      "en-US",
      other ? otherDateOptions : dateOptions
    );

  const dateButton = (date: number) => (
    <Button
      key={date}
      sx={{
        marginLeft: "10px",
        color: "#fff",
      }}
      onClick={() => dispatch(selectDay(date))}
    >
      {formatDate(date, true)}
    </Button>
  );

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Task Timer
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {dateButton(previousDate)}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClick}
            sx={{
              marginLeft: "10px",
            }}
          >
            {formatDate(dates[1])}{" "}
            <CalendarTodayIcon
              sx={{
                fontSize: "1.1rem",
                marginLeft: "10px",
              }}
            />
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                showDaysOutsideCurrentMonth={true}
                onChange={(value: any) => {
                  dispatch(selectDay(value.valueOf()));
                  handleClose();
                }}
              />
            </LocalizationProvider>
          </Popover>
          {dateButton(nextDate)}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

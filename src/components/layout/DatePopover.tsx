import { Button, Popover } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs from "dayjs";

interface DatePopoverProps {
  currentDate: number;
  onSelectDate: (date: number) => void;
}

export const DatePopover = (props: DatePopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
        sx={{
          marginLeft: "10px",
        }}
      >
        {new Date(props.currentDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
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
            value={dayjs(props.currentDate)}
            showDaysOutsideCurrentMonth={true}
            onChange={(value: any, selection) => {
              if (selection !== "finish") return;

              props.onSelectDate(value.valueOf());
              handleClose();
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
};

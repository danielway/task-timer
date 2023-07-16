import { Button, Popover } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../../app/hooks";
import { selectDatesWithTasks } from "../../app/slice";

interface DatePopoverProps {
  currentDate: number;
  onSelectDate: (date: number) => void;
}

export const DatePopover = (props: DatePopoverProps) => {
  const datesWithTasks = useAppSelector(selectDatesWithTasks);

  const Day = (props: PickersDayProps<Dayjs>) => {
    const { day, ...other } = props;

    const hasTasks = datesWithTasks.includes(day.valueOf());

    return (
      <PickersDay
        {...other}
        day={day}
        sx={{ fontWeight: hasTasks ? "bold" : "normal" }}
      />
    );
  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const closePopover = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={openPopover}
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
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={dayjs(props.currentDate)}
            showDaysOutsideCurrentMonth={true}
            slots={{
              day: Day,
            }}
            onChange={(value: any, selection) => {
              if (selection !== "finish") return;

              props.onSelectDate(value.valueOf());
              closePopover();
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
};

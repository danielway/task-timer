import { Button, Popover, styled } from "@mui/material";
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
  const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <CurrentDateButton
        variant="contained"
        color="secondary"
        onClick={(event) => setButtonEl(event.currentTarget)}
      >
        {getDateString(props.currentDate)}
        <CalendarIcon />
      </CurrentDateButton>

      {CalendarPopover(
        Boolean(buttonEl),
        buttonEl,
        props.currentDate,
        () => setButtonEl(null),
        props.onSelectDate
      )}
    </>
  );
};

const CalendarPopover = (
  isOpen: boolean,
  buttonEl: HTMLButtonElement | null,
  currentDate: number,
  closePopover: () => void,
  onSelectDate: (date: number) => void
) => {
  const daysWithTasks = useAppSelector(selectDatesWithTasks);

  return (
    <Popover
      open={isOpen}
      anchorEl={buttonEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={dayjs(currentDate)}
          showDaysOutsideCurrentMonth={true}
          slots={{ day: Day }}
          slotProps={{ day: { daysWithTasks } as any }}
          onChange={(value: any, selection) => {
            if (selection !== "finish") return;

            onSelectDate(value.valueOf());
            closePopover();
          }}
        />
      </LocalizationProvider>
    </Popover>
  );
};

const Day = (props: PickersDayProps<Dayjs> & { daysWithTasks?: number[] }) => {
  const { day, daysWithTasks, ...other } = props;

  const hasTasks = daysWithTasks?.includes(day.valueOf()) ?? false;

  return (
    <PickersDay
      {...other}
      day={day}
      sx={{ fontWeight: hasTasks ? "bold" : "normal" }}
    />
  );
};

const getDateString = (dateEpoch: number) => {
  const date = new Date(dateEpoch);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CalendarIcon = styled(CalendarTodayIcon)(() => ({
  fontSize: "1.1rem",
  marginLeft: "10px",
}));

const CurrentDateButton = styled(Button)(() => ({
  marginLeft: "10px",
}));

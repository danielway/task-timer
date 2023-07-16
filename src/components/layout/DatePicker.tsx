import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectDates, selectDay } from "../../app/slice";
import { DatePopover } from "./DatePopover";

export const DatePicker = () => {
  const dispatch = useAppDispatch();

  const dates = useAppSelector(selectDates);
  const previousDate = dates[0];
  const currentDate = dates[1];
  const nextDate = dates[2];

  const dateButton = (date: number) => (
    <Button
      key={date}
      sx={{
        marginLeft: "10px",
        color: "#fff",
      }}
      onClick={() => dispatch(selectDay(date))}
    >
      {new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}
    </Button>
  );

  return (
    <>
      {dateButton(previousDate)}
      <DatePopover
        currentDate={currentDate}
        onSelectDate={(date) => dispatch(selectDay(date))}
      />
      {dateButton(nextDate)}
    </>
  );
};

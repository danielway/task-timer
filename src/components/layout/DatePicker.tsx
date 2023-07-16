import { Button, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectDates, selectDay } from "../../app/slice";
import { DatePopover } from "./DatePopover";
import { useCallback } from "react";

const DateButton = styled(Button)(() => ({
  marginLeft: "10px",
  color: "#fff",
}));

export const DatePicker = () => {
  const dispatch = useAppDispatch();

  const dates = useAppSelector(selectDates);
  const previousDate = dates[0];
  const currentDate = dates[1];
  const nextDate = dates[2];

  const dateSelectionButton = useCallback(
    (date: number) => (
      <DateButton key={date} onClick={() => dispatch(selectDay(date))}>
        {new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}
      </DateButton>
    ),
    [dispatch]
  );

  return (
    <>
      {dateSelectionButton(previousDate)}
      <DatePopover
        currentDate={currentDate}
        onSelectDate={(date) => dispatch(selectDay(date))}
      />
      {dateSelectionButton(nextDate)}
    </>
  );
};

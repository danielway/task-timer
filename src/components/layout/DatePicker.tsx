import { Button, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DatePopover } from "./DatePopover";
import { useCallback } from "react";
import { getSelectedDate, selectDate } from "../../app/slices/appSlice";
import { createDate } from "../../app/slices/dateSlice";
import { createDate as createTimeDate } from "../../app/slices/timeSlice";

const DateButton = styled(Button)(() => ({
  marginLeft: "10px",
  color: "#fff",
}));

export const DatePicker = () => {
  const dispatch = useAppDispatch();

  const selectedDate = useAppSelector(getSelectedDate);
  const previousDate = selectedDate - 86400000;
  const nextDate = selectedDate + 86400000;

  const onSelectDate = useCallback(
    (date: number) => {
      dispatch(createDate({ date }));
      dispatch(createTimeDate({ date }));
      dispatch(selectDate(date));
    },
    [dispatch]
  );

  const dateSelectionButton = useCallback(
    (date: number) => (
      <DateButton key={date} onClick={() => onSelectDate(date)}>
        {new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}
      </DateButton>
    ),
    [onSelectDate]
  );

  return (
    <>
      {dateSelectionButton(previousDate)}
      <DatePopover
        selectedDate={selectedDate}
        onSelectDate={(date) => onSelectDate(date)}
      />
      {dateSelectionButton(nextDate)}
    </>
  );
};

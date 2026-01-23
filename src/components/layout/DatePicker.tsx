import { Button, styled } from '@mui/material';
import { useAppStore, useDateStore, useTimeStore } from '../../store';
import { DatePopover } from './DatePopover';
import { useCallback } from 'react';
import { useTaskContinuation } from '../../app/hooks/useTaskContinuation';

const DateButton = styled(Button)(() => ({
  marginLeft: '10px',
  color: '#fff',
}));

export const DatePicker = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);
  const selectDate = useAppStore((state) => state.selectDate);
  const createDate = useDateStore((state) => state.createDate);
  const createTimeDate = useTimeStore((state) => state.createDate);
  const { carryForwardIncompleteTasks } = useTaskContinuation();

  const previousDate = selectedDate - 86400000;
  const nextDate = selectedDate + 86400000;

  const onSelectDate = useCallback(
    (date: number) => {
      createDate({ date });
      createTimeDate({ date });

      // Carry forward incomplete tasks when navigating to a future date
      if (date > selectedDate) {
        carryForwardIncompleteTasks(date);
      }

      selectDate(date);
    },
    [createDate, createTimeDate, selectDate, selectedDate, carryForwardIncompleteTasks]
  );

  const dateSelectionButton = useCallback(
    (date: number) => (
      <DateButton key={date} onClick={() => onSelectDate(date)}>
        {new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
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

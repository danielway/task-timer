import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getSelectedDate } from '../../app/slices/appSlice';
import { getSelection } from '../../app/slices/editSlice';
import { getSegment, toggleSegment } from '../../app/slices/timeSlice';

interface TimeIncrementProps {
  taskId: number;
  segment: number;
}

export const TimeIncrement = (props: TimeIncrementProps) => {
  const dispatch = useAppDispatch();

  const selectedDate = useAppSelector(getSelectedDate);

  const { logged } = useAppSelector((state) =>
    getSegment(state.time, selectedDate, props.taskId, props.segment)
  );

  const uiSelection = useAppSelector(getSelection);
  const selected =
    uiSelection &&
    uiSelection.taskId === props.taskId &&
    uiSelection.timeSegment === props.segment;

  return (
    <div
      style={{
        border: selected ? '2px dashed #173040' : undefined,
      }}
      className={logged ? 'increment logged' : 'increment'}
      onClick={() =>
        dispatch(
          toggleSegment({
            date: selectedDate,
            taskId: props.taskId,
            segment: props.segment,
          })
        )
      }
    />
  );
};

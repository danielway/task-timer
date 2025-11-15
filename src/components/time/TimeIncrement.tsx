import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getSelectedDate } from '../../app/slices/appSlice';
import { getSelection } from '../../app/slices/editSlice';
import { getSegment, toggleSegment } from '../../app/slices/timeSlice';
import { UI } from '../../app/constants';

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
        border: selected ? UI.SELECTION_BORDER : undefined,
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
      role="button"
      aria-label={`Time segment ${props.segment + 1}, ${logged ? 'logged' : 'not logged'}`}
      aria-pressed={logged}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          dispatch(
            toggleSegment({
              date: selectedDate,
              taskId: props.taskId,
              segment: props.segment,
            })
          );
        }
      }}
    />
  );
};

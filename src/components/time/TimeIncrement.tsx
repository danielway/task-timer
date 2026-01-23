import { memo } from 'react';
import { useAppStore, useTimeStore, getSegment } from '../../store';
import { colors } from '../../theme';

const SELECTION_BORDER_STYLE = '2px dashed';

interface TimeIncrementProps {
  taskId: number;
  segment: number;
}

export const TimeIncrement = memo(function TimeIncrement(
  props: TimeIncrementProps
) {
  const selectedDate = useAppStore((state) => state.selectedDate);

  const timeState = useTimeStore();
  const { logged } = getSegment(
    timeState,
    selectedDate,
    props.taskId,
    props.segment
  );

  const toggleSegment = useTimeStore((state) => state.toggleSegment);

  const uiSelection = useAppStore((state) => state.selection);
  const selected =
    uiSelection &&
    uiSelection.taskId === props.taskId &&
    uiSelection.timeSegment === props.segment;

  return (
    <div
      style={{
        border: selected
          ? `${SELECTION_BORDER_STYLE} ${colors.border.selection}`
          : undefined,
      }}
      className={logged ? 'increment logged' : 'increment'}
      onClick={() =>
        toggleSegment({
          date: selectedDate,
          taskId: props.taskId,
          segment: props.segment,
        })
      }
      role="button"
      aria-label={`Time segment ${props.segment + 1}, ${logged ? 'logged' : 'not logged'}`}
      aria-pressed={logged}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSegment({
            date: selectedDate,
            taskId: props.taskId,
            segment: props.segment,
          });
        }
      }}
    />
  );
});

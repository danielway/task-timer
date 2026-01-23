import { memo } from 'react';
import {
  useAppStore,
  useTimeStore,
  useTaskStore,
  useDateStore,
  getSegment,
  getTask,
  getTaskFirstWorkTime,
} from '../../store';
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
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const recordFirstWorkTime = useDateStore(
    (state) => state.recordFirstWorkTime
  );
  const sortTasksByFirstWork = useDateStore(
    (state) => state.sortTasksByFirstWork
  );

  const taskState = useTaskStore();
  const task = getTask(taskState, props.taskId);
  const dateState = useDateStore();
  const firstWorkTime = getTaskFirstWorkTime(
    dateState,
    selectedDate,
    props.taskId
  );

  const uiSelection = useAppStore((state) => state.selection);
  const selected =
    uiSelection &&
    uiSelection.taskId === props.taskId &&
    uiSelection.timeSegment === props.segment;

  const handleToggle = () => {
    // If toggling from not logged to logged, update task status and record first work time
    if (!logged && task?.status === 'new') {
      setTaskStatus({ id: props.taskId, status: 'in_progress' });
    }

    // Record first work time if not already recorded, then trigger auto-sort
    const shouldSort = !logged && !firstWorkTime;
    if (shouldSort) {
      recordFirstWorkTime({
        date: selectedDate,
        taskId: props.taskId,
        time: Date.now(),
      });
    }

    toggleSegment({
      date: selectedDate,
      taskId: props.taskId,
      segment: props.segment,
    });

    // Sort tasks by first work time after the state updates
    if (shouldSort) {
      // Use setTimeout to ensure the state update is complete before sorting
      setTimeout(() => {
        sortTasksByFirstWork({ date: selectedDate });
      }, 0);
    }
  };

  return (
    <div
      style={{
        border: selected
          ? `${SELECTION_BORDER_STYLE} ${colors.border.selection}`
          : undefined,
      }}
      className={logged ? 'increment logged' : 'increment'}
      onClick={handleToggle}
      role="button"
      aria-label={`Time segment ${props.segment + 1}, ${logged ? 'logged' : 'not logged'}`}
      aria-pressed={logged}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      }}
    />
  );
});

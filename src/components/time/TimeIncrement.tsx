import { START_HOUR } from "../../app/constants";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSelectedDate } from "../../app/slices/appSlice";
import { getSelection } from "../../app/slices/editSlice";
import {
  getTimesForTask,
  recordTime,
  removeTime,
} from "../../app/slices/timeSlice";

interface TimeIncrementProps {
  taskId: number;
  segment: number;
}

export const TimeIncrement = (props: TimeIncrementProps) => {
  const dispatch = useAppDispatch();

  const selectedDate = new Date(useAppSelector(getSelectedDate));

  const start = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    START_HOUR + props.segment / 4,
    (props.segment % 4) * 15
  ).getTime();

  const end = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    START_HOUR + (props.segment + 1) / 4,
    ((props.segment + 1) % 4) * 15
  ).getTime();

  const taskTimes = useAppSelector((state) =>
    getTimesForTask(state.time, selectedDate.getTime(), props.taskId)
  );

  const matchingTimes = taskTimes.filter(
    (time) => time.start < end && (!time.end || time.end! > start)
  );

  const logged = matchingTimes.length > 0;

  const uiSelection = useAppSelector(getSelection);
  const selected =
    uiSelection &&
    uiSelection.taskId === props.taskId &&
    uiSelection.timeSegment === props.segment;

  return (
    <div
      style={{
        border: selected ? "2px dashed #173040" : undefined,
      }}
      className={logged ? "increment logged" : "increment"}
      onClick={() => {
        if (logged) {
          matchingTimes.forEach((time) => {
            dispatch(
              removeTime({
                date: selectedDate.getTime(),
                taskId: props.taskId,
                start: time.start,
              })
            );
          });
        } else {
          dispatch(
            recordTime({
              date: selectedDate.getTime(),
              taskId: props.taskId,
              start,
              end,
            })
          );
        }
      }}
    />
  );
};

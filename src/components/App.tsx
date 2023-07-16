import { useCallback, useEffect } from "react";
import { Layout } from "./layout/Layout";
import { Table } from "./layout/Table";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getSelectedDate } from "../app/slices/appSlice";
import { getTasksForDate } from "../app/slices/dateSlice";
import {
  beginTaskEdit,
  getSelection,
  selectTaskDescription,
  selectTaskTimeSegment,
} from "../app/slices/editSlice";
import { HOUR_COUNT, START_HOUR } from "../app/constants";
import { recordTime } from "../app/slices/timeSlice";

export const App = () => {
  const dispatch = useAppDispatch();

  const uiSelection = useAppSelector(getSelection);
  const selectedDate = useAppSelector(getSelectedDate);
  const tasksForDate = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );

  const getTaskIndex = useCallback(
    (taskId: number) => tasksForDate.findIndex((task) => task === taskId),
    [tasksForDate]
  );

  const handleKeyPress = (event: KeyboardEvent) => {
    // If the user doesn't have a selection, select the first task and time segment
    if (!uiSelection) {
      dispatch(
        selectTaskTimeSegment({
          taskId: tasksForDate[0],
          timeSegment: 0,
        })
      );
      return;
    }

    const taskIndex = getTaskIndex(uiSelection.taskId);

    switch (event.key) {
      case "ArrowUp":
        if (taskIndex > 0) {
          const newTaskId = tasksForDate[taskIndex - 1];
          if (uiSelection.description) {
            dispatch(selectTaskDescription({ taskId: newTaskId }));
          } else {
            dispatch(
              selectTaskTimeSegment({
                taskId: newTaskId,
                timeSegment: uiSelection.timeSegment!,
              })
            );
          }
        }
        break;
      case "ArrowDown":
        if (taskIndex < tasksForDate.length - 1) {
          const newTaskId = tasksForDate[taskIndex + 1];
          if (uiSelection.description) {
            dispatch(selectTaskDescription({ taskId: newTaskId }));
          } else {
            dispatch(
              selectTaskTimeSegment({
                taskId: newTaskId,
                timeSegment: uiSelection.timeSegment!,
              })
            );
          }
        }
        break;
      case "ArrowLeft":
        if (uiSelection.timeSegment) {
          dispatch(
            selectTaskTimeSegment({
              taskId: uiSelection.taskId,
              timeSegment: uiSelection.timeSegment - 1,
            })
          );
        }
        break;
      case "ArrowRight":
        if (uiSelection.description) {
          dispatch(
            selectTaskTimeSegment({
              taskId: uiSelection.taskId,
              timeSegment: 0,
            })
          );
        } else if (uiSelection.timeSegment! < HOUR_COUNT * 4) {
          dispatch(
            selectTaskTimeSegment({
              taskId: uiSelection.taskId,
              timeSegment: uiSelection.timeSegment! + 1,
            })
          );
        }
        break;
      case " ":
      case "Enter":
        if (uiSelection.description) {
          dispatch(beginTaskEdit({ taskId: uiSelection.taskId }));
        } else {
          const timeSegment = uiSelection.timeSegment!;
          const hour = Math.floor(timeSegment / 4) + START_HOUR;
          const minute = (timeSegment % 4) * 15;

          const selectedDateObj = new Date(selectedDate);

          const start = new Date(
            selectedDateObj.getFullYear(),
            selectedDateObj.getMonth(),
            selectedDateObj.getDate(),
            hour,
            minute
          );

          const end = new Date(
            selectedDateObj.getFullYear(),
            selectedDateObj.getMonth(),
            selectedDateObj.getDate(),
            hour,
            minute + 15
          );

          dispatch(
            recordTime({
              date: selectedDate,
              taskId: uiSelection.taskId,
              start: start.getTime(),
              end: end.getTime(),
            })
          );
        }

        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Layout>
      <Table />
    </Layout>
  );
};

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
import { recordTime } from "../app/slices/timeSlice";
import { handleKeyboardInput } from "../app/keyboard";

export const App = () => {
  const dispatch = useAppDispatch();

  const uiSelection = useAppSelector(getSelection);
  const selectedDate = useAppSelector(getSelectedDate);
  const tasksForDate = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      handleKeyboardInput(
        event,
        selectedDate,
        uiSelection,
        tasksForDate,
        (payload) => dispatch(selectTaskDescription(payload)),
        (payload) => dispatch(selectTaskTimeSegment(payload)),
        (payload) => dispatch(beginTaskEdit(payload)),
        (payload) => dispatch(recordTime(payload))
      );
    },
    [dispatch, selectedDate, tasksForDate, uiSelection]
  );

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

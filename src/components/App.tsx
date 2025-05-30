import { useCallback, useEffect } from 'react';
import { Layout } from './layout/Layout';
import { Table } from './layout/Table';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getSelectedDate, selectDate } from '../app/slices/appSlice';
import { getTasksForDate } from '../app/slices/dateSlice';
import {
  beginTaskEdit,
  clearSelection,
  getActiveEditTaskId,
  getSelection,
  selectTaskDescription,
  selectTaskTimeSegment,
} from '../app/slices/editSlice';
import { toggleSegment } from '../app/slices/timeSlice';
import { handleKeyboardInput } from '../app/keyboard';

export const App = () => {
  const dispatch = useAppDispatch();

  const date = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  })();

  useEffect(() => {
    dispatch(selectDate(date));
  }, [date, dispatch]);

  const uiSelection = useAppSelector(getSelection);
  const selectedDate = useAppSelector(getSelectedDate);
  const tasksForDate = useAppSelector((state) =>
    getTasksForDate(state, selectedDate)
  );
  const activeEditTaskId = useAppSelector(getActiveEditTaskId);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // If a task's description is being edited, don't handle keyboard input for selections
      if (activeEditTaskId !== undefined) {
        return;
      }

      handleKeyboardInput(
        event,
        selectedDate,
        uiSelection,
        tasksForDate,
        (payload) => dispatch(selectTaskDescription(payload)),
        (payload) => dispatch(selectTaskTimeSegment(payload)),
        () => dispatch(clearSelection()),
        (payload) => dispatch(beginTaskEdit(payload)),
        (payload) => dispatch(toggleSegment(payload))
      );
    },
    [dispatch, selectedDate, tasksForDate, uiSelection, activeEditTaskId]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Layout>
      <Table />
    </Layout>
  );
};

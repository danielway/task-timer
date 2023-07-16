import { useCallback, useEffect } from "react";
import { Layout } from "./layout/Layout";
import { Table } from "./layout/Table";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectCursor,
  updateRowBeingEdited,
  updateCursor,
  toggleTime,
  selectDates,
  selectTasks,
} from "../app/slice";

export const App = () => {
  const dispatch = useAppDispatch();

  const currentDate = useAppSelector(selectDates)[1];
  const tasks = useAppSelector((state) => selectTasks(state, currentDate));
  const cursor = useAppSelector(selectCursor);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          dispatch(updateCursor({ rowDelta: -1 }));
          break;
        case "ArrowDown":
          dispatch(updateCursor({ rowDelta: 1 }));
          break;
        case "ArrowLeft":
          dispatch(updateCursor({ columnDelta: -1 }));
          break;
        case "ArrowRight":
          dispatch(updateCursor({ columnDelta: 1 }));
          break;
        case " ":
        case "Enter":
          if (!cursor) break;

          const [selectedRow, selectedColumn] = cursor;
          if (selectedColumn === 0) {
            dispatch(updateRowBeingEdited(selectedRow));
          } else {
            const task = tasks[selectedRow];
            dispatch(
              toggleTime({
                date: currentDate,
                taskId: task.id,
                timeSegment: selectedColumn - 1,
              })
            );
          }

          break;
      }
    },
    [dispatch, currentDate, cursor, tasks]
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

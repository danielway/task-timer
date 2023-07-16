import { useCallback, useEffect } from "react";
import { Layout } from "./layout/Layout";
import { Table } from "./layout/Table";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCursor, updateCursor } from "../app/slice";

export const App = () => {
  const dispatch = useAppDispatch();

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
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const cursor = useAppSelector(selectCursor);

  return (
    <Layout>
      <Table />
      DEBUG: {cursor ? `${cursor[0]},${cursor[1]}` : "null"}
    </Layout>
  );
};

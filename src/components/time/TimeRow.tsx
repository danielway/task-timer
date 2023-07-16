import "./TimeRow.css";
import { Time, Task, selectCursor } from "../../app/slice";
import { TimeIncrement } from "./TimeIncrement";
import { TableCell } from "@mui/material";
import { useAppSelector } from "../../app/hooks";

interface TimeRowProps {
  row: number;
  task: Task;
  time: Time[];
  logTime: (taskId: number, timeSeg: number) => any;
  removeTime: (taskId: number, timeSeg: number) => any;
}

export const TimeRowCell = (props: TimeRowProps) => {
  const cursor = useAppSelector(selectCursor);

  const renderSegment = (segment: number) => {
    var selected = false;
    if (cursor) {
      const [selectedRow, selectedColumn] = cursor;

      selected = selectedRow === props.row && selectedColumn === segment + 1;
    }

    return (
      <TimeIncrement
        selected={selected}
        key={segment}
        logged={!!props.time.find((t: Time) => t.timeSegment === segment)}
        taskId={props.task.id}
        timeSegment={segment}
        logTime={props.logTime}
        removeTime={props.removeTime}
      />
    );
  };
  const renderHour = (index: number) => (
    <TableCell key={index} className="cell increment-cell">
      <div className="incrementContainer">
        {[0, 1, 2, 3].map((segment) => renderSegment(index * 4 + segment))}
      </div>
    </TableCell>
  );

  return (
    <>
      {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour, index) =>
        renderHour(index)
      )}
    </>
  );
};

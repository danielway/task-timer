import "./TimeRow.css";
import { Time, Task } from "../../app/slice";
import { TimeIncrement } from "./TimeIncrement";
import { TableCell } from "@mui/material";

interface TimeRowProps {
  task: Task;
  time: Time[];
  logTime: (taskId: number, timeSeg: number) => any;
  removeTime: (taskId: number, timeSeg: number) => any;
}

export const TimeRowCell = (props: TimeRowProps) => {
  const renderSegment = (segment: number) => (
    <TimeIncrement
      key={segment}
      logged={!!props.time.find((t: Time) => t.timeSegment === segment)}
      taskId={props.task.id}
      timeSegment={segment}
      logTime={props.logTime}
      removeTime={props.removeTime}
    />
  );
  const renderHour = (hour: number) => (
    <TableCell key={hour} className="cell increment-cell">
      <div className="incrementContainer">
        {[0, 1, 2, 3].map((segment) => renderSegment(hour * 4 + segment))}
      </div>
    </TableCell>
  );

  return (
    <>{[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => renderHour(hour))}</>
  );
};

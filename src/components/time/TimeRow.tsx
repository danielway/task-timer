import React from "react";
import "./TimeRow.css";
import { Time, Task } from "../../app/slice";
import TimeIncrement from "./TimeIncrement";
import { TableCell } from "@mui/material";

interface TimeRowProps {
  task: Task;
  time: Time[];
  logTime: (taskId: number, timeSeg: number) => any;
  removeTime: (taskId: number, timeSeg: number) => any;
}

class TimeRowCell extends React.Component<TimeRowProps> {
  render() {
    // Render a cell for each hour
    return (
      <>
        {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) =>
          this.renderHour(hour)
        )}
      </>
    );
  }

  /**
   * Renders a particular hour's segments/increments.
   * @param hour The hour, non-indexed.
   */
  renderHour = (hour: number) => (
    <TableCell key={hour} className="cell increment-cell">
      <div className="incrementContainer">
        {[0, 1, 2, 3].map((segment) => this.renderSegment(hour * 4 + segment))}
      </div>
    </TableCell>
  );

  /**
   * Renders a particular time increment/segment.
   * @param segment The segment's absolute index for the day.
   */
  renderSegment = (segment: number) => (
    <TimeIncrement
      key={segment}
      logged={!!this.props.time.find((t: Time) => t.timeSegment === segment)}
      taskId={this.props.task.id}
      timeSegment={segment}
      logTime={this.props.logTime}
      removeTime={this.props.removeTime}
    />
  );
}

export default TimeRowCell;

import React from 'react';
import './TimeCells.css';
import TimeTableCell from './TimeTableCell';
import { Time } from '../../app/redux';
import TimeCell from './TimeCell';

class TimeCellRow extends React.Component<any> {
  render() {
    const cells: JSX.Element[] = [];
    for (let hour = 0; hour < 11; hour++) {
      // Calculate segments for this hour
      const increments = [0, 1, 2, 3].map((segment) => {
        const thisTimeSegment = hour * 4 + segment;
        const matchingTime = this.props.time.find(
          (t: Time) => t.timeSegment === thisTimeSegment
        );
        return (
          <TimeCell
            key={`${hour}-${segment}`}
            logged={!!matchingTime}
            taskId={this.props.task.id}
            timeSegment={thisTimeSegment}
            logTime={this.props.logTime}
            removeTime={this.props.removeTime}
          />
        );
      });

      const renderedIncrements = <>{increments}</>;

      // Render this hour
      cells.push(
        <TimeTableCell key={hour}>
          <div className="incrementContainer">{renderedIncrements}</div>
        </TimeTableCell>
      );
    }
    return <>{cells}</>;
  }
}

export default TimeCellRow;

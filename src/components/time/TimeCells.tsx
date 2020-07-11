import React from 'react';
import './TimeCells.css';
import TimeTableCell from './TimeTableCell';
import { Time } from '../../app/redux';

export const TimeHeaderCells = () => (
  <>
    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => (
      <TimeTableCell key={hour} align="right">
        {hour}:00
      </TimeTableCell>
    ))}
  </>
);

class TimeCell extends React.Component<any> {
  constructor(props: any) {
    super(props);

    this.logTime = this.logTime.bind(this);
    this.removeTime = this.removeTime.bind(this);
  }

  logTime() {
    this.props.logTime(this.props.taskId, this.props.timeSegment);
  }

  removeTime() {
    this.props.removeTime(this.props.taskId, this.props.timeSegment);
  }

  render() {
    if (this.props.logged) {
      return <div className="increment logged" onClick={this.removeTime} />;
    } else {
      return <div className="increment" onClick={this.logTime} />;
    }
  }
}

class TimeBodyCells extends React.Component<any> {
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

export default TimeBodyCells;

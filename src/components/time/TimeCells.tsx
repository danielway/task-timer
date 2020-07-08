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

export const TimeBodyCells = (props: any) => {
  const cells: JSX.Element[] = [];
  for (let hour = 0; hour < 11; hour++) {
    // Calculate segments for this hour
    const increments = [0, 1, 2, 3].map((segment) => {
      const thisTimeSegment = hour * 4 + segment;
      const matchingTime = props.time.find(
        (t: Time) => t.timeSegment === thisTimeSegment
      );
      if (matchingTime >= 0) {
        return (
          <div
            className="increment logged"
            // onClick={props.removeTime(props.task.id, thisTimeSegment)}
          />
        );
      } else {
        return (
          <div
            className="increment"
            // onClick={props.logTime(props.task.id, thisTimeSegment)}
          />
        );
      }
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
};

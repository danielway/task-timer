import React from 'react';
import './TimeCells.css';
import TimeTableCell from './TimeTableCell';

export const TimeHeaderCells = () => (
  <>
    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => (
      <TimeTableCell key={hour} align="right">
        {hour}:00
      </TimeTableCell>
    ))}
  </>
);

const IsLogged = () => Math.random() > 0.8;
const Increment = () => {
  if (IsLogged()) {
    return <div className="increment logged" />;
  } else {
    return <div className="increment" />;
  }
};

export const TimeBodyCells = () => {
  const cells: JSX.Element[] = [];
  for (let i = 0; i < 11; i++) {
    cells.push(
      <TimeTableCell key={i}>
        <div className="incrementContainer">
          <Increment />
          <Increment />
          <Increment />
          <Increment />
        </div>
      </TimeTableCell>
    );
  }
  return <>{cells}</>;
};

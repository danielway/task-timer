import React from 'react';
import TimeTableCell from '../layout/TimeTableCell';

export const TimeHeaderCells = () => (
  <>
    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => (
      <TimeTableCell key={hour} align="right">
        {hour}:00
      </TimeTableCell>
    ))}
  </>
);

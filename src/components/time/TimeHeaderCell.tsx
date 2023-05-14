import React from 'react';
import { TableCell } from '@mui/material';
import './TimeHeaderCell.css';

export const TimeHeaderCells = () => (
  <>
    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => (
      <TableCell key={hour} align="right" className='cell'>
        {hour}:00
      </TableCell>
    ))}
  </>
);

import { TableCell } from '@mui/material';
import React from 'react';

class TimeSummaryCell extends React.Component<any> {
  padTwoDigits = (val: number) => ('00' + val).slice(-2);
  getHours = (tot: number) => this.padTwoDigits(Math.floor(tot / 60));
  getMinutes = (tot: number) => this.padTwoDigits(tot % 60);

  render() {
    const totalMinutes = this.props.timeCount * 15;
    return (
      <TableCell className='header'>
        {this.getHours(totalMinutes)}:{this.getMinutes(totalMinutes)}
      </TableCell>
    );
  }
}

export default TimeSummaryCell;

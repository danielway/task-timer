import React from 'react';
import TableCell from '../layout/TableCell';

class SummaryCell extends React.Component<any> {
  padTwoDigits = (val: number) => ('00' + val).slice(-2);
  getHours = (tot: number) => this.padTwoDigits(Math.floor(tot / 60));
  getMinutes = (tot: number) => this.padTwoDigits(tot % 60);

  render() {
    const totalMinutes = this.props.timeCount * 15;
    return (
      <TableCell>
        {this.getHours(totalMinutes)}:{this.getMinutes(totalMinutes)}
      </TableCell>
    );
  }
}

export default SummaryCell;

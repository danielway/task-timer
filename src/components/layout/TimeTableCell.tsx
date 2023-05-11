import { Theme, createStyles, TableCell } from '@mui/material';
import { withStyles } from '@mui/styles';

const TimeTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontWeight: 'bold',
      textAlign: 'center',
      width: 55,
      fontSize: 13,
      padding: 0,
    },
    body: {
      borderLeft: '1px solid #e0e0e0',
      width: 65,
      padding: 0,
      paddingLeft: 5,
      paddingRight: 5,
    },
  })
)(TableCell);

export default TimeTableCell;

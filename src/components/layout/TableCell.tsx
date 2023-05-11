import {
  Theme,
  createStyles,
  TableCell as MatTableCell,
} from '@mui/material';
import { withStyles } from '@mui/styles';

const TableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    body: {
      fontSize: 14,
    },
  })
)(MatTableCell);

export default TableCell;

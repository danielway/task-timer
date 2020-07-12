import {
  withStyles,
  Theme,
  createStyles,
  TableCell as MatTableCell,
} from '@material-ui/core';

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

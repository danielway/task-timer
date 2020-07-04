import { withStyles, Theme, createStyles, TableCell } from '@material-ui/core';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      fontWeight: 'bold',
      fontSize: 15,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

export default StyledTableCell;

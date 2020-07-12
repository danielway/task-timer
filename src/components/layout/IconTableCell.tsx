import { withStyles, Theme, createStyles, TableCell } from '@material-ui/core';

const IconTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      paddingRight: 0,
      width: 10,
      fontSize: 14,
    },
    body: {
      color: theme.palette.primary.light,
      paddingTop: 10,
      paddingRight: 0,
      width: 10,
      fontSize: 14,
    },
  })
)(TableCell);

export default IconTableCell;

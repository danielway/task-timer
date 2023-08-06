import { TableCell } from "@mui/material";

interface TimeSummaryCellProps {
  totalMinutes: number;
}

export const TimeSummaryCell = (props: TimeSummaryCellProps) => {
  const formattedHours = padTwoDigits(Math.floor(props.totalMinutes / 60));
  const formattedMinutes = padTwoDigits(props.totalMinutes % 60);

  return (
    <TableCell>
      {formattedHours}:{formattedMinutes}
    </TableCell>
  );
};

const padTwoDigits = (val: number) => ("00" + val).slice(-2);

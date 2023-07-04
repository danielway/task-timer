import { TableCell } from "@mui/material";

interface TimeSummaryCellProps {
  timeCount: number;
}

export const TimeSummaryCell = (props: TimeSummaryCellProps) => {
  const padTwoDigits = (val: number) => ("00" + val).slice(-2);
  const getHours = (tot: number) => padTwoDigits(Math.floor(tot / 60));
  const getMinutes = (tot: number) => padTwoDigits(tot % 60);

  const totalMinutes = props.timeCount * 15;
  return (
    <TableCell>
      {getHours(totalMinutes)}:{getMinutes(totalMinutes)}
    </TableCell>
  );
};

import { TableCell } from "@mui/material";

export const TimeHeaderCells = () => (
  <>
    {[7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5].map((hour) => (
      <TableCell key={hour} className="time">
        {hour}:00
      </TableCell>
    ))}
  </>
);

import { TableCell } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";

interface TimeHeaderCellsProps {
  onNewDimensions: (bounds: [number, number]) => void;
}

export const TimeHeaderCells = (props: TimeHeaderCellsProps) => {
  const { onNewDimensions } = props;

  const firstHourRef = useRef<HTMLDivElement>(null);
  const lastHourRef = useRef<HTMLDivElement>(null);

  const handleDimensionUpdate = useCallback(() => {
    const firstHour = firstHourRef.current;
    const lastHour = lastHourRef.current;
    if (firstHour && lastHour) {
      const firstHourBounds = firstHour.getBoundingClientRect();
      const lastHourBounds = lastHour.getBoundingClientRect();
      onNewDimensions([firstHourBounds.left, lastHourBounds.right]);
    }
  }, [onNewDimensions]);

  // React to the window being resized
  useEffect(() => {
    window.addEventListener("resize", handleDimensionUpdate);
    return () => {
      window.removeEventListener("resize", handleDimensionUpdate);
    };
  }, [handleDimensionUpdate]);

  // React to getting refs to the mounted elements
  useEffect(
    () => handleDimensionUpdate(),
    [handleDimensionUpdate, firstHourRef, lastHourRef]
  );

  const hours = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5];
  return (
    <>
      {hours.map((hour, index) => {
        const hourRef =
          index === 0
            ? firstHourRef
            : index === hours.length - 1
            ? lastHourRef
            : null;
        return (
          <TableCell key={hour} className="time" ref={hourRef}>
            {hour}:00
          </TableCell>
        );
      })}
    </>
  );
};

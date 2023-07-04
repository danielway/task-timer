import { TableCell } from "@mui/material";
import { useCallback, useEffect, useRef } from "react";
import { END_HOUR, HOUR_COUNT, START_HOUR } from "../../app/constants";

interface TimeHeaderCellsProps {
  onNewPosition: (left: number, right: number) => void;
}

export const TimeHeaderCells = (props: TimeHeaderCellsProps) => {
  const { onNewPosition } = props;

  const firstHourRef = useRef<HTMLDivElement>(null);
  const lastHourRef = useRef<HTMLDivElement>(null);

  const handleDimensionUpdate = useCallback(() => {
    const firstHour = firstHourRef.current;
    const lastHour = lastHourRef.current;
    if (firstHour && lastHour) {
      const firstHourBounds = firstHour.getBoundingClientRect();
      const lastHourBounds = lastHour.getBoundingClientRect();
      onNewPosition(firstHourBounds.left, lastHourBounds.right);
    }
  }, [onNewPosition]);

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

  // Retain a ref for the first and last hour
  const getCorrespondingRef = (hour: number) => {
    if (hour === START_HOUR) {
      return firstHourRef;
    }

    if (hour === END_HOUR - 13) {
      return lastHourRef;
    }

    return null;
  };

  const hours = Array.from(
    { length: HOUR_COUNT },
    (_, i) => ((i + START_HOUR - 1) % 12) + 1
  );

  return (
    <>
      {hours.map((hour) => {
        const hourRef = getCorrespondingRef(hour);
        return (
          <TableCell key={hour} className="time" ref={hourRef}>
            {hour}:00
          </TableCell>
        );
      })}
    </>
  );
};

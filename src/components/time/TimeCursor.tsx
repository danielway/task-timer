import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useInterval } from "../../app/hooks";
import "./TimeCursor.css";
import { END_HOUR, HOUR_COUNT, START_HOUR } from "../../app/constants";
import { getSelectedDate } from "../../app/slices/appSlice";

interface TimeCursorProps {
  hoursPositionLeft?: number;
  hoursPositionRight?: number;
  hoursHeight?: number;
}

export const TimeCursor = (props: TimeCursorProps) => {
  const { hoursPositionLeft, hoursPositionRight, hoursHeight } = props;

  const selectedDate = useAppSelector(getSelectedDate);

  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<{
    text: string;
    position: number;
  } | null>(null);

  const updateCurrentTime = useCallback(() => {
    if (!hoursPositionLeft || !hoursPositionRight) {
      return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const currentDateSelected = currentDate.getTime() === selectedDate;

    const timeInBounds =
      currentDate.getHours() >= START_HOUR &&
      currentDate.getHours() <= END_HOUR;

    setShowCursor(currentDateSelected && timeInBounds);

    if (!showCursor) {
      return;
    }

    const currentTime = new Date();
    const currentHourDecimal =
      currentTime.getHours() +
      currentTime.getMinutes() / 60 +
      currentTime.getSeconds() / 3600;

    const currentTimeRatio = (currentHourDecimal - START_HOUR) / HOUR_COUNT;

    const hoursWidth = hoursPositionRight - hoursPositionLeft;

    setCurrentTime({
      text: currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      position: hoursPositionLeft + hoursWidth * currentTimeRatio,
    });
  }, [hoursPositionLeft, hoursPositionRight, selectedDate, showCursor]);

  useEffect(() => updateCurrentTime(), [updateCurrentTime]);
  useInterval(() => updateCurrentTime(), 1000);

  if (!showCursor || !currentTime || !hoursHeight) {
    return null;
  }

  return (
    <>
      <div
        className="cursor"
        style={{
          left: currentTime.position,
          height: hoursHeight - 65,
        }}
      />
      <div
        className="cursor-time"
        style={{
          top: hoursHeight - 30,
          left: currentTime.position - 20,
        }}
      >
        {currentTime.text}
      </div>
    </>
  );
};

import { useCallback, useEffect, useState } from "react";
import { useInterval } from "../../app/hooks";
import "./TimeCursor.css";
import { HOUR_COUNT, START_HOUR } from "../../app/constants";

interface TimeCursorProps {
  hoursLeftPosition: number;
  hoursRightPosition: number;
  tableHeight: number;
}

export const TimeCursor = (props: TimeCursorProps) => {
  const { hoursLeftPosition: left, hoursRightPosition: right } = props;
  const [currentTimePosition, setCurrentTimePosition] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("");

  const updateCurrentTime = useCallback(() => {
    const currentTime = new Date();
    setCurrentTime(
      currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    const currentHourDecimal =
      currentTime.getHours() +
      currentTime.getMinutes() / 60 +
      currentTime.getSeconds() / 3600;

    const currentTimeRatio = (currentHourDecimal - START_HOUR) / HOUR_COUNT;

    const dimensionRange = right - left;
    setCurrentTimePosition(left + dimensionRange * currentTimeRatio);
  }, [left, right]);

  useEffect(() => updateCurrentTime(), [updateCurrentTime]);
  useInterval(() => updateCurrentTime(), 1000);

  return (
    <>
      <div
        className="cursor"
        style={{
          left: currentTimePosition,
          height: props.tableHeight - 65,
        }}
      />
      <div
        className="cursor-time"
        style={{
          top: props.tableHeight - 30,
          left: currentTimePosition - 20,
        }}
      >
        {currentTime}
      </div>
    </>
  );
};

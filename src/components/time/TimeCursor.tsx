import { useCallback, useEffect, useState } from "react";
import { useInterval } from "../../app/hooks";

interface TimeCursorProps {
  left: number;
  right: number;
  height: number;
}

export const TimeCursor = (props: TimeCursorProps) => {
  const { left, right } = props;
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

    const startTime = 7;
    const timeRange = 18 - 7;
    const currentTimeRatio = (currentTime.getHours() - startTime) / timeRange;

    const dimensionRange = right - left;
    setCurrentTimePosition(left + dimensionRange * currentTimeRatio);
  }, [left, right]);

  useEffect(() => updateCurrentTime(), [updateCurrentTime]);
  useInterval(() => updateCurrentTime(), 1000);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 30,
          left: currentTimePosition,
          width: "2px",
          height: props.height - 65,
          backgroundColor: "#173041",
          zIndex: 100,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: props.height - 30,
          left: currentTimePosition - 20,
          fontSize: "12px",
        }}
      >
        {currentTime}
      </div>
    </>
  );
};

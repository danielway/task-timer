interface TimeIncrementProps {
  taskId: number;
  timeSegment: number;
  logged: boolean;
  logTime: (taskId: number, timeSegment: number) => void;
  removeTime: (taskId: number, timeSegment: number) => void;
}

export const TimeIncrement = (props: TimeIncrementProps) => {
  if (props.logged) {
    return (
      <div
        className="increment logged"
        onClick={() => props.removeTime(props.taskId, props.timeSegment)}
      />
    );
  } else {
    return (
      <div
        className="increment"
        onClick={() => props.logTime(props.taskId, props.timeSegment)}
      />
    );
  }
};

interface TimeIncrementProps {
  selected: boolean;
  taskId: number;
  timeSegment: number;
  logged: boolean;
  logTime: (taskId: number, timeSegment: number) => void;
  removeTime: (taskId: number, timeSegment: number) => void;
}

export const TimeIncrement = (props: TimeIncrementProps) => {
  const classes = props.logged ? "increment logged" : "increment";

  return (
    <div
      style={{
        border: props.selected ? "2px dashed #173040" : undefined,
      }}
      className={classes}
      onClick={() => {
        if (props.logged) {
          props.removeTime(props.taskId, props.timeSegment);
        } else {
          props.logTime(props.taskId, props.timeSegment);
        }
      }}
    />
  );
};

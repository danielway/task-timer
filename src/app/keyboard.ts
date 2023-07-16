import { HOUR_COUNT, START_HOUR } from "./constants";
import { KeyboardSelection } from "./slices/editSlice";

type taskDescriptionSelector = (payload: { taskId: number }) => void;
type taskTimeSegmentSelector = (payload: {
  taskId: number;
  timeSegment: number;
}) => void;

type taskEditStarter = (payload: { taskId: number }) => void;
type timeRecorder = (payload: {
  date: number;
  taskId: number;
  start: number;
  end: number;
}) => void;

export const handleKeyboardInput = (
  event: KeyboardEvent,
  selectedDate: number,
  uiSelection: KeyboardSelection | undefined,
  tasksForDate: number[],
  selectTaskDescription: taskDescriptionSelector,
  selectTaskTimeSegment: taskTimeSegmentSelector,
  beginTaskEdit: taskEditStarter,
  recordTime: timeRecorder
) => {
  // If the user doesn't have a selection, select the first task and time segment
  if (!uiSelection) {
    selectTaskTimeSegment({
      taskId: tasksForDate[0],
      timeSegment: 0,
    });
    return;
  }

  const taskIndex = tasksForDate.findIndex(
    (taskId) => taskId === uiSelection.taskId
  );

  switch (event.key) {
    case "ArrowUp":
      if (taskIndex > 0) {
        const newTaskId = tasksForDate[taskIndex - 1];
        if (uiSelection.description) {
          selectTaskDescription({ taskId: newTaskId });
        } else {
          selectTaskTimeSegment({
            taskId: newTaskId,
            timeSegment: uiSelection.timeSegment!,
          });
        }
      }
      break;
    case "ArrowDown":
      if (taskIndex < tasksForDate.length - 1) {
        const newTaskId = tasksForDate[taskIndex + 1];
        if (uiSelection.description) {
          selectTaskDescription({ taskId: newTaskId });
        } else {
          selectTaskTimeSegment({
            taskId: newTaskId,
            timeSegment: uiSelection.timeSegment!,
          });
        }
      }
      break;
    case "ArrowLeft":
      if (uiSelection.timeSegment) {
        selectTaskTimeSegment({
          taskId: uiSelection.taskId,
          timeSegment: uiSelection.timeSegment - 1,
        });
      }
      break;
    case "ArrowRight":
      if (uiSelection.description) {
        selectTaskTimeSegment({
          taskId: uiSelection.taskId,
          timeSegment: 0,
        });
      } else if (uiSelection.timeSegment! < HOUR_COUNT * 4) {
        selectTaskTimeSegment({
          taskId: uiSelection.taskId,
          timeSegment: uiSelection.timeSegment! + 1,
        });
      }
      break;
    case " ":
    case "Enter":
      if (uiSelection.description) {
        beginTaskEdit({ taskId: uiSelection.taskId });
      } else {
        const timeSegment = uiSelection.timeSegment!;
        const hour = Math.floor(timeSegment / 4) + START_HOUR;
        const minute = (timeSegment % 4) * 15;

        const selectedDateObj = new Date(selectedDate);

        const start = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          selectedDateObj.getDate(),
          hour,
          minute
        );

        const end = new Date(
          selectedDateObj.getFullYear(),
          selectedDateObj.getMonth(),
          selectedDateObj.getDate(),
          hour,
          minute + 15
        );

        recordTime({
          date: selectedDate,
          taskId: uiSelection.taskId,
          start: start.getTime(),
          end: end.getTime(),
        });
      }

      break;
  }
};

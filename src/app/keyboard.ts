import { HOUR_COUNT } from "./constants";
import { KeyboardSelection } from "./slices/editSlice";

type taskDescriptionSelector = (payload: { taskId: number }) => void;
type taskTimeSegmentSelector = (payload: {
  taskId: number;
  timeSegment: number;
}) => void;
type selectionClearer = () => void;

type taskEditStarter = (payload: { taskId: number }) => void;
type segmentToggler = (payload: {
  date: number;
  taskId: number;
  segment: number;
}) => void;

export const handleKeyboardInput = (
  event: KeyboardEvent,
  selectedDate: number,
  uiSelection: KeyboardSelection | undefined,
  tasksForDate: number[],
  selectTaskDescription: taskDescriptionSelector,
  selectTaskTimeSegment: taskTimeSegmentSelector,
  clearSelection: selectionClearer,
  beginTaskEdit: taskEditStarter,
  toggleSegment: segmentToggler
) => {
  if (event.key === "Escape") {
    clearSelection();
  }

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
      if (uiSelection.timeSegment !== undefined) {
        if (uiSelection.timeSegment === 0) {
          selectTaskDescription({ taskId: uiSelection.taskId });
        } else {
          selectTaskTimeSegment({
            taskId: uiSelection.taskId,
            timeSegment: uiSelection.timeSegment - 1,
          });
        }
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
        clearSelection();
      } else {
        const timeSegment = uiSelection.timeSegment!;
        toggleSegment({
          date: selectedDate,
          taskId: uiSelection.taskId,
          segment: timeSegment,
        });
      }

      break;
  }
};

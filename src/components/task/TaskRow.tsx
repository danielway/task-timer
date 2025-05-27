import { useEffect, useRef, useState } from 'react';
import './TaskRow.css';
import { TableRow, Input, Button, TableCell } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TimeRowCell } from '../time/TimeRow';
import { TimeSummaryCell } from '../time/TimeSummaryCell';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteTask, getTask, updateTask } from '../../app/slices/taskSlice';
import {
  beginTaskEdit,
  endTaskEdit,
  getActiveEditTaskId,
  getSelection,
} from '../../app/slices/editSlice';
import { getSelectedDate } from '../../app/slices/appSlice';
import {
  type TaskTime,
  getTimesForTask,
  removeTime,
} from '../../app/slices/timeSlice';
import {
  removeTaskFromDate,
  swapTasksForDate,
} from '../../app/slices/dateSlice';

interface TaskRowProps {
  taskId: number;
}

export const TaskRow = (props: TaskRowProps) => {
  const dispatch = useAppDispatch();

  const task = useAppSelector((state) => getTask(state.task, props.taskId));

  const [description, setDescription] = useState('');
  useEffect(() => setDescription(task.description), [task.description]);

  const uiSelection = useAppSelector(getSelection);
  const descriptionSelected =
    uiSelection?.taskId === props.taskId && uiSelection?.description;

  const activeEditTaskId = useAppSelector(getActiveEditTaskId);
  const editing = activeEditTaskId === props.taskId;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), [inputRef, editing]);

  const doUpdateTask = () => {
    dispatch(updateTask({ id: props.taskId, description: description }));
    dispatch(endTaskEdit());
  };

  const selectedDate = useAppSelector(getSelectedDate);
  const times = useAppSelector((state) =>
    getTimesForTask(state.time, selectedDate, props.taskId)
  );

  const taskRowTime = () => {
    const totalMinutes = times.reduce(
      (acc, cur) => acc + getDurationMinutes(cur),
      0
    );

    return (
      <>
        <TimeRowCell taskId={props.taskId} />
        <TimeSummaryCell totalMinutes={totalMinutes} />
      </>
    );
  };

  const getDurationMinutes = (time: TaskTime) => {
    const end = time.end ?? new Date().getTime();
    return end / 1000 / 60 - time.start / 1000 / 60;
  };

  const handleDragStart = (event: React.DragEvent<HTMLTableRowElement>) => {
    event.dataTransfer.setData('text', props.taskId.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLTableRowElement>) => {
    const otherTaskId = parseInt(
      event.dataTransfer.getData('text/plain').toString()
    );

    if (otherTaskId === props.taskId) {
      return;
    }

    dispatch(
      swapTasksForDate({
        date: selectedDate,
        firstTaskId: otherTaskId,
        secondTaskId: props.taskId,
      })
    );
  };

  const renderViewRow = () => (
    <TableRow
      className="taskRow cell"
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <TableCell className="icon">
        <HighlightOffIcon
          onClick={() => {
            dispatch(
              removeTaskFromDate({ date: selectedDate, taskId: props.taskId })
            );
            dispatch(deleteTask({ id: props.taskId }));
            times.forEach((time) =>
              dispatch(
                removeTime({
                  date: selectedDate,
                  taskId: props.taskId,
                  start: time.start,
                })
              )
            );
          }}
          className="taskDelete"
          fontSize="small"
        />
      </TableCell>
      <TableCell
        sx={{
          fontWeight: descriptionSelected ? 'bold' : undefined,
          textDecoration: descriptionSelected ? 'underline' : undefined,
        }}
        onClick={() => {
          dispatch(beginTaskEdit({ taskId: props.taskId }));
        }}
        component="th"
        scope="row"
        className="taskName"
      >
        {task.description}
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  const renderEditRow = () => (
    <TableRow>
      <TableCell className="icon" />
      <TableCell component="th" scope="row" className="cell">
        <Input
          inputRef={inputRef}
          style={{ fontSize: 13 }}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onKeyDown={(event) => {
            if (!editing) {
              return;
            }

            if (event.key === 'Enter') {
              doUpdateTask();
            } else if (event.key === 'Escape') {
              dispatch(endTaskEdit());
              setDescription(task.description);
            }
          }}
        />
        <Button
          color="secondary"
          size="small"
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={doUpdateTask}
        >
          Update Task
        </Button>
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  return editing ? renderEditRow() : renderViewRow();
};

import { useEffect, useRef, useState } from 'react';
import './TaskRow.css';
import {
  TableRow,
  Input,
  Button,
  TableCell,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TimeRowCell } from '../time/TimeRow';
import { TimeSummaryCell } from '../time/TimeSummaryCell';
import { TimerButton } from '../time/TimerButton';
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
import { removeTaskFromDate } from '../../app/slices/dateSlice';
import { DEFAULT_TASK_TYPES, getTaskType } from '../../types/taskTypes';
import { MAX_TASK_DESCRIPTION_LENGTH } from '../../app/constants';

interface TaskRowProps {
  taskId: number;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
}

export const TaskRow = (props: TaskRowProps) => {
  const dispatch = useAppDispatch();

  const task = useAppSelector((state) => getTask(state.task, props.taskId));

  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState(task?.type || 'task');
  useEffect(() => setDescription(task?.description || ''), [task?.description]);
  useEffect(() => setTaskType(task?.type || 'task'), [task?.type]);

  const uiSelection = useAppSelector(getSelection);
  const descriptionSelected =
    uiSelection?.taskId === props.taskId && uiSelection?.description;

  const activeEditTaskId = useAppSelector(getActiveEditTaskId);
  const editing = activeEditTaskId === props.taskId;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), [inputRef, editing]);

  const selectedDate = useAppSelector(getSelectedDate);
  const times = useAppSelector((state) =>
    getTimesForTask(state, selectedDate, props.taskId)
  );

  const doUpdateTask = () => {
    const trimmedDescription = description.trim();

    // Validate description is not empty
    if (!trimmedDescription) {
      // Don't update if description is empty, just cancel edit
      dispatch(endTaskEdit());
      setDescription(task?.description || '');
      return;
    }

    // Validate description length
    if (trimmedDescription.length > MAX_TASK_DESCRIPTION_LENGTH) {
      console.warn(
        `Task description too long (max ${MAX_TASK_DESCRIPTION_LENGTH} characters)`
      );
      return;
    }

    dispatch(
      updateTask({
        id: props.taskId,
        description: trimmedDescription,
        type: taskType,
      })
    );
    dispatch(endTaskEdit());
  };

  const doDeleteTask = () => {
    dispatch(removeTaskFromDate({ date: selectedDate, taskId: props.taskId }));
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
  };

  // Handle missing task gracefully - if task doesn't exist, don't render anything
  if (!task) {
    return null;
  }

  const currentTaskType = getTaskType(task.type || 'task');

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

  const renderViewRow = () => (
    <TableRow
      className={`taskRow cell${props.dragging ? ' dragging' : ''}`}
      draggable="true"
      onDragStart={(event) => {
        // Custom drag image logic for white background with cursor offset
        const target = event.currentTarget;
        const clone = target.cloneNode(true) as HTMLElement;
        clone.style.background = '#fff';
        clone.style.color = getComputedStyle(target).color;
        clone.style.position = 'absolute';
        clone.style.top = '-9999px';
        clone.style.left = '-9999px';
        clone.style.width = `${target.offsetWidth}px`;
        clone.style.height = `${target.offsetHeight}px`;
        document.body.appendChild(clone);

        // Calculate offset between mouse and row top-left
        const rect = target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        event.dataTransfer.setDragImage(clone, offsetX, offsetY);

        setTimeout(() => document.body.removeChild(clone), 0);
        if (props.onDragStart) props.onDragStart();
      }}
      onDragEnd={props.onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        props.onDragOver?.call(e);
      }}
      onDrop={props.onDrop}
    >
      <TableCell className="icon">
        <HighlightOffIcon
          onClick={doDeleteTask}
          className="taskDelete"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.25rem' },
          }}
          role="button"
          aria-label={`Delete task: ${task.description}`}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              doDeleteTask();
            }
          }}
        />
      </TableCell>
      <TableCell
        sx={{
          fontWeight: descriptionSelected ? 'bold' : undefined,
          textDecoration: descriptionSelected ? 'underline' : undefined,
          backgroundColor: currentTaskType.backgroundColor,
          borderLeft: `4px solid ${currentTaskType.color}`,
        }}
        onClick={() => {
          dispatch(beginTaskEdit({ taskId: props.taskId }));
        }}
        component="th"
        scope="row"
        className="taskName"
      >
        <Chip
          label={currentTaskType.name}
          size="small"
          sx={{
            backgroundColor: currentTaskType.color,
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.7rem' },
            height: { xs: 24, sm: 20 },
            marginRight: 1,
          }}
        />
        {task.description}
      </TableCell>
      <TableCell className="timerButton">
        <TimerButton taskId={props.taskId} date={selectedDate} />
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  const renderEditRow = () => (
    <TableRow>
      <TableCell className="icon" />
      <TableCell component="th" scope="row" className="cell">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1 },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Select
            value={taskType}
            onChange={(event) => setTaskType(event.target.value)}
            size="small"
            sx={{
              fontSize: { xs: 14, sm: 13 },
              minWidth: { xs: '100%', sm: 100 },
            }}
          >
            {DEFAULT_TASK_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
          <Input
            inputRef={inputRef}
            sx={{
              fontSize: { xs: 14, sm: 13 },
              flex: { sm: 1 },
            }}
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
                setTaskType(task.type || 'task');
              }
            }}
          />
          <Button
            color="secondary"
            size="small"
            variant="contained"
            sx={{
              minHeight: { xs: 44, sm: 'auto' },
            }}
            onClick={doUpdateTask}
          >
            Update Task
          </Button>
        </Box>
      </TableCell>
      <TableCell className="timerButton">
        <TimerButton taskId={props.taskId} date={selectedDate} />
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );

  return editing ? renderEditRow() : renderViewRow();
};

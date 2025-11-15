import { useRef, useState } from 'react';
import {
  TableRow,
  Input,
  Button,
  TableCell,
  Select,
  MenuItem,
} from '@mui/material';
import { TimeSummaryCell } from '../time/TimeSummaryCell';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createTask, getNextTaskId } from '../../app/slices/taskSlice';
import { type TaskTime, getTimesForDate } from '../../app/slices/timeSlice';
import { getSelectedDate } from '../../app/slices/appSlice';
import { addTaskToDate } from '../../app/slices/dateSlice';
import { DEFAULT_TASK_TYPES } from '../../types/taskTypes';
import { MAX_TASK_DESCRIPTION_LENGTH, UI } from '../../app/constants';

export const TaskCreationRow = () => {
  const dispatch = useAppDispatch();

  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('task');

  const selectedDate = useAppSelector(getSelectedDate);
  const timesForDate = useAppSelector((state) =>
    getTimesForDate(state.time, selectedDate)
  );

  const nextId = useAppSelector((state) => getNextTaskId(state.task));

  const addTask = () => {
    const trimmedDescription = description.trim();

    // Validate description is not empty
    if (!trimmedDescription) {
      return;
    }

    // Validate description length
    if (trimmedDescription.length > MAX_TASK_DESCRIPTION_LENGTH) {
      console.warn(`Task description too long (max ${MAX_TASK_DESCRIPTION_LENGTH} characters)`);
      return;
    }

    dispatch(createTask({ id: nextId, description: trimmedDescription, type: taskType }));
    dispatch(addTaskToDate({ date: selectedDate, taskId: nextId }));
    setDescription('');
    setTaskType('task');
  };

  const totalMinutes = timesForDate.reduce(
    (acc, cur) => acc + getDurationMinutes(cur),
    0
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TableRow>
      <TableCell className="icon" />
      <TableCell>
        <Select
          value={taskType}
          onChange={(event) => setTaskType(event.target.value)}
          size="small"
          style={{
            fontSize: UI.SELECT.FONT_SIZE,
            marginRight: UI.SELECT.MARGIN_RIGHT,
            minWidth: UI.SELECT.MIN_WIDTH
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
          style={{ fontSize: UI.INPUT.FONT_SIZE }}
          placeholder="Task name/description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addTask();
            } else if (event.key === 'Escape') {
              setDescription('');
              inputRef.current?.blur();
            }
          }}
        />
        <Button
          color="secondary"
          size="small"
          variant="contained"
          style={{ marginLeft: UI.BUTTON.MARGIN_LEFT }}
          onClick={addTask}
        >
          Add Task
        </Button>
      </TableCell>
      <TableCell colSpan={11}></TableCell>
      <TimeSummaryCell totalMinutes={totalMinutes} />
    </TableRow>
  );
};

const getDurationMinutes = (time: TaskTime) => {
  const end = time.end ?? new Date().getTime();
  return end / 1000 / 60 - time.start / 1000 / 60;
};

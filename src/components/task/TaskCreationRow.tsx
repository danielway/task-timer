import { useRef, useState } from 'react';
import {
  TableRow,
  Input,
  Button,
  TableCell,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { TimeSummaryCell } from '../time/TimeSummaryCell';
import {
  useAppStore,
  useTaskStore,
  useDateStore,
  useTimeStore,
  getTimesForDate,
  getNextTaskId,
  type TaskTime,
} from '../../store';
import { DEFAULT_TASK_TYPES } from '../../types/taskTypes';
import { MAX_TASK_DESCRIPTION_LENGTH } from '../../app/constants';

export const TaskCreationRow = () => {
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('task');

  const selectedDate = useAppStore((state) => state.selectedDate);
  const timeState = useTimeStore();
  const timesForDate = getTimesForDate(timeState, selectedDate);

  const taskState = useTaskStore();
  const nextId = getNextTaskId(taskState);

  const createTask = useTaskStore((state) => state.createTask);
  const addTaskToDate = useDateStore((state) => state.addTaskToDate);

  const addTask = () => {
    const trimmedDescription = description.trim();

    // Validate description is not empty
    if (!trimmedDescription) {
      return;
    }

    // Validate description length
    if (trimmedDescription.length > MAX_TASK_DESCRIPTION_LENGTH) {
      console.warn(
        `Task description too long (max ${MAX_TASK_DESCRIPTION_LENGTH} characters)`
      );
      return;
    }

    createTask({
      id: nextId,
      description: trimmedDescription,
      type: taskType,
    });
    addTaskToDate({ date: selectedDate, taskId: nextId });
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
              fontSize: { xs: 14, sm: 12 },
              minWidth: { xs: '100%', sm: 90 },
              '& .MuiSelect-select': {
                py: 0.5,
              },
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
            sx={{
              minHeight: { xs: 44, sm: 'auto' },
            }}
            onClick={addTask}
          >
            Add Task
          </Button>
        </Box>
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

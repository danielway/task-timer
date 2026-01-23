import { useRef, useState } from 'react';
import {
  TableRow,
  Input,
  Button,
  TableCell,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  useAppStore,
  useTaskStore,
  useDateStore,
  useProjectStore,
  getNextTaskId,
  getActiveProjects,
} from '../../store';
import { DEFAULT_TASK_TYPES } from '../../types/taskTypes';
import { MAX_TASK_DESCRIPTION_LENGTH, HOUR_COUNT } from '../../app/constants';

export const TaskCreationRow = () => {
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('task');
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const [addToBacklog, setAddToBacklog] = useState(false);

  const selectedDate = useAppStore((state) => state.selectedDate);

  const taskState = useTaskStore();
  const nextId = getNextTaskId(taskState);

  const projectState = useProjectStore();
  const activeProjects = getActiveProjects(projectState);

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
      projectId,
    });

    // Only add to current date if not adding to backlog
    if (!addToBacklog) {
      addTaskToDate({ date: selectedDate, taskId: nextId });
    }

    setDescription('');
    setTaskType('task');
    setProjectId(undefined);
    setAddToBacklog(false);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  // Total columns: icon (1) + task (1) + hours (HOUR_COUNT) + total (1)
  // We span all columns except the icon cell
  const colSpan = 1 + HOUR_COUNT + 1;

  return (
    <TableRow>
      <TableCell className="icon" />
      <TableCell colSpan={colSpan}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 1 },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'flex-start',
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
          <Select
            value={projectId !== undefined ? String(projectId) : ''}
            onChange={(event) =>
              setProjectId(
                event.target.value === ''
                  ? undefined
                  : Number(event.target.value)
              )
            }
            displayEmpty
            size="small"
            sx={{
              fontSize: { xs: 14, sm: 12 },
              minWidth: { xs: '100%', sm: 100 },
              '& .MuiSelect-select': {
                py: 0.5,
              },
            }}
          >
            <MenuItem value="">
              <em>No Project</em>
            </MenuItem>
            {activeProjects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: project.color,
                    }}
                  />
                  {project.name}
                </Box>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={addToBacklog}
                onChange={(e) => setAddToBacklog(e.target.checked)}
                size="small"
              />
            }
            label="Backlog"
            sx={{
              margin: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: 12, sm: 11 },
              },
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
            {addToBacklog ? 'Add to Backlog' : 'Add Task'}
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  );
};

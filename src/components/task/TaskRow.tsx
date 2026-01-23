import { memo, useEffect, useRef, useState } from 'react';
import './TaskRow.css';
import {
  TableRow,
  Input,
  TableCell,
  Chip,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TimeRowCell } from '../time/TimeRow';
import { TimeSummaryCell } from '../time/TimeSummaryCell';
import {
  useAppStore,
  useTaskStore,
  useDateStore,
  useTimeStore,
  getTask,
  getTimesForTask,
  type TaskTime,
  type TaskStatus,
} from '../../store';
import { DEFAULT_TASK_TYPES, getTaskType } from '../../types/taskTypes';
import { MAX_TASK_DESCRIPTION_LENGTH } from '../../app/constants';
import { setDragImage } from '../../app/dragImage';
import { TaskStatusChip } from './TaskStatusChip';
import { ProjectSelector } from '../project/ProjectSelector';

interface TaskRowProps {
  taskId: number;
  continued?: boolean;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  onDrop?: () => void;
}

export const TaskRow = memo(function TaskRow(props: TaskRowProps) {
  // Get state from stores
  const taskState = useTaskStore();
  const task = getTask(taskState, props.taskId);

  const [description, setDescription] = useState('');
  useEffect(() => setDescription(task?.description || ''), [task?.description]);

  const [typeMenuAnchor, setTypeMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const typeMenuOpen = Boolean(typeMenuAnchor);

  const uiSelection = useAppStore((state) => state.selection);
  const descriptionSelected =
    uiSelection?.taskId === props.taskId && uiSelection?.description;

  const activeEditTaskId = useAppStore((state) => state.activeEditTaskId);
  const editing = activeEditTaskId === props.taskId;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const selectedDate = useAppStore((state) => state.selectedDate);
  const timeState = useTimeStore();
  const times = getTimesForTask(timeState, selectedDate, props.taskId);

  // Get actions from stores
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const assignProject = useTaskStore((state) => state.assignProject);
  const endTaskEdit = useAppStore((state) => state.endTaskEdit);
  const beginTaskEdit = useAppStore((state) => state.beginTaskEdit);
  const removeTaskFromDate = useDateStore((state) => state.removeTaskFromDate);
  const removeTime = useTimeStore((state) => state.removeTime);

  const handleStatusChange = (newStatus: TaskStatus) => {
    setTaskStatus({ id: props.taskId, status: newStatus });
  };

  const handleProjectChange = (projectId?: number) => {
    assignProject({ taskId: props.taskId, projectId });
  };

  const isCompleted = task?.status === 'done';

  const saveDescription = () => {
    const trimmedDescription = description.trim();

    // Validate description is not empty
    if (!trimmedDescription) {
      // Revert to original if empty
      setDescription(task?.description || '');
      endTaskEdit();
      return;
    }

    // Validate description length
    if (trimmedDescription.length > MAX_TASK_DESCRIPTION_LENGTH) {
      console.warn(
        `Task description too long (max ${MAX_TASK_DESCRIPTION_LENGTH} characters)`
      );
      return;
    }

    if (trimmedDescription !== task?.description) {
      updateTask({
        id: props.taskId,
        description: trimmedDescription,
        type: task?.type || 'task',
      });
    }
    endTaskEdit();
  };

  const handleTypeSelect = (typeId: string) => {
    setTypeMenuAnchor(null);
    if (typeId !== task?.type) {
      updateTask({
        id: props.taskId,
        description: task?.description || '',
        type: typeId,
      });
    }
  };

  const doDeleteTask = () => {
    removeTaskFromDate({ date: selectedDate, taskId: props.taskId });
    deleteTask({ id: props.taskId });
    times.forEach((time) =>
      removeTime({
        date: selectedDate,
        taskId: props.taskId,
        start: time.start,
      })
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

  return (
    <TableRow
      className={`taskRow cell${props.dragging ? ' dragging' : ''}${editing ? ' editing' : ''}${isCompleted ? ' completed' : ''}`}
      draggable={!editing}
      onDragStart={(event) => {
        setDragImage(event);
        if (props.onDragStart) props.onDragStart();
      }}
      onDragEnd={props.onDragEnd}
      onDragOver={(e) => {
        e.preventDefault();
        props.onDragOver?.call(e);
      }}
      onDrop={props.onDrop}
      sx={isCompleted ? { opacity: 0.6 } : undefined}
    >
      <TableCell
        className="icon"
        sx={{
          backgroundColor: currentTaskType.backgroundColor,
          borderLeft: `4px solid ${currentTaskType.color}`,
        }}
      >
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
          textDecoration:
            descriptionSelected && !editing ? 'underline' : undefined,
          backgroundColor: currentTaskType.backgroundColor,
        }}
        component="th"
        scope="row"
        className="taskName"
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            label={currentTaskType.name}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setTypeMenuAnchor(e.currentTarget);
            }}
            sx={{
              backgroundColor: currentTaskType.color,
              color: '#fff',
              fontWeight: 'bold',
              fontSize: { xs: '0.75rem', sm: '0.7rem' },
              height: { xs: 24, sm: 20 },
              marginRight: 0.5,
              minWidth: 65,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: currentTaskType.color,
                filter: 'brightness(0.9)',
              },
            }}
          />
          <Box sx={{ marginRight: 0.5 }}>
            <TaskStatusChip
              status={task.status}
              onChange={handleStatusChange}
            />
          </Box>
          <Box sx={{ marginRight: 1 }}>
            <ProjectSelector
              projectId={task.projectId}
              onChange={handleProjectChange}
              showLabel={!!task.projectId}
            />
          </Box>
          {props.continued && (
            <Chip
              label="Continued"
              size="small"
              sx={{
                backgroundColor: '#fff3e0',
                color: '#e65100',
                fontSize: { xs: '0.6rem', sm: '0.55rem' },
                height: { xs: 18, sm: 16 },
                marginRight: 1,
                '& .MuiChip-label': {
                  padding: '0 4px',
                },
              }}
            />
          )}
          <Menu
            anchorEl={typeMenuAnchor}
            open={typeMenuOpen}
            onClose={() => setTypeMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            {DEFAULT_TASK_TYPES.map((type) => (
              <MenuItem
                key={type.id}
                selected={type.id === task.type}
                onClick={() => handleTypeSelect(type.id)}
                sx={{ fontSize: 13 }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: type.color,
                    marginRight: 1,
                  }}
                />
                {type.name}
              </MenuItem>
            ))}
          </Menu>
          {editing ? (
            <Input
              inputRef={inputRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={saveDescription}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveDescription();
                } else if (e.key === 'Escape') {
                  setDescription(task.description);
                  endTaskEdit();
                }
              }}
              disableUnderline
              sx={{
                fontSize: 'inherit',
                flex: 1,
                '& input': {
                  padding: 0,
                },
              }}
            />
          ) : (
            <span
              className="taskDescription"
              onClick={() => beginTaskEdit({ taskId: props.taskId })}
            >
              {task.description}
            </span>
          )}
        </Box>
      </TableCell>
      {taskRowTime()}
    </TableRow>
  );
});

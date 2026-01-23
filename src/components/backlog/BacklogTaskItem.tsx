import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTaskStore, useAppStore, useDateStore, getTask } from '../../store';
import { TaskStatusChip } from '../task/TaskStatusChip';
import { ProjectChip } from '../project/ProjectChip';
import { getTaskType } from '../../types/taskTypes';
import type { TaskStatus } from '../../store/taskStore';

interface BacklogTaskItemProps {
  taskId: number;
}

export function BacklogTaskItem({ taskId }: BacklogTaskItemProps) {
  const taskState = useTaskStore();
  const task = getTask(taskState, taskId);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);

  const selectedDate = useAppStore((state) => state.selectedDate);
  const addTaskToDate = useDateStore((state) => state.addTaskToDate);

  const handleAddToToday = () => {
    addTaskToDate({ date: selectedDate, taskId });
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setTaskStatus({ id: taskId, status: newStatus });
  };

  if (!task) return null;

  const taskType = getTaskType(task.type);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor:
          task.status === 'done' ? 'action.hover' : 'background.paper',
        opacity: task.status === 'done' ? 0.6 : 1,
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Tooltip title="Add to selected date">
        <IconButton size="small" onClick={handleAddToToday}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box
        sx={{
          width: 4,
          height: 24,
          backgroundColor: taskType.color,
          borderRadius: 1,
          flexShrink: 0,
        }}
      />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
          }}
        >
          {task.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <TaskStatusChip status={task.status} onChange={handleStatusChange} />
          {task.projectId && <ProjectChip projectId={task.projectId} />}
        </Box>
      </Box>
    </Box>
  );
}

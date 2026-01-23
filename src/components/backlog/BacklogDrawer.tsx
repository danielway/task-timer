import { useState, useMemo } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import {
  useAppStore,
  useTaskStore,
  useDateStore,
  getTask,
  type TaskStore,
  type DateStore,
} from '../../store';
import { BacklogHeader } from './BacklogHeader';
import { BacklogTaskItem } from './BacklogTaskItem';

// Get all tasks that are not assigned to any date
function getBacklogTaskIds(
  taskState: TaskStore,
  dateState: DateStore
): number[] {
  // Get all task IDs that are assigned to any date
  const assignedTaskIds = new Set<number>();
  dateState.dateTasks.forEach((dt) => {
    dt.tasks.forEach((taskId) => assignedTaskIds.add(taskId));
  });

  // Return tasks that are not assigned to any date
  return taskState.tasks
    .filter((task) => !assignedTaskIds.has(task.id))
    .map((task) => task.id);
}

export function BacklogDrawer() {
  const [searchQuery, setSearchQuery] = useState('');

  const backlogOpen = useAppStore((state) => state.backlogOpen);
  const backlogExpanded = useAppStore((state) => state.backlogExpanded);
  const showCompleted = useAppStore((state) => state.showCompleted);
  const projectFilter = useAppStore((state) => state.projectFilter);

  const taskState = useTaskStore();
  const dateState = useDateStore();

  const backlogTaskIds = useMemo(() => {
    return getBacklogTaskIds(taskState, dateState);
  }, [taskState, dateState]);

  // Filter backlog tasks
  const filteredTaskIds = useMemo(() => {
    return backlogTaskIds.filter((taskId) => {
      const task = getTask(taskState, taskId);
      if (!task) return false;

      // Filter by completion status
      if (!showCompleted && task.status === 'done') return false;

      // Filter by project
      if (projectFilter !== undefined && task.projectId !== projectFilter)
        return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!task.description.toLowerCase().includes(query)) return false;
      }

      return true;
    });
  }, [backlogTaskIds, taskState, showCompleted, projectFilter, searchQuery]);

  const drawerWidth = backlogExpanded ? '80%' : 320;

  return (
    <Drawer
      anchor="left"
      open={backlogOpen}
      variant="persistent"
      sx={{
        width: backlogOpen ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64, // Below the app bar
          height: 'calc(100% - 64px)',
          transition: 'width 0.2s ease-in-out',
        },
      }}
    >
      <BacklogHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {filteredTaskIds.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {backlogTaskIds.length === 0
                ? 'No tasks in backlog'
                : 'No tasks match your filters'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create tasks without assigning a date to add them here
            </Typography>
          </Box>
        ) : (
          filteredTaskIds.map((taskId) => (
            <BacklogTaskItem key={taskId} taskId={taskId} />
          ))
        )}
      </Box>
    </Drawer>
  );
}

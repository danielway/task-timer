import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import { DatePicker } from './DatePicker';
import { ProjectManager } from '../project/ProjectManager';
import {
  useAppStore,
  useProjectStore,
  getActiveProjects,
} from '../../store';

export const Header = () => {
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);

  const backlogOpen = useAppStore((state) => state.backlogOpen);
  const toggleBacklog = useAppStore((state) => state.toggleBacklog);
  const projectFilter = useAppStore((state) => state.projectFilter);
  const setProjectFilter = useAppStore((state) => state.setProjectFilter);

  const projectState = useProjectStore();
  const activeProjects = getActiveProjects(projectState);

  return (
    <>
      <AppBar position="static">
        <Toolbar
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            py: { xs: 1, sm: 0 },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={backlogOpen ? 'Hide Backlog' : 'Show Backlog'}>
              <IconButton
                color="inherit"
                onClick={toggleBacklog}
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Task Timer
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Select
              value={projectFilter !== undefined ? String(projectFilter) : ''}
              onChange={(e) =>
                setProjectFilter(
                  e.target.value === '' ? undefined : Number(e.target.value)
                )
              }
              displayEmpty
              size="small"
              sx={{
                minWidth: 120,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: 13,
                '& .MuiSelect-icon': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
              }}
            >
              <MenuItem value="">All Projects</MenuItem>
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
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Manage Projects">
              <IconButton
                color="inherit"
                onClick={() => setProjectManagerOpen(true)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <DatePicker />
          </Box>
        </Toolbar>
      </AppBar>
      <ProjectManager
        open={projectManagerOpen}
        onClose={() => setProjectManagerOpen(false)}
      />
    </>
  );
};

import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppStore } from '../../store';
import { ProjectManager } from '../project/ProjectManager';

interface BacklogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BacklogHeader({
  searchQuery,
  onSearchChange,
}: BacklogHeaderProps) {
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const toggleBacklog = useAppStore((state) => state.toggleBacklog);

  return (
    <>
      <Box
        sx={{
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Backlog
          </Typography>
          <Tooltip title="Close">
            <IconButton size="small" onClick={toggleBacklog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          size="small"
          fullWidth
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ '& .MuiInputBase-input': { fontSize: 13 } }}
        />
        <Button
          size="small"
          startIcon={<SettingsIcon />}
          onClick={() => setProjectManagerOpen(true)}
          sx={{ mt: 1, fontSize: 12 }}
        >
          Manage Projects
        </Button>
      </Box>
      <ProjectManager
        open={projectManagerOpen}
        onClose={() => setProjectManagerOpen(false)}
      />
    </>
  );
}

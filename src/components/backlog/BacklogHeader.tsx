import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import { useAppStore } from '../../store';

interface BacklogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BacklogHeader({
  searchQuery,
  onSearchChange,
}: BacklogHeaderProps) {
  const backlogExpanded = useAppStore((state) => state.backlogExpanded);
  const setBacklogExpanded = useAppStore((state) => state.setBacklogExpanded);
  const toggleBacklog = useAppStore((state) => state.toggleBacklog);

  return (
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
        <Box>
          <Tooltip title={backlogExpanded ? 'Collapse' : 'Expand'}>
            <IconButton
              size="small"
              onClick={() => setBacklogExpanded(!backlogExpanded)}
            >
              {backlogExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton size="small" onClick={toggleBacklog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <TextField
        size="small"
        fullWidth
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ '& .MuiInputBase-input': { fontSize: 13 } }}
      />
    </Box>
  );
}

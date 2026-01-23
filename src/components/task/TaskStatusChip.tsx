import { useState } from 'react';
import { Chip, Menu, MenuItem, Box } from '@mui/material';
import { type TaskStatus } from '../../store/taskStore';

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
}

const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  new: {
    label: 'New',
    color: '#757575',
    backgroundColor: '#f5f5f5',
  },
  in_progress: {
    label: 'In Progress',
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  done: {
    label: 'Done',
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
};

const STATUS_ORDER: TaskStatus[] = ['new', 'in_progress', 'done'];

interface TaskStatusChipProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
  size?: 'small' | 'medium';
}

export function TaskStatusChip({
  status,
  onChange,
  size = 'small',
}: TaskStatusChipProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const config = STATUS_CONFIG[status];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleSelect = (newStatus: TaskStatus) => {
    setMenuAnchor(null);
    if (newStatus !== status) {
      onChange(newStatus);
    }
  };

  return (
    <>
      <Chip
        label={config.label}
        size={size}
        onClick={handleClick}
        sx={{
          backgroundColor: config.backgroundColor,
          color: config.color,
          fontWeight: 500,
          fontSize: { xs: '0.65rem', sm: '0.6rem' },
          height: { xs: 20, sm: 18 },
          cursor: 'pointer',
          border: `1px solid ${config.color}`,
          '& .MuiChip-label': {
            padding: '0 6px',
          },
          '&:hover': {
            backgroundColor: config.backgroundColor,
            filter: 'brightness(0.95)',
          },
        }}
      />
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {STATUS_ORDER.map((statusOption) => {
          const optionConfig = STATUS_CONFIG[statusOption];
          return (
            <MenuItem
              key={statusOption}
              selected={statusOption === status}
              onClick={() => handleSelect(statusOption)}
              sx={{ fontSize: 12 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: optionConfig.color,
                  marginRight: 1,
                }}
              />
              {optionConfig.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export { STATUS_CONFIG };

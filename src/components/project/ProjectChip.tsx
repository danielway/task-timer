import { Chip } from '@mui/material';
import { useProjectStore, getProject } from '../../store';

interface ProjectChipProps {
  projectId: number;
  size?: 'small' | 'medium';
  onClick?: () => void;
}

export function ProjectChip({ projectId, size = 'small', onClick }: ProjectChipProps) {
  const projectState = useProjectStore();
  const project = getProject(projectState, projectId);

  if (!project) {
    return null;
  }

  return (
    <Chip
      label={project.name}
      size={size}
      onClick={onClick}
      sx={{
        backgroundColor: project.color,
        color: '#fff',
        fontWeight: 500,
        fontSize: { xs: '0.65rem', sm: '0.6rem' },
        height: { xs: 18, sm: 16 },
        cursor: onClick ? 'pointer' : 'default',
        '& .MuiChip-label': {
          padding: '0 6px',
        },
        '&:hover': onClick
          ? {
              backgroundColor: project.color,
              filter: 'brightness(0.9)',
            }
          : undefined,
      }}
    />
  );
}

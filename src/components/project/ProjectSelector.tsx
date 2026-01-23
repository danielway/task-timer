import { useState } from 'react';
import { Menu, MenuItem, Box, IconButton, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useProjectStore, getActiveProjects, getProject } from '../../store';
import { ProjectChip } from './ProjectChip';

interface ProjectSelectorProps {
  projectId?: number;
  onChange: (projectId?: number) => void;
  showLabel?: boolean;
}

export function ProjectSelector({
  projectId,
  onChange,
  showLabel = true,
}: ProjectSelectorProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const projectState = useProjectStore();
  const activeProjects = getActiveProjects(projectState);
  const currentProject = projectId ? getProject(projectState, projectId) : null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleSelect = (newProjectId?: number) => {
    setMenuAnchor(null);
    onChange(newProjectId);
  };

  return (
    <>
      {currentProject && showLabel ? (
        <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
          <ProjectChip projectId={currentProject.id} />
        </Box>
      ) : (
        <Tooltip title="Assign project">
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              padding: 0.25,
              color: currentProject ? currentProject.color : 'action.disabled',
            }}
          >
            <FolderIcon sx={{ fontSize: { xs: 18, sm: 16 } }} />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuItem onClick={() => handleSelect(undefined)} sx={{ fontSize: 12 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#bdbdbd',
              marginRight: 1,
            }}
          />
          No Project
        </MenuItem>
        {activeProjects.map((project) => (
          <MenuItem
            key={project.id}
            selected={project.id === projectId}
            onClick={() => handleSelect(project.id)}
            sx={{ fontSize: 12 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: project.color,
                marginRight: 1,
              }}
            />
            {project.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

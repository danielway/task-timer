import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useProjectStore,
  getActiveProjects,
  getArchivedProjects,
} from '../../store';

interface ProjectManagerProps {
  open: boolean;
  onClose: () => void;
}

const PROJECT_COLORS = [
  '#757575', // Gray
  '#1976d2', // Blue
  '#2e7d32', // Green
  '#ed6c02', // Orange
  '#9c27b0', // Purple
  '#d32f2f', // Red
  '#0288d1', // Light Blue
  '#00796b', // Teal
];

export function ProjectManager({ open, onClose }: ProjectManagerProps) {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PROJECT_COLORS[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const projectState = useProjectStore();
  const activeProjects = getActiveProjects(projectState);
  const archivedProjects = getArchivedProjects(projectState);

  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const archiveProject = useProjectStore((state) => state.archiveProject);
  const unarchiveProject = useProjectStore((state) => state.unarchiveProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const handleCreate = () => {
    if (newProjectName.trim()) {
      createProject({
        name: newProjectName.trim(),
        color: newProjectColor,
      });
      setNewProjectName('');
      setNewProjectColor(PROJECT_COLORS[0]);
    }
  };

  const handleStartEdit = (id: number, name: string, color: string) => {
    setEditingId(id);
    setEditingName(name);
    setEditingColor(color);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      updateProject({
        id: editingId,
        name: editingName.trim(),
        color: editingColor,
      });
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingColor('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Projects</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Create New Project
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              sx={{ flex: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {PROJECT_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setNewProjectColor(color)}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border:
                      newProjectColor === color
                        ? '2px solid #000'
                        : '2px solid transparent',
                  }}
                />
              ))}
            </Box>
            <Button variant="contained" size="small" onClick={handleCreate}>
              Add
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Active Projects
        </Typography>
        <List dense>
          {activeProjects.map((project) => (
            <ListItem key={project.id}>
              {editingId === project.id ? (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <TextField
                    size="small"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    sx={{ flex: 1 }}
                    autoFocus
                  />
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {PROJECT_COLORS.map((color) => (
                      <Box
                        key={color}
                        onClick={() => setEditingColor(color)}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: color,
                          cursor: 'pointer',
                          border:
                            editingColor === color
                              ? '2px solid #000'
                              : '2px solid transparent',
                        }}
                      />
                    ))}
                  </Box>
                  <Button size="small" onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button size="small" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: project.color,
                      marginRight: 1,
                    }}
                  />
                  <ListItemText primary={project.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleStartEdit(project.id, project.name, project.color)
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    {project.id !== 1 && (
                      <IconButton
                        size="small"
                        onClick={() => archiveProject({ id: project.id })}
                      >
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>

        {archivedProjects.length > 0 && (
          <>
            <Button
              size="small"
              onClick={() => setShowArchived(!showArchived)}
              sx={{ mt: 1 }}
            >
              {showArchived ? 'Hide' : 'Show'} Archived (
              {archivedProjects.length})
            </Button>
            {showArchived && (
              <List dense>
                {archivedProjects.map((project) => (
                  <ListItem key={project.id} sx={{ opacity: 0.6 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: project.color,
                        marginRight: 1,
                      }}
                    />
                    <ListItemText primary={project.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => unarchiveProject({ id: project.id })}
                      >
                        <UnarchiveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteProject({ id: project.id })}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

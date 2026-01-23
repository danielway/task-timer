import { create } from 'zustand';
import {
  getPersistedSlice,
  registerStoreGetter,
  triggerPersist,
} from './middleware/persist';

export interface Project {
  id: number;
  name: string;
  color: string;
  description?: string;
  createdAt: number;
  archived: boolean;
}

export interface ProjectState {
  nextProjectId: number;
  projects: Project[];
}

interface ProjectActions {
  createProject: (payload: {
    name: string;
    color: string;
    description?: string;
  }) => number;
  updateProject: (payload: {
    id: number;
    name?: string;
    color?: string;
    description?: string;
  }) => void;
  archiveProject: (payload: { id: number }) => void;
  unarchiveProject: (payload: { id: number }) => void;
  deleteProject: (payload: { id: number }) => void;
}

export type ProjectStore = ProjectState & ProjectActions;

const getInitialState = (): ProjectState => {
  const persisted = getPersistedSlice('project');
  if (persisted) {
    return persisted;
  }

  return {
    nextProjectId: 2,
    projects: [
      {
        id: 1,
        name: 'Inbox',
        color: '#757575',
        createdAt: Date.now(),
        archived: false,
      },
    ],
  };
};

export const useProjectStore = create<ProjectStore>()((set, get) => {
  // Register this store's getter for persistence
  registerStoreGetter('project', () => get());

  return {
    ...getInitialState(),

    createProject: (payload) => {
      const state = get();
      const newId = state.nextProjectId;

      set({
        projects: [
          ...state.projects,
          {
            id: newId,
            name: payload.name,
            color: payload.color,
            description: payload.description,
            createdAt: Date.now(),
            archived: false,
          },
        ],
        nextProjectId: newId + 1,
      });
      triggerPersist();
      return newId;
    },

    updateProject: (payload) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === payload.id
            ? {
                ...project,
                ...(payload.name !== undefined ? { name: payload.name } : {}),
                ...(payload.color !== undefined
                  ? { color: payload.color }
                  : {}),
                ...(payload.description !== undefined
                  ? { description: payload.description }
                  : {}),
              }
            : project
        ),
      }));
      triggerPersist();
    },

    archiveProject: (payload) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === payload.id ? { ...project, archived: true } : project
        ),
      }));
      triggerPersist();
    },

    unarchiveProject: (payload) => {
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === payload.id ? { ...project, archived: false } : project
        ),
      }));
      triggerPersist();
    },

    deleteProject: (payload) => {
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== payload.id),
      }));
      triggerPersist();
    },
  };
});

// Selectors
export const getProject = (state: ProjectStore, id: number) =>
  state.projects.find((project) => project.id === id);

export const getActiveProjects = (state: ProjectStore) =>
  state.projects.filter((project) => !project.archived);

export const getArchivedProjects = (state: ProjectStore) =>
  state.projects.filter((project) => project.archived);

export interface TaskType {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
}

export const DEFAULT_TASK_TYPES: TaskType[] = [
  {
    id: 'task',
    name: 'Task',
    color: '#1976d2', // Blue
    backgroundColor: '#e3f2fd',
  },
  {
    id: 'meeting',
    name: 'Meeting',
    color: '#ed6c02', // Orange
    backgroundColor: '#fff4e5',
  },
  {
    id: 'review',
    name: 'Review',
    color: '#9c27b0', // Purple
    backgroundColor: '#f3e5f5',
  },
];

export const getTaskType = (id: string): TaskType => {
  return DEFAULT_TASK_TYPES.find((type) => type.id === id) || DEFAULT_TASK_TYPES[0];
};

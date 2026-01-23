import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskContinuation } from './useTaskContinuation';
import { useTaskStore } from '../../store/taskStore';
import { useDateStore } from '../../store/dateStore';
import { mockToday, mockTomorrow } from '../../test-utils/test-utils';

describe('useTaskContinuation', () => {
  beforeEach(() => {
    // Reset stores
    useTaskStore.setState({
      nextTaskId: 1,
      tasks: [],
    });
    useDateStore.setState({
      dateTasks: [{ date: mockToday, tasks: [], taskFirstWorkTime: {} }],
    });
  });

  it('should provide carryForwardIncompleteTasks function', () => {
    const { result } = renderHook(() => useTaskContinuation());

    expect(result.current.carryForwardIncompleteTasks).toBeDefined();
    expect(typeof result.current.carryForwardIncompleteTasks).toBe('function');
  });

  it('should carry forward in_progress tasks to new date', () => {
    // Set up a task that is in progress
    useTaskStore.setState({
      nextTaskId: 2,
      tasks: [
        {
          id: 1,
          description: 'In Progress Task',
          type: 'task',
          status: 'in_progress',
          createdAt: Date.now(),
        },
      ],
    });
    useDateStore.setState({
      dateTasks: [{ date: mockToday, tasks: [1], taskFirstWorkTime: {} }],
    });

    const { result } = renderHook(() => useTaskContinuation());

    act(() => {
      result.current.carryForwardIncompleteTasks(mockTomorrow);
    });

    const dateState = useDateStore.getState();
    const tomorrowTasks = dateState.dateTasks.find(
      (dt) => dt.date === mockTomorrow
    );

    expect(tomorrowTasks?.tasks).toContain(1);
  });

  it('should not carry forward done tasks', () => {
    useTaskStore.setState({
      nextTaskId: 2,
      tasks: [
        {
          id: 1,
          description: 'Done Task',
          type: 'task',
          status: 'done',
          createdAt: Date.now(),
        },
      ],
    });
    useDateStore.setState({
      dateTasks: [{ date: mockToday, tasks: [1], taskFirstWorkTime: {} }],
    });

    const { result } = renderHook(() => useTaskContinuation());

    act(() => {
      result.current.carryForwardIncompleteTasks(mockTomorrow);
    });

    const dateState = useDateStore.getState();
    const tomorrowTasks = dateState.dateTasks.find(
      (dt) => dt.date === mockTomorrow
    );

    // Done task should not be carried forward
    expect(tomorrowTasks?.tasks || []).not.toContain(1);
  });
});

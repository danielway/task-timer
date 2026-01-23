import { useCallback, useEffect } from 'react';
import {
  useAppStore,
  useEditStore,
  useDateStore,
  useTimeStore,
  getTasksForDate,
} from '../../store';
import { handleKeyboardInput } from '../keyboard';

/**
 * Hook that handles keyboard navigation for task selection and editing.
 * Manages arrow key navigation, Enter/Space for actions, and Escape to clear selection.
 */
export const useKeyboardNavigation = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);

  const dateState = useDateStore();
  const tasksForDate = getTasksForDate(dateState, selectedDate);

  const uiSelection = useEditStore((state) => state.selection);
  const activeEditTaskId = useEditStore((state) => state.activeEditTaskId);
  const selectTaskDescription = useEditStore(
    (state) => state.selectTaskDescription
  );
  const selectTaskTimeSegment = useEditStore(
    (state) => state.selectTaskTimeSegment
  );
  const clearSelection = useEditStore((state) => state.clearSelection);
  const beginTaskEdit = useEditStore((state) => state.beginTaskEdit);

  const toggleSegment = useTimeStore((state) => state.toggleSegment);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      // If a task's description is being edited, don't handle keyboard input for selections
      if (activeEditTaskId !== undefined) {
        return;
      }

      handleKeyboardInput(
        event,
        selectedDate,
        uiSelection,
        tasksForDate,
        selectTaskDescription,
        selectTaskTimeSegment,
        clearSelection,
        beginTaskEdit,
        toggleSegment
      );
    },
    [
      selectedDate,
      tasksForDate,
      uiSelection,
      activeEditTaskId,
      selectTaskDescription,
      selectTaskTimeSegment,
      clearSelection,
      beginTaskEdit,
      toggleSegment,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};

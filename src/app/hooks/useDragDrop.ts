import { useState, useCallback } from 'react';

// Helper function to reorder items in an array
const reorderArray = <T>(
  items: T[],
  draggedItem: T,
  targetIndex: number
): T[] => {
  const fromIndex = items.indexOf(draggedItem);
  if (fromIndex === -1) return items;

  const temp = [...items];
  temp.splice(fromIndex, 1);
  temp.splice(targetIndex, 0, draggedItem);
  return temp;
};

interface DragDropState<T> {
  draggedItem: T | null;
  hoveredIndex: number | null;
}

interface DragDropHandlers<T> {
  handleDragStart: (item: T) => void;
  handleDragEnd: () => void;
  handleDragOver: (index: number) => void;
  handleDrop: () => void;
}

interface UseDragDropOptions<T> {
  items: T[];
  onReorder: (reorderedItems: T[]) => void;
}

interface UseDragDropReturn<T> extends DragDropState<T>, DragDropHandlers<T> {
  displayItems: T[];
  isDragging: (item: T) => boolean;
}

export const useDragDrop = <T>({
  items,
  onReorder,
}: UseDragDropOptions<T>): UseDragDropReturn<T> => {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute reordered list for visual preview during drag
  const displayItems =
    draggedItem !== null && hoveredIndex !== null
      ? reorderArray(items, draggedItem, hoveredIndex)
      : items;

  const handleDragStart = useCallback((item: T) => {
    setDraggedItem(item);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setHoveredIndex(null);
  }, []);

  const handleDragOver = useCallback((index: number) => {
    setHoveredIndex(index);
  }, []);

  const handleDrop = useCallback(() => {
    if (draggedItem !== null && hoveredIndex !== null) {
      const reordered = reorderArray(items, draggedItem, hoveredIndex);
      onReorder(reordered);
    }
    setDraggedItem(null);
    setHoveredIndex(null);
  }, [draggedItem, hoveredIndex, items, onReorder]);

  const isDragging = useCallback(
    (item: T) => draggedItem === item,
    [draggedItem]
  );

  return {
    draggedItem,
    hoveredIndex,
    displayItems,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};

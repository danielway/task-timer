/**
 * Creates a custom drag image with white background and proper cursor offset.
 * Cleans up the clone element after the drag operation starts.
 */
export const setDragImage = (
  event: React.DragEvent<HTMLTableRowElement>
): void => {
  const target = event.currentTarget;
  const clone = target.cloneNode(true) as HTMLElement;
  clone.style.background = '#fff';
  clone.style.color = getComputedStyle(target).color;
  clone.style.position = 'absolute';
  clone.style.top = '-9999px';
  clone.style.left = '-9999px';
  clone.style.width = `${target.offsetWidth}px`;
  clone.style.height = `${target.offsetHeight}px`;
  document.body.appendChild(clone);

  // Calculate offset between mouse and row top-left
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  event.dataTransfer.setDragImage(clone, offsetX, offsetY);

  setTimeout(() => document.body.removeChild(clone), 0);
};

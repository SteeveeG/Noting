import { useRef, useCallback, useState } from 'react';

export const useDraggable = ({ 
  onStop, 
  disabled = false,
  handle = null,
  bounds = null
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    
    // Check if we clicked on the drag handle
    if (handle) {
      const dragHandle = e.target.closest(handle);
      if (!dragHandle) return;
    }

    e.preventDefault();
    e.stopPropagation();

    const rect = dragRef.current.getBoundingClientRect();
    const parentRect = dragRef.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
    
    dragStateRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left - parentRect.left,
      initialY: rect.top - parentRect.top
    };

    setIsDragging(true);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [disabled, handle]);

  const handleMouseMove = useCallback((e) => {
    if (!dragStateRef.current.isDragging) return;

    const deltaX = e.clientX - dragStateRef.current.startX;
    const deltaY = e.clientY - dragStateRef.current.startY;
    
    let newX = dragStateRef.current.initialX + deltaX;
    let newY = dragStateRef.current.initialY + deltaY;

    // Apply bounds if parent bounds is specified
    if (bounds === 'parent' && dragRef.current?.offsetParent) {
      const parent = dragRef.current.offsetParent;
      const parentWidth = parent.offsetWidth;
      const parentHeight = parent.offsetHeight;
      const elementWidth = dragRef.current.offsetWidth;
      const elementHeight = dragRef.current.offsetHeight;

      newX = Math.max(0, Math.min(newX, parentWidth - elementWidth));
      newY = Math.max(0, Math.min(newY, parentHeight - elementHeight));
    }

    setPosition({ x: newX, y: newY });
    
    if (dragRef.current) {
      dragRef.current.style.left = `${newX}px`;
      dragRef.current.style.top = `${newY}px`;
    }
  }, [bounds]);

  const handleMouseUp = useCallback((e) => {
    if (!dragStateRef.current.isDragging) return;

    dragStateRef.current.isDragging = false;
    setIsDragging(false);

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    if (onStop) {
      onStop(e, position);
    }
  }, [handleMouseMove, onStop, position]);

  return {
    dragRef,
    isDragging,
    handleMouseDown,
    position
  };
};

export default useDraggable;
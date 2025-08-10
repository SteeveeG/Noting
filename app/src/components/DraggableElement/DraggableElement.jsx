import React, { useEffect, useRef, useState } from 'react';

const DraggableElement = ({ 
  children, 
  defaultPosition = { x: 0, y: 0 },
  onStop,
  handle = ".drag-handle",
  disabled = false,
  bounds = "parent",
  className = ""
}) => {
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });

  // Set position from props - always update when position changes
  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.style.position = 'absolute';
      dragRef.current.style.left = `${defaultPosition.x}px`;
      dragRef.current.style.top = `${defaultPosition.y}px`;
    }
  }, [defaultPosition.x, defaultPosition.y]);

  const handleMouseDown = (e) => {
    if (disabled) return;
    
    // Check if we clicked on a drag handle
    const dragHandle = e.target.closest(handle);
    if (!dragHandle) return;

    // Don't drag if we're clicking on a resize handle
    const resizeHandle = e.target.closest('.resizeHandle');
    if (resizeHandle) return;

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
    
    const handleMouseMove = (e) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaX = e.clientX - dragStateRef.current.startX;
      const deltaY = e.clientY - dragStateRef.current.startY;
      
      let newX = dragStateRef.current.initialX + deltaX;
      let newY = dragStateRef.current.initialY + deltaY;

      // Apply bounds
      if (bounds === 'parent' && dragRef.current?.offsetParent) {
        const parent = dragRef.current.offsetParent;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const elementWidth = dragRef.current.offsetWidth;
        const elementHeight = dragRef.current.offsetHeight;

        newX = Math.max(0, Math.min(newX, parentWidth - elementWidth));
        newY = Math.max(0, Math.min(newY, parentHeight - elementHeight));
      }
      
      // Update position during drag
      if (dragRef.current) {
        dragRef.current.style.left = `${newX}px`;
        dragRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = (e) => {
      if (!dragStateRef.current.isDragging) return;

      dragStateRef.current.isDragging = false;
      setIsDragging(false);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      if (onStop) {
        const rect = dragRef.current.getBoundingClientRect();
        const parentRect = dragRef.current.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
        onStop(e, { 
          x: rect.left - parentRect.left, 
          y: rect.top - parentRect.top 
        });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  // Add event listener to the element
  useEffect(() => {
    const element = dragRef.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
      };
    }
  });

  return (
    <div
      ref={dragRef}
      className={`${className} ${isDragging ? 'react-draggable-dragging' : ''}`}
      style={{
        position: 'absolute',
        left: `${defaultPosition.x}px`,
        top: `${defaultPosition.y}px`,
        zIndex: isDragging ? 100 : 10
      }}
    >
      {children}
    </div>
  );
};

export default DraggableElement;
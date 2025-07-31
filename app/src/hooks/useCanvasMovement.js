import { useCallback } from 'react';
import { CANVAS_CONFIG } from '../constants/canvasConstants';

export const useCanvasMovement = ({
  texts,
  setTexts,
  dragState,
  setDragState,
  zoom,
  setPanOffset,
  containerRef,
  screenToCanvas,
  constrainToBounds
}) => {
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    if (dragState.isPanning) {
      const deltaX = e.clientX - dragState.lastPanPoint.x;
      const deltaY = e.clientY - dragState.lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragState(prev => ({
        ...prev,
        lastPanPoint: { x: e.clientX, y: e.clientY }
      }));
      return;
    }

    const canvasPos = screenToCanvas(e.clientX, e.clientY);

    if (dragState.isDragging && dragState.dragIndex !== null) {
      const element = texts[dragState.dragIndex];
      const newX = canvasPos.x - dragState.dragOffset.x;
      const newY = canvasPos.y - dragState.dragOffset.y;
      
      const constrained = constrainToBounds(newX, newY, element.width, element.height);
      
      const updatedTexts = [...texts];
      updatedTexts[dragState.dragIndex] = {
        ...element,
        x: constrained.x,
        y: constrained.y,
      };
      setTexts(updatedTexts);
    } else if (dragState.isResizing && dragState.dragIndex !== null) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const deltaX = (mouseX - dragState.dragOffset.x) / zoom;
      const deltaY = (mouseY - dragState.dragOffset.y) / zoom;
      
      const element = texts[dragState.dragIndex];
      let newX = element.x;
      let newY = element.y;
      let newWidth = element.width;
      let newHeight = element.height;
      
      const handle = dragState.resizeHandle;
      
      if (handle.includes('e')) newWidth += deltaX;
      if (handle.includes('w')) { newX += deltaX; newWidth -= deltaX; }
      if (handle.includes('s')) newHeight += deltaY;
      if (handle.includes('n')) { newY += deltaY; newHeight -= deltaY; }
      
      const constrained = constrainToBounds(newX, newY, newWidth, newHeight);
      
      const updatedTexts = [...texts];
      updatedTexts[dragState.dragIndex] = {
        ...element,
        ...constrained
      };
      setTexts(updatedTexts);
      
      setDragState(prev => ({
        ...prev,
        dragOffset: { x: mouseX, y: mouseY }
      }));
    }
  }, [dragState, texts, setTexts, screenToCanvas, constrainToBounds, zoom, setPanOffset, setDragState, containerRef]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      dragIndex: null,
      resizeHandle: null,
      dragOffset: { x: 0, y: 0 },
      isPanning: false,
      lastPanPoint: { x: 0, y: 0 }
    });
  }, [setDragState]);

  const handleMouseLeave = useCallback(() => {
    setDragState({
      isDragging: false,
      isResizing: false,
      dragIndex: null,
      resizeHandle: null,
      dragOffset: { x: 0, y: 0 },
      isPanning: false,
      lastPanPoint: { x: 0, y: 0 }
    });
  }, [setDragState]);

  return {
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  };
};
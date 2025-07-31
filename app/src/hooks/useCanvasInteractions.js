import { useCallback } from 'react';
import { CANVAS_CONFIG, TEXT_DEFAULTS } from '../constants/canvasConstants';

export const useCanvasInteractions = ({
  texts,
  setTexts,
  selectedId,
  setSelectedId,
  dragState,
  setDragState,
  zoom,
  containerRef,
  screenToCanvas,
  canvasToScreen,
  constrainToBounds
}) => {
  const handleElementClick = useCallback((e, elementId) => {
    e.stopPropagation();
    setSelectedId(elementId);
  }, [setSelectedId]);

  const handleElementMouseDown = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const element = texts[index];
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const getResizeHandle = (element, mouseX, mouseY) => {
      const screenPos = canvasToScreen(element.x, element.y);
      const width = element.width * zoom;
      const height = element.height * zoom;
      
      const tolerance = CANVAS_CONFIG.RESIZE_TOLERANCE;
      
      const left = screenPos.x;
      const right = screenPos.x + width;
      const top = screenPos.y;
      const bottom = screenPos.y + height;
      
      if (mouseX >= right - tolerance && mouseX <= right + tolerance) {
        if (mouseY >= bottom - tolerance && mouseY <= bottom + tolerance) return 'se';
        if (mouseY >= top - tolerance && mouseY <= top + tolerance) return 'ne';
        if (mouseY >= top && mouseY <= bottom) return 'e';
      }
      
      if (mouseX >= left - tolerance && mouseX <= left + tolerance) {
        if (mouseY >= bottom - tolerance && mouseY <= bottom + tolerance) return 'sw';
        if (mouseY >= top - tolerance && mouseY <= top + tolerance) return 'nw';
        if (mouseY >= top && mouseY <= bottom) return 'w';
      }
      
      if (mouseY >= bottom - tolerance && mouseY <= bottom + tolerance && mouseX >= left && mouseX <= right) return 's';
      if (mouseY >= top - tolerance && mouseY <= top + tolerance && mouseX >= left && mouseX <= right) return 'n';
      
      return null;
    };
    
    const resizeHandle = selectedId === element.id ? getResizeHandle(element, mouseX, mouseY) : null;
    
    if (resizeHandle) {
      setDragState(prev => ({
        ...prev,
        isResizing: true,
        dragIndex: index,
        resizeHandle,
        dragOffset: { x: mouseX, y: mouseY }
      }));
    } else {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setDragState(prev => ({
        ...prev,
        isDragging: true,
        dragIndex: index,
        dragOffset: {
          x: canvasPos.x - element.x,
          y: canvasPos.y - element.y
        }
      }));
    }
    
    setSelectedId(element.id);
  }, [texts, screenToCanvas, selectedId, canvasToScreen, zoom, setDragState, setSelectedId, containerRef]);

  const handleDoubleClick = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    let clickedOnElement = false;
    for (const element of texts) {
      const screenPos = canvasToScreen(element.x, element.y);
      const width = element.width * zoom;
      const height = element.height * zoom;
      
      if (mouseX >= screenPos.x && mouseX <= screenPos.x + width &&
          mouseY >= screenPos.y && mouseY <= screenPos.y + height) {
        clickedOnElement = true;
        break;
      }
    }
    
    if (!clickedOnElement) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      const newId = Math.max(...texts.map(t => t.id), 0) + 1;
      const constrained = constrainToBounds(canvasPos.x, canvasPos.y, TEXT_DEFAULTS.WIDTH, TEXT_DEFAULTS.HEIGHT);
      
      const newText = {
        id: newId,
        content: TEXT_DEFAULTS.CONTENT,
        x: constrained.x,
        y: constrained.y,
        width: TEXT_DEFAULTS.WIDTH,
        height: TEXT_DEFAULTS.HEIGHT
      };
      
      setTexts(prev => [...prev, newText]);
      setSelectedId(newId);
    }
  }, [screenToCanvas, setTexts, texts, canvasToScreen, zoom, constrainToBounds, containerRef, setSelectedId]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setDragState(prev => ({
        ...prev,
        isPanning: true,
        lastPanPoint: { x: e.clientX, y: e.clientY }
      }));
      return;
    }

    setSelectedId(null);
  }, [setDragState, setSelectedId]);

  return {
    handleElementClick,
    handleElementMouseDown,
    handleDoubleClick,
    handleMouseDown
  };
};
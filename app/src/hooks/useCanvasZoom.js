import { useCallback } from 'react';
import { CANVAS_CONFIG } from '../constants/canvasConstants';

export const useCanvasZoom = ({
  zoom,
  setZoom,
  setPanOffset,
  containerRef,
  screenToCanvas,
  texts,
  minZoom = CANVAS_CONFIG.MIN_ZOOM,
  maxZoom = CANVAS_CONFIG.MAX_ZOOM
}) => {
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * scaleFactor));
      
      if (newZoom !== zoom) {
        const zoomPoint = screenToCanvas(e.clientX, e.clientY);
        
        setPanOffset(prev => ({
          x: mouseX - zoomPoint.x * newZoom,
          y: mouseY - zoomPoint.y * newZoom
        }));
        
        setZoom(newZoom);
      }
    } else {
      setPanOffset(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, [zoom, minZoom, maxZoom, screenToCanvas, setZoom, setPanOffset, containerRef]);

  const zoomToFit = useCallback(() => {
    if (texts.length === 0) return;
    
    const padding = CANVAS_CONFIG.PADDING;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    texts.forEach(text => {
      minX = Math.min(minX, text.x);
      minY = Math.min(minY, text.y);
      maxX = Math.max(maxX, text.x + text.width);
      maxY = Math.max(maxY, text.y + text.height);
    });
    
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, maxZoom);
    
    setZoom(newZoom);
    setPanOffset({
      x: (containerWidth - contentWidth * newZoom) / 2 - (minX - padding) * newZoom,
      y: (containerHeight - contentHeight * newZoom) / 2 - (minY - padding) * newZoom
    });
  }, [texts, maxZoom, setZoom, setPanOffset, containerRef]);

  const resetView = useCallback(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, [setZoom, setPanOffset]);

  return {
    handleWheel,
    zoomToFit,
    resetView
  };
};
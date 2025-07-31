import React, { useRef, useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { TextContext } from '../../Pages/home/home.jsx';
import styles from './Canvas.module.css';
import { CANVAS_CONFIG } from '../../constants/canvasConstants';
import { useCanvasInteractions } from '../../hooks/useCanvasInteractions';
import { useCanvasMovement } from '../../hooks/useCanvasMovement';
import { useCanvasZoom } from '../../hooks/useCanvasZoom';
import CanvasElement from './CanvasElement';

const Canvas = ({ 
  showGrid = true,
  gridSize = CANVAS_CONFIG.GRID_SIZE,
  minZoom = CANVAS_CONFIG.MIN_ZOOM,
  maxZoom = CANVAS_CONFIG.MAX_ZOOM,
  className,
  style
}) => {
  const { texts, setTexts } = useContext(TextContext);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    isResizing: false,
    dragIndex: null,
    resizeHandle: null,
    dragOffset: { x: 0, y: 0 },
    isPanning: false,
    lastPanPoint: { x: 0, y: 0 }
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const drawGrid = useCallback(() => {
    if (!showGrid || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    const scaledGridSize = gridSize * zoom;
    const startX = (-panOffset.x % scaledGridSize);
    const startY = (-panOffset.y % scaledGridSize);

    for (let x = startX; x < canvas.width; x += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = startY; y < canvas.height; y += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [showGrid, gridSize, zoom, panOffset]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const screenToCanvas = useCallback((screenX, screenY) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (screenX - rect.left - panOffset.x) / zoom,
      y: (screenY - rect.top - panOffset.y) / zoom
    };
  }, [zoom, panOffset]);

  const canvasToScreen = useCallback((canvasX, canvasY) => {
    return {
      x: canvasX * zoom + panOffset.x,
      y: canvasY * zoom + panOffset.y
    };
  }, [zoom, panOffset]);

  const constrainToBounds = useCallback((x, y, width, height) => {
    return {
      x: Math.max(0, Math.min(x, CANVAS_CONFIG.WIDTH - width)),
      y: Math.max(0, Math.min(y, CANVAS_CONFIG.HEIGHT - height)),
      width: Math.max(CANVAS_CONFIG.MIN_ELEMENT_SIZE, Math.min(width, CANVAS_CONFIG.WIDTH)),
      height: Math.max(CANVAS_CONFIG.MIN_ELEMENT_SIZE, Math.min(height, CANVAS_CONFIG.HEIGHT))
    };
  }, []);


  // Use custom hooks for canvas interactions
  const {
    handleElementClick,
    handleElementMouseDown,
    handleDoubleClick,
    handleMouseDown
  } = useCanvasInteractions({
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
  });

  // Use custom hooks for canvas movement and zoom
  const {
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave
  } = useCanvasMovement({
    texts,
    setTexts,
    dragState,
    setDragState,
    zoom,
    setPanOffset,
    containerRef,
    screenToCanvas,
    constrainToBounds
  });

  const {
    handleWheel,
    zoomToFit,
    resetView
  } = useCanvasZoom({
    zoom,
    setZoom,
    setPanOffset,
    containerRef,
    screenToCanvas,
    texts,
    minZoom,
    maxZoom
  });


  const renderedElements = useMemo(() => {
    return texts.map((element, index) => {
      const screenPos = canvasToScreen(element.x, element.y);
      const isSelected = selectedId === element.id;
      const isDragging = dragState.dragIndex === index;
      
      return (
        <CanvasElement
          key={`text-${element.id}`}
          element={element}
          index={index}
          screenPos={screenPos}
          zoom={zoom}
          isSelected={isSelected}
          isDragging={isDragging}
          texts={texts}
          setTexts={setTexts}
          onMouseDown={handleElementMouseDown}
          onClick={handleElementClick}
        />
      );
    });
  }, [texts, canvasToScreen, zoom, selectedId, dragState.dragIndex, handleElementMouseDown, handleElementClick, setTexts]);

  return (
    <div className={`${styles.canvasContainer} ${className || ''}`} style={style}>
      <div className={styles.canvasControls}>
        <button onClick={zoomToFit} className={styles.controlButton}>
          Fit All
        </button>
        <button onClick={resetView} className={styles.controlButton}>
          Reset View
        </button>
        <span className={styles.zoomIndicator}>
          {Math.round(zoom * 100)}%
        </span>
        <span className={styles.canvasInfo}>
          Canvas: {CANVAS_CONFIG.WIDTH} × {CANVAS_CONFIG.HEIGHT}px
        </span>
      </div>
      
      <div
        ref={containerRef}
        className={styles.canvasViewport}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{ 
          cursor: dragState.isPanning ? 'grabbing' : 
                  dragState.isDragging ? 'move' :
                  dragState.isResizing ? 'crosshair' : 'default' 
        }}
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className={styles.canvasGrid}
        />
        
        <div className={styles.canvasContent}>
          {renderedElements}
        </div>
      </div>
    </div>
  );
};

export default Canvas;

import React, { useState, useRef, useCallback } from 'react';
import css from './MediaField.module.css';

function MediaField({ 
  id, 
  mediaType, 
  mediaSrc, 
  mediaName,
  width, 
  height, 
  onDelete, 
  onResize 
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const resizeStateRef = useRef(null);

  // Handle media load
  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Handle media error
  const handleMediaError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Modern RTF-style resize handler
  const createResizeHandler = useCallback((direction) => {
    return (e) => {
      e.stopPropagation();
      setIsResizing(true);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;
      
      resizeStateRef.current = {
        startX,
        startY,
        startWidth,
        startHeight,
        direction,
        lastUpdate: 0
      };

      const handleMouseMove = (e) => {
        const now = Date.now();
        const state = resizeStateRef.current;
        
        if (now - state.lastUpdate < 16) return;
        state.lastUpdate = now;
        
        let newWidth = state.startWidth;
        let newHeight = state.startHeight;
        
        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;

        // Maintain aspect ratio for images
        const aspectRatio = state.startWidth / state.startHeight;

        switch (state.direction) {
          case 'top':
            newHeight = Math.max(100, state.startHeight - deltaY);
            if (mediaType === 'image') {
              newWidth = newHeight * aspectRatio;
            }
            break;
          case 'bottom':
            newHeight = Math.max(100, state.startHeight + deltaY);
            if (mediaType === 'image') {
              newWidth = newHeight * aspectRatio;
            }
            break;
          case 'left':
            newWidth = Math.max(100, state.startWidth - deltaX);
            if (mediaType === 'image') {
              newHeight = newWidth / aspectRatio;
            }
            break;
          case 'right':
            newWidth = Math.max(100, state.startWidth + deltaX);
            if (mediaType === 'image') {
              newHeight = newWidth / aspectRatio;
            }
            break;
          case 'top-left':
          case 'top-right':
          case 'bottom-left':
          case 'bottom-right':
            // Corner resize - maintain aspect ratio
            if (mediaType === 'image') {
              const newSize = Math.max(100, Math.min(
                state.startWidth + (direction.includes('right') ? deltaX : -deltaX),
                (state.startHeight + (direction.includes('bottom') ? deltaY : -deltaY)) * aspectRatio
              ));
              newWidth = newSize;
              newHeight = newSize / aspectRatio;
            } else {
              newWidth = Math.max(100, state.startWidth + (direction.includes('right') ? deltaX : -deltaX));
              newHeight = Math.max(100, state.startHeight + (direction.includes('bottom') ? deltaY : -deltaY));
            }
            break;
        }

        if (newWidth !== width || newHeight !== height) {
          onResize(id, Math.round(newWidth), Math.round(newHeight));
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeStateRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = e.target.style.cursor;
      document.body.style.userSelect = 'none';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
  }, [id, width, height, onResize, mediaType]);

  // Handle drag start/stop
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragStop = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle delete
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(id);
  }, [id, onDelete]);

  // Render media content
  const renderMediaContent = () => {
    if (isLoading) {
      return (
        <div className={css.loadingState}>
          <div className={css.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className={css.errorState}>
          <div className={css.errorIcon}>⚠</div>
          <span>Failed to load {mediaType}</span>
          <button className={css.retryButton} onClick={() => {
            setHasError(false);
            setIsLoading(true);
          }}>
            Retry
          </button>
        </div>
      );
    }

    switch (mediaType) {
      case 'image':
        return (
          <img
            src={mediaSrc}
            alt={mediaName || 'Image'}
            className={css.mediaImage}
            onLoad={handleMediaLoad}
            onError={handleMediaError}
            draggable={false}
          />
        );
      case 'pdf':
        return (
          <div className={css.pdfContainer}>
            <div className={css.pdfIcon}>📄</div>
            <div className={css.pdfInfo}>
              <div className={css.pdfName}>{mediaName || 'Document.pdf'}</div>
              <div className={css.pdfActions}>
                <button className={css.pdfButton} onClick={() => window.open(mediaSrc, '_blank')}>
                  Open
                </button>
                <button className={css.pdfButton} onClick={() => {
                  const link = document.createElement('a');
                  link.href = mediaSrc;
                  link.download = mediaName || 'document.pdf';
                  link.click();
                }}>
                  Download
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={css.unknownType}>
            <div className={css.unknownIcon}>📎</div>
            <span>Unknown media type</span>
          </div>
        );
    }
  };

  return (
    <div 
      className={`${css.mediaField} ${isResizing ? css.resizing : ''} ${isDragging ? css.dragging : ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Drag areas - only on border edges */}
      <div 
        className={`${css.dragBorderTop} drag-handle`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragStop}
      />
      <div 
        className={`${css.dragBorderBottom} drag-handle`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragStop}
      />
      <div 
        className={`${css.dragBorderLeft} drag-handle`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragStop}
      />
      <div 
        className={`${css.dragBorderRight} drag-handle`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragStop}
      />

      {/* Media content */}
      <div className={css.mediaContent}>
        {renderMediaContent()}
      </div>

      {/* Media info overlay */}
      <div className={css.mediaOverlay}>
        <div className={css.mediaInfo}>
          <span className={css.mediaType}>{mediaType.toUpperCase()}</span>
          {mediaName && <span className={css.mediaName}>{mediaName}</span>}
        </div>
        <button className={css.deleteButton} onClick={handleDelete} title="Delete media">
          ×
        </button>
      </div>

      {/* Modern RTF-style resize handles */}
      <div className={css.resizeHandles}>
        {/* Corner handles */}
        <div className={`${css.resizeHandle} ${css.resizeTopLeft}`} onMouseDown={createResizeHandler('top-left')} />
        <div className={`${css.resizeHandle} ${css.resizeTopRight}`} onMouseDown={createResizeHandler('top-right')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomLeft}`} onMouseDown={createResizeHandler('bottom-left')} />
        <div className={`${css.resizeHandle} ${css.resizeBottomRight}`} onMouseDown={createResizeHandler('bottom-right')} />
        
        {/* Edge handles */}
        <div className={`${css.resizeHandle} ${css.resizeTop}`} onMouseDown={createResizeHandler('top')} />
        <div className={`${css.resizeHandle} ${css.resizeBottom}`} onMouseDown={createResizeHandler('bottom')} />
        <div className={`${css.resizeHandle} ${css.resizeLeft}`} onMouseDown={createResizeHandler('left')} />
        <div className={`${css.resizeHandle} ${css.resizeRight}`} onMouseDown={createResizeHandler('right')} />
      </div>
    </div>
  );
}

export default MediaField;
